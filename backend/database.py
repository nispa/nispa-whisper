import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), '../data/whisperapp.db')

def get_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH, timeout=30)
    conn.execute('PRAGMA journal_mode=WAL') # Enable Write-Ahead Logging
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS projects (
            id TEXT PRIMARY KEY,
            name TEXT,
            created_at TEXT,
            status TEXT,
            file_path TEXT,
            file_name TEXT,
            model TEXT,
            language TEXT,
            detected_language TEXT,
            language_probability REAL,
            full_text TEXT,
            diarization BOOLEAN,
            progress REAL,
            error TEXT,
            file_hash TEXT,
            normalized BOOLEAN DEFAULT 0
        )
    ''')
    
    # Migration for existing databases
    columns = [row[1] for row in c.execute('PRAGMA table_info(projects)')]
    if 'detected_language' not in columns:
        c.execute('ALTER TABLE projects ADD COLUMN detected_language TEXT')
    if 'language_probability' not in columns:
        c.execute('ALTER TABLE projects ADD COLUMN language_probability REAL')
    if 'full_text' not in columns:
        c.execute('ALTER TABLE projects ADD COLUMN full_text TEXT')
    if 'file_hash' not in columns:
        c.execute('ALTER TABLE projects ADD COLUMN file_hash TEXT')
    if 'normalized' not in columns:
        c.execute('ALTER TABLE projects ADD COLUMN normalized BOOLEAN DEFAULT 0')
        
    c.execute('''
        CREATE TABLE IF NOT EXISTS segments (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            project_id TEXT,
            start REAL,
            end REAL,
            text TEXT,
            speaker TEXT,
            FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
        )
    ''')
    conn.commit()
    conn.close()

def create_project(project_id, name, file_path, file_name, model, language, diarization=False, file_hash=None, normalized=False):
    conn = get_db()
    c = conn.cursor()
    c.execute('''
        INSERT INTO projects (id, name, created_at, status, file_path, file_name, model, language, diarization, progress, file_hash, normalized)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (project_id, name, datetime.now().isoformat(), 'queued', file_path, file_name, model, language, diarization, 0.0, file_hash, normalized))
    conn.commit()
    conn.close()

def update_project_metadata(project_id, detected_language, language_probability, full_text):
    conn = get_db()
    c = conn.cursor()
    c.execute('''
        UPDATE projects 
        SET detected_language = ?, language_probability = ?, full_text = ? 
        WHERE id = ?
    ''', (detected_language, language_probability, full_text, project_id))
    conn.commit()
    conn.close()

def update_project_status(project_id, status, progress=None, error=None):
    conn = get_db()
    c = conn.cursor()
    if progress is not None:
        c.execute('UPDATE projects SET status = ?, progress = ? WHERE id = ?', (status, progress, project_id))
    elif error is not None:
        c.execute('UPDATE projects SET status = ?, error = ? WHERE id = ?', (status, error, project_id))
    else:
        c.execute('UPDATE projects SET status = ? WHERE id = ?', (status, project_id))
    conn.commit()
    conn.close()

def save_segments(project_id, segments):
    if not isinstance(segments, list):
        print(f"Error: segments is not a list, it is {type(segments)}")
        return

    conn = get_db()
    try:
        c = conn.cursor()
        c.execute('DELETE FROM segments WHERE project_id = ?', (project_id,))
        for seg in segments:
            # Protection: if seg is a string (rare but possible error), transform it into a dict
            if isinstance(seg, str):
                seg = {'text': seg, 'start': 0, 'end': 0, 'speaker': 'Unknown'}
            
            c.execute('''
                INSERT INTO segments (project_id, start, end, text, speaker)
                VALUES (?, ?, ?, ?, ?)
            ''', (project_id, seg.get('start', 0), seg.get('end', 0), seg.get('text', ''), seg.get('speaker', '')))
        conn.commit()
    except Exception as e:
        print(f"Error during save_segments: {e}")
        conn.rollback()
    finally:
        conn.close()

def get_project(project_id):
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM projects WHERE id = ?', (project_id,))
    row = c.fetchone()
    conn.close()
    return dict(row) if row else None

def get_projects():
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM projects ORDER BY created_at DESC')
    rows = c.fetchall()
    conn.close()
    return [dict(row) for row in rows]

def get_segments(project_id):
    conn = get_db()
    c = conn.cursor()
    c.execute('SELECT * FROM segments WHERE project_id = ? ORDER BY start ASC', (project_id,))
    rows = c.fetchall()
    conn.close()
    # Ensure id is returned as string for frontend compatibility if needed, but frontend expects string id for segment
    # Actually frontend expects segment id to be string or number, let's map it to string
    result = []
    for row in rows:
        d = dict(row)
        d['id'] = str(d['id'])
        result.append(d)
    return result

def update_project_file(project_id, file_path, file_name, file_hash=None):
    conn = get_db()
    c = conn.cursor()
    c.execute('''
        UPDATE projects 
        SET file_path = ?, file_name = ?, file_hash = ? 
        WHERE id = ?
    ''', (file_path, file_name, file_hash, project_id))
    conn.commit()
    conn.close()

def delete_project(project_id):
    conn = get_db()
    c = conn.cursor()
    
    # Retrieve file path before deleting the project
    c.execute('SELECT file_path FROM projects WHERE id = ?', (project_id,))
    row = c.fetchone()
    if row and row['file_path'] and os.path.exists(row['file_path']):
        try:
            os.remove(row['file_path'])
        except Exception as e:
            print(f"Error during file deletion {row['file_path']}: {e}")

    c.execute('DELETE FROM projects WHERE id = ?', (project_id,))
    c.execute('DELETE FROM segments WHERE project_id = ?', (project_id,))
    conn.commit()
    conn.close()
    return True

def clear_all_data():
    conn = get_db()
    c = conn.cursor()
    c.execute('DELETE FROM projects')
    c.execute('DELETE FROM segments')
    conn.commit()
    conn.close()
