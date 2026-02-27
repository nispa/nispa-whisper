import torch

def get_gpu_info():
    """Ritorna la disponibilità della GPU e le specifiche"""
    cuda_available = torch.cuda.is_available()
    
    if not cuda_available:
        return {'available': False, 'device': None}
        
    device_name = torch.cuda.get_device_name(0)
    
    # Ottieni la memoria totale e libera in GB
    try:
        vram_total = torch.cuda.get_device_properties(0).total_memory / (1024**3)
        vram_free = torch.cuda.mem_get_info()[0] / (1024**3)
    except Exception:
        vram_total = 0
        vram_free = 0
        
    return {
        'available': True,
        'device': device_name,
        'vram_total_gb': round(vram_total, 2),
        'vram_free_gb': round(vram_free, 2),
        'compute_capability': torch.cuda.get_device_capability(0)
    }

def optimize_for_whisper(model_size, vram_gb):
    """
    Seleziona il compute_type ottimale in base alla VRAM.
    RTX 4500 Ada (24GB) -> float16 (miglior bilanciamento)
    RTX 4060 (8GB) -> int8 (quantizzato, più lento ma entra in memoria)
    CPU only -> float32
    """
    if vram_gb < 4:
        return 'cpu', 'float32'
    elif vram_gb < 8:
        return 'cuda', 'int8'
    else:
        return 'cuda', 'float16'
