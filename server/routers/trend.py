from fastapi import APIRouter
from fastapi.responses import JSONResponse
import json
import os

router = APIRouter()

@router.get("/api/trend")
def get_trend_prediction():
    file_path = "server/data/predictions.json"
    if not os.path.exists(file_path):
        return JSONResponse(content={"error": "Prediction not found"}, status_code=404)

    with open(file_path, "r") as f:
        prediction = json.load(f)

    return prediction
