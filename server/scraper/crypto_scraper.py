import requests
from datetime import datetime
from ..db.mongo import get_crypto_collection

def fetch_crypto_price(crypto: str):
    try:
        url = f"https://api.coingecko.com/api/v3/simple/price?ids={crypto}&vs_currencies=usd"
        response = requests.get(url)
        data = response.json()
        if crypto in data:
            return {
                "symbol": crypto,
                "price": data[crypto]["usd"],
                "timestamp": datetime.utcnow()
            }
        return None
    except Exception as e:
        print(f"⚠️ Error fetching {crypto}: {str(e)}")
        return None

def update_crypto_rates(cryptos: list):
    try:
        col = get_crypto_collection()
        results = [fetch_crypto_price(crypto) for crypto in cryptos]
        valid_results = [result for result in results if result]
        if valid_results:
            col.insert_many(valid_results)
            print("✅ Crypto rates updated")
        else:
            print("⚠️ No valid crypto prices fetched")
    except Exception as e:
        print(f"❌ Error in crypto pipeline: {str(e)}")