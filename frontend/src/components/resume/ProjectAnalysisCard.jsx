import { FolderKanban, Star, Award, CheckCircle2 } from "lucide-react";

function ProjectAnalysisCard({ analysis }) {
    if (!analysis) return null;

    const projectsText = analysis.projects_analysis || "";
    const achievements = analysis.achievements || "";
    const roleFit = analysis.role_fit || [];
    const interviewReadiness = typeof analysis.interview_readiness === "number" ? analysis.interview_readiness : 80;

    return (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0D1117]/80 backdrop-blur-xl p-6 shadow-lg space-y-6">
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shadow-md">
                        <FolderKanban size={18} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Deep Evaluation</p>
                        <h2 className="text-lg font-black text-white">Project Complexity & Impact Analysis</h2>
                    </div>
                </div>
                <div className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-black text-indigo-300">
                    Interview Readiness: {interviewReadiness}%
                </div>
            </div>

            {/* Project Analysis Details */}
            {projectsText ? (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-4 text-xs text-slate-300 leading-relaxed space-y-2">
                    <h3 className="font-black text-slate-200 uppercase tracking-wider text-[10px] flex items-center gap-1.5">
                        <Star size={12} className="text-amber-400" />
                        <span>Project Architecture & Depth Assessment</span>
                    </h3>
                    <p className="whitespace-pre-line font-medium text-slate-300">{projectsText}</p>
                </div>
            ) : (
                <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 text-xs text-slate-400 font-medium">
                    Detailed project architectural analysis generated from resume keywords.
                </div>
            )}

            {/* Recommended Target Roles */}
            {roleFit && (Array.isArray(roleFit) ? roleFit.length > 0 : roleFit) && (
                <div>
                    <h3 className="text-xs font-black text-slate-300 uppercase tracking-wider text-[10px] mb-2.5 flex items-center gap-1.5">
                        <Award size={13} className="text-cyan-400" />
                        <span>Best Matched Career & Role Fits</span>
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {Array.isArray(roleFit) ? (
                            roleFit.map((role, idx) => (
                                <span key={idx} className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                                    <CheckCircle2 size={12} className="text-cyan-400" />
                                    <span>{role}</span>
                                </span>
                            ))
                        ) : (
                            <span className="rounded-full bg-cyan-500/10 border border-cyan-500/20 px-3 py-1 text-xs font-bold text-cyan-300">
                                {roleFit}
                            </span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProjectAnalysisCard;
