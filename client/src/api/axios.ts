import axios from "axios";

const baseURL = "http://localhost:4000";

const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
  headers: {
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    Expires: "0",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      window.location.pathname !== "/login"
    ) {
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
