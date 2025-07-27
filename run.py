import time
from datetime import datetime
from server.scraper.price_scraper import start_price_pipeline
from server.scraper.crypto_scraper import update_crypto_rates
from server.scraper.sentiment_scraper import fetch_sentiment_text
from server.analyzer.sentiment_analyzer import analyze_sentiment
from server.analyzer.predictor import predict_trend
from server.db.mongo import get_sentiment_collection

def run_pipeline():
    symbols = ["AAPL", "TSLA", "GOOGL", "MSFT"]
    cryptos = ["bitcoin", "ethereum", "solana"]
    
    while True:
        print(f"📅 Starting pipeline at {datetime.now().strftime('%H:%M:%S')}")
        try:
            # Run price and crypto updates
            start_price_pipeline(symbols)
            update_crypto_rates(cryptos)
            
            # Fetch and analyze sentiment
            texts = fetch_sentiment_text(symbols)
            texts_list = [text for symbol_texts in texts.values() for text in symbol_texts]
            sentiment_results = analyze_sentiment(symbols, texts_list)
            
            # Run trend prediction
            sentiment_data = list(get_sentiment_collection().find().sort("timestamp", -1).limit(100))
            predict_trend(symbols, sentiment_data)
            
            print("⏳ Waiting 5 minutes...")
            time.sleep(300)
        except Exception as e:
            print(f"❌ Pipeline error: {str(e)}")
            time.sleep(60)

if __name__ == "__main__":
    run_pipeline()