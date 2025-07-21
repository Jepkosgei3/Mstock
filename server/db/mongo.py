from pymongo import MongoClient
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
client = MongoClient(MONGO_URI)
db = client["mstock"]

price_collection = db["prices"]
sentiment_collection = db["sentiments"]
trend_collection = db["trends"]
movers_collection = db["market_movers"]
