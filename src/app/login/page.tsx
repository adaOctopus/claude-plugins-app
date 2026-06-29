import { Suspense } from "react";
import { LoginForm } from "./LoginForm";

/** Login page — email magic link sign-in. */
export default function LoginPage() {
  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-24">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
