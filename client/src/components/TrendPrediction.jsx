import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, Cell } from 'recharts';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';
import { format } from 'date-fns';
import { fetchTrends } from '../services/api';

const formatTimestamp = (timestamp) => format(new Date(timestamp), 'MMM dd, yyyy h:mm aa');

const getTrendColor = (prediction) => {
  if (prediction > 0.3) return '#10b981'; // Bullish
  if (prediction > 0.1) return '#10b981'; // Mildly Bullish
  if (prediction < -0.3) return '#ef4444'; // Bearish
  if (prediction < -0.1) return '#ef4444'; // Mildly Bearish
  return '#f59e0b'; // Neutral
};

const getTrendLabel = (prediction) => {
  if (prediction > 0.3) return 'Bullish';
  if (prediction > 0.1) return 'Mildly Bullish';
  if (prediction < -0.3) return 'Bearish';
  if (prediction < -0.1) return 'Mildly Bearish';
  return 'Neutral';
};

export default function TrendPrediction() {
  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['predictions'],
    queryFn: fetchTrends,
    refetchInterval: 300000,
  });

  const chartData = React.useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.map((item) => ({
      symbol: item.symbol === 'GOOLG' ? 'GOOGL' : item.symbol,
      confidence: item.confidence * 100,
      prediction: item.prediction,
      timestamp: item.timestamp,
      trend: getTrendLabel(item.prediction)
    }));
  }, [data]);

  if (isLoading) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-lg text-gray-600">Loading predictions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <p className="text-red-500 font-medium">Error: {error.message}</p>
        <button 
          onClick={refetch}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!chartData || !chartData.length) {
    return (
      <div className="bg-white shadow-lg rounded-lg p-6">
        <p className="text-gray-500">No predictions available</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Trend Predictions</h2>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-2">Prediction Scores</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="symbol" 
                tick={{ fontSize: 12 }} 
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis
                tickFormatter={(value) => value.toFixed(2)}
                tick={{ fontSize: 12 }}
                domain={[-1, 1]}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'prediction') return [value.toFixed(2), name];
                  return [value, name];
                }}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Legend 
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{ right: 0 }}
              />
              <Bar 
                dataKey="prediction" 
                radius={[4, 4, 0, 0]}
                barSize={20}
                name="Prediction Score"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`bar-${index}`} 
                    fill={getTrendColor(entry.prediction)}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-container">
          <h3 className="text-lg font-semibold mb-2">Confidence Levels</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis 
                dataKey="symbol" 
                tick={{ fontSize: 12 }} 
                angle={-45}
                textAnchor="end"
                height={100}
              />
              <YAxis
                tickFormatter={(value) => `${value}%`}
                tick={{ fontSize: 12 }}
                domain={[0, 100]}
              />
              <Tooltip
                formatter={(value, name) => {
                  if (name === 'confidence') return [`${value.toFixed(1)}%`, name];
                  return [value, name];
                }}
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '12px'
                }}
              />
              <Legend 
                layout="vertical"
                align="right"
                verticalAlign="middle"
                wrapperStyle={{ right: 0 }}
              />
              <Bar 
                dataKey="confidence" 
                radius={[4, 4, 0, 0]}
                barSize={20}
                name="Confidence Level"
              >
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`bar-${index}`} 
                    fill="#3b82f6"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}