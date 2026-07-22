/** Shown when provisioning or other server-side integration fails. */
export const GENERIC_TRY_AGAIN_MESSAGE =
  "Oops — something went wrong on our side. Please try again in a few minutes.";

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
