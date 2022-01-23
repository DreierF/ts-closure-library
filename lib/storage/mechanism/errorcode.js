/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Defines error codes to be thrown by storage mechanisms.
 */

/**
 * Errors thrown by storage mechanisms.
 * @enum {string}
 */
let ErrorCode = {
  INVALID_VALUE: 'Storage mechanism: Invalid value was encountered',
  QUOTA_EXCEEDED: 'Storage mechanism: Quota exceeded',
  STORAGE_DISABLED: 'Storage mechanism: Storage disabled'
};

export {ErrorCode};