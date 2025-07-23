import { useEffect, useState } from "react";
import API from "../api";

export default function MarketMovers() {
  const [movers, setMovers] = useState([]);

  useEffect(() => {
    API.get("/api/movers")
      .then((res) => setMovers(res.data.movers))
      .catch((err) => console.error("Error loading movers:", err));
  }, []);

  return (
    <div className="p-4 shadow rounded bg-white">
      <h2 className="text-lg font-bold mb-2">Top Market Movers</h2>
      {movers.map((m, i) => (
        <div key={i}>
          <strong>{m.symbol}:</strong> {m.change} ({m.direction})
        </div>
      ))}
    </div>
  );
}
