import yfinance as yf
from datetime import datetime

SYMBOLS = ["AAPL", "TSLA"]

async def fetch_and_save_price_data(db):
    for symbol in SYMBOLS:
        df = yf.download(symbol, period="5d", interval="1d")
        records = df.reset_index().to_dict(orient="records")
        for r in records:
            r["symbol"] = symbol
            r["timestamp"] = datetime.utcnow()
        await db.prices.delete_many({"symbol": symbol})
        await db.prices.insert_many(records)
