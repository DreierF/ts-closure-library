import * as google from './../../google.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Defines for goog.labs.userAgent.
 */

/**
 * @type {string} Optional runtime override for the USE_CLIENT_HINTS flag.
 * If this is set (for example, to 'foo.bar') then any value of USE_CLIENT_HINTS
 * will be overridden by `globalThis.foo.bar` if it is non-null.
 * This flag will be removed in December 2021.
 */
const USE_CLIENT_HINTS_OVERRIDE = '';

/**
 * @type {boolean} If true, use navigator.userAgentData
 * TODO(user) Flip flag in 2021/12.
 */
const USE_CLIENT_HINTS_ = false;

// TODO(user): Replace the IIFE with a simple null-coalescing operator.
// NOTE: This can't be done with a helper function, or else we risk an inlining
// back-off causing a huge code size regression if a non-inlined helper function
// prevents the optimizer from detecting the (possibly large) dead code paths.
/** @const {boolean} */
export const USE_CLIENT_HINTS = (() => {
  const override = USE_CLIENT_HINTS_OVERRIDE ?
         google.getObjectByName(USE_CLIENT_HINTS_OVERRIDE) :
         null;
  return override != null ? override : USE_CLIENT_HINTS_;
})();
