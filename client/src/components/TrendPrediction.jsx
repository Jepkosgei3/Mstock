import React from "react";
import { useQuery } from "@tanstack/react-query";
import { 
  ComposedChart, 
  Line, 
  Area, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from "recharts";
import { FiTrendingUp, FiTrendingDown, FiMinus } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const fetchPredictions = async () => {
  const res = await fetch(`${API_URL}/api/trend`);
  if (!res.ok) throw new Error("Failed to fetch predictions");
  return res.json();
};

const getTrendIcon = (trend) => {
  switch (trend) {
    case "Up":
      return <FiTrendingUp className="text-green-500" />;
    case "Down":
      return <FiTrendingDown className="text-red-500" />;
    default:
      return <FiMinus className="text-yellow-500" />;
  }
};

export default function TrendPrediction() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["predictions"],
    queryFn: fetchPredictions,
    refetchInterval: 300000, // 5 minutes
  });

  // Transform data for chart
  const chartData = React.useMemo(() => {
    if (!data?.predictions) return [];
    
    return data.predictions.map(pred => ({
      symbol: pred.symbol,
      confidence: Math.abs(pred.average_sentiment) * 100,
      trend: pred.predicted_trend,
      score: pred.average_sentiment
    }));
  }, [data]);

  if (isLoading) return <div className="p-4 bg-white rounded-lg shadow">Loading predictions...</div>;
  if (error) return <div className="p-4 bg-white rounded-lg shadow text-red-500">Error: {error.message}</div>;

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Trend Predictions</h2>
      
      <div className="h-80 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="symbol" />
            <YAxis 
              yAxisId="left" 
              orientation="left" 
              domain={[-100, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <YAxis 
              yAxisId="right" 
              orientation="right" 
              domain={[0, 100]}
              tickFormatter={(value) => `${value}%`}
            />
            <Tooltip 
              formatter={(value, name) => {
                if (name === "Confidence") return [`${value}%`, name];
                return [value, name];
              }}
            />
            <Legend />
            <Bar 
              yAxisId="right"
              dataKey="confidence"
              name="Confidence"
              fill="#8884d8"
              barSize={30}
            />
            <Line 
              yAxisId="left"
              type="monotone"
              dataKey="score"
              name="Sentiment Score"
              stroke="#ff7300"
              strokeWidth={2}
              dot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {data?.predictions?.map((pred, index) => (
          <div key={index} className="border rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">{pred.symbol}</h3>
              <div className="flex items-center">
                {getTrendIcon(pred.predicted_trend)}
                <span className="ml-1 text-sm">
                  {pred.predicted_trend}
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Sentiment Score</p>
                <p className={`font-medium ${
                  pred.average_sentiment > 0.1 ? 'text-green-500' : 
                  pred.average_sentiment < -0.1 ? 'text-red-500' : 'text-yellow-500'
                }`}>
                  {pred.average_sentiment.toFixed(2)}
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Confidence</p>
                <p className="font-medium">
                  {(Math.abs(pred.average_sentiment) * 100).toFixed(1)}%
                </p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Last Updated</p>
                <p className="text-sm">
                  {new Date(pred.timestamp).toLocaleTimeString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}