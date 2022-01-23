/**
 * @type {boolean} Flag to disable memoization in unit tests.
 */
export const ENABLE_MEMOIZE: boolean;
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Tool for caching the result of expensive deterministic
 * functions.
 *
 * @see http://en.wikipedia.org/wiki/Memoization
 */
/**
 * Decorator around functions that caches the inner function's return values.
 *
 * To cache parameterless functions, see goog.functions.cacheReturnValue.
 *
 * @param {?Function} f The function to wrap. Its return value may only depend
 *     on its arguments and 'this' context. There may be further restrictions
 *     on the arguments depending on the capabilities of the serializer used.
 * @param {function(number, Object): string=} opt_serializer A function to
 *     serialize f's arguments. It must have the same signature as
 *     memoize.simpleSerializer. It defaults to that function.
 * @return {!Function} The wrapped function.
 */
export function memoize(f: Function | null, opt_serializer?: ((arg0: number, arg1: any) => string) | undefined): Function;
export namespace memoize {
    function clearCache(cacheOwner: any): void;
    const CACHE_PROPERTY_: string;
    function simpleSerializer(functionUid: number, args: {
        length: number;
    } | null): string;
}
