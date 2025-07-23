import PriceChart from "./components/PriceChart";
import MarketMovers from "./components/MarketMovers";
import SentimentGauge from "./components/SentimentGauge";
import TrendPrediction from "./components/TrendPrediction";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  console.log("🌍 Using backend API:", BASE_URL);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">📈 Mstock Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <PriceChart />
        <MarketMovers />
        <SentimentGauge />
        <TrendPrediction />
      </div>
    </div>
  );
}

export default App;
