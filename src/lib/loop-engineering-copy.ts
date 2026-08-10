/** Homepage Loop Engineering section — terminal log + minimal copy. */

export const LOOP_ENGINEERING_SECTION_ID = "loop-engineering";

export const LOOP_ENGINEERING_GUIDE_SLUG = "loop-engineering-anthropic-playbook";

export type LoopTerminalStep = "gather" | "act" | "verify" | "repeat";

export type LoopTerminalLine = {
  step: LoopTerminalStep;
  prefix: string;
  message: string;
};

export const loopEngineeringCopy = {
  badge: "Loop Engineering · Anthropic's Playbook",
  headline: "Removes manual work and gives your back your energy🔋",
  subhead:
    "CoolPlugz orchestrates the same agentic loop used by top engineering teams to ship in 2026.",
  aside:
    "Gather Context → Take Action → Verify Work✅",
  guideLinkLabel: "Learn more about Loop Engineering",
  guideLinkHint: "",
  terminalTitle: "coolplugz · agentic loop",
  terminalDivider: "──────────────────────────────────────",
  lines: [
    {
      step: "gather",
      prefix: "① gather",
      message: "PROJ-124 · pr #42 · @edouard · ci/main",
    },
    {
      step: "act",
      prefix: "② act",
      message: "plan → implement → push",
    },
    {
      step: "verify",
      prefix: "③ verify",
      message: "tests ✓  comments ✓  conflicts ✓",
    },
    {
      step: "repeat",
      prefix: "④ repeat",
      message: "PROJ-125 queued…",
    },
  ] satisfies LoopTerminalLine[],
  pills: [
    { label: "Context budget" },
    { label: "Built-in verifier" },
    { label: "Permanent Access" },
    { label: "Autopilot" },
  ],
} as const;

export const loopEngineeringSectionSchema = {
  name: "Loop engineering for Claude Code developers",
  description:
    "CoolPlugz runs the gather-act-verify-repeat agent loop recommended in Anthropic's 2026 engineering guidance — context orchestration, verification, and unattended Claude Code runs.",
};
