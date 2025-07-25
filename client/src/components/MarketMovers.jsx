import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { FiArrowUp, FiArrowDown, FiRefreshCw } from "react-icons/fi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
  Title
);

const API_URL = import.meta.env.VITE_API_BASE_URL;

const fetchMarketMovers = async () => {
  const res = await fetch(`${API_URL}/api/movers`);
  if (!res.ok) throw new Error("Failed to fetch market movers");
  return res.json();
};

export default function MarketMovers() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["marketMovers"],
    queryFn: fetchMarketMovers,
    refetchInterval: 300000, // 5 minutes
  });

  const topGainers = data?.top_gainers || [];
  const topLosers = data?.top_losers || [];
  const exchangeRates = data?.exchange_rates || {};

  const gainersChartData = {
    labels: topGainers.map((item) => item.symbol),
    datasets: [
      {
        label: "Gain %",
        data: topGainers.map((item) => 
          parseFloat(item.percent_change.replace("%", ""))
        ),
        backgroundColor: "rgba(34, 197, 94, 0.7)",
        borderColor: "rgba(34, 197, 94, 1)",
        borderWidth: 1,
      },
    ],
  };

  const losersChartData = {
    labels: topLosers.map((item) => item.symbol),
    datasets: [
      {
        label: "Loss %",
        data: topLosers.map((item) => 
          Math.abs(parseFloat(item.percent_change.replace("%", "")))
        ),
        backgroundColor: "rgba(239, 68, 68, 0.7)",
        borderColor: "rgba(239, 68, 68, 1)",
        borderWidth: 1,
      },
    ],
  };

  const exchangeChartData = {
    labels: Object.keys(exchangeRates),
    datasets: [
      {
        label: "Exchange Rate (USD)",
        data: Object.values(exchangeRates),
        borderColor: "rgba(99, 102, 241, 1)",
        backgroundColor: "rgba(99, 102, 241, 0.1)",
        tension: 0.3,
        fill: true,
      },
    ],
  };

  if (isLoading) return <div className="p-4 bg-white rounded-lg shadow">Loading market data...</div>;
  if (error) return <div className="p-4 bg-white rounded-lg shadow text-red-500">Error: {error.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Market Overview</h2>
        <button 
          onClick={() => refetch()}
          className="p-2 rounded-full hover:bg-gray-100"
          title="Refresh data"
        >
          <FiRefreshCw className="text-blue-500" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gainers Card */}
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center text-green-600">
              <FiArrowUp className="mr-2" /> Top Gainers
            </h3>
            <span className="text-xs text-gray-500">
              Updated: {new Date(data.last_updated).toLocaleTimeString()}
            </span>
          </div>
          <Bar 
            data={gainersChartData} 
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (ctx) => `${ctx.raw}%`
                  }
                }
              },
              scales: {
                y: {
                  ticks: {
                    callback: (value) => `${value}%`
                  }
                }
              }
            }} 
            height={200}
          />
          <div className="mt-4 space-y-2">
            {topGainers.slice(0, 5).map((stock) => (
              <div key={stock.symbol} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <div>
                  <span className="font-medium">{stock.symbol}</span>
                  <span className="text-gray-500 text-sm ml-2">{stock.name}</span>
                </div>
                <span className="font-medium text-green-600">
                  +{stock.percent_change}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Losers Card */}
        <div className="bg-white p-4 rounded-xl shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center text-red-600">
              <FiArrowDown className="mr-2" /> Top Losers
            </h3>
            <span className="text-xs text-gray-500">
              Updated: {new Date(data.last_updated).toLocaleTimeString()}
            </span>
          </div>
          <Bar 
            data={losersChartData} 
            options={{
              responsive: true,
              plugins: {
                legend: { display: false },
                tooltip: {
                  callbacks: {
                    label: (ctx) => `${ctx.raw}%`
                  }
                }
              },
              scales: {
                y: {
                  ticks: {
                    callback: (value) => `${value}%`
                  }
                }
              }
            }} 
            height={200}
          />
          <div className="mt-4 space-y-2">
            {topLosers.slice(0, 5).map((stock) => (
              <div key={stock.symbol} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                <div>
                  <span className="font-medium">{stock.symbol}</span>
                  <span className="text-gray-500 text-sm ml-2">{stock.name}</span>
                </div>
                <span className="font-medium text-red-600">
                  {stock.percent_change}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Exchange Rates Card */}
      <div className="bg-white p-4 rounded-xl shadow">
        <h3 className="text-lg font-semibold mb-4">Currency Exchange Rates (USD Base)</h3>
        <Line 
          data={exchangeChartData} 
          options={{
            responsive: true,
            plugins: {
              tooltip: {
                callbacks: {
                  label: (ctx) => `1 USD = ${ctx.raw} ${ctx.label}`
                }
              }
            }
          }} 
          height={200}
        />
      </div>
    </div>
  );
}