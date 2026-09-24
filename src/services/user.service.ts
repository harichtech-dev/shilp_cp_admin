// user.service.ts - Admin CRUD operations for platform end users.
// Covers paginated listing with search, creation and updates (with optional
// logo file upload via FormData) and bulk status toggling.

import { api } from "./api";

/**
 * GET USERS PARAMS - Query parameters used when fetching the user list.
 */
type GetUsersParams = {
  page?: number;           // Page number for pagination
  limit?: number;          // Limit per page
  search?: string;         // Search query (match by name, email or phone)
};

/**
 * UPDATE USER PAYLOAD - Shape of the data sent when updating a user.
 */
export type UpdateUserPayload = {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  logo?: File | null;
};

/**
 * GET USERS - Paginated user list with optional search.
 * Calls: GET /users?page=&limit=&search=
 * Parameters: page, limit and a search query.
 * Returns: users array along with pagination info.
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
 * GET ALL USERS - Every active user, without pagination.
 * Calls: GET /users/all
 */
export const getAllUsers = async () => {
  const res = await api.get("/users/all");
  console.log(res)
  return res.data;
};

/**
 * DELETE USER - Delete an existing user.
 * Calls: DELETE /users/:id
 */
export const deleteUser = async (_id: string) => {
  return api.delete(`/users/${_id}`);
};

/**
 * CREATE USER - Add a new user.
 * Calls: POST /users (multipart/form-data)
 * Sends the user fields as FormData so an optional logo image is uploaded too.
 */
export const createUser = async (data: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  logo?: File | null;
}) => {
  // Uses FormData so a file (logo image) can be uploaded alongside the fields
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

// ✅ GET single user (you Don&apos;t have this yet → reuse list)
/**
 * GET USER BY ID - Fetch a single user by its id.
 * Calls: GET /users/:id
 * Returns: the user data object.
 */
export const getUserById = async (_id: string) => {
  const res = await api.get(`/users/${_id}`);
  // console.log("getUserById response:", res.data);
  return res.data.data;
};

// ✅ UPDATE user
/**
 * UPDATE USER - Update an existing user's details.
 * Calls: PUT /users/:id (multipart/form-data)
 * Parameters: user id and an UpdateUserPayload; a new logo file is optional.
 */
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

/**
 * HANDLE STATS - Toggle a user's active status.
 * Calls: PATCH /users/:id/status
 * Flips the status between 1 (active) and 0 (inactive).
 */
export const handleStats = async (_id: string, status: number) => {
  const newStatus = status === 1 ? 0 : 1;
  const res = await api.patch(`/users/${_id}/status`, { status: newStatus });
  return res.data;
};

/**
 * UPDATE ALL USERS STATUS - Set the status of every user at once.
 * Calls: PATCH /users/status/bulk
 */
export const updateAllUsersStatus = async (status: number) => {
  const res = await api.patch("/users/status/bulk", { status });
  return res.data;
};
