import axios, { InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token"); // Read the token from localStorage.
  
  if (token) {
    config.headers = config.headers ?? {}; // Initialize request headers.
    config.headers.Authorization = `Bearer ${token}`; // Add the Bearer token.
  }
  return config;
});
