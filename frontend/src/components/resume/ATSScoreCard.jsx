import { ShieldCheck } from "lucide-react";

function ATSScoreCard({ analysis }) {
    if (!analysis) return null;

    const score = typeof analysis.ats_score === "number" ? analysis.ats_score : 0;
    const label = score >= 85 ? "Excellent" : score >= 65 ? "Good" : "Needs Improvement";
    const badgeColor = score >= 85
        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
        : score >= 65
        ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
        : "bg-amber-500/10 text-amber-400 border-amber-500/20";

    const scoreColor = score >= 85 ? "text-emerald-400" : score >= 65 ? "text-cyan-400" : "text-amber-400";

    return (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0D1117]/80 backdrop-blur-xl p-6 shadow-lg">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">ATS Evaluation</p>
                    <h2 className="mt-1 text-lg font-black text-white">ATS Compatibility Score</h2>
                </div>
                <div className={`rounded-full px-3 py-1 text-xs font-black border ${badgeColor}`}>{label}</div>
            </div>
            <div className="mt-4 flex items-center justify-between gap-4">
                <div>
                    <p className={`text-4xl font-black ${scoreColor}`}>{score}%</p>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">Overall parsing compatibility</p>
                </div>
                <div className="rounded-2xl bg-cyan-500/10 p-3 text-cyan-400 border border-cyan-500/20 shadow-md">
                    <ShieldCheck size={24} />
                </div>
            </div>
            <div className="mt-4 w-full bg-white/[0.06] rounded-full h-2 overflow-hidden">
                <div
                    className={`h-full rounded-full transition-all duration-500 ${score >= 85 ? "bg-emerald-400" : score >= 65 ? "bg-cyan-400" : "bg-amber-400"}`}
                    style={{ width: `${score}%` }}
                />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 text-xs">
                    <p className="font-bold text-slate-300">Keyword match</p>
                    <p className="text-cyan-400 font-black mt-0.5">{analysis.keyword_match ? `${analysis.keyword_match}%` : "—"}</p>
                </div>
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 text-xs">
                    <p className="font-bold text-slate-300">Format score</p>
                    <p className="text-emerald-400 font-black mt-0.5">{analysis.format_score ?? "—"}</p>
                </div>
            </div>
        </div>
    );
}

export default ATSScoreCard;
