import { BarChart3, TrendingUp, Award, Target, CheckCircle2 } from "lucide-react";

function PerformanceChart({ interviews = [], stats = {} }) {
    const completedInterviews = interviews.filter(i => i.score !== null && i.score !== undefined);
    
    // Fallback benchmark data if no interviews completed yet
    const displayData = completedInterviews.length > 0 
        ? completedInterviews.slice(0, 6).reverse().map(i => ({
            label: i.role.length > 14 ? `${i.role.substring(0, 12)}...` : i.role,
            fullRole: i.role,
            score: Number(i.score) || 0,
            date: new Date(i.created_at).toLocaleDateString([], { month: 'short', day: 'numeric' })
        }))
        : [
            { label: "System Design", score: 85, category: "Architecture" },
            { label: "Data Structures", score: 78, category: "Algorithms" },
            { label: "Backend APIs", score: 92, category: "Engineering" },
            { label: "Database Schema", score: 80, category: "Databases" },
            { label: "Behavioral STAR", score: 88, category: "Soft Skills" },
        ];

    const averageScore = stats?.average_score || (
        completedInterviews.length > 0 
            ? Math.round(completedInterviews.reduce((acc, curr) => acc + (curr.score || 0), 0) / completedInterviews.length)
            : 84.6
    );

    const maxScore = Math.max(...displayData.map(d => d.score), 100);

    return (
        <div className="rounded-3xl border border-white/[0.08] bg-[#0D1117]/80 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-white/[0.06] pb-5">
                <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-600/20 text-cyan-400 border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
                        <BarChart3 size={22} />
                    </div>
                    <div>
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-cyan-400">
                            <TrendingUp size={12} />
                            <span>Performance Analytics</span>
                        </div>
                        <h2 className="text-lg font-black text-white">Interview Performance & Skill Breakdown</h2>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="rounded-2xl bg-white/[0.04] border border-white/[0.08] px-4 py-2 text-right">
                        <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Average Score</p>
                        <p className="text-lg font-black text-cyan-400">{averageScore}%</p>
                    </div>
                    <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-right">
                        <p className="text-[10px] uppercase font-black tracking-wider text-emerald-400">FAANG Benchmark</p>
                        <p className="text-lg font-black text-emerald-400">80% Target</p>
                    </div>
                </div>
            </div>

            {/* Bar Chart Visualization */}
            <div className="space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-400 font-bold px-1">
                    <span>Target Role / Category</span>
                    <span>Session Score (%)</span>
                </div>

                <div className="grid gap-3">
                    {displayData.map((item, idx) => {
                        const isPassing = item.score >= 80;
                        return (
                            <div key={idx} className="group space-y-1.5">
                                <div className="flex items-center justify-between text-xs font-bold">
                                    <span className="text-slate-200 group-hover:text-cyan-300 transition" title={item.fullRole || item.label}>
                                        {item.label} {item.date ? `(${item.date})` : ""}
                                    </span>
                                    <span className={isPassing ? "text-emerald-400 font-black" : "text-amber-400 font-black"}>
                                        {item.score}%
                                    </span>
                                </div>
                                <div className="w-full bg-white/[0.06] rounded-full h-3 p-0.5 relative overflow-hidden border border-white/[0.04]">
                                    {/* 80% Benchmark indicator line */}
                                    <div 
                                        className="absolute top-0 bottom-0 w-0.5 bg-emerald-400/60 z-10"
                                        style={{ left: "80%" }}
                                        title="FAANG 80% Benchmark Target"
                                    />
                                    
                                    {/* Animated Progress Bar */}
                                    <div
                                        className={`h-full rounded-full transition-all duration-700 shadow-md ${
                                            item.score >= 85 
                                                ? "bg-gradient-to-r from-cyan-500 via-teal-400 to-emerald-400 shadow-emerald-500/20" 
                                                : item.score >= 70 
                                                ? "bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 shadow-cyan-500/20"
                                                : "bg-gradient-to-r from-amber-500 to-orange-500 shadow-amber-500/20"
                                        }`}
                                        style={{ width: `${Math.min(item.score, 100)}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Bottom Insight Footer */}
            <div className="rounded-2xl bg-cyan-950/20 border border-cyan-500/20 p-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                    <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
                    <span>Scores of 80%+ indicate high readiness for top tech engineering interviews.</span>
                </div>
                <div className="inline-flex items-center gap-1.5 text-cyan-400 font-black shrink-0">
                    <Target size={14} />
                    <span>Target: 80%+</span>
                </div>
            </div>
        </div>
    );
}

export default PerformanceChart;
