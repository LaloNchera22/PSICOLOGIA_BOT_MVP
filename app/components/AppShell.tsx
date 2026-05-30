"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useTheme } from "./ThemeProvider";

export type UserRole = "user" | "clinico";

export interface AppUser {
  name: string;
  email: string;
  role: UserRole;
}

interface AppShellProps {
  user: AppUser;
  children: React.ReactNode;
}

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

const StarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const CardIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
    <line x1="1" y1="10" x2="23" y2="10" />
  </svg>
);

const ConfigIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
  </svg>
);

export function AppShell({ user, children }: AppShellProps) {
  return (
    <div className="app-shell shell-mounted">
      {/* Subtle ambient background */}
      <div className="shell-blob shell-blob-1" />
      <div className="shell-blob shell-blob-2" />

      {/* Main content area */}
      <main className="app-main">{children}</main>
    </div>
  );
}

/* ── Config menu (gear button + dropdown) for page headers ── */
export function ConfigMenu({ user }: { user: AppUser }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const firstName = (user.name || "").split(" ")[0] || "—";
  const rawInitials = (user.name || user.email || "??").replace(/\s+/g, "").slice(0, 2).toUpperCase();
  const roleLabel = user.role === "clinico" ? "Clínico" : "Usuario";

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  async function signOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  }

  async function manageBilling() {
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (res.ok && data.url) {
        window.location.href = data.url;
      } else if (data.error === "no_customer") {
        // Sin suscripción todavía: llevar a precios.
        router.push("/precios");
      }
    } catch {
      router.push("/precios");
    }
  }

  return (
    <div className="config-menu" ref={menuRef}>
      <button
        className="config-btn"
        onClick={() => setOpen((o) => !o)}
        aria-label="Configuración"
        aria-expanded={open}
        title="Configuración"
      >
        <ConfigIcon />
      </button>

      {open && (
        <div className="config-dropdown" role="menu">
          <div className="config-user">
            <div className="config-avatar">{rawInitials}</div>
            <div className="config-user-info">
              <div className="config-user-name">{firstName}</div>
              <div className="config-user-role">{roleLabel}</div>
            </div>
          </div>
          <Link href="/precios" className="config-item" role="menuitem" onClick={() => setOpen(false)}>
            <StarIcon />
            <span>Mejorar a Pro</span>
          </Link>
          <button className="config-item" onClick={manageBilling} role="menuitem">
            <CardIcon />
            <span>Gestionar suscripción</span>
          </button>
          <button className="config-item config-signout" onClick={signOut} role="menuitem">
            <LogoutIcon />
            <span>Cerrar sesión</span>
          </button>
        </div>
      )}
    </div>
  );
}

/* ── Header logo ── */
export function HeaderLogo() {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? "/logo-white.png" : "/logo-dark.png";
  return (
    <Image src={logoSrc} alt="KOGNT" width={92} height={28} className="header-logo object-contain" priority />
  );
}
