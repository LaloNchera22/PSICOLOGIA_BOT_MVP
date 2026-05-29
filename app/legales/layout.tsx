import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KOGNT — Legales",
  description: "Términos y condiciones y política de privacidad de KOGNT.",
};

export default function LegalesLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col" style={{ background: "var(--bg)" }}>
      <main className="flex-1">{children}</main>
    </div>
  );
}
