import {
    LayoutDashboard,
    FileText,
    ClipboardList,
    Sparkles,
    LogOut,
    BrainCircuit,
    X,
    ChevronRight,
    Zap,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const navItems = [
    {
        label: "Dashboard",
        path: "/dashboard",
        icon: LayoutDashboard,
        iconColor: "text-blue-400",
    },
    {
        label: "AI Interview",
        path: "/interview",
        icon: Sparkles,
        iconColor: "text-amber-400",
        badge: "AI",
    },
    {
        label: "My History",
        path: "/my-interviews",
        icon: ClipboardList,
        iconColor: "text-slate-400",
    },
    {
        label: "Resume Analyzer",
        path: "/resume",
        icon: FileText,
        iconColor: "text-emerald-400",
    },
];

function Sidebar({ mobileOpen, setMobileOpen }) {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleNavClick = (path) => {
        navigate(path);
        if (setMobileOpen) setMobileOpen(false);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <>
            {/* Mobile backdrop */}
            {mobileOpen && (
                <div
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                />
            )}

            <aside
                className={`w-64 min-h-screen sticky top-0 flex flex-col border-r border-white/[0.06] bg-[#0A0D15]/95 backdrop-blur-xl z-50 select-none transition-all duration-300 ${
                    mobileOpen ? "fixed inset-y-0 left-0 translate-x-0" : "hidden md:flex"
                }`}
            >
                {/* Top glow accent */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />

                {/* Brand Header */}
                <div className="flex items-center justify-between px-5 py-5 border-b border-white/[0.06]">
                    <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 shrink-0">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 p-px shadow-lg shadow-blue-500/25">
                                <div className="w-full h-full rounded-[11px] bg-[#0A0D15] flex items-center justify-center">
                                    <BrainCircuit size={20} className="text-cyan-400" />
                                </div>
                            </div>
                            <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0A0D15] animate-pulse" />
                        </div>
                        <div>
                            <div className="flex items-center gap-0.5">
                                <span className="font-black text-lg text-white tracking-tight">Prep</span>
                                <span className="font-black text-lg bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-tight">ME</span>
                            </div>
                            <p className="text-[10px] text-slate-500 font-semibold tracking-wide">AI Interview Copilot</p>
                        </div>
                    </div>

                    {setMobileOpen && (
                        <button
                            onClick={() => setMobileOpen(false)}
                            className="md:hidden p-1.5 text-slate-500 hover:text-white rounded-lg hover:bg-white/10 transition"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>

                {/* Navigation */}
                <div className="flex-1 px-3 py-4 space-y-1">
                    <p className="px-3 text-[9px] uppercase font-black tracking-widest text-slate-600 mb-3">
                        Navigation
                    </p>

                    {navItems.map((item) => {
                        const active = isActive(item.path);
                        const Icon = item.icon;
                        return (
                            <button
                                key={item.path}
                                onClick={() => handleNavClick(item.path)}
                                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all duration-200 font-semibold text-sm cursor-pointer group ${
                                    active
                                        ? "bg-gradient-to-r from-blue-600/20 to-indigo-600/10 text-white border border-blue-500/20"
                                        : "text-slate-400 hover:bg-white/[0.04] hover:text-slate-200 border border-transparent"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 ${
                                        active
                                            ? "bg-gradient-to-br from-blue-600 to-indigo-600 shadow-sm shadow-blue-500/30"
                                            : "bg-white/[0.04] group-hover:bg-white/[0.08]"
                                    }`}>
                                        <Icon size={15} className={active ? "text-white" : item.iconColor} />
                                    </div>
                                    <span>{item.label}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    {item.badge && (
                                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full ${
                                            active
                                                ? "bg-cyan-400/20 text-cyan-300"
                                                : "bg-amber-400/10 text-amber-400 border border-amber-500/20"
                                        }`}>
                                            {item.badge}
                                        </span>
                                    )}
                                    {active && <ChevronRight size={13} className="text-blue-400" />}
                                </div>
                            </button>
                        );
                    })}

                    <div className="border-t border-white/[0.05] my-4" />
                    <p className="px-3 text-[9px] uppercase font-black tracking-widest text-slate-600 mb-3">
                        Account
                    </p>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-200 cursor-pointer border border-transparent hover:border-rose-500/15 group"
                    >
                        <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center group-hover:bg-rose-500/15 transition-all">
                            <LogOut size={15} />
                        </div>
                        <span>Sign Out</span>
                    </button>
                </div>

                {/* Bottom Tip Card */}
                <div className="p-3 space-y-3">
                    <div className="relative rounded-xl overflow-hidden p-4 bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/[0.08]">
                        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/40 to-transparent" />
                        <div className="flex items-center gap-2 mb-2">
                            <Zap size={13} className="text-amber-400" />
                            <h3 className="font-black text-[10px] text-slate-300 tracking-wide uppercase">AI Tip</h3>
                        </div>
                        <p className="text-[10px] leading-relaxed text-slate-400">
                            Use the <strong className="text-cyan-400">STAR Method</strong> — Situation, Task, Action, Result — for max scores!
                        </p>
                    </div>

                    {/* User badge */}
                    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center font-black text-white text-xs shrink-0">
                            P
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="font-bold text-xs text-slate-300 truncate">Prep ME Candidate</p>
                            <div className="flex items-center gap-1 mt-0.5">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                <span className="text-[9px] text-slate-500 font-semibold">Active Session</span>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}

export default Sidebar;