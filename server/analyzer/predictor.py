import json
from server.analyzer.sentiment_analyzer import interpret_trend

def predict_trend(tickers, sentiment_scores):
    results = {}

    for ticker in tickers:
        score = sentiment_scores.get(ticker, 0.0)
        trend = interpret_trend(score)
        results[ticker] = {
            "sentiment_score": round(score, 3),
            "trend_prediction": trend
        }

    # Save trend predictions
    with open("server/data/predictions.json", "w") as f:
        json.dump(results, f, indent=2)

    print("[✓] Saved predictions")
    return results
