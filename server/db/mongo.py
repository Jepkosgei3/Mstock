from pymongo import MongoClient
import os

MONGO_URI = os.getenv(
    "MONGO_URI",
    "mongodb+srv://Mstock:MstockAdmin@bug-tracker-cluster.gmszx4m.mongodb.net/mstock?retryWrites=true&w=majority"
)
DB_NAME = "mstock"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

def get_collection(collection_name):
    return db[collection_name]
