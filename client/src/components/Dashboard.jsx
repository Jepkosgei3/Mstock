import PriceChart from "./PriceChart";
import SentimentGauge from "./SentimentGauge";
import TopMovers from "./TopMovers";
import TrendPrediction from "./TrendPrediction";

export default function Dashboard() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <PriceChart />
      <SentimentGauge />
      <TopMovers />
      <TrendPrediction />
    </div>
  );
}
