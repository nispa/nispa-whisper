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

    def start_job(self, job_id: str, file_path: str, model: str, language: str, diarization: bool = False, normalized: bool = False) -> None:
        self.jobs[job_id] = {"status": "queued", "progress": 0.0, "logs": [f"Job {job_id} queued for processing."]}
        thread = threading.Thread(
            target=self._process_task, 
            args=(job_id, file_path, model, language, diarization, normalized)
        )
        thread.daemon = True
        thread.start()

    def _append_log(self, job_id: str, message: str) -> None:
        if job_id in self.jobs:
            if "logs" not in self.jobs[job_id]:
                self.jobs[job_id]["logs"] = []
            self.jobs[job_id]["logs"].append(message)
            # Keep only the last 10 logs to avoid unbounded growth
            if len(self.jobs[job_id]["logs"]) > 10:
                self.jobs[job_id]["logs"] = self.jobs[job_id]["logs"][-10:]

    def _process_task(self, job_id: str, file_path: str, model: str, language: str, diarization: bool = False, normalized: bool = False) -> None:
        try:
            self._update_status(job_id, "running", 0.1)
            self._append_log(job_id, f"Job {job_id} started processing.")
            
            # 1. Audio Processing
            self._append_log(job_id, f"Extracting audio from input file (normalized={normalized})...")
            wav_path = config.UPLOAD_FOLDER / f"{job_id}.wav"
            prepare_audio(file_path, str(wav_path), normalize=normalized)
            self._append_log(job_id, f"Audio extraction completed.")
            self._update_status(job_id, "running", 0.3)
            
            # 2. Whisper Inference
            engine = self.get_engine(model)
            engine.log_callback = lambda msg: self._append_log(job_id, msg)
            
            def on_progress(progress_val, current_segments):
                self._update_status(job_id, "running", progress_val, segments=current_segments)
                # Note: To also send segments in real-time, _update_status would need to support them
                # But currently `update_project_status` only updates status & progress in DB.
                # The segments are fetched from a separate file/DB typically.
                
            result = engine.transcribe(
                str(wav_path), 
                language=None if language == 'auto' else language,
                progress_callback=on_progress,
                log_callback=lambda msg: self._append_log(job_id, msg)
            )
            segments = result.get('segments', [])
            self._append_log(job_id, f"Transcription completed. {len(segments)} segments generated.")
            
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
                self._append_log(job_id, "Temporary audio file isolated and cleaned.")
                
        except Exception as e:
            print(f"Error in job {job_id}: {str(e)}")
            self._append_log(job_id, f"ERROR: {str(e)}")
            self._update_status(job_id, "failed", 0.0, str(e))

    def _update_status(self, job_id: str, status: str, progress: float, error: Optional[str] = None, segments: Optional[List[Dict[str, Any]]] = None) -> None:
        update_dict: Dict[str, Any] = {"status": status, "progress": progress, "error": error}
        if segments is not None:
            update_dict["segments"] = segments
        self.jobs[job_id].update(update_dict)
        update_project_status(job_id, status, progress)

    def get_job_status(self, job_id: str) -> Dict[str, Any]:
        return self.jobs.get(job_id) or get_project(job_id)

transcription_service = TranscriptionService()
