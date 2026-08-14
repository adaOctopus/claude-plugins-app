# CoolPlugz — Getting Started

One command for Claude Code CLI — same URL for web or desktop ✨

## ⌨️ Claude Code CLI — easier · most used

```bash
claude mcp add coolplugz --transport http YOUR_COOLPLUGZ_URL
```

Replace `YOUR_COOLPLUGZ_URL` with your unique key from the setup page (e.g. `https://api.coolplugz.com/mcp/ck_…`).

## 🌐 claude.ai (browser)

1. **Settings → Connectors → Add → Custom connector**
2. Name: `coolplugz`
3. Paste your unique URL → **Add**

## 🖥️ Claude Desktop (Connectors) — easiest

Same flow as claude.ai:

1. **Settings → Connectors → Add → Custom connector**
2. Name: `coolplugz`
3. Paste your unique URL → **Add**

## What you can say ❤️

Plain English — no IDs, no config:

- **"Show my dashboard"** — home base; connect tools first time, then tasks, PRs, and Slack drafts
- **"Run"** — syncs all tools and works your incomplete Jira tickets
- **"What's blocking my tasks?"** — stuck or failing tasks — what's wrong and what to do
- **"Show task PROJ-42"** — deep dive on one ticket
- **"Reject PROJ-42 and redo it"** — feedback and re-execute
- **"Refresh Slack"** — latest mentions and draft replies

Works on web and desktop. Connect once, stays connected.

## 🖥️ Claude Desktop (OLD — config file)

Only if Connectors is not available in your Desktop app:

1. **Settings → Developer → Edit Config**
2. Choose `claude_desktop_config.json` — **create the file if it doesn't exist**
3. Paste the JSON below with your URL → Save
4. Quit Claude Desktop fully, then reopen

**Mac:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "coolplugz": {
      "url": "YOUR_COOLPLUGZ_URL",
      "transport": "http"
    }
  }
}
```

## Connect your tools 🔑

Type **"Show my dashboard"** in Claude. CoolPlugz shows four Connect buttons — Jira, GitHub, Notion, Slack. Click each one, authorize, close the tab. Done.
