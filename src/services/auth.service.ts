import { api } from "./api";

/**
 * Token ko local storage mein store kar deta hai
 */
export const login = async (data: {
  email: string;
  password: string;
}) => {
  // Backend ke login endpoint ko call kar rahe hain
  const res = await api.post("/api/admin/login", data);

  // Token ko local storage mein store kar rahe hain (future requests ke liye)
  localStorage.setItem('token', res.data.token);

  return res.data;
};

/**
 * GET PROFILE - Logged in user ka profile data lena
 * Requires: Valid JWT token (automatically attached by API interceptor)
 * Output: User profile information
 */
export const getProfile = async () => {
    // Backend ke profile endpoint ko call kar rahe hain
    const res = await api.get('/api/admin/profile');
    return res.data;
}