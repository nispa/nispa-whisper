import os
from faster_whisper import WhisperModel
import torch

class WhisperInference:
    def __init__(self, model_name="medium", device="cuda", compute_type="float16"):
        """
        model_name: tiny, base, small, medium, large-v3
        device: cuda, cpu
        compute_type: float32 (CPU), float16 (GPU), int8 (quantized)
        """
        self.model_name = model_name
        self.device = device
        self.compute_type = compute_type
        
        # Carica il modello nella cartella locale data/models per portabilità
        model_dir = os.path.join(os.path.dirname(__file__), '../../data/models')
        os.makedirs(model_dir, exist_ok=True)
        
        print(f"Caricamento modello {model_name} su {device} con {compute_type}...")
        self.model = WhisperModel(
            model_name, 
            device=device, 
            compute_type=compute_type,
            download_root=model_dir
        )
        print("Modello caricato con successo.")

    def transcribe(self, audio_file, language=None, diarization=False, progress_callback=None):
        """
        Esegue la trascrizione. La diarization avanzata è disabilitata in questa versione 
        per mantenere l'app 100% offline senza dipendenze da HuggingFace.
        """
        print(f"Inizio trascrizione di {audio_file}...")
        
        # Trascrizione con faster-whisper
        segments_generator, info = self.model.transcribe(
            audio_file, 
            language=language,
            beam_size=5,
            vad_filter=True # Usa VAD per ignorare i silenzi
        )
        
        segments = []
        full_text = []
        
        # Itera sul generatore per ottenere i segmenti
        for i, segment in enumerate(segments_generator):
            seg_dict = {
                'id': str(i),
                'start': segment.start,
                'end': segment.end,
                'text': segment.text.strip(),
                'confidence': segment.avg_logprob, # Non è esattamente la confidenza ma un proxy
                'speaker': 'Speaker 1' # Default, senza diarization esterna
            }
            segments.append(seg_dict)
            full_text.append(segment.text.strip())
            print(f"[{segment.start:.2f}s -> {segment.end:.2f}s] {segment.text}")
            
            if progress_callback and info.duration > 0:
                # Calculate progress based on audio duration (from 30% to 95%)
                progress = 0.3 + (segment.end / info.duration) * 0.65
                progress_callback(min(progress, 0.95), list(segments))

        if diarization:
            print("NOTA: Speaker Diarization avanzata (pyannote) è stata disabilitata per mantenere l'app 100% offline.")
            print("Tutti i segmenti verranno assegnati a 'Speaker 1'.")

        return {
            'text': ' '.join(full_text),
            'segments': segments,
            'language': info.language,
            'language_probability': info.language_probability
        }

