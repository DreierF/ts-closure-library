// Copyright 2013 The Closure Library Authors. All Rights Reserved.
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