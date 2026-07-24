/** Routes where the navbar should not repeat account actions (already there). */
export function isAccountRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  const path = pathname.replace(/\/$/, "") || "/";
  return path === "/app" || path.startsWith("/app/") || path === "/manage-subscription";
}

export function isLoginRoute(pathname: string | null): boolean {
  if (!pathname) return false;
  const path = pathname.replace(/\/$/, "") || "/";
  return path === "/login" || path.startsWith("/login/");
}
