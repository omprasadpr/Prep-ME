import { Trophy, CircleAlert, CircleCheck, CircleX } from "lucide-react";

function RecommendationCard({ recommendation }) {
    const getStyles = () => {
        const text = recommendation?.toLowerCase();

        if (text?.includes("strong")) {
            return {
                bg: "bg-emerald-500/10 border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.15)]",
                text: "text-emerald-400",
                icon: <Trophy className="text-emerald-400" size={40} />,
                title: "Outstanding Performance",
                innerBg: "bg-emerald-500/5",
            };
        }

        if (text?.includes("hire") || text?.includes("recommend")) {
            return {
                bg: "bg-cyan-500/10 border-cyan-500/20 shadow-[0_0_30px_rgba(6,182,212,0.15)]",
                text: "text-cyan-400",
                icon: <CircleCheck className="text-cyan-400" size={40} />,
                title: "Recommended for Hiring",
                innerBg: "bg-cyan-500/5",
            };
        }

        if (text?.includes("borderline") || text?.includes("improvement")) {
            return {
                bg: "bg-amber-500/10 border-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.15)]",
                text: "text-amber-400",
                icon: <CircleAlert className="text-amber-400" size={40} />,
                title: "Needs Some Improvement",
                innerBg: "bg-amber-500/5",
            };
        }

        return {
            bg: "bg-rose-500/10 border-rose-500/20 shadow-[0_0_30px_rgba(243,24,113,0.15)]",
            text: "text-rose-400",
            icon: <CircleX className="text-rose-400" size={40} />,
            title: "Additional Preparation Needed",
            innerBg: "bg-rose-500/5",
        };
    };

    const styles = getStyles();

    return (
        <div className={`h-full flex flex-col rounded-[2.5rem] border p-10 transition-all ${styles.bg}`}>
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-6">
                <div className={`grid h-24 w-24 place-items-center rounded-[2rem] border border-white/[0.08] shadow-inner ${styles.innerBg}`}>
                    {styles.icon}
                </div>
                <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">
                        Final Verdict
                    </p>
                    <h2 className={`text-3xl font-black leading-tight ${styles.text}`}>
                        {recommendation || "Pending Review"}
                    </h2>
                </div>
            </div>
        </div>
    );
}

export default RecommendationCard;