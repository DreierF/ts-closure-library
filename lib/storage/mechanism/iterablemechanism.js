import * as googarray from './../../array/array.js';
import * as asserts from './../../asserts/asserts.js';
import * as goog_iter from './../../iter/iter.js';
import {Iterator} from './../../iter/iter.js';
import {StopIteration} from './../../iter/iter.js';
import {Mechanism} from './mechanism.js';
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
 * @fileoverview Interface for storing, retieving and scanning data using some
 * persistence mechanism.
 */

/**
 * Interface for all iterable storage mechanisms.
 *
 * @class
 * @extends {Mechanism}
 * @abstract
 */
class IterableMechanism extends Mechanism {

  /**
   * Interface for all iterable storage mechanisms.
   *
   */
  constructor() {
    super();
  }

  /**
   * Get the number of stored key-value pairs.
   *
   * Could be overridden in a subclass, as the default implementation is not very
   * efficient - it iterates over all keys.
   *
   * @return {number} Number of stored elements.
   */
  getCount() {
    var count = 0;
    goog_iter.forEach(this.__iterator__(true), function(key) {
      asserts.assertString(key);
      count++;
    });
    return count;
  };

  /**
   * Returns an iterator that iterates over the elements in the storage. Will
   * throw StopIteration after the last element.
   *
   * @param {boolean=} opt_keys True to iterate over the keys. False to iterate
   *     over the values.  The default value is false.
   * @return {!Iterator} The iterator.
   * @abstract
   */
  __iterator__(opt_keys) {}

  /**
   * Remove all key-value pairs.
   *
   * Could be overridden in a subclass, as the default implementation is not very
   * efficient - it iterates over all keys.
   */
  clear() {
    // This converts the keys to an array first because otherwise
    // removing while iterating results in unstable ordering of keys and
    // can skip keys or terminate early.
    var keys = goog_iter.toArray(this.__iterator__(true));
    var selfObj = this;
    googarray.forEach(keys, function(key) { selfObj.remove(key); });
  };
}

export {IterableMechanism};