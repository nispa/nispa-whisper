import sqlite3
import os
import json
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), '../data/whisperapp.db')

def get_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
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
            diarization BOOLEAN,
            progress REAL,
            error TEXT,
            file_hash TEXT
        )
    ''')
    
    # Add file_hash column if it doesn't exist (for existing databases)
    try:
        c.execute('ALTER TABLE projects ADD COLUMN file_hash TEXT')
    except sqlite3.OperationalError:
        pass # Column already exists
        
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

def create_project(project_id, name, file_path, file_name, model, language, diarization, file_hash=None):
    conn = get_db()
    c = conn.cursor()
    c.execute('''
        INSERT INTO projects (id, name, created_at, status, file_path, file_name, model, language, diarization, progress, file_hash)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ''', (project_id, name, datetime.now().isoformat(), 'queued', file_path, file_name, model, language, diarization, 0.0, file_hash))
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
    conn = get_db()
    c = conn.cursor()
    c.execute('DELETE FROM segments WHERE project_id = ?', (project_id,))
    for seg in segments:
        c.execute('''
            INSERT INTO segments (project_id, start, end, text, speaker)
            VALUES (?, ?, ?, ?, ?)
        ''', (project_id, seg.get('start', 0), seg.get('end', 0), seg.get('text', ''), seg.get('speaker', '')))
    conn.commit()
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

def delete_project(project_id):
    conn = get_db()
    c = conn.cursor()
    c.execute('DELETE FROM projects WHERE id = ?', (project_id,))
    c.execute('DELETE FROM segments WHERE project_id = ?', (project_id,))
    conn.commit()
    conn.close()

def clear_all_data():
    conn = get_db()
    c = conn.cursor()
    c.execute('DELETE FROM projects')
    c.execute('DELETE FROM segments')
    conn.commit()
    conn.close()
