from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from datetime import datetime
from ..db.mongo import get_predictions_collection

router = APIRouter(prefix="/api/trend", tags=["trend"])

class Prediction(BaseModel):
    id: str = None
    symbol: str
    timestamp: datetime
    prediction: float
    confidence: float

    @classmethod
    def from_mongo(cls, data: dict):
        if "_id" in data:
            data["id"] = str(data.pop("_id"))
        return cls(**data)

@router.get("", response_model=List[Prediction])
def get_trend(col=Depends(get_predictions_collection)):
    cursor = col.find().sort("timestamp", -1).limit(100)
    data = list(cursor)
    return [Prediction.from_mongo(item) for item in data]