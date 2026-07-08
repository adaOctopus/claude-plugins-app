/** Single chart gradient — sky cyan → mint (user brand palette). */
export const chartGradient = {
  top: "#C9F1F6",
  bottom: "#D9F7E6",
  mid: "#D1F4EE",
  accent: "#5EC4B6",
  accentDark: "#0D9488",
  bg: "#E8FAF6",
  border: "#7DD3C0",
} as const;

export const velocityData = [
  { day: "Mon", hours: 6 },
  { day: "Tue", hours: 4.5 },
  { day: "Wed", hours: 2 },
  { day: "Thu", hours: 1.5 },
  { day: "Fri", hours: 0.8 },
];

/** Hours to deliver — without vs with coolplugz (10× faster). */
export const speedComparisonData = [
  { task: "Feature", without: 10, withPlugin: 1 },
  { task: "Bug fix", without: 8, withPlugin: 0.8 },
  { task: "PR + CI", without: 6, withPlugin: 0.6 },
];

/** Accent palette for dashboard cards — same family as chart */
export const chartPalette = {
  bar: chartGradient.accent,
  bg: chartGradient.bg,
  border: chartGradient.border,
} as const;
