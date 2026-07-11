import Link from "next/link";
import { cn } from "@/lib/utils";

type LoginLinkProps = {
  className?: string;
  redirect?: string;
  children?: React.ReactNode;
};

/** Link to email login — optional redirect after verify. */
export function LoginLink({ className, redirect, children = "Log in" }: LoginLinkProps) {
  const href = redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login";

  return (
    <Link
      href={href}
      className={cn(
        "text-sm text-charcoal-muted transition-colors hover:text-charcoal",
        className
      )}
    >
      {children}
    </Link>
  );
}
