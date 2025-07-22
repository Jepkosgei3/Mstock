// client/src/components/SentimentGauge.jsx
import React, { useEffect, useState } from 'react';
import { fetchSentiment } from '../api';

const SentimentGauge = () => {
  const [score, setScore] = useState(null);

  useEffect(() => {
    fetchSentiment().then(res => setScore(res.data.score));
  }, []);

  return (
    <div className="p-4 shadow-xl bg-white rounded-xl">
      <h2 className="text-xl font-bold mb-2">Sentiment Score</h2>
      <p className="text-3xl font-bold text-green-600">{score !== null ? score : 'Loading...'}</p>
    </div>
  );
};

export default SentimentGauge;
