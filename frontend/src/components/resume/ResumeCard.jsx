import { FileText, Calendar, CheckCircle2 } from "lucide-react";

function ResumeCard({ resume }) {
    if (!resume) return null;

    const formattedSize = resume.size ? `${(resume.size / 1024).toFixed(1)} KB` : null;

    return (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0D1117]/80 backdrop-blur-xl p-6 shadow-lg">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-3.5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-md">
                        <FileText size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Uploaded Resume</p>
                        <h3 className="text-base font-black text-white mt-0.5">{resume.filename}</h3>
                    </div>
                </div>
                <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-black text-emerald-400">
                    <CheckCircle2 size={14} />
                    <span>Analyzed</span>
                </div>
            </div>
            <div className="mt-4 flex items-center gap-3 text-xs text-slate-400 border-t border-white/[0.06] pt-3 font-medium">
                <div className="inline-flex items-center gap-1.5">
                    <Calendar size={14} className="text-slate-500" />
                    <span>Uploaded & Parsed</span>
                </div>
                {formattedSize && <span>• {formattedSize}</span>}
            </div>
        </div>
    );
}

export default ResumeCard;
