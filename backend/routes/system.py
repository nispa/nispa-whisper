from flask import Blueprint, jsonify
from gpu.cuda_check import get_gpu_info
from config import config
from services.transcription_service import transcription_service
import shutil
import os

system_bp = Blueprint('system', __name__)

@system_bp.route('/status', methods=['GET'])
def get_system_status():
    gpu_info = get_gpu_info()
    total, used, free = shutil.disk_usage("/")
    
    # Mapping and conversion for frontend compatibility
    return jsonify({
        "gpu_available": gpu_info.get('available', False),
        "gpu_name": gpu_info.get('device', 'CPU Only'),
        "vram_mb_total": int(gpu_info.get('vram_total_gb', 0) * 1024),
        "vram_mb_free": int(gpu_info.get('vram_free_gb', 0) * 1024),
        "disk_gb_total": total // (2**30),
        "disk_gb_free": free // (2**30),
        "queue_length": len([j for j in transcription_service.jobs.values() if j['status'] in ['queued', 'running']])
    })

@system_bp.route('/cache', methods=['DELETE'])
def clear_cache():
    try:
        for item in config.UPLOAD_FOLDER.iterdir():
            if item.is_file(): item.unlink()
            elif item.is_dir(): shutil.rmtree(item)
        return jsonify({"success": True})
    except Exception as e:
        return jsonify({"error": str(e)}), 500
