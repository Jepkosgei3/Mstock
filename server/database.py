from dotenv import load_dotenv
load_dotenv()

import os
from pymongo import MongoClient

MONGO_URI = os.getenv("MONGO_URI")
client = MongoClient(MONGO_URI)
db = client["Mstock"]
