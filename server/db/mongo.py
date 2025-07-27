from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
DB_NAME = "mstock"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def get_collection(collection_name: str):
    return db[collection_name]

# Collection getters
get_sentiment_collection = lambda: get_collection("sentiment")
get_predictions_collection = lambda: get_collection("predictions")
get_market_movers_collection = lambda: get_collection("movers")
get_prices_collection = lambda: get_collection("prices")
get_crypto_collection = lambda: get_collection("crypto_rates")