from fastapi import APIRouter
from ..db.mongo import get_collection
from bson import ObjectId
import json

router = APIRouter(prefix="/api/sentiment", tags=["sentiment"])

@router.get("")
def get_sentiment():
    col = get_collection("sentiments")
    data = list(col.find().limit(100))
    # Convert ObjectId to string
    for item in data:
        item["_id"] = str(item["_id"])
    return {"data": data}