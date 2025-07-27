import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FiArrowUp, FiArrowDown, FiRefreshCw } from "react-icons/fi";
import { format } from "date-fns";
import { fetchMovers, fetchCryptoRates } from "../services/api";
import {
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  Bar,
  Cell,
  LineChart,
  Line,
  Legend as RechartsLegend,
} from "recharts";

const formatTimestamp = (timestamp) => format(new Date(timestamp), "MMM dd HH:mm");

const getCryptoColor = (symbol) => {
  switch (symbol) {
    case "BTC":
      return "#f7931a";
    case "ETH":
      return "#627eea";
    case "LTC":
      return "#34a853";
    default:
      return "#666";
  }
};

export default function MarketMovers() {
  const [period, setPeriod] = useState("1d");

  const { data: movers, isLoading: moversLoading, error: moversError, refetch: refetchMovers } = useQuery({
    queryKey: ["marketMovers", period],
    queryFn: () => fetchMovers(period),
    refetchInterval: 300000,
  });

  const { data: crypto, isLoading: cryptoLoading, error: cryptoError, refetch: refetchCrypto } = useQuery({
    queryKey: ["cryptoRates", period],
    queryFn: () => fetchCryptoRates(period),
    refetchInterval: 300000,
  });

  const gainersChartData = movers?.gainers?.map((stock) => ({
    symbol: stock.symbol,
    change_percent: stock.change_percent,
  })) || [];

  const losersChartData = movers?.losers?.map((stock) => ({
    symbol: stock.symbol,
    change_percent: stock.change_percent,
  })) || [];

  const cryptoChartData = crypto?.map((item) => ({
    timestamp: item.timestamp,
    ...item.rates,
  })) || [];

  const refetch = () => {
    refetchMovers();
    refetchCrypto();
  };

  if (moversLoading || cryptoLoading) {
    return <div className="card">Loading...</div>;
  }

  if (moversError || cryptoError) {
    return (
      <div className="card">
        <p className="text-[var(--danger)]">Error: {moversError?.message || cryptoError?.message}</p>
        <button onClick={refetch} className="btn mt-2">
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="card">
      <div className="flex justify-between items-center mb-4">
        <h2 className="card-title">Market Movers</h2>
        <div className="flex items-center">
          <select
            className="px-3 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setPeriod(e.target.value)}
            value={period}
          >
            <option value="1d">1 Day</option>
            <option value="1w">1 Week</option>
            <option value="1m">1 Month</option>
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-[var(--success)] flex items-center mb-2">
            <FiArrowUp className="mr-2" /> Top Gainers
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gainersChartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="symbol" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" />
              <YAxis 
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12 }}
                domain={[0, 'auto']}
              />
              <RechartsTooltip
                formatter={(value) => `${value}%`}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "12px",
                }}
              />
              <Bar 
                dataKey="change_percent"
                fill="#10b981"
                radius={[4, 4, 0, 0]}
                barSize={20}
              >
                {gainersChartData.map((entry, index) => (
                  <Cell key={`gainer-${index}`} fill={index % 2 === 0 ? '#10b981' : '#22c55e'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-container">
          <h3 className="text-lg font-semibold text-[var(--danger)] flex items-center mb-2">
            <FiArrowDown className="mr-2" /> Top Losers
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={losersChartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="symbol" tick={{ fontSize: 12 }} angle={-45} textAnchor="end" />
              <YAxis 
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12 }}
                domain={[0, 'auto']}
              />
              <RechartsTooltip
                formatter={(value) => `${value}%`}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                  padding: "12px",
                }}
              />
              <Bar 
                dataKey="change_percent"
                fill="#ef4444"
                radius={[4, 4, 0, 0]}
                barSize={20}
              >
                {losersChartData.map((entry, index) => (
                  <Cell key={`loser-${index}`} fill={index % 2 === 0 ? '#ef4444' : '#f87171'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="chart-container mt-4">
        <h3 className="text-lg font-semibold text-[var(--primary)] mb-2">Crypto Prices</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={cryptoChartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(timestamp) => format(new Date(timestamp), "MMM dd")}
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
            />
            <YAxis 
              tickFormatter={(value) => `$${value.toLocaleString()}`}
              tick={{ fontSize: 12 }}
              domain={["auto", "auto"]}
            />
            <RechartsTooltip
              formatter={(value) => `$${value.toLocaleString()}`}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e5e7eb",
                borderRadius: "8px",
                padding: "12px",
              }}
            />
            <RechartsLegend 
              layout="vertical"
              align="right"
              verticalAlign="middle"
              wrapperStyle={{ right: 0 }}
            />
            {cryptoChartData[0] && Object.keys(cryptoChartData[0])
              .filter(key => key !== 'timestamp')
              .map((symbol) => (
                <Line
                  key={symbol}
                  type="monotone"
                  dataKey={symbol}
                  stroke={getCryptoColor(symbol)}
                  strokeWidth={2}
                  dot={{ fill: getCryptoColor(symbol) }}
                />
              ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}