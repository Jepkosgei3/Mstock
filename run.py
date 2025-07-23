# run.py
from server.scraper.price_scraper import fetch_and_save_price_data
from server.scraper.market_movers import fetch_top_movers
from server.scraper.sentiment_scraper import fetch_sentiment_text
from server.analyzer.sentiment_analyzer import analyze_sentiment
from server.analyzer.predictor import predict_trend

def run_pipeline():
    symbols = ["AAPL", "TSLA", "GOOGL", "MSFT"]
    fetch_and_save_price_data(symbols, days=90)
    fetch_top_movers()
    texts = fetch_sentiment_text(symbols)  # returns a flat list
    sentiment = analyze_sentiment(symbols, texts)
    predict_trend(symbols, sentiment)

if __name__ == "__main__":
    run_pipeline()
