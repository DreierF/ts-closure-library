export { DebugError as Error };
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Provides a base class for custom Error objects such that the
 * stack is correctly maintained.
 *
 * You should never need to throw DebugError(msg) directly, Error(msg) is
 * sufficient.
 */
/**
 * Base class for custom error objects.
 * @param {*=} msg The message associated with the error.
 * @param {{
 *    message: (?|undefined),
 *    name: (?|undefined),
 *    lineNumber: (?|undefined),
 *    fileName: (?|undefined),
 *    stack: (?|undefined),
 *    cause: (?|undefined),
 * }=} cause The original error object to chain with.
 * @constructor
 * @extends {Error}
 */
declare function DebugError(msg?: any | undefined, cause?: {
    message: (unknown | undefined);
    name: (unknown | undefined);
    lineNumber: (unknown | undefined);
    fileName: (unknown | undefined);
    stack: (unknown | undefined);
    cause: (unknown | undefined);
} | undefined): void;
declare class DebugError {
    /**
     * @license
     * Copyright The Closure Library Authors.
     * SPDX-License-Identifier: Apache-2.0
     */
    /**
     * @fileoverview Provides a base class for custom Error objects such that the
     * stack is correctly maintained.
     *
     * You should never need to throw DebugError(msg) directly, Error(msg) is
     * sufficient.
     */
    /**
     * Base class for custom error objects.
     * @param {*=} msg The message associated with the error.
     * @param {{
     *    message: (?|undefined),
     *    name: (?|undefined),
     *    lineNumber: (?|undefined),
     *    fileName: (?|undefined),
     *    stack: (?|undefined),
     *    cause: (?|undefined),
     * }=} cause The original error object to chain with.
     * @constructor
     * @extends {Error}
     */
    constructor(msg?: any | undefined, cause?: {
        message: (unknown | undefined);
        name: (unknown | undefined);
        lineNumber: (unknown | undefined);
        fileName: (unknown | undefined);
        stack: (unknown | undefined);
        cause: (unknown | undefined);
    } | undefined);
    /** @override */
    stack: string | undefined;
    /** @override */
    message: string | undefined;
    cause: {
        message: (unknown | undefined);
        name: (unknown | undefined);
        lineNumber: (unknown | undefined);
        fileName: (unknown | undefined);
        stack: (unknown | undefined);
        cause: (unknown | undefined);
    } | undefined;
    /**
     * Whether to report this error to the server. Setting this to false will
     * cause the error reporter to not report the error back to the server,
     * which can be useful if the client knows that the error has already been
     * logged on the server.
     * @type {boolean}
     */
    reportErrorToServer: boolean;
    /** @override @type {string} */
    name: string;
}
