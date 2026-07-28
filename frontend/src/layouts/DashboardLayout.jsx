import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";

function DashboardLayout() {
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchFilter, setSearchFilter] = useState("all");

    const handleSearch = (query, filter) => {
        setSearchQuery(query);
        setSearchFilter(filter || "all");
    };

    return (
        <div className="flex min-h-screen bg-[#070A11] text-slate-200 font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
            {/* Ambient background glows */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
                <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/5 rounded-full blur-[100px]" />
                <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-cyan-600/4 rounded-full blur-[90px]" />
            </div>

            <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

            <div className="flex-1 min-w-0 flex flex-col min-h-screen relative z-10">
                <Navbar
                    onToggleMobileSidebar={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                    onSearch={handleSearch}
                />
                <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 animate-slide-up">
                    <Outlet context={{ searchQuery, searchFilter }} />
                </main>
            </div>
        </div>
    );
}

export default DashboardLayout;
