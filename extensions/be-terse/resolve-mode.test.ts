import { describe, expect, test } from "bun:test";
import { resolveMode } from "./resolve-mode";

describe("resolveMode", () => {
  test("defaults to ste with no overrides", () => {
    expect(resolveMode("refactor this parser", undefined, undefined)).toBe("ste");
  });

  test("trailing keyword overrides for this prompt only", () => {
    expect(resolveMode("refactor this parser caveman", undefined, "ste")).toBe("caveman");
    expect(resolveMode("refactor this parser ste", "caveman", undefined)).toBe("ste");
  });

  test("trailing noterse suppresses injection", () => {
    expect(resolveMode("refactor this parser noterse", "caveman", "caveman")).toBe("noterse");
  });

  test("does not false-positive on a word containing a keyword", () => {
    expect(resolveMode("don't waste time", undefined, undefined)).toBe("ste");
    expect(resolveMode("don't waste time", "caveman", undefined)).toBe("caveman");
  });

  test("env var overrides persisted mode", () => {
    expect(resolveMode("plain prompt", "caveman", "ste")).toBe("caveman");
  });

  test("invalid env var falls through to persisted mode", () => {
    expect(resolveMode("plain prompt", "bogus", "caveman")).toBe("caveman");
  });

  test("persisted mode used when no keyword or env var", () => {
    expect(resolveMode("plain prompt", undefined, "caveman")).toBe("caveman");
  });
});
