import datetime

async def fetch_and_save_market_movers(db):
    # Dummy data simulating Google Finance results
    movers = [
        {"symbol": "GOOGL", "change": "+3.2%", "timestamp": datetime.datetime.utcnow()},
        {"symbol": "MSFT", "change": "-1.4%", "timestamp": datetime.datetime.utcnow()}
    ]
    await db.movers.delete_many({})
    await db.movers.insert_many(movers)
