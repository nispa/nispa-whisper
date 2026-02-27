import subprocess
import os

def prepare_audio(video_file, output_wav):
    """
    Estrae l'audio dal video e lo ricampiona a 16kHz (requisito di Whisper).
    Usa FFmpeg tramite subprocess.
    """
    print(f"Preparazione audio da {video_file} a {output_wav}...")
    
    # Assicurati che ffmpeg sia nel PATH o specifica il percorso assoluto
    cmd = [
        'ffmpeg',
        '-y', # Sovrascrive il file se esiste
        '-i', video_file,
        '-acodec', 'pcm_s16le',
        '-ar', '16000', # 16kHz resample (Whisper requirement)
        '-ac', '1', # Mono
        output_wav
    ]
    
    try:
        subprocess.run(cmd, check=True, capture_output=True)
        print("Estrazione audio completata.")
    except subprocess.CalledProcessError as e:
        print(f"Errore FFmpeg: {e.stderr.decode()}")
        raise RuntimeError("Impossibile estrarre l'audio dal file fornito. Assicurati che FFmpeg sia installato.")
