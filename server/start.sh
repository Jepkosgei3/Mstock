#!/bin/bash

echo "🚀 Starting FastAPI server on http://localhost:8000"
cd "$(dirname "$0")"  # go to server/
cd ..                 # go to Mstock/

# Start FastAPI server
uvicorn server.main:app --reload &

# Give the server a few seconds to start up before running the pipeline
sleep 3

# Run data pipeline
python3 run.py
