import Stripe from "stripe";

let _stripe: Stripe | null = null;

// Cliente Stripe perezoso para no romper el build si la key no está presente.
export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY no está configurada");
  _stripe = new Stripe(key);
  return _stripe;
}

// IDs de Price creados en el dashboard de Stripe.
export function priceIdFor(interval: "monthly" | "annual"): string {
  const id =
    interval === "annual"
      ? process.env.STRIPE_PRICE_ANNUAL
      : process.env.STRIPE_PRICE_MONTHLY;
  if (!id) throw new Error(`Falta el Price ID de Stripe para el plan ${interval}`);
  return id;
}

export function appUrl(): string {
  return process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
}
