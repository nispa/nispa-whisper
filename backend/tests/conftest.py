import pytest
import os
import sys
import tempfile
import sqlite3

# Add the backend path to sys.path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app
import database

@pytest.fixture
def app():
    # Create a temporary file for the test database
    db_fd, db_path = tempfile.mkstemp()
    
    app = create_app()
    app.config.update({
        "TESTING": True,
        "UPLOAD_FOLDER": tempfile.mkdtemp()
    })

    # Overwrite the database path during testing
    original_db_path = database.DB_PATH
    database.DB_PATH = db_path
    
    # Initialize the empty test database
    database.init_db()

    yield app

    # Cleanup
    os.close(db_fd)
    try:
        os.unlink(db_path)
    except PermissionError:
        pass # Ignore on Windows if still in use
    
    # Restore original path
    database.DB_PATH = original_db_path

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def runner(app):
    return app.test_cli_runner()

@pytest.fixture
def sample_project():
    """Creates a test project in the database and returns it"""
    project_id = "test-1234-5678"
    database.create_project(
        project_id=project_id,
        name="test.mp3",
        file_path="/tmp/test.mp3",
        file_name="test.mp3",
        model="tiny",
        language="it"
    )
    database.save_segments(project_id, [
        {"start": 0.0, "end": 1.0, "text": "Hello world", "speaker": "Speaker 1"}
    ])
    return project_id
