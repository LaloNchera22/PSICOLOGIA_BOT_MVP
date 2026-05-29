import React from "react";

// ── Types ──────────────────────────────────────────────────────────────
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

// ── Static mock data ───────────────────────────────────────────────────
const patients: PatientRow[] = [
  { patientId: "p-001", fullName: "Ana García", lastSession: "2024-01-15", riskScore: 3, status: "activo", nextAppointment: "2024-01-22" },
  { patientId: "p-002", fullName: "Carlos Mendez", lastSession: "2024-01-10", riskScore: 7, status: "activo", nextAppointment: "2024-01-17" },
  { patientId: "p-003", fullName: "Laura Vásquez", lastSession: "2024-01-08", riskScore: 2, status: "en-pausa", nextAppointment: null },
  { patientId: "p-004", fullName: "Roberto Kim", lastSession: "2023-12-20", riskScore: 5, status: "activo", nextAppointment: "2024-01-19" },
  { patientId: "p-005", fullName: "Sofía Torres", lastSession: "2024-01-12", riskScore: 1, status: "alta", nextAppointment: null },
];

const appointments: AppointmentSlot[] = [
  { appointmentId: "a-001", patientName: "Ana García", date: "Lunes", startTime: "09:00", endTime: "10:00", sessionType: "seguimiento" },
  { appointmentId: "a-002", patientName: "Carlos Mendez", date: "Martes", startTime: "15:00", endTime: "16:00", sessionType: "crisis" },
  { appointmentId: "a-003", patientName: "Roberto Kim", date: "Jueves", startTime: "11:00", endTime: "12:00", sessionType: "seguimiento" },
];

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

// ── Helpers ────────────────────────────────────────────────────────────
function riskDot(score: number) {
  if (score <= 3) return "bg-green-500";
  if (score <= 6) return "bg-yellow-400";
  return "bg-red-500";
}

function statusBadge(status: PatientRow["status"]) {
  const map = {
    activo: "text-green-400",
    "en-pausa": "text-yellow-400",
    alta: "text-white/40",
  };
  return map[status];
}

function sessionTypeColor(type: AppointmentSlot["sessionType"]): string {
  switch (type) {
    case "seguimiento":
      return "var(--accent)";
    case "crisis":
      return "#ef4444";
    case "inicial":
      return "#ffffff";
  }
}

// ── Component ──────────────────────────────────────────────────────────
export default function ClinicaPage() {
  return (
    <div className="bg-black min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-14">

        {/* Page header */}
        <div>
          <p
            className="text-xs uppercase tracking-widest font-semibold mb-2"
            style={{ color: "var(--accent)" }}
          >
            Panel Clínico
          </p>
          <h1 className="text-5xl font-bold text-white tracking-tight">PACIENTES</h1>
        </div>

        {/* ── Patients table ─────────────────────────────── */}
        <div className="border border-white/10">
          <table className="w-full brutal-table">
            <thead>
              <tr>
                <th>Paciente</th>
                <th>Última Sesión</th>
                <th>Riesgo</th>
                <th>Estado</th>
                <th>Próxima Cita</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.patientId}>
                  <td>
                    <span className="text-white font-medium">{p.fullName}</span>
                    <span className="block text-white/30 text-xs font-mono">{p.patientId}</span>
                  </td>
                  <td className="font-mono text-white/60">{p.lastSession}</td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 ${riskDot(p.riskScore)}`} />
                      <span className="font-mono">{p.riskScore}/10</span>
                    </div>
                  </td>
                  <td>
                    <span className={`text-xs uppercase tracking-wide font-semibold ${statusBadge(p.status)}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="font-mono text-white/60">
                    {p.nextAppointment ?? <span className="text-white/20">—</span>}
                  </td>
                  <td>
                    <button className="border border-white/20 text-white/60 px-3 py-1 text-xs hover:border-accent hover:text-accent transition-colors"
                      style={{ ["--tw-hover-border-color" as string]: "var(--accent)" }}>
                      Ver
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Agenda section ─────────────────────────────── */}
        <div>
          <p
            className="text-xs uppercase tracking-widest font-semibold mb-2"
            style={{ color: "var(--accent)" }}
          >
            Agenda
          </p>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-8">
            AGENDA — SEMANA ACTUAL
          </h2>

          {/* 7-day grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {DAYS.map((day) => {
              const dayAppts = appointments.filter((a) => a.date === day);
              return (
                <div key={day} className="border border-white/10 bg-black min-h-[140px]">
                  <div className="border-b border-white/10 px-3 py-2">
                    <p className="text-xs text-white/40 uppercase tracking-widest font-semibold">{day}</p>
                  </div>
                  <div className="p-2 space-y-2">
                    {dayAppts.length === 0 ? (
                      <p className="text-white/15 text-xs px-1">—</p>
                    ) : (
                      dayAppts.map((appt) => (
                        <div
                          key={appt.appointmentId}
                          className="pl-2 py-2 pr-2"
                          style={{ borderLeft: `3px solid ${sessionTypeColor(appt.sessionType)}` }}
                        >
                          <p className="text-white text-xs font-semibold leading-tight">{appt.patientName}</p>
                          <p className="text-white/40 text-xs font-mono mt-0.5">
                            {appt.startTime}–{appt.endTime}
                          </p>
                          <p className="text-xs mt-0.5 uppercase tracking-wide" style={{ color: sessionTypeColor(appt.sessionType), fontSize: "0.6rem" }}>
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
    </div>
  );
}
