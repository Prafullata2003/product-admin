import axios from "axios";
import { getToken, clearToken } from "./auth";

// The ONE shared Axios instance. Every API call in the app goes through it.
const api = axios.create({ baseURL: "https://dummyjson.com", timeout: 15000 });

// Add the login token to every request.
api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle errors in one place: turn them into a simple Error with a readable message.
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (axios.isCancel(error)) return Promise.reject(error); // aborted requests are not real errors
    const status = error.response?.status;
    if (status === 401 && typeof window !== "undefined" && !location.pathname.startsWith("/login")) {
      clearToken();
      location.href = "/login"; // token expired
    }
    const err = new Error(
      error.response?.data?.message ||
        (error.code === "ECONNABORTED" ? "Request timed out" : error.message || "Network error")
    );
    err.status = status;
    return Promise.reject(err);
  }
);
export default api;
