/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

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