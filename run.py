import asyncio
from server.scraper.pipeline import run_pipeline
from server.config import settings
import motor.motor_asyncio

async def main():
    client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGO_URI)
    db = client.mstock
    await run_pipeline(db)

if __name__ == "__main__":
    asyncio.run(main())
