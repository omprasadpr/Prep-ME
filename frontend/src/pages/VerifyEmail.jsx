import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { BrainCircuit, ShieldCheck, XCircle, RefreshCw, LogIn } from "lucide-react";
import { verifyEmailToken, resendVerificationEmail } from "../services/authApi";

function VerifyEmail() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");

    const [loading, setLoading] = useState(true);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(null);

    const [resendEmail, setResendEmail] = useState("");
    const [resending, setResending] = useState(false);
    const [resendMessage, setResendMessage] = useState(null);

    useEffect(() => {
        if (!token) {
            setLoading(false);
            setError("No verification token found in URL.");
            return;
        }

        const verify = async () => {
            try {
                setLoading(true);
                await verifyEmailToken(token);
                setSuccess(true);
            } catch (err) {
                setError(err.response?.data?.detail || "Verification failed. Token may be invalid or expired.");
            } finally {
                setLoading(false);
            }
        };

        verify();
    }, [token]);

    const handleResend = async (e) => {
        e.preventDefault();
        if (!resendEmail || resending) return;
        setResendMessage(null);
        setResending(true);
        try {
            const res = await resendVerificationEmail(resendEmail);
            setResendMessage(res.message || "A new verification link has been sent.");
        } catch (err) {
            setResendMessage(err.response?.data?.detail || "Failed to resend verification email.");
        } finally {
            setResending(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#070A11] px-4 relative overflow-hidden font-sans">
            {/* Background glows */}
            <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-cyan-600/6 rounded-full blur-[130px] animate-float" />
            <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-blue-600/6 rounded-full blur-[110px]" />
            <div className="absolute top-1/2 right-0 w-[300px] h-[300px] bg-purple-600/5 rounded-full blur-[90px] animate-float" style={{ animationDelay: "1.2s" }} />

            {/* Grid overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />

            <div className="w-full max-w-md relative z-10 animate-slide-up">
                <div className="relative bg-[#0D1117]/90 backdrop-blur-2xl rounded-3xl border border-white/[0.08] shadow-2xl overflow-hidden p-8 sm:p-10">
                    {/* Top accent */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/60 to-transparent" />
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-px bg-cyan-400/80 blur-sm" />

                    {/* Brand Header */}
                    <div className="text-center mb-8">
                        <div className="relative inline-flex mb-5">
                            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 via-blue-600 to-purple-600 p-px shadow-xl shadow-blue-500/30">
                                <div className="w-full h-full rounded-[15px] bg-[#0D1117] flex items-center justify-center">
                                    <BrainCircuit size={30} className="text-cyan-400" />
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center justify-center gap-1 text-3xl font-black mb-1">
                            <span className="text-white">Prep</span>
                            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">ME</span>
                        </div>
                        <p className="text-slate-500 text-xs font-medium">AI Interview &amp; Resume Copilot</p>
                    </div>

                    {/* ── Loading State ── */}
                    {loading && (
                        <div className="text-center py-8">
                            <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-400 rounded-full animate-spin mx-auto mb-4" />
                            <h3 className="text-lg font-bold text-white mb-1">Verifying Your Email…</h3>
                            <p className="text-slate-400 text-xs">Please wait while we validate your token.</p>
                        </div>
                    )}

                    {/* ── Success State ── */}
                    {!loading && success && (
                        <div className="text-center py-4">
                            <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto mb-5 text-emerald-400 animate-pulse">
                                <ShieldCheck size={40} />
                            </div>
                            <h2 className="text-2xl font-black text-white mb-2">Email Verified!</h2>
                            <p className="text-slate-400 text-sm leading-relaxed mb-6">
                                Your account is now fully activated. You can now sign in to your dashboard.
                            </p>

                            <Link
                                to="/"
                                className="w-full py-3.5 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 hover:from-cyan-500 hover:via-blue-500 hover:to-purple-500 text-white font-black rounded-xl shadow-xl shadow-blue-600/25 transition-all flex items-center justify-center gap-2 text-sm"
                            >
                                <LogIn size={16} />
                                <span>Go to Login</span>
                            </Link>
                        </div>
                    )}

                    {/* ── Error / Expired State ── */}
                    {!loading && !success && (
                        <div className="text-center py-4">
                            <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center mx-auto mb-4 text-red-400">
                                <XCircle size={36} />
                            </div>
                            <h2 className="text-xl font-bold text-white mb-2">Verification Failed</h2>
                            <p className="text-slate-400 text-xs leading-relaxed mb-6">
                                {error}
                            </p>

                            <form onSubmit={handleResend} className="space-y-3 mb-4">
                                <input
                                    type="email"
                                    placeholder="Enter your email to resend"
                                    value={resendEmail}
                                    onChange={(e) => setResendEmail(e.target.value)}
                                    required
                                    className="w-full border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.06] focus:bg-white/[0.06] focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/40 rounded-xl p-3 text-xs text-white focus:outline-none transition placeholder:text-slate-600"
                                />

                                <button
                                    type="submit"
                                    disabled={resending}
                                    className="w-full py-3 bg-white/[0.06] hover:bg-white/[0.1] border border-white/[0.1] text-cyan-400 font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition cursor-pointer disabled:opacity-50"
                                >
                                    <RefreshCw size={14} className={resending ? "animate-spin" : ""} />
                                    <span>{resending ? "Sending Link..." : "Resend Verification Link"}</span>
                                </button>
                            </form>

                            {resendMessage && (
                                <div className="mb-4 bg-cyan-500/10 border border-cyan-500/30 rounded-xl p-3 text-xs text-cyan-300">
                                    {resendMessage}
                                </div>
                            )}

                            <Link
                                to="/"
                                className="inline-block text-xs text-slate-500 hover:text-slate-400 underline transition"
                            >
                                Back to Login
                            </Link>
                        </div>
                    )}
                </div>

                <p className="text-center text-[10px] text-slate-700 mt-5 font-medium">🔒 Secure JWT Verification</p>
            </div>
        </div>
    );
}

export default VerifyEmail;
