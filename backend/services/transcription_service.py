import threading
import uuid
from typing import Dict, Any, List, Optional
from config import config
from models.whisper_wrapper import WhisperInference
from audio.processor import prepare_audio
from database import update_project_status, save_segments, get_project, get_segments, update_project_metadata
from gpu.cuda_check import get_gpu_info

class TranscriptionService:
    def __init__(self):
        self.jobs: Dict[str, Dict[str, Any]] = {}
        self.engine: Optional[WhisperInference] = None
        self._lock = threading.Lock()

    def get_engine(self, model_name: str = "medium") -> WhisperInference:
        with self._lock:
            if self.engine is None or self.engine.model_name != model_name:
                gpu_info = get_gpu_info()
                device = "cuda" if gpu_info['available'] else "cpu"
                self.engine = WhisperInference(model_name=model_name, device=device)
            return self.engine

    def start_job(self, job_id: str, file_path: str, model: str, language: str, diarization: bool = False) -> None:
        self.jobs[job_id] = {"status": "queued", "progress": 0.0}
        thread = threading.Thread(
            target=self._process_task, 
            args=(job_id, file_path, model, language, diarization)
        )
        thread.daemon = True
        thread.start()

    def _process_task(self, job_id: str, file_path: str, model: str, language: str, diarization: bool = False) -> None:
        try:
            self._update_status(job_id, "running", 0.1)
            
            # 1. Audio Processing
            wav_path = config.UPLOAD_FOLDER / f"{job_id}.wav"
            prepare_audio(file_path, str(wav_path))
            self._update_status(job_id, "running", 0.3)
            
            # 2. Whisper Inference
            engine = self.get_engine(model)
            result = engine.transcribe(str(wav_path), language=None if language == 'auto' else language)
            segments = result.get('segments', [])
            
            # Save Metadata
            update_project_metadata(
                job_id, 
                result.get('language'), 
                result.get('language_probability'), 
                result.get('text')
            )
            
            self._update_status(job_id, "running", 0.9)
            
            # 3. Save Results
            save_segments(job_id, segments)
            self._update_status(job_id, "completed", 1.0)
            
            # Cleanup
            if wav_path.exists():
                wav_path.unlink()
                
        except Exception as e:
            print(f"Error in job {job_id}: {str(e)}")
            self._update_status(job_id, "failed", 0.0, str(e))

    def _update_status(self, job_id: str, status: str, progress: float, error: str = None) -> None:
        self.jobs[job_id].update({"status": status, "progress": progress, "error": error})
        update_project_status(job_id, status, progress)

    def get_job_status(self, job_id: str) -> Dict[str, Any]:
        return self.jobs.get(job_id) or get_project(job_id)

transcription_service = TranscriptionService()
