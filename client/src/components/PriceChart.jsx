// client/src/components/PriceChart.jsx
import React, { useEffect, useState } from 'react';
import { fetchPriceData } from '../api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const PriceChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchPriceData('AAPL').then(res => {
      const formatted = res.data.map(item => ({
        date: item.date,
        close: item.close,
      }));
      setData(formatted);
    });
  }, []);

  return (
    <div className="p-4 shadow-xl bg-white rounded-xl">
      <h2 className="text-xl font-bold mb-2">AAPL Historical Prices</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="close" stroke="#007bff" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceChart;
