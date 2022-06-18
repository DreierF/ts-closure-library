/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Provides a function to schedule running a function as soon
 * as possible after the current JS execution stops and yields to the event
 * loop.
 */
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
    function useSetImmediate_(): boolean;
    const nextTickImpl: (arg0: () => any) => any;
    function getNextTickImpl_(): (arg0: () => any) => any;
    const wrapCallback_: typeof functions.identity;
}
import * as functions from "../functions/functions.js";
