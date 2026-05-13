import { api } from "./api";

export const getUsers = async ({
  page = 1,
  limit = 10,
  search = "",
}: any) => {
  const res = await api.get(`/users?page=${page}&limit=${limit}&search=${search}`);
  return res.data;
};

export const getAllUsers = async () => {
  const res = await api.get("/users/all");
  return res.data;
};

export const deleteUser = async (_id: string) => {
  return api.delete(`/users/${_id}`);
};

export const createUser = async (data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  logo?: File | null;
}) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("email", data.email);
  

  if (data.phone) formData.append("phone", data.phone);
    if (data.company) formData.append("company", data.company);
  if (data.logo) formData.append("logo", data.logo);

  const res = await api.post("/users", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

// ✅ GET single user (you don't have this yet → reuse list)
export const getUserById = async (_id: string) => {
  const res = await api.get(`/users/${_id}`);
  console.log("getUserById response:", res.data);
  return res.data.data;
};

// ✅ UPDATE user
export const updateUser = async (_id: string, data: any) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("phone", data.phone);
  formData.append("company", data.company);

  if (data.logo) {
    formData.append("logo", data.logo);
  }

  const res = await api.put(`/users/${_id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};