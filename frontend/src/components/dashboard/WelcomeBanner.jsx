import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, Sun, Moon, Sunset } from "lucide-react";

function WelcomeBanner({ userName }) {
    const navigate = useNavigate();
    const hour = new Date().getHours();
    const greeting = hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";
    const greetingIcon = hour < 12 ? <Sun size={14} className="text-amber-400" /> : hour < 17 ? <Sunset size={14} className="text-orange-400" /> : <Moon size={14} className="text-indigo-400" />;

    return (
        <div className="relative rounded-3xl bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border border-white/[0.1] p-6 sm:p-8 text-white shadow-2xl overflow-hidden backdrop-blur-xl">
            {/* Background Decorative Ambient Blobs */}
            <div className="absolute -top-16 -right-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-16 left-1/3 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                {/* Left Content */}
                <div className="max-w-xl space-y-3">
                    {/* Time-based Badge */}
                    <div className="inline-flex items-center gap-2 bg-white/[0.08] backdrop-blur-md px-3.5 py-1 rounded-full text-xs font-semibold tracking-wide border border-white/10 shadow-xs text-slate-300">
                        {greetingIcon}
                        <span>{greeting}</span>
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black tracking-tight leading-tight text-white">
                        Welcome back, <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">{userName || "Candidate"}</span>! 👋
                    </h1>

                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed font-medium">
                        Ready to elevate your tech career? Practice with real AI interview scenarios and track your score breakdown.
                    </p>

                    {/* Quick CTA */}
                    <div className="pt-2 flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => navigate("/interview")}
                            className="px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black rounded-xl shadow-lg shadow-cyan-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
                        >
                            <Sparkles size={16} />
                            <span>Start AI Interview</span>
                        </button>
                        <button
                            onClick={() => navigate("/resume")}
                            className="px-4 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] text-slate-200 font-semibold rounded-xl backdrop-blur-sm transition border border-white/10 flex items-center gap-2 text-xs sm:text-sm cursor-pointer"
                        >
                            <span>Analyze Resume</span>
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </div>

                {/* Right Decorative Graphic Widget */}
                <div className="hidden lg:flex items-center justify-center relative">
                    <div className="bg-white/[0.05] backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl flex items-center gap-4 min-w-[240px]">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-2xl shadow-lg shrink-0">
                            🏆
                        </div>
                        <div>
                            <p className="text-[10px] text-cyan-300 font-extrabold uppercase tracking-wider">
                                Practice Goal
                            </p>
                            <h3 className="text-base font-black text-white mt-0.5">
                                Top Candidate 🚀
                            </h3>
                            <p className="text-xs text-slate-400 mt-0.5 font-medium">
                                Ready for your next step
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WelcomeBanner;