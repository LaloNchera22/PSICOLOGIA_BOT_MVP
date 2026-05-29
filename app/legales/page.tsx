import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Legales — KOGNT",
  description: "Términos y Condiciones y Política de Privacidad de KOGNT.",
};

export default function LegalesPage() {
  return (
    <div className="bg-black min-h-screen px-6 py-12 text-white">
      <div className="max-w-3xl mx-auto">

        {/* ── Anchor nav ── */}
        <div className="flex gap-6 mb-12 border-b border-white/10 pb-6">
          <a
            href="#terminos"
            className="text-sm uppercase tracking-widest text-white/40 hover:text-white transition-colors"
          >
            Términos y Condiciones
          </a>
          <a
            href="#privacidad"
            className="text-sm uppercase tracking-widest text-white/40 hover:text-white transition-colors"
          >
            Política de Privacidad
          </a>
        </div>

        {/* ══════════════════════════════════════════
            TÉRMINOS Y CONDICIONES
        ══════════════════════════════════════════ */}
        <section id="terminos" className="mb-20">
          <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: "var(--accent)" }}>
            Documento Legal
          </p>
          <h2 className="text-4xl font-bold tracking-tight mb-8">Términos y Condiciones</h2>
          <p className="text-white/40 text-xs mb-10 font-mono">Última actualización: enero 2024</p>

          <div className="space-y-8 text-sm text-white/70 leading-loose">

            <div>
              <h3 className="text-lg font-semibold text-white/90 mb-3 uppercase tracking-wide">
                1. Aceptación de los Términos
              </h3>
              <p>
                Al acceder y utilizar la plataforma KOGNT, usted acepta quedar vinculado por estos Términos y Condiciones
                de uso. Si no está de acuerdo con alguna parte de estos términos, no podrá acceder al servicio. KOGNT se
                reserva el derecho de actualizar estos términos en cualquier momento, notificando a los usuarios a través
                de los canales oficiales de comunicación.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white/90 mb-3 uppercase tracking-wide">
                2. Descripción del Servicio
              </h3>
              <p>
                KOGNT es una plataforma de apoyo emocional y triaje de salud mental que utiliza inteligencia artificial.
                El servicio incluye chat de desahogo emocional, seguimiento de hábitos, herramientas de journaling y un
                motor de triaje que evalúa indicadores de riesgo. KOGNT no constituye un servicio de psicología clínica
                ni sustituye el diagnóstico o tratamiento profesional. En casos de emergencia de salud mental, el usuario
                debe contactar a los servicios de emergencia locales.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white/90 mb-3 uppercase tracking-wide">
                3. Limitaciones del Servicio
              </h3>
              <p>
                KOGNT no garantiza la disponibilidad ininterrumpida del servicio ni la precisión absoluta de las
                evaluaciones del motor de triaje. El contenido generado por inteligencia artificial tiene carácter
                orientativo y no debe interpretarse como diagnóstico médico. KOGNT no será responsable por decisiones
                tomadas basándose exclusivamente en las recomendaciones de la plataforma sin supervisión profesional.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white/90 mb-3 uppercase tracking-wide">
                4. Propiedad Intelectual
              </h3>
              <p>
                Todo el contenido, diseño, código fuente, algoritmos y marca de KOGNT son propiedad exclusiva de KOGNT
                Technologies S.L. El usuario no podrá reproducir, distribuir, modificar ni crear obras derivadas sin
                autorización expresa y por escrito. El uso del servicio no otorga ninguna licencia sobre la propiedad
                intelectual de KOGNT más allá del uso personal y no comercial.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white/90 mb-3 uppercase tracking-wide">
                5. Modificaciones
              </h3>
              <p>
                KOGNT se reserva el derecho de modificar, suspender o discontinuar cualquier aspecto del servicio en
                cualquier momento y sin previo aviso. Las modificaciones sustanciales en los términos serán comunicadas
                con al menos 30 días de antelación a los usuarios con cuenta activa. El uso continuado del servicio tras
                la notificación implica la aceptación de los nuevos términos.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white/90 mb-3 uppercase tracking-wide">
                6. Ley Aplicable
              </h3>
              <p>
                Estos términos se regirán e interpretarán conforme a la legislación española, sin perjuicio de los
                derechos que asistan al usuario bajo la normativa de su país de residencia. Cualquier disputa que surja
                en relación con estos términos será sometida a la jurisdicción exclusiva de los tribunales de Madrid,
                España, salvo que la normativa de consumidores aplicable establezca otra jurisdicción.
              </p>
            </div>

          </div>
        </section>

        {/* ══════════════════════════════════════════
            POLÍTICA DE PRIVACIDAD
        ══════════════════════════════════════════ */}
        <section id="privacidad">
          <p className="text-xs uppercase tracking-widest font-semibold mb-4" style={{ color: "var(--accent)" }}>
            Privacidad
          </p>
          <h2 className="text-4xl font-bold tracking-tight mb-8">Política de Privacidad</h2>
          <p className="text-white/40 text-xs mb-10 font-mono">Última actualización: enero 2024</p>

          {/* Zero-knowledge callout */}
          <div
            className="mb-10 p-5 bg-white/5"
            style={{ borderLeft: "4px solid var(--accent)" }}
          >
            <p className="text-xs uppercase tracking-widest font-bold mb-2" style={{ color: "var(--accent)" }}>
              Arquitectura Zero-Knowledge
            </p>
            <p className="text-sm text-white/80 leading-relaxed">
              Los mensajes se cifran en su dispositivo antes de la transmisión mediante cifrado de extremo a extremo.{" "}
              <strong className="text-white">KOGNT no puede leer el contenido de sus conversaciones.</strong>{" "}
              Las claves de descifrado nunca abandonan su dispositivo. Nuestros servidores almacenan únicamente
              datos cifrados que son técnicamente inaccesibles para nosotros.
            </p>
          </div>

          <div className="space-y-8 text-sm text-white/70 leading-loose">

            <div>
              <h3 className="text-lg font-semibold text-white/90 mb-3 uppercase tracking-wide">
                1. Datos que Recopilamos
              </h3>
              <p>
                Recopilamos únicamente los datos necesarios para prestar el servicio: dirección de email, nombre
                de perfil (opcional), metadatos de uso anonimizados (frecuencia de sesiones, duración, tipos de
                tareas completadas) e indicadores de riesgo agregados generados por el motor de triaje. El contenido
                de las conversaciones jamás es accesible para KOGNT en forma legible. Los datos corporativos B2B
                se procesan de forma estrictamente agregada y anónima.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white/90 mb-3 uppercase tracking-wide">
                2. Cifrado y Seguridad
              </h3>
              <p>
                Implementamos cifrado AES-256 en reposo y TLS 1.3 en tránsito. El cifrado de extremo a extremo
                de conversaciones utiliza el protocolo Signal para garantizar que ni KOGNT ni terceros puedan
                acceder al contenido. Realizamos auditorías de seguridad trimestrales y contamos con un programa
                de bug bounty activo. En caso de brecha de seguridad, notificaremos a los usuarios afectados en
                un plazo máximo de 72 horas.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white/90 mb-3 uppercase tracking-wide">
                3. Compartición de Datos
              </h3>
              <p>
                KOGNT no vende datos de usuarios a terceros bajo ninguna circunstancia. Los datos pueden compartirse
                con proveedores de infraestructura cloud bajo acuerdos de procesamiento de datos conformes al RGPD.
                En el contexto B2B, los informes corporativos contienen exclusivamente métricas agregadas y
                anonimizadas; ningún dato individual o identificable se comparte con empleadores.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white/90 mb-3 uppercase tracking-wide">
                4. Derechos del Usuario
              </h3>
              <p>
                De conformidad con el RGPD, usted tiene derecho a acceder, rectificar, portar y suprimir sus datos
                personales en cualquier momento. Puede ejercer estos derechos desde el panel de Configuración o
                enviando una solicitud a privacidad@kognt.io. Dado que el contenido de las conversaciones está
                cifrado y KOGNT no posee las claves, la supresión de datos conversacionales implica la eliminación
                de los datos cifrados, que son irrecuperables.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white/90 mb-3 uppercase tracking-wide">
                5. Retención de Datos
              </h3>
              <p>
                Los datos de cuenta se conservan mientras la cuenta esté activa. Tras la eliminación de la cuenta,
                los datos personales se borran en un plazo de 30 días. Los metadatos de uso anonimizados pueden
                conservarse hasta 2 años con fines de mejora del servicio, al no ser vinculables a ningún individuo.
                Los datos de facturación se retienen 7 años conforme a la normativa fiscal española.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-white/90 mb-3 uppercase tracking-wide">
                6. Contacto
              </h3>
              <p>
                Para cualquier consulta relacionada con privacidad, puede contactar a nuestro Delegado de Protección
                de Datos en dpo@kognt.io. También puede presentar una reclamación ante la Agencia Española de
                Protección de Datos (AEPD) en www.aepd.es si considera que el tratamiento de sus datos no cumple
                con la normativa vigente.
              </p>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
}
