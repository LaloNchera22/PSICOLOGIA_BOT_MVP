import React from "react";
import type { Metadata } from "next";
import { PublicShell } from "@/app/components/PublicShell";

export const metadata: Metadata = {
  title: "KOGNT — Preguntas Frecuentes",
  description: "Respuestas a las preguntas más comunes sobre KOGNT, privacidad y funcionalidades.",
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <PublicShell>{children}</PublicShell>;
}
