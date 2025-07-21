import { useEffect, useState } from "react";
import { fetchPrices } from "../api";

export default function PriceChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPrices("AAPL").then((res) => setData(res.data || []));
  }, []);

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-lg font-semibold mb-2">📊 AAPL Price Chart</h2>
      <div className="text-sm">
        {data.map((item, i) => (
          <div key={i} className="flex justify-between border-b py-1">
            <span>{item.date}</span>
            <span>${item.close}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
