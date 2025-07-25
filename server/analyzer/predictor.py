from typing import List, Dict
from datetime import datetime
from ..db.mongo import get_collection
import numpy as np

async def predict_trend(symbols: List[str], sentiment_data: List[Dict]):
    col = await get_collection("predictions")()
    
    predictions = []
    for symbol in symbols:
        symbol_sentiments = [d['polarity'] for d in sentiment_data if d['symbol'] == symbol]
        avg_sentiment = np.mean(symbol_sentiments) if symbol_sentiments else 0
        
        predictions.append({
            'symbol': symbol,
            'prediction': 'bullish' if avg_sentiment > 0 else 'bearish',
            'confidence': abs(avg_sentiment),
            'timestamp': datetime.now()
        })
    
    if predictions:
        await col.insert_many(predictions)