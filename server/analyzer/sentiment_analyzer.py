from textblob import TextBlob
from server.models.sentiment import sentiment_collection

def analyze_sentiment(symbols, texts):
    results = []
    for entry in texts:
        text = entry["text"]
        score = TextBlob(text).sentiment.polarity
        results.append({"symbol": entry["symbol"], "text": text, "score": score})
    sentiment_collection.delete_many({})
    sentiment_collection.insert_many(results)
    print("[✓] Saved sentiment scores")
    return results
