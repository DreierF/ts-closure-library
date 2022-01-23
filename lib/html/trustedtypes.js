import * as google from './../google.js';
import {memoize} from './../memoize/memoize.js';
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
 * Creates a (singleton) Trusted Type Policy for Safe HTML Types.
 * @return {?TrustedTypePolicy}
 * @package
 */
function getPolicyPrivateDoNotAccessOrElse() {
  if (!google.TRUSTED_TYPES_POLICY_NAME) {
    // Binary not configured for Trusted Types.
    return null;
  }
  return memoize(google.createTrustedTypesPolicy)(
      google.TRUSTED_TYPES_POLICY_NAME + '#html');
};

export {getPolicyPrivateDoNotAccessOrElse};