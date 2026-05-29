"use client";

import { SaasMenuBtn } from "@/app/components/SaasShell";
import { ThemeToggle } from "@/app/components/ThemeProvider";

interface KpiCard {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down";
}

interface DeptRow {
  deptId: string;
  deptName: string;
  employeeCount: number;
  avgWellbeingScore: number;
  burnoutRisk: "alto" | "medio" | "bajo";
}

const kpis: KpiCard[] = [
  { label: "Índice Bienestar", value: "67%", delta: "+3%", trend: "up" },
  { label: "Riesgo Burnout Alto", value: "12%", delta: "-2%", trend: "down" },
  { label: "Usuarios Activos", value: "234", delta: "+18", trend: "up" },
  { label: "Sesiones Esta Semana", value: "1.2k", delta: "+156", trend: "up" },
];

const depts: DeptRow[] = [
  { deptId: "d-1", deptName: "Ingeniería", employeeCount: 45, avgWellbeingScore: 6.2, burnoutRisk: "alto" },
  { deptId: "d-2", deptName: "Ventas", employeeCount: 32, avgWellbeingScore: 5.8, burnoutRisk: "alto" },
  { deptId: "d-3", deptName: "Operaciones", employeeCount: 28, avgWellbeingScore: 7.1, burnoutRisk: "medio" },
  { deptId: "d-4", deptName: "Marketing", employeeCount: 19, avgWellbeingScore: 7.8, burnoutRisk: "bajo" },
];

const stressBarData = [
  { week: "Sem 1", height: 40 },
  { week: "Sem 2", height: 55 },
  { week: "Sem 3", height: 48 },
  { week: "Sem 4", height: 62 },
];

const burnoutCategories = [
  { name: "Carga laboral", pct: 72 },
  { name: "Falta control", pct: 45 },
  { name: "Reconocimiento", pct: 38 },
  { name: "Comunidad", pct: 61 },
  { name: "Equidad", pct: 29 },
  { name: "Valores", pct: 52 },
];

function burnoutRiskColor(risk: DeptRow["burnoutRisk"]) {
  switch (risk) {
    case "alto":
      return "#ef4444";
    case "medio":
      return "#eab308";
    case "bajo":
      return "#22c55e";
  }
}

export default function CorporativoView() {
  return (
    <>
      {/* Mobile top bar */}
      <div className="page-topbar">
        <SaasMenuBtn />
        <span style={{ fontSize: "0.9rem", fontWeight: 600, color: "var(--fg)" }}>Corporativo</span>
        <div style={{ marginLeft: "auto" }}>
          <ThemeToggle />
        </div>
      </div>

      <div className="page-scroll">
        <div className="page-header">
          <p className="page-section-label">Dashboard B2B · KOGNT Pro</p>
          <h1 className="page-title">Bienestar corporativo</h1>
          <p style={{ color: "var(--fg-muted)", fontSize: "0.875rem", marginTop: 10 }}>
            Métricas anónimas y agregadas — los datos individuales nunca son identificables.
          </p>
        </div>

        {/* KPI row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 32 }}>
          {kpis.map((kpi) => (
            <div key={kpi.label} className="acid-panel" style={{ padding: "20px 22px" }}>
              <p style={{ fontSize: "0.68rem", textTransform: "uppercase", letterSpacing: "0.14em", color: "var(--fg-muted)", marginBottom: 10, fontWeight: 600 }}>
                {kpi.label}
              </p>
              <p style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--fg)", letterSpacing: "-0.03em", lineHeight: 1 }}>{kpi.value}</p>
              <p style={{ fontSize: "0.82rem", fontWeight: 700, marginTop: 8, color: kpi.trend === "up" ? "#22c55e" : "#ef4444" }}>
                {kpi.trend === "up" ? "▲" : "▼"} {kpi.delta}
              </p>
            </div>
          ))}
        </div>

        {/* Charts row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 40 }}>
          {/* Stress bars */}
          <div className="acid-panel" style={{ padding: 24 }}>
            <p className="page-section-label" style={{ marginBottom: 22 }}>Distribución estrés · últimas 4 semanas</p>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 16, height: 160 }}>
              {stressBarData.map((bar) => (
                <div key={bar.week} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div style={{ width: "100%", height: `${bar.height}%`, minHeight: 4, background: "var(--accent)", borderRadius: "6px 6px 0 0", boxShadow: "0 0 16px var(--accent-glow)" }} />
                  <p style={{ color: "var(--fg-muted)", fontSize: "0.7rem", fontFamily: "monospace" }}>{bar.week}</p>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, borderTop: "1px solid var(--border)", paddingTop: 10 }}>
              <span style={{ color: "var(--fg-muted)", fontSize: "0.7rem", fontFamily: "monospace" }}>0%</span>
              <span style={{ color: "var(--fg-muted)", fontSize: "0.7rem", fontFamily: "monospace" }}>100%</span>
            </div>
          </div>

          {/* Burnout categories */}
          <div className="acid-panel" style={{ padding: 24 }}>
            <p className="page-section-label" style={{ marginBottom: 22 }}>Categorías de burnout</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {burnoutCategories.map((cat) => (
                <div key={cat.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <p style={{ color: "var(--fg-2)", fontSize: "0.78rem", width: 110, flexShrink: 0 }}>{cat.name}</p>
                  <div style={{ flex: 1, background: "var(--input-bg)", height: 10, borderRadius: 6, overflow: "hidden" }}>
                    <div style={{ width: `${cat.pct}%`, height: "100%", background: "var(--accent)", borderRadius: 6 }} />
                  </div>
                  <p style={{ color: "var(--fg-muted)", fontSize: "0.72rem", fontFamily: "monospace", width: 34, textAlign: "right", flexShrink: 0 }}>{cat.pct}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Departments table */}
        <div>
          <p className="page-section-label" style={{ marginBottom: 8 }}>Foco</p>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 700, color: "var(--fg)", marginBottom: 20, letterSpacing: "-0.02em" }}>
            Departamentos en foco
          </h2>

          <div className="acid-panel" style={{ overflow: "hidden" }}>
            <div style={{ overflowX: "auto" }}>
              <table className="acid-table">
                <thead>
                  <tr>
                    <th>Departamento</th>
                    <th>Empleados</th>
                    <th>Bienestar medio</th>
                    <th>Riesgo burnout</th>
                  </tr>
                </thead>
                <tbody>
                  {depts.map((dept) => (
                    <tr key={dept.deptId}>
                      <td>
                        <span style={{ fontWeight: 600, color: "var(--fg)" }}>{dept.deptName}</span>
                        <span style={{ display: "block", fontSize: "0.7rem", fontFamily: "monospace", color: "var(--fg-muted)", marginTop: 2 }}>{dept.deptId}</span>
                      </td>
                      <td style={{ fontFamily: "monospace" }}>{dept.employeeCount}</td>
                      <td style={{ fontFamily: "monospace" }}>{dept.avgWellbeingScore} / 10</td>
                      <td>
                        <span style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700, color: burnoutRiskColor(dept.burnoutRisk) }}>
                          {dept.burnoutRisk}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
