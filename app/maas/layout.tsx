import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "KOGNT MaaS — Model as a Service",
  description: "Integra el motor de triaje emocional de KOGNT en tus propias aplicaciones vía API.",
};

export default function MaasLayout({ children }: { children: React.ReactNode }) {
  return children;
}
