import type { Metadata } from "next";
import { Caveat } from "next/font/google";
import "./globals.css";

const cursive = Caveat({
  subsets: ["latin"],
  variable: "--font-cursive",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Psicología — espacio para conversar",
  description: "Un espacio tranquilo para conversar.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={cursive.variable}>
      <body>{children}</body>
    </html>
  );
}
