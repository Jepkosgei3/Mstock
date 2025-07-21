import { useEffect, useState } from "react";
import { fetchTrend } from "../api";

export default function TrendPrediction() {
  const [predictions, setPredictions] = useState([]);

  useEffect(() => {
    fetchTrend().then((res) => setPredictions(res.data));
  }, []);

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-lg font-semibold mb-2">🔮 Trend Predictions</h2>
      <ul className="text-sm">
        {predictions.map((item, idx) => (
          <li key={idx} className="flex justify-between border-b py-1">
            <span>{item.symbol}</span>
            <span>{item.trend}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
