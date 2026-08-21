import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";
import { INSTRUCTIONS } from "./instructions";
import { isValidMode, MODES, readPersistedMode, writePersistedMode } from "./mode";
import { resolveMode } from "./resolve-mode";

export default function (pi: ExtensionAPI) {
  pi.on("before_agent_start", async (event) => {
    const mode = resolveMode(event.prompt, process.env.BE_TERSE_MODE, readPersistedMode());
    if (mode === "noterse") return;

    return {
      message: {
        customType: "be-terse",
        content: INSTRUCTIONS[mode],
        display: false,
      },
    };
  });

  pi.registerCommand("be-terse:mode", {
    description: "Show or switch the be-terse output style (ste or caveman)",
    handler: async (args, ctx) => {
      const requested = args.trim();
      const envMode = process.env.BE_TERSE_MODE;
      const persisted = readPersistedMode();

      if (!requested) {
        if (envMode) {
          ctx.ui.notify(
            `active mode: ${envMode} (from $BE_TERSE_MODE, overrides the saved mode)`,
            "info",
          );
          if (persisted) {
            ctx.ui.notify(
              `saved mode: ${persisted} (takes effect once $BE_TERSE_MODE is unset)`,
              "info",
            );
          }
        } else if (persisted) {
          ctx.ui.notify(`active mode: ${persisted} (saved)`, "info");
        } else {
          ctx.ui.notify("active mode: ste (default, nothing saved yet)", "info");
        }
        return;
      }

      if (!isValidMode(requested)) {
        ctx.ui.notify(`unknown mode: '${requested}'`, "warning");
        ctx.ui.notify(`valid modes: ${MODES.join("|")}`, "info");
        return;
      }

      writePersistedMode(requested);
      ctx.ui.notify(`mode set to: ${requested} (saved, survives restarts)`, "info");
      if (envMode) {
        ctx.ui.notify(
          `warning: $BE_TERSE_MODE=${envMode} is set for this session and overrides the saved mode`,
          "warning",
        );
      }
    },
  });
}
