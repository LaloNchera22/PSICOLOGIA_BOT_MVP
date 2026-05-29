import React from "react";

export default function Footer() {
  return (
    <footer className="w-full bg-black border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand col */}
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-3 h-3 flex-shrink-0" style={{ backgroundColor: "var(--accent)" }} />
            <span className="font-bold text-white font-mono tracking-tight">KOGNT</span>
          </div>
          <p className="text-white/40 text-sm leading-relaxed">
            Infraestructura de apoyo emocional y triaje clínico. Privacidad por diseño.
          </p>
        </div>

        {/* Links col */}
        <div>
          <p className="text-white/60 text-xs uppercase tracking-widest mb-4">Navegación</p>
          <ul className="space-y-2">
            <li>
              <a href="/legales" className="text-white/40 text-sm hover:text-white/60 transition-colors">
                Legales
              </a>
            </li>
            <li>
              <a href="/faq" className="text-white/40 text-sm hover:text-white/60 transition-colors">
                FAQ
              </a>
            </li>
            <li>
              <a href="/configuracion" className="text-white/40 text-sm hover:text-white/60 transition-colors">
                Configuración
              </a>
            </li>
          </ul>
        </div>

        {/* Legal col */}
        <div>
          <p className="text-white/60 text-xs uppercase tracking-widest mb-4">Legal</p>
          <p className="text-white/40 text-sm leading-relaxed">
            © 2024 KOGNT. Arquitectura zero-knowledge.
          </p>
          <p className="text-white/30 text-xs mt-2">
            Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
