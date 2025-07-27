#!/bin/bash

echo "🚀 Starting FastAPI server on http://localhost:8000"
cd "$(dirname "$0")"  # go to server/
cd ..                 # go to Mstock/

# Kill any process using port 8000
echo "Checking for processes on port 8000..."
if lsof -i :8000; then
    echo "Killing processes on port 8000..."
    fuser -k 8000/tcp || true
    sleep 1  # Wait briefly to ensure port is released
fi

# Verify port is free
if lsof -i :8000; then
    echo "❌ Error: Port 8000 is still in use. Please manually terminate the process."
    exit 1
fi

# Start FastAPI server
echo "Starting Uvicorn server..."
uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload &

# Give the server a few seconds to start up
sleep 3

# Check if Uvicorn started successfully
if ! ps aux | grep -v grep | grep uvicorn > /dev/null; then
    echo "❌ Error: Uvicorn failed to start. Check logs for details."
    exit 1
fi

# Run data pipeline
echo "Starting data pipeline..."
python3 run.py