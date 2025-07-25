import { useState, useEffect } from 'react';
import { fetchStockPrices, fetchSentiment } from '../services/api';

export const useStockData = () => {
  const [stocks, setStocks] = useState([]);
  const [sentiments, setSentiments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [pricesData, sentimentData] = await Promise.all([
          fetchStockPrices(),
          fetchSentiment()
        ]);
        setStocks(pricesData.data);
        setSentiments(sentimentData.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { stocks, sentiments, loading, error };
};