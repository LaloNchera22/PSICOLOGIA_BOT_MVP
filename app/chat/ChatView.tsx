"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle, useTheme } from "../components/ThemeProvider";
import { detectLang, getT, type Lang } from "@/lib/i18n";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
};

const navItems = [
  {
    href: "/chat",
    label: "Chat",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
      </svg>
    ),
  },
  {
    href: "/clinica",
    label: "Clínica",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="3" width="20" height="14" rx="2" ry="2"/>
        <line x1="8" y1="21" x2="16" y2="21"/>
        <line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    ),
  },
  {
    href: "/configuracion",
    label: "Ajustes",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
      </svg>
    ),
  },
  {
    href: "/faq",
    label: "FAQ",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
        <line x1="12" y1="17" x2="12.01" y2="17"/>
      </svg>
    ),
  },
];

export default function ChatView({
  userName,
  initialMessages,
}: {
  userName: string;
  initialMessages: Message[];
}) {
  const router = useRouter();
  const { theme } = useTheme();
  const supabase = createClient();
  const [lang, setLang] = useState<Lang>("en");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const pendingSent = useRef(false);

  useEffect(() => {
    setLang(detectLang());
  }, []);

  const t = getT(lang);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (pendingSent.current) return;
    const pending = sessionStorage.getItem("pendingMessage");
    if (!pending) return;
    sessionStorage.removeItem("pendingMessage");
    pendingSent.current = true;
    const timer = setTimeout(() => sendText(pending), 500);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function autoResize() {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  }

  async function sendText(text: string) {
    if (!text.trim() || sending) return;
    setSending(true);

    const optimistic: Message = { id: `tmp-${Date.now()}`, role: "user", content: text };
    setMessages((m) => [...m, optimistic]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) throw new Error("network");
      const data = await res.json();
      setMessages((m) => [
        ...m.filter((x) => x.id !== optimistic.id),
        { id: data.userMessageId, role: "user", content: text },
        { id: data.assistantMessageId, role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        { id: `err-${Date.now()}`, role: "assistant", content: t.chatError },
      ]);
    } finally {
      setSending(false);
    }
  }

  async function send() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
    await sendText(text);
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const firstName = userName.split(" ")[0] || "—";
  const logoSrc = theme === "dark" ? "/logo-white.png" : "/logo-dark.png";
  const initials = firstName.slice(0, 2).toUpperCase();

  return (
    <div className="app-shell">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`app-sidebar${sidebarOpen ? " sidebar-open" : ""}`}>
        <div className="sidebar-logo">
          <Image src={logoSrc} alt="KOGNT" width={80} height={24} className="object-contain" />
        </div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`sidebar-nav-item${item.href === "/chat" ? " sidebar-nav-active" : ""}`}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span className="sidebar-nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-avatar">{initials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{firstName}</div>
              <div className="sidebar-user-role">Usuario</div>
            </div>
          </div>
          <div className="sidebar-actions">
            <ThemeToggle />
            <button className="sidebar-signout" onClick={signOut} title="Salir">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="app-main">
        {/* Chat header */}
        <header className="chat-header-new">
          <button
            className="mobile-menu-btn"
            onClick={() => setSidebarOpen(true)}
            aria-label="Abrir menú"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>

          <div className="chat-header-center">
            <div className="chat-header-avatar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent)" }}>
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <div>
              <div className="chat-header-title">Asistente KOGNT</div>
              <div className="chat-header-subtitle">Psicología · Bienestar emocional</div>
            </div>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
          </div>
        </header>

        {/* Messages */}
        <div ref={scrollRef} className="messages-area">
          {messages.length === 0 && (
            <div className="messages-empty">
              <div className="messages-empty-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--accent)" }}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <p className="messages-empty-title">Hola, {firstName}</p>
              <p className="messages-empty-text">{t.chatEmpty}</p>
            </div>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`message-row${m.role === "user" ? " message-row-user" : " message-row-assistant"}`}
            >
              {m.role === "assistant" && (
                <div className="msg-avatar msg-avatar-bot">K</div>
              )}
              <div className={m.role === "user" ? "bubble-user" : "bubble-assistant"}>
                {m.content}
              </div>
              {m.role === "user" && (
                <div className="msg-avatar msg-avatar-user">{initials}</div>
              )}
            </div>
          ))}

          {sending && (
            <div className="message-row message-row-assistant">
              <div className="msg-avatar msg-avatar-bot">K</div>
              <div className="bubble-typing-new">
                <span className="typing-dot" style={{ animationDelay: "0ms" }} />
                <span className="typing-dot" style={{ animationDelay: "160ms" }} />
                <span className="typing-dot" style={{ animationDelay: "320ms" }} />
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="input-area">
          <div className="input-container">
            <textarea
              ref={textareaRef}
              className="chat-input-field"
              rows={1}
              placeholder={t.chatInputPlaceholder}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                autoResize();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              }}
              disabled={sending}
            />
            <button
              className="send-btn"
              onClick={send}
              disabled={sending || !input.trim()}
              aria-label={t.sendLabel}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
          <p className="input-hint">Enter para enviar · Shift+Enter para nueva línea</p>
        </div>
      </main>

      {/* Mobile bottom nav */}
      <nav className="mobile-bottom-nav">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`mobile-nav-item${item.href === "/chat" ? " mobile-nav-active" : ""}`}
          >
            {item.icon}
            <span className="mobile-nav-label">{item.label}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
}
