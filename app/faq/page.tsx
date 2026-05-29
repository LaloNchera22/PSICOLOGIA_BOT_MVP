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
    question: "¿Qué es KOGNT Pro?",
    answer:
      "Es nuestra suite para profesionales y empresas, en un portal independiente: gestión de pacientes y agenda para psicólogos, y un dashboard de bienestar agregado para empresas. Se accede de forma separada al portal de personas.",
  },
  {
    id: "f6",
    question: "¿Cómo se usan los datos corporativos?",
    answer:
      "Todos los datos del dashboard corporativo son 100% anónimos y agregados. Nunca se identifica a un empleado individual. El sistema usa privacidad diferencial para garantizar anonimidad incluso en equipos pequeños.",
  },
  {
    id: "f7",
    question: "¿Puedo exportar mi historial?",
    answer:
      "Sí, desde Ajustes → Suscripción → Plan Pro o superior. Exportamos en formato JSON cifrado con tu clave pública. El archivo solo puede descifrarlo tu dispositivo.",
  },
  {
    id: "f8",
    question: "¿KOGNT tiene API pública?",
    answer:
      "Sí. Nuestro MaaS (Model as a Service) permite integrar el motor de triaje en tus propias aplicaciones, desde un portal de desarrolladores independiente. Escríbenos a sales@kognt.io para acceso anticipado.",
  },
];

export default function FaqPage() {
  const [openId, setOpenId] = useState<string | null>(null);

  function toggle(id: string) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  return (
    <div className="public-content">
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <p className="accent-label" style={{ marginBottom: 14 }}>Ayuda</p>
        <h1 style={{ fontSize: "2.6rem", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--fg)", marginBottom: 10 }}>
          Preguntas frecuentes
        </h1>
        <p style={{ color: "var(--fg-muted)", fontSize: "0.95rem" }}>
          Todo lo que necesitas saber sobre KOGNT.
        </p>
      </div>

      {/* Accordion */}
      <div>
        {faqs.map((faq) => (
          <div key={faq.id} className="faq-item">
            <button className="faq-q" onClick={() => toggle(faq.id)} aria-expanded={openId === faq.id}>
              <span>{faq.question}</span>
              <span className="faq-toggle">{openId === faq.id ? "−" : "+"}</span>
            </button>
            {openId === faq.id && <p className="faq-a">{faq.answer}</p>}
          </div>
        ))}
      </div>

      {/* Footer note */}
      <div className="acid-panel" style={{ padding: 24, marginTop: 36 }}>
        <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--fg-muted)", marginBottom: 8, fontWeight: 600 }}>
          ¿No encontraste tu respuesta?
        </p>
        <p style={{ fontSize: "0.92rem", color: "var(--fg-2)" }}>
          Escríbenos a <span style={{ color: "var(--accent)", fontWeight: 600 }}>soporte@kognt.io</span> — respondemos en menos de 24 horas.
        </p>
      </div>
    </div>
  );
}
