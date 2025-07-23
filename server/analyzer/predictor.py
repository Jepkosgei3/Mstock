# server/analyzer/predictor.py

import asyncio
from server.db.mongo import get_collection

async def save_predictions_to_db(predictions):
    collection = get_collection("predictions")
    collection.delete_many({})  # synchronous call
    collection.insert_many(predictions)  # synchronous call

def predict_trend(symbols, sentiment_data):
    predictions = []

    for symbol in symbols:
        # Naive prediction logic using avg polarity
        symbol_sentiments = [s["sentiment"] for s in sentiment_data if s["symbol"] == symbol]
        avg_score = sum(symbol_sentiments) / len(symbol_sentiments) if symbol_sentiments else 0
        trend = "Up" if avg_score > 0.1 else "Down" if avg_score < -0.1 else "Neutral"

        predictions.append({
            "symbol": symbol,
            "average_sentiment": avg_score,
            "predicted_trend": trend
        })

    asyncio.run(save_predictions_to_db(predictions))
    print(f"✅ Saved {len(predictions)} trend predictions to MongoDB")
    return predictions
