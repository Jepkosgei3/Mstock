import time
from datetime import datetime
from server.scraper.price_scraper import start_price_pipeline
from server.scraper.crypto_scraper import update_crypto_rates
from server.scraper.sentiment_scraper import fetch_sentiment_text
from server.analyzer.sentiment_analyzer import analyze_sentiment
from server.analyzer.predictor import predict_trend

def run_pipeline():
    symbols = ["AAPL", "TSLA", "GOOGL", "MSFT"]
    cryptos = ["bitcoin", "ethereum", "solana"]
    
    while True:
        print(f"📅 Starting pipeline at {datetime.now().strftime('%H:%M:%S')}")
        
        # Run all tasks
        start_price_pipeline(symbols)
        update_crypto_rates(cryptos)
        
        texts = fetch_sentiment_text(symbols)
        sentiment = analyze_sentiment(symbols, texts)
        predict_trend(symbols, sentiment)
        
        print(f"⏳ Pipeline completed. Waiting 5 minutes...")
        time.sleep(300)

if __name__ == "__main__":
    try:
        run_pipeline()
    except KeyboardInterrupt:
        print("🛑 Pipeline stopped by user")