#!/bin/bash

echo "🚀 Starting installation for Linux/macOS..."

# 1. Create Python Virtual Environment
echo "📦 Creating Python virtual environment..."
python3 -m venv venv

# 2. Activate venv and install backend dependencies
echo "🐍 Installing backend dependencies..."
source venv/bin/activate
pip install --upgrade pip
pip install -r backend/requirements.txt

# 3. Install frontend dependencies
echo "⚛️ Installing frontend dependencies..."
cd frontend
npm install
cd ..

echo "✅ Installation complete!"
echo "👉 Use './run_app.sh' to start the application."
