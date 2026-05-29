import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ClinicaView from "./ClinicaView";
import { normalizeRole } from "@/lib/portal";

// Mock data — replace with real DB queries when schema includes patients
const MOCK_PATIENTS = [
  { patientId: "p-001", fullName: "Ana García", lastSession: "2024-01-15", riskScore: 3, status: "activo" as const, nextAppointment: "2024-01-22" },
  { patientId: "p-002", fullName: "Carlos Mendez", lastSession: "2024-01-10", riskScore: 7, status: "activo" as const, nextAppointment: "2024-01-17" },
  { patientId: "p-003", fullName: "Laura Vásquez", lastSession: "2024-01-08", riskScore: 2, status: "en-pausa" as const, nextAppointment: null },
  { patientId: "p-004", fullName: "Roberto Kim", lastSession: "2023-12-20", riskScore: 5, status: "activo" as const, nextAppointment: "2024-01-19" },
  { patientId: "p-005", fullName: "Sofía Torres", lastSession: "2024-01-12", riskScore: 1, status: "alta" as const, nextAppointment: null },
];

const MOCK_APPOINTMENTS = [
  { appointmentId: "a-001", patientName: "Ana García", date: "Lunes", startTime: "09:00", endTime: "10:00", sessionType: "seguimiento" as const },
  { appointmentId: "a-002", patientName: "Carlos Mendez", date: "Martes", startTime: "15:00", endTime: "16:00", sessionType: "crisis" as const },
  { appointmentId: "a-003", patientName: "Roberto Kim", date: "Jueves", startTime: "11:00", endTime: "12:00", sessionType: "seguimiento" as const },
];

export default async function ClinicaPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  // Only clinical professionals reach this surface.
  const role = normalizeRole(user.user_metadata?.role);
  if (role !== "clinico") redirect("/saas");

  return <ClinicaView patients={MOCK_PATIENTS} appointments={MOCK_APPOINTMENTS} />;
}
