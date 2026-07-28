import {
    Plus,
    Upload,
    ClipboardList,
    Zap,
    Sparkles
} from "lucide-react";

import QuickActionCard from "./QuickActionCard";

function QuickActions() {
    return (
        <section className="mt-8">
            <div className="flex items-center gap-2 mb-5">
                <Zap className="text-amber-400" size={20} />
                <h2 className="text-xl font-black text-white tracking-tight">
                    Quick Actions
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                <QuickActionCard
                    title="New AI Interview"
                    description="Start a customized role & difficulty interview session"
                    icon={<Plus className="text-white" size={22} />}
                    color="bg-gradient-to-br from-blue-600 to-indigo-600 shadow-blue-500/20"
                    route="/interview"
                    badge="AI Powered"
                />

                <QuickActionCard
                    title="Analyze Resume"
                    description="Upload resume to get ATS score & keyword recommendations"
                    icon={<Upload className="text-white" size={22} />}
                    color="bg-gradient-to-br from-emerald-500 to-teal-600 shadow-emerald-500/20"
                    route="/resume"
                    badge="Instant ATS"
                />

                <QuickActionCard
                    title="My Interviews"
                    description="Review past interview sessions & score breakdown"
                    icon={<ClipboardList className="text-white" size={22} />}
                    color="bg-gradient-to-br from-purple-500 to-indigo-600 shadow-purple-500/20"
                    route="/my-interviews"
                    badge="History"
                />

                <QuickActionCard
                    title="Practice Suggestions"
                    description="Personalized AI practice tips & career insights to boost your scores."
                    icon={<Sparkles className="text-amber-300" size={22} />}
                    color="bg-gradient-to-br from-amber-500 to-orange-600 shadow-amber-500/20"
                    badge="Coming Soon"
                    isComingSoon={true}
                />
            </div>
        </section>
    );
}

export default QuickActions;