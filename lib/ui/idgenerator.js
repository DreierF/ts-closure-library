// Copyright 2008 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Generator for unique element IDs.
 */

/**
 * Creates a new id generator.
 * @final
 */
class IdGenerator {

  /**
   * Creates a new id generator.
   */
  constructor() {
    /**
     * Next unique ID to use
     * @type {number}
     * @private
     */
    this.nextId_ = 0;
  
    /**
     * Random ID prefix to help avoid collisions with other closure JavaScript on
     * the same page that may initialize its own IdGenerator singleton.
     * @type {string}
     * @private
     */
    this.idPrefix_ = '';
  }

  /** @return {!IdGenerator} @suppress {checkTypes} */
  static getInstance() {
    if (IdGenerator.instance_) {
      return /** @type {!IdGenerator} */ (IdGenerator.instance_);
    }
    return /** @type {!IdGenerator} */ (IdGenerator.instance_) = new IdGenerator();
  };

  /**
   * Sets the ID prefix for this singleton. This is a temporary workaround to be
   * backwards compatible with code relying on the undocumented, but consistent,
   * behavior. In the future this will be removed and the prefix will be set to
   * a randomly generated string.
   * @param {string} idPrefix
   */
  setIdPrefix(idPrefix) {
    this.idPrefix_ = idPrefix;
  };

  /**
   * Gets the next unique ID.
   * @return {string} The next unique identifier.
   */
  getNextUniqueId() {
    return this.idPrefix_ + ':' + (this.nextId_++).toString(36);
  };
}
/** @type {undefined|!IdGenerator} @suppress {underscore,checkTypes}*/
IdGenerator.instance_ = undefined;

export {IdGenerator};