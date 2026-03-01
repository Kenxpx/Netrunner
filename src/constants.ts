/**
 * Autocompact buffer percentage.
 *
 * NOTE: This value (16.5% = 33k/200k) is empirically derived from current
 * Claude Code `/context` output. It is NOT officially documented by Anthropic
 * and may change in future Claude Code versions. If users report mismatches,
 * this value may need adjustment.
 */
export const AUTOCOMPACT_BUFFER_PERCENT = 0.165;
