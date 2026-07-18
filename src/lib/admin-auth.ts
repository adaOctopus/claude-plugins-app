import { NextRequest } from "next/server";

/** Bearer token for admin-only routes (partner promos, etc.). */
export function assertAdminRequest(request: NextRequest): boolean {
  const secret =
    process.env.PROMO_ADMIN_SECRET?.trim() ||
    process.env.COOLPLUGZ_ADMIN_SECRET?.trim();

  if (!secret) return false;

  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return false;

  return header.slice(7).trim() === secret;
}
