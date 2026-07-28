import { Sparkles, Loader2 } from "lucide-react";

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
    const selectClass = "w-full rounded-2xl border border-white/[0.08] bg-white/[0.04] px-4 py-3.5 text-xs sm:text-sm font-semibold text-white outline-none transition focus:border-cyan-500/50 focus:ring-2 focus:ring-cyan-500/20 focus:bg-white/[0.06] cursor-pointer";

    return (
        <div className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
                {/* Role Selection */}
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Target Job Role</label>
                    <select value={role} onChange={(e) => setRole(e.target.value)} className={selectClass}>
                        <option value="Python Backend Developer" className="bg-[#0D1117] text-white">Python Backend Developer</option>
                        <option value="Frontend Developer" className="bg-[#0D1117] text-white">Frontend Developer (React/Next)</option>
                        <option value="Full Stack Developer" className="bg-[#0D1117] text-white">Full Stack Developer</option>
                        <option value="Data Scientist" className="bg-[#0D1117] text-white">Data Scientist / AI Engineer</option>
                        <option value="DevOps Engineer" className="bg-[#0D1117] text-white">DevOps & Cloud Engineer</option>
                    </select>
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

                {/* Question Count */}
                <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Total Questions</label>
                    <select value={totalQuestions} onChange={(e) => setTotalQuestions(e.target.value)} className={selectClass}>
                        <option value={5} className="bg-[#0D1117] text-white">5 Questions (Quick Session)</option>
                        <option value={10} className="bg-[#0D1117] text-white">10 Questions (Standard Session)</option>
                        <option value={15} className="bg-[#0D1117] text-white">15 Questions (Full Mock)</option>
                    </select>
                </div>
            </div>

            <button
                onClick={onStartInterview}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 px-6 py-4 text-sm font-black text-white shadow-xl shadow-blue-600/25 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer mt-4"
            >
                {loading ? (
                    <>
                        <Loader2 size={18} className="animate-spin text-cyan-300" />
                        <span>Generating AI Interview Questions...</span>
                    </>
                ) : (
                    <>
                        <Sparkles size={18} />
                        <span>Launch AI Interview Session</span>
                    </>
                )}
            </button>
        </div>
    );
}

export default InterviewSetup;
