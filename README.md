
# 📊 Mstock – Market Prediction Dashboard

Mstock is a full-stack stock market prediction and analysis dashboard. It combines real-time market data, sentiment analysis, historical price trends, and machine learning predictions to help users understand and anticipate stock performance.

---

## 🚀 Features

- 📈 **Price Trends**: Interactive charts for historical stock prices (line and candlestick).
- 💹 **Market Movers**: Real-time top gainers and losers in the market.
- 🧠 **Sentiment Analysis**: Live and historical sentiment scoring from news and Twitter.
- 🔮 **Stock Predictions**: Forecast future trends using ML models.
- 🧲 **Data Storage**: MongoDB-powered backend for fast and persistent data retrieval.
- ⚡ **FastAPI Backend**: Scalable RESTful APIs for all data pipelines.
- 🖥️ **React Frontend**: Vite + Tailwind dashboard with dynamic data visualizations.

---

## 📁 Project Structure

```

Mstock/
│
├── client/                 # Frontend (React + Vite + Tailwind)
│   ├── components/         # Chart and UI components
│   ├── App.jsx             # Main app entry
│   └── index.js            # Root React render
│
├── server/                 # Backend (FastAPI)
│   ├── api/                # Route handlers
│   ├── db/                 # MongoDB utility
│   ├── scraper/            # Market + sentiment scrapers
│   ├── prediction/         # ML prediction models
│   ├── run.py              # App entry point
│   └── requirements.txt    # Backend dependencies
│
└── README.md               # This file

````

---

## ⚙️ Setup Instructions

### 🔧 Backend Setup

```bash
cd server
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
./start.sh
````

> 🔐 Add your MongoDB credentials to a `.env` file or directly into `get_collection()` if using a local test DB.

### 💻 Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## 🧪 Technologies Used

* **Frontend**: React, Tailwind CSS, Recharts
* **Backend**: FastAPI, Pydantic
* **Data**: yfinance, Alpha Vantage, Twitter API
* **Database**: MongoDB Atlas
* **Prediction**: scikit-learn, pandas, NumPy

---

## 📦 API Endpoints

* `GET /api/price/{symbol}` – Historical stock prices
* `GET /api/sentiment/{symbol}` – Sentiment over time
* `GET /api/predict/{symbol}` – ML trend prediction
* `GET /api/movers` – Market movers (gainers/losers)

---

## 📊 Dashboard Components

* `PriceChart` – Historical/candlestick visualization
* `MarketMovers` – Real-time gainer/loser bar chart
* `SentimentGauge` – Live sentiment score
* `TrendPrediction` – Forecast and confidence level

---

## 📍 Future Enhancements

* 📱 Mobile responsive UI
* 📬 Notifications for key market moves
* 🧠 Deep learning models (LSTM)
* 🧾 Exportable reports

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss your proposed changes.


## 🧑‍💻 Author

**Mercy Jepkosgei**
💼 Cloud | Data | DevOps
