import { useEffect, useState } from "react";
import { fetchSentiment } from "../api";

export default function SentimentTable() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchSentiment().then((res) => setData(res.data));
  }, []);

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-lg font-semibold mb-2">🧠 Sentiment Analysis</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th className="text-left">Symbol</th>
            <th className="text-right">Score</th>
          </tr>
        </thead>
        <tbody>
          {data.map(({ symbol, score }, i) => (
            <tr key={i} className="border-b">
              <td>{symbol}</td>
              <td className="text-right">{score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
