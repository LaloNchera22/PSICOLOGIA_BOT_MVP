import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// Stripe necesita el cuerpo crudo para verificar la firma.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ACTIVE = ["active", "trialing"];

async function syncSubscription(sub: Stripe.Subscription, userIdHint?: string | null) {
  const admin = createAdminClient();
  const customerId =
    typeof sub.customer === "string" ? sub.customer : sub.customer.id;
  const status = sub.status;
  const plan = ACTIVE.includes(status) ? "pro" : "free";
  const periodEnd = sub.current_period_end
    ? new Date(sub.current_period_end * 1000).toISOString()
    : null;

  const update = {
    plan,
    subscription_status: status,
    stripe_customer_id: customerId,
    stripe_subscription_id: sub.id,
    current_period_end: periodEnd,
  };

  // Localiza el perfil por user_id (metadata) o por customer.
  const userId = userIdHint ?? (sub.metadata?.user_id as string | undefined);
  if (userId) {
    await admin.from("profiles").update(update).eq("id", userId);
  } else {
    await admin.from("profiles").update(update).eq("stripe_customer_id", customerId);
  }
}

export async function POST(req: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "missing webhook secret" }, { status: 500 });
  }

  const sig = req.headers.get("stripe-signature");
  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(payload, sig ?? "", secret);
  } catch (e: any) {
    return NextResponse.json({ error: `invalid signature: ${e.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id ?? session.metadata?.user_id ?? null;
        const customerId =
          typeof session.customer === "string" ? session.customer : session.customer?.id;

        // Guarda el customer en el perfil y sincroniza la suscripción.
        if (userId && customerId) {
          const admin = createAdminClient();
          await admin
            .from("profiles")
            .update({ stripe_customer_id: customerId })
            .eq("id", userId);
        }
        if (session.subscription) {
          const subId =
            typeof session.subscription === "string"
              ? session.subscription
              : session.subscription.id;
          const sub = await getStripe().subscriptions.retrieve(subId);
          await syncSubscription(sub, userId);
        }
        break;
      }
      case "customer.subscription.created":
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await syncSubscription(sub);
        break;
      }
      default:
        break;
    }
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "handler error" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
