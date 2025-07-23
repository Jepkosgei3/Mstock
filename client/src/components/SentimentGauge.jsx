import { useEffect, useState } from "react";
import API from "../api";

export default function SentimentGauge() {
  const [sentiments, setSentiments] = useState([]);

  useEffect(() => {
    API.get("/api/sentiment")
      .then((res) => setSentiments(res.data.sentiments))
      .catch((err) => console.error("Error loading sentiment:", err));
  }, []);

  return (
    <div className="p-4 shadow rounded bg-white">
      <h2 className="text-lg font-bold mb-2">Market Sentiment</h2>
      {sentiments.map((s, i) => (
        <div key={i}>
          <strong>{s.symbol}:</strong> {s.text} (Score: {s.sentiment})
        </div>
      ))}
    </div>
  );
}
