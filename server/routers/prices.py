from fastapi import APIRouter, Depends, Query
from ..db.mongo import get_prices_collection
from typing import List
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/api/prices", tags=["prices"])

class PriceData(BaseModel):
    id: str = None
    symbol: str
    date: datetime
    open: float
    high: float
    low: float
    close: float
    volume: int
    timestamp: datetime

    @classmethod
    def from_mongo(cls, data: dict):
        if "_id" in data:
            data["id"] = str(data.pop("_id"))
        return cls(**data)

@router.get("", response_model=List[PriceData])
def get_prices(
    symbols: List[str] = Query(None),
    col=Depends(get_prices_collection)
):
    query = {"symbol": {"$in": symbols}} if symbols else {}
    cursor = col.find(query).sort("timestamp", -1).limit(100)
    data = list(cursor)
    return [PriceData.from_mongo(item) for item in data]