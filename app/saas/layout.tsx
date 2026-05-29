import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SaasShell } from "@/app/components/SaasShell";
import { normalizeRole } from "@/lib/portal";
import type { AppUser } from "@/app/components/AppShell";

export const metadata: Metadata = {
  title: "KOGNT Pro — Portal profesional",
  description: "Suite clínica y de bienestar corporativo para profesionales y empresas.",
};

export default async function SaasLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const role = normalizeRole(user.user_metadata?.role);
  // Consumers never belong here — middleware also enforces this.
  if (role === "user") redirect("/chat");

  const appUser: AppUser = {
    name: (user.user_metadata?.full_name as string) || "",
    email: user.email || "",
    role,
  };

  return <SaasShell user={appUser}>{children}</SaasShell>;
}
