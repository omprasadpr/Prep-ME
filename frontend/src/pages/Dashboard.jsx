import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import WelcomeBanner from "../components/dashboard/WelcomeBanner";
import QuickStats from "../components/dashboard/QuickStats";
import PerformanceChart from "../components/dashboard/PerformanceChart";
import QuickActions from "../components/dashboard/QuickActions";
import RecentInterviews from "../components/dashboard/RecentInterviews";
import { getDashboard } from "../services/dashboardApi";
import { Loader2, BrainCircuit } from "lucide-react";

function Dashboard() {
    const context = useOutletContext() || {};
    const { searchQuery = "", searchFilter = "all" } = context;

    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                const data = await getDashboard();
                setDashboard(data);
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const recentInterviews = dashboard?.recent_interviews || [];

    const filteredRecent = recentInterviews.filter((interview) => {
        if (!searchQuery) return true;
        const q = searchQuery.toLowerCase().trim();

        const role = (interview.role || "").toLowerCase();
        const status = (interview.status || "").toLowerCase();
        const difficulty = (interview.difficulty || "").toLowerCase();
        const experience = (interview.experience || "").toLowerCase();
        const title = (interview.title || "").toLowerCase();

        if (searchFilter === "role") return role.includes(q) || title.includes(q);
        if (searchFilter === "status") return status.includes(q);
        if (searchFilter === "difficulty") return difficulty.includes(q);
        if (searchFilter === "experience") return experience.includes(q);

        return (
            role.includes(q) ||
            status.includes(q) ||
            difficulty.includes(q) ||
            experience.includes(q) ||
            title.includes(q)
        );
    });

    if (loading) {
        return (
            <div className="flex flex-col justify-center items-center h-[65vh] gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 p-0.5 shadow-xl shadow-cyan-500/20">
                    <div className="w-full h-full rounded-[14px] bg-[#070A11] flex items-center justify-center">
                        <BrainCircuit size={28} className="text-cyan-400 animate-pulse" />
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Loader2 size={18} className="text-cyan-400 animate-spin" />
                    <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Loading Dashboard...</h2>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-slide-up">
            <WelcomeBanner userName={dashboard?.user_name} />
            
            <QuickStats stats={dashboard?.quick_stats} />

            {/* Performance Bar Chart placed directly between QuickStats and QuickActions */}
            <PerformanceChart interviews={dashboard?.recent_interviews} stats={dashboard?.quick_stats} />

            <QuickActions />

            <RecentInterviews interviews={filteredRecent} />
        </div>
    );
}

export default Dashboard;