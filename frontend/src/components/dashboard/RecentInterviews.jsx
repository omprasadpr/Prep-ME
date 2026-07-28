import { useNavigate } from "react-router-dom";
import { History, ArrowRight } from "lucide-react";
import InterviewTable from "./InterviewTable";

function RecentInterviews({ interviews }) {
    const navigate = useNavigate();
    const count = interviews ? interviews.length : 0;

    return (
        <section className="mt-10">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        <History size={18} />
                    </div>
                    <h2 className="text-xl font-black text-white flex items-center gap-2 tracking-tight">
                        <span>Recent Interviews</span>
                        {count > 0 && (
                            <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                                {count}
                            </span>
                        )}
                    </h2>
                </div>

                <button
                    onClick={() => navigate("/my-interviews")}
                    className="text-cyan-400 font-bold text-xs hover:text-cyan-300 transition flex items-center gap-1 hover:gap-2 cursor-pointer"
                >
                    <span>View All</span>
                    <ArrowRight size={14} />
                </button>
            </div>

            <InterviewTable interviews={interviews} />
        </section>
    );
}

export default RecentInterviews;