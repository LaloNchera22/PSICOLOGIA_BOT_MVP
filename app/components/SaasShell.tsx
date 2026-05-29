"use client";

import { createContext, useContext, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle, useTheme } from "./ThemeProvider";
import type { AppUser } from "./AppShell";

/**
 * SaaS portal shell — used by /saas/* (clinical + corporate).
 * Visually distinct from the consumer AppShell (PRO badge, professional
 * labels) and intentionally exposes NO links back to the consumer product.
 */

interface SaasSidebarCtx {
  openSidebar: () => void;
}
const Ctx = createContext<SaasSidebarCtx>({ openSidebar: () => {} });

const PatientsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ChartIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const NAV_ITEMS: {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles: AppUser["role"][];
}[] = [
  { href: "/saas/clinica", label: "Pacientes", icon: <PatientsIcon />, roles: ["clinico"] },
  { href: "/saas/corporativo", label: "Corporativo", icon: <ChartIcon />, roles: ["empresa"] },
];

export function SaasShell({ user, children }: { user: AppUser; children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const visibleItems = NAV_ITEMS.filter((i) => i.roles.includes(user.role));
  const firstName = (user.name || "").split(" ")[0] || "—";
  const initials = (user.name || user.email || "??").replace(/\s+/g, "").slice(0, 2).toUpperCase();
  const logoSrc = theme === "dark" ? "/logo-white.png" : "/logo-dark.png";
  const roleLabel = user.role === "empresa" ? "Empresa" : "Profesional";

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <Ctx.Provider value={{ openSidebar: () => setSidebarOpen(true) }}>
      <div className="app-shell">
        <div className="shell-blob shell-blob-1" />
        <div className="shell-blob shell-blob-2" />
        <div className="shell-blob shell-blob-3" />

        {sidebarOpen && <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />}

        <aside className={`app-sidebar${sidebarOpen ? " sidebar-open" : ""}`}>
          <div className="sidebar-logo" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Image src={logoSrc} alt="KOGNT" width={80} height={24} className="object-contain" />
            <span className="saas-badge">PRO</span>
          </div>

          <nav className="sidebar-nav">
            {visibleItems.map((item) => {
              const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-nav-item${isActive ? " sidebar-nav-active" : ""}`}
                  onClick={() => setSidebarOpen(false)}
                >
                  <span className="sidebar-nav-icon">{item.icon}</span>
                  <span className="sidebar-nav-label">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="sidebar-footer">
            <div className="sidebar-user">
              <div className="sidebar-avatar">{initials}</div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{firstName}</div>
                <div className="sidebar-user-role">{roleLabel}</div>
              </div>
            </div>
            <div className="sidebar-actions">
              <ThemeToggle />
              <button className="sidebar-signout" onClick={signOut} title="Cerrar sesión" aria-label="Cerrar sesión">
                <LogoutIcon />
              </button>
            </div>
          </div>
        </aside>

        <main className="app-main">{children}</main>

        <nav className="mobile-bottom-nav" aria-label="Navegación SaaS">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href} className={`mobile-nav-item${isActive ? " mobile-nav-active" : ""}`}>
                {item.icon}
                <span className="mobile-nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </Ctx.Provider>
  );
}

export function SaasMenuBtn() {
  const { openSidebar } = useContext(Ctx);
  return (
    <button className="mobile-menu-btn" onClick={openSidebar} aria-label="Abrir menú">
      <MenuIcon />
    </button>
  );
}
