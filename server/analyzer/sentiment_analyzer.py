import json
from textblob import TextBlob

def analyze_sentiment(tickers, texts):
    if not texts:
        return {}

    scores = {}
    for ticker in tickers:
        relevant_texts = [t for t in texts if ticker in t]
        if not relevant_texts:
            scores[ticker] = 0.0
            continue

        polarities = []
        for text in relevant_texts:
            blob = TextBlob(text)
            polarities.append(blob.sentiment.polarity)

        avg_score = sum(polarities) / len(polarities)
        scores[ticker] = avg_score

    # Save sentiment scores
    with open("server/data/sentiment.json", "w") as f:
        json.dump(scores, f, indent=2)
    
    print("[✓] Saved sentiment scores")
    return scores


def interpret_trend(score):
    if score > 0.2:
        return "UP trend likely 📈"
    elif score < -0.2:
        return "DOWN trend likely 📉"
    else:
        return "SIDEWAYS trend likely ⏸️"
