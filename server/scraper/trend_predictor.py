import datetime

async def predict_and_save_trends(db):
    predictions = [
        {"symbol": "AAPL", "prediction": "up", "confidence": 0.78, "timestamp": datetime.datetime.utcnow()},
        {"symbol": "TSLA", "prediction": "down", "confidence": 0.61, "timestamp": datetime.datetime.utcnow()}
    ]
    await db.trends.delete_many({})
    await db.trends.insert_many(predictions)
