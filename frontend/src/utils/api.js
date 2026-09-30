import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;
export const loginapi = async (userData) => {
    try {
        const res = await axios.post(`${BASE_URL}/auth/login`, userData,  { withCredentials: true });
        return res.data;
    } catch (err) {
        console.error("Login API Error:", err);
        throw err
    }
};

export const signUpapi = async (userData) => {
    try {
        const res = await axios.post(`${BASE_URL}/auth/signup`, userData,  { withCredentials: true });
        return res.data;
    } catch (err) {
        console.error("SignUp API Error:", err);
        throw err;
    }
};

export const checkAuthApi = async () => {
    const res = await axios.get(`${BASE_URL}/auth/me`, {
        withCredentials: true // Mandatory for sending HTTP-only cookies
    });
    return res.data;
};
export const addPostApi = async (data) => {
  const res = await axios.post(`${BASE_URL}/posts/add`, data, {
    withCredentials: true,
  });

  return res.data;
};


export const getPostsApi = async () => {
  const res = await axios.get(`${BASE_URL}/posts`);

  return res.data;
};


export const getPostByIdApi = async (id) => {
  const res = await axios.get(`${BASE_URL}/posts/${id}`);

  return res.data;
};


export const updatePostApi = async (id, data) => {
  const res = await axios.put(
    `${BASE_URL}/posts/${id}`,
    data,
    {
      withCredentials: true,
    }
  );

  return res.data;
};


export const deletePostApi = async (id) => {
  const res = await axios.delete(
    `${BASE_URL}/posts/${id}`,
    {
      withCredentials: true,
    }
  );

  return res.data;
};