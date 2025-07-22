# server/scraper/market_movers.py

import json
import requests
from bs4 import BeautifulSoup
import os

DATA_PATH = os.path.join(os.path.dirname(__file__), '../data/market_movers.json')

def fetch_top_movers():
    url = 'https://www.google.com/finance/markets/most-active'
    headers = {"User-Agent": "Mozilla/5.0"}

    response = requests.get(url, headers=headers)
    soup = BeautifulSoup(response.text, 'html.parser')

    movers = []

    for item in soup.select('div[jsname="vWLAgc"]'):
        try:
            symbol = item.select_one('div[role="heading"]').text.strip()
            name = item.select_one('div[data-name="Company"]').text.strip()
            price = item.select_one('div[data-name="Last price"]').text.strip()
            change = item.select_one('div[data-name="Change"]').text.strip()

            movers.append({
                "symbol": symbol,
                "name": name,
                "price": price,
                "change": change
            })
        except AttributeError:
            continue

    with open(DATA_PATH, 'w') as f:
        json.dump(movers, f, indent=2)

    return movers
