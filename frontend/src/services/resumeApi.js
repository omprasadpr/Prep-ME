import api from "../api/axios";

// Upload Resume
export const uploadResume = async (formData) => {

    const response = await api.post(
        "/resume/upload",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;

};

// Get Resume Details
export const getResume = async () => {

    const response = await api.get("/resume");

    return response.data;

};

// View / Download Resume
export const downloadResume = async () => {

    const response = await api.get(
        "/resume/view",
        {
            responseType: "blob",
        }
    );

    return response.data;

};

// Delete Resume
export const deleteResume = async () => {

    const response = await api.delete("/resume");

    return response.data;

};