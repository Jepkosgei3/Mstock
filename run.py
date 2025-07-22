from server.scraper.price_scraper import fetch_and_save_price_data
from server.scraper.market_movers import fetch_top_movers as fetch_market_movers
from server.scraper.sentiment_scraper import fetch_sentiment_text
from server.analyzer.sentiment_analyzer import analyze_sentiment
from server.analyzer.predictor import predict_trend

def run_pipeline():
    print("📊 Fetching price data...")
    fetch_and_save_price_data(["AAPL", "TSLA"])

    print("📈 Fetching market movers...")
    fetch_market_movers()

    print("🗞️ Fetching sentiment text...")
    texts = fetch_sentiment_text()

    print("🧠 Analyzing sentiment...")
    sentiment_scores = analyze_sentiment(["AAPL", "TSLA"], texts)

    print("📉 Predicting trends...")
    predict_trend(["AAPL", "TSLA"], sentiment_scores)

if __name__ == "__main__":
    run_pipeline()  # just run the pipeline, no need to start server here
