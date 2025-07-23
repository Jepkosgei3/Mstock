import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const symbols = ["AAPL", "TSLA", "GOOGL"];

export default function PriceChart() {
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchPrices = async () => {
    try {
      const url = new URL(`${import.meta.env.VITE_API_BASE_URL}/api/prices`);
      symbols.forEach((symbol) => url.searchParams.append("symbols", symbol));

      const response = await fetch(url.toString());
      const result = await response.json();

      // Ensure response is structured like: { AAPL: [...], TSLA: [...], GOOGL: [...] }
      const priceMap = result || {};

      // Get all unique dates across all stocks
      const allDatesSet = new Set();
      symbols.forEach((symbol) => {
        const entries = priceMap[symbol] || [];
        entries.forEach((entry) => {
          const date = new Date(entry.timestamp).toISOString().split("T")[0]; // YYYY-MM-DD
          allDatesSet.add(date);
        });
      });

      const allDates = Array.from(allDatesSet).sort();

      // Build combined data: { date: 'YYYY-MM-DD', AAPL: 120, TSLA: 240, ... }
      const combinedData = allDates.map((date) => {
        const dataPoint = { date };
        symbols.forEach((symbol) => {
          const match = (priceMap[symbol] || []).find((entry) =>
            new Date(entry.timestamp).toISOString().startsWith(date)
          );
          dataPoint[symbol] = match ? match.price : null;
        });
        return dataPoint;
      });

      setChartData(combinedData);
      setLoading(false);
    } catch (error) {
      console.error("❌ Error fetching prices:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  return (
    <div className="bg-white p-4 rounded-xl shadow-md h-[400px]">
      <h2 className="text-lg font-semibold mb-2">📈 Stock Price Trends</h2>
      {loading ? (
        <p>Loading...</p>
      ) : chartData.length === 0 ? (
        <p>No data available.</p>
      ) : (
        <ResponsiveContainer width="100%" height="90%">
          <LineChart data={chartData}>
            <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            {symbols.map((symbol, index) => (
              <Line
                key={symbol}
                type="monotone"
                dataKey={symbol}
                stroke={
                  ["#8884d8", "#82ca9d", "#ff7300"][index % 3] // rotating color palette
                }
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}
