function ProgressBar({ current = 1, total = 10 }) {
    const percentage = total > 0 ? Math.min(100, Math.max(0, (current / total) * 100)) : 0;

    // Active step index (0-indexed)
    const activeIndex = Math.max(0, current - 1);

    return (
        <div className="w-full space-y-3">
            {/* Top Label & Percentage */}
            <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                    <span className="font-black text-slate-300 uppercase tracking-widest text-[11px]">
                        Session Progress
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-slate-400 font-bold text-xs">
                        Question {current} of {total}
                    </span>
                    <span className="font-black text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20 text-xs">
                        {Math.round(percentage)}%
                    </span>
                </div>
            </div>

            {/* Progress Bar Track */}
            <div className="w-full bg-white/[0.06] rounded-full h-3 p-0.5 border border-white/[0.08] relative overflow-hidden shadow-inner">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-500 ease-out relative shadow-md shadow-cyan-500/20"
                    style={{ width: `${percentage}%` }}
                >
                    {/* Glowing lead tip */}
                    <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full blur-[1px]" />
                </div>
            </div>

            {/* Step Dots indicator */}
            <div className="flex justify-between items-center pt-1 px-1">
                {Array.from({ length: total }).map((_, i) => {
                    const isCompleted = i < activeIndex;
                    const isActive = i === activeIndex;

                    return (
                        <div key={i} className="flex flex-col items-center gap-1 group">
                            <div
                                className={`rounded-full transition-all duration-300 ${
                                    isCompleted
                                        ? "w-2.5 h-2.5 bg-cyan-400 shadow-sm shadow-cyan-400/50"
                                        : isActive
                                        ? "w-3.5 h-3.5 bg-gradient-to-br from-cyan-400 to-blue-500 ring-4 ring-cyan-500/20 shadow-md shadow-cyan-400/50 animate-pulse"
                                        : "w-2 h-2 bg-white/20"
                                }`}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ProgressBar;