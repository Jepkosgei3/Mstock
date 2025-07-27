from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import prices, sentiment, trend, crypto, movers

app = FastAPI(title="MStock API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include all routers
app.include_router(prices.router)
app.include_router(sentiment.router)
app.include_router(trend.router)
app.include_router(crypto.router)
app.include_router(movers.router)

@app.get("/")
def root():
    return {"message": "Welcome to MStock API"}