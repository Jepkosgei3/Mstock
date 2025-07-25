from fastapi import APIRouter, Depends
from ..db.mongo import get_collection

router = APIRouter()

@router.get("/movers")
async def get_movers(col = Depends(get_collection("market_movers"))):
    cursor = col.find().limit(100)
    data = [doc async for doc in cursor]
    return {"data": data}