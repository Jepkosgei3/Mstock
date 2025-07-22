// client/src/components/TrendPrediction.jsx
import React, { useEffect, useState } from 'react';
import { fetchTrend } from '../api';

const TrendPrediction = () => {
  const [trend, setTrend] = useState('');

  useEffect(() => {
    fetchTrend().then(res => setTrend(res.data.prediction));
  }, []);

  return (
    <div className="p-4 shadow-xl bg-white rounded-xl">
      <h2 className="text-xl font-bold mb-2">Predicted Trend</h2>
      <p className="text-2xl">{trend || 'Loading...'}</p>
    </div>
  );
};

export default TrendPrediction;
