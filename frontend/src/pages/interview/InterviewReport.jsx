import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getReport } from "../../services/interviewReportApi";
import { getDashboard } from "../../services/dashboardApi";
import { ArrowLeft, Sparkles, Target, Zap, MessageSquare, Code2, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

import ScoreCard from "../../components/interview-report/ScoreCard";
import StrengthsCard from "../../components/interview-report/StrengthsCard";
import WeaknessesCard from "../../components/interview-report/WeaknessesCard";
import FeedbackCard from "../../components/interview-report/FeedbackCard";
import RecommendationCard from "../../components/interview-report/RecommendationCard";
import LoadingReport from "../../components/interview-report/LoadingReport";
import EmptyReport from "../../components/interview-report/EmptyReport";

function InterviewReport() {
    const { interviewId } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [realUserName, setRealUserName] = useState(null);

    useEffect(() => {
        const loadReportAndUser = async () => {
            try {
                // Fetch report data
                const data = await getReport(interviewId);
                setReport(data);

                // Fetch user name from dashboard API to display real user name
                try {
                    const dashData = await getDashboard();
                    if (dashData?.user_name) {
                        setRealUserName(dashData.user_name);
                    }
                } catch (e) {
                    console.error("Could not fetch user name", e);
                }

            } catch (err) {
                console.error(err);
                setReport(null);
            } finally {
                setLoading(false);
            }
        };
        loadReportAndUser();
    }, [interviewId]);

    if (loading) return <LoadingReport />;
    if (!report) return <EmptyReport />;

    const interviewTitle = report.interview_title || report.job_title || report.role || report.title || "Interview Review";
    const candidateName = realUserName || report.candidate_name || report.name || report.user_name || "Candidate";
    const overallScore = typeof report.overall_score === "number" ? report.overall_score : 0;

    return (
        <div className="min-h-screen bg-[#030712] text-slate-200 pb-20 animate-fade-in font-sans selection:bg-indigo-500/30">
            {/* Header Strip */}
            <div className="sticky top-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/[0.05] px-6 py-4 flex items-center justify-between shadow-2xl shadow-black">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="group flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.05] text-xs font-bold hover:bg-white/[0.08] hover:text-white transition-all cursor-pointer"
                >
                    <ArrowLeft size={16} className="text-slate-400 group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Dashboard</span>
                </button>
                <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-black tracking-wide shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <Sparkles size={14} />
                    <span>AI Analysis Complete</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 mt-8 space-y-6">
                
                {/* Header Bento Box */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Title Block (Spans 2 cols) */}
                    <div className="lg:col-span-2 relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-black border border-white/[0.05] p-10 flex flex-col justify-center shadow-2xl group">
                        <div className="absolute top-0 right-0 p-8 opacity-20 group-hover:opacity-40 transition-opacity">
                            <Target size={120} className="text-indigo-500" />
                        </div>
                        <div className="relative z-10">
                            <p className="text-indigo-400 font-bold tracking-widest text-xs uppercase mb-3">Candidate Dossier</p>
                            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-2">
                                {candidateName}
                            </h1>
                            <p className="text-xl font-medium text-slate-400">
                                Applied for: <span className="text-slate-200">{interviewTitle}</span>
                            </p>
                        </div>
                    </div>

                    {/* Overall Score Block */}
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-b from-indigo-950/40 to-black border border-indigo-500/20 p-10 flex flex-col items-center justify-center text-center shadow-[0_0_40px_rgba(99,102,241,0.1)]">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/20 via-transparent to-transparent opacity-50"></div>
                        <div className="relative z-10">
                            <p className="text-indigo-300 font-bold tracking-widest text-[10px] uppercase mb-4">Overall Score</p>
                            <div className="flex items-baseline justify-center gap-1">
                                <span className="text-6xl font-black text-white tracking-tighter">{overallScore}</span>
                                <span className="text-2xl font-bold text-indigo-400">/100</span>
                            </div>
                            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-bold">
                                <TrendingUp size={14} /> Top 15% Percentile
                            </div>
                        </div>
                    </div>
                </div>

                {/* Metrics Bento Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <ScoreCard title="Technical Acumen" score={report.technical_score} type="technical" />
                    <ScoreCard title="Communication" score={report.communication_score} type="communication" />
                    <ScoreCard title="Confidence & Poise" score={report.confidence_score} type="confidence" />
                </div>

                {/* Analysis & Recommendation Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Feedback takes 2 columns */}
                    <div className="lg:col-span-2">
                        <FeedbackCard feedback={report.overall_feedback} />
                    </div>
                    {/* Recommendation takes 1 column */}
                    <div className="lg:col-span-1 h-full">
                        <RecommendationCard recommendation={report.recommendation} />
                    </div>
                </div>

                {/* Strengths & Weaknesses Row */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <StrengthsCard strengths={report.strengths} />
                    <WeaknessesCard weaknesses={report.weaknesses} />
                </div>

            </div>
        </div>
    );
}

export default InterviewReport;