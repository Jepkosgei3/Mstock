from fastapi import APIRouter
from fastapi.responses import JSONResponse
import json
import os

router = APIRouter()

@router.get("/api/sentiment")
def get_sentiment():
    file_path = "server/data/sentiment.json"
    if not os.path.exists(file_path):
        return JSONResponse(content={"error": "Sentiment data not found"}, status_code=404)

    with open(file_path, "r") as f:
        sentiment_data = json.load(f)

    return sentiment_data
