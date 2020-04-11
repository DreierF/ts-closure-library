import * as goog_asserts from './../asserts/asserts.js';
import {AssertionError} from './../asserts/asserts.js';
import * as google from './../google.js';
import {TypedString} from './typedstring.js';
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
 * Wrapper for compile-time-constant strings.
 *
 * Const is a wrapper for strings that can only be created from program
 * constants (i.e., string literals).  This property relies on a custom Closure
 * compiler check that `Const.from` is only invoked on
 * compile-time-constant expressions.
 *
 * Const is useful in APIs whose correct and secure use requires that certain
 * arguments are not attacker controlled: Compile-time constants are inherently
 * under the control of the application and not under control of external
 * attackers, and hence are safe to use in such contexts.
 *
 * Instances of this type must be created via its factory method
 * `Const.from` and not by invoking its constructor.  The
 * constructor intentionally takes no parameters and the type is immutable;
 * hence only a default instance corresponding to the empty string can be
 * obtained via constructor invocation.  Use Const.EMPTY
 * instead of using this constructor to get an empty Const string.
 *
 * @see Const#from
 * @final
 * @class
 * @implements {TypedString}
 */
class Const {

  /**
   * Wrapper for compile-time-constant strings.
   *
   * Const is a wrapper for strings that can only be created from program
   * constants (i.e., string literals).  This property relies on a custom Closure
   * compiler check that `Const.from` is only invoked on
   * compile-time-constant expressions.
   *
   * Const is useful in APIs whose correct and secure use requires that certain
   * arguments are not attacker controlled: Compile-time constants are inherently
   * under the control of the application and not under control of external
   * attackers, and hence are safe to use in such contexts.
   *
   * Instances of this type must be created via its factory method
   * `Const.from` and not by invoking its constructor.  The
   * constructor intentionally takes no parameters and the type is immutable;
   * hence only a default instance corresponding to the empty string can be
   * obtained via constructor invocation.  Use Const.EMPTY
   * instead of using this constructor to get an empty Const string.
   *
   * @see Const#from
   * @param {Object=} opt_token package-internal implementation detail.
   * @param {string=} opt_content package-internal implementation detail.
   */
  constructor(opt_token, opt_content) {
    /**
     * @override
     * @const
     */
    this.implementsGoogStringTypedString = true;
  
    /**
     * The wrapped value of this Const object.  The field has a purposely ugly
     * name to make (non-compiled) code that attempts to directly access this
     * field stand out.
     * @private {string}
     */
    this.stringConstValueWithSecurityContract__googStringSecurityPrivate_ =
        ((opt_token ===
          Const.GOOG_STRING_CONSTRUCTOR_TOKEN_PRIVATE_) &&
         opt_content) ||
        '';
  
    /**
     * A type marker used to implement additional run-time type checking.
     * @see Const#unwrap
     * @const {!Object}
     * @private
     */
    this.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ =
        Const.TYPE_MARKER_;
  }

  /**
   * Returns this Const's value a string.
   *
   * IMPORTANT: In code where it is security-relevant that an object's type is
   * indeed `Const`, use `Const.unwrap`
   * instead of this method.
   *
   * @see Const#unwrap
   * @override
   */
  getTypedStringValue() {
    return this.stringConstValueWithSecurityContract__googStringSecurityPrivate_;
  };

  /**
   * Performs a runtime check that the provided object is indeed an instance
   * of `Const`, and returns its value.
   * @param {!Const} stringConst The object to extract from.
   * @return {string} The Const object's contained string, unless the run-time
   *     type check fails. In that case, `unwrap` returns an innocuous
   *     string, or, if assertions are enabled, throws
   *     `AssertionError`.
   */
  static unwrap(stringConst) {
    // Perform additional run-time type-checking to ensure that stringConst is
    // indeed an instance of the expected type.  This provides some additional
    // protection against security bugs due to application code that disables type
    // checks.
    if (stringConst instanceof Const &&
        stringConst.constructor === Const &&
        stringConst.STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_ ===
            Const.TYPE_MARKER_) {
      return stringConst
          .stringConstValueWithSecurityContract__googStringSecurityPrivate_;
    } else {
      goog_asserts.fail(
          'expected object of type Const, got \'' + stringConst + '\'');
      return 'type_error:Const';
    }
  };

  /**
   * Creates a Const object from a compile-time constant string.
   *
   * It is illegal to invoke this function on an expression whose
   * compile-time-constant value cannot be determined by the Closure compiler.
   *
   * Correct invocations include,
   * <pre>
   *   var s = Const.from('hello');
   *   var t = Const.from('hello' + 'world');
   * </pre>
   *
   * In contrast, the following are illegal:
   * <pre>
   *   var s = Const.from(getHello());
   *   var t = Const.from('hello' + world);
   * </pre>
   *
   * @param {string} s A constant string from which to create a Const.
   * @return {!Const} A Const object initialized to stringConst.
   */
  static from(s) {
    return new Const(
        Const.GOOG_STRING_CONSTRUCTOR_TOKEN_PRIVATE_, s);
  };
}

/**
 * Type marker for the Const type, used to implement additional run-time
 * type checking.
 * @const {!Object}
 * @private
 */
Const.TYPE_MARKER_ = {};

/**
 * @type {!Object}
 * @private
 * @const
 */
Const.GOOG_STRING_CONSTRUCTOR_TOKEN_PRIVATE_ = {};

/**
 * A Const instance wrapping the empty string.
 * @const {!Const}
 */
Const.EMPTY = Const.from('');

export {Const};