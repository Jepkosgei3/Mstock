// client/src/api.js
import axios from 'axios';

const API = axios.create({
  baseURL: 'https://animated-fishstick-9vgw554g77cpwqw-8000.app.github.dev/', // adjust for production if needed
});

// GET /price?symbol=AAPL
export const fetchPriceData = (symbol = 'AAPL') =>
  API.get(`/price`, { params: { symbol } });

// GET /sentiment
export const fetchSentiment = () => API.get('/sentiment');

// GET /trend
export const fetchTrend = () => API.get('/trend');

// GET /movers
export const fetchMarketMovers = () => API.get('/movers');
