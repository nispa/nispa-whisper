from flask import Blueprint, jsonify, request
from database import get_project, get_segments
import traceback

# Import the generation functions
from transcribe.export import (
    generate_srt, 
    generate_vtt, 
    generate_txt, 
    generate_csv, 
    generate_json, 
    generate_mcp
)

export_bp = Blueprint('export', __name__)

@export_bp.route('', methods=['POST'])
def export_transcription():
    try:
        data = request.json
        if not data or 'job_id' not in data or 'format' not in data:
            return jsonify({"error": "Missing data (job_id, format required)"}), 400
            
        job_id = data['job_id']
        fmt = data['format'].lower()
        include_speakers = data.get('include_speakers', True)
        
        project = get_project(job_id)
        if not project:
            return jsonify({"error": "Project not found"}), 404
            
        segments = get_segments(job_id)
        if not segments:
            return jsonify({"error": "No segments found for this project"}), 404
            
        filename = project.get('file_name', f'project_{job_id}')
        
        # Generate content based on format
        match fmt:
            case 'srt':
                content = generate_srt(segments, speaker_labels=include_speakers)
            case 'vtt':
                content = generate_vtt(segments, speaker_labels=include_speakers)
            case 'txt':
                content = generate_txt(segments, speaker_labels=include_speakers)
            case 'csv':
                content = generate_csv(segments, speaker_labels=include_speakers)
            case 'json':
                content = generate_json(segments)
            case 'mcp':
                content = generate_mcp(segments, filename=filename)
            case _:
                return jsonify({"error": f"Unsupported format: {fmt}"}), 400
            
        return jsonify({"content": content})
        
    except Exception as e:
        print(f"Error during export: {e}")
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500
