from typing import List, Dict
from datetime import datetime
from ..db.mongo import get_predictions_collection
import numpy as np

def predict_trend(symbols: List[str], sentiment_data: List[Dict]):
    try:
        col = get_predictions_collection()
        predictions = []
        for symbol in symbols:
            symbol_sentiments = [d['score'] for d in sentiment_data if d['symbol'] == symbol]
            avg_sentiment = np.mean(symbol_sentiments) if symbol_sentiments else 0.0
            predictions.append({
                'symbol': symbol,
                'prediction': avg_sentiment,
                'confidence': abs(avg_sentiment),
                'timestamp': datetime.utcnow()
            })
        if predictions:
            col.insert_many(predictions)
            print("✅ Trend predictions updated")
    except Exception as e:
        print(f"❌ Error in trend prediction: {str(e)}")