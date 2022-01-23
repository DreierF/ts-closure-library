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
  if (!google.TRUSTED_TYPES_POLICY_NAME) {
    // Binary not configured for Trusted Types.
    return null;
  }

  if (cachedPolicy_ === undefined) {
    cachedPolicy_ =
        google.createTrustedTypesPolicy(google.TRUSTED_TYPES_POLICY_NAME + '#html');
  }

  return cachedPolicy_;
};

export {getPolicyPrivateDoNotAccessOrElse};