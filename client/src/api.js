import axios from "axios";

// Load base URL from Vite environment variable
const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

export default API;
