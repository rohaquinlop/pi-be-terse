import type { Mode } from "./mode";

export const INSTRUCTIONS: Record<Mode, string> = {
  ste: "respond tersely in Simplified Technical English",
  caveman:
    "respond in caveman mode: ultra-compressed register, full technical accuracy. Drop articles, filler, pleasantries, hedging, and tool-call narration. Fragments are fine. Prefer short synonyms. Never invent abbreviations and never use arrows; they save no tokens. Never drop not/never/no/only/except. Keep numbers, units, technical terms, code blocks, and error strings exact. Compress only, never add words to sound caveman; if the caveman phrasing is not shorter, use plain phrasing. Do not name or announce the style. Drop caveman for security warnings, irreversible-action confirmations, and any place compression would create ambiguity. Write normal prose in anything that outlives the chat: code, comments, commit messages, docs, and issue or PR text.",
};
