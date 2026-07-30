/** SEO copy + structured data for the homepage engineer problems section. */

export const ENGINEER_PROBLEMS_SECTION_ID = "problems";

export type EngineerProblemSeoItem = {
  id: string;
  name: string;
  description: string;
  payoff: string;
};

export const engineerProblemsSeoItems: EngineerProblemSeoItem[] = [
  {
    id: "context-switching",
    name: "Stop context switching between dev tools",
    description:
      "CoolPlugz gathers GitHub, Slack, Jira, CI, and docs in one Claude panel so remote engineers avoid tab-hopping and save mental energy.",
    payoff: "More energy",
  },
  {
    id: "ci-loops",
    name: "End CI trial-and-error loops",
    description:
      "Checks run in the CoolPlugz environment until green—no more copy-pasting failed CI logs into your coding assistant.",
    payoff: "Save hours",
  },
  {
    id: "github-ping-pong",
    name: "Fix GitHub review comments without ping-pong",
    description:
      "PR review comments and failed checks are addressed inside the same CoolPlugz run—less back-and-forth between GitHub and Claude.",
    payoff: "Less back-and-forth",
  },
  {
    id: "slack-anxiety",
    name: "Reduce Slack anxiety for remote engineers",
    description:
      "Surface @mentions and tone-matched Slack drafts in Claude—you approve and send instead of binge-checking threads all day.",
    payoff: "Peace of mind",
  },
];

export const engineerProblemsSectionSchema = {
  name: "Problems CoolPlugz solves for remote AI-native engineers",
  description:
    "CoolPlugz helps developers ship from Claude with less context switching, fewer CI loops, less GitHub ping-pong, and less Slack anxiety.",
};
