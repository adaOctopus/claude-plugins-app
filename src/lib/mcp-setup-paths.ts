/** Paid subscriber MCP URL setup — post-checkout destination. */
export const UNIQUE_MCP_URL_PATH = "/premium/unique-mcp-url";

export function uniqueMcpUrlWithSession(sessionId: string, appUrl: string) {
  return `${appUrl}${UNIQUE_MCP_URL_PATH}?session_id=${encodeURIComponent(sessionId)}`;
}
