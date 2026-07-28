import api from "../api/axios";

// Create Interview
export const createInterview = async (data) => {

    const response = await api.post("/interviews", data);

    return response.data;

};

// Get Interview
export const getInterview = async (interviewId) => {

    const response = await api.get(
        `/interviews/${interviewId}`
    );

    return response.data;

};

// Generate AI Questions
export const generateQuestions = async (interviewId) => {

    const response = await api.post(
        `/interview-questions/generate/${interviewId}`
    );

    return response.data;

};

// Get Interview Questions
export const getQuestions = async (interviewId) => {

    const response = await api.get(
        `/interview-questions/${interviewId}`
    );

    return response.data;

};

// Submit Answer
export const submitAnswer = async (data) => {

    const response = await api.post(
        "/interview-answers",
        data
    );

    return response.data;

};

// Get My Interviews
export const getMyInterviews = async () => {

    const response = await api.get("/interviews");

    return response.data;

};

// Delete Interview
export const deleteInterview = async (interviewId) => {

    const response = await api.delete(
        `/interviews/${interviewId}`
    );

    return response.data;

};

// Save Progress
export const updateInterviewProgress = async (

    interviewId,

    currentQuestion,

) => {

    const response = await api.put(

        `/interviews/${interviewId}/progress`,

        {

            current_question: currentQuestion,

        }

    );

    return response.data;

};

// Complete Interview
export const completeInterview = async (interviewId) => {

    const response = await api.put(

        `/interviews/${interviewId}/complete`

    );

    return response.data;

};