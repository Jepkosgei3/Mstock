import { useEffect, useState } from "react";
import { fetchMovers } from "../api";

export default function MoversList() {
  const [movers, setMovers] = useState([]);

  useEffect(() => {
    fetchMovers().then((res) => setMovers(res.data));
  }, []);

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-lg font-semibold mb-2">🚀 Market Movers</h2>
      <ul className="text-sm">
        {movers.map((mover, idx) => (
          <li key={idx} className="flex justify-between border-b py-1">
            <span>{mover.symbol}</span>
            <span>{mover.change_percent}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
