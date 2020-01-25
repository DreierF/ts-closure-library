/**
 * Errors thrown by storage mechanisms.
 */
export type ErrorCode = string;
export namespace ErrorCode {
    export const INVALID_VALUE: string;
    export const QUOTA_EXCEEDED: string;
    export const STORAGE_DISABLED: string;
}
