import React from "react";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones — KOGNT",
  description: "Términos y condiciones del servicio de acompañamiento emocional KOGNT.",
};

export default function LegalesPage() {
  return (
    <div className="px-6 py-12" style={{ color: "var(--fg)" }}>
      <div className="max-w-3xl mx-auto">
        <Link
          href="/"
          className="text-sm hover:underline"
          style={{ color: "var(--accent)" }}
        >
          ← Volver
        </Link>

        {/* ── Disclaimer destacado ── */}
        <div
          className="mt-8 mb-12 p-5 rounded-xl"
          style={{
            background: "var(--card, rgba(127,127,127,0.08))",
            borderLeft: "4px solid var(--accent)",
          }}
        >
          <p
            className="text-xs uppercase tracking-widest font-bold mb-2"
            style={{ color: "var(--accent)" }}
          >
            Aviso importante
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--fg-2)" }}>
            KOGNT es un servicio de <strong style={{ color: "var(--fg)" }}>acompañamiento
            emocional</strong> basado en inteligencia artificial.{" "}
            <strong style={{ color: "var(--fg)" }}>
              No es un servicio de psicología clínica y no sustituye el diagnóstico,
              tratamiento ni la atención de un profesional de la salud mental.
            </strong>{" "}
            Si estás en una situación de crisis o emergencia, contacta de inmediato a los
            servicios de emergencia de tu país o a una línea de ayuda profesional.
          </p>
        </div>

        <section>
          <p
            className="text-xs uppercase tracking-widest font-semibold mb-4"
            style={{ color: "var(--accent)" }}
          >
            Documento Legal
          </p>
          <h1 className="font-display text-4xl font-light tracking-tight mb-8">
            Términos y Condiciones
          </h1>

          <div className="space-y-8 text-sm leading-loose" style={{ color: "var(--fg-2)" }}>
            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--fg)" }}>
                1. Aceptación de los términos
              </h2>
              <p>
                Al crear una cuenta y utilizar KOGNT aceptas estos Términos y Condiciones. Si
                no estás de acuerdo con alguna parte, no podrás utilizar el servicio.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--fg)" }}>
                2. Naturaleza del servicio
              </h2>
              <p>
                KOGNT ofrece un espacio de conversación para el acompañamiento emocional y el
                bienestar psicológico mediante un asistente de inteligencia artificial. El
                asistente atiende únicamente temas de bienestar emocional y salud mental; las
                consultas ajenas a este ámbito no serán atendidas.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--fg)" }}>
                3. No sustituye a un profesional
              </h2>
              <p>
                El contenido generado por el asistente tiene carácter orientativo y de apoyo.{" "}
                <strong style={{ color: "var(--fg)" }}>
                  KOGNT no constituye terapia, psicología clínica, ni consejo médico, y no
                  reemplaza la valoración de un profesional cualificado.
                </strong>{" "}
                Ante síntomas persistentes o situaciones de riesgo, busca ayuda profesional.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--fg)" }}>
                4. Situaciones de crisis
              </h2>
              <p>
                Si detectas señales de crisis (ideación suicida, violencia o abuso), busca
                ayuda profesional de forma inmediata y contacta a los servicios de emergencia
                locales. El asistente puede sugerirte recursos, pero no puede intervenir en
                una emergencia.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--fg)" }}>
                5. Privacidad
              </h2>
              <p>
                Tus conversaciones se asocian a tu cuenta y son privadas. Recopilamos
                únicamente los datos necesarios para prestar el servicio (correo electrónico,
                nombre opcional e historial de tus mensajes). No vendemos tus datos a terceros.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-semibold mb-3" style={{ color: "var(--fg)" }}>
                6. Uso responsable
              </h2>
              <p>
                Te comprometes a utilizar KOGNT de forma personal y responsable. El servicio
                se ofrece &quot;tal cual&quot;, sin garantía de disponibilidad ininterrumpida ni de
                precisión absoluta de las respuestas.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
