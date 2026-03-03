import torch

def get_gpu_info():
    """Returns GPU availability and specs"""
    cuda_available = torch.cuda.is_available()
    
    if not cuda_available:
        return {'available': False, 'device': None}
        
    device_name = torch.cuda.get_device_name(0)
    
    # Get total and free memory in GB
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
    if vram_gb < 4:
        return 'cpu', 'float32'
    elif vram_gb < 8:
        return 'cuda', 'int8'
    else:
        return 'cuda', 'float16'
