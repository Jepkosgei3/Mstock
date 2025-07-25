import requests
from datetime import datetime
from ..db.mongo import get_collection
from typing import List, Dict

def fetch_sentiment_text(symbols: List[str]) -> Dict[str, List[Dict]]:
    texts = {}
    for symbol in symbols:
        url = f"https://newsapi.org/v2/everything?q={symbol}&apiKey=YOUR_API_KEY"
        response = requests.get(url)
        data = response.json()
        texts[symbol] = [
            {
                'symbol': symbol,
                'title': article['title'],
                'content': article['content'],
                'source': article['source']['name'],
                'publishedAt': article['publishedAt'],
                'timestamp': datetime.now()
            }
            for article in data.get('articles', [])
        ]
    return texts