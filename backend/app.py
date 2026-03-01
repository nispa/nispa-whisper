import os
import uuid
import threading
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
from werkzeug.utils import secure_filename

# Import modules
from gpu.cuda_check import get_gpu_info
from models.whisper_wrapper import WhisperInference
from audio.processor import prepare_audio
from transcribe.export import generate_srt, generate_json, generate_vtt, generate_txt, generate_csv, generate_mcp
from database import init_db, create_project, update_project_status, save_segments, get_project, get_projects, get_segments, delete_project, clear_all_data

app = Flask(__name__)
CORS(app) # Abilita CORS per permettere a React (Electron) di comunicare con Flask

# Configurazione base
UPLOAD_FOLDER = os.path.join(os.path.dirname(__file__), '../data/cache')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Inizializza il database
init_db()

# Dizionario in-memory per tracciare lo stato dei job (MVP)
# Manteniamo questo per il progress in tempo reale, ma salviamo su DB alla fine
jobs = {}

# Inizializza il wrapper di Whisper (lazy loading per risparmiare VRAM all'avvio)
whisper_engine = None

def get_whisper_engine(model_name="medium", compute_type="float16"):
    global whisper_engine
    if whisper_engine is None or whisper_engine.model_name != model_name:
        gpu_info = get_gpu_info()
        device = "cuda" if gpu_info['available'] else "cpu"
        whisper_engine = WhisperInference(model_name=model_name, device=device, compute_type=compute_type)
    return whisper_engine

def process_transcription(job_id, file_path, model_name, language, diarization):
    """Funzione eseguita in background per la trascrizione"""
    try:
        jobs[job_id]['status'] = 'running'
        jobs[job_id]['progress'] = 0.1
        update_project_status(job_id, 'running', 0.1)
        
        # 1. Prepara l'audio (FFmpeg: estrazione e resample a 16kHz)
        wav_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{job_id}.wav")
        prepare_audio(file_path, wav_path)
        jobs[job_id]['progress'] = 0.2
        update_project_status(job_id, 'running', 0.2)
        
        # 2. Carica il modello
        engine = get_whisper_engine(model_name=model_name)
        jobs[job_id]['progress'] = 0.3
        update_project_status(job_id, 'running', 0.3)
        
        # 3. Trascrizione (e diarization se richiesta)
        lang_param = None if language == 'auto' else language
        
        def update_progress(p, current_segments):
            jobs[job_id]['progress'] = p
            jobs[job_id]['segments'] = current_segments
            
        result = engine.transcribe(
            wav_path, 
            language=lang_param, 
            diarization=diarization,
            progress_callback=update_progress
        )
        
        jobs[job_id]['progress'] = 1.0
        jobs[job_id]['status'] = 'completed'
        jobs[job_id]['segments'] = result['segments']
        
        # Salva su DB
        update_project_status(job_id, 'completed', 1.0)
        save_segments(job_id, result['segments'])
        
        # Pulizia file temporanei
        if os.path.exists(wav_path):
            os.remove(wav_path)
            
    except Exception as e:
        jobs[job_id]['status'] = 'failed'
        jobs[job_id]['error'] = str(e)
        update_project_status(job_id, 'failed', error=str(e))

@app.route('/api/system/status', methods=['GET'])
def system_status():
    """Ritorna lo stato del sistema (GPU, VRAM, Disco)"""
    import shutil
    gpu_info = get_gpu_info()
    
    # Get disk usage for the upload folder
    total, used, free = shutil.disk_usage(app.config['UPLOAD_FOLDER'])
    
    return jsonify({
        "gpu_available": gpu_info['available'],
        "gpu_name": gpu_info.get('device', 'CPU'),
        "vram_mb_total": gpu_info.get('vram_total_gb', 0) * 1024,
        "vram_mb_free": gpu_info.get('vram_free_gb', 0) * 1024,
        "disk_gb_total": round(total / (1024**3), 2),
        "disk_gb_free": round(free / (1024**3), 2),
        "queue_length": len([j for j in jobs.values() if j['status'] in ['queued', 'running']]),
        "backend_version": "1.0.0"
    })

@app.route('/api/projects', methods=['GET'])
def list_projects():
    """Ritorna la lista dei progetti salvati"""
    projects = get_projects()
    return jsonify(projects)

@app.route('/api/projects/<project_id>', methods=['GET'])
def get_project_details(project_id):
    """Ritorna i dettagli di un progetto e i suoi segmenti"""
    project = get_project(project_id)
    if not project:
        return jsonify({"error": "Progetto non trovato"}), 404
        
    segments = get_segments(project_id)
    return jsonify({
        "project": project,
        "segments": segments
    })

@app.route('/api/projects/<project_id>/media', methods=['GET'])
def get_project_media(project_id):
    """Serve il file audio/video originale"""
    project = get_project(project_id)
    if not project or not project.get('file_path'):
        return jsonify({"error": "Media non trovato"}), 404
        
    if not os.path.exists(project['file_path']):
        return jsonify({"error": "File non trovato sul disco"}), 404
        
    return send_file(project['file_path'])

@app.route('/api/projects/<project_id>', methods=['DELETE'])
def delete_project_api(project_id):
    """Elimina un progetto e il suo file media"""
    project = get_project(project_id)
    if project and project.get('file_path') and os.path.exists(project['file_path']):
        try:
            os.remove(project['file_path'])
        except:
            pass
            
    delete_project(project_id)
    if project_id in jobs:
        del jobs[project_id]
        
    return jsonify({"success": True})

import hashlib

@app.route('/api/transcribe', methods=['POST'])
def start_transcription():
    """Avvia un nuovo job di trascrizione"""
    if 'file' not in request.files:
        return jsonify({"error": "Nessun file fornito"}), 400
        
    file = request.files['file']
    model = request.form.get('model', 'medium')
    language = request.form.get('language', 'auto')
    diarization = request.form.get('diarization', 'false').lower() == 'true'
    
    if file.filename == '':
        return jsonify({"error": "Nome file vuoto"}), 400
        
    filename = secure_filename(file.filename)
    job_id = str(uuid.uuid4())
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{job_id}_{filename}")
    file.save(file_path)
    
    # Calculate file hash
    hasher = hashlib.sha256()
    with open(file_path, 'rb') as f:
        buf = f.read(65536)
        while len(buf) > 0:
            hasher.update(buf)
            buf = f.read(65536)
    file_hash = hasher.hexdigest()
    
    # Crea progetto nel DB
    create_project(job_id, filename, file_path, filename, model, language, diarization, file_hash)
    
    jobs[job_id] = {
        "id": job_id,
        "status": "queued",
        "progress": 0.0,
        "file_name": filename,
        "model": model,
        "language": language,
        "diarization": diarization
    }
    
    # Avvia il thread in background
    thread = threading.Thread(target=process_transcription, args=(job_id, file_path, model, language, diarization))
    thread.daemon = True
    thread.start()
    
    return jsonify({"job_id": job_id, "status": "queued", "estimated_time_seconds": 300}), 202

@app.route('/api/projects/<project_id>/reupload', methods=['POST'])
def reupload_media(project_id):
    """Ricarica il file media per un progetto esistente verificando l'hash"""
    project = get_project(project_id)
    if not project:
        return jsonify({"error": "Progetto non trovato"}), 404
        
    if 'file' not in request.files:
        return jsonify({"error": "Nessun file fornito"}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "Nome file vuoto"}), 400
        
    temp_path = os.path.join(app.config['UPLOAD_FOLDER'], f"temp_{uuid.uuid4()}_{secure_filename(file.filename)}")
    file.save(temp_path)
    
    hasher = hashlib.sha256()
    with open(temp_path, 'rb') as f:
        buf = f.read(65536)
        while len(buf) > 0:
            hasher.update(buf)
            buf = f.read(65536)
    new_hash = hasher.hexdigest()
    
    if project.get('file_hash') and project['file_hash'] != new_hash:
        os.remove(temp_path)
        return jsonify({"error": "Il file non corrisponde all'originale (hash diverso)"}), 400
        
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{project_id}_{secure_filename(file.filename)}")
    os.rename(temp_path, file_path)
    
    # Update file_path in DB
    conn = get_db()
    c = conn.cursor()
    c.execute('UPDATE projects SET file_path = ? WHERE id = ?', (file_path, project_id))
    conn.commit()
    conn.close()
    
    return jsonify({"success": True})

@app.route('/api/transcribe/<job_id>', methods=['GET'])
def get_transcription_status(job_id):
    """Controlla lo stato di un job"""
    # Prima controlliamo in memoria (per il progress live)
    job = jobs.get(job_id)
    
    if not job:
        # Se non è in memoria, controlliamo nel DB
        project = get_project(job_id)
        if not project:
            return jsonify({"error": "Job non trovato"}), 404
            
        response = {
            "status": project['status'],
            "progress": project['progress'],
            "segments": get_segments(job_id) if project['status'] == 'completed' else []
        }
        if project['status'] == 'failed':
            response['error'] = project.get('error', 'Errore sconosciuto')
        return jsonify(response)
        
    response = {
        "status": job['status'],
        "progress": job['progress'],
        "segments": job.get('segments', [])
    }
    
    if job['status'] == 'failed':
        response['error'] = job.get('error', 'Errore sconosciuto')
        
    return jsonify(response)

@app.route('/api/export', methods=['POST'])
def export_transcription():
    """Esporta i segmenti nel formato richiesto"""
    data = request.json
    job_id = data.get('job_id')
    format_type = data.get('format', 'srt')
    include_speakers = data.get('include_speakers', True)
    
    segments = get_segments(job_id)
    if not segments:
        return jsonify({"error": "Segmenti non trovati"}), 404
    
    if format_type == 'srt':
        content = generate_srt(segments, speaker_labels=include_speakers)
        mimetype = 'text/plain'
    elif format_type == 'vtt':
        content = generate_vtt(segments, speaker_labels=include_speakers)
        mimetype = 'text/vtt'
    elif format_type == 'txt':
        content = generate_txt(segments, speaker_labels=include_speakers)
        mimetype = 'text/plain'
    elif format_type == 'csv':
        content = generate_csv(segments, speaker_labels=include_speakers)
        mimetype = 'text/csv'
    elif format_type == 'json':
        content = generate_json(segments)
        mimetype = 'application/json'
    elif format_type == 'mcp':
        project = get_project(job_id)
        filename = project.get('name', 'transcription') if project else 'transcription'
        content = generate_mcp(segments, filename=filename)
        mimetype = 'application/json'
    else:
        return jsonify({"error": "Formato non supportato"}), 400
        
    return jsonify({"content": content, "format": format_type})

@app.route('/api/system/cache', methods=['DELETE'])
def clear_cache():
    """Svuota la cache dei file utente"""
    import shutil
    try:
        # Svuota la cartella cache
        for filename in os.listdir(app.config['UPLOAD_FOLDER']):
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            try:
                if os.path.isfile(file_path) or os.path.islink(file_path):
                    os.unlink(file_path)
                elif os.path.isdir(file_path):
                    shutil.rmtree(file_path)
            except Exception as e:
                pass
        
        # Pulisci i job in memoria (opzionale, ma se i file sono stati cancellati i job falliranno)
        # Invece di pulire i job, potremmo lasciarli fallire o pulirli
        jobs.clear()
        
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    print("Avvio del backend WhisperApp sulla porta 5000...")
    app.run(host='127.0.0.1', port=5000, debug=True)
