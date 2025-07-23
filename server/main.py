from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from server.routers import prices, sentiment, trend, movers



app = FastAPI()

# Allow CORS for frontend on Vite
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(prices.router)
app.include_router(sentiment.router)
app.include_router(movers.router)
app.include_router(trend.router)

@app.get("/")
def read_root():
    return {"message": "Mstock API running"}
