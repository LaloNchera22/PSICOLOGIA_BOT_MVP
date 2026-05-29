import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legales — KOGNT",
  description: "Términos y Condiciones y Política de Privacidad de KOGNT.",
};

const TERMINOS: { title: string; body: string }[] = [
  {
    title: "1. Aceptación de los Términos",
    body:
      "Al acceder y utilizar la plataforma KOGNT, usted acepta quedar vinculado por estos Términos y Condiciones de uso. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio. KOGNT se reserva el derecho de actualizar estos términos en cualquier momento, notificando a los usuarios a través de los canales oficiales de comunicación.",
  },
  {
    title: "2. Descripción del Servicio",
    body:
      "KOGNT es una plataforma de apoyo emocional y triaje de salud mental que utiliza inteligencia artificial. El servicio incluye chat de desahogo emocional, seguimiento de hábitos, herramientas de journaling y un motor de triaje que evalúa indicadores de riesgo. KOGNT no constituye un servicio de psicología clínica ni sustituye el diagnóstico o tratamiento profesional. En casos de emergencia de salud mental, el usuario debe contactar a los servicios de emergencia locales.",
  },
  {
    title: "3. Limitaciones del Servicio",
    body:
      "KOGNT no garantiza la disponibilidad ininterrumpida del servicio ni la precisión absoluta de las evaluaciones del motor de triaje. El contenido generado por inteligencia artificial tiene carácter orientativo y no debe interpretarse como diagnóstico médico. KOGNT no será responsable por decisiones tomadas basándose exclusivamente en las recomendaciones de la plataforma sin supervisión profesional.",
  },
  {
    title: "4. Propiedad Intelectual",
    body:
      "Todo el contenido, diseño, código fuente, algoritmos y marca de KOGNT son propiedad exclusiva de KOGNT Technologies S.L. El usuario no podrá reproducir, distribuir, modificar ni crear obras derivadas sin autorización expresa y por escrito. El uso del servicio no otorga ninguna licencia sobre la propiedad intelectual de KOGNT más allá del uso personal y no comercial.",
  },
  {
    title: "5. Modificaciones",
    body:
      "KOGNT se reserva el derecho de modificar, suspender o discontinuar cualquier aspecto del servicio en cualquier momento y sin previo aviso. Las modificaciones sustanciales en los términos serán comunicadas con al menos 30 días de antelación a los usuarios con cuenta activa. El uso continuado del servicio tras la notificación implica la aceptación de los nuevos términos.",
  },
  {
    title: "6. Ley Aplicable",
    body:
      "Estos términos se regirán e interpretarán conforme a la legislación española, sin perjuicio de los derechos que asistan al usuario bajo la normativa de su país de residencia. Cualquier disputa que surja en relación con estos términos será sometida a la jurisdicción exclusiva de los tribunales de Madrid, España, salvo que la normativa de consumidores aplicable establezca otra jurisdicción.",
  },
];

const PRIVACIDAD: { title: string; body: string }[] = [
  {
    title: "1. Datos que Recopilamos",
    body:
      "Recopilamos únicamente los datos necesarios para prestar el servicio: dirección de email, nombre de perfil (opcional), metadatos de uso anonimizados (frecuencia de sesiones, duración, tipos de tareas completadas) e indicadores de riesgo agregados generados por el motor de triaje. El contenido de las conversaciones jamás es accesible para KOGNT en forma legible. Los datos corporativos se procesan de forma estrictamente agregada y anónima.",
  },
  {
    title: "2. Cifrado y Seguridad",
    body:
      "Implementamos cifrado AES-256 en reposo y TLS 1.3 en tránsito. El cifrado de extremo a extremo de conversaciones utiliza el protocolo Signal para garantizar que ni KOGNT ni terceros puedan acceder al contenido. Realizamos auditorías de seguridad trimestrales y contamos con un programa de bug bounty activo. En caso de brecha de seguridad, notificaremos a los usuarios afectados en un plazo máximo de 72 horas.",
  },
  {
    title: "3. Compartición de Datos",
    body:
      "KOGNT no vende datos de usuarios a terceros bajo ninguna circunstancia. Los datos pueden compartirse con proveedores de infraestructura cloud bajo acuerdos de procesamiento de datos conformes al RGPD. En el contexto corporativo, los informes contienen exclusivamente métricas agregadas y anonimizadas; ningún dato individual o identificable se comparte con empleadores.",
  },
  {
    title: "4. Derechos del Usuario",
    body:
      "De conformidad con el RGPD, usted tiene derecho a acceder, rectificar, portar y suprimir sus datos personales en cualquier momento. Puede ejercer estos derechos desde el panel de Ajustes o enviando una solicitud a privacidad@kognt.io. Dado que el contenido de las conversaciones está cifrado y KOGNT no posee las claves, la supresión de datos conversacionales implica la eliminación de los datos cifrados, que son irrecuperables.",
  },
  {
    title: "5. Retención de Datos",
    body:
      "Los datos de cuenta se conservan mientras la cuenta esté activa. Tras la eliminación de la cuenta, los datos personales se borran en un plazo de 30 días. Los metadatos de uso anonimizados pueden conservarse hasta 2 años con fines de mejora del servicio, al no ser vinculables a ningún individuo. Los datos de facturación se retienen 7 años conforme a la normativa fiscal española.",
  },
  {
    title: "6. Contacto",
    body:
      "Para cualquier consulta relacionada con privacidad, puede contactar a nuestro Delegado de Protección de Datos en dpo@kognt.io. También puede presentar una reclamación ante la Agencia Española de Protección de Datos (AEPD) en www.aepd.es si considera que el tratamiento de sus datos no cumple con la normativa vigente.",
  },
];

function Section({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="info-prose" style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {items.map((item) => (
        <div key={item.title}>
          <h3>{item.title}</h3>
          <p>{item.body}</p>
        </div>
      ))}
    </div>
  );
}

export default function LegalesPage() {
  return (
    <div className="public-content">
      {/* Anchor nav */}
      <div style={{ display: "flex", gap: 24, marginBottom: 48, borderBottom: "1px solid var(--border)", paddingBottom: 20 }}>
        <a href="#terminos" className="link" style={{ fontSize: "0.85rem" }}>Términos y Condiciones</a>
        <a href="#privacidad" className="link" style={{ fontSize: "0.85rem" }}>Política de Privacidad</a>
      </div>

      {/* Términos */}
      <section id="terminos" style={{ marginBottom: 72 }}>
        <p className="accent-label" style={{ marginBottom: 14 }}>Documento Legal</p>
        <h2 style={{ fontSize: "2.1rem", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--fg)", marginBottom: 8 }}>
          Términos y Condiciones
        </h2>
        <p style={{ color: "var(--fg-muted)", fontSize: "0.78rem", marginBottom: 36, fontFamily: "monospace" }}>
          Última actualización: enero 2024
        </p>
        <Section items={TERMINOS} />
      </section>

      {/* Privacidad */}
      <section id="privacidad">
        <p className="accent-label" style={{ marginBottom: 14 }}>Privacidad</p>
        <h2 style={{ fontSize: "2.1rem", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--fg)", marginBottom: 8 }}>
          Política de Privacidad
        </h2>
        <p style={{ color: "var(--fg-muted)", fontSize: "0.78rem", marginBottom: 32, fontFamily: "monospace" }}>
          Última actualización: enero 2024
        </p>

        <div className="acid-panel" style={{ padding: "20px 22px", marginBottom: 36, borderLeft: "4px solid var(--accent)" }}>
          <p style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: "var(--accent)", marginBottom: 8 }}>
            Arquitectura Zero-Knowledge
          </p>
          <p style={{ fontSize: "0.9rem", color: "var(--fg-2)", lineHeight: 1.7 }}>
            Los mensajes se cifran en su dispositivo antes de la transmisión mediante cifrado de extremo a extremo.{" "}
            <strong style={{ color: "var(--fg)" }}>KOGNT no puede leer el contenido de sus conversaciones.</strong>{" "}
            Las claves de descifrado nunca abandonan su dispositivo.
          </p>
        </div>

        <Section items={PRIVACIDAD} />
      </section>
    </div>
  );
}
