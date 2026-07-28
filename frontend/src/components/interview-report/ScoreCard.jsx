import { Code2, MessageSquare, BadgeCheck } from "lucide-react";

function ScoreCard({ title, score, type }) {
    const normalizedScore = Number.isFinite(score) ? Math.min(Math.max(score, 0), 100) : 0;

    const getIcon = () => {
        switch (type) {
            case "technical":
                return <Code2 size={24} className="text-cyan-400" />;
            case "communication":
                return <MessageSquare size={24} className="text-emerald-400" />;
            case "confidence":
                return <BadgeCheck size={24} className="text-purple-400" />;
            default:
                return <Code2 size={24} className="text-cyan-400" />;
        }
    };

    const getStatus = () => {
        if (normalizedScore >= 85) return "Excellent";
        if (normalizedScore >= 70) return "Good";
        if (normalizedScore >= 50) return "Average";
        return "Needs Work";
    };

    const getColors = () => {
        if (normalizedScore >= 85) {
            return {
                text: "text-emerald-400",
                badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
                bar: "from-emerald-500 to-teal-400",
            };
        }
        if (normalizedScore >= 70) {
            return {
                text: "text-cyan-400",
                badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
                bar: "from-cyan-500 to-blue-500",
            };
        }
        if (normalizedScore >= 50) {
            return {
                text: "text-amber-400",
                badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
                bar: "from-amber-500 to-orange-400",
            };
        }
        return {
            text: "text-rose-400",
            badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
            bar: "from-rose-500 to-red-500",
        };
    };

    const colors = getColors();

    return (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0D1117]/80 backdrop-blur-xl p-6 shadow-lg hover:border-cyan-500/30 transition duration-300 relative group overflow-hidden">
            <div className="flex items-center justify-between gap-3 mb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                        {getIcon()}
                    </div>
                    <h3 className="text-base font-black text-white">
                        {title}
                    </h3>
                </div>

                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${colors.badge}`}>
                    {getStatus()}
                </span>
            </div>

            <div className="flex items-baseline justify-between mt-2">
                <p className={`text-4xl font-black ${colors.text}`}>
                    {normalizedScore}%
                </p>
                <span className="text-xs text-slate-400 font-medium">Evaluation Score</span>
            </div>

            <div className="mt-4 w-full bg-white/[0.06] rounded-full h-2 overflow-hidden border border-white/[0.06]">
                <div
                    className={`h-full rounded-full bg-gradient-to-r ${colors.bar} transition-all duration-500`}
                    style={{ width: `${normalizedScore}%` }}
                />
            </div>
        </div>
    );
}

export default ScoreCard;