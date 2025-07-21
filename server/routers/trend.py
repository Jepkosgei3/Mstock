from fastapi import APIRouter
from server.models.trend import trend_collection

router = APIRouter(prefix="/trend")

@router.get("/")
def get_predictions():
    data = list(trend_collection.find())
    for d in data:
        d["_id"] = str(d["_id"])
    return data
