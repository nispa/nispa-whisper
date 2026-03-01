import json
import csv
import io

def format_timecode(ms, mode='standard'):
    """Converte millisecondi in formato HH:MM:SS,mmm o SMPTE"""
    if mode == 'smpte':
        # SMPTE: HH:MM:SS:FF (frame, richiede framerate)
        # Implementazione base, assumendo 25fps
        ms = int(ms)
        h = (ms // 3_600_000)
        m = (ms % 3_600_000) // 60_000
        s = (ms % 60_000) // 1_000
        frames = int((ms % 1_000) / 40) # 1000ms / 25fps = 40ms per frame
        return f"{h:02d}:{m:02d}:{s:02d}:{frames:02d}"
    elif mode == 'vtt':
        # VTT: HH:MM:SS.mmm
        ms = int(ms)
        h = (ms // 3_600_000)
        m = (ms % 3_600_000) // 60_000
        s = (ms % 60_000) // 1_000
        ms_rem = ms % 1_000
        return f"{h:02d}:{m:02d}:{s:02d}.{ms_rem:03d}"
    else:
        # Standard (SRT): HH:MM:SS,mmm
        ms = int(ms)
        h = (ms // 3_600_000)
        m = (ms % 3_600_000) // 60_000
        s = (ms % 60_000) // 1_000
        ms_rem = ms % 1_000
        return f"{h:02d}:{m:02d}:{s:02d},{ms_rem:03d}"

def generate_srt(segments, speaker_labels=True, timecode_mode='standard'):
    """Genera il file SRT (SubRip)"""
    lines = []
    
    for idx, seg in enumerate(segments, 1):
        start_ms = int(seg['start'] * 1000)
        end_ms = int(seg['end'] * 1000)
        
        start_time = format_timecode(start_ms, timecode_mode)
        end_time = format_timecode(end_ms, timecode_mode)
        
        speaker_prefix = f"[{seg.get('speaker', 'Speaker 1')}]: " if speaker_labels and seg.get('speaker') else ""
        text = f"{speaker_prefix}{seg['text'].strip()}"
        
        lines.append(f"{idx}\n{start_time} --> {end_time}\n{text}\n")
        
    return "\n".join(lines)

def generate_vtt(segments, speaker_labels=True):
    """Genera il file WebVTT"""
    lines = ["WEBVTT\n"]
    
    for idx, seg in enumerate(segments, 1):
        start_ms = int(seg['start'] * 1000)
        end_ms = int(seg['end'] * 1000)
        
        start_time = format_timecode(start_ms, 'vtt')
        end_time = format_timecode(end_ms, 'vtt')
        
        speaker_prefix = f"<{seg.get('speaker', 'Speaker 1')}> " if speaker_labels and seg.get('speaker') else ""
        text = f"{speaker_prefix}{seg['text'].strip()}"
        
        lines.append(f"{start_time} --> {end_time}\n{text}\n")
        
    return "\n".join(lines)

def generate_txt(segments, speaker_labels=True):
    """Genera un file di testo semplice"""
    lines = []
    current_speaker = None
    
    for seg in segments:
        speaker = seg.get('speaker', 'Speaker 1')
        text = seg['text'].strip()
        
        if speaker_labels and speaker != current_speaker:
            lines.append(f"\n[{speaker}]:")
            current_speaker = speaker
            
        lines.append(text)
        
    return "\n".join(lines).strip()

def generate_csv(segments, speaker_labels=True):
    """Genera un file CSV"""
    output = io.StringIO()
    writer = csv.writer(output)
    
    if speaker_labels:
        writer.writerow(['Start', 'End', 'Speaker', 'Text'])
    else:
        writer.writerow(['Start', 'End', 'Text'])
        
    for seg in segments:
        start_time = format_timecode(int(seg['start'] * 1000), 'vtt')
        end_time = format_timecode(int(seg['end'] * 1000), 'vtt')
        text = seg['text'].strip()
        
        if speaker_labels:
            speaker = seg.get('speaker', 'Speaker 1')
            writer.writerow([start_time, end_time, speaker, text])
        else:
            writer.writerow([start_time, end_time, text])
            
    return output.getvalue()

def generate_json(segments):
    """Genera un output JSON strutturato"""
    return json.dumps({"segments": segments}, indent=2, ensure_ascii=False)

def generate_mcp(segments, filename=""):
    """Genera un output in formato MCP (Model Context Protocol) per servizi AI"""
    full_text = " ".join([seg['text'].strip() for seg in segments])
    
    return json.dumps({
        "mcp_version": "1.0",
        "metadata": {
            "source": filename,
            "type": "transcription",
            "segments_count": len(segments),
            "total_characters": len(full_text)
        },
        "text": full_text
    }, indent=2, ensure_ascii=False)
