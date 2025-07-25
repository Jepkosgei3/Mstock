import yfinance as yf
from datetime import datetime, timedelta
from ..db.mongo import get_collection
from typing import List

def fetch_stock_data(symbol: str, days: int = 90):
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    stock = yf.Ticker(symbol)
    data = stock.history(
        start=start_date.strftime('%Y-%m-%d'),
        end=end_date.strftime('%Y-%m-%d'),
        interval='1d'
    )
    return data.reset_index()

def save_price_data(symbol: str, data):
    col = get_collection("price_data")
    records = []
    for _, row in data.iterrows():
        record = {
            'symbol': symbol,
            'date': row['Date'].to_pydatetime(),
            'open': float(row['Open']),
            'high': float(row['High']),
            'low': float(row['Low']),
            'close': float(row['Close']),
            'volume': int(row['Volume']),
            'timestamp': datetime.now()
        }
        records.append(record)
    
    if records:
        col.update_one(
            {"symbol": symbol},
            {"$set": {"latest": records[0]}},
            upsert=True
        )
        col.insert_many(records)

def start_price_pipeline(symbols: List[str], days: int = 90):
    for symbol in symbols:
        print(f"📈 Fetching {days} days of data for {symbol}")
        try:
            data = fetch_stock_data(symbol, days)
            save_price_data(symbol, data)
        except Exception as e:
            print(f"⚠️ Error fetching {symbol}: {e}")
    print("✅ Price data updated")