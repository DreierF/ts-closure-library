import * as google from './../google.js';
import * as googjson from './../json/json.js';
import {ErrorCode} from './errorcode.js';
import {Mechanism} from './mechanism/mechanism.js';
// Copyright 2011 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
    this.mechanism.set(key, googjson.serialize(value));
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