import api from "../api/axios";

// Generate interview report
export const generateReport = async (interviewId) => {

    const response = await api.post(
        `/interview-report/generate/${interviewId}`
    );

    return response.data;

};

// Get interview report
export const getReport = async (interviewId) => {

    const response = await api.get(
        `/interview-report/${interviewId}`
    );

    return response.data;

};