import requests
from datetime import datetime
from ..db.mongo import get_collection
from typing import List, Dict
from dotenv import load_dotenv
import os

load_dotenv()
NEWS_API_KEY = os.getenv("NEWS_API_KEY")

def fetch_sentiment_text(symbols: List[str]) -> Dict[str, List[Dict]]:
    texts = {}
    for symbol in symbols:
        try:
            url = f"https://newsapi.org/v2/everything?q={symbol}&apiKey={NEWS_API_KEY}"
            response = requests.get(url)
            data = response.json()
            texts[symbol] = [
                {
                    'symbol': symbol,
                    'title': article['title'],
                    'content': article['content'],
                    'source': article['source']['name'],
                    'publishedAt': article['publishedAt'],
                    'timestamp': datetime.utcnow()
                }
                for article in data.get('articles', [])
            ]
        except Exception as e:
            print(f"⚠️ Error fetching news for {symbol}: {str(e)}")
            texts[symbol] = []
    return texts