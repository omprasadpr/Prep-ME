import { Code2 } from "lucide-react";

function TechnicalSkillsCard({ analysis }) {
    if (!analysis) return null;

    const skillGroups = analysis.technical_skills || {};
    const totalSkills = Object.values(skillGroups).reduce((sum, skills) => sum + (skills?.length || 0), 0);

    return (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0D1117]/80 backdrop-blur-xl p-6 shadow-lg">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-md">
                        <Code2 size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Skills Detected</p>
                        <h2 className="text-lg font-black text-white">Technical Skills</h2>
                    </div>
                </div>
                <div className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-black text-cyan-400">{totalSkills}</div>
            </div>
            <div className="mt-4 space-y-4">
                {Object.entries(skillGroups).map(([category, skills]) =>
                    skills?.length > 0 ? (
                        <div key={category}>
                            <div className="mb-2 flex items-center justify-between gap-3">
                                <h3 className="text-xs font-black text-slate-300 capitalize">{category.replaceAll("_", " ")}</h3>
                                <span className="rounded-full bg-white/[0.06] px-2 py-0.5 text-[10px] font-bold text-slate-400">{skills.length}</span>
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                                {skills.map((skill, index) => (
                                    <span key={index} className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300">{skill}</span>
                                ))}
                            </div>
                        </div>
                    ) : null
                )}
            </div>
        </div>
    );
}

export default TechnicalSkillsCard;
