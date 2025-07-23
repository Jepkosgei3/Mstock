# server/analyzer/sentiment_analyzer.py

import asyncio
from textblob import TextBlob
from server.db.mongo import get_collection  # Correct import

async def save_sentiments_to_db(sentiments):
    sentiments_collection = get_collection("sentiments")
    sentiments_collection.delete_many({})  # no await needed for PyMongo
    sentiments_collection.insert_many(sentiments)

def analyze_sentiment(symbols, symbol_texts):
    sentiment_records = []
    for symbol in symbols:
        texts = symbol_texts.get(symbol, [])
        for text in texts:
            analysis = TextBlob(text)
            polarity = analysis.sentiment.polarity
            sentiment_records.append({
                'symbol': symbol,
                'text': text,
                'sentiment': polarity
            })
    asyncio.run(save_sentiments_to_db(sentiment_records))
    print(f"✅ Saved {len(sentiment_records)} sentiment records")
    return sentiment_records
