import { Code2, Calendar, Play, FileCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";

function InterviewRow({ interview }) {
    const navigate = useNavigate();

    const difficultyBadge = () => {
        switch (interview.difficulty) {
            case "Easy":
                return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            case "Hard":
                return "bg-rose-500/10 text-rose-400 border-rose-500/20";
            default:
                return "bg-amber-500/10 text-amber-400 border-amber-500/20";
        }
    };

    const statusBadge = () => {
        switch (interview.status) {
            case "Completed":
                return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
            case "Pending":
                return "bg-amber-500/10 text-amber-400 border-amber-500/20";
            default:
                return "bg-cyan-500/10 text-cyan-400 border-cyan-500/20";
        }
    };

    return (
        <tr className="hover:bg-white/[0.04] transition-colors group">
            {/* Role & Title */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-3.5">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-md shrink-0 group-hover:scale-105 transition-transform">
                        <Code2 size={16} />
                    </div>
                    <div>
                        <h3 className="font-black text-white text-xs sm:text-sm group-hover:text-cyan-400 transition-colors">
                            {interview.role}
                        </h3>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                            {interview.title || "AI Session"}
                        </p>
                    </div>
                </div>
            </td>

            {/* Experience */}
            <td className="px-6 py-4 text-xs font-semibold text-slate-300">
                {interview.experience}
            </td>

            {/* Difficulty */}
            <td className="px-6 py-4">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${difficultyBadge()}`}>
                    {interview.difficulty}
                </span>
            </td>

            {/* Status */}
            <td className="px-6 py-4">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${statusBadge()}`}>
                    {interview.status}
                </span>
            </td>

            {/* Score Meter */}
            <td className="px-6 py-4">
                {interview.score !== null && interview.score !== undefined ? (
                    <div className="flex items-center gap-2">
                        <span className="font-black text-xs text-emerald-400">
                            {interview.score}%
                        </span>
                        <div className="w-16 bg-white/[0.06] h-1.5 rounded-full overflow-hidden hidden sm:block">
                            <div
                                className="bg-gradient-to-r from-emerald-400 to-cyan-400 h-full rounded-full"
                                style={{ width: `${Math.min(100, Math.max(0, interview.score))}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    <span className="text-slate-500 text-xs font-medium">--</span>
                )}
            </td>

            {/* Date */}
            <td className="px-6 py-4">
                <div className="flex items-center gap-1.5 text-slate-400 text-xs font-medium">
                    <Calendar size={13} className="text-slate-500" />
                    <span>
                        {interview.created_at
                            ? new Date(interview.created_at).toLocaleDateString()
                            : "--"}
                    </span>
                </div>
            </td>

            {/* Action */}
            <td className="px-6 py-4 text-right">
                {interview.status === "Completed" ? (
                    <button
                        onClick={() => navigate(`/interview-report/${interview.id}`)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black shadow-md transition flex items-center gap-1 ml-auto cursor-pointer"
                    >
                        <FileCheck size={14} />
                        <span>Report</span>
                    </button>
                ) : (
                    <button
                        onClick={() => navigate(`/interview/session/${interview.id}`)}
                        className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-black shadow-md transition flex items-center gap-1 ml-auto cursor-pointer"
                    >
                        <Play size={14} />
                        <span>Resume</span>
                    </button>
                )}
            </td>
        </tr>
    );
}

export default InterviewRow;