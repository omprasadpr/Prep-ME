import { useState, useRef } from "react";
import { uploadResume } from "../../services/resumeApi";
import { UploadCloud, Loader2, FileCheck2 } from "lucide-react";

function ResumeUpload({ onUploadSuccess }) {
    const [loading, setLoading] = useState(false);
    const [dragging, setDragging] = useState(false);
    const [fileName, setFileName] = useState(null);
    const inputRef = useRef(null);

    const handleFile = async (file) => {
        if (!file) return;
        setFileName(file.name);
        const formData = new FormData();
        formData.append("file", file);

        try {
            setLoading(true);
            const data = await uploadResume(formData);
            if (onUploadSuccess) onUploadSuccess(data);
        } catch (error) {
            alert(error.response?.data?.detail || "Resume upload failed.");
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e) => handleFile(e.target.files[0]);

    const handleDrop = (e) => {
        e.preventDefault();
        setDragging(false);
        handleFile(e.dataTransfer.files[0]);
    };

    return (
        <div className="rounded-2xl border border-white/[0.08] bg-[#0D1117]/80 backdrop-blur-xl p-6 shadow-lg">
            <div className="mb-4">
                <h2 className="text-lg font-black text-white">Upload Resume File</h2>
                <p className="text-xs text-slate-400 font-medium">Supported formats: PDF, DOC, DOCX</p>
            </div>
            <div
                onClick={() => !loading && inputRef.current?.click()}
                onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-8 text-center transition cursor-pointer ${
                    loading
                        ? "border-cyan-500/50 bg-cyan-500/10"
                        : dragging
                        ? "border-cyan-400 bg-cyan-500/10"
                        : "border-white/[0.08] bg-white/[0.02] hover:border-cyan-500/40 hover:bg-cyan-500/5"
                }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                />
                {loading ? (
                    <>
                        <Loader2 size={36} className="text-cyan-400 animate-spin" />
                        <p className="text-sm font-black text-cyan-300">Parsing & Evaluating Resume...</p>
                        <p className="text-xs text-slate-400 font-medium">Extracting technical skills & matching ATS scores</p>
                    </>
                ) : (
                    <>
                        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 shadow-md">
                            {fileName ? <FileCheck2 size={26} /> : <UploadCloud size={26} />}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-white">{fileName || "Drop your resume file here"}</p>
                            <p className="text-xs text-slate-400 mt-1 font-medium">Click to browse from your computer</p>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default ResumeUpload;
