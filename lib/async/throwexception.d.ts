/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Provides a function to throw an error without interrupting
 * the current execution context.
 */
/**
 * Throw an item without interrupting the current execution context.  For
 * example, if processing a group of items in a loop, sometimes it is useful
 * to report an error while still allowing the rest of the batch to be
 * processed.
 * @param {*} exception
 */
export function throwException(exception: any): void;
