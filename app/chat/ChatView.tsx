"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  created_at?: string;
};

export default function ChatView({
  userName,
  initialMessages,
}: {
  userName: string;
  initialMessages: Message[];
}) {
  const router = useRouter();
  const supabase = createClient();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const pendingSent = useRef(false);

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
        { id: `err-${Date.now()}`, role: "assistant", content: "lo siento, no pude responder ahora." },
      ]);
    } finally {
      setSending(false);
    }
  }

  async function send() {
    const text = input.trim();
    if (!text) return;
    setInput("");
    await sendText(text);
  }

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  const firstName = userName.split(" ")[0] || "tú";

  return (
    <main className="h-[100dvh] flex flex-col max-w-2xl mx-auto w-full">
      {/* Nav header */}
      <header className="flex justify-between items-center px-6 py-4 border-b border-[#e4edeb]">
        <div className="flex items-center gap-3">
          <span className="nav-brand text-sm">espacio</span>
          <div className="w-px h-4 bg-[#d0dedd]" />
          <span className="text-sm text-[#6b7f7c] font-light">hola, {firstName}</span>
        </div>
        <button className="nav-link-btn text-sm" onClick={signOut}>
          salir
        </button>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto py-8 px-6 space-y-5">
        {messages.length === 0 && (
          <p className="text-center text-[#b0bab8] text-base mt-20 leading-relaxed font-light">
            cuéntame, ¿cómo te sientes hoy?
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-5 py-3 text-base leading-relaxed ${
                m.role === "user"
                  ? "bg-[#2d3142] text-[#f0f5f3] rounded-2xl rounded-br-sm"
                  : "text-[#2d3142] bg-white/80 rounded-2xl rounded-bl-sm shadow-sm border border-white/60"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="text-[#a0aaa8] text-base bg-white/80 rounded-2xl rounded-bl-sm px-5 py-3 shadow-sm border border-white/60">
              <span className="animate-pulse">···</span>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-[#e4edeb] px-6 py-4 flex gap-3 items-end">
        <textarea
          className="minimal-input resize-none"
          rows={1}
          placeholder="escribe aquí..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
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
          aria-label="Enviar"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </main>
  );
}
