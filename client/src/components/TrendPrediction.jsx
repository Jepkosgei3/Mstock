import { useEffect, useState } from "react";
import API from "../api";

export default function TrendPrediction() {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    API.get("/api/trend")
      .then((res) => setPredictions(res.data.predictions))
      .catch((err) => console.error("Error loading predictions:", err));
  }, []);

  return (
    <div className="p-4 shadow rounded bg-white">
      <h2 className="text-lg font-bold mb-2">Trend Predictions</h2>
      {predictions.map((p, i) => (
        <div key={i}>
          <strong>{p.symbol}:</strong> {p.prediction} at {p.timestamp}
        </div>
      ))}
    </div>
  );
}
