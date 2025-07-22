# server/scraper/sentiment_scraper.py

import requests
from bs4 import BeautifulSoup
import json
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), '../data/sentiment.json')

def fetch_sentiment_text():
    url = "https://www.google.com/finance"
    response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})

    soup = BeautifulSoup(response.text, "html.parser")
    headlines = []

    for item in soup.select("div[data-entity-type='NEWS'] span"):
        text = item.text.strip()
        if text:
            headlines.append(text)

    # Save to JSON for analyzer
    with open(DATA_PATH, 'w') as f:
        json.dump(headlines, f, indent=2)

    return headlines
