import * as google from './../google.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Policy to convert strings to Trusted Types. See
 * https://github.com/WICG/trusted-types for details.
 *
 */

/** @package @const {?TrustedTypePolicy} */
let PRIVATE_DO_NOT_ACCESS_OR_ELSE_POLICY =
    google.TRUSTED_TYPES_POLICY_NAME ?
    google.createTrustedTypesPolicy(google.TRUSTED_TYPES_POLICY_NAME + '#html') :
    null;

export {PRIVATE_DO_NOT_ACCESS_OR_ELSE_POLICY};