# database.py
from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()

class MongoDB:
    def __init__(self):
        self.client = MongoClient(os.getenv("MONGO_URI"))
        self.db = self.client["stock_prediction_db"]
        
        # Collections
        self.stock_data = self.db["stock_data"]
        self.prediction_results = self.db["prediction_results"]
        self.user_queries = self.db["user_queries"]
        self.tweets = self.db["tweets"]  # New collection
        self.sentiment = self.db["sentiment_scores"]  
    
    def insert_stock_data(self, data):
        return self.stock_data.insert_one(data)
    
    def get_latest_stock_data(self, symbol, limit=100):
        return list(self.stock_data.find({"symbol": symbol})
                          .sort("date", -1)
                          .limit(limit))
    
    def insert_tweet(self, tweet_data):
        return self.tweets.insert_one(tweet_data)
    
    def get_tweets_by_symbol(self, symbol, limit=100):
        return list(self.tweets.find({"symbol": symbol}).limit(limit))
    # Add more database operations as needed