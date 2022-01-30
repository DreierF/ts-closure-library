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
 * @param {*=} opt_msg The message associated with the error.
 * @constructor
 * @extends {Error}
 */
declare function DebugError(opt_msg?: any | undefined): void;
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
     * @param {*=} opt_msg The message associated with the error.
     * @constructor
     * @extends {Error}
     */
    constructor(opt_msg?: any | undefined);
    /** @override */
    stack: string | undefined;
    /** @override */
    message: string | undefined;
    /**
     * Whether to report this error to the server. Setting this to false will
     * cause the error reporter to not report the error back to the server,
     * which can be useful if the client knows that the error has already been
     * logged on the server.
     * @type {boolean}
     */
    reportErrorToServer: boolean;
    /** @override */
    name: string;
}
