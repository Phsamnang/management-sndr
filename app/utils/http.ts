import axios from "axios";

// Create axios instance with default config
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token or other headers
api.interceptors.request.use(
  (config) => {
    // You can add authentication headers here
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle errors here (e.g., unauthorized, server errors)
    return Promise.reject(error);
  }
);

// Example API methods
export const apiService = {
  // GET request
  get: async <T>(url: string, params?: any) => {
    const response = await api.get<T>(url, { params });
    return response.data;
  },

  // POST request
  post: async <T>(url: string, data: any) => {
    const response = await api.post<T>(url, data);
    return response.data;
  },

  // PUT request
  put: async <T>(url: string, data: any) => {
    const response = await api.put<T>(url, data);
    return response.data;
  },

  // DELETE request
  delete: async <T>(url: string) => {
    const response = await api.delete<T>(url);
    return response.data;
  },
};

export default api;
