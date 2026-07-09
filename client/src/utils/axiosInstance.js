import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Request interceptor - attach token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - catch 401 errors automatically
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear everything from localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      // Redirect to home page
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;