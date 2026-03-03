import json
import pytest

def test_system_status(client):
    """Verify that the system status endpoint works"""
    response = client.get('/api/system/status')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert 'gpu_available' in data
    assert 'vram_mb_total' in data

def test_list_projects_empty(client):
    """Verify that the project list returns an empty array initially"""
    response = client.get('/api/projects')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert isinstance(data, list)
    assert len(data) == 0

def test_list_projects_with_data(client, sample_project):
    """Verify that the project list returns the test project"""
    response = client.get('/api/projects')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert len(data) == 1
    assert data[0]['id'] == sample_project

def test_get_project_details(client, sample_project):
    """Verify the details of a specific project"""
    response = client.get(f'/api/projects/{sample_project}')
    assert response.status_code == 200
    data = json.loads(response.data)
    assert data['id'] == sample_project
    assert 'segments' in data
    assert len(data['segments']) == 1

def test_delete_project(client, sample_project):
    """Verify the deletion of a project"""
    response = client.delete(f'/api/projects/{sample_project}')
    assert response.status_code == 200
    
    # Verify that it no longer exists
    response = client.get(f'/api/projects/{sample_project}')
    assert response.status_code == 404

def test_update_segments(client, sample_project):
    """Verify the segment update"""
    new_segments = [
        {"start": 0.0, "end": 2.0, "text": "Test 1"},
        {"start": 2.0, "end": 4.0, "text": "Test 2"}
    ]
    response = client.post(f'/api/projects/{sample_project}/segments', 
                          json={"segments": new_segments})
    assert response.status_code == 200
    
    # Verify they were saved
    response = client.get(f'/api/projects/{sample_project}')
    data = json.loads(response.data)
    assert len(data['segments']) == 2
    assert data['segments'][0]['text'] == "Test 1"

def test_export_api(client, sample_project):
    """Verify the format export functionality"""
    for format in ['srt', 'vtt', 'txt', 'csv', 'json', 'mcp']:
        response = client.post(f'/api/export', json={
            "job_id": sample_project,
            "format": format
        })
        assert response.status_code == 200
        data = json.loads(response.data)
        assert 'content' in data
        assert len(data['content']) > 0

def test_export_invalid_format(client, sample_project):
    """Verify export with an invalid format"""
    response = client.post(f'/api/export', json={
        "job_id": sample_project,
        "format": "docx"
    })
    assert response.status_code == 400

def test_export_missing_data(client):
    """Verify export with bad request"""
    response = client.post(f'/api/export', json={"format": "srt"})
    assert response.status_code == 400
