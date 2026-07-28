function StatCard({
    icon,
    iconBg,
    title,
    value,
    subtitle,
    subtitleColor,
    badge
}) {
    return (
        <div className="bg-[#0D1117]/80 backdrop-blur-xl rounded-2xl p-6 border border-white/[0.08] shadow-lg hover:border-cyan-500/30 hover:-translate-y-0.5 transition-all duration-300 flex items-start justify-between gap-4 relative overflow-hidden group">
            {/* Subtle Gradient Accent line */}
            <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="flex-1 space-y-2">
                <div className="flex items-center justify-between">
                    <p className="text-slate-400 font-extrabold text-[11px] uppercase tracking-wider">
                        {title}
                    </p>
                    {badge && (
                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                            {badge}
                        </span>
                    )}
                </div>

                <h2 className="text-3xl font-black text-white tracking-tight">
                    {value}
                </h2>

                {typeof subtitle === "string" ? (
                    <p className={`text-xs font-semibold ${subtitleColor || "text-slate-400"}`}>
                        {subtitle}
                    </p>
                ) : (
                    <div className="pt-1">
                        {subtitle}
                    </div>
                )}
            </div>

            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg transition-transform duration-300 group-hover:scale-105 ${iconBg}`}>
                {icon}
            </div>
        </div>
    );
}

export default StatCard;