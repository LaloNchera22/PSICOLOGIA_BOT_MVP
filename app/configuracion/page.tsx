"use client";

import React, { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────
type TabId = "perfil" | "suscripcion" | "notificaciones";

interface PlanCard {
  id: string;
  name: string;
  price: string;
  features: string[];
  isCurrent: boolean;
  isHighlighted: boolean;
}

interface NotifToggle {
  id: string;
  label: string;
  enabled: boolean;
}

// ── Static data ────────────────────────────────────────────────────────
const plans: PlanCard[] = [
  {
    id: "free",
    name: "FREE",
    price: "0€/mes",
    features: ["5 sesiones/mes", "Tareas básicas", "Sin acceso clínico"],
    isCurrent: true,
    isHighlighted: false,
  },
  {
    id: "pro",
    name: "PRO",
    price: "12€/mes",
    features: [
      "Sesiones ilimitadas",
      "Todas las tareas",
      "Exportar historial",
      "Soporte prioritario",
    ],
    isCurrent: false,
    isHighlighted: true,
  },
  {
    id: "clinico",
    name: "CLÍNICO",
    price: "49€/mes",
    features: [
      "Todo Pro",
      "Panel de pacientes",
      "Agenda integrada",
      "API access",
    ],
    isCurrent: false,
    isHighlighted: false,
  },
];

const initialNotifications: NotifToggle[] = [
  { id: "n1", label: "Recordatorios de tareas diarias", enabled: true },
  { id: "n2", label: "Seguimiento semanal", enabled: true },
  { id: "n3", label: "Alertas de riesgo del motor de triage", enabled: false },
  { id: "n4", label: "Novedades del producto", enabled: false },
];

// ── Component ──────────────────────────────────────────────────────────
export default function ConfiguracionPage() {
  const [activeTab, setActiveTab] = useState<TabId>("perfil");
  const [notifications, setNotifications] = useState<NotifToggle[]>(initialNotifications);

  // Perfil form state
  const [nombre, setNombre] = useState("");
  const [ocupacion, setOcupacion] = useState("");
  const [pais, setPais] = useState("ES");

  function toggleNotif(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: "perfil", label: "PERFIL" },
    { id: "suscripcion", label: "SUSCRIPCIÓN" },
    { id: "notificaciones", label: "NOTIFICACIONES" },
  ];

  return (
    <div className="bg-black min-h-screen px-6 py-10">
      <div className="max-w-4xl mx-auto space-y-10">

        {/* Page header */}
        <div>
          <p
            className="text-xs uppercase tracking-widest font-semibold mb-2"
            style={{ color: "var(--accent)" }}
          >
            Cuenta
          </p>
          <h1 className="text-5xl font-bold text-white tracking-tight">
            CONFIGURACIÓN
          </h1>
        </div>

        {/* Tab bar */}
        <div className="flex gap-8 border-b border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 text-sm font-semibold uppercase tracking-widest transition-colors ${
                activeTab === tab.id
                  ? "border-b-2 text-white"
                  : "text-white/40 hover:text-white/70"
              }`}
              style={
                activeTab === tab.id
                  ? { borderBottomColor: "var(--accent)" }
                  : {}
              }
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Tab: PERFIL ──────────────────────────────────── */}
        {activeTab === "perfil" && (
          <div className="space-y-6 max-w-lg">
            <div>
              <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                className="brutal-input"
                placeholder="Tu nombre"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
                Email
              </label>
              <input
                type="email"
                className="brutal-input opacity-50 cursor-not-allowed"
                value="usuario@ejemplo.com"
                readOnly
                disabled
              />
              <p className="text-white/25 text-xs mt-1">
                El email no puede modificarse desde aquí.
              </p>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
                Ocupación
              </label>
              <input
                type="text"
                className="brutal-input"
                placeholder="Psicólogo, ingeniero, estudiante…"
                value={ocupacion}
                onChange={(e) => setOcupacion(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-widest text-white/40 mb-2">
                País
              </label>
              <select
                className="brutal-input"
                value={pais}
                onChange={(e) => setPais(e.target.value)}
                style={{ backgroundColor: "#000", color: "white" }}
              >
                <option value="ES">España</option>
                <option value="MX">México</option>
                <option value="AR">Argentina</option>
                <option value="CO">Colombia</option>
                <option value="CL">Chile</option>
                <option value="PE">Perú</option>
                <option value="OTHER">Otro</option>
              </select>
            </div>

            <button
              className="px-6 py-3 text-white text-sm font-semibold uppercase tracking-widest transition-opacity hover:opacity-80"
              style={{ backgroundColor: "var(--accent)" }}
            >
              Guardar Cambios
            </button>
          </div>
        )}

        {/* ── Tab: SUSCRIPCIÓN ──────────────────────────────── */}
        {activeTab === "suscripcion" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="border p-6 flex flex-col gap-4 bg-black"
                style={{
                  borderColor: plan.isHighlighted
                    ? "var(--accent)"
                    : "rgba(255,255,255,0.1)",
                }}
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="text-white font-bold text-lg tracking-tight">
                    {plan.name}
                  </p>
                  {plan.isCurrent && (
                    <span
                      className="text-xs uppercase tracking-widest font-semibold px-2 py-0.5"
                      style={{
                        color: "var(--accent)",
                        border: "1px solid var(--accent)",
                      }}
                    >
                      Plan Actual
                    </span>
                  )}
                </div>

                <p className="text-3xl font-bold text-white">{plan.price}</p>

                <ul className="space-y-2 flex-1">
                  {plan.features.map((feat) => (
                    <li key={feat} className="flex items-start gap-2 text-sm text-white/60">
                      <span className="text-white/30 mt-0.5">—</span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <button
                  className={`w-full py-3 text-sm font-semibold uppercase tracking-widest transition-opacity hover:opacity-80 ${
                    plan.isCurrent ? "text-white/40 cursor-default" : "text-white"
                  }`}
                  style={{
                    backgroundColor: plan.isCurrent
                      ? "transparent"
                      : plan.isHighlighted
                      ? "var(--accent)"
                      : "rgba(255,255,255,0.05)",
                    border: plan.isCurrent
                      ? "1px solid rgba(255,255,255,0.1)"
                      : "none",
                  }}
                  disabled={plan.isCurrent}
                >
                  {plan.isCurrent ? "Plan Actual" : "Seleccionar"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── Tab: NOTIFICACIONES ──────────────────────────── */}
        {activeTab === "notificaciones" && (
          <div className="max-w-lg space-y-2">
            {notifications.map((notif) => (
              <div
                key={notif.id}
                className="flex items-center justify-between py-5 border-b border-white/10"
              >
                <p className="text-white text-sm leading-snug">{notif.label}</p>
                <button
                  onClick={() => toggleNotif(notif.id)}
                  className="flex-shrink-0 ml-4 w-8 h-8 border flex items-center justify-center transition-colors"
                  style={{
                    borderColor: notif.enabled
                      ? "var(--accent)"
                      : "rgba(255,255,255,0.2)",
                    backgroundColor: notif.enabled
                      ? "var(--accent)"
                      : "transparent",
                  }}
                  aria-label={notif.enabled ? "Desactivar" : "Activar"}
                >
                  {notif.enabled && (
                    <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                      <path
                        d="M1 5L4.5 8.5L11 1"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="square"
                      />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
