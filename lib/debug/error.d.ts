export { debug_Error as Error };
/**
 * @fileoverview Provides a base class for custom Error objects such that the
 * stack is correctly maintained.
 *
 * You should never need to throw debug_Error(msg) directly, Error(msg) is
 * sufficient.
 */
/**
 * Base class for custom error objects.
 * @extends {Error}
 */
declare class debug_Error extends Error {
    /**
     * Base class for custom error objects.
     * @param {*=} opt_msg The message associated with the error.
     */
    constructor(opt_msg?: any | undefined);
    /**
     * Whether to report this error to the server. Setting this to false will
     * cause the error reporter to not report the error back to the server,
     * which can be useful if the client knows that the error has already been
     * logged on the server.
     * @type {boolean}
     */
    reportErrorToServer: boolean;
}
