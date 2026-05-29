import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChatView from "./ChatView";
import type { AppUser } from "../components/AppShell";
import { normalizeRole } from "@/lib/portal";

export default async function ChatPage() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: messages } = await supabase
    .from("messages")
    .select("id, role, content, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  const appUser: AppUser = {
    name: (user.user_metadata?.full_name as string) || "",
    email: user.email || "",
    role: normalizeRole(user.user_metadata?.role),
  };

  return <ChatView user={appUser} initialMessages={messages ?? []} />;
}
