# nispa-WhisperApp

nispa-WhisperApp is a professional desktop application for automatic transcription, powered by OpenAI's Whisper (via `faster-whisper`). It features a modern, modular architecture designed for high performance, local privacy, and seamless AI integration.

## ✨ Features

- **Modular Architecture**: Clean separation of concerns in both Frontend (React Context + Modular Components) and Backend (Flask Blueprints + Service Layer).
- **Real-Time Waveform**: Interactive, real audio waveform visualization using Web Audio API.
- **Advanced Editor**: Synchronized audio/video playback with live text editing, Undo/Redo support, and bulk Find & Replace.
- **Data-Driven UI**: Dynamic Settings and Help systems managed via centralized configurations.
- **GPU Acceleration**: Native support for NVIDIA CUDA for lightning-fast local processing.
- **AI-Ready (MCP)**: Export transcriptions in optimized JSON formats for Model Context Protocol, perfect for analysis with Gemini, ChatGPT, or Claude.

## 🛠️ Tech Stack

### Frontend (React & TypeScript)
- **Modular Components**: Organized by feature (`Editor`, `Dashboard`, `Setup`).
- **State Management**: React Context API for global application state.
- **Icons**: `lucide-react`.
- **Build Tool**: Vite.

### Backend (Python & Flask)
- **Service Layer**: Business logic isolated from API routes for better testability.
- **Blueprints**: Modular routing system for Projects, Transcription, and System status.
- **Engine**: `faster-whisper` (optimized CTranslate2 implementation).
- **Storage**: SQLite for project metadata and local file caching.

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js and npm
- FFmpeg (added to System PATH)
- (Optional) NVIDIA GPU with CUDA drivers for acceleration.

### Installation

**Windows:**
```bash
install_env.bat
```

**Linux/macOS:**
1. Make the scripts executable: `chmod +x install_env.sh run_app.sh`
2. Run: `./install_env.sh`

### Running the Application

**Windows:**
```bash
run_app.bat
```

**Linux/macOS:**
```bash
./run_app.sh
```
Access the UI at `http://localhost:3000`.

## 📡 API Reference

The backend exposes a REST API allowing integration with external tools and scripts. By default, the API is available at `http://localhost:5000/api`.

### 1. Start Transcription (`POST /api/transcribe`)
Uploads a media file to start a transcription job.
```bash
curl -X POST http://localhost:5000/api/transcribe \
  -F "file=@/path/to/your/audio.mp3" \
  -F "model=medium" \
  -F "language=it" \
  -F "diarization=false"
```
**Response**: `{"job_id": "uuid", "status": "queued"}`

### 2. Get Job Status (`GET /api/transcribe/<job_id>`)
Checks the live status of an ongoing transcription job.
```bash
curl http://localhost:5000/api/transcribe/<job_id>
```

### 3. List Projects (`GET /api/projects`)
Retrieves a list of all saved transcriptions.
```bash
curl http://localhost:5000/api/projects
```

### 4. Get Project Details & Segments (`GET /api/projects/<project_id>`)
Gets the full transcription segments for a project.
```bash
curl http://localhost:5000/api/projects/<project_id>
```

### 5. Fetch Original Media (`GET /api/projects/<project_id>/media`)
Streams the original uploaded audio or video file. Use this as `src` for a media player.

### 6. Export Transcription (`POST /api/export`)
Exports a saved project to various formats (`srt`, `vtt`, `txt`, `csv`, `json`, `mcp`).
```bash
curl -X POST http://localhost:5000/api/export \
  -H "Content-Type: application/json" \
  -d '{"job_id": "<project_id>", "format": "srt", "include_speakers": true}'
```

## 📁 Project Structure (Modernized)

```text
nispa-whisper/
├── backend/
│   ├── routes/         # Modular API routes (Blueprints)
│   ├── services/       # Core business logic (Transcription, Files)
│   ├── config.py       # Centralized backend configuration
│   └── app.py          # Entry point (App Factory pattern)
├── frontend/
│   └── src/
│       ├── components/ # Modular UI components
│       │   ├── Common/ # Shared components (Modals, etc.)
│       │   ├── Editor/ # Transcription editor modules
│       │   └── ...     # Dashboard, Setup, Transcribing
│       ├── api.ts      # Typed API client
│       └── i18n.ts     # Multi-language support
├── data/               # Persistent storage (DB, Cache, Models)
└── README.md
```

## 📝 Changelog

### 2026-03-03
- Refactored code to a modular architecture.
- Fixed audio waveform visualization.
- Fixed transcription editing and saving.
- Added support for saving transcription edits.
- Added pause of media during editing.
- Implemented media missing state handle and direct media re-upload from Editor.
- Added dynamic waveform regeneration on media re-upload by utilizing cache-busting.
- Centralized media states inside EditorContext.

### 2026-02-27
- Fixed typo in localhost URL (updated from 5173 to 3000).
- Added manual (`MANUAL.md`).
- Initial commit and project setup.

---
Developed for professional, private, and AI-enhanced workflows.
