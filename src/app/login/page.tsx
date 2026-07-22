import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

type LoginPageProps = {
  searchParams: Promise<{ redirect?: string }>;
};

function safeRedirect(path: string | undefined) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/app";
  return path;
}

/** Login page — email magic link sign-in; skips if already authenticated. */
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getSession();
  const { redirect: redirectTo } = await searchParams;

  if (session) {
    redirect(safeRedirect(redirectTo));
  }

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-24">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
