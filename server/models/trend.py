from fastapi import APIRouter
from server.config import settings
import motor.motor_asyncio

router = APIRouter()
client = motor.motor_asyncio.AsyncIOMotorClient(settings.MONGO_URI)
db = client.mstock

@router.get("/")
async def get_trends():
    return await db.trends.find({}).to_list(50)
