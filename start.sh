#!/bin/bash
export PYTHONPATH=.
echo "🚀 Starting FastAPI server on http://localhost:8000"
uvicorn server.main:app --reload
