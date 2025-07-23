# server/routers/movers.py

from fastapi import APIRouter
from ..db.mongo import get_collection

router = APIRouter()

@router.get("/api/movers")
def get_movers():
    col = get_collection("market_movers")
    movers = list(col.find().limit(50))

    # Convert ObjectId to string
    for item in movers:
        item["_id"] = str(item["_id"])

    return {"movers": movers}
