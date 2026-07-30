import { useState } from "react";
import {
    FileText,
    Sparkles,
    AlertCircle,
    CheckCircle2,
    UploadCloud,
    BarChart3,
    Code2,
    Lightbulb,
    RotateCcw,
    ShieldCheck
} from "lucide-react";
import ResumeUpload from "../components/resume/ResumeUpload";
import ResumeCard from "../components/resume/ResumeCard";
import ATSScoreCard from "../components/resume/ATSScoreCard";
import TechnicalSkillsCard from "../components/resume/TechnicalSkillsCard";
import MissingSkillsCard from "../components/resume/MissingSkillsCard";
import SuggestionCard from "../components/resume/SuggestionCard";
import ProjectAnalysisCard from "../components/resume/ProjectAnalysisCard";

function Resume() {
    const [resumeData, setResumeData] = useState(null);
    const [activeTab, setActiveTab] = useState("all"); // 'all' | 'ats' | 'skills' | 'gaps' | 'advice'

    const analysis = resumeData?.analysis || {};
    const totalSkills = Object.values(analysis.technical_skills || {}).reduce(
        (sum, skills) => sum + (skills?.length || 0),
        0
    );
    const missingSkillsCount = Object.values(analysis.missing_skills || {}).reduce(
        (sum, skills) => sum + (skills?.length || 0),
        0
    );
    const scoreValue = typeof analysis.ats_score === "number" ? analysis.ats_score : null;

    const handleUploadSuccess = (data) => {
        setResumeData(data);
    };

    const handleReset = () => {
        setResumeData(null);
        setActiveTab("all");
    };

    return (
        <div className="space-y-8 animate-slide-up">
            {/* Header Title Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-gradient-to-r from-emerald-900/50 via-teal-900/50 to-cyan-900/50 p-6 sm:p-8 rounded-3xl border border-white/[0.1] backdrop-blur-xl shadow-2xl relative overflow-hidden text-white">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent" />
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs font-black">
                        <FileText size={14} />
                        <span>AI Resume Optimizer</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                        Resume Analysis & ATS Report
                    </h1>
                    <p className="text-slate-300 text-xs sm:text-sm max-w-xl font-medium">
                        Upload your resume for instant ATS compatibility scoring, keyword extraction, and targeted career recommendations.
                    </p>
                </div>

                {resumeData && (
                    <button
                        onClick={handleReset}
                        className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-black text-slate-200 transition cursor-pointer shrink-0"
                    >
                        <RotateCcw size={14} />
                        <span>Upload New Resume</span>
                    </button>
                )}
            </div>

            {/* When No Resume Uploaded Yet */}
            {!resumeData ? (
                <div className="space-y-8">
                    {/* Main Upload Box */}
                    <ResumeUpload onUploadSuccess={handleUploadSuccess} />

                    {/* Features Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                        <div className="rounded-2xl border border-white/[0.08] bg-[#0D1117]/80 backdrop-blur-xl p-5 shadow-lg flex items-start gap-4">
                            <div className="p-3 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shrink-0">
                                <ShieldCheck size={20} />
                            </div>
                            <div>
                                <h3 className="font-black text-sm text-white">ATS Compatibility</h3>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed font-medium">
                                    Instant parser scoring to make sure your application gets past automated recruiters.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/[0.08] bg-[#0D1117]/80 backdrop-blur-xl p-5 shadow-lg flex items-start gap-4">
                            <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                                <Code2 size={20} />
                            </div>
                            <div>
                                <h3 className="font-black text-sm text-white">Skill Extraction</h3>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed font-medium">
                                    Categorizes your technical stacks into Languages, Frameworks, and Tools.
                                </p>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/[0.08] bg-[#0D1117]/80 backdrop-blur-xl p-5 shadow-lg flex items-start gap-4">
                            <div className="p-3 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0">
                                <AlertCircle size={20} />
                            </div>
                            <div>
                                <h3 className="font-black text-sm text-white">Keyword Gap Analysis</h3>
                                <p className="text-xs text-slate-400 mt-1 leading-relaxed font-medium">
                                    Highlights missing keywords to tailor your resume for specific job descriptions.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                /* When Resume Analysis is Complete */
                <div className="space-y-6">
                    {/* Quick Stats Grid */}
                    <div className="grid gap-4 sm:grid-cols-4">
                        <div className="rounded-2xl border border-white/[0.08] bg-[#0D1117]/80 backdrop-blur-xl p-5 shadow-lg flex items-center justify-between">
                            <div>
                                <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">ATS Score</p>
                                <p className={`mt-1 text-3xl font-black ${scoreValue >= 85 ? 'text-emerald-400' : scoreValue >= 65 ? 'text-cyan-400' : 'text-amber-400'}`}>
                                    {scoreValue !== null ? `${scoreValue}%` : "--"}
                                </p>
                                <p className="mt-0.5 text-xs text-slate-400 font-medium">Overall Match</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                                <Sparkles size={20} />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/[0.08] bg-[#0D1117]/80 backdrop-blur-xl p-5 shadow-lg flex items-center justify-between">
                            <div>
                                <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Detected Skills</p>
                                <p className="mt-1 text-3xl font-black text-white">{totalSkills}</p>
                                <p className="mt-0.5 text-xs text-slate-400 font-medium font-medium">Keywords Tagged</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                                <CheckCircle2 size={20} />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/[0.08] bg-[#0D1117]/80 backdrop-blur-xl p-5 shadow-lg flex items-center justify-between">
                            <div>
                                <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Keyword Gaps</p>
                                <p className="mt-1 text-3xl font-black text-amber-400">{missingSkillsCount}</p>
                                <p className="mt-0.5 text-xs text-slate-400 font-medium">Missing Skills</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                                <AlertCircle size={20} />
                            </div>
                        </div>

                        <div className="rounded-2xl border border-white/[0.08] bg-[#0D1117]/80 backdrop-blur-xl p-5 shadow-lg flex items-center justify-between">
                            <div>
                                <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">File Status</p>
                                <p className="mt-1 text-sm font-black text-white truncate max-w-[120px]">{resumeData?.resume?.filename || "Resume"}</p>
                                <p className="mt-0.5 text-xs text-emerald-400 font-extrabold">Parsed Successfully</p>
                            </div>
                            <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400">
                                <FileText size={20} />
                            </div>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="flex items-center gap-2 border-b border-white/[0.08] pb-3 overflow-x-auto">
                        <button
                            onClick={() => setActiveTab("all")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer shrink-0 ${
                                activeTab === "all"
                                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                    : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent"
                            }`}
                        >
                            <BarChart3 size={14} />
                            <span>Full Report</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("ats")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer shrink-0 ${
                                activeTab === "ats"
                                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                    : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent"
                            }`}
                        >
                            <ShieldCheck size={14} />
                            <span>ATS Score</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("skills")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer shrink-0 ${
                                activeTab === "skills"
                                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                    : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent"
                            }`}
                        >
                            <Code2 size={14} />
                            <span>Detected Skills ({totalSkills})</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("gaps")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer shrink-0 ${
                                activeTab === "gaps"
                                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                    : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent"
                            }`}
                        >
                            <AlertCircle size={14} />
                            <span>Keyword Gaps ({missingSkillsCount})</span>
                        </button>

                        <button
                            onClick={() => setActiveTab("advice")}
                            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition cursor-pointer shrink-0 ${
                                activeTab === "advice"
                                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                                    : "bg-white/[0.03] text-slate-400 hover:text-white hover:bg-white/[0.06] border border-transparent"
                            }`}
                        >
                            <Lightbulb size={14} />
                            <span>AI Suggestions</span>
                        </button>
                    </div>

                    {/* Tab Content Display */}
                    {activeTab === "all" && (
                        <div className="space-y-6">
                            <ResumeCard resume={resumeData.resume} />
                            <div className="grid gap-6 lg:grid-cols-2">
                                <ATSScoreCard analysis={resumeData.analysis} />
                                <TechnicalSkillsCard analysis={resumeData.analysis} />
                            </div>
                            <ProjectAnalysisCard analysis={resumeData.analysis} />
                            <div className="grid gap-6 lg:grid-cols-2">
                                <MissingSkillsCard analysis={resumeData.analysis} />
                                <SuggestionCard analysis={resumeData.analysis} />
                            </div>
                        </div>
                    )}

                    {activeTab === "ats" && (
                        <div className="space-y-6">
                            <ATSScoreCard analysis={resumeData.analysis} />
                            <ResumeCard resume={resumeData.resume} />
                        </div>
                    )}

                    {activeTab === "skills" && (
                        <TechnicalSkillsCard analysis={resumeData.analysis} />
                    )}

                    {activeTab === "gaps" && (
                        <MissingSkillsCard analysis={resumeData.analysis} />
                    )}

                    {activeTab === "advice" && (
                        <SuggestionCard analysis={resumeData.analysis} />
                    )}
                </div>
            )}
        </div>
    );
}

export default Resume;
