import * as google from './../google.js';
import {ErrorCode} from './errorcode.js';
import {Mechanism} from './mechanism/mechanism.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Provides a convenient API for data persistence using a selected
 * data storage mechanism.
 */

/**
 * The base implementation for all storage APIs.
 *
 *     storage mechanism.
 * @class
 */
class Storage {

  /**
   * The base implementation for all storage APIs.
   *
   * @param {!Mechanism} mechanism The underlying
   *     storage mechanism.
   */
  constructor(mechanism) {
    /**
     * The mechanism used to persist key-value pairs.
     *
     * @protected {Mechanism}
     */
    this.mechanism = mechanism;
  }

  /**
   * Sets an item in the data storage.
   *
   * @param {string} key The key to set.
   * @param {*} value The value to serialize to a string and save.
   */
  set(key, value) {
    if (value === undefined) {
      this.mechanism.remove(key);
      return;
    }
    this.mechanism.set(key, JSON.stringify(value));
  };

  /**
   * Gets an item from the data storage.
   *
   * @param {string} key The key to get.
   * @return {*} Deserialized value or undefined if not found.
   */
  get(key) {
    var json;
    try {
      json = this.mechanism.get(key);
    } catch (e) {
      // If, for any reason, the value returned by a mechanism's get method is not
      // a string, an exception is thrown.  In this case, we must fail gracefully
      // instead of propagating the exception to clients.  See b/8095488 for
      // details.
      return undefined;
    }
    if (json === null) {
      return undefined;
    }
  
    try {
      return JSON.parse(json);
    } catch (e) {
      throw ErrorCode.INVALID_VALUE;
    }
  };

  /**
   * Removes an item from the data storage.
   *
   * @param {string} key The key to remove.
   */
  remove(key) {
    this.mechanism.remove(key);
  };
}

export {Storage};