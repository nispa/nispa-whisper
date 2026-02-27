@echo off
cd /d "%~dp0"
echo ===================================================
echo     Avvio WhisperApp (Frontend + Backend)
echo ===================================================
echo.

:: Controlla se l'ambiente virtuale esiste
if not exist "venv\Scripts\activate.bat" (
    echo [ERRORE] Ambiente virtuale non trovato.
    echo Esegui prima install_env.bat per configurare l'ambiente.
    pause
    exit /b
)

:: Avvia il Backend in una nuova finestra (usiamo /k così la finestra non si chiude in caso di errore)
echo Avvio del Backend Flask (Porta 5000)...
start "WhisperApp Backend" cmd /k "call venv\Scripts\activate & cd backend & python app.py"

:: Attendi qualche secondo per far avviare il backend
timeout /t 3 /nobreak >nul

:: Avvia il Frontend (Vite) nella finestra corrente
echo Avvio del Frontend React (Vite)...
cd frontend
call npm run dev

echo.
echo Se vedi questo messaggio, il server frontend si e' chiuso.
pause
