// api.ts - Shared Axios instance used by every service in the admin app.
// A request interceptor attaches the auth token to the Authorization header
// before any request leaves the browser.

import axios, { InternalAxiosRequestConfig } from "axios";

/**
 * Shared Axios instance.
 * The baseURL is read from the NEXT_PUBLIC_API_URL environment variable.
 */
export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

/**
 * Request interceptor - runs before every request is sent.
 * Reads the auth token from localStorage and adds it as an
 * `Authorization: Bearer <token>` header so protected endpoints are reachable.
 */
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem("token"); // fetch the token from localStorage
  if (token) {
    config.headers = config.headers ?? {}; // Initialize headers if not already initialized
    config.headers.Authorization = `Bearer ${token}`; // Add the authorization header
  }
  return config;
});
