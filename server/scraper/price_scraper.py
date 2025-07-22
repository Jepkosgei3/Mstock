# server/scraper/price_scraper.py

import yfinance as yf
import pandas as pd
import os

def fetch_and_save_price_data(symbol, days=30):
    df = yf.download(symbol, period=f"{days}d", interval="1d")
    filename = f"server/data/price_{symbol}.csv"
    df.to_csv(filename)
    print(f"[✓] Saved price data for {symbol}")
