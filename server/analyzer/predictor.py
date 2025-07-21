from random import uniform
from server.models.trend import trend_collection

def predict_trend(symbols, sentiments):
    predictions = []
    for s in sentiments:
        predictions.append({
            "symbol": s["symbol"],
            "sentiment_score": s["score"],
            "predicted_change": round(s["score"] * uniform(1.5, 3.0), 2)
        })
    trend_collection.delete_many({})
    trend_collection.insert_many(predictions)
    print("[✓] Saved predictions")
