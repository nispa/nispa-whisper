import json
import pytest
from backend.transcribe.export import generate_mcp

def test_generate_mcp_structure():
    """Test that the MCP format is correct and non-redundant"""
    segments = [
        {"text": "Hello world", "start": 0.0, "end": 1.0},
        {"text": "Testing MCP", "start": 1.0, "end": 2.0}
    ]
    filename = "test_audio.mp3"
    
    result_json = generate_mcp(segments, filename)
    data = json.loads(result_json)
    
    # Verify mandatory fields
    assert "mcp_version" in data
    assert "metadata" in data
    assert "text" in data
    
    # Verify metadata
    assert data["metadata"]["source"] == filename
    assert data["metadata"]["segments_count"] == 2
    assert data["metadata"]["total_characters"] == len("Hello world Testing MCP")
    
    # Verify content (must be a single string)
    assert data["text"] == "Hello world Testing MCP"
    
    # Verify absence of redundant or unrequested fields
    assert "segments" not in data
    assert "content" not in data
    assert "full_text" not in data
