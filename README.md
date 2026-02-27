# nispa-WhisperApp

nispa-WhisperApp is a desktop application that allows you to transcribe audio and video files using the power of OpenAI's Whisper model, optimized for speed with `faster-whisper`. It provides a user-friendly interface to manage, view, and edit your transcriptions.

## ✨ Features

-   **High-Quality Transcription:** Utilizes `faster-whisper` for accurate and fast audio-to-text conversion.
-   **Multiple Model Sizes:** Supports different Whisper model sizes (e.g., tiny, medium) to balance speed and accuracy.
-   **File Management:** Upload and manage your audio/video files directly within the app.
-   **Transcription Editor:** A built-in editor to review and correct the generated transcriptions.
-   **GPU Acceleration:** Automatically detects and utilizes NVIDIA GPUs (via CUDA) for significantly faster processing.
-   **Web-Based UI:** A modern and responsive user interface built with React and TypeScript.

## 🛠️ Tech Stack

-   **Backend:**
    -   Python
    -   Flask (or a similar Python web framework)
    -   `faster-whisper` for the core transcription engine
    -   SQLite for database management
-   **Frontend:**
    -   React
    -   TypeScript
    -   Vite
-   **Core Dependencies:**
    -   `ctranslate2`
    -   `librosa`
    -   `faster-whisper`

## 🚀 Getting Started

### Prerequisites

-   Python 3.11+
-   Node.js and npm
-   FFmpeg 
-   (Optional but Recommended) An NVIDIA GPU with CUDA installed for hardware acceleration.
 
### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/nispa/nispa-whisper
    cd nispa-whisper
    ```

2.  **Set up the environment:**
    Run the installation script to create a Python virtual environment and install all required dependencies.
    ```batch
    install_env.bat
    ```
    This will also install the necessary Node.js packages for the frontend.

### Running the Application

Once the installation is complete, you can start the application using the provided script:

```batch
run_app.bat
```

This command will launch the backend server and frontend application, which you can access in your web browser, typically at `http://localhost:5173`.

## 📁 Project Structure

```
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
├── data/               # Application data
│   ├── whisperapp.db   # SQLite database
│   ├── cache/          # Cached media files
│   └── models/         # Downloaded whisper models
├── install_env.bat     # Installation script
├── run_app.bat         # Script to run the application
└── README.md           # This file
```
