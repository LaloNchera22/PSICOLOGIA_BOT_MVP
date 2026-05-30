import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { FREE_DAILY_LIMIT, FREE_WINDOW_MS, isProProfile } from "@/lib/plan";

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { data: profile } = await supabase
    .from("profiles")
    .select("plan, subscription_status")
    .eq("id", user.id)
    .single();

  const isPro = isProProfile(profile);
  if (isPro) {
    return NextResponse.json({ plan: "pro", remaining: null, limit: null });
  }

  const since = new Date(Date.now() - FREE_WINDOW_MS).toISOString();
  const { count } = await supabase
    .from("messages")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("role", "user")
    .gte("created_at", since);

  return NextResponse.json({
    plan: "free",
    limit: FREE_DAILY_LIMIT,
    remaining: Math.max(0, FREE_DAILY_LIMIT - (count ?? 0)),
  });
}
