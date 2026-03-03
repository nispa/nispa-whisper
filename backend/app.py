from flask import Flask
from flask_cors import CORS
from config import config
from database import init_db
from routes.projects import projects_bp
from routes.transcribe import transcribe_bp
from routes.system import system_bp
from routes.export import export_bp

def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Initialize DB
    init_db()
    
    # Register Blueprints
    app.register_blueprint(projects_bp, url_prefix='/api/projects')
    app.register_blueprint(transcribe_bp, url_prefix='/api/transcribe')
    app.register_blueprint(system_bp, url_prefix='/api/system')
    app.register_blueprint(export_bp, url_prefix='/api/export')
    
    return app

if __name__ == '__main__':
    app = create_app()
    print(f"Starting backend on port {config.PORT}...")
    app.run(host=config.HOST, port=config.PORT, debug=config.DEBUG)
