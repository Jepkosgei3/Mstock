from fastapi import APIRouter
from ..db.mongo import get_collection

router = APIRouter()

@router.get("/api/sentiment")
def get_sentiment():
    col = get_collection("sentiments")
    data = list(col.find().limit(100))
    
    # Convert ObjectId to string
    for item in data:
        item["_id"] = str(item["_id"])
    
    return {"sentiments": data}
