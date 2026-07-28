import InterviewRow from "./InterviewRow";
import { SearchX } from "lucide-react";

function InterviewTable({ interviews }) {
    if (!interviews || interviews.length === 0) {
        return (
            <div className="bg-[#0D1117]/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-lg p-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center mx-auto mb-4 text-slate-500">
                    <SearchX size={28} />
                </div>
                <h3 className="text-base font-black text-white">
                    No interviews found
                </h3>
                <p className="text-slate-400 text-xs mt-1 max-w-sm mx-auto font-medium">
                    Start a new AI interview session to build your portfolio.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-[#0D1117]/80 backdrop-blur-xl rounded-2xl border border-white/[0.08] shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-white/[0.06]">
                    <thead className="bg-white/[0.02]">
                        <tr>
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                                Role & Title
                            </th>
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                                Experience
                            </th>
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                                Difficulty
                            </th>
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                                Status
                            </th>
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                                Score
                            </th>
                            <th className="px-6 py-4 text-left text-[10px] font-black uppercase tracking-wider text-slate-400">
                                Date
                            </th>
                            <th className="px-6 py-4 text-right text-[10px] font-black uppercase tracking-wider text-slate-400">
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06]">
                        {interviews.map((interview) => (
                            <InterviewRow
                                key={interview.id}
                                interview={interview}
                            />
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default InterviewTable;