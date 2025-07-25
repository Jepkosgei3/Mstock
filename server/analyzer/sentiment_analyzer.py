from typing import List, Dict
from datetime import datetime
from ..db.mongo import get_collection
from textblob import TextBlob

async def analyze_sentiment(symbols: List[str], texts: Dict[str, List[Dict]]):
    col = await get_collection("sentiments")()
    
    sentiment_data = []
    for symbol in symbols:
        for article in texts.get(symbol, []):
            analysis = TextBlob(article['content'] or '')
            sentiment_data.append({
                'symbol': symbol,
                'title': article['title'],
                'polarity': analysis.sentiment.polarity,
                'subjectivity': analysis.sentiment.subjectivity,
                'source': article['source'],
                'publishedAt': article['publishedAt'],
                'timestamp': datetime.now()
            })
    
    if sentiment_data:
        await col.insert_many(sentiment_data)
    
    return sentiment_data