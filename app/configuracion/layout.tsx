import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KOGNT — Configuración",
  description: "Gestiona tu perfil, suscripción y preferencias de notificaciones.",
};

// The page renders its own AppShell — no extra chrome here.
export default function ConfiguracionLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
