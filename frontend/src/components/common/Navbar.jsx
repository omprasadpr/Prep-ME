import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
    Bell,
    Menu,
    Search,
    X,
    ChevronDown,
    LogOut,
    BrainCircuit,
    Sparkles,
    SlidersHorizontal,
    Check,
    Play,
    Clock,
    AlertCircle,
    CheckCircle2
} from "lucide-react";
import { getMyInterviews } from "../../services/interviewApi";
import { getDashboard } from "../../services/dashboardApi";

function Navbar({ userName: propUserName = "Candidate", onSearch, onToggleMobileSidebar }) {
    const navigate = useNavigate();

    const [openProfile, setOpenProfile] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [filterOpen, setFilterOpen] = useState(false);
    const [search, setSearch] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("all");
    const [fetchedUserName, setFetchedUserName] = useState(null);

    const [activeInterviews, setActiveInterviews] = useState([]);
    const [loadingNotifications, setLoadingNotifications] = useState(false);

    const navRef = useRef(null);
    const userName = fetchedUserName || (propUserName !== "Candidate" ? propUserName : "Candidate");

    // Fetch active (Pending & In Progress) interviews for notifications and user info
    const fetchNotificationInterviews = async () => {
        try {
            setLoadingNotifications(true);
            const data = await getMyInterviews();
            const filtered = data.filter(
                (item) => item.status === "Pending" || item.status === "In Progress"
            );
            setActiveInterviews(filtered);
        } catch (err) {
            console.error("Failed to load notifications", err);
        } finally {
            setLoadingNotifications(false);
        }
    };

    const fetchUserInfo = async () => {
        try {
            const dashData = await getDashboard();
            if (dashData?.user_name) {
                setFetchedUserName(dashData.user_name);
            }
        } catch (e) {
            console.error("Failed to fetch user info in navbar", e);
        }
    };

    useEffect(() => {
        fetchNotificationInterviews();
        fetchUserInfo();
    }, []);

    // Close popups on click outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                setOpenProfile(false);
                setNotificationOpen(false);
                setFilterOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const filterOptions = [
        { id: "all", label: "All Attributes" },
        { id: "role", label: "Search by Role" },
        { id: "status", label: "Search by Status" },
        { id: "difficulty", label: "Search by Difficulty" },
        { id: "experience", label: "Search by Experience" },
    ];

    const handleSearchChange = (e) => {
        const val = e.target.value;
        setSearch(val);
        if (onSearch) onSearch(val, selectedFilter);
    };

    const handleExecuteSearch = (e) => {
        if (e) e.preventDefault();
        if (onSearch) onSearch(search, selectedFilter);
    };

    const handleSelectFilter = (filterId) => {
        setSelectedFilter(filterId);
        setFilterOpen(false);
        if (onSearch) onSearch(search, filterId);
    };

    const handleNotificationClick = () => {
        setOpenProfile(false);
        const newState = !notificationOpen;
        setNotificationOpen(newState);
        if (newState) {
            fetchNotificationInterviews();
        }
    };

    const initials = userName
        ? userName.split(" ").map((w) => w[0]).join("").substring(0, 2).toUpperCase()
        : "P";

    const pendingCount = activeInterviews.filter((i) => i.status === "Pending").length;
    const inProgressCount = activeInterviews.filter((i) => i.status === "In Progress").length;
    const totalActiveCount = activeInterviews.length;

    return (
        <header ref={navRef} className="sticky top-0 z-40 bg-[#0A0D15]/90 backdrop-blur-xl border-b border-white/[0.06] px-4 sm:px-6 lg:px-8 py-3 transition-all">
            {/* Top glowing accent line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent" />

            <div className="flex items-center justify-between gap-2 sm:gap-4">
                {/* Left section */}
                <div className="flex items-center gap-2.5 shrink-0">
                    <button
                        onClick={onToggleMobileSidebar}
                        className="md:hidden p-2 rounded-xl text-slate-400 hover:text-white bg-white/[0.04] border border-white/[0.06] hover:bg-white/[0.08] transition active:scale-95 cursor-pointer"
                        title="Toggle Navigation"
                    >
                        <Menu size={18} />
                    </button>

                    <div className="hidden sm:flex md:hidden items-center gap-2 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.06]">
                        <BrainCircuit size={16} className="text-cyan-400" />
                        <span className="font-black text-xs text-white">Prep<span className="text-cyan-400">ME</span></span>
                    </div>
                </div>

                {/* Center: Searchbar with Filter by Role, Status, Difficulty, Experience */}
                <div className="flex-1 max-w-xl">
                    <form
                        onSubmit={handleExecuteSearch}
                        className="flex items-center bg-white/[0.04] hover:bg-white/[0.06] focus-within:bg-white/[0.06] border border-white/[0.08] focus-within:border-cyan-500/40 rounded-2xl p-1 transition-all gap-1.5 shadow-inner"
                    >
                        {/* Search icon & Input */}
                        <div className="flex items-center flex-1 pl-2.5 gap-2 min-w-0">
                            <Search size={14} className="text-slate-400 shrink-0" />
                            <input
                                type="text"
                                value={search}
                                onChange={handleSearchChange}
                                placeholder={
                                    selectedFilter === "role"
                                        ? "Search by role (e.g. Frontend, Python)..."
                                        : selectedFilter === "status"
                                        ? "Search by status (Pending, In Progress, Completed)..."
                                        : selectedFilter === "difficulty"
                                        ? "Search by difficulty (Easy, Medium, Hard)..."
                                        : selectedFilter === "experience"
                                        ? "Search by experience (Fresher, Senior, 1 Year)..."
                                        : "Search by role, status, difficulty, experience..."
                                }
                                className="w-full bg-transparent text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none py-1 font-medium truncate"
                            />
                            {search && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearch("");
                                        if (onSearch) onSearch("", selectedFilter);
                                    }}
                                    className="text-slate-500 hover:text-slate-300 p-1 rounded-full hover:bg-white/10 transition shrink-0"
                                >
                                    <X size={13} />
                                </button>
                            )}
                        </div>

                        {/* Filter Dropdown Toggle */}
                        <div className="relative shrink-0 border-l border-white/[0.08] pl-1.5">
                            <button
                                type="button"
                                onClick={() => setFilterOpen(!filterOpen)}
                                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                                    selectedFilter !== "all"
                                        ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-white/[0.06]"
                                }`}
                                title="Filter options"
                            >
                                <SlidersHorizontal size={13} />
                                <span className="hidden sm:inline text-[11px] font-bold">
                                    {filterOptions.find((f) => f.id === selectedFilter)?.label.replace("Search by ", "")}
                                </span>
                                <ChevronDown size={12} className={`transition-transform ${filterOpen ? "rotate-180" : ""}`} />
                            </button>

                            {/* Filter Dropdown Menu */}
                            {filterOpen && (
                                <div className="absolute right-0 mt-2 w-52 bg-[#0F1420]/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/[0.1] z-50 py-1.5 animate-slide-up">
                                    <div className="px-3 py-1.5 border-b border-white/[0.06]">
                                        <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                                            Search Filter Attribute
                                        </p>
                                    </div>
                                    <div className="p-1 space-y-0.5">
                                        {filterOptions.map((opt) => (
                                            <button
                                                key={opt.id}
                                                type="button"
                                                onClick={() => handleSelectFilter(opt.id)}
                                                className={`w-full flex items-center justify-between px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                                                    selectedFilter === opt.id
                                                        ? "bg-cyan-500/20 text-cyan-300 font-black"
                                                        : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                                                }`}
                                            >
                                                <span>{opt.label}</span>
                                                {selectedFilter === opt.id && <Check size={13} className="text-cyan-400" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="hidden sm:flex items-center px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black rounded-xl text-xs transition duration-200 active:scale-95 cursor-pointer shrink-0 shadow-md shadow-cyan-500/20"
                        >
                            Search
                        </button>
                    </form>
                </div>

                {/* Right Action Controls */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                    {/* Practice CTA Button */}
                    <button
                        onClick={() => navigate("/interview")}
                        className="hidden md:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-600/20 to-indigo-600/10 hover:from-blue-600/30 hover:to-indigo-600/20 text-cyan-300 border border-cyan-500/20 text-xs font-extrabold transition duration-200 active:scale-95 cursor-pointer"
                    >
                        <Sparkles size={14} className="text-cyan-400" />
                        <span>Practice AI</span>
                    </button>

                    {/* Notification Button with Live Pop-Up */}
                    <div className="relative">
                        <button
                            onClick={handleNotificationClick}
                            className={`p-2 sm:p-2.5 rounded-xl transition cursor-pointer relative active:scale-95 border ${
                                notificationOpen
                                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-lg shadow-cyan-500/10"
                                    : "bg-white/[0.04] text-slate-400 hover:text-white border-white/[0.06] hover:bg-white/[0.08]"
                            }`}
                            title="Notifications"
                        >
                            <Bell size={17} />
                            {totalActiveCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-gradient-to-br from-rose-500 to-pink-600 text-white text-[9px] flex items-center justify-center font-black border-2 border-[#0A0D15] shadow-md animate-pulse">
                                    {totalActiveCount}
                                </span>
                            )}
                        </button>

                        {/* Responsive Notification Pop-up Dialog */}
                        {notificationOpen && (
                            <div className="fixed sm:absolute left-4 right-4 sm:left-auto sm:right-0 top-16 sm:top-full mt-2 sm:w-96 bg-[#0F1420]/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/[0.1] z-50 p-4 sm:p-5 animate-slide-up max-h-[80vh] overflow-y-auto">
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent rounded-t-3xl" />

                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/[0.06]">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                            <Bell size={16} />
                                        </div>
                                        <div>
                                            <h3 className="font-black text-sm text-white leading-tight">
                                                Active Session Alerts
                                            </h3>
                                            <p className="text-[10px] text-slate-400 font-medium">Pending & In-Progress Interviews</p>
                                        </div>
                                    </div>
                                    {totalActiveCount > 0 && (
                                        <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                            {totalActiveCount} Actionable
                                        </span>
                                    )}
                                </div>

                                {/* Status Summary Chips */}
                                <div className="grid grid-cols-2 gap-2 mb-4">
                                    <div className="flex items-center justify-between bg-amber-500/10 border border-amber-500/20 rounded-xl p-2.5">
                                        <div className="flex items-center gap-1.5 text-xs text-amber-300 font-bold">
                                            <Clock size={13} />
                                            <span>Pending</span>
                                        </div>
                                        <span className="text-xs font-black text-amber-400 bg-amber-500/20 px-2 py-0.5 rounded-full">{pendingCount}</span>
                                    </div>

                                    <div className="flex items-center justify-between bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-2.5">
                                        <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-bold">
                                            <Play size={13} />
                                            <span>In Progress</span>
                                        </div>
                                        <span className="text-xs font-black text-cyan-400 bg-cyan-500/20 px-2 py-0.5 rounded-full">{inProgressCount}</span>
                                    </div>
                                </div>

                                {/* Notification List */}
                                {loadingNotifications ? (
                                    <div className="text-center py-6 text-xs text-slate-400 font-medium">
                                        Checking active interviews...
                                    </div>
                                ) : activeInterviews.length === 0 ? (
                                    <div className="text-center py-6 bg-white/[0.02] rounded-2xl border border-white/[0.04]">
                                        <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center mx-auto mb-2">
                                            <CheckCircle2 size={20} />
                                        </div>
                                        <p className="text-emerald-400 font-black text-xs">🎉 All Caught Up!</p>
                                        <p className="text-slate-400 text-[11px] mt-1 font-medium">No pending or in-progress interviews right now.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2.5">
                                        <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 px-1">
                                            Action Required ({activeInterviews.length})
                                        </p>

                                        {activeInterviews.map((session) => (
                                            <div
                                                key={session.id}
                                                className="bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-cyan-500/30 rounded-2xl p-3 transition flex items-center justify-between gap-3 group"
                                            >
                                                <div className="min-w-0 space-y-1">
                                                    <div className="flex items-center gap-2">
                                                        <h4 className="text-xs font-black text-white truncate">
                                                            {session.role}
                                                        </h4>
                                                        <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-full border shrink-0 ${
                                                            session.status === "In Progress"
                                                                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                                                                : "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                                        }`}>
                                                            {session.status}
                                                        </span>
                                                    </div>
                                                    <p className="text-[10px] text-slate-400 font-medium truncate">
                                                        Level: {session.experience} • Diff: {session.difficulty}
                                                    </p>
                                                </div>

                                                <button
                                                    onClick={() => {
                                                        setNotificationOpen(false);
                                                        navigate(`/interview/session/${session.id}`);
                                                    }}
                                                    className="px-3 py-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white rounded-xl text-xs font-black shadow-md flex items-center gap-1 shrink-0 cursor-pointer"
                                                >
                                                    <Play size={12} />
                                                    <span>{session.status === "In Progress" ? "Resume" : "Start"}</span>
                                                </button>
                                            </div>
                                        ))}

                                        <button
                                            onClick={() => {
                                                setNotificationOpen(false);
                                                navigate("/my-interviews");
                                            }}
                                            className="w-full mt-2 py-2.5 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 font-black rounded-xl text-xs transition text-center border border-white/[0.06] cursor-pointer"
                                        >
                                            View Full History →
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative">
                        <div
                            onClick={() => {
                                setNotificationOpen(false);
                                setOpenProfile(!openProfile);
                            }}
                            className="flex items-center gap-2 cursor-pointer p-1 sm:p-1.5 pr-2 sm:pr-2.5 rounded-xl hover:bg-white/[0.06] border border-transparent hover:border-white/[0.08] transition active:scale-95"
                        >
                            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 text-white flex items-center justify-center font-black text-xs shadow-md">
                                {initials}
                            </div>
                            <div className="hidden lg:block text-left">
                                <p className="font-black text-xs text-white leading-tight">{userName}</p>
                                <p className="text-[10px] text-cyan-400 font-bold">Candidate</p>
                            </div>
                            <ChevronDown size={13} className={`text-slate-400 transition-transform ${openProfile ? "rotate-180 text-cyan-400" : ""}`} />
                        </div>

                        {openProfile && (
                            <div className="absolute right-0 mt-2 w-52 bg-[#0F1420]/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/[0.1] z-50 py-2 animate-slide-up">
                                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent rounded-t-2xl" />
                                <div className="px-4 py-2.5 border-b border-white/[0.06]">
                                    <p className="font-black text-xs text-white">{userName}</p>
                                    <p className="text-[10px] text-cyan-400 font-bold">PrepME Candidate</p>
                                </div>
                                <div className="p-1">
                                    <button
                                        onClick={handleLogout}
                                        className="w-full text-left px-3 py-2 text-xs hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 font-extrabold transition flex items-center gap-2 cursor-pointer rounded-xl"
                                    >
                                        <LogOut size={14} />
                                        <span>Sign Out</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Navbar;
