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
 * @fileoverview Defines the collection interface.
 */

/**
 * An interface for a collection of values.
 * @interface
 * @template T
 */
class Collection {

  /**
   * An interface for a collection of values.
   * @template T
   */
  constructor() {}

  /**
   * @param {T} value Value to add to the collection.
   */
  add(value) {}

  /**
   * @param {T} value Value to remove from the collection.
   */
  remove(value) {}

  /**
   * @param {T} value Value to find in the collection.
   * @return {boolean} Whether the collection contains the specified value.
   */
  contains(value) {}

  /**
   * @return {number} The number of values stored in the collection.
   */
  getCount() {}
}

export {Collection};