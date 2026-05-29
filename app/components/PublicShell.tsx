"use client";

import Link from "next/link";
import Image from "next/image";
import { ThemeToggle, useTheme } from "./ThemeProvider";

/**
 * Lightweight shell for public consumer information pages (FAQ, Legales).
 * Uses the same acid-blur design language as the landing — no brutalist
 * nav, no links to the SaaS / MaaS portals.
 */
export function PublicShell({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const logoSrc = theme === "dark" ? "/logo-white.png" : "/logo-dark.png";

  return (
    <div className="public-shell">
      <div className="shell-blob shell-blob-1" />
      <div className="shell-blob shell-blob-2" />

      <nav className="app-nav">
        <Link href="/" className="nav-brand" aria-label="Inicio">
          <Image src={logoSrc} alt="KOGNT" width={120} height={32} className="kognt-logo" priority />
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <ThemeToggle />
          <Link href="/" className="nav-link-btn">Volver</Link>
        </div>
      </nav>

      <main className="public-main">{children}</main>

      <footer className="public-footer">
        <Link href="/faq">FAQ</Link>
        <Link href="/legales">Legales</Link>
        <span>© {new Date().getFullYear()} KOGNT · Privacidad por diseño</span>
      </footer>
    </div>
  );
}
