import requests
from datetime import datetime
from ..db.mongo import get_collection
from typing import List

def fetch_crypto_rates(symbols: List[str]):
    url = "https://api.coingecko.com/api/v3/simple/price"
    params = {
        "ids": ",".join(symbols),
        "vs_currencies": "usd",
        "include_market_cap": "true",
        "include_24hr_vol": "true",
        "include_24hr_change": "true"
    }
    response = requests.get(url, params=params)
    data = response.json()
    return [
        {
            "symbol": symbol.upper(),
            "price": data[symbol.lower()]["usd"],
            "market_cap": data[symbol.lower()]["usd_market_cap"],
            "volume_24h": data[symbol.lower()]["usd_24h_vol"],
            "change_24h": data[symbol.lower()]["usd_24h_change"],
            "timestamp": datetime.now()
        }
        for symbol in symbols
    ]

def update_crypto_rates(symbols: List[str] = ["bitcoin", "ethereum", "solana"]):
    col = get_collection("crypto_rates")
    rates = fetch_crypto_rates(symbols)
    if rates:
        col.insert_many(rates)
        print("✅ Crypto rates updated")