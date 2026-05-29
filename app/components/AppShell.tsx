"use client";

import { createContext, useContext, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle, useTheme } from "./ThemeProvider";

import type { Role } from "@/lib/portal";

export type UserRole = Role;

export interface AppUser {
  name: string;
  email: string;
  role: UserRole;
}

interface SidebarCtxValue {
  openSidebar: () => void;
}

const SidebarCtx = createContext<SidebarCtxValue>({ openSidebar: () => {} });
export const useSidebar = () => useContext(SidebarCtx);

interface AppShellProps {
  user: AppUser;
  children: React.ReactNode;
}

const ChatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const FaqIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

// Consumer portal navigation only. The SaaS and MaaS portals have their
// own shells — they are intentionally NOT reachable from here.
const NAV_ITEMS: {
  href: string;
  label: string;
  icon: React.ReactNode;
}[] = [
  { href: "/chat", label: "Chat", icon: <ChatIcon /> },
  { href: "/configuracion", label: "Ajustes", icon: <SettingsIcon /> },
  { href: "/faq", label: "FAQ", icon: <FaqIcon /> },
];

export function AppShell({ user, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const visibleItems = NAV_ITEMS;
  const firstName = (user.name || "").split(" ")[0] || "—";
  const rawInitials = (user.name || user.email || "??").replace(/\s+/g, "").slice(0, 2).toUpperCase();
  const logoSrc = theme === "dark" ? "/logo-white.png" : "/logo-dark.png";
  const roleLabel = "Usuario";

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <SidebarCtx.Provider value={{ openSidebar: () => setSidebarOpen(true) }}>
      <div className="app-shell">
        {/* Acid blur background blobs */}
        <div className="shell-blob shell-blob-1" />
        <div className="shell-blob shell-blob-2" />
        <div className="shell-blob shell-blob-3" />

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside className={`app-sidebar${sidebarOpen ? " sidebar-open" : ""}`}>
          <div className="sidebar-logo">
            <Image src={logoSrc} alt="KOGNT" width={80} height={24} className="object-contain" />
          </div>

          <nav className="sidebar-nav">
            {visibleItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href !== "/chat" && pathname.startsWith(item.href + "/"));
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
              <div className="sidebar-avatar">{rawInitials}</div>
              <div className="sidebar-user-info">
                <div className="sidebar-user-name">{firstName}</div>
                <div className="sidebar-user-role">{roleLabel}</div>
              </div>
            </div>
            <div className="sidebar-actions">
              <ThemeToggle />
              <button
                className="sidebar-signout"
                onClick={signOut}
                title="Cerrar sesión"
                aria-label="Cerrar sesión"
              >
                <LogoutIcon />
              </button>
            </div>
          </div>
        </aside>

        {/* Main content area */}
        <main className="app-main">
          {children}
        </main>

        {/* Mobile bottom nav */}
        <nav className="mobile-bottom-nav" aria-label="Navegación principal">
          {visibleItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mobile-nav-item${isActive ? " mobile-nav-active" : ""}`}
              >
                {item.icon}
                <span className="mobile-nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </SidebarCtx.Provider>
  );
}

/* ── Mobile menu button (use inside page headers) ── */
export function MobileMenuBtn() {
  const { openSidebar } = useSidebar();
  return (
    <button
      className="mobile-menu-btn"
      onClick={openSidebar}
      aria-label="Abrir menú"
    >
      <MenuIcon />
    </button>
  );
}
