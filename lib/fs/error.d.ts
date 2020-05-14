/**
 * *
 */
export type ErrorCode = number;
/**
 * @fileoverview A wrapper for the HTML5 FileError object.
 */
/** @interface */
export function DOMErrorLike(): void;
export class DOMErrorLike {
    /** @type {string|undefined} */
    name: string | undefined;
    /** @type {!ErrorCode|undefined} */
    code: ErrorCode | undefined;
}
export namespace ErrorCode {
    export const NOT_FOUND: number;
    export const SECURITY: number;
    export const ABORT: number;
    export const NOT_READABLE: number;
    export const ENCODING: number;
    export const NO_MODIFICATION_ALLOWED: number;
    export const INVALID_STATE: number;
    export const SYNTAX: number;
    export const INVALID_MODIFICATION: number;
    export const QUOTA_EXCEEDED: number;
    export const TYPE_MISMATCH: number;
    export const PATH_EXISTS: number;
}
/**
 * A filesystem error. Since the filesystem API is asynchronous, stack traces
 * are less useful for identifying where errors come from, so this includes a
 * large amount of metadata in the message.
 *
 * @extends {DebugError}
 * @final
 */
declare class fs_Error extends DebugError {
    /**
     * @param {ErrorCode|undefined} code
     * @return {string} name
     * @private
     */
    private static getNameFromCode_;
    /**
     * Returns the code that corresponds to the given name.
     * @param {string} name
     * @return {?ErrorCode} code
     * @private
     */
    private static getCodeFromName_;
    /**
     * A filesystem error. Since the filesystem API is asynchronous, stack traces
     * are less useful for identifying where errors come from, so this includes a
     * large amount of metadata in the message.
     *
     * @param {!DOMError|!DOMErrorLike} error
     * @param {string} action The action being undertaken when the error was raised.
     */
    constructor(error: DOMError | DOMErrorLike, action: string);
    /**
     * @type {!ErrorCode}
     * @deprecated Use the 'name' or 'message' field instead.
     */
    code: ErrorCode;
}
declare namespace fs_Error {
    export namespace ErrorName {
        const ABORT_1: string;
        export { ABORT_1 as ABORT };
        const ENCODING_1: string;
        export { ENCODING_1 as ENCODING };
        const INVALID_MODIFICATION_1: string;
        export { INVALID_MODIFICATION_1 as INVALID_MODIFICATION };
        const INVALID_STATE_1: string;
        export { INVALID_STATE_1 as INVALID_STATE };
        const NOT_FOUND_1: string;
        export { NOT_FOUND_1 as NOT_FOUND };
        const NOT_READABLE_1: string;
        export { NOT_READABLE_1 as NOT_READABLE };
        const NO_MODIFICATION_ALLOWED_1: string;
        export { NO_MODIFICATION_ALLOWED_1 as NO_MODIFICATION_ALLOWED };
        const PATH_EXISTS_1: string;
        export { PATH_EXISTS_1 as PATH_EXISTS };
        const QUOTA_EXCEEDED_1: string;
        export { QUOTA_EXCEEDED_1 as QUOTA_EXCEEDED };
        const SECURITY_1: string;
        export { SECURITY_1 as SECURITY };
        const SYNTAX_1: string;
        export { SYNTAX_1 as SYNTAX };
        const TYPE_MISMATCH_1: string;
        export { TYPE_MISMATCH_1 as TYPE_MISMATCH };
    }
    /**
     * Names of errors that may be thrown by the File API, the File System API, or
     * the File Writer API.
     */
    export type ErrorName = string;
    export const NameToCodeMap_: any;
}
import { Error as DebugError } from "../debug/error.js";
export { fs_Error as Error };
