const API_BASE = process.env.REACT_APP_API_BASE_URL;

export const fetchStockPrices = async (symbols = ['AAPL', 'TSLA', 'GOOGL', 'MSFT']) => {
  const symbolParams = symbols.map(s => `symbols=${s}`).join('&');
  const response = await fetch(`${API_BASE}/api/prices?${symbolParams}`);
  return await response.json();
};

export const fetchSentiment = async () => {
  const response = await fetch(`${API_BASE}/api/sentiment`);
  return await response.json();
};

export const fetchCryptoRates = async (symbols = ['BTC', 'ETH']) => {
  const symbolParams = symbols.map(s => `symbols=${s}`).join('&');
  const response = await fetch(`${API_BASE}/api/crypto?${symbolParams}`);
  return await response.json();
};

export const checkApiStatus = async () => {
  const response = await fetch(`${API_BASE}/`);
  return await response.json();
};