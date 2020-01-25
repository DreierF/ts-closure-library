import * as asserts from './../../asserts/asserts.js';
import {Iterator} from './../../iter/iter.js';
import {StopIteration} from './../../iter/iter.js';
import {ErrorCode} from './errorcode.js';
import {IterableMechanism} from './iterablemechanism.js';
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
 * @fileoverview Base class that implements functionality common
 * across both session and local web storage mechanisms.
 */

/**
 * Provides a storage mechanism that uses HTML5 Web storage.
 *
 * @class
 * @extends {IterableMechanism}
 */
class HTML5WebStorage extends IterableMechanism {

  /**
   * Provides a storage mechanism that uses HTML5 Web storage.
   *
   * @param {Storage} storage The Web storage object.
   */
  constructor(storage) {
    super();
  
    /**
     * The web storage object (window.localStorage or window.sessionStorage).
     * @private {Storage}
     */
    this.storage_ = storage;
  }

  /**
   * Determines whether or not the mechanism is available.
   * It works only if the provided web storage object exists and is enabled.
   *
   * @return {boolean} True if the mechanism is available.
   */
  isAvailable() {
    if (!this.storage_) {
      return false;
    }
  
    try {
      // setItem will throw an exception if we cannot access WebStorage (e.g.,
      // Safari in private mode).
      this.storage_.setItem(
          HTML5WebStorage.STORAGE_AVAILABLE_KEY_, '1');
      this.storage_.removeItem(
          HTML5WebStorage.STORAGE_AVAILABLE_KEY_);
      return true;
    } catch (e) {
      return false;
    }
  };

  /** @override */
  set(key, value) {
  
    try {
      // May throw an exception if storage quota is exceeded.
      this.storage_.setItem(key, value);
    } catch (e) {
      // In Safari Private mode, conforming to the W3C spec, invoking
      // Storage.prototype.setItem will allways throw a QUOTA_EXCEEDED_ERR
      // exception.  Since it's impossible to verify if we're in private browsing
      // mode, we throw a different exception if the storage is empty.
      if (this.storage_.length == 0) {
        throw ErrorCode.STORAGE_DISABLED;
      } else {
        throw ErrorCode.QUOTA_EXCEEDED;
      }
    }
  };

  /** @override */
  get(key) {
    // According to W3C specs, values can be of any type. Since we only save
    // strings, any other type is a storage error. If we returned nulls for
    // such keys, i.e., treated them as non-existent, this would lead to a
    // paradox where a key exists, but it does not when it is retrieved.
    // http://www.w3.org/TR/2009/WD-webstorage-20091029/#the-storage-interface
    var value = this.storage_.getItem(key);
    if (typeof value !== 'string' && value !== null) {
      throw ErrorCode.INVALID_VALUE;
    }
    return value;
  };

  /** @override */
  remove(key) {
    this.storage_.removeItem(key);
  };

  /** @override */
  getCount() {
    return this.storage_.length;
  };

  /** @override */
  __iterator__(
      opt_keys) {
    var i = 0;
    var storage = this.storage_;
    var newIter = new Iterator();
    newIter.next = function() {
      if (i >= storage.length) {
        throw StopIteration;
      }
      var key = asserts.assertString(storage.key(i++));
      if (opt_keys) {
        return key;
      }
      var value = storage.getItem(key);
      // The value must exist and be a string, otherwise it is a storage error.
      if (typeof value !== 'string') {
        throw ErrorCode.INVALID_VALUE;
      }
      return value;
    };
    return newIter;
  };

  /** @override */
  clear() {
    this.storage_.clear();
  };

  /**
   * Gets the key for a given key index. If an index outside of
   * [0..this.getCount()) is specified, this function returns null.
   * @param {number} index A key index.
   * @return {?string} A storage key, or null if the specified index is out of
   *     range.
   */
  key(index) {
    return this.storage_.key(index);
  };
}

/**
 * The key used to check if the storage instance is available.
 * @private {string}
 * @const
 */
HTML5WebStorage.STORAGE_AVAILABLE_KEY_ = '__sak';

export {HTML5WebStorage};