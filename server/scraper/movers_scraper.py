import requests
from bs4 import BeautifulSoup
import csv
import os

def fetch_google_finance_movers():
    url = "https://www.google.com/finance/markets"
    response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
    soup = BeautifulSoup(response.text, "html.parser")

    movers = []
    for item in soup.select("div[data-id='most_active'] a[data-entity-type='TICKER']"):
        symbol = item.text.strip()
        movers.append(symbol)

    os.makedirs("data/movers", exist_ok=True)
    with open("data/movers/top_movers.csv", "w", newline="") as f:
        writer = csv.writer(f)
        writer.writerow(["Symbol"])
        writer.writerows([[m] for m in movers])
    print("[✓] Saved top market movers")