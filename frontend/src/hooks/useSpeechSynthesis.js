import { useEffect, useRef, useState, useCallback } from "react";

function useSpeechSynthesis() {
    const [isEnabled, setIsEnabled] = useState(() => {
        return localStorage.getItem("voiceEnabled") !== "false";
    });
    const [isSpeaking, setIsSpeaking] = useState(false);

    const voicesRef = useRef([]);

    useEffect(() => {
        const loadVoices = () => {
            if (typeof window !== "undefined" && window.speechSynthesis) {
                voicesRef.current = window.speechSynthesis.getVoices();
            }
        };

        loadVoices();

        if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.onvoiceschanged = loadVoices;
        }

        return () => {
            if (typeof window !== "undefined" && window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const speak = useCallback(
        (text) => {
            if (!isEnabled || !text || typeof window === "undefined" || !window.speechSynthesis) return;

            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = "en-US";
            utterance.rate = 0.95; // Slightly slower, natural pacing
            utterance.pitch = 1.0;

            // Ensure voices list is loaded
            if (!voicesRef.current || voicesRef.current.length === 0) {
                voicesRef.current = window.speechSynthesis.getVoices();
            }

            const voice =
                voicesRef.current.find((v) => v.name.includes("Aria") || v.name.includes("Natural")) ||
                voicesRef.current.find((v) => v.name.includes("Google") && v.lang.startsWith("en")) ||
                voicesRef.current.find((v) => v.name.includes("Jenny")) ||
                voicesRef.current.find((v) => v.lang === "en-US") ||
                voicesRef.current.find((v) => v.lang.startsWith("en"));

            if (voice) {
                utterance.voice = voice;
            }

            utterance.onstart = () => {
                setIsSpeaking(true);
            };

            utterance.onend = () => {
                setIsSpeaking(false);
            };

            utterance.onerror = (e) => {
                console.warn("SpeechSynthesis error:", e);
                setIsSpeaking(false);
            };

            try {
                window.speechSynthesis.speak(utterance);
            } catch (err) {
                console.error("SpeechSynthesis speak exception:", err);
                setIsSpeaking(false);
            }
        },
        [isEnabled]
    );

    const stop = useCallback(() => {
        if (typeof window !== "undefined" && window.speechSynthesis) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
        }
    }, []);

    const toggleVoice = useCallback(() => {
        setIsEnabled((prev) => {
            const newValue = !prev;
            localStorage.setItem("voiceEnabled", newValue);
            if (!newValue && typeof window !== "undefined" && window.speechSynthesis) {
                window.speechSynthesis.cancel();
                setIsSpeaking(false);
            }
            return newValue;
        });
    }, []);

    return {
        speak,
        stop,
        isEnabled,
        isSpeaking,
        toggleVoice,
    };
}

export default useSpeechSynthesis;