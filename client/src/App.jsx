import React from "react";
import Header from "./components/Header";
import PriceChart from "./components/PriceChart";
import MoversList from "./components/MoversList";
import SentimentTable from "./components/SentimentTable";
import TrendPrediction from "./components/TrendPrediction";

function App() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <Header />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        <PriceChart />
        <MoversList />
        <SentimentTable />
        <TrendPrediction />
      </div>
    </div>
  );
}

export default App;
