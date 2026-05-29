/**
 * Portal separation logic — KOGNT
 * ---------------------------------
 * KOGNT is split into three completely independent portals:
 *
 *   - consumer ("personas"): the B2C product. Landing + chat + ajustes.
 *   - saas     ("profesionales/empresas"): clinical panel + corporate dashboard.
 *   - maas     ("desarrolladores"): the Model-as-a-Service API product.
 *
 * In production each portal is served from its own subdomain
 * (e.g. kognt.io, saas.kognt.io, maas.kognt.io) by setting
 * NEXT_PUBLIC_ROOT_DOMAIN. The middleware enforces that a consumer can
 * never reach the SaaS/MaaS surfaces and vice-versa.
 *
 * Locally (no NEXT_PUBLIC_ROOT_DOMAIN) the three portals live under the
 * /, /saas and /maas path prefixes on a single host. Access is still
 * strictly gated by role, so the separation holds regardless of host.
 */

export type Role = "user" | "clinico" | "empresa";
export type Portal = "consumer" | "saas" | "maas";

/** Coerce any stored metadata value into a known role. Defaults to "user". */
export function normalizeRole(value: unknown): Role {
  return value === "clinico" || value === "empresa" ? value : "user";
}

/** Where a freshly-authenticated user of a given role belongs. */
export function homeForRole(role: Role): string {
  switch (role) {
    case "clinico":
      return "/saas/clinica";
    case "empresa":
      return "/saas/corporativo";
    default:
      return "/chat";
  }
}

/** Which portal a given app path belongs to. */
export function portalForPath(path: string): Portal {
  if (path === "/saas" || path.startsWith("/saas/")) return "saas";
  if (path === "/maas" || path.startsWith("/maas/")) return "maas";
  return "consumer";
}

/**
 * Resolve the portal from the request host using its subdomain.
 * Returns null when subdomain routing is not configured (local dev),
 * meaning the caller should fall back to path-based routing.
 */
export function portalForHost(
  host: string | null,
  rootDomain: string | undefined
): Portal | null {
  if (!rootDomain || !host) return null;
  const hostname = host.split(":")[0].toLowerCase();
  const root = rootDomain.split(":")[0].toLowerCase();

  if (hostname === root || hostname === `www.${root}` || hostname === `app.${root}`) {
    return "consumer";
  }
  if (hostname === `saas.${root}`) return "saas";
  if (hostname === `maas.${root}`) return "maas";
  // Unknown subdomain on the configured root → treat as consumer.
  if (hostname.endsWith(`.${root}`)) return "consumer";
  return null;
}

/** Canonical hostname (no protocol) for a portal under a root domain. */
export function hostForPortal(portal: Portal, rootDomain: string): string {
  switch (portal) {
    case "saas":
      return `saas.${rootDomain}`;
    case "maas":
      return `maas.${rootDomain}`;
    default:
      return rootDomain;
  }
}
