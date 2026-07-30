import { useState, useEffect } from "react";
import { Sparkles, Loader2, Edit3, Check, Layers } from "lucide-react";

const PRESET_ROLES = [
    "Software Engineer",
    "Full Stack Developer",
    "Python Backend Developer",
    "Java / Spring Boot Developer",
    "Node.js / Express Backend Developer",
    "Frontend Developer (React / Next.js)",
    "Data Scientist & AI/ML Engineer",
    "Machine Learning Engineer",
    "Data Engineer",
    "DevOps & Cloud Engineer (AWS/GCP/Azure)",
    "Cybersecurity Analyst & Engineer",
    "Mobile Developer (Android / iOS / Flutter)",
    "QA & Automation Test Engineer",
    "Systems & C++ Software Engineer",
    "Product Manager / Technical PM",
];

function InterviewSetup({
    role,
    setRole,
    experience,
    setExperience,
    difficulty,
    setDifficulty,
    totalQuestions,
    setTotalQuestions,
    onStartInterview,
    loading,
}) {
    const [isCustomRole, setIsCustomRole] = useState(false);
    const [customRoleInput, setCustomRoleInput] = useState("");

    // Ensure totalQuestions is fixed to 10
    useEffect(() => {
        if (setTotalQuestions && totalQuestions !== 10) {
            setTotalQuestions(10);
        }
    }, [setTotalQuestions, totalQuestions]);

    const handlePresetChange = (e) => {
        const val = e.target.value;
        if (val === "__CUSTOM__") {
            setIsCustomRole(true);
            setRole(customRoleInput || "Software Engineer");
        } else {
            setIsCustomRole(false);
            setRole(val);
        }
    };

    const handleCustomInputChange = (e) => {
        const val = e.target.value;
        setCustomRoleInput(val);
        setRole(val || "Software Engineer");
    };

    const toggleCustomMode = () => {
        if (isCustomRole) {
            setIsCustomRole(false);
            setRole(PRESET_ROLES[0]);
        } else {
            setIsCustomRole(true);
            if (customRoleInput) {
                setRole(customRoleInput);
            }
        }
    };

    const selectClass = "w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-xs sm:text-sm font-semibold text-white outline-none transition focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 focus:bg-white/[0.06] cursor-pointer";
    const inputClass = "w-full rounded-2xl border border-cyan-500/40 bg-cyan-950/20 px-4 py-3.5 text-xs sm:text-sm font-semibold text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/30 placeholder-slate-500";

    return (
        <div className="space-y-6">
            {/* Header section toggle */}
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-sm font-black text-white">Interview Target Configuration</h3>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Select a pre-configured role or type any custom role title</p>
                </div>
                <button
                    type="button"
                    onClick={toggleCustomMode}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-black text-cyan-300 transition cursor-pointer"
                >
                    <Edit3 size={13} />
                    <span>{isCustomRole ? "Use Preset Roles" : "Type Custom Role"}</span>
                </button>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                {/* Target Role Selection / Custom Input */}
                <div className="sm:col-span-2">
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Target Job Role {isCustomRole ? "(Custom Typed)" : ""}
                        </label>
                        {isCustomRole && (
                            <span className="text-[10px] font-bold text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded-full">
                                Custom Manual Mode Active
                            </span>
                        )}
                    </div>

                    {isCustomRole ? (
                        <div className="relative">
                            <input
                                type="text"
                                value={customRoleInput}
                                onChange={handleCustomInputChange}
                                placeholder="Type any role (e.g. Golang Systems Engineer, AI Agent Developer, SRE)..."
                                className={inputClass}
                                autoFocus
                            />
                            <div className="absolute right-3 top-3 text-cyan-400">
                                <Edit3 size={18} />
                            </div>
                        </div>
                    ) : (
                        <select
                            value={PRESET_ROLES.includes(role) ? role : "__CUSTOM__"}
                            onChange={handlePresetChange}
                            className={selectClass}
                        >
                            {PRESET_ROLES.map((r) => (
                                <option key={r} value={r} className="bg-[#0D1117] text-white">
                                    {r}
                                </option>
                            ))}
                            <option value="__CUSTOM__" className="bg-[#0D1117] text-cyan-300 font-bold">
                                ✏️ Type Custom Role Manually...
                            </option>
                        </select>
                    )}
                </div>

                {/* Experience Level */}
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Experience Level</label>
                    <select value={experience} onChange={(e) => setExperience(e.target.value)} className={selectClass}>
                        <option value="Fresher" className="bg-[#0D1117] text-white">Fresher (Entry Level)</option>
                        <option value="1 Year" className="bg-[#0D1117] text-white">Junior (1 Year)</option>
                        <option value="2 Years" className="bg-[#0D1117] text-white">Mid-Level (2-3 Years)</option>
                        <option value="3+ Years" className="bg-[#0D1117] text-white">Senior (3+ Years)</option>
                    </select>
                </div>

                {/* Difficulty */}
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Question Difficulty</label>
                    <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} className={selectClass}>
                        <option value="Easy" className="bg-[#0D1117] text-white">Easy</option>
                        <option value="Medium" className="bg-[#0D1117] text-white">Medium</option>
                        <option value="Hard" className="bg-[#0D1117] text-white">Hard</option>
                    </select>
                </div>

                {/* Question Count (Fixed to 10) */}
                <div className="sm:col-span-2">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Session Question Blueprint</label>
                    <div className="rounded-2xl border border-emerald-500/30 bg-emerald-950/20 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                <Layers size={18} />
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-white">10 Questions (Fixed Standard Blueprint)</h4>
                                <p className="text-[11px] text-slate-300 font-medium">Includes Intro, Tech Stack, 3 Resume Projects, 3 Coding Challenges & Behavioral Leadership</p>
                            </div>
                        </div>
                        <div className="px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-[10px] font-black text-emerald-300 shrink-0">
                            10 Questions Fixed
                        </div>
                    </div>
                </div>
            </div>

            <button
                onClick={onStartInterview}
                disabled={loading || !role.trim()}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 px-6 py-4 text-sm font-black text-white shadow-xl shadow-blue-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer mt-4"
            >
                {loading ? (
                    <>
                        <Loader2 size={18} className="animate-spin text-cyan-300" />
                        <span>Assembling 10 AI Technical Questions...</span>
                    </>
                ) : (
                    <>
                        <Sparkles size={18} />
                        <span>Launch 10-Question Mock Interview ({role})</span>
                    </>
                )}
            </button>
        </div>
    );
}

export default InterviewSetup;
