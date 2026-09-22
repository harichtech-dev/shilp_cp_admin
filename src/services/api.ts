import axios, { InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token"); // Local storage se token nikala
  
  if (token) {
    config.headers = config.headers ?? {}; // Header set kar rahe hain
    config.headers.Authorization = `Bearer ${token}`; // Token ko Bearer format mein add kar rahe hain
  }
  return config;
});
