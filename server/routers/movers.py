from fastapi import APIRouter, Depends
from ..db.mongo import get_market_movers_collection
from typing import List
from datetime import datetime
from pydantic import BaseModel

router = APIRouter(prefix="/api/movers", tags=["movers"])

class Mover(BaseModel):
    id: str = None
    symbol: str
    name: str
    price: float
    change: float
    change_percent: float
    volume: int
    timestamp: datetime

    @classmethod
    def from_mongo(cls, data: dict):
        if "_id" in data:
            data["id"] = str(data.pop("_id"))
        return cls(**data)

@router.get("", response_model=List[Mover])
def get_movers(col=Depends(get_market_movers_collection)):
    cursor = col.find().sort("timestamp", -1).limit(100)
    data = list(cursor)
    return [Mover.from_mongo(item) for item in data]