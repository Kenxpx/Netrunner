---
description: Configure claude-hud as your statusline
allowed-tools: Bash, Read, Edit, AskUserQuestion
---

## Step 1: Detect Platform & Runtime

**macOS/Linux** (if `uname -s` returns "Darwin" or "Linux"):

1. Get plugin path:
   ```bash
   ls -td ~/.claude/plugins/cache/claude-hud/claude-hud/*/ 2>/dev/null | head -1
   ```

2. Get runtime absolute path (prefer bun, fallback to node):
   ```bash
   which bun 2>/dev/null || which node 2>/dev/null
   ```

   If empty, stop and tell user to install Node.js.

3. If runtime contains "bun", use `src/index.ts`. Otherwise use `dist/index.js`.

4. Generate command:
   ```
   bash -c '{RUNTIME_PATH} "$(ls -td ~/.claude/plugins/cache/claude-hud/claude-hud/*/ 2>/dev/null | head -1){SOURCE}"'
   ```

**Windows** (if `uname` fails or unavailable):

1. Generate command:
   ```
   powershell -Command "& {$p=(gci $env:USERPROFILE\.claude\plugins\cache\claude-hud\claude-hud | sort LastWriteTime -Desc | select -First 1).FullName; node \"$p\dist\index.js\"}"
   ```

## Step 2: Test Command

Run the generated command. It must produce output (the HUD lines). If it errors, do not proceed.

## Step 3: Apply Configuration

Read `~/.claude/settings.json`, merge in the statusLine config, write back. Preserve all existing settings.

```json
{
  "statusLine": {
    "type": "command",
    "command": "{GENERATED_COMMAND}"
  }
}
```

## Step 4: Verify With User

Use AskUserQuestion:
- Question: "The HUD should now appear below your input field. Is it working?"
- Options: "Yes, I see it" / "No, something's wrong"

**If yes**: Ask the user if they'd like to star the repository to support the project. If they agree, run: `gh api -X PUT /user/starred/jarrodwatts/claude-hud`. Only run the star command if they explicitly say yes.

**If no**: Debug systematically:

1. **Verify config was applied**:
   - Read `~/.claude/settings.json`
   - Check statusLine.command exists and looks correct

2. **Test the command manually** and capture error output:
   ```bash
   {GENERATED_COMMAND} 2>&1
   ```

3. **Common issues to check**:

   **"command not found" or empty output**:
   - Runtime path might be wrong: `ls -la {RUNTIME_PATH}`
   - On macOS with mise/nvm: the absolute path may have changed after an update
   - Solution: re-detect with `which bun` or `which node`

   **"No such file or directory" for plugin**:
   - Plugin might not be installed: `ls ~/.claude/plugins/cache/claude-hud/`
   - Solution: reinstall plugin via marketplace

   **Windows: "bash not recognized"**:
   - Wrong command type for Windows
   - Solution: use the PowerShell command variant

   **Permission denied**:
   - Runtime not executable: `chmod +x {RUNTIME_PATH}`

4. **If still stuck**: Show the user the exact command that was generated and the error, so they can report it or debug further
