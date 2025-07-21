# server/main.py

from fastapi import FastAPI
from routers.price import router as price_router
from routers.sentiment import router as sentiment_router
from routers.movers import router as movers_router
from routers.trend import router as trend_router
import uvicorn

app = FastAPI(
    title="📈 Mstock Prediction API",
    description="Get historical prices, market sentiment, movers & predicted stock trends.",
    version="1.0.0"
)

# Register API routers
app.include_router(price_router, prefix="/api/prices", tags=["Price Data"])
app.include_router(sentiment_router, prefix="/api/sentiment", tags=["Sentiment"])
app.include_router(movers_router, prefix="/api/movers", tags=["Market Movers"])
app.include_router(trend_router, prefix="/api/trends", tags=["Predictions"])

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
