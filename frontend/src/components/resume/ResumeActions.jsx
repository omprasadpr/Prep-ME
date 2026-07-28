import { Trash2, RefreshCw, Eye } from "lucide-react";

function ResumeActions({ resume, onReplace, onDelete, onView }) {
    if (!resume) return null;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="mb-4">
                <p className="text-[10px] uppercase tracking-[0.35em] text-slate-500">Resume actions</p>
                <h2 className="text-lg font-semibold text-slate-900">Manage your resume</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
                <button
                    onClick={onReplace}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-3 py-2 text-sm font-semibold text-white"
                >
                    <RefreshCw size={16} /> Replace
                </button>
                <button
                    onClick={onView}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-3 py-2 text-sm font-semibold text-white"
                >
                    <Eye size={16} /> View
                </button>
                <button
                    onClick={onDelete}
                    className="flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-3 py-2 text-sm font-semibold text-white"
                >
                    <Trash2 size={16} /> Delete
                </button>
            </div>
        </div>
    );
}

export default ResumeActions;
