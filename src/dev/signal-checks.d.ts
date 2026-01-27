/**
 * Validate signal usage patterns
 */
/**
 * Warn if reading signal outside effect context
 */
export declare function checkSignalUsage(signalName?: string): void;
/**
 * Warn about common signal mistakes
 */
export declare function validateSignalWrite(oldValue: unknown, newValue: unknown): void;
/**
 * Warn about forgotten function calls
 */
export declare function checkForgottenCall(context: string): void;
