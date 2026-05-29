import React from "react";
import type { Metadata } from "next";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "KOGNT — Preguntas Frecuentes",
  description: "Respuestas a las preguntas más comunes sobre KOGNT, privacidad y funcionalidades.",
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
