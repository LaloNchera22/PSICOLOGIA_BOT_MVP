import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  normalizeRole,
  homeForRole,
  portalForPath,
  portalForHost,
  hostForPortal,
  type Role,
} from "@/lib/portal";

// Set this in production to enable per-subdomain isolation
// (e.g. "kognt.io" → kognt.io / saas.kognt.io / maas.kognt.io).
// Leave unset locally to run all three portals on one host.
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN;

// Consumer routes that require an authenticated session.
const CONSUMER_PROTECTED = ["/chat", "/configuracion"];

function isConsumerProtected(path: string): boolean {
  return CONSUMER_PROTECTED.some((p) => path === p || path.startsWith(p + "/"));
}

function redirect(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone();
  url.pathname = pathname;
  url.search = "";
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const path = request.nextUrl.pathname;
  const host = request.headers.get("host");
  const pathPortal = portalForPath(path);

  // ── 1. Subdomain isolation (only when ROOT_DOMAIN is configured) ──
  // Guarantees the SaaS / MaaS surfaces are unreachable from the
  // consumer subdomain and vice-versa.
  const hostPortal = portalForHost(host, ROOT_DOMAIN);
  if (hostPortal && host) {
    // saas./maas. root should land on their portal home, not the landing.
    if (hostPortal !== "consumer" && path === "/") {
      return redirect(request, `/${hostPortal}`);
    }
    if (hostPortal !== pathPortal) {
      const url = request.nextUrl.clone();
      url.host = hostForPortal(pathPortal, ROOT_DOMAIN!);
      url.port = "";
      return NextResponse.redirect(url);
    }
  }

  if (!supabaseUrl || !supabaseAnonKey) {
    return response;
  }

  try {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
          if (headers) {
            Object.entries(headers).forEach(([key, value]) =>
              response.headers.set(key, value)
            );
          }
        },
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();
    const role: Role | null = user
      ? normalizeRole(user.user_metadata?.role)
      : null;

    // ── 2. SaaS portal — professionals & companies only ──
    if (pathPortal === "saas") {
      if (!user) return redirect(request, "/");
      if (role === "user") return redirect(request, "/chat");
      // Bare /saas → role landing
      if (path === "/saas") return redirect(request, homeForRole(role!));
      if (path.startsWith("/saas/clinica") && role !== "clinico") {
        return redirect(request, homeForRole(role!));
      }
      if (path.startsWith("/saas/corporativo") && role !== "empresa") {
        return redirect(request, homeForRole(role!));
      }
      return response;
    }

    // ── 3. MaaS portal — public developer landing ──
    if (pathPortal === "maas") {
      return response;
    }

    // ── 4. Consumer portal ──
    // Professionals/companies have no business in the consumer portal:
    // send them to their own portal home.
    if (user && role !== "user") {
      if (path === "/" || isConsumerProtected(path)) {
        return redirect(request, homeForRole(role!));
      }
      return response;
    }

    // Protected consumer routes require a session.
    if (!user && isConsumerProtected(path)) {
      return redirect(request, "/");
    }
    // Logged-in consumer landing → straight to chat.
    if (user && path === "/") {
      return redirect(request, "/chat");
    }

    return response;
  } catch (error) {
    console.error("[middleware] Unexpected error:", error);
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
