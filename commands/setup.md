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

2. Get runtime absolute path (prefer bun for performance, fallback to node):
   ```bash
   command -v bun 2>/dev/null || command -v node 2>/dev/null
   ```

   If empty, stop and tell user to install Node.js or Bun.

3. Verify the runtime exists:
   ```bash
   ls -la {RUNTIME_PATH}
   ```
   If it doesn't exist, re-detect or ask user to verify their installation.

4. If runtime path contains "bun", use `src/index.ts`. Otherwise use `dist/index.js`.

5. Generate command:
   ```
   bash -c '{RUNTIME_PATH} "$(ls -td ~/.claude/plugins/cache/claude-hud/claude-hud/*/ 2>/dev/null | head -1){SOURCE}"'
   ```

**Windows** (if `uname` fails or unavailable):

1. Get runtime absolute path (prefer bun, fallback to node):
   ```powershell
   if (Get-Command bun -ErrorAction SilentlyContinue) { (Get-Command bun).Source } else { (Get-Command node).Source }
   ```

   If neither found, stop and tell user to install Node.js or Bun.

2. If runtime is bun, use `src\index.ts`. Otherwise use `dist\index.js`.

3. Generate command:
   ```
   powershell -Command "& {$p=(gci $env:USERPROFILE\.claude\plugins\cache\claude-hud\claude-hud | sort LastWriteTime -Desc | select -First 1).FullName; {RUNTIME_PATH} (Join-Path $p '{SOURCE}')}"
   ```

**WSL (Windows Subsystem for Linux)**: If running in WSL, use the macOS/Linux instructions. Ensure the plugin is installed in the Linux environment (`~/.claude/plugins/...`), not the Windows side.

## Step 2: Test Command

Run the generated command. It should produce output (the HUD lines) within 1 second.

- If it errors, do not proceed to Step 3.
- If it hangs for more than a few seconds, cancel and debug.

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
   - On macOS with mise/nvm/asdf: the absolute path may have changed after a runtime update
   - Solution: re-detect with `command -v bun` or `command -v node`

   **"No such file or directory" for plugin**:
   - Plugin might not be installed: `ls ~/.claude/plugins/cache/claude-hud/`
   - Solution: reinstall plugin via marketplace

   **Windows: "bash not recognized"**:
   - Wrong command type for Windows
   - Solution: use the PowerShell command variant

   **Windows: PowerShell execution policy error**:
   - Run: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`

   **Permission denied**:
   - Runtime not executable: `chmod +x {RUNTIME_PATH}`

   **WSL confusion**:
   - If using WSL, ensure plugin is installed in Linux environment, not Windows
   - Check: `ls ~/.claude/plugins/cache/claude-hud/`

4. **If still stuck**: Show the user the exact command that was generated and the error, so they can report it or debug further
