from typing import List, Dict
from datetime import datetime
from ..db.mongo import get_sentiment_collection
from textblob import TextBlob

def analyze_sentiment(symbols: List[str], texts: List[Dict]) -> Dict[str, float]:
    try:
        col = get_sentiment_collection()
        sentiment_data = []

        for text in texts:
            if not text.get('content'):
                continue
            analysis = TextBlob(text['content'])
            sentiment_data.append({
                'symbol': text['symbol'],
                'score': analysis.sentiment.polarity,
                'magnitude': analysis.sentiment.subjectivity,
                'timestamp': datetime.utcnow()
            })

        if sentiment_data:
            col.insert_many(sentiment_data)

        sentiment_by_symbol = {}
        for item in sentiment_data:
            symbol = item["symbol"]
            score = item["score"]
            if symbol not in sentiment_by_symbol:
                sentiment_by_symbol[symbol] = []
            sentiment_by_symbol[symbol].append(score)

        results = {}
        for symbol, scores in sentiment_by_symbol.items():
            results[symbol] = sum(scores) / len(scores) if scores else 0.0

        return results
    except Exception as e:
        print(f"❌ Sentiment analysis error: {str(e)}")
        return {symbol: 0.0 for symbol in symbols}