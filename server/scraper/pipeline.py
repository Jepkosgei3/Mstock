from server.scraper.price_scraper import fetch_and_save_price_data
from server.scraper.movers_scraper import fetch_and_save_market_movers
from server.scraper.sentiment_scraper import fetch_and_save_sentiment
from server.scraper.trend_predictor import predict_and_save_trends

async def run_pipeline(db):
    print("📊 Fetching price data...")
    await fetch_and_save_price_data(db)

    print("📈 Fetching market movers...")
    await fetch_and_save_market_movers(db)

    print("🗞️ Fetching sentiment text...")
    await fetch_and_save_sentiment(db)

    print("📉 Predicting trends...")
    await predict_and_save_trends(db)

    print("✅ Pipeline completed")
