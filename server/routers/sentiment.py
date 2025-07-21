from fastapi import APIRouter
from server.models.sentiment import sentiment_collection

router = APIRouter()

@router.get("/")
def get_sentiment():
    return list(sentiment_collection.find({}, {"_id": 0}))
