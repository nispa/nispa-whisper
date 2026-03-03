import os
from pathlib import Path

class Config:
    # Percorsi base usando pathlib (più moderno di os.path)
    BASE_DIR = Path(__file__).resolve().parent
    DATA_DIR = BASE_DIR.parent / "data"
    UPLOAD_FOLDER = DATA_DIR / "cache"
    DB_PATH = DATA_DIR / "database.db"
    
    # Flask Settings
    DEBUG = True
    PORT = 5000
    HOST = "127.0.0.1"
    
    # Assicurati che le cartelle esistano
    UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)

config = Config()
