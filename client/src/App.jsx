// client/src/App.jsx
import React from 'react';
import PriceChart from './components/PriceChart';
import SentimentGauge from './components/SentimentGauge';
import TrendPrediction from './components/TrendPrediction';
import MarketMovers from './components/MarketMovers';

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <h1 className="text-3xl font-bold text-center mb-4">📈 Mstock Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <PriceChart />
        <SentimentGauge />
        <TrendPrediction />
        <MarketMovers />
      </div>
    </div>
  );
};

export default App;
