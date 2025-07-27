import { useState, useEffect } from "react";
import { fetchStockPrices, fetchSentiment } from "../services/api";

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
          fetchSentiment(),
        ]);
        setStocks(pricesData);
        setSentiments(sentimentData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
    const interval = setInterval(loadData, 300000); // 5 minutes
    return () => clearInterval(interval);
  }, []);

  return { stocks, sentiments, loading, error };
};