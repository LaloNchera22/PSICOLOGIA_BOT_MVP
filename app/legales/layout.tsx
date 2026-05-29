import React from "react";
import type { Metadata } from "next";
import { PublicShell } from "@/app/components/PublicShell";

export const metadata: Metadata = {
  title: "KOGNT — Legales",
  description: "Términos y condiciones y política de privacidad de KOGNT.",
};

export default function LegalesLayout({ children }: { children: React.ReactNode }) {
  return <PublicShell>{children}</PublicShell>;
}
