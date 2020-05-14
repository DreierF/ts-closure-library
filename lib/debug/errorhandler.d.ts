/**
 * @fileoverview Error handling utilities.
 */
/**
 * The ErrorHandler can be used to to wrap functions with a try/catch
 * statement. If an exception is thrown, the given error handler function will
 * be called.
 *
 * When this object is disposed, it will stop handling exceptions and tracing.
 * It will also try to restore window.setTimeout and window.setInterval
 * if it wrapped them. Notice that in the general case, it is not technically
 * possible to remove the wrapper, because functions have no knowledge of
 * what they have been assigned to. So the app is responsible for other
 * forms of unwrapping.
 *
 * @extends {Disposable}
 * @implements {EntryPointMonitor}
 */
export class ErrorHandler extends Disposable implements EntryPointMonitor {
    /**
     * The ErrorHandler can be used to to wrap functions with a try/catch
     * statement. If an exception is thrown, the given error handler function will
     * be called.
     *
     * When this object is disposed, it will stop handling exceptions and tracing.
     * It will also try to restore window.setTimeout and window.setInterval
     * if it wrapped them. Notice that in the general case, it is not technically
     * possible to remove the wrapper, because functions have no knowledge of
     * what they have been assigned to. So the app is responsible for other
     * forms of unwrapping.
     *
     * @param {?Function} handler Handler for exceptions.
     */
    constructor(handler: Function | null);
    /**
     * Whether to add tracers when instrumenting entry points.
     * @type {boolean}
     * @private
     */
    private addTracersToProtectedFunctions_;
    /**
     * Handler for exceptions, which can do logging, reporting, etc.
     * @type {?Function}
     * @private
     */
    private errorHandlerFn_;
    /**
     * Whether errors should be wrapped in
     * ProtectedFunctionError before rethrowing.
     * @type {boolean}
     * @private
     */
    private wrapErrors_;
    /**
     * Whether to add a prefix to all error messages. The prefix is
     * ProtectedFunctionError.MESSAGE_PREFIX. This option
     * only has an effect if this.wrapErrors_  is set to false.
     * @type {boolean}
     * @private
     */
    private prefixErrorMessages_;
    /**
     * Enable tracers when instrumenting entry points.
     * @param {boolean} newVal See above.
     */
    setAddTracersToProtectedFunctions(newVal: boolean): void;
    /** @override */
    wrap(fn: any): Function;
    /** @override */
    unwrap(fn: any): any;
    /**
     * Private helper function to return a span that can be clicked on to display
     * an alert with the current stack trace. Newlines are replaced with a
     * placeholder so that they will not be html-escaped.
     * @param {string} stackTrace The stack trace to create a span for.
     * @return {string} A span which can be clicked on to show the stack trace.
     * @private
     */
    private getStackTraceHolder_;
    /**
     * Get the index for a function. Used for internal indexing.
     * @param {boolean} wrapper True for the wrapper; false for the wrapped.
     * @return {string} The index where we should store the function in its
     *     wrapper/wrapped function.
     * @private
     */
    private getFunctionIndex_;
    /**
     * Installs exception protection for an entry point function. When an exception
     * is thrown from a protected function, a handler will be invoked to handle it.
     *
     * @param {?Function} fn An entry point function to be protected.
     * @return {!Function} A protected wrapper function that calls the entry point
     *     function.
     */
    protectEntryPoint(fn: Function | null): Function;
    /**
     * Helps {@link #protectEntryPoint} by actually creating the protected
     * wrapper function, after {@link #protectEntryPoint} determines that one does
     * not already exist for the given function.  Can be overridden by subclasses
     * that may want to implement different error handling, or add additional
     * entry point hooks.
     * @param {!Function} fn An entry point function to be protected.
     * @return {!Function} protected wrapper function.
     * @protected
     */
    protected getProtectedFunction(fn: Function): Function;
    /**
     * Internal error handler.
     * @param {?} e The error string or an Error-like object.
     * @private
     */
    private handleError_;
    /**
     * Installs exception protection for window.setTimeout to handle exceptions.
     */
    protectWindowSetTimeout(): void;
    /**
     * Install exception protection for window.setInterval to handle exceptions.
     */
    protectWindowSetInterval(): void;
    /**
     * Install an unhandledrejection event listener that reports rejected promises.
     * Note: this will only work with Chrome 49+ and friends, but so far is the only
     * way to report uncaught errors in aysnc/await functions.
     */
    catchUnhandledRejections(): void;
    /**
     * Install exception protection for window.requestAnimationFrame to handle
     * exceptions.
     */
    protectWindowRequestAnimationFrame(): void;
    /**
     * Helper function for protecting a function that causes a function to be
     * asynchronously called, for example setTimeout or requestAnimationFrame.
     * @param {string} fnName The name of the function to protect.
     * @private
     */
    private protectWindowFunctionsHelper_;
    /**
     * Set whether to wrap errors that occur in protected functions in a
     * ProtectedFunctionError.
     * @param {boolean} wrapErrors Whether to wrap errors.
     */
    setWrapErrors(wrapErrors: boolean): void;
    /**
     * Set whether to add a prefix to all error messages that occur in protected
     * functions.
     * @param {boolean} prefixErrorMessages Whether to add a prefix to error
     *     messages.
     */
    setPrefixErrorMessages(prefixErrorMessages: boolean): void;
}
/**
 * Error thrown to the caller of a protected entry point if the entry point
 * throws an error.
 * @extends {DebugError}
 * @final
 */
export class ProtectedFunctionError extends DebugError {
    /**
     * Error thrown to the caller of a protected entry point if the entry point
     * throws an error.
     * @param {*} cause The error thrown by the entry point.
     */
    constructor(cause: any);
    /**
     * The error thrown by the entry point.
     * @type {*}
     */
    cause: any;
}
export namespace ProtectedFunctionError {
    export const MESSAGE_PREFIX: string;
}
import { Disposable } from "../disposable/disposable.js";
import { EntryPointMonitor } from "./entrypointregistry.js";
import { Error as DebugError } from "./error.js";
