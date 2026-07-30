import { Routes, Route } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Resume from "./pages/Resume";
import Interview from "./pages/Interview";

import InterviewSession from "./pages/interview/InterviewSession";
import InterviewReport from "./pages/interview/InterviewReport";
import MyInterviews from "./pages/interview/MyInterviews";

function App() {
    return (
        <Routes>
            {/* Auth Routes */}
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Authenticated Application Routes with persistent Sidebar & Navbar */}
            <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/resume" element={<Resume />} />
                <Route path="/interview" element={<Interview />} />
                <Route path="/my-interviews" element={<MyInterviews />} />
                <Route path="/interview-report/:interviewId" element={<InterviewReport />} />
            </Route>

            {/* Dedicated Interview Session View */}
            <Route path="/interview/session/:interviewId" element={<InterviewSession />} />
        </Routes>
    );
}

export default App;