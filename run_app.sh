#!/bin/bash

# Cleanup function to kill background processes on exit
cleanup() {
    echo "Stopping application..."
    kill $BACKEND_PID
    kill $FRONTEND_PID
    exit
}

trap cleanup SIGINT SIGTERM

echo "🚀 Starting nispa-WhisperApp..."

# 1. Start Backend
echo "🐍 Starting Flask backend..."
source venv/bin/activate
cd backend
python3 app.py &
BACKEND_PID=$!
cd ..

# 2. Start Frontend
echo "⚛️ Starting React frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo "✅ App is running!"
echo "👉 Frontend: http://localhost:3000"
echo "👉 Backend: http://localhost:5000"

# Keep script running to wait for processes
wait
