# server/scraper/price_scraper.py

import yfinance as yf
from ..db.mongo import get_collection

def fetch_and_save_price_data(symbols, days=30):
    col = get_collection("price_data")
    for s in symbols:
        print(f"📈 Fetching prices for {s}...")
        df = yf.download(s, period=f"{days}d", interval="1d", auto_adjust=True)
        if df.empty:
            print(f"⚠️ No data for {s}")
            continue

        records = []
        for date, row in df.iterrows():
            records.append({
                "symbol": s,
                "date": date.to_pydatetime(),
                "open": row["Open"].item(),
                "high": row["High"].item(),
                "low": row["Low"].item(),
                "close": row["Close"].item(),
                "volume": row["Volume"].item(),
            })

        if records:
            col.delete_many({"symbol": s})
            col.insert_many(records)
            print(f"✅ Inserted {len(records)} price records for {s}")
