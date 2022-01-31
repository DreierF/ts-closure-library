/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview The dispose method is used to clean up references and
 * resources.
 */
/**
 * Calls `dispose` on the argument if it supports it. If obj is not an
 *     object with a dispose() method, this is a no-op.
 * @param {*} obj The object to dispose of.
 */
export function dispose(obj: any): void;
