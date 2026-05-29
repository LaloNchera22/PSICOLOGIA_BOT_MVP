"use client";

import React, { useState } from "react";

// ── Types ──────────────────────────────────────────────────────────────
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

// ── Static mock data ───────────────────────────────────────────────────
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

// ── Helpers ────────────────────────────────────────────────────────────
function burnoutRiskColor(risk: DeptRow["burnoutRisk"]) {
  switch (risk) {
    case "alto":
      return "text-red-400";
    case "medio":
      return "text-yellow-400";
    case "bajo":
      return "text-green-400";
  }
}

// ── Component ──────────────────────────────────────────────────────────
export default function CorporativoPage() {
  // State kept for potential future interactivity; chart data is static
  const [_activeTab] = useState(0);

  return (
    <div className="bg-black min-h-screen px-6 py-10">
      <div className="max-w-7xl mx-auto space-y-14">

        {/* Page header */}
        <div>
          <p
            className="text-xs uppercase tracking-widest font-semibold mb-2"
            style={{ color: "var(--accent)" }}
          >
            B2B
          </p>
          <h1 className="text-5xl font-bold text-white tracking-tight">
            DASHBOARD CORPORATIVO
          </h1>
          <p className="text-white/40 text-sm mt-3">
            Métricas anónimas y agregadas — datos de empleados anonimizados
          </p>
        </div>

        {/* ── KPI row ──────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {kpis.map((kpi) => (
            <div key={kpi.label} className="brutal-card">
              <p className="text-xs uppercase tracking-widest text-white/40 mb-3">
                {kpi.label}
              </p>
              <p className="text-4xl font-bold text-white mb-2">{kpi.value}</p>
              <p
                className={`text-sm font-semibold ${
                  kpi.trend === "up" ? "text-green-400" : "text-red-400"
                }`}
              >
                {kpi.trend === "up" ? "▲" : "▼"} {kpi.delta}
              </p>
            </div>
          ))}
        </div>

        {/* ── Charts row ───────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* LEFT: Stress bar chart */}
          <div className="brutal-card">
            <p
              className="text-xs uppercase tracking-widest font-semibold mb-6"
              style={{ color: "var(--accent)" }}
            >
              Distribución Estrés — Últimas 4 Semanas
            </p>
            <div className="flex items-end gap-4 h-40">
              {stressBarData.map((bar) => (
                <div key={bar.week} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full"
                    style={{
                      height: `${bar.height}%`,
                      backgroundColor: "var(--accent)",
                      minHeight: "4px",
                    }}
                  />
                  <p className="text-white/40 text-xs font-mono">{bar.week}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-3 border-t border-white/10 pt-3">
              <span className="text-white/20 text-xs font-mono">0%</span>
              <span className="text-white/20 text-xs font-mono">100%</span>
            </div>
          </div>

          {/* RIGHT: Burnout horizontal bar chart */}
          <div className="brutal-card">
            <p
              className="text-xs uppercase tracking-widest font-semibold mb-6"
              style={{ color: "var(--accent)" }}
            >
              Categorías de Burnout
            </p>
            <div className="space-y-3">
              {burnoutCategories.map((cat) => (
                <div key={cat.name} className="flex items-center gap-3">
                  <p className="text-white/60 text-xs w-28 flex-shrink-0">{cat.name}</p>
                  <div className="flex-1 bg-white/5 h-4 relative">
                    <div
                      className="h-full"
                      style={{
                        width: `${cat.pct}%`,
                        backgroundColor: "var(--accent)",
                      }}
                    />
                  </div>
                  <p className="text-white/40 text-xs font-mono w-8 text-right flex-shrink-0">
                    {cat.pct}%
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Departments table ─────────────────────────────── */}
        <div>
          <p
            className="text-xs uppercase tracking-widest font-semibold mb-2"
            style={{ color: "var(--accent)" }}
          >
            Foco
          </p>
          <h2 className="text-3xl font-bold text-white tracking-tight mb-6">
            DEPARTAMENTOS EN FOCO
          </h2>

          <div className="border border-white/10">
            <table className="w-full brutal-table">
              <thead>
                <tr>
                  <th>Departamento</th>
                  <th>Empleados</th>
                  <th>Bienestar Medio</th>
                  <th>Riesgo Burnout</th>
                </tr>
              </thead>
              <tbody>
                {depts.map((dept) => (
                  <tr key={dept.deptId}>
                    <td>
                      <span className="text-white font-medium">{dept.deptName}</span>
                      <span className="block text-white/30 text-xs font-mono">{dept.deptId}</span>
                    </td>
                    <td className="font-mono text-white/60">{dept.employeeCount}</td>
                    <td className="font-mono text-white/60">{dept.avgWellbeingScore} / 10</td>
                    <td>
                      <span
                        className={`text-xs uppercase tracking-wide font-semibold ${burnoutRiskColor(
                          dept.burnoutRisk
                        )}`}
                      >
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
  );
}
