import { Bot } from "lucide-react";

function FeedbackCard({ feedback }) {
    return (
        <div className="h-full flex flex-col rounded-[2.5rem] border border-white/[0.05] bg-gradient-to-br from-slate-900 to-black p-10 shadow-2xl transition-all group hover:border-white/[0.1]">
            <div className="flex items-center gap-4 mb-6">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <Bot size={32} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white tracking-tight">
                        AI Insights
                    </h2>
                    <p className="text-sm font-medium text-slate-400 mt-1">
                        Detailed feedback to help you improve faster.
                    </p>
                </div>
            </div>

            <div className="flex-1 rounded-[1.5rem] border border-white/[0.03] bg-white/[0.02] p-8 shadow-inner overflow-y-auto custom-scrollbar">
                <p className="text-slate-300 leading-relaxed font-medium whitespace-pre-line text-[15px]">
                    {feedback || "No feedback available."}
                </p>
            </div>
        </div>
    );
}

export default FeedbackCard;