import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { generateReport } from "../../services/interviewReportApi";
import QuestionCard from "../../components/interview/QuestionCard";
import AnswerBox from "../../components/interview/AnswerBox";
import ProgressBar from "../../components/interview/ProgressBar";
import Timer from "../../components/interview/Timer";
import {
    getInterview,
    getQuestions,
    submitAnswer,
    updateInterviewProgress,
    completeInterview,
} from "../../services/interviewApi";
import {
    Volume2,
    VolumeX,
    BrainCircuit,
    ChevronRight,
    Flag,
    Loader2,
    ArrowLeft,
    ShieldCheck
} from "lucide-react";
import useSpeechSynthesis from "../../hooks/useSpeechSynthesis";

function InterviewSession() {
    const { interviewId } = useParams();
    const navigate = useNavigate();

    const [questions, setQuestions] = useState([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const { isEnabled, toggleVoice } = useSpeechSynthesis();

    useEffect(() => {
        return () => window.speechSynthesis.cancel();
    }, []);

    useEffect(() => {
        const loadInterview = async () => {
            try {
                const interview = await getInterview(interviewId);
                if (interview.status === "Completed") {
                    navigate(`/interview-report/${interview.id}`);
                    return;
                }
                const questionData = await getQuestions(interviewId);
                setQuestions(questionData);
                setCurrentQuestion(Math.max(0, interview.current_question - 1));
            } catch (err) {
                console.log(err);
                alert("Unable to load interview.");
            } finally {
                setLoading(false);
            }
        };

        loadInterview();
    }, [interviewId, navigate]);

    const handleNext = async () => {
        window.speechSynthesis.cancel();
        if (submitting) return;
        if (!answer.trim()) {
            alert("Please enter your answer before proceeding.");
            return;
        }

        try {
            setSubmitting(true);
            await submitAnswer({
                question_id: questions[currentQuestion].id,
                user_answer: answer,
            });

            if (currentQuestion === questions.length - 1) {
                await completeInterview(interviewId);
                await generateReport(interviewId);
                navigate(`/interview-report/${interviewId}`);
                return;
            }

            await updateInterviewProgress(interviewId, currentQuestion + 2);
            setAnswer("");
            setCurrentQuestion((prev) => prev + 1);
        } catch (err) {
            console.log(err);
            alert("Unable to submit answer.");
        } finally {
            setSubmitting(false);
        }
    };

    const isLast = currentQuestion === questions.length - 1;

    /* ---------- Loading State ---------- */
    if (loading) {
        return (
            <div className="min-h-screen bg-[#070A11] flex items-center justify-center">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-indigo-600 p-0.5 mx-auto shadow-xl shadow-cyan-500/20">
                        <div className="w-full h-full rounded-[14px] bg-[#070A11] flex items-center justify-center">
                            <BrainCircuit size={32} className="text-cyan-400 animate-pulse" />
                        </div>
                    </div>
                    <div>
                        <p className="text-white font-black text-lg">Initializing AI Session</p>
                        <p className="text-slate-400 text-xs mt-1">Preparing target questions and speech engine...</p>
                    </div>
                    <Loader2 size={20} className="text-cyan-400 animate-spin mx-auto" />
                </div>
            </div>
        );
    }

    /* ---------- Empty State ---------- */
    if (!questions.length) {
        return (
            <div className="min-h-screen bg-[#070A11] flex items-center justify-center px-4">
                <div className="text-center max-w-sm space-y-4">
                    <div className="text-5xl">🤔</div>
                    <h2 className="text-white font-extrabold text-xl">No Questions Found</h2>
                    <p className="text-slate-400 text-xs">We couldn't find questions for this interview session. Please try starting a new session.</p>
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="mt-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold text-xs shadow-md cursor-pointer"
                    >
                        Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#070A11] text-slate-100 font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
            {/* Header */}
            <header className="sticky top-0 z-30 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800/80 shadow-lg">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
                    {/* Brand + Back */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate("/dashboard")}
                            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                            title="Back to Dashboard"
                        >
                            <ArrowLeft size={18} />
                        </button>

                        <div className="hidden sm:flex items-center gap-2">
                            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-md">
                                <BrainCircuit size={16} className="text-white" />
                            </div>
                            <span className="font-black text-white text-sm">
                                Prep<span className="text-cyan-400">ME</span>
                            </span>
                        </div>

                        <div className="h-5 w-px bg-slate-800 hidden sm:block" />

                        <div className="hidden sm:block">
                            <p className="text-xs font-extrabold text-white">AI Interview Session</p>
                            <p className="text-[11px] text-slate-400">Active evaluation</p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-2 sm:gap-3">
                        {/* Voice Toggle */}
                        <button
                            onClick={toggleVoice}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition border cursor-pointer ${
                                isEnabled
                                    ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30 shadow-sm"
                                    : "bg-slate-900 text-slate-500 border-slate-800"
                            }`}
                        >
                            {isEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
                            <span className="hidden sm:inline">{isEnabled ? "Voice ON" : "Voice OFF"}</span>
                        </button>

                        {/* Timer */}
                        <Timer />
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-5xl mx-auto px-4 sm:px-6 py-6 sm:py-10 space-y-6">
                {/* Progress Card */}
                <div className="bg-slate-900/60 rounded-3xl shadow-xl border border-slate-800/80 p-5 sm:p-6 backdrop-blur-md">
                    <ProgressBar current={currentQuestion + 1} total={questions.length} />
                </div>

                {/* Question + Answer Panel */}
                <div className="bg-slate-900/60 rounded-3xl shadow-2xl border border-slate-800/80 overflow-hidden backdrop-blur-md">
                    {/* Gradient top accent */}
                    <div className="h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600" />

                    <div className="p-6 sm:p-8 space-y-7">
                        {/* Question */}
                        <QuestionCard
                            question={questions[currentQuestion]}
                            questionNumber={currentQuestion + 1}
                            totalQuestions={questions.length}
                        />

                        {/* Divider */}
                        <div className="border-t border-slate-800/80" />

                        {/* Answer */}
                        <AnswerBox answer={answer} setAnswer={setAnswer} />

                        {/* Footer Actions */}
                        <div className="flex items-center justify-between pt-2">
                            <p className="text-[11px] text-slate-500 hidden sm:block">
                                Click <strong className="text-cyan-400">Next Question</strong> when ready to evaluate
                            </p>

                            <button
                                onClick={handleNext}
                                disabled={submitting}
                                className={`ml-auto flex items-center gap-2 px-6 sm:px-8 py-3.5 rounded-2xl text-xs sm:text-sm font-black text-white shadow-xl transition duration-200 active:scale-95 cursor-pointer ${
                                    submitting
                                        ? "bg-slate-800 cursor-not-allowed text-slate-500 shadow-none"
                                        : isLast
                                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/20"
                                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/20"
                                }`}
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 size={16} className="animate-spin text-cyan-300" />
                                        {isLast ? "Generating Evaluation Report..." : "Submitting Response..."}
                                    </>
                                ) : isLast ? (
                                    <>
                                        <Flag size={16} />
                                        <span>Finish & View Report</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Next Question</span>
                                        <ChevronRight size={16} />
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Info Strip */}
                <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 pb-4">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        Answers saved automatically
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                        <ShieldCheck size={14} className="text-cyan-400" />
                        AI Score Evaluation
                    </span>
                </div>
            </main>
        </div>
    );
}

export default InterviewSession;