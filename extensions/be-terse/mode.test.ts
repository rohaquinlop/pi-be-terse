import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { getStateFile, isValidMode, readPersistedMode, writePersistedMode } from "./mode";

let tmpDir: string;
let originalXdgStateHome: string | undefined;

beforeEach(() => {
  tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "pi-be-terse-test-"));
  originalXdgStateHome = process.env.XDG_STATE_HOME;
  process.env.XDG_STATE_HOME = tmpDir;
});

afterEach(() => {
  if (originalXdgStateHome === undefined) delete process.env.XDG_STATE_HOME;
  else process.env.XDG_STATE_HOME = originalXdgStateHome;
  fs.rmSync(tmpDir, { recursive: true, force: true });
});

describe("mode persistence", () => {
  test("readPersistedMode returns undefined when nothing is saved", () => {
    expect(readPersistedMode()).toBeUndefined();
  });

  test("writePersistedMode then readPersistedMode round-trips", () => {
    writePersistedMode("caveman");
    expect(readPersistedMode()).toBe("caveman");
  });

  test("isValidMode accepts only known modes", () => {
    expect(isValidMode("ste")).toBe(true);
    expect(isValidMode("caveman")).toBe(true);
    expect(isValidMode("bogus")).toBe(false);
  });

  test("writePersistedMode namespaces under pi-be-terse, independent of be-terse", () => {
    writePersistedMode("ste");
    expect(getStateFile()).toBe(path.join(tmpDir, "pi-be-terse", "mode"));
  });
});
