import requests
from bs4 import BeautifulSoup
from server.db.mongo import get_collection

URL = "https://finance.yahoo.com/most-active"

def fetch_top_movers():
    print("📈 Fetching market movers...")
    try:
        response = requests.get(URL, headers={"User-Agent": "Mozilla/5.0"})
        response.raise_for_status()
    except Exception as e:
        print(f"❌ Failed to fetch market movers: {e}")
        return

    soup = BeautifulSoup(response.text, "html.parser")

    # Try locating the table again
    table = soup.find("table")
    if not table:
        print("❌ Could not find the market movers table.")
        return

    rows = table.select("tbody tr")[:10]
    movers = []

    for row in rows:
        cols = row.find_all("td")
        if len(cols) < 6:
            continue
        movers.append({
            "symbol": cols[0].text.strip(),
            "name": cols[1].text.strip(),
            "price": cols[2].text.strip(),
            "change": cols[3].text.strip(),
            "percent_change": cols[4].text.strip(),
            "volume": cols[5].text.strip(),
        })

    if movers:
        collection = get_collection("market_movers")
        collection.insert_many(movers)
        print(f"✅ Inserted {len(movers)} market movers")
    else:
        print("⚠️ No market movers data found.")
