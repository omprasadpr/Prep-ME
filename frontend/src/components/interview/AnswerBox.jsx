import { useRef, useState } from "react";
import { Mic, Square, PenLine, Trash2 } from "lucide-react";

function AnswerBox({ answer, setAnswer }) {
    const [isRecording, setIsRecording] = useState(false);
    const recognitionRef = useRef(null);

    const startRecording = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Speech Recognition is not supported in this browser.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.continuous = true;
        recognition.interimResults = true;

        recognition.onstart = () => setIsRecording(true);

        recognition.onresult = (event) => {
            let transcript = "";
            for (let i = 0; i < event.results.length; i++) {
                transcript += event.results[i][0].transcript + " ";
            }
            setAnswer(transcript.trim());
        };

        recognition.onerror = (event) => {
            console.log(event.error);
            setIsRecording(false);
        };

        recognition.onend = () => setIsRecording(false);

        recognition.start();
        recognitionRef.current = recognition;
    };

    const stopRecording = () => {
        recognitionRef.current?.stop();
        setIsRecording(false);
    };

    const wordCount = answer.trim() ? answer.trim().split(/\s+/).length : 0;
    const charPercent = Math.min((answer.length / 5000) * 100, 100);

    return (
        <div className="space-y-3">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <PenLine size={16} className="text-cyan-400" />
                    <h3 className="font-extrabold text-xs text-slate-300 uppercase tracking-wide">
                        Your Technical Response
                    </h3>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400 font-medium">
                    <span>{wordCount} words</span>
                    <span className="text-slate-700">|</span>
                    <span>{answer.length} / 5000 chars</span>
                </div>
            </div>

            {/* Textarea */}
            <div className={`relative rounded-2xl border transition-all duration-200 ${
                isRecording
                    ? "border-rose-500/60 bg-rose-500/10 shadow-lg shadow-rose-500/10"
                    : "border-slate-800 bg-slate-950/80 focus-within:border-cyan-500/50 focus-within:ring-2 focus-within:ring-cyan-500/20"
            }`}>
                {isRecording && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-xs font-bold z-10">
                        <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                        Listening...
                    </div>
                )}

                <textarea
                    value={answer}
                    onChange={(e) => setAnswer(e.target.value)}
                    placeholder="Type your answer here or use the microphone to speak your response..."
                    rows={8}
                    maxLength={5000}
                    className="w-full bg-transparent rounded-2xl p-4 resize-none focus:outline-none text-slate-100 text-xs sm:text-sm leading-relaxed placeholder:text-slate-600 font-medium"
                />

                {/* Char progress bar */}
                <div className="px-4 pb-3">
                    <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all duration-300 ${
                                charPercent > 90 ? "bg-rose-500" : charPercent > 70 ? "bg-amber-400" : "bg-cyan-400"
                            }`}
                            style={{ width: `${charPercent}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    {/* Mic toggle */}
                    {!isRecording ? (
                        <button
                            onClick={startRecording}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs font-extrabold transition shadow-md active:scale-95 cursor-pointer"
                        >
                            <Mic size={14} />
                            <span>Voice Answer</span>
                        </button>
                    ) : (
                        <button
                            onClick={stopRecording}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold transition shadow-md active:scale-95 cursor-pointer animate-pulse"
                        >
                            <Square size={13} />
                            <span>Stop Recording</span>
                        </button>
                    )}

                    {/* Clear button */}
                    {answer.length > 0 && (
                        <button
                            onClick={() => setAnswer("")}
                            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 text-xs font-semibold transition border border-slate-800 hover:border-rose-500/30 cursor-pointer"
                        >
                            <Trash2 size={13} />
                            <span>Clear</span>
                        </button>
                    )}
                </div>

                {/* Quality indicator */}
                {answer.length > 0 && (
                    <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-extrabold border ${
                        wordCount >= 80
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                            : wordCount >= 40
                            ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/30"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/30"
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                            wordCount >= 80 ? "bg-emerald-400" : wordCount >= 40 ? "bg-cyan-400" : "bg-amber-400"
                        }`} />
                        {wordCount >= 80 ? "Detailed answer" : wordCount >= 40 ? "Good length" : "Too brief"}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AnswerBox;