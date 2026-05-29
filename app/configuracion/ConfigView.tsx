"use client";

import { useState } from "react";
import { AppShell, MobileMenuBtn, type AppUser } from "../components/AppShell";
import { ThemeToggle } from "../components/ThemeProvider";

type TabId = "perfil" | "suscripcion" | "notificaciones";

interface PlanCard {
  id: string;
  name: string;
  price: string;
  period: string;
  features: string[];
  isCurrent: boolean;
  isHighlighted: boolean;
}

interface NotifToggle {
  id: string;
  label: string;
  description: string;
  enabled: boolean;
}

const PLANS: PlanCard[] = [
  {
    id: "free",
    name: "Free",
    price: "0",
    period: "siempre gratis",
    features: [
      "5 sesiones de chat al mes",
      "Historial de 30 días",
      "Sin acceso clínico",
    ],
    isCurrent: true,
    isHighlighted: false,
  },
  {
    id: "pro",
    name: "Pro",
    price: "12",
    period: "al mes",
    features: [
      "Sesiones ilimitadas",
      "Historial completo",
      "Exportar conversaciones",
      "Soporte prioritario",
    ],
    isCurrent: false,
    isHighlighted: true,
  },
  {
    id: "clinico",
    name: "Clínico",
    price: "49",
    period: "al mes",
    features: [
      "Todo lo de Pro",
      "Panel de pacientes",
      "Agenda integrada",
      "Acceso API",
    ],
    isCurrent: false,
    isHighlighted: false,
  },
];

const DEFAULT_NOTIFS: NotifToggle[] = [
  {
    id: "n1",
    label: "Recordatorios diarios",
    description: "Te recordamos hacer tu check-in emocional",
    enabled: true,
  },
  {
    id: "n2",
    label: "Seguimiento semanal",
    description: "Resumen de tu evolución cada domingo",
    enabled: true,
  },
  {
    id: "n3",
    label: "Alertas de triage",
    description: "Notificaciones de cambios de riesgo detectados",
    enabled: false,
  },
  {
    id: "n4",
    label: "Novedades del producto",
    description: "Nuevas funcionalidades y mejoras",
    enabled: false,
  },
];

const COUNTRIES = [
  { code: "ES", label: "España" },
  { code: "MX", label: "México" },
  { code: "AR", label: "Argentina" },
  { code: "CO", label: "Colombia" },
  { code: "CL", label: "Chile" },
  { code: "PE", label: "Perú" },
  { code: "VE", label: "Venezuela" },
  { code: "US", label: "Estados Unidos" },
  { code: "OTHER", label: "Otro" },
];

export default function ConfigView({
  user,
  initialName,
  initialOccupation,
  initialCountry,
}: {
  user: AppUser;
  initialName: string;
  initialOccupation: string;
  initialCountry: string;
}) {
  const [activeTab, setActiveTab] = useState<TabId>("perfil");
  const [notifications, setNotifications] = useState<NotifToggle[]>(DEFAULT_NOTIFS);
  const [nombre, setNombre] = useState(initialName);
  const [ocupacion, setOcupacion] = useState(initialOccupation);
  const [pais, setPais] = useState(initialCountry || "ES");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  function toggleNotif(id: string) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, enabled: !n.enabled } : n))
    );
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    await new Promise((r) => setTimeout(r, 600));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const tabs: { id: TabId; label: string }[] = [
    { id: "perfil", label: "Perfil" },
    { id: "suscripcion", label: "Suscripción" },
    { id: "notificaciones", label: "Notificaciones" },
  ];

  return (
    <AppShell user={user}>
      {/* Mobile top bar */}
      <div className="page-topbar">
        <MobileMenuBtn />
        <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--fg)" }}>
          Configuración
        </span>
        <div style={{ marginLeft: "auto" }}>
          <ThemeToggle />
        </div>
      </div>

      {/* Scrollable content */}
      <div className="page-scroll">
        {/* Header */}
        <div className="page-header">
          <p className="page-section-label">Cuenta</p>
          <h1 className="page-title">Configuración</h1>
        </div>

        {/* Tab bar */}
        <div className="page-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={activeTab === tab.id ? "tab-active" : "tab-inactive"}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Perfil ── */}
        {activeTab === "perfil" && (
          <form onSubmit={handleSave} className="acid-panel" style={{ maxWidth: 520, padding: 28 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* Avatar + email row */}
              <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
                <div
                  className="sidebar-avatar"
                  style={{ width: 52, height: 52, borderRadius: 16, fontSize: "1.1rem" }}
                >
                  {(user.name || user.email || "??").replace(/\s+/g, "").slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight: 600, color: "var(--fg)", fontSize: "0.95rem" }}>
                    {user.name || "Sin nombre"}
                  </p>
                  <p style={{ color: "var(--fg-muted)", fontSize: "0.8rem", marginTop: 2 }}>
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="form-label">Nombre completo</label>
                <input
                  type="text"
                  className="acid-input"
                  placeholder="Tu nombre completo"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                />
              </div>

              {/* Email — read only, shows real email */}
              <div>
                <label className="form-label">Correo electrónico</label>
                <input
                  type="email"
                  className="acid-input"
                  value={user.email}
                  readOnly
                  disabled
                />
                <p style={{ color: "var(--fg-muted)", fontSize: "0.75rem", marginTop: 6 }}>
                  El correo no se puede modificar desde aquí.
                </p>
              </div>

              {/* Occupation */}
              <div>
                <label className="form-label">Ocupación</label>
                <input
                  type="text"
                  className="acid-input"
                  placeholder="Psicólogo, ingeniero, estudiante…"
                  value={ocupacion}
                  onChange={(e) => setOcupacion(e.target.value)}
                />
              </div>

              {/* Country */}
              <div>
                <label className="form-label">País</label>
                <select
                  className="acid-input"
                  value={pais}
                  onChange={(e) => setPais(e.target.value)}
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 4 }}>
                <button type="submit" disabled={saving} className="save-btn">
                  {saving ? "Guardando…" : saved ? "✓ Guardado" : "Guardar cambios"}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* ── Suscripción ── */}
        {activeTab === "suscripcion" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16, maxWidth: 780 }}>
            {PLANS.map((plan) => (
              <div
                key={plan.id}
                className={`plan-card${plan.isHighlighted ? " plan-card-highlighted" : plan.isCurrent ? " plan-card-current" : ""}`}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <p style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--fg)", letterSpacing: "-0.01em" }}>
                    {plan.name}
                  </p>
                  {plan.isCurrent && (
                    <span
                      style={{
                        fontSize: "0.65rem",
                        textTransform: "uppercase",
                        letterSpacing: "0.12em",
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: 20,
                        color: "var(--accent)",
                        border: "1px solid var(--accent)",
                        background: "var(--accent-glow)",
                      }}
                    >
                      Actual
                    </span>
                  )}
                </div>

                <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
                  <span style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--fg)", letterSpacing: "-0.03em" }}>
                    {plan.price === "0" ? "Gratis" : `${plan.price}€`}
                  </span>
                  {plan.price !== "0" && (
                    <span style={{ fontSize: "0.78rem", color: "var(--fg-muted)" }}>/{plan.period}</span>
                  )}
                </div>

                <ul style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  {plan.features.map((feat) => (
                    <li key={feat} style={{ display: "flex", gap: 8, fontSize: "0.85rem", color: "var(--fg-2)" }}>
                      <span style={{ color: plan.isHighlighted ? "var(--accent)" : "var(--fg-muted)", flexShrink: 0 }}>→</span>
                      {feat}
                    </li>
                  ))}
                </ul>

                <button
                  disabled={plan.isCurrent}
                  className={plan.isCurrent ? undefined : "save-btn"}
                  style={
                    plan.isCurrent
                      ? {
                          padding: "10px 0",
                          fontSize: "0.8rem",
                          fontWeight: 600,
                          color: "var(--fg-muted)",
                          background: "transparent",
                          border: "none",
                          cursor: "default",
                          letterSpacing: "0.06em",
                          textTransform: "uppercase",
                        }
                      : undefined
                  }
                >
                  {plan.isCurrent ? "Plan actual" : "Seleccionar"}
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ── Notificaciones ── */}
        {activeTab === "notificaciones" && (
          <div className="acid-panel" style={{ maxWidth: 520, padding: "0 4px" }}>
            {notifications.map((notif) => (
              <div key={notif.id} className="toggle-row">
                <div style={{ flex: 1 }}>
                  <p className="toggle-label">{notif.label}</p>
                  <p style={{ fontSize: "0.78rem", color: "var(--fg-muted)", marginTop: 2 }}>
                    {notif.description}
                  </p>
                </div>
                <button
                  onClick={() => toggleNotif(notif.id)}
                  className={`toggle-btn${notif.enabled ? " on" : ""}`}
                  aria-label={notif.enabled ? "Desactivar" : "Activar"}
                  aria-pressed={notif.enabled}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
