import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InterviewSetup from "../components/interview/InterviewSetup";
import { createInterview, generateQuestions } from "../services/interviewApi";
import { Sparkles, BrainCircuit, ShieldCheck, Zap } from "lucide-react";

function Interview() {
    const navigate = useNavigate();
    const [role, setRole] = useState("Python Backend Developer");
    const [experience, setExperience] = useState("Fresher");
    const [difficulty, setDifficulty] = useState("Medium");
    const [totalQuestions, setTotalQuestions] = useState(10);
    const [loading, setLoading] = useState(false);

    const handleStartInterview = async () => {
        try {
            setLoading(true);
            const interview = await createInterview({
                role,
                experience,
                difficulty,
                total_questions: Number(totalQuestions),
            });
            await generateQuestions(interview.id);
            navigate(`/interview/session/${interview.id}`);
        } catch (error) {
            console.error(error);
            alert(error.response?.data?.detail || "Unable to start interview.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto animate-slide-up">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border border-white/[0.1] backdrop-blur-xl p-6 sm:p-8 rounded-3xl shadow-2xl relative overflow-hidden text-white">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />
                <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-black mb-3">
                    <Sparkles size={14} />
                    <span>AI Interview Generator</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
                    Customize Your Mock Interview
                </h1>
                <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed font-medium">
                    Select your target role, experience level, and question volume. Our AI generator will assemble relevant questions and evaluate your responses in real time.
                </p>
            </div>

            {/* Quick Benefits Strip */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#0D1117]/80 border border-white/[0.08] backdrop-blur-xl rounded-2xl p-4 flex items-center gap-3 shadow-lg">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
                        <BrainCircuit size={18} />
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-white">Dynamic AI Questions</h4>
                        <p className="text-[11px] text-slate-400 font-medium">Tailored to exact job role</p>
                    </div>
                </div>
                <div className="bg-[#0D1117]/80 border border-white/[0.08] backdrop-blur-xl rounded-2xl p-4 flex items-center gap-3 shadow-lg">
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <ShieldCheck size={18} />
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-white">Comprehensive Scoring</h4>
                        <p className="text-[11px] text-slate-400 font-medium">Detailed feedback & scores</p>
                    </div>
                </div>
                <div className="bg-[#0D1117]/80 border border-white/[0.08] backdrop-blur-xl rounded-2xl p-4 flex items-center gap-3 shadow-lg">
                    <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <Zap size={18} />
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-white">Instant AI Feedback</h4>
                        <p className="text-[11px] text-slate-400 font-medium">Actionable advice report</p>
                    </div>
                </div>
            </div>

            {/* Setup Form Card */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#0D1117]/80 backdrop-blur-xl p-6 sm:p-10 shadow-2xl">
                <InterviewSetup
                    role={role}
                    setRole={setRole}
                    experience={experience}
                    setExperience={setExperience}
                    difficulty={difficulty}
                    setDifficulty={setDifficulty}
                    totalQuestions={totalQuestions}
                    setTotalQuestions={setTotalQuestions}
                    loading={loading}
                    onStartInterview={handleStartInterview}
                />
            </div>
        </div>
    );
}

export default Interview;
