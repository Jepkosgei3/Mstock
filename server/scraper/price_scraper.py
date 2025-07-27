import yfinance as yf
from datetime import datetime
from ..db.mongo import get_prices_collection

def fetch_stock_data(symbol: str, days: int = 90):
    try:
        ticker = yf.Ticker(symbol)
        hist = ticker.history(period=f"{days}d").reset_index()
        records = []
        for _, row in hist.iterrows():
            records.append({
                "symbol": symbol,
                "date": row["Date"],
                "open": float(row["Open"]),
                "high": float(row["High"]),
                "low": float(row["Low"]),
                "close": float(row["Close"]),
                "volume": int(row["Volume"]),
                "timestamp": datetime.utcnow()
            })
        return records
    except Exception as e:
        print(f"⚠️ Error fetching {symbol}: {str(e)}")
        return []

def update_prices(symbol: str):
    try:
        col = get_prices_collection()
        stock_data = fetch_stock_data(symbol)
        if stock_data:
            # Remove existing data for this symbol to avoid duplicates
            col.delete_many({"symbol": symbol})
            col.insert_many(stock_data)
            print(f"✅ Updated prices for {symbol}")
    except Exception as e:
        print(f"❌ DB Error for {symbol}: {str(e)}")

def start_price_pipeline(symbols: list):
    try:
        for symbol in symbols:
            update_prices(symbol)
        print("✅ Price data updated")
    except Exception as e:
        print(f"❌ Error in price pipeline: {str(e)}")