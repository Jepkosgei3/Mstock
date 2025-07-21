import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    MONGO_URI: str = os.getenv("MONGO_URI", "mongodb+srv://Mstockadm:pass123@cluster0.mongodb.net/?retryWrites=true&w=majority")

settings = Settings()
