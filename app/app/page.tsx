"use client";

import React, { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────
interface TaskItem {
  id: string;
  title: string;
  type: "habit" | "breathing" | "journal";
  completed: boolean;
  dueTime: string;
}

interface NotificationItem {
  id: string;
  message: string;
}

interface MessageItem {
  id: string;
  role: "user" | "bot";
  text: string;
}

// ── Static mock data ───────────────────────────────────────────────────
const initialMessages: MessageItem[] = [
  {
    id: "m1",
    role: "user",
    text: "Hoy me siento completamente agotado, no sé cómo seguir.",
  },
  {
    id: "m2",
    role: "bot",
    text: "Entiendo que estás pasando por un momento muy difícil. ¿Puedes contarme más sobre qué está causando ese agotamiento?",
  },
];

const mockTasks: TaskItem[] = [
  { id: "1", title: "Ejercicio de respiración 4-7-8", type: "breathing", completed: true, dueTime: "08:00" },
  { id: "2", title: "Diario de emociones", type: "journal", completed: false, dueTime: "12:00" },
  { id: "3", title: "Caminata 20 min", type: "habit", completed: false, dueTime: "18:00" },
  { id: "4", title: "Lectura mindful 10 min", type: "habit", completed: false, dueTime: "21:00" },
];

const mockNotifications: NotificationItem[] = [
  { id: "n1", message: "Recordatorio: Diario de emociones a las 12:00" },
  { id: "n2", message: "Seguimiento semanal disponible" },
];

// ── Type icon helper ───────────────────────────────────────────────────
function typeLabel(type: TaskItem["type"]): string {
  switch (type) {
    case "breathing":
      return "○";
    case "journal":
      return "≡";
    case "habit":
      return "◈";
  }
}

// ── Component ──────────────────────────────────────────────────────────
export default function AppPage() {
  const [messages, setMessages] = useState<MessageItem[]>(initialMessages);
  const [inputText, setInputText] = useState("");
  const [tasks, setTasks] = useState<TaskItem[]>(mockTasks);

  function handleSend() {
    const trimmed = inputText.trim();
    if (!trimmed) return;
    const newMsg: MessageItem = { id: `m-${Date.now()}`, role: "user", text: trimmed };
    setMessages((prev) => [...prev, newMsg]);
    setInputText("");
  }

  function toggleTask(id: string) {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  }

  return (
    <div className="bg-black min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">

        {/* ── LEFT: Chat panel ──────────────────────────── */}
        <div className="border border-white/10 flex flex-col" style={{ minHeight: "600px" }}>
          {/* Chat header */}
          <div className="border-b border-white/10 px-6 py-5">
            <p
              className="text-xs uppercase tracking-widest font-semibold mb-1"
              style={{ color: "var(--accent)" }}
            >
              Desahogo
            </p>
            <p className="text-white/50 text-sm">Habla libremente. Sin juicios.</p>
          </div>

          {/* Messages area */}
          <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col gap-4" style={{ minHeight: "400px" }}>
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={
                    msg.role === "user"
                      ? "px-4 py-3 text-white text-sm leading-relaxed max-w-[75%]"
                      : "px-4 py-3 border border-white/10 text-white text-sm leading-relaxed max-w-[75%] bg-white/5"
                  }
                  style={
                    msg.role === "user"
                      ? { backgroundColor: "var(--accent)" }
                      : {}
                  }
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input bar */}
          <div className="border-t border-white/10 px-6 py-4 flex gap-3">
            <textarea
              className="flex-1 brutal-input resize-none"
              rows={2}
              placeholder="Escribe aquí..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <button
              onClick={handleSend}
              className="px-5 py-2 text-white text-sm font-semibold uppercase tracking-widest self-end"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Enviar
            </button>
          </div>
        </div>

        {/* ── RIGHT: Seguimiento panel ───────────────────── */}
        <div className="flex flex-col gap-6">

          {/* Tasks */}
          <div className="border border-white/10 bg-black">
            <div className="border-b border-white/10 px-5 py-4">
              <p
                className="text-xs uppercase tracking-widest font-semibold"
                style={{ color: "var(--accent)" }}
              >
                Tareas Hoy
              </p>
            </div>
            <ul className="divide-y divide-white/5">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="flex items-center gap-3 px-5 py-4 cursor-pointer hover:bg-white/[0.02] transition-colors"
                  onClick={() => toggleTask(task.id)}
                >
                  {/* Checkbox indicator */}
                  <div
                    className="w-4 h-4 flex-shrink-0 border border-white/30 flex items-center justify-center"
                    style={task.completed ? { backgroundColor: "var(--accent)", borderColor: "var(--accent)" } : {}}
                  >
                    {task.completed && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="1.5" strokeLinecap="square" />
                      </svg>
                    )}
                  </div>

                  {/* Title + type icon */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm leading-snug ${task.completed ? "text-white/30 line-through" : "text-white/80"}`}
                    >
                      <span className="mr-1 text-white/30">{typeLabel(task.type)}</span>
                      {task.title}
                    </p>
                  </div>

                  {/* Time badge */}
                  <span className="text-xs text-white/30 font-mono flex-shrink-0">{task.dueTime}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Notifications */}
          <div className="border border-white/10 bg-black">
            <div className="border-b border-white/10 px-5 py-4 flex items-center gap-2">
              {/* Bell icon */}
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="square"
                className="text-white/40"
              >
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              <p
                className="text-xs uppercase tracking-widest font-semibold"
                style={{ color: "var(--accent)" }}
              >
                Alertas
              </p>
            </div>
            <ul className="divide-y divide-white/5">
              {mockNotifications.map((notif) => (
                <li key={notif.id} className="px-5 py-4">
                  <p className="text-sm text-white/60 leading-snug">{notif.message}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
