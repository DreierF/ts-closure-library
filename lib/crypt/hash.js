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
 * @fileoverview Abstract cryptographic hash interface.
 *
 * See goog.crypt.Sha1 and goog.crypt.Md5 for sample implementations.
 */

/**
 * Create a cryptographic hash instance.
 *
 * @class
 * @abstract
 */
class Hash {

  /**
   * Create a cryptographic hash instance.
   *
   */
  constructor() {
    /**
     * The block size for the hasher.
     * @type {number}
     */
    this.blockSize = -1;
  }

  /**
   * Resets the internal accumulator.
   * @abstract
   */
  reset() {}

  /**
   * Adds a byte array (array with values in [0-255] range) or a string (must
   * only contain 8-bit, i.e., Latin1 characters) to the internal accumulator.
   *
   * Many hash functions operate on blocks of data and implement optimizations
   * when a full chunk of data is readily available. Hence it is often preferable
   * to provide large chunks of data (a kilobyte or more) than to repeatedly
   * call the update method with few tens of bytes. If this is not possible, or
   * not feasible, it might be good to provide data in multiplies of hash block
   * size (often 64 bytes). Please see the implementation and performance tests
   * of your favourite hash.
   *
   * @param {Array<number>|Uint8Array|string} bytes Data used for the update.
   * @param {number=} opt_length Number of bytes to use.
   * @abstract
   */
  update(bytes, opt_length) {}

  /**
   * @return {!Array<number>} The finalized hash computed
   *     from the internal accumulator.
   * @abstract
   */
  digest() {}
}

export {Hash};