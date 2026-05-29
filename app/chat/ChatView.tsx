"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle } from "../components/ThemeProvider";
import { AppShell, MenuBtn, type AppUser } from "../components/AppShell";
import { detectLang, getT, type Lang } from "@/lib/i18n";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
};

export default function ChatView({
  user,
  initialMessages,
}: {
  user: AppUser;
  initialMessages: Message[];
}) {
  // Stable supabase client — never recreated
  const supabaseRef = useRef(createClient());

  const [lang, setLang] = useState<Lang>("en");
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
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

  // Send any message queued from landing page (only once)
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
        ...m.filter((x) => x.id !== optimistic.id),
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

  const firstName = (user.name || "").split(" ")[0] || "—";
  const rawInitials = (user.name || user.email || "??").replace(/\s+/g, "").slice(0, 2).toUpperCase();

  return (
    <AppShell user={user}>
      {/* Chat header */}
      <header className="chat-header-new">
        <MenuBtn />

        <div className="chat-header-center">
          <div className="chat-header-avatar">
            <svg
              width="20" height="20" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2"
              strokeLinecap="round" strokeLinejoin="round"
              style={{ color: "var(--accent)" }}
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <div>
            <div className="chat-header-title">Asistente KOGNT</div>
            <div className="chat-header-subtitle">Psicología · Bienestar emocional</div>
          </div>
        </div>

        <div className="chat-header-actions">
          <ThemeToggle />
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="messages-area">
        {messages.length === 0 && (
          <div className="messages-empty">
            <div className="messages-empty-icon">
              <svg
                width="28" height="28" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="1.5"
                strokeLinecap="round" strokeLinejoin="round"
                style={{ color: "var(--accent)" }}
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
            <p className="messages-empty-title">
              {t.chatGreeting.replace("{name}", firstName)}
            </p>
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
              <div className="msg-avatar msg-avatar-user">{rawInitials}</div>
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
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="2.5"
              strokeLinecap="round" strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </div>
        <p className="input-hint">Enter para enviar · Shift+Enter para nueva línea</p>
      </div>
    </AppShell>
  );
}
