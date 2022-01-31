/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview The disposeAll method is used to clean up references and
 * resources.
 */
/**
 * Calls `dispose` on each member of the list that supports it. (If the
 * member is an ArrayLike, then `google.disposeAll()` will be called
 * recursively on each of its members.) If the member is not an object with a
 * `dispose()` method, then it is ignored.
 * @param {...*} var_args The list.
 */
export function disposeAll(...args: any[]): void;
