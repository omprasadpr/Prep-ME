import { Lightbulb } from "lucide-react";

function SuggestionCard({ analysis }) {
    if (!analysis) return null;

    const suggestions = analysis.suggestions || [];

    return (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0D1117]/80 backdrop-blur-xl p-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 shadow-md">
                    <Lightbulb size={18} />
                </div>
                <div>
                    <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Actionable Advice</p>
                    <h2 className="text-lg font-black text-white">AI Suggestions</h2>
                </div>
            </div>
            {suggestions.length === 0 ? (
                <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3 text-xs text-slate-400 font-medium">No suggestions available.</div>
            ) : (
                <ul className="space-y-2.5">
                    {suggestions.map((item, index) => (
                        <li key={index} className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3.5 text-xs font-semibold text-amber-300 leading-relaxed">
                            💡 {item}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default SuggestionCard;
