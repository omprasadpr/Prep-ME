import { useEffect } from "react";
import { Volume2, VolumeX, MessageSquare, Lightbulb, Volume1 } from "lucide-react";
import useSpeechSynthesis from "../../hooks/useSpeechSynthesis";

function QuestionCard({ question, questionNumber, totalQuestions }) {
    const { speak, stop, isEnabled, isSpeaking } = useSpeechSynthesis();

    // Trigger voice output ONLY when question text or question ID changes
    useEffect(() => {
        if (question?.question && isEnabled) {
            speak(question.question);
        }
        return () => {
            stop();
        };
    }, [question?.id, question?.question, isEnabled, speak, stop]);

    if (!question) return null;

    const handleReadAloud = () => {
        if (isEnabled && question?.question) {
            if (isSpeaking) {
                stop();
            } else {
                speak(question.question);
            }
        }
    };

    return (
        <div className="relative space-y-4">
            {/* Question Number Badge */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white font-black text-sm shadow-md">
                        {questionNumber}
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                            Question {questionNumber} of {totalQuestions}
                        </p>
                        <h3 className="text-sm font-black text-white">Technical Evaluation</h3>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={handleReadAloud}
                        disabled={!isEnabled}
                        title={isEnabled ? (isSpeaking ? "Click to stop reading" : "Read question aloud") : "Enable voice in header"}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition-all border cursor-pointer ${
                            !isEnabled
                                ? "bg-white/[0.04] text-slate-500 border-white/[0.06] cursor-not-allowed opacity-60"
                                : isSpeaking
                                ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-lg shadow-cyan-500/10 animate-pulse"
                                : "bg-cyan-500/10 text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/20"
                        }`}
                    >
                        {isEnabled ? (
                            isSpeaking ? <Volume1 size={15} className="animate-bounce" /> : <Volume2 size={15} />
                        ) : (
                            <VolumeX size={15} />
                        )}
                        <span>
                            {!isEnabled ? "Voice Off" : isSpeaking ? "Speaking..." : "Read Aloud"}
                        </span>
                    </button>
                </div>
            </div>

            {/* Question Text Box */}
            <div className="bg-slate-950/90 border border-white/[0.08] rounded-2xl p-6 relative overflow-hidden shadow-xl">
                <div className="absolute top-3 right-4 opacity-5 text-slate-400">
                    <MessageSquare size={72} />
                </div>
                <p className="text-base sm:text-lg leading-relaxed text-white font-bold relative z-10">
                    {question.question}
                </p>
            </div>

            {/* Hint */}
            <div className="flex items-start gap-2 px-1">
                <Lightbulb size={14} className="text-amber-400 mt-0.5 shrink-0" />
                <p className="text-xs text-slate-400 font-medium leading-relaxed">
                    <span className="font-extrabold text-amber-400">STAR Tip:</span> Detail the Situation, Task, Action you took, and final Result for maximum score.
                </p>
            </div>
        </div>
    );
}

export default QuestionCard;