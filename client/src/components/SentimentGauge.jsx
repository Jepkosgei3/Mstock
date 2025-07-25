import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Gauge } from "@mui/x-charts/Gauge";
import { FiTrendingUp, FiTrendingDown, FiActivity } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const fetchSentiment = async () => {
  const res = await fetch(`${API_URL}/api/sentiment`);
  if (!res.ok) throw new Error("Failed to fetch sentiment data");
  return res.json();
};

const getSentimentColor = (score) => {
  if (score > 0.3) return "#10b981"; // Positive (green)
  if (score < -0.3) return "#ef4444"; // Negative (red)
  return "#f59e0b"; // Neutral (yellow)
};

const getSentimentLabel = (score) => {
  if (score > 0.3) return "Bullish";
  if (score > 0.1) return "Mildly Bullish";
  if (score < -0.3) return "Bearish";
  if (score < -0.1) return "Mildly Bearish";
  return "Neutral";
};

export default function SentimentGauge() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["sentiment"],
    queryFn: fetchSentiment,
    refetchInterval: 300000, // 5 minutes
  });

  // Aggregate sentiment by symbol
  const aggregatedSentiment = React.useMemo(() => {
    if (!data?.sentiments) return [];
    
    const symbolMap = {};
    data.sentiments.forEach(item => {
      if (!symbolMap[item.symbol]) {
        symbolMap[item.symbol] = {
          symbol: item.symbol,
          total: 0,
          count: 0,
          texts: []
        };
      }
      symbolMap[item.symbol].total += item.sentiment;
      symbolMap[item.symbol].count += 1;
      symbolMap[item.symbol].texts.push(item.text);
    });
    
    return Object.values(symbolMap).map(item => ({
      symbol: item.symbol,
      average: item.total / item.count,
      texts: item.texts
    }));
  }, [data]);

  if (isLoading) return <div className="p-4 bg-white rounded-lg shadow">Loading sentiment data...</div>;
  if (error) return <div className="p-4 bg-white rounded-lg shadow text-red-500">Error: {error.message}</div>;

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Market Sentiment Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {aggregatedSentiment.map((item, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">{item.symbol}</h3>
              <span 
                className="text-sm px-2 py-1 rounded-full"
                style={{
                  backgroundColor: getSentimentColor(item.average) + "20",
                  color: getSentimentColor(item.average)
                }}
              >
                {getSentimentLabel(item.average)}
              </span>
            </div>
            
            <div className="h-40 flex items-center justify-center">
              <Gauge
                width={150}
                height={150}
                value={item.average * 100}
                valueMin={-100}
                valueMax={100}
                startAngle={-110}
                endAngle={110}
                text={() => ""}
                sx={{
                  [`& .MuiGauge-valueText`]: {
                    fontSize: '0px',
                  },
                }}
                colors={[getSentimentColor(item.average)]}
              />
              <div className="absolute text-center">
                <p className="text-2xl font-bold" style={{ color: getSentimentColor(item.average) }}>
                  {item.average.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">Sentiment Score</p>
              </div>
            </div>
            
            <div className="mt-2 text-sm">
              {item.average > 0 ? (
                <div className="flex items-center text-green-500">
                  <FiTrendingUp className="mr-1" />
                  <span>Positive sentiment</span>
                </div>
              ) : item.average < 0 ? (
                <div className="flex items-center text-red-500">
                  <FiTrendingDown className="mr-1" />
                  <span>Negative sentiment</span>
                </div>
              ) : (
                <div className="flex items-center text-yellow-500">
                  <FiActivity className="mr-1" />
                  <span>Neutral sentiment</span>
                </div>
              )}
            </div>
            
            <div className="mt-3 text-xs text-gray-500">
              <p className="font-medium">Recent Sentiment:</p>
              <ul className="list-disc pl-5 mt-1 space-y-1">
                {item.texts.slice(0, 2).map((text, i) => (
                  <li key={i}>{text}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}