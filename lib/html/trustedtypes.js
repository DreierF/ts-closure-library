import * as google from './../google.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Policy to convert strings to Trusted Types. See
 * https://github.com/WICG/trusted-types for details.
 */

/**
 * @type {string} Name for the Trusted Types policy used in Closure Safe
 * Types. Differs from `google.TRUSTED_TYPES_POLICY_NAME` in that the latter is
 * also used for other purposes like the debug loader. If empty, Closure Safe
 * Types will not use Trusted Types. Default is `google.TRUSTED_TYPES_POLICY_NAME`
 * plus the suffix `#html`, unless `google.TRUSTED_TYPES_POLICY_NAME` is empty.
 * @package
 */
const POLICY_NAME = google.TRUSTED_TYPES_POLICY_NAME ? google.TRUSTED_TYPES_POLICY_NAME + '#html' :
                                     '';

/**
 * Cached result of goog.createTrustedTypesPolicy.
 * @type {?TrustedTypePolicy|undefined}
 * @private
 */
let cachedPolicy_;

/**
 * Creates a (singleton) Trusted Type Policy for Safe HTML Types.
 * @return {?TrustedTypePolicy}
 * @package
 */
function getPolicyPrivateDoNotAccessOrElse() {
  if (!POLICY_NAME) {
    // Binary not configured for Trusted Types.
    return null;
  }

  if (cachedPolicy_ === undefined) {
    cachedPolicy_ =
        google.createTrustedTypesPolicy(POLICY_NAME);
  }

  return cachedPolicy_;
};

export {POLICY_NAME, getPolicyPrivateDoNotAccessOrElse};