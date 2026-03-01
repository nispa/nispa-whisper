import pytest
import json
import os
import sys

# Aggiungi la cartella superiore al path per importare app
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from app import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

def test_system_status(client):
    """Verifica che l'endpoint dello stato del sistema funzioni"""
    response = client.get('/api/system/status')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'gpu_available' in data
    assert 'backend_version' in data

def test_list_projects(client):
    """Verifica che la lista progetti ritorni un array"""
    response = client.get('/api/projects')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert isinstance(data, list)

def test_export_formats(client):
    """Verifica che i formati di export siano validi (mocking segments)"""
    # Nota: questo test richiede che ci sia almeno un progetto nel DB
    # In un ambiente di test reale, dovremmo creare un progetto di test
    pass

def test_mcp_format_logic():
    """Test unitario per la logica di generazione MCP"""
    from transcribe.export import generate_mcp
    segments = [
        {"text": "Ciao a tutti.", "start": 0, "end": 2},
        {"text": "Questa è una prova.", "start": 2, "end": 4}
    ]
    mcp_json = generate_mcp(segments, filename="test.mp3")
    data = json.loads(mcp_json)
    
    assert data['mcp_version'] == "1.0"
    assert data['text'] == "Ciao a tutti. Questa è una prova."
    assert 'content' not in data # Verifica che abbiamo rimosso la ridondanza
    assert data['metadata']['total_characters'] > 0
