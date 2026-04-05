// ── Date helpers ──

export function getWeekNumber(d = new Date()) {
  const jan1 = new Date(d.getFullYear(), 0, 1);
  const diff = Math.floor((d - jan1) / 86400000);
  return Math.min(Math.floor(diff / 7) + 1, 52);
}

export function getDayOfYear(d = new Date()) {
  const jan1 = new Date(d.getFullYear(), 0, 1);
  return Math.floor((d - jan1) / 86400000) + 1;
}

export function formatTime(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

// ── Season helpers ──

export const SEASONS = {
  winter: { name: "Foundation", weeks: [1, 13], description: "Building the bedrock of character" },
  spring: { name: "Growth", weeks: [14, 26], description: "Cultivating the habits of flourishing" },
  summer: { name: "Strength", weeks: [27, 39], description: "Forging resilience and purpose" },
  autumn: { name: "Reflection", weeks: [40, 52], description: "Harvesting wisdom and looking inward" }
};

export function getSeason(week) {
  for (const [key, s] of Object.entries(SEASONS)) {
    if (week >= s.weeks[0] && week <= s.weeks[1]) return { key, ...s };
  }
  return { key: "winter", ...SEASONS.winter };
}

export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAYS_SHORT = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
