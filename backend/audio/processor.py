import subprocess
import os

def prepare_audio(video_file, output_wav, normalize=False):
    """
    Extracts audio from video and resamples it to 16kHz (Whisper requirement).
    Optionally applies dynamic audio normalization if `normalize` is True.
    Uses FFmpeg via subprocess.
    """
    print(f"Preparing audio from {video_file} to {output_wav} (normalize={normalize})...")
    
    # Ensure ffmpeg is in PATH or specify the absolute path
    cmd = [
        'ffmpeg',
        '-y', # Overwrite file if exists
        '-i', video_file,
        '-acodec', 'pcm_s16le',
        '-ar', '16000', # 16kHz resample (Whisper requirement)
        '-ac', '1' # Mono
    ]
    
    if normalize:
        # dynaudnorm equalizza i volumi parlati troppo bassi etc.
        cmd.extend(['-af', 'dynaudnorm'])
        
    cmd.append(output_wav)
    
    try:
        subprocess.run(cmd, check=True, capture_output=True)
        print("Audio extraction completed.")
    except subprocess.CalledProcessError as e:
        print(f"FFmpeg Error: {e.stderr.decode()}")
        raise RuntimeError("Unable to extract audio from the provided file. Ensure FFmpeg is installed.")

def generate_preview_audio(video_file, output_wav, normalize=False):
    """
    Extracts the first 30 seconds of audio for preview purposes.
    """
    cmd = [
        'ffmpeg',
        '-y',
        '-t', '30', # only process the first 30 seconds
        '-i', video_file,
        '-acodec', 'pcm_s16le',
        '-ar', '16000',
        '-ac', '1'
    ]
    
    if normalize:
        cmd.extend(['-af', 'dynaudnorm'])
        
    cmd.append(output_wav)
    
    try:
        subprocess.run(cmd, check=True, capture_output=True)
    except subprocess.CalledProcessError as e:
        print(f"FFmpeg Preview Error: {e.stderr.decode()}")
        raise RuntimeError("Unable to generate audio preview.")
