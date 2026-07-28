import { LoaderCircle } from "lucide-react";

function LoadingReport() {
    return (
        <div className="flex h-[80vh] items-center justify-center animate-pulse">
            <div className="rounded-3xl border border-white/[0.08] bg-[#0D1117]/80 p-12 shadow-2xl backdrop-blur-xl text-center flex flex-col items-center">
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-blue-500/20 blur-xl"></div>
                    <LoaderCircle size={64} className="text-blue-500 animate-spin relative z-10" />
                </div>
                
                <h2 className="mt-8 text-2xl font-black text-white">
                    Generating Report
                </h2>
                <p className="mt-2 text-sm font-semibold text-slate-400">
                    AI is analyzing your interview performance...
                </p>
            </div>
        </div>
    );
}

export default LoadingReport;