from fastapi import APIRouter
from fastapi.responses import JSONResponse
import json
import os

router = APIRouter()

@router.get("/api/movers")
def get_market_movers():
    file_path = "server/data/market_movers.json"
    if not os.path.exists(file_path):
        return JSONResponse(content={"error": "Market movers not found"}, status_code=404)

    with open(file_path, "r") as f:
        movers = json.load(f)

    return {"movers": movers}
