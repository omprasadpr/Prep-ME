import {
    FileText,
    TrendingUp,
    Clock,
    Activity,
    Award
} from "lucide-react";

import StatCard from "./StatCard";

function QuickStats({ stats }) {
    if (!stats) return null;

    return (
        <section className="mt-6">
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-2">
                    <Activity className="text-cyan-400" size={20} />
                    <h2 className="text-xl font-black text-white tracking-tight">
                        Performance Overview
                    </h2>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
                <StatCard
                    icon={<FileText size={22} className="text-white" />}
                    iconBg="bg-gradient-to-br from-purple-500 to-indigo-600 shadow-purple-500/20"
                    title="Total Interviews"
                    value={stats.total_interviews}
                    badge="All Time"
                    subtitle={
                        <div className="space-y-1 text-xs mt-1 bg-white/[0.04] p-2.5 rounded-xl border border-white/[0.06]">
                            <div className="flex justify-between">
                                <span className="text-slate-400 font-medium">Completed</span>
                                <span className="font-extrabold text-emerald-400">
                                    {stats.completed_interviews}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400 font-medium">In Progress</span>
                                <span className="font-extrabold text-cyan-400">
                                    {stats.in_progress_interviews}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-slate-400 font-medium">Pending</span>
                                <span className="font-extrabold text-amber-400">
                                    {stats.pending_interviews}
                                </span>
                            </div>
                        </div>
                    }
                />

                <StatCard
                    icon={<TrendingUp size={22} className="text-white" />}
                    iconBg="bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20"
                    title="Average Score"
                    value={
                        stats.average_score > 0
                            ? `${stats.average_score}%`
                            : "--"
                    }
                    badge="Overall"
                    subtitle="Based on evaluated AI sessions"
                    subtitleColor="text-emerald-400 font-semibold"
                />

                <StatCard
                    icon={<Award size={22} className="text-white" />}
                    iconBg="bg-gradient-to-br from-blue-500 to-cyan-600 shadow-blue-500/20"
                    title="Best Score"
                    value={
                        stats.best_score > 0
                            ? `${stats.best_score}%`
                            : "--"
                    }
                    badge="Personal Record"
                    subtitle="Highest single interview score"
                    subtitleColor="text-cyan-400 font-semibold"
                />

                <StatCard
                    icon={<Clock size={22} className="text-white" />}
                    iconBg="bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/20"
                    title="Action Required"
                    value={stats.pending_interviews + stats.in_progress_interviews}
                    badge="Active"
                    subtitle="Pending & in-progress sessions"
                    subtitleColor="text-amber-400 font-semibold"
                />
            </div>
        </section>
    );
}

export default QuickStats;