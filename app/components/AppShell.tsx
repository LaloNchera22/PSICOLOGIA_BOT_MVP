"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { ThemeToggle, useTheme } from "./ThemeProvider";

export type UserRole = "user" | "clinico";

export interface AppUser {
  name: string;
  email: string;
  role: UserRole;
}

interface SidebarCtxValue {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
}

const SidebarCtx = createContext<SidebarCtxValue>({
  sidebarOpen: false,
  toggleSidebar: () => {},
});
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

const CloseIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const NAV_ITEMS: {
  href: string;
  label: string;
  icon: React.ReactNode;
  roles: UserRole[];
}[] = [
  { href: "/chat", label: "Chat", icon: <ChatIcon />, roles: ["user", "clinico"] },
];

const SIDEBAR_PREF_KEY = "kognt-sidebar-open";

export function AppShell({ user, children }: AppShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialise from viewport + stored preference (open on desktop, closed on mobile)
  useEffect(() => {
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    const stored = localStorage.getItem(SIDEBAR_PREF_KEY);
    setSidebarOpen(stored !== null ? stored === "true" : isDesktop);
    setMounted(true);
  }, []);

  function toggleSidebar() {
    setSidebarOpen((open) => {
      const next = !open;
      localStorage.setItem(SIDEBAR_PREF_KEY, String(next));
      return next;
    });
  }

  function closeSidebar() {
    setSidebarOpen(false);
    localStorage.setItem(SIDEBAR_PREF_KEY, "false");
  }

  const visibleItems = NAV_ITEMS.filter((item) => item.roles.includes(user.role));
  const firstName = (user.name || "").split(" ")[0] || "—";
  const rawInitials = (user.name || user.email || "??").replace(/\s+/g, "").slice(0, 2).toUpperCase();
  const logoSrc = theme === "dark" ? "/logo-white.png" : "/logo-dark.png";
  const roleLabel = user.role === "clinico" ? "Clínico" : "Usuario";

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <SidebarCtx.Provider value={{ sidebarOpen, toggleSidebar }}>
      <div className={`app-shell${sidebarOpen ? " shell-sidebar-open" : ""}${mounted ? " shell-mounted" : ""}`}>
        {/* Subtle ambient background */}
        <div className="shell-blob shell-blob-1" />
        <div className="shell-blob shell-blob-2" />

        {/* Mobile sidebar overlay */}
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
          aria-hidden={!sidebarOpen}
        />

        {/* Sidebar */}
        <aside className={`app-sidebar${sidebarOpen ? " sidebar-open" : ""}`}>
          <div className="sidebar-logo">
            <Image src={logoSrc} alt="KOGNT" width={84} height={26} className="object-contain" priority />
            <button
              className="sidebar-close"
              onClick={closeSidebar}
              aria-label="Cerrar menú"
              title="Cerrar menú"
            >
              <CloseIcon />
            </button>
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
                  onClick={() => {
                    if (window.matchMedia("(max-width: 767px)").matches) closeSidebar();
                  }}
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
        <main className="app-main">{children}</main>
      </div>
    </SidebarCtx.Provider>
  );
}

/* ── Menu toggle button (use inside page headers) ── */
export function MenuBtn() {
  const { toggleSidebar, sidebarOpen } = useSidebar();
  return (
    <button
      className="menu-btn"
      onClick={toggleSidebar}
      aria-label={sidebarOpen ? "Cerrar menú" : "Abrir menú"}
      aria-expanded={sidebarOpen}
    >
      <MenuIcon />
    </button>
  );
}

/* Backwards-compatible alias */
export const MobileMenuBtn = MenuBtn;
