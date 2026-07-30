import api from "../api/axios";

export const loginUser = async (data) => {
    const response = await api.post("/auth/login", data);
    return response.data;
};

export const registerUser = async (data) => {
    const response = await api.post("/auth/register", data);
    return response.data;
};

export const googleLoginUser = async (data) => {
    const response = await api.post("/auth/google", data);
    return response.data;
};

export const guestLoginUser = async () => {
    const response = await api.post("/auth/guest");
    return response.data;
};

export const verifyEmailToken = async (token) => {
    const response = await api.get(`/auth/verify-email?token=${encodeURIComponent(token)}`);
    return response.data;
};

export const resendVerificationEmail = async (email) => {
    const response = await api.post("/auth/resend-verification", { email });
    return response.data;
};