import yfinance as yf
from datetime import datetime
from ..db.mongo import get_market_movers_collection

def fetch_top_movers():
    try:
        col = get_market_movers_collection()
        gainers = ["AAPL", "MSFT", "TSLA"]
        losers = ["META", "NFLX", "AMZN"]
        movers = []

        for symbol in gainers + losers:
            stock = yf.Ticker(symbol)
            info = stock.info
            movers.append({
                'symbol': symbol,
                'name': info.get('shortName', ''),
                'price': info.get('currentPrice', 0),
                'change': info.get('regularMarketChange', 0),
                'change_percent': info.get('regularMarketChangePercent', 0),
                'volume': info.get('volume', 0),
                'category': 'gainer' if symbol in gainers else 'loser',
                'timestamp': datetime.utcnow()
            })

        col.delete_many({})
        col.insert_many(movers)
        print("✅ Market movers updated")
    except Exception as e:
        print(f"❌ Error in market movers: {str(e)}")