from fastapi import APIRouter
from fastapi.responses import JSONResponse
import pandas as pd
import os

router = APIRouter()

@router.get("/api/price/{symbol}")
def get_price_data(symbol: str):
    file_path = f"server/data/price_{symbol.upper()}.csv"
    if not os.path.exists(file_path):
        return JSONResponse(content={"error": "Data not found"}, status_code=404)

    df = pd.read_csv(file_path)
    data = df.to_dict(orient="records")
    return {"symbol": symbol.upper(), "prices": data}
