import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Gauge } from "@mui/x-charts/Gauge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { FiTrendingUp, FiTrendingDown, FiActivity } from "react-icons/fi";
import { format } from "date-fns";
import { fetchSentiment } from "../services/api";

const formatTimestamp = (timestamp) => {
  try {
    return format(new Date(timestamp), "MMM dd, yyyy h:mm aa");
  } catch {
    return "Unknown";
  }
};

const getSentimentColor = (score) => {
  if (score > 0.3) return "var(--success)";
  if (score < -0.3) return "var(--danger)";
  return "var(--warning)";
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
    refetchInterval: 300000,
  });

  const aggregatedSentiment = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    const symbolMap = {};
    data.forEach((item) => {
      if (!symbolMap[item.symbol]) {
        symbolMap[item.symbol] = { symbol: item.symbol, scores: [], timestamp: item.timestamp };
      }
      symbolMap[item.symbol].scores.push({ score: item.score, magnitude: item.magnitude, date: item.timestamp });
    });
    return Object.values(symbolMap);
  }, [data]);

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex justify-center items-center h-32">
          <div className="spinner"></div>
          <p className="ml-2 text-lg text-gray-500">Loading sentiment data...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="card">
        <p className="text-[var(--danger)]">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="card-title">Market Sentiment Analysis</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {aggregatedSentiment.map((item) => (
          <div key={item.symbol} className="chart-container">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-lg">{item.symbol}</h3>
              <div className="flex items-center">
                <span
                  className="text-sm px-2 py-1 rounded-full"
                  style={{
                    backgroundColor: getSentimentColor(item.scores[0]?.score) + "20",
                    color: getSentimentColor(item.scores[0]?.score),
                  }}
                >
                  {getSentimentLabel(item.scores[0]?.score)}
                </span>
                <span className="ml-2 text-sm text-gray-500">
                  {item.scores[0]?.score > 0 ? "▲" : "▼"}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-center h-40">
              <Gauge
                width={120}
                height={120}
                value={(item.scores[0]?.score || 0) * 100}
                valueMin={-100}
                valueMax={100}
                startAngle={-110}
                endAngle={110}
                text={() => ""}
                sx={{
                  "& .MuiGauge-valueArc": {
                    fill: getSentimentColor(item.scores[0]?.score),
                    strokeWidth: 10,
                  },
                  "& .MuiGauge-trackArc": {
                    fill: "var(--background)",
                    strokeWidth: 10,
                  },
                }}
              />
              <div className="text-center">
                <p className="text-lg font-bold" style={{ color: getSentimentColor(item.scores[0]?.score) }}>
                  {(item.scores[0]?.score || 0).toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">Sentiment Score</p>
                <p className="text-xs text-gray-500 mt-1">Magnitude: {(item.scores[0]?.magnitude || 0).toFixed(2)}</p>
              </div>
            </div>
            <div className="mt-4">
              <ResponsiveContainer width="100%" height={120}>
                <LineChart data={item.scores}>
                  <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                  <XAxis 
                    dataKey="date" 
                    tickFormatter={(date) => format(new Date(date), "MMM dd")}
                    tick={{ fontSize: 10 }}
                    angle={-45}
                    textAnchor="end"
                  />
                  <YAxis 
                    domain={["auto", "auto"]}
                    tick={{ fontSize: 10 }}
                    tickFormatter={(value) => value.toFixed(2)}
                  />
                  <Tooltip
                    formatter={(value) => value.toFixed(2)}
                    labelFormatter={(label) => formatTimestamp(label)}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                      padding: "8px",
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="score" 
                    stroke={getSentimentColor(item.scores[0]?.score)} 
                    strokeWidth={2}
                    dot={{ fill: getSentimentColor(item.scores[0]?.score) }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-2 text-sm">
              <p className="text-gray-500">Updated: {formatTimestamp(item.timestamp)}</p>
              <p className="text-gray-500">Confidence: {(item.scores[0]?.confidence || 0).toFixed(1)}%</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}