/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Defines errors to be thrown by the storage.
 */

/**
 * Errors thrown by the storage.
 * @enum {string}
 */
let ErrorCode = {
  INVALID_VALUE: 'Storage: Invalid value was encountered',
  DECRYPTION_ERROR: 'Storage: The value could not be decrypted'
};

export {ErrorCode};