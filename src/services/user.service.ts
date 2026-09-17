import { api } from "./api";

/**
 * GET USERS PARAMS - Parameters for fetching the user list.
 */
type GetUsersParams = {
  page?: number;           // Page number for pagination
  limit?: number;          // Limit per page
  search?: string;         // Search query (name, email, or phone).
};

/**
 * UPDATE USER PAYLOAD - Payload structure for updating user data.
 */
export type UpdateUserPayload = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  logo?: File | null;
};

/**
 * GET USERS - Paginated user list with search
 * Input: page, limit, search query
 * Output: Users array with pagination info
 */
export const getUsers = async ({
  page = 1,
  limit = 10,
  search = "",
}: GetUsersParams) => {
  const res = await api.get(
    `/users?page=${page}&limit=${limit}&search=${search}`,
  );
  return res.data;
};

/**
 * GET ALL USERS - Fetch all active users without pagination.
 */
export const getAllUsers = async () => {
  const res = await api.get("/users/all");
  console.log(res)
  return res.data;
};

/**
 * DELETE USER - Delete a user.
 */
export const deleteUser = async (_id: string) => {
  return api.delete(`/users/${_id}`);
};

/**
 * CREATE USER - Add a new user.
 * Form data may also include a logo image.
 */
export const createUser = async (data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  logo?: File | null;
}) => {
  // Use FormData so a file can be uploaded as well.
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

// GET a single user.
export const getUserById = async (_id: string) => {
  const res = await api.get(`/users/${_id}`);
  // console.log("getUserById response:", res.data);
  return res.data.data;
};

// ✅ UPDATE user
export const updateUser = async (_id: string, data: UpdateUserPayload) => {
  const formData = new FormData();

  formData.append("name", data.name);
  formData.append("email", data.email);
  formData.append("phone", data.phone ?? "");
  formData.append("company", data.company ?? "");

  if (data.logo) {
    formData.append("logo", data.logo);
  }

  const res = await api.put(`/users/${_id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export const handleStats = async (_id: string, status: number) => {
  const newStatus = status === 1 ? 0 : 1;
  const res = await api.patch(`/users/${_id}/status`, { status: newStatus });
  return res.data;
};

export const updateAllUsersStatus = async (status: number) => {
  const res = await api.patch("/users/status/bulk", { status });
  return res.data;
};
