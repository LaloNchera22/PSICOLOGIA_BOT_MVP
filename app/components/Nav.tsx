import React from "react";

export default function Nav() {
  return (
    <nav className="w-full bg-black border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-4 h-4 bg-accent flex-shrink-0" style={{ backgroundColor: "var(--accent)" }} />
          <span className="font-bold text-white text-lg tracking-tight font-mono">KOGNT</span>
        </div>

        {/* Nav links */}
        <div className="flex items-center gap-6">
          <a href="/app" className="text-sm text-white/60 hover:text-white transition-colors">
            App
          </a>
          <a href="/clinica" className="text-sm text-white/60 hover:text-white transition-colors">
            Clínica
          </a>
          <a href="/corporativo" className="text-sm text-white/60 hover:text-white transition-colors">
            Corporativo
          </a>
          <a href="/configuracion" className="text-sm text-white/60 hover:text-white transition-colors">
            Configuración
          </a>
          <a href="/faq" className="text-sm text-white/60 hover:text-white transition-colors">
            FAQ
          </a>
        </div>
      </div>
    </nav>
  );
}
