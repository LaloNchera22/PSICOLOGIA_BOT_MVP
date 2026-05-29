"use client";

import React, { useState } from "react";

interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

const faqs: FaqItem[] = [
  {
    id: "f1",
    question: "¿KOGNT reemplaza a un psicólogo?",
    answer:
      "No. KOGNT es infraestructura de apoyo emocional y triaje. Si el motor detecta riesgo elevado, te conectamos con un profesional real. Nunca sustituimos el juicio clínico humano.",
  },
  {
    id: "f2",
    question: "¿Mis conversaciones son privadas?",
    answer:
      "Usamos arquitectura de zero-knowledge. Tus mensajes se cifran en cliente antes de enviarse. Nuestros servidores nunca ven el contenido sin cifrar. Ni siquiera nosotros podemos leer tus conversaciones.",
  },
  {
    id: "f3",
    question: "¿Cómo funciona el motor de triaje?",
    answer:
      "Analizamos patrones lingüísticos y de comportamiento para generar un riskScore anónimo. Si supera cierto umbral, se activa un protocolo de escalación que puede incluir recursos de crisis o derivación a un profesional.",
  },
  {
    id: "f4",
    question: "¿Puedo usar KOGNT si tengo un diagnóstico previo?",
    answer:
      "Sí, pero KOGNT no sustituye tu tratamiento. Úsalo como complemento y comparte tu actividad con tu profesional de salud. La plataforma es compatible con terapia en curso.",
  },
  {
    id: "f5",
    question: "¿Qué es el Plan Clínico?",
    answer:
      "Es nuestra suite para psicólogos independientes: gestión de pacientes, agenda integrada y acceso a métricas de sesión anonimizadas. Incluye panel de riskScore por paciente y herramientas de seguimiento.",
  },
  {
    id: "f6",
    question: "¿Cómo se usan mis datos corporativos?",
    answer:
      "Todos los datos del dashboard B2B son 100% anónimos y agregados. Nunca se identifica a un empleado individual. El sistema usa diferencial de privacidad para garantizar anonimidad incluso en equipos pequeños.",
  },
  {
    id: "f7",
    question: "¿Puedo exportar mi historial?",
    answer:
      "Sí, desde Configuración → Suscripción → Plan Pro o superior. Exportamos en formato JSON cifrado con tu clave pública. El archivo solo puede descifrarlo tu dispositivo.",
  },
  {
    id: "f8",
    question: "¿KOGNT tiene API pública?",
    answer:
      "Sí. Nuestro MaaS (Model as a Service) permite integrar el motor de triaje en tus propias aplicaciones. Contacta sales@kognt.io para acceso anticipado a la API beta.",
  },
];

export default function FaqPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="bg-black min-h-screen px-6 py-12 text-white">
      <div className="max-w-3xl mx-auto space-y-12">

        {/* ── Header ── */}
        <div className="border-b border-white/10 pb-8">
          <p className="text-xs uppercase tracking-widest font-semibold mb-3" style={{ color: "var(--accent)" }}>
            Ayuda
          </p>
          <h1 className="text-5xl font-bold tracking-tight mb-2">PREGUNTAS FRECUENTES</h1>
          <p className="text-white/40 text-sm">
            Todo lo que necesitas saber sobre KOGNT.
          </p>
        </div>

        {/* ── Accordion ── */}
        <div>
          {faqs.map((faq, idx) => (
            <div
              key={faq.id}
              className={idx < faqs.length - 1 ? "border-b border-white/10" : ""}
            >
              <button
                className="w-full flex items-center justify-between py-5 text-left gap-4 hover:text-white transition-colors"
                style={{ color: openId === faq.id ? "white" : "rgba(255,255,255,0.7)" }}
                onClick={() => toggle(faq.id)}
              >
                <span className="text-sm font-semibold uppercase tracking-wide">
                  {faq.question}
                </span>
                <span
                  className="text-xl font-light flex-shrink-0 leading-none"
                  style={{ color: "var(--accent)" }}
                >
                  {openId === faq.id ? "−" : "+"}
                </span>
              </button>
              {openId === faq.id && (
                <p className="pb-6 text-sm text-white/50 leading-relaxed">
                  {faq.answer}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* ── Footer note ── */}
        <div className="border border-white/10 p-6">
          <p className="text-xs uppercase tracking-widest text-white/40 mb-2">¿No encontraste tu respuesta?</p>
          <p className="text-sm text-white/60">
            Escríbenos a{" "}
            <span style={{ color: "var(--accent)" }}>soporte@kognt.io</span>
            {" "}— respondemos en menos de 24 horas.
          </p>
        </div>

      </div>
    </div>
  );
}
