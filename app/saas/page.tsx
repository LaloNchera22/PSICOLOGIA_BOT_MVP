import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { normalizeRole, homeForRole } from "@/lib/portal";

// /saas is just a role-based entry point into the professional portal.
export default async function SaasIndex() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");
  redirect(homeForRole(normalizeRole(user.user_metadata?.role)));
}
