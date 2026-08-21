import { isValidMode, MODES, type Mode } from "./mode";

const KEYWORDS = [...MODES, "noterse"] as const;
type Keyword = (typeof KEYWORDS)[number];

// Trailing keyword: preceded by start-of-string or whitespace, followed by
// only whitespace to the end of the prompt. The leading boundary stops
// "waste" from matching "ste".
function tailRegex(keyword: string): RegExp {
  return new RegExp(`(^|\\s)${keyword}\\s*$`);
}

function trailingKeyword(prompt: string): Keyword | undefined {
  return KEYWORDS.find((keyword) => tailRegex(keyword).test(prompt));
}

export function resolveMode(
  prompt: string,
  envMode: string | undefined,
  persistedMode: Mode | undefined,
): Mode | "noterse" {
  const keyword = trailingKeyword(prompt);
  if (keyword) return keyword;

  if (envMode && isValidMode(envMode)) return envMode;

  if (persistedMode) return persistedMode;

  return "ste";
}
