import axios from "axios";

const defaultBaseUrl = import.meta.env.PROD 
    ? "https://prep-me-backend.onrender.com" 
    : "http://127.0.0.1:8000";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || defaultBaseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

// =============================
// Request Interceptor
// =============================
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// =============================
// Response Interceptor
// =============================
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response) {
            console.log("Status:", error.response.status);
            console.log("Response:", error.response.data);
        } else {
            console.log("Network Error:", error.message);
        }
        return Promise.reject(error);
    }
);

export default api;