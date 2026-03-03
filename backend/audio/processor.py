import subprocess
import os

def prepare_audio(video_file, output_wav):
    """
    Extracts audio from video and resamples it to 16kHz (Whisper requirement).
    Uses FFmpeg via subprocess.
    """
    print(f"Preparing audio from {video_file} to {output_wav}...")
    
    # Ensure ffmpeg is in PATH or specify the absolute path
    cmd = [
        'ffmpeg',
        '-y', # Overwrite file if exists
        '-i', video_file,
        '-acodec', 'pcm_s16le',
        '-ar', '16000', # 16kHz resample (Whisper requirement)
        '-ac', '1', # Mono
        output_wav
    ]
    
    try:
        subprocess.run(cmd, check=True, capture_output=True)
        print("Audio extraction completed.")
    except subprocess.CalledProcessError as e:
        print(f"FFmpeg Error: {e.stderr.decode()}")
        raise RuntimeError("Unable to extract audio from the provided file. Ensure FFmpeg is installed.")
