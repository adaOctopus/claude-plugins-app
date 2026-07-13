# CoolPlugz — Getting Started

One step — same URL for web or desktop ✨

## 🌐 claude.ai (browser) — easiest

1. **Settings → Connectors → Add → Custom connector**
2. Name: `coolplugz`
3. Paste your unique URL → **Add**

## 🖥️ Claude Desktop

1. **Settings → Desktop app → Developer → Edit Config**
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

Type **"dashboard"** in Claude. CoolPlugz shows four Connect buttons — Jira, GitHub, Notion, Slack. Click each one, authorize, close the tab. Done.

## Start using it ❤️

- **"run"** — picks up your Jira tasks, writes code, opens PRs, watches CI
- **"dashboard"** — your task board, standup draft, and Slack mentions
- **"wtf"** — investigates and fixes a failing CI check
- **"reject"** — re-runs with your feedback

Works on web and desktop. Connect once, stays connected.
