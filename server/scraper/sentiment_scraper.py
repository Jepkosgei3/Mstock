import yfinance as yf

# server/scraper/sentiment_scraper.py

def fetch_sentiment_text(symbols):
    result = {}
    for symbol in symbols:
        # Dummy data or your actual scraping logic here
        result[symbol] = [
            f"{symbol} stock is rising",
            f"{symbol} faces market pressure",
        ]
    return result

