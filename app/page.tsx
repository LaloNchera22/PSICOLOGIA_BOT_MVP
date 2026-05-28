"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

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
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Redirect if already logged in (middleware also handles this)
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/chat");
    });
  }, [router]);

  function handleSend() {
    const text = input.trim();
    if (!text) return;
    setShowModal(true);
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
    <div className="gradient-bg min-h-screen flex flex-col items-center justify-center px-6 py-12">
      {/* Background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Hero text */}
      <div className="relative z-10 text-center mb-10 animate-fade-up">
        <p className="text-lg text-[#6b9f9a] mb-3 tracking-widest uppercase">
          tu espacio
        </p>
        <h1 className="text-6xl md:text-7xl text-[#2d3142] leading-tight mb-5">
          un lugar para<br />conversar
        </h1>
        <p className="text-xl text-[#6b7f7c] max-w-sm mx-auto leading-relaxed">
          aquí puedes hablar libremente — escucho sin juzgar, sin prisa
        </p>
      </div>

      {/* Input card */}
      <div className="relative z-10 glass-card w-full max-w-2xl p-5 animate-fade-up-delay">
        <textarea
          ref={textareaRef}
          className="w-full bg-transparent outline-none resize-none text-[#2d3142] text-xl placeholder-[#a0aaa8] leading-relaxed"
          rows={3}
          placeholder="¿qué te trae por aquí hoy?"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/40">
          <span className="text-sm text-[#a0aaa8]">
            enter para continuar · shift+enter nueva línea
          </span>
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="send-btn"
            aria-label="Enviar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
      </div>

      <p className="relative z-10 text-sm text-[#a0aaa8] mt-6 animate-fade-up-delay2">
        tus conversaciones son privadas y confidenciales
      </p>

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
            <div className="flex gap-6 mb-8 border-b border-[#c8deda]">
              <button
                className={`pb-3 text-xl transition-colors ${mode === "signup" ? "text-[#2d3142] border-b-2 border-[#6b9f9a]" : "text-[#a0aaa8]"}`}
                onClick={() => { setMode("signup"); setError(null); setInfo(null); }}
              >
                crear cuenta
              </button>
              <button
                className={`pb-3 text-xl transition-colors ${mode === "signin" ? "text-[#2d3142] border-b-2 border-[#6b9f9a]" : "text-[#a0aaa8]"}`}
                onClick={() => { setMode("signin"); setError(null); setInfo(null); }}
              >
                iniciar sesión
              </button>
            </div>

            <p className="text-[#6b7f7c] text-lg mb-6">
              {mode === "signup"
                ? "crea tu espacio — es gratis y confidencial"
                : "continúa desde donde lo dejaste"}
            </p>

            <form onSubmit={handleAuth} className="space-y-4">
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
                <p className="text-sm text-rose-500 text-center">{error}</p>
              )}
              {info && (
                <p className="text-sm text-[#6b9f9a] text-center">{info}</p>
              )}

              <button type="submit" disabled={loading} className="primary-btn mt-2">
                {loading
                  ? "..."
                  : mode === "signup"
                  ? "empezar"
                  : "entrar"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
