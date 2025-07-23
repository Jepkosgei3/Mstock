from fastapi import APIRouter, Query, HTTPException
from typing import List
from ..db.mongo import get_collection

router = APIRouter()

@router.get("/api/prices")
def api_prices(symbols: List[str] = Query(...)):
    try:
        col = get_collection("price_data")
        data = list(col.find({"ticker": {"$in": symbols}}).sort("date", 1))

        # Convert ObjectId to string
        for item in data:
            item["_id"] = str(item["_id"])

        return data
    except Exception as e:
        print(f"❌ Error in /api/prices: {e}")
        raise HTTPException(status_code=500, detail=str(e))
