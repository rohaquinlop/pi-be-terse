import fs from "node:fs";
import os from "node:os";
import path from "node:path";

export const MODES = ["ste", "caveman"] as const;
export type Mode = (typeof MODES)[number];

export function getStateDir(): string {
  return path.join(
    process.env.XDG_STATE_HOME ?? path.join(os.homedir(), ".local", "state"),
    "pi-be-terse",
  );
}

export function getStateFile(): string {
  return path.join(getStateDir(), "mode");
}

export function isValidMode(candidate: string): candidate is Mode {
  return (MODES as readonly string[]).includes(candidate);
}

export function readPersistedMode(): Mode | undefined {
  try {
    const raw = fs.readFileSync(getStateFile(), "utf8").trim();
    return isValidMode(raw) ? raw : undefined;
  } catch {
    return undefined;
  }
}

export function writePersistedMode(mode: Mode): void {
  fs.mkdirSync(getStateDir(), { recursive: true });
  fs.writeFileSync(getStateFile(), `${mode}\n`, "utf8");
}
