/**
 * @type {boolean} Whether the return value cache should be used.
 *    This should only be used to disable caches when testing.
 */
export const CACHE_RETURN_VALUE: boolean;
/**
 * Always returns false.
 * @type {function(...): boolean}
 */
export function FALSE(): boolean;
/**
 * Always returns NULL.
 * @type {function(...): null}
 */
export function NULL(): null;
/**
 * Always returns true.
 * @type {function(...): boolean}
 */
export function TRUE(): boolean;
/**
 * Creates a function that returns true if each of its components evaluates
 * to true. The components are evaluated in order, and the evaluation will be
 * short-circuited as soon as a function returns false.
 * For example, (and(f, g))(x) is equivalent to f(x) && g(x).
 * @param {...Function} var_args A list of functions.
 * @return {function(...?):boolean} A function that ANDs its component
 *      functions.
 */
export function and(...args: Function[]): (...args: unknown[]) => boolean;
/**
 * Gives a wrapper function that caches the return value of a parameterless
 * function when first called.
 *
 * When called for the first time, the given function is called and its
 * return value is cached (thus this is only appropriate for idempotent
 * functions).  Subsequent calls will return the cached return value. This
 * allows the evaluation of expensive functions to be delayed until first used.
 *
 * To cache the return values of functions with parameters, see goog.memoize.
 *
 * @param {function():T} fn A function to lazily evaluate.
 * @return {function():T} A wrapped version the function.
 * @template T
 */
export function cacheReturnValue<T>(fn: () => T): () => T;
/**
 * Creates the composition of the functions passed in.
 * For example, (compose(f, g))(a) is equivalent to f(g(a)).
 * @param {function(...?):T} fn The final function.
 * @param {...Function} var_args A list of functions.
 * @return {function(...?):T} The composition of all inputs.
 * @template T
 */
export function compose<T>(fn: (...arg0: unknown[]) => T, ...args: Function[]): (...arg0: unknown[]) => T;
/**
 * @fileoverview Utilities for creating functions. Loosely inspired by these
 * java classes from the Guava library:
 * com.google.common.base.Functions
 * https://google.github.io/guava/releases/snapshot-jre/api/docs/index.html?com/google/common/base/Functions.html
 *
 * com.google.common.base.Predicates
 * https://google.github.io/guava/releases/snapshot-jre/api/docs/index.html?com/google/common/base/Predicates.html
 *
 * More about these can be found at
 * https://github.com/google/guava/wiki/FunctionalExplained
 */
/**
 * Creates a function that always returns the same value.
 * @param {T} retValue The value to return.
 * @return {function():T} The new function.
 * @template T
 */
export function constant<T>(retValue: T): () => T;
/**
 * Generic factory function to construct an object given the constructor
 * and the arguments. Intended to be bound to create object factories.
 *
 * Example:
 *
 * var factory = google.partial(create, Class);
 *
 * @param {function(new:T, ...)} constructor The constructor for the Object.
 * @param {...*} var_args The arguments to be passed to the constructor.
 * @return {T} A new instance of the class given in `constructor`.
 * @template T
 */
export function create<T>(constructor: new (...arg1: any[]) => T, ...args: any[]): T;
/**
 * Wraps a function to allow it to be called, at most, once per interval
 * (specified in milliseconds). If the wrapper function is called N times within
 * that interval, only the Nth call will go through.
 *
 * This is particularly useful for batching up repeated actions where the
 * last action should win. This can be used, for example, for refreshing an
 * autocomplete pop-up every so often rather than updating with every keystroke,
 * since the final text typed by the user is the one that should produce the
 * final autocomplete results. For more stateful debouncing with support for
 * pausing, resuming, and canceling debounced actions, use
 * `goog.async.Debouncer`.
 *
 * @param {function(this:SCOPE, ...?)} f Function to call.
 * @param {number} interval Interval over which to debounce. The function will
 *     only be called after the full interval has elapsed since the last call.
 * @param {SCOPE=} opt_scope Object in whose scope to call the function.
 * @return {function(...?): undefined} Wrapped function.
 * @template SCOPE
 */
export function debounce<SCOPE>(f: (this: SCOPE, ...arg1: unknown[]) => any, interval: number, opt_scope?: SCOPE | undefined): (...args: unknown[]) => undefined;
/**
 * Creates a function that returns whether its argument equals the given value.
 *
 * Example:
 * var key = goog.object.findKey(obj, equalTo('needle'));
 *
 * @param {*} value The value to compare to.
 * @param {boolean=} opt_useLooseComparison Whether to use a loose (==)
 *     comparison rather than a strict (===) one. Defaults to false.
 * @return {function(*):boolean} The new function.
 */
export function equalTo(value: any, opt_useLooseComparison?: boolean | undefined): (arg0: any) => boolean;
/**
 * Creates a function that always throws an error with the given message.
 * @param {string} message The error message.
 * @return {!Function} The error-throwing function.
 */
export function error(message: string): Function;
/**
 * Creates a function that throws the given object.
 * @param {*} err An object to be thrown.
 * @return {!Function} The error-throwing function.
 */
export function fail(err: any): Function;
/**
 * A simple function that returns the first argument of whatever is passed
 * into it.
 * @param {T=} opt_returnValue The single value that will be returned.
 * @param {...*} var_args Optional trailing arguments. These are ignored.
 * @return {T} The first argument passed in, or undefined if nothing was passed.
 * @template T
 */
export function identity<T>(opt_returnValue?: T | undefined, ...var_args: any[]): T;
/**
 * Given a function, create a function that keeps opt_numArgs arguments and
 * silently discards all additional arguments.
 * @param {?Function} f The original function.
 * @param {number=} opt_numArgs The number of arguments to keep. Defaults to 0.
 * @return {!Function} A version of f that only keeps the first opt_numArgs
 *     arguments.
 */
export function lock(f: Function | null, opt_numArgs?: number | undefined): Function;
/**
 * Creates a function that returns the Boolean opposite of a provided function.
 * For example, (not(f))(x) is equivalent to !f(x).
 * @param {!Function} f The original function.
 * @return {function(...?):boolean} A function that delegates to f and returns
 * opposite.
 */
export function not(f: Function): (...args: unknown[]) => boolean;
/**
 * Creates a function that returns its nth argument.
 * @param {number} n The position of the return argument.
 * @return {!Function} A new function.
 */
export function nth(n: number): Function;
/**
 * Wraps a function to allow it to be called, at most, once. All
 * additional calls are no-ops.
 *
 * This is particularly useful for initialization functions
 * that should be called, at most, once.
 *
 * @param {function():*} f Function to call.
 * @return {function():undefined} Wrapped function.
 */
export function once(f: () => any): () => undefined;
/**
 * Creates a function that returns true if any of its components evaluates
 * to true. The components are evaluated in order, and the evaluation will be
 * short-circuited as soon as a function returns true.
 * For example, (or(f, g))(x) is equivalent to f(x) || g(x).
 * @param {...Function} var_args A list of functions.
 * @return {function(...?):boolean} A function that ORs its component
 *    functions.
 */
export function or(...args: Function[]): (...args: unknown[]) => boolean;
/**
 * Like google.partial(), except that arguments are added after arguments to the
 * returned function.
 *
 * Usage:
 * function f(arg1, arg2, arg3, arg4) { ... }
 * var g = partialRight(f, arg3, arg4);
 * g(arg1, arg2);
 *
 * @param {!Function} fn A function to partially apply.
 * @param {...*} var_args Additional arguments that are partially applied to fn
 *     at the end.
 * @return {!Function} A partially-applied form of the function google.partial()
 *     was invoked as a method of.
 */
export function partialRight(fn: Function, ...args: any[]): Function;
/**
 * Wraps a function to allow it to be called, at most, once per interval
 * (specified in milliseconds). If the wrapper function is called N times within
 * that interval, only the 1st call will go through.
 *
 * This is particularly useful for limiting repeated user requests where the
 * first request is guaranteed to have all the data required to perform the
 * final action, so there's no need to wait until the end of the interval before
 * sending the request out.
 *
 * @param {function(this:SCOPE, ...?)} f Function to call.
 * @param {number} interval Interval over which to rate-limit. The function will
 *     only be called once per interval, and ignored for the remainer of the
 *     interval.
 * @param {SCOPE=} opt_scope Object in whose scope to call the function.
 * @return {function(...?): undefined} Wrapped function.
 * @template SCOPE
 */
export function rateLimit<SCOPE>(f: (this: SCOPE, ...arg1: unknown[]) => any, interval: number, opt_scope?: SCOPE | undefined): (...args: unknown[]) => undefined;
/**
 * Creates a function that calls the functions passed in in sequence, and
 * returns the value of the last function. For example,
 * (sequence(f, g))(x) is equivalent to f(x),g(x).
 * @param {...Function} var_args A list of functions.
 * @return {!Function} A function that calls all inputs in sequence.
 */
export function sequence(...args: Function[]): Function;
/**
 * Wraps a function to allow it to be called, at most, once per interval
 * (specified in milliseconds). If the wrapper function is called N times in
 * that interval, both the 1st and the Nth calls will go through.
 *
 * This is particularly useful for limiting repeated user requests where the
 * the last action should win, but you also don't want to wait until the end of
 * the interval before sending a request out, as it leads to a perception of
 * slowness for the user.
 *
 * @param {function(this:SCOPE, ...?)} f Function to call.
 * @param {number} interval Interval over which to throttle. The function can
 *     only be called once per interval.
 * @param {SCOPE=} opt_scope Object in whose scope to call the function.
 * @return {function(...?): undefined} Wrapped function.
 * @template SCOPE
 */
export function throttle<SCOPE>(f: (this: SCOPE, ...arg1: unknown[]) => any, interval: number, opt_scope?: SCOPE | undefined): (...args: unknown[]) => undefined;
/**
 * Given a function, create a new function that swallows its return value
 * and replaces it with a new one.
 * @param {?Function} f A function.
 * @param {T} retValue A new return value.
 * @return {function(...?):T} A new function.
 * @template T
 */
export function withReturnValue<T>(f: Function | null, retValue: T): (...arg0: unknown[]) => T;
