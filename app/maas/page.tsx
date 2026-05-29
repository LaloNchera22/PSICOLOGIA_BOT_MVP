"use client";

import Image from "next/image";
import { ThemeToggle, useTheme } from "@/app/components/ThemeProvider";

const FEATURES = [
  { title: "Triaje en tiempo real", desc: "Envía texto y recibe un riskScore estructurado en milisegundos." },
  { title: "Privacidad por diseño", desc: "Sin almacenamiento de contenido. Procesamos y descartamos." },
  { title: "SDKs nativos", desc: "Clientes para TypeScript, Python y Go. Webhooks de escalación." },
  { title: "Cumplimiento", desc: "RGPD y HIPAA-ready. Acuerdos de procesamiento disponibles." },
];

export default function MaasLanding() {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? "/logo-white.png" : "/logo-dark.png";

  return (
    <div className="gradient-bg" style={{ minHeight: "100dvh", display: "flex", flexDirection: "column" }}>
      <div className="blob blob-1" />
      <div className="blob blob-2" />
      <div className="blob blob-3" />

      <nav className="app-nav animate-fade-up">
        <span className="nav-brand" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Image src={logoSrc} alt="KOGNT" width={120} height={32} className="kognt-logo" priority />
          <span className="saas-badge">MaaS</span>
        </span>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <a href="mailto:sales@kognt.io" className="nav-cta-btn">Solicitar acceso</a>
        </div>
      </nav>

      <div className="maas-hero animate-fade-up">
        <p className="accent-label">Model as a Service</p>
        <h1 className="maas-title">El motor de triaje<br />emocional, como API</h1>
        <p className="maas-sub">
          Integra la detección de riesgo y el acompañamiento de KOGNT en tu producto.
          Una sola llamada. Sin almacenar contenido sensible.
        </p>
      </div>

      <div className="maas-hero animate-fade-up-delay" style={{ paddingTop: 0 }}>
        <pre className="maas-code">
{`POST https://api.kognt.io/v1/triage
{
  "`}<span className="tok-key">text</span>{`": `}<span className="tok-str">&quot;últimamente no encuentro sentido a nada&quot;</span>{`,
  "`}<span className="tok-key">locale</span>{`": `}<span className="tok-str">&quot;es&quot;</span>{`
}

→ 200 OK
{
  "`}<span className="tok-key">riskScore</span>{`": 7,
  "`}<span className="tok-key">tier</span>{`": `}<span className="tok-str">&quot;elevated&quot;</span>{`,
  "`}<span className="tok-key">recommendedAction</span>{`": `}<span className="tok-str">&quot;escalate_to_human&quot;</span>{`
}`}
        </pre>
      </div>

      <div className="maas-grid animate-fade-up-delay2">
        {FEATURES.map((f) => (
          <div key={f.title} className="acid-panel maas-feature">
            <h3>{f.title}</h3>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      <footer className="public-footer" style={{ marginTop: 24 }}>
        <a href="/legales">Legales</a>
        <a href="mailto:sales@kognt.io">sales@kognt.io</a>
        <span>© {new Date().getFullYear()} KOGNT · API beta</span>
      </footer>
    </div>
  );
}
