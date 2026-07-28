import { useNavigate } from "react-router-dom";
import { ArrowRight, Clock } from "lucide-react";

function QuickActionCard({
    title,
    description,
    icon,
    color,
    route,
    badge,
    isComingSoon = false
}) {
    const navigate = useNavigate();

    const handleClick = () => {
        if (isComingSoon) {
            alert("🚀 Practice Suggestions feature is coming soon! Stay tuned.");
            return;
        }
        if (route) navigate(route);
    };

    return (
        <button
            onClick={handleClick}
            className={`w-full bg-[#0D1117]/80 backdrop-blur-xl rounded-2xl p-6 text-left border border-white/[0.08] shadow-lg transition-all duration-300 relative group overflow-hidden flex flex-col justify-between ${
                isComingSoon
                    ? "opacity-75 hover:opacity-100 hover:border-amber-500/30 cursor-pointer"
                    : "hover:shadow-cyan-500/5 hover:-translate-y-0.5 hover:border-cyan-500/30 cursor-pointer"
            }`}
        >
            {/* Top Accent Line */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 transition-opacity duration-300 opacity-0 group-hover:opacity-100 ${
                isComingSoon
                    ? "bg-gradient-to-r from-amber-400 via-orange-500 to-amber-600"
                    : "bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
            }`} />

            <div>
                <div className="flex items-start justify-between mb-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-105 ${color}`}>
                        {icon}
                    </div>
                    {badge && (
                        <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                            isComingSoon
                                ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                                : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                        }`}>
                            {badge}
                        </span>
                    )}
                </div>

                <h3 className={`text-base font-black transition-colors flex items-center justify-between gap-2 ${
                    isComingSoon ? "text-slate-200 group-hover:text-amber-400" : "text-white group-hover:text-cyan-400"
                }`}>
                    <span>{title}</span>
                    {isComingSoon ? (
                        <Clock size={15} className="text-amber-400 shrink-0" />
                    ) : (
                        <ArrowRight size={16} className="text-slate-500 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-cyan-400 transition-all duration-300 shrink-0" />
                    )}
                </h3>

                <p className="text-slate-400 text-xs mt-1.5 leading-relaxed font-medium">
                    {description}
                </p>
            </div>
        </button>
    );
}

export default QuickActionCard;