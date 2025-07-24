# server/db.py
from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URL = (os.getenv("MONGO_URI"))
client = AsyncIOMotorClient(MONGO_URL)
db = client["mstock"]
