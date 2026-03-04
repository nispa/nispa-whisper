import os
from faster_whisper import WhisperModel
import torch

class WhisperInference:
    def __init__(self, model_name="medium", device="cuda", compute_type="float16", log_callback=None):
        """
        model_name: tiny, base, small, medium, large-v3
        device: cuda, cpu
        compute_type: float32 (CPU), float16 (GPU), int8 (quantized)
        """
        self.model_name = model_name
        self.device = device
        self.compute_type = compute_type
        self.log_callback = log_callback
        
        def log(msg):
            print(msg)
            if self.log_callback:
                self.log_callback(msg)
        
        # Load the model in the local data/models folder for portability
        model_dir = os.path.join(os.path.dirname(__file__), '../../data/models')
        os.makedirs(model_dir, exist_ok=True)
        
        log(f"Loading {model_name} model on {device} with {compute_type}...")
        self.model = WhisperModel(
            model_name, 
            device=device, 
            compute_type=compute_type,
            download_root=model_dir
        )
        log("Model loaded successfully.")

    def transcribe(self, audio_file, language=None, diarization=False, progress_callback=None, log_callback=None):
        """
        Executes transcription. Advanced diarization is disabled in this version 
        to keep the app 100% offline without HuggingFace dependencies.
        """
        def log(msg):
            print(msg)
            if log_callback:
                log_callback(msg)
            elif self.log_callback:
                self.log_callback(msg)
                
        log(f"Starting transcription of {audio_file}...")
        
        # Transcription with faster-whisper
        segments_generator, info = self.model.transcribe(
            audio_file, 
            language=language,
            beam_size=5,
            vad_filter=True # Use VAD to ignore silence
        )
        
        segments = []
        full_text = []
        
        # Iterate over generator to get segments
        for i, segment in enumerate(segments_generator):
            seg_dict = {
                'id': str(i),
                'start': segment.start,
                'end': segment.end,
                'text': segment.text.strip(),
                'confidence': segment.avg_logprob, # Not exactly confidence but a proxy
                'speaker': 'Speaker 1' # Default, without external diarization
            }
            segments.append(seg_dict)
            full_text.append(segment.text.strip())
            # print(f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}")
            
            if progress_callback and info.duration > 0:
                # Calculate progress based on audio duration (from 30% to 95%)
                progress = 0.3 + (segment.end / info.duration) * 0.65
                progress_callback(min(progress, 0.95), list(segments))

        if diarization:
            log("NOTE: Advanced Speaker Diarization (pyannote) has been disabled to keep the app 100% offline.")
            log("All segments will be assigned to 'Speaker 1'.")

        return {
            'text': ' '.join(full_text) if full_text else "",
            'segments': segments if segments else [],
            'language': getattr(info, 'language', 'unknown'),
            'language_probability': getattr(info, 'language_probability', 0.0)
        }

