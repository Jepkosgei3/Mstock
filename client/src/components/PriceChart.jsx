import React from "react";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { FiRefreshCw } from "react-icons/fi";
import { format } from "date-fns";
import { fetchStockPrices } from "../services/api";

const formatDate = (dateStr) => {
  try {
    return format(new Date(dateStr), "MMM dd");
  } catch {
    return "N/A";
  }
};

const getColor = (symbol) => {
  const colors = {
    AAPL: "#3b82f6",
    TSLA: "#ef4444",
    GOOGL: "#10b981",
    MSFT: "#8b5cf6",
  };
  return colors[symbol] || "#6b7280";
};

export default function PriceChart() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["priceData"],
    queryFn: () => fetchStockPrices(["AAPL", "TSLA", "GOOGL", "MSFT"]),
    refetchInterval: 300000,
  });

  const chartData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    const dateMap = {};
    data.forEach((item) => {
      const date = new Date(item.date).toISOString().split("T")[0];
      if (!dateMap[date]) dateMap[date] = { date };
      dateMap[date][item.symbol] = item.close;
    });
    return Object.values(dateMap)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map((item) => ({
        ...item,
        date: formatDate(item.date),
      }));
  }, [data]);

  if (isLoading) {
    return (
      <div className="card">
        <div className="flex justify-center items-center h-64">
          <div className="spinner"></div>
          <p className="ml-2 text-lg text-gray-500">Loading price data...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="card">
        <p className="text-[var(--danger)]">Error: {error.message}</p>
        <button onClick={refetch} className="btn mt-2">
          Retry
        </button>
      </div>
    );
  }
  if (chartData.length === 0) {
    return (
      <div className="card">
        <p className="text-gray-500">No price data available</p>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="card-title">Stock Price Trends</h2>
        <div className="flex items-center">
          <select
            className="px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => {
              const symbols = e.target.value.split(',');
              // Update the query with new symbols
              refetch(symbols);
            }}
            defaultValue="AAPL,TSLA,GOOGL,MSFT"
          >
            <option value="AAPL,TSLA,GOOGL,MSFT">All Stocks</option>
            <option value="AAPL">Apple (AAPL)</option>
            <option value="TSLA">Tesla (TSLA)</option>
            <option value="GOOGL">Google (GOOGL)</option>
            <option value="MSFT">Microsoft (MSFT)</option>
          </select>
          <button
            onClick={refetch}
            className="ml-2 p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Refresh data"
          >
            <FiRefreshCw className="text-[var(--secondary)]" />
          </button>
        </div>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }} 
              tickMargin={10}
              angle={-45}
              textAnchor="end"
              height={50}
            />
            <YAxis
              tickFormatter={(value) => `$${value.toFixed(2)}`}
              tick={{ fontSize: 12 }}
              tickMargin={10}
              domain={['auto', 'auto']}
            />
            <Tooltip
              formatter={(value, name) => {
                const symbol = name;
                return [`$${value.toFixed(2)}`, `${symbol} Price`];
              }}
              labelFormatter={(label) => `Date: ${label}`}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "12px"
              }}
              cursor={{ fill: '#f3f4f6' }}
            />
            <Legend 
              layout="vertical"
              align="right"
              verticalAlign="middle"
              wrapperStyle={{ right: 0 }}
            />
            {chartData[0] && Object.keys(chartData[0])
              .filter(key => key !== 'date')
              .map((symbol) => (
                <Line
                  key={symbol}
                  type="monotone"
                  dataKey={symbol}
                  stroke={getColor(symbol)}
                  strokeWidth={2}
                  dot={{ fill: getColor(symbol) }}
                  activeDot={{ 
                    r: 6,
                    stroke: getColor(symbol),
                    strokeWidth: 2
                  }}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}