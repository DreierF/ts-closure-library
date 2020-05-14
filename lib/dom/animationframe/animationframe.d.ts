export type Spec = {
    measure: (Function | undefined);
    mutate: (Function | undefined);
};
export type Task_ = {
    id: number;
    fn: Function;
    context: (any | undefined);
};
export type TaskSet_ = {
    measureTask: Task_;
    mutateTask: Task_;
    state: (any | undefined);
    args: (Array | undefined);
    isScheduled: boolean;
};
/**
 * @typedef {{
 *   measure: (!Function|undefined),
 *   mutate: (!Function|undefined)
 * }}
 */
export let Spec: any;
/**
 * A type to represent state. Users may add properties as desired.
 * @final
 */
export class State {
}
/**
 * Returns a function that schedules the two passed-in functions to be run upon
 * the next animation frame. Calling the function again during the same
 * animation frame does nothing.
 *
 * The function under the "measure" key will run first and together with all
 * other functions scheduled under this key and the function under "mutate" will
 * run after that.
 *
 * @param {{
 *   measure: (function(this:THIS, !State)|undefined),
 *   mutate: (function(this:THIS, !State)|undefined)
 * }} spec
 * @param {THIS=} opt_context Context in which to run the function.
 * @return {function(...?)}
 * @template THIS
 */
export function createTask<THIS>(spec: {
    measure: ((this: THIS, arg1: State) => any) | undefined;
    mutate: ((this: THIS, arg1: State) => any) | undefined;
}, opt_context?: THIS | undefined): (...args: unknown[]) => void;
/**
 * @return {boolean} Whether the animationframe is currently running. For use
 *     by callers who need not to delay tasks scheduled during runTasks_ for an
 *     additional frame.
 */
export function isRunning(): boolean;
/**
 * @typedef {{
 *   id: number,
 *   fn: !Function,
 *   context: (!Object|undefined)
 * }}
 * @private
 */
declare let Task_: any;
export {};
