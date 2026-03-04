from flask import Blueprint, jsonify, request, send_file
from werkzeug.utils import secure_filename
from config import config
from database import create_project
from services.transcription_service import transcription_service
import uuid
import hashlib
import os

from audio.processor import generate_preview_audio

transcribe_bp = Blueprint('transcribe', __name__)

@transcribe_bp.route('/preview', methods=['POST'])
def generate_preview():
    if 'file' not in request.files:
        return jsonify({"error": "No file"}), 400
        
    file = request.files['file']
    normalize = request.form.get('normalize', 'false') == 'true'
    
    filename = secure_filename(file.filename)
    preview_id = str(uuid.uuid4())
    upload_path = config.UPLOAD_FOLDER / f"preview_in_{preview_id}_{filename}"
    output_path = config.UPLOAD_FOLDER / f"preview_out_{preview_id}.wav"
    
    file.save(str(upload_path))
    
    try:
        generate_preview_audio(str(upload_path), str(output_path), normalize)
        return send_file(
            str(output_path),
            mimetype="audio/wav",
            as_attachment=True,
            download_name="preview.wav"
        )
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    finally:
        if upload_path.exists():
            upload_path.unlink()
        # Non eliminiamo output_path qui subito, send_file potrebbe fallire. 
        # In Flask in genere usiamo "after_request" o un background task per pulire, 
        # ma possiamo lasciarlo e pulire con uno script cron (cartella UPLOADS).

@transcribe_bp.route('/', methods=['POST'])
@transcribe_bp.route('', methods=['POST'])
def start_transcription():
    if 'file' not in request.files:
        return jsonify({"error": "No file"}), 400
        
    file = request.files['file']
    model = request.form.get('model', 'medium')
    language = request.form.get('language', 'auto')
    diarization = request.form.get('diarization', 'false') == 'true'
    normalized = request.form.get('normalize', 'false') == 'true'
    
    job_id = str(uuid.uuid4())
    filename = secure_filename(file.filename)
    file_path = config.UPLOAD_FOLDER / f"{job_id}_{filename}"
    file.save(str(file_path))
    
    # Hash
    hasher = hashlib.sha256()
    with open(file_path, 'rb') as f:
        for chunk in iter(lambda: f.read(65536), b""):
            hasher.update(chunk)
    file_hash = hasher.hexdigest()
    
    create_project(job_id, filename, str(file_path), filename, model, language, diarization, file_hash, normalized)
    transcription_service.start_job(job_id, str(file_path), model, language, diarization, normalized)
    
    return jsonify({"job_id": job_id, "status": "queued"}), 202

@transcribe_bp.route('/<job_id>', methods=['GET'])
def get_status(job_id):
    status = transcription_service.get_job_status(job_id)
    if not status:
        return jsonify({"error": "Not found"}), 404
    return jsonify(status)
