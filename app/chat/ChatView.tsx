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

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;
    setSending(true);
    setInput("");

    const optimisticUser: Message = {
      id: `tmp-${Date.now()}`,
      role: "user",
      content: text,
    };
    setMessages((m) => [...m, optimisticUser]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      if (!res.ok) throw new Error("network");
      const data = await res.json();
      setMessages((m) => [
        ...m.filter((x) => x.id !== optimisticUser.id),
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

  async function signOut() {
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <main className="min-h-screen flex flex-col max-w-2xl mx-auto px-6">
      <header className="flex justify-between items-center py-6 border-b border-line">
        <h1 className="text-3xl">hola, {userName.split(" ")[0] || "tú"}</h1>
        <span className="link text-lg" onClick={signOut}>salir</span>
      </header>

      <div ref={scrollRef} className="flex-1 overflow-y-auto py-8 space-y-6">
        {messages.length === 0 && (
          <p className="text-center text-muted text-xl mt-20">
            cuéntame, ¿cómo te sientes hoy?
          </p>
        )}
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] px-5 py-3 text-xl leading-relaxed ${
                m.role === "user"
                  ? "bg-ink text-paper rounded-2xl rounded-br-sm"
                  : "text-ink"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {sending && (
          <div className="flex justify-start">
            <div className="text-muted text-xl">...</div>
          </div>
        )}
      </div>

      <div className="border-t border-line py-5 flex gap-3 items-end">
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
        <button className="minimal-btn" onClick={send} disabled={sending || !input.trim()}>
          enviar
        </button>
      </div>
    </main>
  );
}
