import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import CorporativoView from "./CorporativoView";
import { normalizeRole } from "@/lib/portal";

export default async function CorporativoPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  // Only company accounts reach the corporate dashboard.
  const role = normalizeRole(user.user_metadata?.role);
  if (role !== "empresa") redirect("/saas");

  return <CorporativoView />;
}
