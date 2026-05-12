import { api } from "./api";

export const login = async (data: {
  email: string;
  password: string;
}) => {
  const res = await api.post("/api/admin/login", data);

  // store token
  localStorage.setItem('token',res.data.token);

  return res.data;
};

export const getProfile = async () => {
    const res = await api.get('/api/admin/profile')
    return res.data;
}