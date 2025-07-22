// client/src/components/MarketMovers.jsx
import React, { useEffect, useState } from 'react';
import { fetchMarketMovers } from '../api';

const MarketMovers = () => {
  const [movers, setMovers] = useState([]);

  useEffect(() => {
    fetchMarketMovers().then(res => setMovers(res.data));
  }, []);

  return (
    <div className="p-4 shadow-xl bg-white rounded-xl">
      <h2 className="text-xl font-bold mb-2">Top Market Movers</h2>
      <ul className="list-disc pl-5">
        {movers.map((mover, i) => (
          <li key={i}>
            {mover.name} ({mover.symbol}) — {mover.change}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MarketMovers;
