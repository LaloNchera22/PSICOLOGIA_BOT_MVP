import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ChatView from "./ChatView";

export default async function ChatPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/");

  const { data: messages } = await supabase
    .from("messages")
    .select("id, role, content, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: true });

  return (
    <ChatView
      userName={(user.user_metadata?.full_name as string) || user.email || ""}
      initialMessages={messages ?? []}
    />
  );
}
