import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api/admin/";

const adminPostApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// ========================================
// GET ALL POSTS
// ========================================
export const getAllPostsAdminApi = async () => {
  const response = await adminPostApi.get("/posts");

  return response.data;
};

// ========================================
// GET SINGLE POST
// ========================================
export const getPostByIdAdminApi = async (id) => {
  const response = await adminPostApi.get(`/posts/${id}`);

  return response.data;
};

// ========================================
// CREATE POST
// ========================================
export const createPostAdminApi = async (data) => {
  const response = await adminPostApi.post(
    "/posts/add",
    data
  );

  return response.data;
};

// ========================================
// UPDATE POST
// ========================================
export const updatePostAdminApi = async (id, data) => {
  const response = await adminPostApi.put(
    `/posts/${id}`,
    data
  );

  return response.data;
};

// ========================================
// DELETE POST
// ========================================
export const deletePostAdminApi = async (id) => {
  const response = await adminPostApi.delete(
    `/posts/${id}`
  );

  return response.data;
};