from flask import Blueprint, jsonify, request
from werkzeug.utils import secure_filename
from config import config
from database import create_project
from services.transcription_service import transcription_service
import uuid
import hashlib
import os

transcribe_bp = Blueprint('transcribe', __name__)

@transcribe_bp.route('/', methods=['POST'])
@transcribe_bp.route('', methods=['POST'])
def start_transcription():
    if 'file' not in request.files:
        return jsonify({"error": "No file"}), 400
        
    file = request.files['file']
    model = request.form.get('model', 'medium')
    language = request.form.get('language', 'auto')
    diarization = request.form.get('diarization', 'false') == 'true'
    
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
    
    # create_project(project_id, name, file_path, file_name, model, language, diarization, file_hash)
    create_project(job_id, filename, str(file_path), filename, model, language, diarization, file_hash)
    transcription_service.start_job(job_id, str(file_path), model, language, diarization)
    
    return jsonify({"job_id": job_id, "status": "queued"}), 202

@transcribe_bp.route('/<job_id>', methods=['GET'])
def get_status(job_id):
    status = transcription_service.get_job_status(job_id)
    if not status:
        return jsonify({"error": "Not found"}), 404
    return jsonify(status)
