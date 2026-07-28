import { FileSearch } from "lucide-react";
import { useNavigate } from "react-router-dom";

function EmptyReport() {
    const navigate = useNavigate();

    return (
        <div className="flex h-[80vh] items-center justify-center">
            <div className="rounded-3xl border border-white/[0.08] bg-[#0D1117]/80 p-12 shadow-2xl backdrop-blur-xl text-center max-w-lg mx-auto flex flex-col items-center">
                <div className="grid h-20 w-20 place-items-center rounded-3xl bg-slate-800 border border-slate-700 shadow-inner mb-6">
                    <FileSearch size={40} className="text-slate-400" />
                </div>
                
                <h2 className="text-2xl font-black text-white">
                    Report Not Found
                </h2>
                
                <p className="mt-3 mb-8 text-sm font-medium text-slate-400">
                    This interview doesn't have a generated report yet.
                </p>

                <button
                    onClick={() => navigate("/dashboard")}
                    className="inline-flex items-center justify-center rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3.5 text-xs font-black text-white shadow-xl hover:from-blue-500 hover:to-indigo-500 transition cursor-pointer"
                >
                    Back to Dashboard
                </button>
            </div>
        </div>
    );
}

export default EmptyReport;