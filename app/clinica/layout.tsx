import React from "react";
import type { Metadata } from "next";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "KOGNT — Panel Clínico",
  description: "Gestión de pacientes, agenda y métricas de sesión para profesionales de salud mental.",
};

export default function ClinicaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black flex flex-col">
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
