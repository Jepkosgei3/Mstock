const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const fetchStockPrices = async (symbols = ["AAPL", "TSLA", "GOOGL", "MSFT"]) => {
  console.log("fetchStockPrices called with symbols:", symbols);
  const validSymbols = Array.isArray(symbols) && symbols.length > 0 ? symbols : ["AAPL", "TSLA", "GOOGL", "MSFT"];
  const symbolParams = validSymbols.map((s) => `symbols=${encodeURIComponent(s)}`).join("&");
  const response = await fetch(`${API_BASE}/api/prices?${symbolParams}`);
  if (!response.ok) throw new Error("Failed to fetch stock prices");
  return await response.json();
};

export const fetchSentiment = async () => {
  const response = await fetch(`${API_BASE}/api/sentiment`);
  if (!response.ok) throw new Error("Failed to fetch sentiment data");
  return await response.json();
};

export const fetchCryptoRates = async () => {
  const response = await fetch(`${API_BASE}/api/crypto`);
  if (!response.ok) throw new Error("Failed to fetch crypto rates");
  return await response.json();
};

export const fetchMovers = async () => {
  const response = await fetch(`${API_BASE}/api/movers`);
  if (!response.ok) throw new Error("Failed to fetch market movers");
  const data = await response.json();
  return data.map((item) => {
    const price = parseFloat(item.price) || (item.confidence * 10) || 0;
    return {
      symbol: item.symbol === 'GOOLG' ? 'GOOGL' : item.symbol,
      price,
      change: item.change || item.prediction || 0,
      confidence: item.confidence ? (item.confidence * 100).toFixed(1) : '0.0',
      timestamp: item.timestamp || new Date().toISOString(),
      history: item.history || Array(10).fill().map((_, i) => ({
        time: new Date(Date.now() - (9 - i) * 3600000).toISOString(),
        price: price * (1 + (Math.random() - 0.5) * 0.1),
      })),
    };
  });
};

export const fetchTrends = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/trend`);
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to fetch trend predictions: ${error}`);
    }
    const data = await response.json();
    console.log('Fetched trends:', data);
    return data.map((item) => ({
      symbol: item.symbol === 'GOOLG' ? 'GOOGL' : item.symbol,
      confidence: item.confidence || 0,
      prediction: item.prediction || 0,
      timestamp: item.timestamp || new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error in fetchTrends:', error);
    throw error;
  }
};

export const checkApiStatus = async () => {
  const response = await fetch(`${API_BASE}/`);
  if (!response.ok) throw new Error("Failed to check API status");
  return await response.json();
};