import yfinance as yf
from ..db.mongo import get_collection
from datetime import datetime

def fetch_top_movers():
    col = get_collection("market_movers")
    
    # Example implementation - replace with your actual mover logic
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
            'changePercent': info.get('regularMarketChangePercent', 0),
            'category': 'gainer' if symbol in gainers else 'loser',
            'timestamp': datetime.now()
        })
    
    col.delete_many({})
    col.insert_many(movers)
    print("✅ Market movers updated")