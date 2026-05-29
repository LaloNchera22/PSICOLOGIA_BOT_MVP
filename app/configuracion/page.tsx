import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ConfigView from "./ConfigView";
import type { AppUser } from "../components/AppShell";

export default async function ConfiguracionPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  // Load profile data if available
  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const appUser: AppUser = {
    name:
      (user.user_metadata?.full_name as string) ||
      profile?.full_name ||
      "",
    email: user.email || "",
    role:
      (user.user_metadata?.role as AppUser["role"]) === "clinico"
        ? "clinico"
        : "user",
  };

  const initialName = appUser.name;
  const initialOccupation = (user.user_metadata?.occupation as string) || "";
  const initialCountry = (user.user_metadata?.country as string) || "ES";

  return (
    <ConfigView
      user={appUser}
      initialName={initialName}
      initialOccupation={initialOccupation}
      initialCountry={initialCountry}
    />
  );
}
