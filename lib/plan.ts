// Configuración central de planes y límites.

// Mensajes que un usuario FREE puede enviar dentro de una ventana de 24 h.
export const FREE_DAILY_LIMIT = 15;

// Ventana de reinicio del límite (24 horas) expresada en milisegundos.
export const FREE_WINDOW_MS = 24 * 60 * 60 * 1000;

export type Plan = "free" | "pro";

// Estados de Stripe que conceden acceso ilimitado (incluye periodo de prueba).
const ACTIVE_STATUSES = ["active", "trialing"];

export function isProProfile(profile: {
  plan?: string | null;
  subscription_status?: string | null;
} | null | undefined): boolean {
  if (!profile) return false;
  if (profile.plan !== "pro") return false;
  return ACTIVE_STATUSES.includes(profile.subscription_status ?? "");
}

// Precios (solo informativos para la UI; el cobro real lo define el Price de Stripe).
export const PRICING = {
  monthly: { amount: 5, currency: "USD", label: "Mensual" },
  annual: { amount: 49, currency: "USD", label: "Anual", trialDays: 3 },
} as const;

export type PlanInterval = keyof typeof PRICING;
