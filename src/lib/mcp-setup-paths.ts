/** Paid subscriber MCP URL setup — post-checkout destination. */
export const UNIQUE_MCP_URL_PATH = "/premium/unique-mcp-url";

export const FREE_TRIAL_START_PARAM = "start=trial";

export function uniqueMcpUrlWithSession(sessionId: string, appUrl: string) {
  return `${appUrl}${UNIQUE_MCP_URL_PATH}?session_id=${encodeURIComponent(sessionId)}`;
}

export function freeTrialSetupPath() {
  return `${UNIQUE_MCP_URL_PATH}?${FREE_TRIAL_START_PARAM}`;
}

export function freeTrialLoginRedirect() {
  return `/login?redirect=${encodeURIComponent(freeTrialSetupPath())}`;
}
