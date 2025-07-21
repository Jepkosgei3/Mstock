from fastapi import APIRouter
from .price import router as price_router
from .movers import router as movers_router
from .sentiment import router as sentiment_router
from .trend import router as trend_router

router = APIRouter()
router.include_router(price_router, prefix="/price")
router.include_router(movers_router, prefix="/movers")
router.include_router(sentiment_router, prefix="/sentiment")
router.include_router(trend_router, prefix="/trend")
