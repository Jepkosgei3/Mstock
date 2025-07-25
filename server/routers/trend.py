from fastapi import APIRouter
from ..db.mongo import get_collection

router = APIRouter(prefix="/api/trend", tags=["trend"])

@router.get("")
def get_trend():
    col = get_collection("predictions")
    data = list(col.find().sort("timestamp", -1).limit(100))
    return {"data": data}