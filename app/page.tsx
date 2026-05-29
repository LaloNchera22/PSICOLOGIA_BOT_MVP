"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle, useTheme } from "./components/ThemeProvider";
import { detectLang, getT, type Lang } from "@/lib/i18n";

function useTypewriter(phrases: string[]) {
  const [displayed, setDisplayed] = useState("");
  const [phraseIdx, setPhraseIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const prevPhrasesRef = useRef(phrases);

  useEffect(() => {
    if (prevPhrasesRef.current !== phrases) {
      prevPhrasesRef.current = phrases;
      setPhraseIdx(0);
      setCharIdx(0);
      setDeleting(false);
      setDisplayed("");
    }
  }, [phrases]);

  useEffect(() => {
    const phrase = phrases[phraseIdx] ?? "";
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
  const { theme } = useTheme();
  const [lang, setLang] = useState<Lang>("en");
  const [input, setInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [focused, setFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setLang(detectLang());
  }, []);

  const t = getT(lang);
  const animatedPlaceholder = useTypewriter(t.placeholders);

  useEffect(() => {
    try {
      const supabase = createClient();
      supabase.auth.getSession().then(({ data }) => {
        if (data.session) router.replace("/chat");
      }).catch(() => {});
    } catch (e) {
      console.error("Supabase init error – check env vars:", e);
    }
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

  async function handleGoogleAuth() {
    setError(null);
    if (mode === "signup" && !acceptedTerms) {
      setError(t.termsRequired);
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const pending = input.trim();
      if (pending) sessionStorage.setItem("pendingMessage", pending);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: { redirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.errorGeneric;
      setError(msg);
      setLoading(false);
    }
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (mode === "signup" && !acceptedTerms) {
      setError(t.termsRequired);
      return;
    }
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
          setInfo(t.checkEmail);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (pending) sessionStorage.setItem("pendingMessage", pending);
        router.push("/chat");
        router.refresh();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : t.errorGeneric;
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  const logoSrc = theme === "dark" ? "/logo-white.png" : "/logo-dark.png";

  return (
    <div className="gradient-bg min-h-[100dvh] flex flex-col">
      {/* Background blobs */}
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      {/* Top navigation */}
      <nav className="app-nav animate-fade-up">
        <span className="nav-brand">
          <Image
            src={logoSrc}
            alt="KOGNT"
            width={140}
            height={38}
            className="kognt-logo"
            priority
          />
        </span>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <button className="nav-link-btn" onClick={() => openModal("signin")}>
            {t.navSignIn}
          </button>
          <button className="nav-cta-btn" onClick={() => openModal("signup")}>
            {t.navSignUp}
          </button>
        </div>
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-5 sm:px-8 py-10 sm:py-12">
        {/* Hero text */}
        <div className="relative z-10 text-center mb-8 sm:mb-10 animate-fade-up">
          <p className="accent-label mb-4 sm:mb-5">
            {t.accentLabel}
          </p>
          <h1
            className="font-display text-[2.8rem] sm:text-6xl md:text-7xl leading-[1.15] mb-4 sm:mb-6 font-light"
            style={{ color: "var(--fg)" }}
          >
            {t.heroTitle}<br />{t.heroLine2}
          </h1>
          <p
            className="text-sm sm:text-base max-w-[16rem] sm:max-w-xs mx-auto leading-relaxed font-light"
            style={{ color: "var(--fg-2)" }}
          >
            {t.heroSubtitle}<br />{t.heroSubtitleLine2}
          </p>
        </div>

        {/* Input card */}
        <div className="relative z-10 glass-card w-full max-w-xl sm:max-w-2xl p-4 sm:p-6 animate-fade-up-delay">
          {/* Animated placeholder aligned with textarea */}
          {!input && !focused && (
            <div className="absolute pointer-events-none select-none top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6">
              <span
                className="text-base sm:text-lg leading-relaxed"
                style={{ color: "var(--fg-muted)" }}
              >
                {animatedPlaceholder}
              </span>
              <span className="typewriter-cursor" />
            </div>
          )}

          <textarea
            ref={textareaRef}
            className="w-full bg-transparent outline-none resize-none text-base sm:text-lg leading-relaxed"
            style={{ color: "var(--fg)" }}
            rows={2}
            placeholder={focused && !input ? t.placeholders[0] : ""}
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
          <div className="flex items-center justify-end mt-2 sm:mt-3">
            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="send-btn"
              aria-label={t.sendLabel}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
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
            {/* Logo inside modal */}
            <div className="flex justify-center mb-6">
              <Image
                src={logoSrc}
                alt="KOGNT"
                width={100}
                height={28}
                className="object-contain"
              />
            </div>

            {/* Tabs */}
            <div
              className="flex gap-6 mb-7"
              style={{ borderBottom: "1px solid var(--border-strong)" }}
            >
              <button
                className={mode === "signup" ? "tab-active" : "tab-inactive"}
                onClick={() => { setMode("signup"); setError(null); setInfo(null); }}
              >
                {t.modalSignUp}
              </button>
              <button
                className={mode === "signin" ? "tab-active" : "tab-inactive"}
                onClick={() => { setMode("signin"); setError(null); setInfo(null); }}
              >
                {t.modalSignIn}
              </button>
            </div>

            <p className="text-sm mb-5 font-light" style={{ color: "var(--fg-2)" }}>
              {mode === "signup" ? t.modalSubSignUp : t.modalSubSignIn}
            </p>

            {/* Google OAuth button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="google-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {t.googleBtn}
            </button>

            <div className="flex items-center gap-3 my-4">
              <div className="flex-1 h-px" style={{ background: "var(--border-strong)" }} />
              <span className="divider-text">o</span>
              <div className="flex-1 h-px" style={{ background: "var(--border-strong)" }} />
            </div>

            <form onSubmit={handleAuth} className="space-y-3">
              {mode === "signup" && (
                <input
                  className="modal-input"
                  placeholder={t.namePlaceholder}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              )}
              <input
                className="modal-input"
                type="email"
                placeholder={t.emailPlaceholder}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <input
                className="modal-input"
                type="password"
                placeholder={t.passwordPlaceholder}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />

              {mode === "signup" && (
                <label
                  className="flex items-start gap-2.5 text-xs leading-relaxed cursor-pointer pt-1"
                  style={{ color: "var(--fg-muted)" }}
                >
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="mt-0.5 flex-shrink-0 accent-current cursor-pointer"
                    style={{ accentColor: "var(--accent)" }}
                  />
                  <span>
                    {t.termsAccept}
                    <a
                      href="/legales"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{ color: "var(--accent)" }}
                      className="underline"
                    >
                      {t.termsLink}
                    </a>
                    {t.termsDisclaimer}
                  </span>
                </label>
              )}

              {error && (
                <p className="text-xs text-rose-500 text-center pt-1">{error}</p>
              )}
              {info && (
                <p className="text-xs text-center pt-1" style={{ color: "var(--accent)" }}>{info}</p>
              )}

              <button
                type="submit"
                disabled={loading || (mode === "signup" && !acceptedTerms)}
                className="primary-btn mt-3"
              >
                {loading
                  ? "..."
                  : mode === "signup"
                  ? t.submitSignUp
                  : t.submitSignIn}
              </button>
            </form>

            <p className="text-xs text-center mt-5" style={{ color: "var(--fg-muted)" }}>
              {t.privacyNote}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
