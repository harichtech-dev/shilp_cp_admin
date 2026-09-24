// auth.service.ts - Handles admin authentication: login and profile fetch.
// All calls go through the shared `api` client, which automatically attaches
// the JWT token to every request.

import { api } from "./api";

/**
 * LOGIN - Authenticates an admin with email and password.
 * Calls: POST /api/admin/login
 * Parameters: { email, password }
 * Returns: the API response, including the auth token, and persists the token
 * to localStorage so the interceptor can attach it to later requests.
 */
export const login = async (data: {
  email: string;
  password: string;
}) => {
  // Calls the backend login endpoint with the credentials
  const res = await api.post("/api/admin/login", data);

  // Stores the token in localStorage (used by the interceptor for future requests)
  localStorage.setItem('token', res.data.token);

  return res.data;
};

/**
 * GET PROFILE - Fetches the profile of the currently logged-in user.
 * Calls: GET /api/admin/profile
 * Requires: Valid JWT token (automatically attached by the API interceptor)
 * Returns: User profile information
 */
export const getProfile = async () => {
    // Calls the backend profile endpoint
    const res = await api.get('/api/admin/profile');
    return res.data;
}