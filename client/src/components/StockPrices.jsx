import React from "react";
import { useQuery } from "@tanstack/react-query";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { format } from "date-fns";
import { fetchStockPrices } from "../services/api";

const formatTimestamp = (timestamp) => {
  try {
    return format(new Date(timestamp), "MMM dd, yyyy h:mm aa");
  } catch {
    return "Unknown";
  }
};

export default function StockPrices() {
  const { data: stocks, isLoading, error } = useQuery({
    queryKey: ["stockPrices"],
    queryFn: () => fetchStockPrices(["AAPL", "TSLA", "GOOGL", "MSFT"]),
    refetchInterval: 300000,
  });

  const chartData = React.useMemo(() => {
    if (!stocks || !Array.isArray(stocks)) return [];
    const dateMap = {};
    stocks.forEach((item) => {
      const date = new Date(item.date).toISOString().split("T")[0];
      if (!dateMap[date]) dateMap[date] = { date };
      dateMap[date][item.symbol] = item.close;
    });
    return Object.values(dateMap)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((item) => ({
        ...item,
        date: format(new Date(item.date), "MMM dd"),
      }));
  }, [stocks]);

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex justify-center items-center h-32">
          <div className="spinner"></div>
          <p className="ml-2 text-lg text-gray-500">Loading stock data...</p>
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
  if (!stocks || stocks.length === 0) {
    return (
      <div className="card">
        <p className="text-gray-500">No stock data available</p>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="card-title">Stock Prices</h2>
      <div className="chart-container mb-4">
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tickFormatter={(value) => `$${value.toFixed(2)}`} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            {["AAPL", "TSLA", "GOOGL", "MSFT"].map((symbol) => (
              <Line
                key={symbol}
                type="monotone"
                dataKey={symbol}
                stroke={["#3b82f6", "#ef4444", "#10b981", "#8b5cf6"][["AAPL", "TSLA", "GOOGL", "MSFT"].indexOf(symbol)]}
                dot={false}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Symbol</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Price</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Change</th>
              <th className="px-4 py-2 text-left text-sm font-semibold text-gray-600">Date</th>
            </tr>
          </thead>
          <tbody>
            {stocks.slice(0, 10).map((stock) => (
              <tr key={stock.id} className="border-t hover:bg-gray-50 transition-colors">
                <td className="px-4 py-2">{stock.symbol === "GOOLG" ? "GOOGL" : stock.symbol}</td>
                <td className="px-4 py-2">${stock.close.toFixed(2)}</td>
                <td className={`px-4 py-2 ${stock.close >= stock.open ? "text-[var(--success)]" : "text-[var(--danger)]"}`}>
                  {(stock.close - stock.open).toFixed(2)}
                </td>
                <td className="px-4 py-2">{formatTimestamp(stock.date)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}