import Stripe from "stripe";

/** Shown when provisioning or other server-side integration fails. */
export const GENERIC_TRY_AGAIN_MESSAGE =
  "Oops — something went wrong on our side. Please try again in a few minutes.";

export const STRIPE_MODE_MISMATCH_MESSAGE =
  "This subscription was created in a test environment and can't be managed on the live site. Please contact support or subscribe again on coolplugz.com.";

/** True when STRIPE_SECRET_KEY is a live-mode secret. */
export function isStripeLiveMode(): boolean {
  return process.env.STRIPE_SECRET_KEY?.startsWith("sk_live_") ?? false;
}

/** True when Stripe rejects a request because test/live keys don't match the object ID. */
export function isStripeModeMismatchError(error: unknown): boolean {
  return (
    error instanceof Stripe.errors.StripeError &&
    error.code === "resource_missing" &&
    /similar object exists in (test|live) mode/i.test(error.message)
  );
}

/** Map Stripe API errors to copy safe to show in the UI. */
export function toUserFacingStripeError(error: unknown, logLabel = "stripe"): string {
  if (isStripeModeMismatchError(error)) {
    console.error(`[${logLabel}] Stripe mode mismatch:`, (error as Stripe.errors.StripeError).message);
    return STRIPE_MODE_MISMATCH_MESSAGE;
  }

  console.error(`[${logLabel}]`, error);
  return GENERIC_TRY_AGAIN_MESSAGE;
}

const SAFE_TO_SHOW = [
  /free trial has already been used/i,
  /already have an active pro subscription/i,
  /not open yet/i,
  /join the waitlist/i,
  /no active subscription/i,
  /unauthorized/i,
  /sign in/i,
];

/** Map internal/API errors to copy safe to show in the UI. Logs the real message server-side. */
export function toUserFacingProvisionError(error: unknown, logLabel = "provision"): string {
  const message =
    error instanceof Error ? error.message : typeof error === "string" ? error : "Unknown error";

  if (SAFE_TO_SHOW.some((pattern) => pattern.test(message))) {
    return message;
  }

  console.error(`[${logLabel}]`, message);
  return GENERIC_TRY_AGAIN_MESSAGE;
}
