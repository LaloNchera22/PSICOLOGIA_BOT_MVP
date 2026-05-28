"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

const PLACEHOLDERS = [
  "¿qué te trae por aquí hoy?",
  "cuéntame, ¿cómo te sientes?",
  "¿hay algo que te pesa últimamente?",
  "¿qué tienes en mente?",
  "¿en qué puedo acompañarte hoy?",
];

function useTypewriter(phrases: string[]) {
  const [displayed, setDisplayed] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const phrase = phrases[phraseIdx];
    let timeout: ReturnType<typeof setTimeout>;

    if (!deleting && charIdx < phrase.length) {
      timeout = setTimeout(() => setCharIdx((i) => i + 1), 55);
    } else if (!deleting && charIdx === phrase.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && charIdx > 0) {
      timeout = setTimeout(() => setCharIdx((i) => i - 1), 28);
    } else {
      setDeleting(false);
      setPhraseIdx((i) => (i + 1) % phrases.length);
    }

    setDisplayed(phrase.slice(0, charIdx));
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, phraseIdx, phrases]);

  return displayed;
}

export default function LandingPage() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const animatedPlaceholder = useTypewriter(PLACEHOLDERS);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/chat");
    });
  }, [router]);

  function openModal(m: "signin" | "signup") {
    setMode(m);
    setError(null);
    setInfo(null);
    setShowModal(true);
  }

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    openModal("signup");
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);
    try {
      const supabase = createClient();
      const pending = input.trim();

      if (mode === "signup") {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } },
        });
        if (error) throw error;
        if (data.session) {
          if (pending) sessionStorage.setItem("pendingMessage", pending);
          router.push("/chat");
          router.refresh();
        } else {
          setInfo("Revisa tu correo para confirmar la cuenta.");
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (pending) sessionStorage.setItem("pendingMessage", pending);
        router.push("/chat");
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Algo salió mal.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="gradient-bg min-h-screen flex flex-col">
      {/* Background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Top navigation */}
      <nav className="app-nav animate-fade-up">
        <span className="nav-brand">espacio</span>
        <div className="flex items-center gap-3">
          <button className="nav-link-btn" onClick={() => openModal("signin")}>
            iniciar sesión
          </button>
          <button className="nav-cta-btn" onClick={() => openModal("signup")}>
            crear cuenta
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
        {/* Hero text */}
        <div className="relative z-10 text-center mb-10 animate-fade-up">
          <p className="text-xs text-[#3d8c87] mb-5 tracking-[0.3em] uppercase font-semibold">
            tu espacio
          </p>
          <h1 className="font-display text-6xl md:text-7xl text-[#1a1f33] leading-tight mb-6 italic font-normal">
            un lugar para<br />conversar
          </h1>
          <p className="text-base text-[#3d4a58] max-w-xs mx-auto leading-relaxed font-light">
            aquí puedes hablar libremente —<br />escucho sin juzgar, sin prisa
          </p>
        </div>

        {/* Input card — wider */}
        <div className="relative z-10 glass-card w-full max-w-2xl p-6 animate-fade-up-delay">
          {/* Animated placeholder when empty & unfocused */}
          {!input && !focused && (
            <div
              className="absolute pointer-events-none select-none"
              style={{ top: "1.55rem", left: "1.5rem", right: "4rem" }}
            >
              <span className="text-lg text-[#a8b8b6] leading-relaxed">
                {animatedPlaceholder}
              </span>
              <span className="typewriter-cursor" />
            </div>
          )}

          <textarea
            ref={textareaRef}
            className="w-full bg-transparent outline-none resize-none text-[#1a1f33] text-lg leading-relaxed"
            rows={4}
            placeholder={focused && !input ? "¿qué te trae por aquí hoy?" : ""}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <div className="flex items-center justify-end mt-3 pt-3 border-t border-white/40">
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="send-btn"
              aria-label="Enviar"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Auth modal */}
      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowModal(false);
              setError(null);
              setInfo(null);
            }
          }}
        >
          <div className="glass-card modal-card">
            {/* Tabs */}
            <div className="flex gap-6 mb-7 border-b border-[#c8deda]">
              <button
                className={`pb-3 text-base font-semibold transition-colors ${mode === "signup" ? "text-[#1a1f33] border-b-2 border-[#3d8c87]" : "text-[#8a9a9a]"}`}
                onClick={() => { setMode("signup"); setError(null); setInfo(null); }}
              >
                crear cuenta
              </button>
              <button
                className={`pb-3 text-base font-semibold transition-colors ${mode === "signin" ? "text-[#1a1f33] border-b-2 border-[#3d8c87]" : "text-[#8a9a9a]"}`}
                onClick={() => { setMode("signin"); setError(null); setInfo(null); }}
              >
                iniciar sesión
              </button>
            </div>

            <p className="text-[#3d4a58] text-sm mb-5 font-light">
              {mode === "signup"
                ? "crea tu espacio — es gratis y confidencial"
                : "continúa desde donde lo dejaste"}
            </p>

            <form onSubmit={handleAuth} className="space-y-3">
              {mode === "signup" && (
                <input
                  className="modal-input"
                  placeholder="¿cómo te llamas?"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}
              <input
                className="modal-input"
                type="email"
                placeholder="correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="modal-input"
                type="password"
                placeholder="contraseña (mín. 6 caracteres)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />

              {error && (
                <p className="text-xs text-rose-600 text-center pt-1">{error}</p>
              )}
              {info && (
                <p className="text-xs text-[#3d8c87] text-center pt-1">{info}</p>
              )}

              <button type="submit" disabled={loading} className="primary-btn mt-3">
                {loading
                  ? "..."
                  : mode === "signup"
                  ? "empezar"
                  : "entrar"}
              </button>
            </form>

            <p className="text-xs text-[#8a9a9a] text-center mt-5">
              tus conversaciones son privadas y confidenciales
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
