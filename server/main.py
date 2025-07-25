from fastapi import FastAPI
from .routers import prices, sentiment, trend, crypto



app = FastAPI()





# Include all routers
app.include_router(prices.router)
app.include_router(sentiment.router)
app.include_router(trend.router)
app.include_router(crypto.router)

@app.get("/")
async def root():
    return {"message": "MStock API is running"}