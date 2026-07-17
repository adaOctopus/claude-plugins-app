import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

/** Legacy route — send signed-in users to account hub. */
export default async function ManageSubscriptionRedirect() {
  const session = await getSession();
  redirect(session ? "/app" : "/login?redirect=/app");
}
