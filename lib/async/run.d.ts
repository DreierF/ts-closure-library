/**
 * @type {boolean} If true, use the global Promise to implement run
 * assuming either the native, or polyfill version will be used. Does still
 * permit tests to use forceNextTick.
 */
export const ASSUME_NATIVE_PROMISE: boolean;
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
    export function initializeRunner_(): void;
    export function forceNextTick(opt_realSetTimeout?: ((arg0: () => any) => any) | undefined): void;
    export const workQueueScheduled_: boolean;
    export const workQueue_: WorkQueue;
    export function processWorkQueue(): void;
}
import { WorkQueue } from "./workqueue.js";
