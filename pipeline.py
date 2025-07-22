from scraper.price_scraper import fetch_price_data
from scraper.movers_scraper import fetch_google_finance_movers
from scraper.sentiment_scraper import scrape_sentiment_headlines
from analyzer.sentiment_analyzer import analyze_sentiment, interpret_trend

class StockSentimentPipeline:
    def __init__(self, symbols, days):
        self.symbols = symbols
        self.days = days

    def run(self):
        print("📊 Fetching historical price data...")
        for symbol in self.symbols:
            fetch_price_data(symbol, self.days)

        print("🌐 Scraping Google Finance market movers...")
        fetch_google_finance_movers()

        print("🗞️ Scraping sentiment sources...")
        headlines = scrape_sentiment_headlines()

        print("🧠 Analyzing sentiment...")
        sentiment_score = analyze_sentiment(headlines)
        print(f"\n📈 Sentiment average: {sentiment_score:.2f}" if sentiment_score == sentiment_score else "No sentiment data found")

        print("\n🔎 Predicting trends...")
        trend = interpret_trend(sentiment_score)
        print(f"\n📢 Prediction: {trend}")
