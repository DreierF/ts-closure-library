// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Utility for fast string concatenation.
 */

/**
 * Utility class to facilitate string concatenation.
 *
 *     append, e.g., new StringBuffer('foo', 'bar').
 */
class StringBuffer {

  /**
   * Utility class to facilitate string concatenation.
   *
   * @param {*=} opt_a1 Optional first initial item to append.
   * @param {...*} var_args Other initial items to
   *     append, e.g., new StringBuffer('foo', 'bar').
   */
  constructor(opt_a1, var_args) {
    /**
     * Internal buffer for the string to be concatenated.
     * @type {string}
     * @private
     */
    this.buffer_ = '';
  
    if (opt_a1 != null) {
      this.append.apply(this, arguments);
    }
  }

  /**
   * Sets the contents of the string buffer object, replacing what's currently
   * there.
   *
   * @param {*} s String to set.
   */
  set(s) {
    this.buffer_ = '' + s;
  };

  /**
   * Appends one or more items to the buffer.
   *
   * Calling this with null, undefined, or empty arguments is an error.
   *
   * @param {*} a1 Required first string.
   * @param {*=} opt_a2 Optional second string.
   * @param {...?} var_args Other items to append,
   *     e.g., sb.append('foo', 'bar', 'baz').
   * @return {!StringBuffer} This same StringBuffer object.
   * @suppress {duplicate}
   */
  append(a1, opt_a2, var_args) {
    // Use a1 directly to avoid arguments instantiation for single-arg case.
    this.buffer_ += String(a1);
    if (opt_a2 != null) {  // second argument is undefined (null == undefined)
      for (let i = 1; i < arguments.length; i++) {
        this.buffer_ += arguments[i];
      }
    }
    return this;
  };

  /**
   * Clears the internal buffer.
   */
  clear() {
    this.buffer_ = '';
  };

  /**
   * @return {number} the length of the current contents of the buffer.
   */
  getLength() {
    return this.buffer_.length;
  };

  /**
   * @return {string} The concatenated string.
   * @override
   */
  toString() {
    return this.buffer_;
  };
}

export {StringBuffer};