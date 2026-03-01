# nispa-WhisperApp

nispa-WhisperApp is a desktop application that allows you to transcribe audio and video files using the power of OpenAI's Whisper model, optimized for speed with faster-whisper. It provides a user-friendly interface to manage, view, and edit your transcriptions, with advanced integration for AI analysis.

## ✨ Features

- **High-Quality Transcription**: Utilizes `faster-whisper` for accurate and fast audio-to-text conversion.
- **Multiple Model Sizes**: Supports different Whisper model sizes (e.g., tiny, medium, large-v3) to balance speed and accuracy.
- **File Management**: Upload and manage your audio/video files directly within the app.
- **Transcription Editor**: A built-in editor to review and correct the generated transcriptions with audio/video sync.
- **GPU Acceleration**: Automatically detects and utilizes NVIDIA GPUs (via CUDA) for significantly faster processing.
- **AI Integration (MCP)**: Export transcriptions in JSON format optimized for Model Context Protocol, ready for analysis by Gemini, ChatGPT, or Claude.
- **Web-Based UI**: A modern and responsive user interface built with React and TypeScript.

## 🛠️ Tech Stack

### Backend:
- **Python**
- **Flask** (Python web framework)
- **faster-whisper** for the core transcription engine
- **SQLite** for database management

### Frontend:
- **React**
- **TypeScript**
- **Vite**
- **Tailwind CSS**

### Core Dependencies:
- `ctranslate2`
- `librosa`
- `faster-whisper`
- `lucide-react` (icons)

## 🚀 Getting Started

### Prerequisites
- Python 3.10+
- Node.js and npm
- FFmpeg
- (Optional but Recommended) An NVIDIA GPU with CUDA installed for hardware acceleration.

### Installation
1. **Clone the repository**:
   ```bash
   git clone https://github.com/nispa/nispa-whisper
   cd nispa-whisper
   ```

2. **Set up the environment**: Run the installation script to create a Python virtual environment and install all required dependencies.
   ```bash
   install_env.bat
   ```
   *This will also install the necessary Node.js packages for the frontend.*

### Running the Application
Once the installation is complete, you can start the application using the provided script:
```bash
run_app.bat
```
This command will launch the backend server and frontend application, which you can access in your web browser, typically at `http://localhost:3000`.

## 🛠️ AI & MCP Configuration

WhisperApp includes advanced post-transcription features:
- **JSON (MCP)**: Export format structured to be "AI-Ready", optimized for system prompts or MCP servers.
- **Provider Integration**: Configure API keys for Gemini, OpenAI, or Anthropic in the Settings to enable direct AI analysis.
- **Custom Endpoints**: Support for local proxies or OpenAI-compatible services.

## 📁 Project Structure

```text
nispa-whisper/
├── backend/            # Python backend (Flask/API)
│   ├── app.py          # Main application entrypoint
│   ├── database.py     # Database setup and models
│   ├── audio/          # Audio processing modules
│   ├── gpu/            # GPU detection logic
│   └── models/         # Whisper model wrapper
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # UI Components
│   │   ├── api.ts      # API communication
│   │   └── App.tsx     # Main React component
│   └── vite.config.ts  # Vite configuration
├── data/               # Application data (created at runtime)
│   ├── whisperapp.db   # SQLite database
│   ├── cache/          # Cached media files
│   └── models/         # Downloaded whisper models
├── install_env.bat     # Installation script
├── run_app.bat         # Script to run the application
└── README.md           # This file
```

---
Developed to provide a professional, private, and AI-ready transcription tool.
