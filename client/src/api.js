import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export const fetchPrices = (symbol) => API.get(`/price?symbol=${symbol}`);
export const fetchMovers = () => API.get("/movers");
export const fetchSentiment = () => API.get("/sentiment");
export const fetchTrend = () => API.get("/trend");
