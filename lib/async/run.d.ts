/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @type {boolean} If true, use the global Promise to implement run
 * assuming either the native, or polyfill version will be used. Does still
 * permit tests to use forceNextTick.
 */
/**
 * Fires the provided callback just before the current callstack unwinds, or as
 * soon as possible after the current JS execution context.
 * @param {function(this:THIS)} callback
 * @param {THIS=} opt_context Object to use as the "this value" when calling
 *     the provided function.
 * @template THIS
 */
export function run<THIS>(callback: (this: THIS) => any, opt_context?: THIS | undefined): void;
export namespace run {
    function initializeRunner_(): void;
    function forceNextTick(opt_realSetTimeout?: ((arg0: () => any) => any) | undefined): void;
    const workQueueScheduled_: boolean;
    const workQueue_: WorkQueue;
    function processWorkQueue(): void;
}
import { WorkQueue } from "./workqueue.js";
