/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Wrapper for strings that conform to a data type or language.
 *
 * Implementations of this interface are wrappers for strings, and typically
 * associate a type contract with the wrapped string.  Concrete implementations
 * of this interface may choose to implement additional run-time type checking,
 * see for example `goog.html.SafeHtml`. If available, client code that
 * needs to ensure type membership of an object should use the type's function
 * to assert type membership, such as `goog.html.SafeHtml.unwrap`.
 * @interface
 */
class TypedString {

  /**
   * Wrapper for strings that conform to a data type or language.
   *
   * Implementations of this interface are wrappers for strings, and typically
   * associate a type contract with the wrapped string.  Concrete implementations
   * of this interface may choose to implement additional run-time type checking,
   * see for example `goog.html.SafeHtml`. If available, client code that
   * needs to ensure type membership of an object should use the type's function
   * to assert type membership, such as `goog.html.SafeHtml.unwrap`.
   */
  constructor() {
    /**
     * Interface marker of the TypedString interface.
     *
     * This property can be used to determine at runtime whether or not an object
     * implements this interface.  All implementations of this interface set this
     * property to `true`.
     * @type {boolean|null}
     */
    this.implementsGoogStringTypedString = null;
  }

  /**
   * Retrieves this wrapped string's value.
   * @return {string} The wrapped string's value.
   */
  getTypedStringValue() {}
}

export {TypedString};