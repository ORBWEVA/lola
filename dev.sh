#!/bin/bash

# Function to handle cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping services..."
    # Kill all child processes in the same process group (ignoring the script's own PID if possible, but simplest is jobs)
    # Using 'jobs -p' to get PIDs of background jobs started by this shell
    pids=$(jobs -p)
    if [ -n "$pids" ]; then
        kill $pids 2>/dev/null
    fi
    exit
}

# Trap SIGINT (Ctrl+C) and SIGTERM to run cleanup
trap cleanup SIGINT SIGTERM

echo "🔧 Starting development environment..."

# Check for .env
if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        echo "⚠️  Warning: .env file not found. Copying from .env.example..."
        cp .env.example .env
        echo "Please update .env with your configuration."
    else
        echo "⚠️  Warning: .env file not found and no .env.example exists."
    fi
fi



# Enable Dev Mode
export DEV_MODE=true

echo "🚀 Starting Backend (Uvicorn) on port 8000..."
# Start Uvicorn in the background
# Start Uvicorn in the background
if [ -f "venv/bin/python" ]; then
    venv/bin/python -m uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload &
else
    python3 -m uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload &
fi
BACKEND_PID=$!

echo "🎨 Starting Frontend (Vite)..."
# Start Vite (it usually runs in foreground, but we want to wait for it)
# We run it in foreground so Ctrl+C goes to it and the script
npm run dev &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID
