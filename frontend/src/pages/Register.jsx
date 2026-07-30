import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit, ArrowRight, Eye, EyeOff, UserCheck } from "lucide-react";
import { registerUser, guestLoginUser } from "../services/authApi";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setError(null);
        try {
            setLoading(true);
            await registerUser({ full_name: name, email, password });
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.detail || err.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleGuestLogin = async () => {
        setError(null);
        try {
            setLoading(true);
            const data = await guestLoginUser();
            localStorage.setItem("token", data.access_token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.detail || "Guest login failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#070A11] px-4 relative overflow-hidden font-sans selection:bg-emerald-500/20 selection:text-emerald-200">
            {/* Animated background glows */}
            <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-emerald-600/6 rounded-full blur-[120px] animate-float" />
            <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-cyan-600/6 rounded-full blur-[100px]" />
            <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-blue-600/5 rounded-full blur-[80px] animate-float" style={{ animationDelay: "1s" }} />

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10 animate-slide-up">
                <div className="relative bg-[#0D1117]/90 backdrop-blur-2xl rounded-3xl border border-white/[0.08] shadow-2xl overflow-hidden p-8 sm:p-10">
                    {/* Top accent */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-emerald-400/80 blur-sm" />

                    {/* Brand */}
                    <div className="text-center mb-8">
                        <div className="relative inline-flex mb-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 via-cyan-500 to-blue-600 p-px shadow-xl shadow-emerald-500/25">
                                <div className="w-full h-full rounded-[15px] bg-[#0D1117] flex items-center justify-center">
                                    <BrainCircuit size={30} className="text-emerald-400" />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-1 text-3xl font-black">
                            <span className="text-white">Prep</span>
                            <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">ME</span>
                        </div>
                        <p className="text-slate-500 text-xs mt-1.5 font-medium">Create Your Free Account</p>
                    </div>

                    {/* ── Registration Form ── */}
                    <>
                        {/* ── Guest Sign-In ── */}
                        <button
                            type="button"
                            onClick={handleGuestLogin}
                            disabled={loading}
                            className="w-full mb-4 py-3 rounded-full bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500/20 text-emerald-400 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-500/10 active:scale-[0.98]"
                        >
                            <UserCheck size={16} className="text-emerald-400" />
                            <span>Continue as Guest</span>
                        </button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/[0.06]" />
                            </div>
                            <div className="relative flex justify-center">
                                <span className="bg-[#0D1117] px-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">OR REGISTER WITH EMAIL</span>
                            </div>
                        </div>

                            {error && (
                                <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                                    <p className="text-red-400 text-xs font-semibold">{error}</p>
                                </div>
                            )}

                            <form onSubmit={handleRegister} className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="John Doe"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        required
                                        className="w-full border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.06] focus:bg-white/[0.06] focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 rounded-xl p-3.5 text-sm text-white focus:outline-none transition placeholder:text-slate-600 font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Email Address</label>
                                    <input
                                        type="email"
                                        placeholder="name@example.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        className="w-full border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.06] focus:bg-white/[0.06] focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 rounded-xl p-3.5 text-sm text-white focus:outline-none transition placeholder:text-slate-600 font-medium"
                                    />
                                </div>

                                <div>
                                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Password</label>
                                    <div className="relative">
                                        <input
                                            type={showPass ? "text" : "password"}
                                            placeholder="Create a strong password"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="w-full border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.06] focus:bg-white/[0.06] focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/40 rounded-xl p-3.5 pr-10 text-sm text-white focus:outline-none transition placeholder:text-slate-600 font-medium"
                                        />
                                        <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition">
                                            {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-2 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:via-teal-500 hover:to-cyan-500 text-white font-black py-3.5 rounded-xl shadow-xl shadow-emerald-600/20 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer group"
                                >
                                    <span>{loading ? "Creating Account..." : "Create Free Account"}</span>
                                    {!loading && <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />}
                                </button>
                            </form>

                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/[0.06]" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="bg-[#0D1117] px-3 text-[10px] text-slate-600 font-medium">ALREADY A MEMBER?</span>
                                </div>
                            </div>

                            <p className="text-center text-xs text-slate-500 font-medium">
                                Already have an account?{" "}
                                <Link to="/" className="text-emerald-400 font-black hover:text-emerald-300 transition">
                                    Sign in &rarr;
                                </Link>
                            </p>
                        </>
                    )}
                </div>
                <p className="text-center text-[10px] text-slate-700 mt-5 font-medium">🔒 Secure JWT Email Verification</p>
            </div>
        </div>
    );
}

export default Register;