from fastapi import APIRouter, Depends
from ..db.mongo import get_sentiment_collection
from typing import List
from datetime import datetime
from pydantic import BaseModel

router = APIRouter(prefix="/api/sentiment", tags=["sentiment"])

class Sentiment(BaseModel):
    id: str = None
    symbol: str
    timestamp: datetime
    score: float
    magnitude: float

    @classmethod
    def from_mongo(cls, data: dict):
        if "_id" in data:
            data["id"] = str(data.pop("_id"))
        return cls(**data)

@router.get("", response_model=List[Sentiment])
def get_sentiment(col=Depends(get_sentiment_collection)):
    cursor = col.find().sort("timestamp", -1).limit(100)
    data = list(cursor)
    return [Sentiment.from_mongo(item) for item in data]