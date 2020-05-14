/**
 * Fires the provided callbacks as soon as possible after the current JS
 * execution context. setTimeout(…, 0) takes at least 4ms when called from
 * within another setTimeout(…, 0) for legacy reasons.
 *
 * This will not schedule the callback as a microtask (i.e. a task that can
 * preempt user input or networking callbacks). It is meant to emulate what
 * setTimeout(_, 0) would do if it were not throttled. If you desire microtask
 * behavior, use {@see google.Promise} instead.
 *
 * @param {function(this:SCOPE)} callback Callback function to fire as soon as
 *     possible.
 * @param {SCOPE=} opt_context Object in whose scope to call the listener.
 * @param {boolean=} opt_useSetImmediate Avoid the IE workaround that
 *     ensures correctness at the cost of speed. See comments for details.
 * @template SCOPE
 */
export function nextTick<SCOPE>(callback: (this: SCOPE) => any, opt_context?: SCOPE | undefined, opt_useSetImmediate?: boolean | undefined): void;
export namespace nextTick {
    export function useSetImmediate_(): boolean;
    export const setImmediate_: (arg0: () => void) => void;
    export function getSetImmediateEmulator_(): (arg0: () => any) => any;
    export const wrapCallback_: typeof functions.identity;
}
/**
 * @fileoverview Provides a function to schedule running a function as soon
 * as possible after the current JS execution stops and yields to the event
 * loop.
 */
/**
 * Throw an item without interrupting the current execution context.  For
 * example, if processing a group of items in a loop, sometimes it is useful
 * to report an error while still allowing the rest of the batch to be
 * processed.
 * @param {*} exception
 */
export function throwException(exception: any): void;
import * as functions from "../functions/functions.js";
