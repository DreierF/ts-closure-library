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
export const POLICY_NAME: string;
/**
 * Creates a (singleton) Trusted Type Policy for Safe HTML Types.
 * @return {?TrustedTypePolicy}
 * @package
 */
export function getPolicyPrivateDoNotAccessOrElse(): any | null;
