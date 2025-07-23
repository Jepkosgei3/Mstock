# server/db.py
from motor.motor_asyncio import AsyncIOMotorClient
import os

MONGO_URL = os.getenv("MONGO_URL", "mongodb+srv://cosydeveloper:fMhrXwdk9H5PpC9p@bug-tracker-cluster.gmszx4m.mongodb.net/mstock?retryWrites=true&w=majority")
client = AsyncIOMotorClient(MONGO_URL)
db = client["mstock"]
