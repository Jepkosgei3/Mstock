from fastapi import APIRouter, Depends
from ..db.mongo import get_crypto_collection
from typing import List
from pydantic import BaseModel
from datetime import datetime

router = APIRouter(prefix="/api/crypto", tags=["crypto"])

class CryptoRate(BaseModel):
    id: str = None
    symbol: str
    price: float
    timestamp: datetime

    @classmethod
    def from_mongo(cls, data: dict):
        """Convert MongoDB document to Pydantic model"""
        if "_id" in data:
            data["id"] = str(data.pop("_id"))
        return cls(**data)

@router.get("", response_model=List[CryptoRate])
def get_crypto_rates(col=Depends(get_crypto_collection)):
    cursor = col.find().sort("timestamp", -1).limit(100)
    data = list(cursor)
    return [CryptoRate.from_mongo(item) for item in data]