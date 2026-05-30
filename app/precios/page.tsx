"use client";

import { useState } from "react";
import Link from "next/link";

export default function PreciosPage() {
  const [loading, setLoading] = useState<"monthly" | "annual" | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function checkout(interval: "monthly" | "annual") {
    setError(null);
    setLoading(interval);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interval }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        throw new Error(data.error || "No se pudo iniciar el pago");
      }
      window.location.href = data.url;
    } catch (e: any) {
      setError(e.message ?? "Error inesperado");
      setLoading(null);
    }
  }

  return (
    <div className="pricing-page">
      <div className="pricing-head">
        <h1 className="pricing-title">Elige tu plan</h1>
        <p className="pricing-sub">
          Empieza gratis. Pásate a Pro cuando quieras conversaciones sin límite.
        </p>
      </div>

      <div className="pricing-grid">
        {/* FREE */}
        <div className="pricing-card">
          <div className="pricing-plan-name">Free</div>
          <div className="pricing-amount">
            $0<span className="pricing-period">/mes</span>
          </div>
          <ul className="pricing-features">
            <li>15 mensajes cada 24 horas</li>
            <li>Acompañamiento emocional con IA</li>
            <li>El límite se reinicia automáticamente</li>
          </ul>
          <Link href="/chat" className="pricing-btn pricing-btn-ghost">
            Seguir en Free
          </Link>
        </div>

        {/* PRO MENSUAL */}
        <div className="pricing-card pricing-card-featured">
          <div className="pricing-badge">Más popular</div>
          <div className="pricing-plan-name">Pro · Mensual</div>
          <div className="pricing-amount">
            $5<span className="pricing-period">/mes</span>
          </div>
          <ul className="pricing-features">
            <li>Mensajes ilimitados</li>
            <li>Sin reinicios ni esperas</li>
            <li>Cancela cuando quieras</li>
          </ul>
          <button
            className="pricing-btn"
            onClick={() => checkout("monthly")}
            disabled={loading !== null}
          >
            {loading === "monthly" ? "Redirigiendo…" : "Elegir mensual"}
          </button>
        </div>

        {/* PRO ANUAL */}
        <div className="pricing-card">
          <div className="pricing-badge pricing-badge-soft">3 días gratis</div>
          <div className="pricing-plan-name">Pro · Anual</div>
          <div className="pricing-amount">
            $49<span className="pricing-period">/año</span>
          </div>
          <ul className="pricing-features">
            <li>Mensajes ilimitados</li>
            <li>3 días de prueba gratis</li>
            <li>Ahorra frente al plan mensual</li>
          </ul>
          <button
            className="pricing-btn"
            onClick={() => checkout("annual")}
            disabled={loading !== null}
          >
            {loading === "annual" ? "Redirigiendo…" : "Probar 3 días gratis"}
          </button>
        </div>
      </div>

      {error && <p className="pricing-error">{error}</p>}

      <Link href="/chat" className="pricing-back">
        ← Volver al chat
      </Link>
    </div>
  );
}
