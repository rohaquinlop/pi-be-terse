# pi-be-terse

A [pi](https://github.com/earendil-works/pi) extension that keeps pi's
responses terse. It's a port of the
[be-terse](https://github.com/rohaquinlop/be-terse) Claude Code plugin: same
two modes, same trailing-keyword overrides, same `/mode` command shape —
built on pi's `before_agent_start` extension hook instead of a
`UserPromptSubmit` hook, so the style instruction reaches the model on every
single prompt without depending on a skill or `AGENTS.md` the model has to
decide to read.

## Modes

| Mode | Instruction injected |
|------|----------------------|
| `ste` (default) | respond tersely in [Simplified Technical English](https://en.wikipedia.org/wiki/Simplified_Technical_English) |
| `caveman` | ultra-compressed caveman register: no articles, no filler, no hedging, fragments fine — code, numbers, units and error strings stay exact |

The instruction is injected as a hidden message on every turn — it reaches
the model but never shows up in the visible transcript.

### Switching modes

```
/be-terse:mode              # show the active mode
/be-terse:mode caveman      # switch to caveman, saved
/be-terse:mode ste          # switch back, saved
```

The saved mode lives in `${XDG_STATE_HOME:-~/.local/state}/pi-be-terse/mode`,
independent of the Claude Code plugin's own state file — switching mode in
one tool never affects the other.

For a one-off, end a single prompt with a mode keyword. The keyword is not
stripped, so the model still sees it as part of your prompt:

```
refactor this parser caveman   # caveman, this prompt only
refactor this parser ste       # Simplified Technical English, this prompt only
refactor this parser noterse   # inject nothing at all, this prompt only
```

You can also set a session default without touching the saved mode:

```
BE_TERSE_MODE=caveman pi
```

Resolution order, first match wins:

1. trailing `noterse`
2. trailing `ste` / `caveman`
3. `$BE_TERSE_MODE`
4. the saved mode
5. `ste`

## Install

### Option A — as a pi package (recommended)

```bash
pi install git:github.com/rohaquinlop/pi-be-terse
```

Then `/reload` in a pi session (or restart pi).

To update later: `pi update --extensions`.

### Option B — from a local checkout

```bash
git clone https://github.com/rohaquinlop/pi-be-terse.git
cp -r pi-be-terse/extensions/be-terse ~/.pi/agent/extensions/be-terse
```

Auto-discovered from `~/.pi/agent/extensions/be-terse/index.ts`. `/reload`
picks it up without a restart.

### Option C — quick test, no install

```bash
pi -e /path/to/pi-be-terse/extensions/be-terse/index.ts
```

## Development

```bash
bun test
```

## License

MIT
