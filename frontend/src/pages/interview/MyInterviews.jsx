import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getMyInterviews, deleteInterview } from "../../services/interviewApi";
import {
    ClipboardList,
    Plus,
    Loader2,
    SearchX,
    FileCheck,
    Play,
    Trash2,
    Code2,
    Calendar,
    Filter
} from "lucide-react";

function MyInterviews() {
    const navigate = useNavigate();
    const context = useOutletContext() || {};
    const { searchQuery = "", searchFilter = "all" } = context;

    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    const loadInterviews = async () => {
        try {
            const data = await getMyInterviews();
            setInterviews(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInterviews();
    }, []);

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Delete this interview session?");
        if (!confirmDelete) return;

        try {
            await deleteInterview(id);
            loadInterviews();
        } catch (error) {
            console.log(error);
            alert("Unable to delete interview.");
        }
    };

    // Advanced search filter logic across role, status, difficulty, experience
    const filteredInterviews = interviews.filter((interview) => {
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

        // Default 'all' - match any attribute
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
            <div className="flex flex-col justify-center items-center h-[60vh] gap-3">
                <Loader2 size={36} className="text-cyan-400 animate-spin" />
                <h2 className="text-xs font-black text-slate-400 uppercase tracking-widest">Loading Your Interviews...</h2>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-slide-up">
            {/* Top Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 p-6 sm:p-8 rounded-3xl border border-white/[0.1] backdrop-blur-xl shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-black">
                        <ClipboardList size={14} />
                        <span>Interview Log</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                        My AI Interview History
                    </h1>
                    <p className="text-slate-300 text-xs sm:text-sm font-medium">
                        Review, resume, or view performance reports for all your practice sessions.
                    </p>
                </div>

                <button
                    onClick={() => navigate("/interview")}
                    className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-xs rounded-xl shadow-lg shadow-cyan-500/20 transition active:scale-95 flex items-center gap-2 shrink-0 cursor-pointer"
                >
                    <Plus size={16} />
                    <span>New Interview</span>
                </button>
            </div>

            {/* Search Filter Indicator Banner if searching */}
            {searchQuery && (
                <div className="flex items-center justify-between bg-cyan-500/10 border border-cyan-500/20 rounded-2xl px-4 py-3 text-xs text-cyan-300 font-semibold">
                    <div className="flex items-center gap-2">
                        <Filter size={14} className="text-cyan-400" />
                        <span>
                            Filtering by <strong className="text-white capitalize">{searchFilter}</strong> matching: "{searchQuery}"
                        </span>
                    </div>
                    <span className="font-black bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full text-[11px]">
                        {filteredInterviews.length} Results
                    </span>
                </div>
            )}

            {/* Content List */}
            {filteredInterviews.length === 0 ? (
                <div className="bg-[#0D1117]/80 rounded-3xl border border-white/[0.08] shadow-2xl p-12 text-center backdrop-blur-xl">
                    <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-slate-500">
                        <SearchX size={32} />
                    </div>
                    <h2 className="text-lg font-black text-white">
                        {searchQuery ? "No Matching Interviews Found" : "No Interviews Created Yet"}
                    </h2>
                    <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto font-medium">
                        {searchQuery
                            ? "Try adjusting your search keywords or switching attribute filters in the searchbar."
                            : "Launch your first AI interview session to start tracking your performance."}
                    </p>
                    <button
                        onClick={() => navigate("/interview")}
                        className="mt-5 px-6 py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-black rounded-xl transition cursor-pointer"
                    >
                        Start Your First Session
                    </button>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredInterviews.map((interview) => (
                        <div
                            key={interview.id}
                            className="bg-[#0D1117]/80 rounded-2xl border border-white/[0.08] shadow-lg hover:border-cyan-500/30 transition p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 backdrop-blur-xl group"
                        >
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                                    <Code2 size={18} />
                                </div>
                                <div className="space-y-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-base font-black text-white group-hover:text-cyan-400 transition-colors">
                                            {interview.title || interview.role}
                                        </h2>
                                        <span
                                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                                                interview.difficulty === "Easy"
                                                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                                    : interview.difficulty === "Hard"
                                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                                    : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                            }`}
                                        >
                                            {interview.difficulty}
                                        </span>
                                    </div>

                                    <p className="text-slate-400 text-xs font-medium">
                                        Role: <span className="text-slate-200 font-semibold">{interview.role}</span> • Level: <span className="text-slate-200 font-semibold">{interview.experience}</span>
                                    </p>

                                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1 font-medium">
                                        <span
                                            className={`px-2.5 py-0.5 rounded-full font-bold border ${
                                                interview.status === "Completed"
                                                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                                    : interview.status === "In Progress"
                                                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                                                    : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                            }`}
                                        >
                                            {interview.status}
                                        </span>

                                        <span className="flex items-center gap-1">
                                            <Calendar size={12} className="text-slate-500" />
                                            {interview.created_at
                                                ? new Date(interview.created_at).toLocaleDateString()
                                                : "--"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0 border-t sm:border-t-0 border-white/[0.06] pt-3 sm:pt-0">
                                {interview.status === "Completed" ? (
                                    <button
                                        onClick={() => navigate(`/interview-report/${interview.id}`)}
                                        className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        <FileCheck size={14} />
                                        <span>View Report</span>
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => navigate(`/interview/session/${interview.id}`)}
                                        className="flex-1 sm:flex-initial bg-blue-600 hover:bg-blue-500 text-white text-xs font-black px-4 py-2 rounded-xl shadow-md transition flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                        <Play size={14} />
                                        <span>Resume</span>
                                    </button>
                                )}

                                <button
                                    onClick={() => handleDelete(interview.id)}
                                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs transition cursor-pointer"
                                    title="Delete session"
                                >
                                    <Trash2 size={15} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyInterviews;