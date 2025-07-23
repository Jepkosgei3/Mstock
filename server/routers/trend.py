from fastapi import APIRouter
from ..db.mongo import get_collection

router = APIRouter()

@router.get("/api/trend")
def get_trend():
    col = get_collection("predictions")
    data = list(col.find().limit(100))
    for item in data:
        item["_id"] = str(item["_id"])
    return {"predictions": data}
