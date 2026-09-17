import { api } from "./api";

/**
 * Store the authentication token in localStorage.
 */
export const login = async (data: {
  email: string;
  password: string;
}) => {
  // Call the backend login endpoint.
  const res = await api.post("/api/admin/login", data);

  // Persist the token for future requests.
  localStorage.setItem('token', res.data.token);

  return res.data;
};

/**
 * GET PROFILE - Fetch the authenticated user's profile.
 * Requires: Valid JWT token (automatically attached by API interceptor)
 * Output: User profile information
 */
export const getProfile = async () => {
    // Call the backend profile endpoint.
    const res = await api.get('/api/admin/profile');
    return res.data;
}