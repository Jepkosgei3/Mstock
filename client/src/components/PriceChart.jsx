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
  ReferenceLine
} from "recharts";
import { FiRefreshCw } from "react-icons/fi";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const fetchPriceData = async () => {
  const symbols = ["AAPL", "TSLA", "GOOGL", "MSFT"];
  const params = new URLSearchParams();
  symbols.forEach(sym => params.append("symbols", sym));
  
  const res = await fetch(`${API_URL}/api/prices?${params.toString()}`);
  if (!res.ok) throw new Error("Failed to fetch price data");
  return res.json();
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
};

const getColor = (symbol) => {
  const colors = {
    AAPL: "#007aff",
    TSLA: "#ff3b30",
    GOOGL: "#34c759",
    MSFT: "#af52de",
  };
  return colors[symbol] || "#8884d8";
};

export default function PriceChart() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["priceData"],
    queryFn: fetchPriceData,
    refetchInterval: 300000, // 5 minutes
  });

  // Transform data for Recharts
  const chartData = React.useMemo(() => {
    if (!data) return [];
    
    // Group by date
    const dateMap = {};
    data.forEach(item => {
      const date = new Date(item.date).toISOString().split('T')[0];
      if (!dateMap[date]) dateMap[date] = { date };
      dateMap[date][item.symbol] = item.close;
    });
    
    return Object.values(dateMap)
      .sort((a, b) => new Date(a.date) - new Date(b.date))
      .map(item => ({
        ...item,
        date: formatDate(item.date)
      }));
  }, [data]);

  if (isLoading) return <div className="p-4 bg-white rounded-lg shadow">Loading price data...</div>;
  if (error) return <div className="p-4 bg-white rounded-lg shadow text-red-500">Error: {error.message}</div>;

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Stock Price Trends</h2>
        <button 
          onClick={() => refetch()}
          className="p-2 rounded-full hover:bg-gray-100"
          title="Refresh data"
        >
          <FiRefreshCw className="text-blue-500" />
        </button>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <YAxis 
              domain={['auto', 'auto']}
              tickFormatter={(value) => `$${value.toFixed(2)}`}
              tick={{ fontSize: 12 }}
              tickMargin={10}
            />
            <Tooltip 
              formatter={(value, name) => [`$${value.toFixed(2)}`, name]}
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Legend />
            <ReferenceLine y={0} stroke="#000" strokeOpacity={0.3} />
            
            {["AAPL", "TSLA", "GOOGL", "MSFT"].map(symbol => (
              <Line
                key={symbol}
                type="monotone"
                dataKey={symbol}
                stroke={getColor(symbol)}
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}