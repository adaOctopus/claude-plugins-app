import { redirect } from "next/navigation";

/** Legacy route — send to login. */
export default function ManageSubscriptionRedirect() {
  redirect("/login?redirect=/app");
}
