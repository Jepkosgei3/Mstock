const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchPrices = async () => {
  const res = await fetch(`${API_BASE_URL}/prices`);
  return res.json();
};

export const fetchSentiment = async () => {
  const res = await fetch(`${API_BASE_URL}/sentiment`);
  return res.json();
};

export const fetchMovers = async () => {
  const res = await fetch(`${API_BASE_URL}/movers`);
  return res.json();
};

export const fetchPredictions = async () => {
  const res = await fetch(`${API_BASE_URL}/trends`);
  return res.json();
};
