import { AlertTriangle } from "lucide-react";

function MissingSkillsCard({ analysis }) {
    if (!analysis) return null;

    const missingSkills = analysis.missing_skills || {};
    const totalMissing = Object.values(missingSkills).reduce((sum, skills) => sum + (skills?.length || 0), 0);

    return (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0D1117]/80 backdrop-blur-xl p-6 shadow-lg">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-md">
                        <AlertTriangle size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Keyword Gaps</p>
                        <h2 className="text-lg font-black text-white">Recommended Additions</h2>
                    </div>
                </div>
                <div className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-black text-amber-400">{totalMissing}</div>
            </div>
            {totalMissing === 0 ? (
                <div className="mt-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-3 text-xs font-bold text-emerald-400">
                    🎉 Excellent! No major missing skills detected.
                </div>
            ) : (
                <div className="mt-4 space-y-4">
                    {Object.entries(missingSkills).map(([priority, skills]) =>
                        skills?.length > 0 ? (
                            <div key={priority}>
                                <div className="mb-2 flex items-center justify-between gap-3">
                                    <h3 className="text-xs font-black text-slate-300 capitalize">{priority.replaceAll("_", " ")}</h3>
                                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-400">{skills.length}</span>
                                </div>
                                <div className="flex flex-wrap gap-1.5">
                                    {skills.map((skill, index) => (
                                        <span key={index} className="rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs font-bold text-amber-300">{skill}</span>
                                    ))}
                                </div>
                            </div>
                        ) : null
                    )}
                </div>
            )}
        </div>
    );
}

export default MissingSkillsCard;
