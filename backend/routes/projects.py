from flask import Blueprint, jsonify, request, send_file
from database import get_projects, get_project, get_segments, delete_project, save_segments, update_project_file
import os
import hashlib
from werkzeug.utils import secure_filename
from config import config

projects_bp = Blueprint('projects', __name__)

@projects_bp.route('', methods=['GET'])
def list_projects():
    return jsonify(get_projects())

@projects_bp.route('/<project_id>', methods=['GET'])
def project_details(project_id):
    project = get_project(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404
    
    segments = get_segments(project_id)
    return jsonify({**project, "segments": segments})

@projects_bp.route('/<project_id>', methods=['DELETE'])
def remove_project(project_id):
    if delete_project(project_id):
        return jsonify({"success": True})
    return jsonify({"error": "Failed to delete project"}), 400

@projects_bp.route('/<project_id>/media', methods=['GET'])
def get_media(project_id):
    project = get_project(project_id)
    if not project or not project.get('file_path'):
        return jsonify({"error": "File not found"}), 404
    return send_file(project['file_path'])

@projects_bp.route('/<project_id>/segments', methods=['POST'])
def update_segments(project_id):
    data = request.json
    if not data or 'segments' not in data:
        return jsonify({"error": "Missing data"}), 400
    
    save_segments(project_id, data['segments'])
    return jsonify({"success": True})

@projects_bp.route('/<project_id>/reupload', methods=['POST'])
def reupload_media(project_id):
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400
        
    project = get_project(project_id)
    if not project:
        return jsonify({"error": "Project not found"}), 404
        
    file = request.files['file']
    filename = secure_filename(file.filename)
    file_path = config.UPLOAD_FOLDER / f"{project_id}_{filename}"
    file.save(str(file_path))
    
    # Calcola l'hash
    hasher = hashlib.sha256()
    with open(file_path, 'rb') as f:
        for chunk in iter(lambda: f.read(65536), b""):
            hasher.update(chunk)
    file_hash = hasher.hexdigest()
    
    update_project_file(project_id, str(file_path), filename, file_hash)
    
    return jsonify({
        "success": True, 
        "file_name": filename,
        "file_hash": file_hash
    })
