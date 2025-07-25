import React from 'react';
import { useStockData } from '../hooks/useStockData';

const SentimentAnalysis = () => {
  const { sentiments, loading, error } = useStockData();

  if (loading) return <div>Loading sentiment data...</div>;
  if (error) return <div>Error: {error}</div>;

  const getSentimentColor = (score) => {
    if (score > 0) return 'green';
    if (score < 0) return 'red';
    return 'gray';
  };

  return (
    <div className="sentiment-analysis">
      <h2>Market Sentiment</h2>
      <div className="sentiment-grid">
        {sentiments.map(item => (
          <div key={item._id} className="sentiment-item">
            <div className="symbol">{item.symbol}</div>
            <div className="text">{item.text}</div>
            <div 
              className="score" 
              style={{ color: getSentimentColor(item.sentiment) }}
            >
              {item.sentiment > 0 ? 'Positive' : item.sentiment < 0 ? 'Negative' : 'Neutral'}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SentimentAnalysis;