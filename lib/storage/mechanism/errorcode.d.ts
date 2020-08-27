/**
 * Errors thrown by storage mechanisms.
 */
export type ErrorCode = string;
export namespace ErrorCode {
    const INVALID_VALUE: string;
    const QUOTA_EXCEEDED: string;
    const STORAGE_DISABLED: string;
}
