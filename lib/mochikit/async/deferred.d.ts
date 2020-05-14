/**
 * An error sub class that is used when a Deferred has already been called.
 *
 * @extends {DebugError}
 */
export class AlreadyCalledError extends DebugError {
    /**
     * An error sub class that is used when a Deferred has already been called.
     * @param {!Deferred} deferred The Deferred.
     *
     */
    constructor(deferred: Deferred);
    /**
     * The Deferred that raised this error.
     * @type {?Deferred}
     */
    deferred: Deferred | null;
}
/**
 * An error sub class that is used when a Deferred is canceled.
 *
 * @extends {DebugError}
 */
export class CanceledError extends DebugError {
    /**
     * An error sub class that is used when a Deferred is canceled.
     *
     * @param {!Deferred} deferred The Deferred object.
     */
    constructor(deferred: Deferred);
    /**
     * The Deferred that raised this error.
     * @type {?Deferred}
     */
    deferred: Deferred | null;
}
/**
 * @license Portions of this code are from MochiKit, received by
 * The Closure Authors under the MIT license. All other code is Copyright
 * 2005-2009 The Closure Authors. All Rights Reserved.
 */
/**
 * @fileoverview Classes for tracking asynchronous operations and handling the
 * results. The Deferred object here is patterned after the Deferred object in
 * the Twisted python networking framework.
 *
 * See: http://twistedmatrix.com/projects/core/documentation/howto/defer.html
 *
 * Based on the Dojo code which in turn is based on the MochiKit code.
 *
 * @author arv@google.com (Erik Arvidsson)
 * @author brenneman@google.com (Shawn Brenneman)
 */
/**
 * A Deferred represents the result of an asynchronous operation. A Deferred
 * instance has no result when it is created, and is "fired" (given an initial
 * result) by calling `callback` or `errback`.
 *
 * Once fired, the result is passed through a sequence of callback functions
 * registered with `addCallback` or `addErrback`. The functions may
 * mutate the result before it is passed to the next function in the sequence.
 *
 * Callbacks and errbacks may be added at any time, including after the Deferred
 * has been "fired". If there are no pending actions in the execution sequence
 * of a fired Deferred, any new callback functions will be called with the last
 * computed result. Adding a callback function is the only way to access the
 * result of the Deferred.
 *
 * If a Deferred operation is canceled, an optional user-provided cancellation
 * function is invoked which may perform any special cleanup, followed by firing
 * the Deferred's errback sequence with a `CanceledError`. If the
 * Deferred has already fired, cancellation is ignored.
 *
 * Deferreds may be templated to a specific type they produce using generics
 * with syntax such as:
 *
 *    /** @type {Deferred<string>} *\
 *    var d = new Deferred();
 *    // Compiler can infer that foo is a string.
 *    d.addCallback(function(foo) {...});
 *    d.callback('string');  // Checked to be passed a string
 *
 * Since deferreds are often used to produce different values across a chain,
 * the type information is not propagated across chains, but rather only
 * associated with specifically cast objects.
 *
 *     Deferred is canceled. If provided, this function runs before the
 *     Deferred is fired with a `CanceledError`.
 *     callbacks and errbacks in.
 * @implements {Thenable<VALUE>}
 * @template VALUE
 */
export class Deferred<VALUE> implements Thenable<VALUE> {
    /**
     * Creates a Deferred that has an initial result.
     *
     * @param {*=} opt_result The result.
     * @return {!Deferred} The new Deferred.
     */
    static succeed(opt_result?: any | undefined): Deferred;
    /**
     * Creates a Deferred that fires when the given promise resolves.
     * Use only during migration to Promises.
     *
     * Note: If the promise resolves to a thenable value (which is not allowed by
     * conforming promise implementations), then the deferred may behave
     * unexpectedly as it tries to wait on it. This should not be a risk when using
     * GoogPromise, Deferred, or native Promise objects.
     *
     * @param {!IThenable<T>} promise
     * @return {!Deferred<T>} The new Deferred.
     * @template T
     */
    static fromPromise<T_5>(promise: any): Deferred<T_5>;
    /**
     * Creates a Deferred that has an initial error result.
     *
     * @param {*} res The error result.
     * @return {!Deferred} The new Deferred.
     */
    static fail(res: any): Deferred;
    /**
     * Creates a Deferred that has already been canceled.
     *
     * @return {!Deferred} The new Deferred.
     */
    static canceled(): Deferred;
    /**
     * Normalizes values that may or may not be Deferreds.
     *
     * If the input value is a Deferred, the Deferred is branched (so the original
     * execution sequence is not modified) and the input callback added to the new
     * branch. The branch is returned to the caller.
     *
     * If the input value is not a Deferred, the callback will be executed
     * immediately and an already firing Deferred will be returned to the caller.
     *
     * In the following (contrived) example, if <code>isImmediate</code> is true
     * then 3 is alerted immediately, otherwise 6 is alerted after a 2-second delay.
     *
     * <pre>
     * var value;
     * if (isImmediate) {
     *   value = 3;
     * } else {
     *   value = new Deferred();
     *   setTimeout(function() { value.callback(6); }, 2000);
     * }
     *
     * var d = Deferred.when(value, alert);
     * </pre>
     *
     * @param {*} value Deferred or normal value to pass to the callback.
     * @param {function(this:T, ?):?} callback The callback to execute.
     * @param {T=} opt_scope An optional scope to call the callback in.
     * @return {!Deferred} A new Deferred that will call the input
     *     callback with the input value.
     * @template T
     */
    static when<T_6>(value: any, callback: (this: T_6, arg1: unknown) => unknown, opt_scope?: T_6 | undefined): Deferred;
    /**
     * Schedules an error to be thrown after a delay.
     * @param {*} error Error from a failing deferred.
     * @return {number} Id of the error.
     * @private
     */
    private static scheduleError_;
    /**
     * Unschedules an error from being thrown.
     * @param {number} id Id of the deferred error to unschedule.
     * @private
     */
    private static unscheduleError_;
    /**
     * Asserts that there are no pending deferred errors. If there are any
     * scheduled errors, one will be thrown immediately to make this function fail.
     */
    static assertNoErrors(): void;
    /**
     * A Deferred represents the result of an asynchronous operation. A Deferred
     * instance has no result when it is created, and is "fired" (given an initial
     * result) by calling `callback` or `errback`.
     *
     * Once fired, the result is passed through a sequence of callback functions
     * registered with `addCallback` or `addErrback`. The functions may
     * mutate the result before it is passed to the next function in the sequence.
     *
     * Callbacks and errbacks may be added at any time, including after the Deferred
     * has been "fired". If there are no pending actions in the execution sequence
     * of a fired Deferred, any new callback functions will be called with the last
     * computed result. Adding a callback function is the only way to access the
     * result of the Deferred.
     *
     * If a Deferred operation is canceled, an optional user-provided cancellation
     * function is invoked which may perform any special cleanup, followed by firing
     * the Deferred's errback sequence with a `CanceledError`. If the
     * Deferred has already fired, cancellation is ignored.
     *
     * Deferreds may be templated to a specific type they produce using generics
     * with syntax such as:
     *
     *    /** @type {Deferred<string>} *\
     *    var d = new Deferred();
     *    // Compiler can infer that foo is a string.
     *    d.addCallback(function(foo) {...});
     *    d.callback('string');  // Checked to be passed a string
     *
     * Since deferreds are often used to produce different values across a chain,
     * the type information is not propagated across chains, but rather only
     * associated with specifically cast objects.
     *
     * @param {Function=} opt_onCancelFunction A function that will be called if the
     *     Deferred is canceled. If provided, this function runs before the
     *     Deferred is fired with a `CanceledError`.
     * @param {Object=} opt_defaultScope The default object context to call
     *     callbacks and errbacks in.
     * @template VALUE
     */
    constructor(opt_onCancelFunction?: Function | undefined, opt_defaultScope?: any | undefined);
    /**
     * Entries in the sequence are arrays containing a callback, an errback, and
     * an optional scope. The callback or errback in an entry may be null.
     * @type {!Array<!Array>}
     * @private
     */
    private sequence_;
    /**
     * Optional function that will be called if the Deferred is canceled.
     * @type {Function|undefined}
     * @private
     */
    private onCancelFunction_;
    /**
     * The default scope to execute callbacks and errbacks in.
     * @type {?Object}
     * @private
     */
    private defaultScope_;
    /**
     * Whether the Deferred has been fired.
     * @type {boolean}
     * @private
     */
    private fired_;
    /**
     * Whether the last result in the execution sequence was an error.
     * @type {boolean}
     * @private
     */
    private hadError_;
    /**
     * The current Deferred result, updated as callbacks and errbacks are
     * executed.
     * @type {*}
     * @private
     */
    private result_;
    /**
     * Whether the Deferred is blocked waiting on another Deferred to fire. If a
     * callback or errback returns a Deferred as a result, the execution sequence
     * is blocked until that Deferred result becomes available.
     * @type {boolean}
     * @private
     */
    private blocked_;
    /**
     * Whether this Deferred is blocking execution of another Deferred. If this
     * instance was returned as a result in another Deferred's execution
     * sequence,that other Deferred becomes blocked until this instance's
     * execution sequence completes. No additional callbacks may be added to a
     * Deferred once it is blocking another instance.
     * @type {boolean}
     * @private
     */
    private blocking_;
    /**
     * Whether the Deferred has been canceled without having a custom cancel
     * function.
     * @type {boolean}
     * @private
     */
    private silentlyCanceled_;
    /**
     * If an error is thrown during Deferred execution with no errback to catch
     * it, the error is rethrown after a timeout. Reporting the error after a
     * timeout allows execution to continue in the calling context (empty when
     * no error is scheduled).
     * @type {number}
     * @private
     */
    private unhandledErrorId_;
    /**
     * If this Deferred was created by branch(), this will be the "parent"
     * Deferred.
     * @type {?Deferred}
     * @private
     */
    private parent_;
    /**
     * The number of Deferred objects that have been branched off this one. This
     * will be decremented whenever a branch is fired or canceled.
     * @type {number}
     * @private
     */
    private branches_;
    /**
     * Holds the stack trace at time of deferred creation if the JS engine
     * provides the Error.captureStackTrace API.
     * @private {?string}
     */
    private constructorStack_;
    /**
     * Cancels a Deferred that has not yet been fired, or is blocked on another
     * deferred operation. If this Deferred is waiting for a blocking Deferred to
     * fire, the blocking Deferred will also be canceled.
     *
     * If this Deferred was created by calling branch() on a parent Deferred with
     * opt_propagateCancel set to true, the parent may also be canceled. If
     * opt_deepCancel is set, cancel() will be called on the parent (as well as any
     * other ancestors if the parent is also a branch). If one or more branches were
     * created with opt_propagateCancel set to true, the parent will be canceled if
     * cancel() is called on all of those branches.
     *
     * @param {boolean=} opt_deepCancel If true, cancels this Deferred's parent even
     *     if cancel() hasn't been called on some of the parent's branches. Has no
     *     effect on a branch without opt_propagateCancel set to true.
     */
    cancel(opt_deepCancel?: boolean | undefined): void;
    /**
     * Handle a single branch being canceled. Once all branches are canceled, this
     * Deferred will be canceled as well.
     *
     * @private
     */
    private branchCancel_;
    /**
     * Called after a blocking Deferred fires. Unblocks this Deferred and resumes
     * its execution sequence.
     *
     * @param {boolean} isSuccess Whether the result is a success or an error.
     * @param {*} res The result of the blocking Deferred.
     * @private
     */
    private continue_;
    /**
     * Updates the current result based on the success or failure of the last action
     * in the execution sequence.
     *
     * @param {boolean} isSuccess Whether the new result is a success or an error.
     * @param {*} res The result.
     * @private
     */
    private updateResult_;
    /**
     * Verifies that the Deferred has not yet been fired.
     *
     * @private
     * @throws {Error} If this has already been fired.
     */
    private check_;
    /**
     * Fire the execution sequence for this Deferred by passing the starting result
     * to the first registered callback.
     * @param {VALUE=} opt_result The starting result.
     */
    callback(opt_result?: VALUE | undefined): void;
    /**
     * Fire the execution sequence for this Deferred by passing the starting error
     * result to the first registered errback.
     * @param {*=} opt_result The starting error.
     */
    errback(opt_result?: any | undefined): void;
    /**
     * Attempt to make the error's stack trace be long in that it contains the
     * stack trace from the point where the deferred was created on top of the
     * current stack trace to give additional context.
     * @param {*} error
     * @private
     * @suppress {missingProperties} error.stack
     */
    private makeStackTraceLong_;
    /**
     * Asserts that an object is not a Deferred.
     * @param {*} obj The object to test.
     * @throws {Error} Throws an exception if the object is a Deferred.
     * @private
     */
    private assertNotDeferred_;
    /**
     * Register a callback function to be called with a successful result. If no
     * value is returned by the callback function, the result value is unchanged. If
     * a new value is returned, it becomes the Deferred result and will be passed to
     * the next callback in the execution sequence.
     *
     * If the function throws an error, the error becomes the new result and will be
     * passed to the next errback in the execution chain.
     *
     * If the function returns a Deferred, the execution sequence will be blocked
     * until that Deferred fires. Its result will be passed to the next callback (or
     * errback if it is an error result) in this Deferred's execution sequence.
     *
     * @param {function(this:T,VALUE):?} cb The function to be called with a
     *     successful result.
     * @param {T=} opt_scope An optional scope to call the callback in.
     * @return {!Deferred} This Deferred.
     * @template T
     */
    addCallback<T>(cb: (this: T, arg1: VALUE) => unknown, opt_scope?: T | undefined): Deferred;
    /**
     * Register a callback function to be called with an error result. If no value
     * is returned by the function, the error result is unchanged. If a new error
     * value is returned or thrown, that error becomes the Deferred result and will
     * be passed to the next errback in the execution sequence.
     *
     * If the errback function handles the error by returning a non-error value,
     * that result will be passed to the next normal callback in the sequence.
     *
     * If the function returns a Deferred, the execution sequence will be blocked
     * until that Deferred fires. Its result will be passed to the next callback (or
     * errback if it is an error result) in this Deferred's execution sequence.
     *
     * @param {function(this:T,?):?} eb The function to be called on an
     *     unsuccessful result.
     * @param {T=} opt_scope An optional scope to call the errback in.
     * @return {!Deferred<VALUE>} This Deferred.
     * @template T
     */
    addErrback<T>(eb: (this: T, arg1: unknown) => unknown, opt_scope?: T | undefined): Deferred<VALUE>;
    /**
     * Registers one function as both a callback and errback.
     *
     * @param {function(this:T,?):?} f The function to be called on any result.
     * @param {T=} opt_scope An optional scope to call the function in.
     * @return {!Deferred} This Deferred.
     * @template T
     */
    addBoth<T>(f: (this: T, arg1: unknown) => unknown, opt_scope?: T | undefined): Deferred;
    /**
     * Like addBoth, but propagates uncaught exceptions in the errback.
     *
     * @param {function(this:T,?):?} f The function to be called on any result.
     * @param {T=} opt_scope An optional scope to call the function in.
     * @return {!Deferred<VALUE>} This Deferred.
     * @template T
     */
    addFinally<T>(f: (this: T, arg1: unknown) => unknown, opt_scope?: T | undefined): Deferred<VALUE>;
    /**
     * Registers a callback function and an errback function at the same position
     * in the execution sequence. Only one of these functions will execute,
     * depending on the error state during the execution sequence.
     *
     * NOTE: This is not equivalent to {@code def.addCallback().addErrback()}! If
     * the callback is invoked, the errback will be skipped, and vice versa.
     *
     * @param {?(function(this:T,VALUE):?)} cb The function to be called on a
     *     successful result.
     * @param {?(function(this:T,?):?)} eb The function to be called on an
     *     unsuccessful result.
     * @param {T=} opt_scope An optional scope to call the functions in.
     * @return {!Deferred} This Deferred.
     * @template T
     */
    addCallbacks<T_4>(cb: ((this: T_4, arg1: VALUE) => unknown) | null, eb: ((this: T_4, arg1: unknown) => unknown) | null, opt_scope?: T_4 | undefined): Deferred;
    /**
     * Implements {@see Thenable} for seamless integration with
     * {@see GoogPromise}.
     * Deferred results are mutable and may represent multiple values over
     * their lifetime. Calling `then` on a Deferred returns a Promise
     * with the result of the Deferred at that point in its callback chain.
     * Note that if the Deferred result is never mutated, and only
     * `then` calls are made, the Deferred will behave like a Promise.
     *
     * @override
     */
    then(opt_onFulfilled?: any, opt_onRejected?: any, opt_context?: any): GoogPromise<any, any>;
    /**
     * Links another Deferred to the end of this Deferred's execution sequence. The
     * result of this execution sequence will be passed as the starting result for
     * the chained Deferred, invoking either its first callback or errback.
     *
     * @param {!Deferred} otherDeferred The Deferred to chain.
     * @return {!Deferred} This Deferred.
     */
    chainDeferred(otherDeferred: Deferred): Deferred;
    /**
     * Makes this Deferred wait for another Deferred's execution sequence to
     * complete before continuing.
     *
     * This is equivalent to adding a callback that returns `otherDeferred`,
     * but doesn't prevent additional callbacks from being added to
     * `otherDeferred`.
     *
     * @param {!Deferred|!Thenable} otherDeferred The Deferred
     *     to wait for.
     * @return {!Deferred} This Deferred.
     */
    awaitDeferred(otherDeferred: Deferred | Thenable): Deferred;
    /**
     * Creates a branch off this Deferred's execution sequence, and returns it as a
     * new Deferred. The branched Deferred's starting result will be shared with the
     * parent at the point of the branch, even if further callbacks are added to the
     * parent.
     *
     * All branches at the same stage in the execution sequence will receive the
     * same starting value.
     *
     * @param {boolean=} opt_propagateCancel If cancel() is called on every child
     *     branch created with opt_propagateCancel, the parent will be canceled as
     *     well.
     * @return {!Deferred<VALUE>} A Deferred that will be started with
     *     the computed result from this stage in the execution sequence.
     */
    branch(opt_propagateCancel?: boolean | undefined): Deferred<VALUE>;
    /**
     * @return {boolean} Whether the execution sequence has been started on this
     *     Deferred by invoking `callback` or `errback`.
     */
    hasFired(): boolean;
    /**
     * @param {*} res The latest result in the execution sequence.
     * @return {boolean} Whether the current result is an error that should cause
     *     the next errback to fire. May be overridden by subclasses to handle
     *     special error types.
     * @protected
     */
    protected isError(res: any): boolean;
    /**
     * @return {boolean} Whether an errback exists in the remaining sequence.
     * @private
     */
    private hasErrback_;
    /**
     * Exhausts the execution sequence while a result is available. The result may
     * be modified by callbacks or errbacks, and execution will block if the
     * returned result is an incomplete Deferred.
     *
     * @private
     */
    private fire_;
}
export namespace Deferred {
    export { Error_ };
    export const errorMap_: {};
}
/**
 * @type {boolean} Whether to attempt to make stack traces long.  Defaults to
 * false.
 */
export const LONG_STACK_TRACES: boolean;
/**
 * @type {boolean} Whether unhandled errors should always get rethrown to the
 * global scope. Defaults to false.
 */
export const STRICT_ERRORS: boolean;
import { Error as DebugError } from "../../debug/error.js";
import { Thenable } from "../../promise/promise.js";
import { Promise as GoogPromise } from "../../promise/promise.js";
declare class Error_ {
    /**
     * Wrapper around errors that are scheduled to be thrown by failing deferreds
     * after a timeout.
     *
     * @param {*} error Error from a failing deferred.
     * @private
     */
    private constructor();
    /** @const @private {number} */
    private id_;
    /** @const @private {*} */
    private error_;
    /**
     * Actually throws the error and removes it from the list of pending
     * deferred errors.
     */
    throwError(): void;
    /**
     * Resets the error throw timer.
     */
    resetTimer(): void;
}
export {};
