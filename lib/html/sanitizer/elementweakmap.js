import * as noclobber from './noclobber.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @package
 * @supported IE 10+ and other browsers. IE 8 and IE 9 could be supported by
 * by making anti-clobbering support optional.
 */

// We also need to check if WeakMap has been polyfilled, because we want to use
// ElementWeakMap instead of the polyfill.
/** @const {boolean} */
var NATIVE_WEAKMAP_SUPPORTED = typeof WeakMap != 'undefined' &&
    WeakMap.toString().indexOf('[native code]') != -1;

/** @const {string} */
var DATA_ATTRIBUTE_NAME_PREFIX = 'data-elementweakmap-index-';

// Increased every time a new ElementWeakMap is constructed, to guarantee
// that each weakmap uses a different attribute name.
var weakMapCount = 0;

/**
 * A weakmap-like implementation for browsers that don't support native WeakMap.
 * It uses a data attribute on the key element for O(1) lookups.
 * @template T
 */
class ElementWeakMap {

  /**
   * A weakmap-like implementation for browsers that don't support native WeakMap.
   * It uses a data attribute on the key element for O(1) lookups.
   * @template T
   */
  constructor() {
    /** @private {!Array<!Element>} */
    this.keys_ = [];
  
    /** @private {!Array<!T>} */
    this.values_ = [];
  
    /** @private @const {string} */
    this.dataAttributeName_ = DATA_ATTRIBUTE_NAME_PREFIX + weakMapCount++;
  }

  /**
   * Stores a `elementKey` -> `value` mapping.
   * @param {!Element} elementKey
   * @param {!T} value
   * @return {!ElementWeakMap}
   */
  set(elementKey, value) {
    if (noclobber.hasElementAttribute(elementKey, this.dataAttributeName_)) {
      var itemIndex = parseInt(
          noclobber.getElementAttribute(elementKey, this.dataAttributeName_), 10);
      this.values_[itemIndex] = value;
    } else {
      var itemIndex = this.values_.push(value) - 1;
      noclobber.setElementAttribute(
          elementKey, this.dataAttributeName_, itemIndex.toString());
      this.keys_.push(elementKey);
    }
    return this;
  };

  /**
   * Gets the value previously stored for `elementKey`, or undefined if no
   * value was stored for such key.
   * @param {!Element} elementKey
   * @return {!Element|undefined}
   */
  get(elementKey) {
    if (!noclobber.hasElementAttribute(elementKey, this.dataAttributeName_)) {
      return undefined;
    }
    var itemIndex = parseInt(
        noclobber.getElementAttribute(elementKey, this.dataAttributeName_), 10);
    return this.values_[itemIndex];
  };

  /** Clears the map. */
  clear() {
    this.keys_.forEach(function(el) {
      noclobber.removeElementAttribute(el, this.dataAttributeName_);
    }, this);
    this.keys_ = [];
    this.values_ = [];
  };

  /**
   * Returns either this weakmap adapter or the native weakmap implmentation, if
   * available.
   * @return {!ElementWeakMap|!WeakMap}
   */
  static newWeakMap() {
    return NATIVE_WEAKMAP_SUPPORTED ? new WeakMap() : new ElementWeakMap();
  };
}

export {ElementWeakMap};