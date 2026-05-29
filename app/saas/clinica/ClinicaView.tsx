"use client";

import { SaasMenuBtn } from "@/app/components/SaasShell";
import { ThemeToggle } from "@/app/components/ThemeProvider";

interface PatientRow {
  patientId: string;
  fullName: string;
  lastSession: string;
  riskScore: number;
  status: "activo" | "en-pausa" | "alta";
  nextAppointment: string | null;
}

interface AppointmentSlot {
  appointmentId: string;
  patientName: string;
  date: string;
  startTime: string;
  endTime: string;
  sessionType: "inicial" | "seguimiento" | "crisis";
}

const DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"];
const DAYS_FULL = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

function RiskBadge({ score }: { score: number }) {
  const color = score <= 3 ? "#22c55e" : score <= 6 ? "#eab308" : "#ef4444";
  const label = score <= 3 ? "Bajo" : score <= 6 ? "Medio" : "Alto";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div className="risk-dot" style={{ background: color, boxShadow: `0 0 8px ${color}80` }} />
      <span style={{ fontFamily: "monospace", fontSize: "0.82rem", color: "var(--fg-2)" }}>{score}/10</span>
      <span
        style={{
          fontSize: "0.65rem",
          padding: "1px 6px",
          borderRadius: 20,
          color,
          border: `1px solid ${color}60`,
          background: `${color}15`,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function StatusBadge({ status }: { status: PatientRow["status"] }) {
  const map = {
    activo: { color: "#22c55e", label: "Activo" },
    "en-pausa": { color: "#eab308", label: "En pausa" },
    alta: { color: "var(--fg-muted)", label: "Alta" },
  };
  const s = map[status];
  return (
    <span className="status-badge" style={{ color: s.color, border: `1px solid ${s.color}50`, background: `${s.color}12` }}>
      {s.label}
    </span>
  );
}

function sessionColor(type: AppointmentSlot["sessionType"]): string {
  switch (type) {
    case "seguimiento":
      return "var(--accent)";
    case "crisis":
      return "#ef4444";
    case "inicial":
      return "var(--accent-2)";
  }
}

export default function ClinicaView({
  patients,
  appointments,
}: {
  patients: PatientRow[];
  appointments: AppointmentSlot[];
}) {
  const riskHighCount = patients.filter((p) => p.riskScore > 6).length;
  const activeCount = patients.filter((p) => p.status === "activo").length;

  return (
    <>
      {/* Mobile top bar */}
      <div className="page-topbar">
        <SaasMenuBtn />
        <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--fg)" }}>Panel Clínico</span>
        <div style={{ marginLeft: "auto" }}>
          <ThemeToggle />
        </div>
      </div>

      <div className="page-scroll">
        <div className="page-header">
          <p className="page-section-label">Panel Clínico · KOGNT Pro</p>
          <h1 className="page-title">Pacientes</h1>
        </div>

        {patients.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
              gap: 12,
              marginBottom: 32,
              maxWidth: 600,
            }}
          >
            {[
              { label: "Pacientes activos", value: activeCount, color: "#22c55e" },
              { label: "Riesgo alto", value: riskHighCount, color: "#ef4444" },
              { label: "Total", value: patients.length, color: "var(--accent)" },
            ].map((kpi) => (
              <div key={kpi.label} className="acid-panel" style={{ padding: "16px 20px" }}>
                <p style={{ fontSize: "1.8rem", fontWeight: 800, color: kpi.color, letterSpacing: "-0.03em" }}>{kpi.value}</p>
                <p style={{ fontSize: "0.72rem", color: "var(--fg-muted)", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>
                  {kpi.label}
                </p>
              </div>
            ))}
          </div>
        )}

        {patients.length === 0 ? (
          <div className="acid-panel" style={{ padding: 40, textAlign: "center" }}>
            <p style={{ color: "var(--fg-muted)", fontSize: "0.9rem" }}>No tienes pacientes registrados.</p>
          </div>
        ) : (
          <div className="acid-panel" style={{ overflow: "hidden", marginBottom: 40 }}>
            <div style={{ overflowX: "auto" }}>
              <table className="acid-table">
                <thead>
                  <tr>
                    <th>Paciente</th>
                    <th>Última sesión</th>
                    <th>Riesgo</th>
                    <th>Estado</th>
                    <th>Próxima cita</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p) => (
                    <tr key={p.patientId}>
                      <td>
                        <span style={{ fontWeight: 600, color: "var(--fg)" }}>{p.fullName}</span>
                        <span style={{ display: "block", fontSize: "0.7rem", fontFamily: "monospace", color: "var(--fg-muted)", marginTop: 2 }}>
                          {p.patientId}
                        </span>
                      </td>
                      <td style={{ fontFamily: "monospace" }}>{p.lastSession}</td>
                      <td>
                        <RiskBadge score={p.riskScore} />
                      </td>
                      <td>
                        <StatusBadge status={p.status} />
                      </td>
                      <td style={{ fontFamily: "monospace" }}>
                        {p.nextAppointment ?? <span style={{ color: "var(--fg-muted)" }}>—</span>}
                      </td>
                      <td>
                        <button className="action-btn">Ver</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div>
          <p className="page-section-label" style={{ marginBottom: 8 }}>Agenda</p>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--fg)", marginBottom: 20, letterSpacing: "-0.02em" }}>
            Semana actual
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
            {DAYS_FULL.map((day, idx) => {
              const dayAppts = appointments.filter((a) => a.date === day);
              return (
                <div key={day} className="schedule-day">
                  <div className="schedule-day-header">
                    <p className="schedule-day-label">{DAYS[idx]}</p>
                  </div>
                  <div style={{ padding: 6 }}>
                    {dayAppts.length === 0 ? (
                      <p style={{ color: "var(--fg-muted)", fontSize: "0.7rem", padding: "6px 4px", opacity: 0.5 }}>Libre</p>
                    ) : (
                      dayAppts.map((appt) => (
                        <div key={appt.appointmentId} className="schedule-appt" style={{ borderLeft: `3px solid ${sessionColor(appt.sessionType)}` }}>
                          <p style={{ fontWeight: 600, fontSize: "0.78rem", color: "var(--fg)", lineHeight: 1.3 }}>{appt.patientName}</p>
                          <p style={{ fontSize: "0.68rem", fontFamily: "monospace", color: "var(--fg-muted)", marginTop: 2 }}>
                            {appt.startTime}–{appt.endTime}
                          </p>
                          <p style={{ fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: "0.1em", color: sessionColor(appt.sessionType), marginTop: 3, fontWeight: 700 }}>
                            {appt.sessionType}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
