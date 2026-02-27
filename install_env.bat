@echo off
cd /d "%~dp0"
echo ===================================================
echo     nispa WhisperApp - Installazione Ambiente (+ CUDA)
echo ===================================================
echo.

:: Controlla se Python e' installato
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERRORE] Python non e' installato o non e' nel PATH.
    echo Scarica Python 3.10 o 3.11 da python.org e riprova.
    pause
    exit /b
)

:: Controlla se FFmpeg e' installato
ffmpeg -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ATTENZIONE] FFmpeg non e' nel PATH.
    echo L'estrazione audio dai video potrebbe fallire.
    echo Assicurati di scaricare FFmpeg e aggiungerlo alle variabili d'ambiente.
    echo.
)

echo Verifica dell'esistenza del venv...
if exist venv (
    echo L'ambiente virtuale esiste già. Nessuna creazione necessaria.
) else (
    echo Creazione dell'ambiente virtuale venv...
    python -m venv venv
    if %errorlevel% neq 0 (
        echo [ERRORE] Impossibile creare l'ambiente virtuale.
        pause
        exit /b
    )
)

echo.
echo Attivazione ambiente virtuale...
call venv\Scripts\activate

echo.
echo Installazione di PyTorch per CUDA...
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu130

echo.
echo Installazione delle dipendenze del backend...
pip install -r backend\requirements.txt

echo.
echo Installazione delle dipendenze del frontend (Node.js richiesto)...
cd frontend
call npm install
cd ..

echo.
echo ===================================================
echo Installazione completata con successo!
echo Puoi avviare l'app usando run_app.bat
echo ===================================================
pause
