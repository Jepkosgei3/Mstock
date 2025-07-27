import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMovers } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { FiRefreshCw } from 'react-icons/fi';

const TopMovers = () => {
  const [selectedStocks, setSelectedStocks] = useState([]);
  const [sortBy, setSortBy] = useState('change');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['topMovers'],
    queryFn: fetchMovers,
    refetchInterval: 300000, // 5 minutes
  });

  const processedData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return { stocks: [], chartData: [] };

    const stocks = data
      .map((stock) => ({
        symbol: stock.symbol === 'GOOLG' ? 'GOOGL' : stock.symbol,
        price: parseFloat(stock.price) || (stock.confidence * 10) || 0,
        change: stock.change || stock.prediction || 0,
        confidence: stock.confidence ? (stock.confidence * 100).toFixed(1) : '0.0',
        timestamp: stock.timestamp || new Date().toISOString(),
        history: stock.history || Array(10).fill().map((_, i) => ({
          time: new Date(Date.now() - (9 - i) * 3600000).toISOString(),
          price: (parseFloat(stock.price) || 100) * (1 + (Math.random() - 0.5) * 0.1),
        })),
     的朋友
      }))
      .sort((a, b) => {
        if (sortBy === 'change') return Math.abs(b.change) - Math.abs(a.change);
        return b.confidence - a.confidence;
      })
      .slice(0, 8);

    const chartData = [];
    const latestTimestamp = new Date().getTime();
    for (let i = 9; i >= 0; i--) {
      const time = new Date(latestTimestamp - i * 3600000).toISOString();
      const entry = { time: new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) };
      stocks.forEach((stock) => {
        entry[stock.symbol] = stock.history[9 - i].price;
      });
      chartData.push(entry);
    }

    return { stocks, chartData };
  }, [data, sortBy]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setIsRefreshing(false);
  };

  const handleStockFilter = (e) => {
    const value = e.target.value;
    setSelectedStocks((prev) =>
      prev.includes(value) ? prev.filter((s) => s !== value) : [...prev, value]
    );
  };

  const handleSortChange = (e) => {
    setSortBy(e.target.value);
  };

  if (isLoading) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-5xl mx-auto">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-lg text-gray-600">Loading top movers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-5xl mx-auto">
        <p className="text-red-500 font-medium">Error: {error.message}</p>
      </div>
    );
  }

  const availableStocks = Array.from(new Set(processedData.stocks.map((s) => s.symbol)));
  const filteredStocks = selectedStocks.length > 0 ? processedData.stocks.filter((s) => selectedStocks.includes(s.symbol)) : processedData.stocks;

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Top Movers</h2>
        <div className="flex space-x-4">
          <select
            className="px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={handleSortChange}
            value={sortBy}
            aria-label="Sort by"
          >
            <option value="change">Sort by Change</option>
            <option value="confidence">Sort by Confidence</option>
          </select>
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 ${
              isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            aria-label="Refresh top movers"
          >
            <FiRefreshCw className={`mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>
      <div className="mb-6">
        <label className="text-sm font-medium text-gray-700">Filter Stocks:</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {availableStocks.map((symbol) => (
            <label key={symbol} className="inline-flex items-center">
              <input
                type="checkbox"
                value={symbol}
                checked={selectedStocks.includes(symbol)}
                onChange={handleStockFilter}
                className="form-checkbox h-5 w-5 text-blue-600"
              />
              <span className="ml-2 text-sm text-gray-600">{symbol}</span>
            </label>
          ))}
        </div>
      </div>
      <div className="h-96 mb-6">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={processedData.chartData}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12 }}
              tickFormatter={(time) => new Date(time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              angle={-45}
              textAnchor="end"
            />
            <YAxis
              tickFormatter={(value) => `$${value.toFixed(2)}`}
              tick={{ fontSize: 12 }}
              domain={['auto', 'auto']}
            />
            <Tooltip
              formatter={(value) => `$${value.toFixed(2)}`}
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '12px'
              }}
              cursor={{ fill: '#f3f4f6' }}
            />
            <Legend 
              layout="vertical"
              align="right"
              verticalAlign="middle"
              wrapperStyle={{ right: 0 }}
            />
            {filteredStocks.map((stock, index) => (
              <Line
                key={stock.symbol}
                type="monotone"
                dataKey={stock.symbol}
                stroke={
                  stock.change > 0 ? '#10b981' :
                  stock.change < 0 ? '#ef4444' :
                  ['#3b82f6', '#10b981', '#ef4444', '#f59e0b'][index % 4]
                }
                strokeWidth={2}
                dot={{ fill: stock.change > 0 ? '#10b981' : stock.change < 0 ? '#ef4444' : '#3b82f6' }}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredStocks.length > 0 ? (
          filteredStocks.map((stock, index) => (
            <div
              key={`${stock.symbol}-${index}`}
              className="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-shadow duration-300"
              role="region"
              aria-label={`Stock data for ${stock.symbol}`}
            >
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-semibold text-gray-800">{stock.symbol}</h3>
                <div className="flex items-center">
                  {stock.change > 0 ? (
                    <span className="text-green-500">▲</span>
                  ) : (
                    <span className="text-red-500">▼</span>
                  )}
                  <span className="ml-1 text-sm text-gray-600">
                    {stock.change > 0 ? 'Up' : 'Down'}
                  </span>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div>
                  <p className="text-gray-500">Price</p>
                  <p className="font-medium text-gray-800">${stock.price.toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-gray-500">Change</p>
                  <p
                    className={`font-medium ${
                      stock.change > 0 ? 'text-green-500' : 'text-red-500'
                    }`}
                  >
                    {stock.change.toFixed(2)}%
                  </p>
                </div>
                <div>
                  <p className="text-gray-500">Confidence</p>
                  <p className="font-medium text-gray-800">{stock.confidence}%</p>
                </div>
                <div>
                  <p className="text-gray-500">Last Updated</p>
                  <p className="text-gray-800">
                    {stock.timestamp
                      ? new Date(stock.timestamp).toLocaleString('en-US', {
                          timeZone: 'Africa/Nairobi',
                          month: 'short',
                          day: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })
                      : 'Unknown'}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center col-span-full">
            No data available
          </p>
        )}
      </div>
    </div>
  );
};

export default TopMovers;