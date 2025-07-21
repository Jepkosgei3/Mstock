import datetime

async def fetch_and_save_sentiment(db):
    sentiment = {
        "summary": "Markets expected to rally amid earnings reports.",
        "score": 0.65,
        "timestamp": datetime.datetime.utcnow()
    }
    await db.sentiment.delete_many({})
    await db.sentiment.insert_one(sentiment)
