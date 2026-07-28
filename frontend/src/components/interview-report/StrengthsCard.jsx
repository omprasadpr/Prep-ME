import { CheckCircle2 } from "lucide-react";

function StrengthsCard({ strengths }) {
    const strengthsList = Array.isArray(strengths)
        ? strengths
        : strengths
            ?.split("\n")
            .filter(item => item.trim() !== "");

    return (
        <div className="h-full flex flex-col rounded-[2.5rem] border border-emerald-500/10 bg-gradient-to-br from-[#0D1117]/80 to-[#030712] p-10 shadow-2xl transition-all group hover:border-emerald-500/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 transition-opacity group-hover:bg-emerald-500/10"></div>
            
            <div className="flex items-center gap-4 mb-8 relative z-10">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                    <CheckCircle2 size={28} />
                </div>
                <div>
                    <h2 className="text-2xl font-black text-white">
                        Key Strengths
                    </h2>
                    <p className="text-sm font-medium text-slate-400 mt-1">
                        Where you excelled during the interview.
                    </p>
                </div>
            </div>

            <div className="flex-1 space-y-4 relative z-10">
                {strengthsList?.map((strength, index) => (
                    <div key={index} className="flex items-start gap-4 rounded-2xl bg-white/[0.02] border border-white/[0.04] p-5 transition-colors hover:bg-white/[0.04]">
                        <div className="mt-1.5 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.6)] shrink-0" />
                        <p className="text-slate-300 leading-relaxed font-medium text-sm">
                            {strength}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default StrengthsCard;