import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BrainCircuit, ArrowRight, Eye, EyeOff, MailWarning, RefreshCw } from "lucide-react";
import { GoogleLogin } from "@react-oauth/google";
import { loginUser, googleLoginUser, resendVerificationEmail } from "../services/authApi";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPass, setShowPass] = useState(false);
    const [error, setError] = useState(null);
    const [unverifiedEmail, setUnverifiedEmail] = useState(null);
    const [resending, setResending] = useState(false);
    const [resendMessage, setResendMessage] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");
        const authError = params.get("error");
        if (token) {
            localStorage.setItem("token", token);
            navigate("/dashboard");
        } else if (authError) {
            setError("Google authentication failed. Please try again.");
        }
    }, [navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setUnverifiedEmail(null);
        setResendMessage(null);
        try {
            setLoading(true);
            const data = await loginUser({ email, password });
            localStorage.setItem("token", data.access_token);
            navigate("/dashboard");
        } catch (err) {
            const detail = err.response?.data?.detail;
            if (err.response?.status === 403 || (typeof detail === "string" && detail.toLowerCase().includes("verify"))) {
                setUnverifiedEmail(email);
            } else {
                setError(detail || err.message || "Something went wrong.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSuccess = async (credentialResponse) => {
        setError(null);
        setUnverifiedEmail(null);
        try {
            setLoading(true);
            const data = await googleLoginUser({ id_token: credentialResponse.credential });
            localStorage.setItem("token", data.access_token);
            navigate("/dashboard");
        } catch (err) {
            setError(err.response?.data?.detail || "Google Sign-In failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleError = () => {
        setError("Google Sign-In was cancelled or failed.");
    };

    const handleResend = async () => {
        if (!unverifiedEmail || resending) return;
        setResendMessage(null);
        setResending(true);
        try {
            const res = await resendVerificationEmail(unverifiedEmail);
            setResendMessage(res.message || "A new verification link has been sent.");
        } catch (err) {
            setResendMessage(err.response?.data?.detail || "Failed to resend verification link.");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#070A11] px-4 relative overflow-hidden font-sans selection:bg-cyan-500/20 selection:text-cyan-200">
            {/* Animated background glows */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/8 rounded-full blur-[120px] animate-float" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/8 rounded-full blur-[100px]" style={{ animationDelay: '1.5s' }} />
            <div className="absolute top-1/2 left-0 w-[300px] h-[300px] bg-cyan-600/6 rounded-full blur-[80px] animate-float" style={{ animationDelay: '0.8s' }} />

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10 animate-slide-up">
                {/* Card */}
                <div className="relative bg-[#0D1117]/90 backdrop-blur-2xl rounded-3xl border border-white/[0.08] shadow-2xl overflow-hidden p-8 sm:p-10">
                    {/* Top accent */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-cyan-400/80 blur-sm" />

                    {/* Brand */}
                    <div className="text-center mb-8">
                        <div className="relative inline-flex mb-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 p-px shadow-xl shadow-blue-500/30">
                                <div className="w-full h-full rounded-[15px] bg-[#0D1117] flex items-center justify-center">
                                    <BrainCircuit size={30} className="text-cyan-400" />
                                </div>
                            </div>
                            <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-[#0D1117] animate-pulse" />
                        </div>

                        <div className="flex items-center justify-center gap-1 text-3xl font-black">
                            <span className="text-white">Prep</span>
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">ME</span>
                        </div>
                        <p className="text-slate-500 text-xs mt-1.5 font-medium">AI Interview &amp; Resume Copilot</p>
                    </div>

                    {/* Unverified email banner */}
                    {unverifiedEmail && (
                        <div className="mb-6 flex items-start gap-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-4">
                            <MailWarning size={20} className="text-amber-400 mt-0.5 shrink-0" />
                            <div>
                                <p className="text-amber-300 text-xs font-bold mb-1">Please verify your email before logging in.</p>
                                <p className="text-amber-400/80 text-xs leading-relaxed mb-3">
                                    We sent a verification link to <span className="font-semibold text-white">{unverifiedEmail}</span>.
                                </p>

                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={resending}
                                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 rounded-lg text-xs font-bold transition cursor-pointer disabled:opacity-50"
                                >
                                    <RefreshCw size={12} className={resending ? "animate-spin" : ""} />
                                    <span>{resending ? "Resending Link..." : "Resend Verification Link"}</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {resendMessage && (
                        <div className="mb-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3 text-xs text-cyan-300">
                            {resendMessage}
                        </div>
                    )}

                    {/* Generic error */}
                    {error && (
                        <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3">
                            <p className="text-red-400 text-xs font-semibold">{error}</p>
                        </div>
                    )}

                    {/* ── Google Sign-In ── */}
                    <div className="mb-6 flex justify-center w-full">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            useOneTap={false}
                            theme="filled_black"
                            shape="pill"
                            text="continue_with"
                            width="100%"
                        />
                    </div>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/[0.06]" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-[#0D1117] px-3 text-[10px] text-slate-500 font-bold uppercase tracking-wider">OR CONTINUE WITH EMAIL</span>
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.06] focus:bg-white/[0.06] focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/40 rounded-xl p-3.5 text-sm text-white focus:outline-none transition placeholder:text-slate-600 font-medium"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPass ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="w-full border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.06] focus:bg-white/[0.06] focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/40 rounded-xl p-3.5 pr-10 text-sm text-white focus:outline-none transition placeholder:text-slate-600 font-medium"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                                >
                                    {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="relative w-full mt-2 overflow-hidden group"
                        >
                            <div className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:via-indigo-500 hover:to-purple-500 text-white font-black py-3.5 rounded-xl shadow-xl shadow-blue-600/25 transition-all duration-300 active:scale-[0.98] flex items-center justify-center gap-2 text-sm disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer">
                                <span>{loading ? "Signing in..." : "Sign In to Dashboard"}</span>
                                {!loading && <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />}
                            </div>
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/[0.06]" />
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-[#0D1117] px-3 text-[10px] text-slate-600 font-medium">NEW HERE?</span>
                        </div>
                    </div>

                    <p className="text-center text-xs text-slate-500 font-medium">
                        Don't have an account?{" "}
                        <Link to="/register" className="text-cyan-400 font-black hover:text-cyan-300 transition">
                            Create free account &rarr;
                        </Link>
                    </p>
                </div>

                {/* Bottom badge */}
                <p className="text-center text-[10px] text-slate-700 mt-5 font-medium">
                    🔒 Secured with encrypted JWT &amp; Google OAuth 2.0
                </p>
            </div>
        </div>
    );
}

export default Login;