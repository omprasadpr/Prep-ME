import { useEffect, useState } from "react";
import { Clock, AlertTriangle } from "lucide-react";

function Timer({ totalTime = 30 * 60 }) {
    const [timeLeft, setTimeLeft] = useState(totalTime);

    useEffect(() => {
        const interval = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const isWarning = timeLeft <= 5 * 60;
    const isCritical = timeLeft <= 60;

    return (
        <div
            className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl font-bold text-sm transition-all duration-300 border ${
                isCritical
                    ? "bg-rose-50 text-rose-600 border-rose-200 animate-pulse shadow-rose-100 shadow-md"
                    : isWarning
                    ? "bg-amber-50 text-amber-600 border-amber-200"
                    : "bg-slate-50 text-slate-700 border-slate-200"
            }`}
        >
            {isCritical ? (
                <AlertTriangle size={16} className="shrink-0 text-rose-500" />
            ) : (
                <Clock
                    size={16}
                    className={`shrink-0 ${isWarning ? "text-amber-500" : "text-slate-400"}`}
                />
            )}
            <span className="tabular-nums font-extrabold tracking-wider">
                {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
            </span>
        </div>
    );
}

export default Timer;