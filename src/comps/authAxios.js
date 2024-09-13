// src/authAxios.js
import axios from "axios";

// Create an axios instance with authorization header
const authAxios = axios.create({
  baseURL: "http://localhost:3000", // Replace with your API base URL
});
console.log("authAxios", authAxios);
// Intercept all requests to include Bearer token
authAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    console.log("Token:", token);
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("Token:", token);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default authAxios;
