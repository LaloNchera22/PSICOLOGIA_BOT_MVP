import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/ThemeProvider";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "KOGNT — a place to talk",
  description: "A calm space to talk freely.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{
  var t=localStorage.getItem('kognt-theme');
  if(t==='dark')document.documentElement.classList.add('dark');
  var supported=['en','es','pt','fr','de','it'];
  var l=(navigator.language||'en').split('-')[0].toLowerCase();
  document.documentElement.setAttribute('lang',supported.indexOf(l)>=0?l:'en');
}catch(e){}})()`,
          }}
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
