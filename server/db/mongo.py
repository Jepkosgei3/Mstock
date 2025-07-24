from pymongo import MongoClient
import os

MONGO_URI = (os.getenv("MONGO_URI"))
DB_NAME = "mstock"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def get_collection(collection_name):
    return db[collection_name]
