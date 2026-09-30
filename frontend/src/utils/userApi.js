import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL ||
  "http://localhost:4000/api";

const adminUserApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Get all users
export const getAllUsersAdminApi = async () => {
  const response = await adminUserApi.get("/admin/users");

  return response.data;
};

// Get single user
export const getAdminUserByIdApi = async (id) => {
  const response = await adminUserApi.get(
    `/admin/users/${id}`
  );

  return response.data;
};

// Create user
export const createAdminUserApi = async (data) => {
  const response = await adminUserApi.post(
    "/admin/users",
    data
  );

  return response.data;
};

// Update user
export const updateAdminUserApi = async (id, data) => {
  const response = await adminUserApi.put(
    `/admin/users/${id}`,
    data
  );

  return response.data;
};

// Delete user
export const deleteAdminUserApi = async (id) => {
  const response = await adminUserApi.delete(
    `/admin/users/${id}`
  );

  return response.data;
};