from fastapi import APIRouter
from ..db.mongo import get_collection
from typing import List

router = APIRouter(prefix="/api/crypto", tags=["crypto"])

@router.get("")
def get_crypto_rates(symbols: List[str] = ["BTC", "ETH", "SOL"]):
    col = get_collection("crypto_rates")
    pipeline = [
        {"$match": {"symbol": {"$in": symbols}}},
        {"$sort": {"timestamp": -1}},
        {"$group": {"_id": "$symbol", "latest": {"$first": "$$ROOT"}}},
        {"$replaceRoot": {"newRoot": "$latest"}}
    ]
    data = list(col.aggregate(pipeline))
    return {"data": data}