import React from 'react';
import { useStockData } from '../hooks/useStockData';

const StockPrices = () => {
  const { stocks, loading, error } = useStockData();

  if (loading) return <div>Loading stock data...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="stock-prices">
      <h2>Stock Prices</h2>
      <table>
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Price</th>
            <th>Change</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {stocks.map(stock => (
            <tr key={stock._id}>
              <td>{stock.symbol}</td>
              <td>${stock.close.toFixed(2)}</td>
              <td style={{ color: stock.close >= stock.open ? 'green' : 'red' }}>
                {(stock.close - stock.open).toFixed(2)}
              </td>
              <td>{new Date(stock.date).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StockPrices;