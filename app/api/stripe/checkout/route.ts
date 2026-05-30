import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getStripe, priceIdFor, appUrl } from "@/lib/stripe";
import { PRICING } from "@/lib/plan";

export async function POST(req: Request) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const interval: "monthly" | "annual" =
    body?.interval === "annual" ? "annual" : "monthly";

  let stripe;
  let price;
  try {
    stripe = getStripe();
    price = priceIdFor(interval);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }

  // Reutiliza el customer si ya existe.
  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  // 3 días de prueba solo para el plan anual.
  const trialDays =
    interval === "annual" ? PRICING.annual.trialDays : undefined;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      client_reference_id: user.id,
      customer: profile?.stripe_customer_id || undefined,
      customer_email: profile?.stripe_customer_id ? undefined : user.email || undefined,
      subscription_data: trialDays ? { trial_period_days: trialDays } : undefined,
      metadata: { user_id: user.id, interval },
      allow_promotion_codes: true,
      success_url: `${appUrl()}/chat?upgraded=1`,
      cancel_url: `${appUrl()}/precios?canceled=1`,
    });

    return NextResponse.json({ url: session.url });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "stripe error" }, { status: 500 });
  }
}
