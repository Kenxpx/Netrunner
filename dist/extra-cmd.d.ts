export interface ExtraLabel {
    label: string;
}
/**
 * Parse --extra-cmd argument from process.argv
 * Usage: node dist/index.js --extra-cmd "command here"
 */
export declare function parseExtraCmdArg(argv?: string[]): string | null;
/**
 * Execute a command and parse JSON output expecting { label: string }
 * Returns null on any error (timeout, parse failure, missing label)
 */
export declare function runExtraCmd(cmd: string): Promise<string | null>;
//# sourceMappingURL=extra-cmd.d.ts.map