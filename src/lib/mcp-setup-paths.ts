/** Paid subscriber MCP URL setup — post-checkout destination. */
export const UNIQUE_MCP_URL_PATH = "/premium/unique-mcp-url";

export const DAILY_PASS_SUCCESS_PARAM = "daily=success";

export function uniqueMcpUrlWithSession(sessionId: string, appUrl: string) {
  return `${appUrl}${UNIQUE_MCP_URL_PATH}?session_id=${encodeURIComponent(sessionId)}`;
}

export function dailyPassSuccessPath() {
  return `${UNIQUE_MCP_URL_PATH}?${DAILY_PASS_SUCCESS_PARAM}`;
}

export function dailyPassLoginRedirect() {
  return `/login?redirect=${encodeURIComponent("/pricing")}`;
}

/** @deprecated Free trial removed — use /pricing One Run checkout. */
export function freeTrialSetupPath() {
  return "/pricing";
}

/** @deprecated */
export function freeTrialLoginRedirect() {
  return dailyPassLoginRedirect();
}

export const FREE_TRIAL_START_PARAM = "start=trial";
