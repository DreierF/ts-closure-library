import {Error as DebugError} from './../debug/error.js';
import {NodeType} from './../dom/nodetype.js';
import * as google from './../google.js';
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
 * @fileoverview Utilities to check the preconditions, postconditions and
 * invariants runtime.
 *
 * Methods in this package are given special treatment by the compiler
 * for type-inference. For example, <code>assert(foo)</code>
 * will make the compiler treat <code>foo</code> as non-nullable. Similarly,
 * <code>assertNumber(foo)</code> informs the compiler about the
 * type of <code>foo</code>. Where applicable, such assertions are preferable to
 * casts by jsdoc with <code>@type</code>.
 *
 * The compiler has an option to disable asserts. So code like:
 * <code>
 * var x = assert(foo());
 * assert(bar());
 * </code>
 * will be transformed into:
 * <code>
 * var x = foo();
 * </code>
 * The compiler will leave in foo() (because its return value is used),
 * but it will remove bar() because it assumes it does not have side-effects.
 *
 * Additionally, note the compiler will consider the type to be "tightened" for
 * all statements <em>after</em> the assertion. For example:
 * <code>
 * const /** ?Object &#ast;/ value = foo();
 * assert(value);
 * // "value" is of type {!Object} at this point.
 * </code>
 */

/**
 * @type {boolean} Whether to strip out asserts or to leave them in.
 */
const ENABLE_ASSERTS = google.DEBUG;

/**
 * Error object for failed assertions.
 * @extends {DebugError}
 * @final
 */
class AssertionError extends DebugError {

  /**
   * Error object for failed assertions.
   * @param {string} messagePattern The pattern that was used to form message.
   * @param {!Array<*>} messageArgs The items to substitute into the pattern.
   */
  constructor(messagePattern, messageArgs) {
    super(subs_(messagePattern, messageArgs));
    /** @override */
    this.name = 'AssertionError';
  
  
    /**
     * The message pattern used to format the error message. Error handlers can
     * use this to uniquely identify the assertion.
     * @type {string}
     */
    this.messagePattern = messagePattern;
  }
}

/**
 * The default error handler.
 * @param {!AssertionError} e The exception to be handled.
 */
function DEFAULT_ERROR_HANDLER(e) {
  throw e;
};

/**
 * The handler responsible for throwing or logging assertion errors.
 * @private {function(!AssertionError)}
 */
let errorHandler_ = DEFAULT_ERROR_HANDLER;

/**
 * Does simple python-style string substitution.
 * subs("foo%s hot%s", "bar", "dog") becomes "foobar hotdog".
 * @param {string} pattern The string containing the pattern.
 * @param {!Array<*>} subs The items to substitute into the pattern.
 * @return {string} A copy of `str` in which each occurrence of
 *     {@code %s} has been replaced an argument from `var_args`.
 * @private
 */
function subs_(pattern, subs) {
  var splitParts = pattern.split('%s');
  var returnString = '';

  // Replace up to the last split part. We are inserting in the
  // positions between split parts.
  var subLast = splitParts.length - 1;
  for (var i = 0; i < subLast; i++) {
    // keep unsupplied as '%s'
    var sub = (i < subs.length) ? subs[i] : '%s';
    returnString += splitParts[i] + sub;
  }
  return returnString + splitParts[subLast];
};

/**
 * Throws an exception with the given message and "Assertion failed" prefixed
 * onto it.
 * @param {string} defaultMessage The message to use if givenMessage is empty.
 * @param {Array<*>} defaultArgs The substitution arguments for defaultMessage.
 * @param {string|undefined} givenMessage Message supplied by the caller.
 * @param {Array<*>} givenArgs The substitution arguments for givenMessage.
 * @throws {AssertionError} When the value is not a number.
 * @private
 */
function doAssertFailure_(
    defaultMessage, defaultArgs, givenMessage, givenArgs) {
  var message = 'Assertion failed';
  if (givenMessage) {
    message += ': ' + givenMessage;
    var args = givenArgs;
  } else if (defaultMessage) {
    message += ': ' + defaultMessage;
    args = defaultArgs;
  }
  // The '' + works around an Opera 10 bug in the unit tests. Without it,
  // a stack trace is added to var message above. With this, a stack trace is
  // not added until this line (it causes the extra garbage to be added after
  // the assertion message instead of in the middle of it).
  var e = new AssertionError('' + message, args || []);
  errorHandler_(e);
};

/**
 * Sets a custom error handler that can be used to customize the behavior of
 * assertion failures, for example by turning all assertion failures into log
 * messages.
 * @param {function(!AssertionError)} errorHandler
 */
function setErrorHandler(errorHandler) {
  if (ENABLE_ASSERTS) {
    errorHandler_ = errorHandler;
  }
};

/**
 * Checks if the condition evaluates to true if ENABLE_ASSERTS is
 * true.
 * @template T
 * @param {T} condition The condition to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {T} The value of the condition.
 * @throws {AssertionError} When the condition evaluates to false.
 * @closurePrimitive {asserts.truthy}
 */
function assert(condition, opt_message, var_args) {
  if (ENABLE_ASSERTS && !condition) {
    doAssertFailure_(
        '', null, opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return condition;
};

/**
 * Checks if `value` is `null` or `undefined` if ENABLE_ASSERTS is
 * true.
 *
 * @param {T} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {R} `value` with its type narrowed to exclude `null` and `undefined`.
 *
 * @template T
 * @template R :=
 *     mapunion(T, (V) =>
 *         cond(eq(V, 'null'),
 *             none(),
 *             cond(eq(V, 'undefined'),
 *                 none(),
 *                 V)))
 *  =:
 *
 * @throws {!AssertionError} When `value` is `null` or `undefined`.
 * @closurePrimitive {asserts.matchesReturn}
 */
function assertExists(value, opt_message, var_args) {
  if (ENABLE_ASSERTS && value == null) {
    doAssertFailure_(
        'Expected to exist: %s.', [value], opt_message,
        Array.prototype.slice.call(arguments, 2));
  }
  return value;
};

/**
 * Fails if ENABLE_ASSERTS is true. This function is useful in case
 * when we want to add a check in the unreachable area like switch-case
 * statement:
 *
 * <pre>
 *  switch(type) {
 *    case FOO: doSomething(); break;
 *    case BAR: doSomethingElse(); break;
 *    default: fail('Unrecognized type: ' + type);
 *      // We have only 2 types - "default:" section is unreachable code.
 *  }
 * </pre>
 *
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @throws {AssertionError} Failure.
 * @closurePrimitive {asserts.fail}
 */
function fail(opt_message, var_args) {
  if (ENABLE_ASSERTS) {
    errorHandler_(new AssertionError(
        'Failure' + (opt_message ? ': ' + opt_message : ''),
        Array.prototype.slice.call(arguments, 1)));
  }
};

/**
 * Checks if the value is a number if ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {number} The value, guaranteed to be a number when asserts enabled.
 * @throws {AssertionError} When the value is not a number.
 * @closurePrimitive {asserts.matchesReturn}
 */
function assertNumber(value, opt_message, var_args) {
  if (ENABLE_ASSERTS && typeof value !== 'number') {
    doAssertFailure_(
        'Expected number but got %s: %s.', [google.typeOf(value), value],
        opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return /** @type {number} */ (value);
};

/**
 * Checks if the value is a string if ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {string} The value, guaranteed to be a string when asserts enabled.
 * @throws {AssertionError} When the value is not a string.
 * @closurePrimitive {asserts.matchesReturn}
 */
function assertString(value, opt_message, var_args) {
  if (ENABLE_ASSERTS && typeof value !== 'string') {
    doAssertFailure_(
        'Expected string but got %s: %s.', [google.typeOf(value), value],
        opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return /** @type {string} */ (value);
};

/**
 * Checks if the value is a function if ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {!Function} The value, guaranteed to be a function when asserts
 *     enabled.
 * @throws {AssertionError} When the value is not a function.
 * @closurePrimitive {asserts.matchesReturn}
 */
function assertFunction(value, opt_message, var_args) {
  if (ENABLE_ASSERTS && !google.isFunction(value)) {
    doAssertFailure_(
        'Expected function but got %s: %s.', [google.typeOf(value), value],
        opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return /** @type {!Function} */ (value);
};

/**
 * Checks if the value is an Object if ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {!Object} The value, guaranteed to be a non-null object.
 * @throws {AssertionError} When the value is not an object.
 * @closurePrimitive {asserts.matchesReturn}
 */
function assertObject(value, opt_message, var_args) {
  if (ENABLE_ASSERTS && !google.isObject(value)) {
    doAssertFailure_(
        'Expected object but got %s: %s.', [google.typeOf(value), value],
        opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return /** @type {!Object} */ (value);
};

/**
 * Checks if the value is an Array if ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {!Array<?>} The value, guaranteed to be a non-null array.
 * @throws {AssertionError} When the value is not an array.
 * @closurePrimitive {asserts.matchesReturn}
 */
function assertArray(value, opt_message, var_args) {
  if (ENABLE_ASSERTS && !google.isArray(value)) {
    doAssertFailure_(
        'Expected array but got %s: %s.', [google.typeOf(value), value],
        opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return /** @type {!Array<?>} */ (value);
};

/**
 * Checks if the value is a boolean if ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {boolean} The value, guaranteed to be a boolean when asserts are
 *     enabled.
 * @throws {AssertionError} When the value is not a boolean.
 * @closurePrimitive {asserts.matchesReturn}
 */
function assertBoolean(value, opt_message, var_args) {
  if (ENABLE_ASSERTS && typeof value !== 'boolean') {
    doAssertFailure_(
        'Expected boolean but got %s: %s.', [google.typeOf(value), value],
        opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return /** @type {boolean} */ (value);
};

/**
 * Checks if the value is a DOM Element if ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {!Element} The value, likely to be a DOM Element when asserts are
 *     enabled.
 * @throws {AssertionError} When the value is not an Element.
 * @closurePrimitive {asserts.matchesReturn}
 * @deprecated Use goog.asserts.dom.assertIsElement instead.
 */
function assertElement(value, opt_message, var_args) {
  if (ENABLE_ASSERTS &&
      (!google.isObject(value) ||
       /** @type {!Node} */ (value).nodeType != NodeType.ELEMENT)) {
    doAssertFailure_(
        'Expected Element but got %s: %s.', [google.typeOf(value), value],
        opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return /** @type {!Element} */ (value);
};

/**
 * Checks if the value is an instance of the user-defined type if
 * ENABLE_ASSERTS is true.
 *
 * The compiler may tighten the type returned by this function.
 *
 * Do not use this to ensure a value is an HTMLElement or a subclass! Cross-
 * document DOM inherits from separate - though identical - browser classes, and
 * such a check will unexpectedly fail. Please use the methods in
 * goog.asserts.dom for these purposes.
 *
 * @param {?} value The value to check.
 * @param {function(new: T, ...)} type A user-defined constructor.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @throws {AssertionError} When the value is not an instance of
 *     type.
 * @return {T}
 * @template T
 * @closurePrimitive {asserts.matchesReturn}
 */
function assertInstanceof(value, type, opt_message, var_args) {
  if (ENABLE_ASSERTS && !(value instanceof type)) {
    doAssertFailure_(
        'Expected instanceof %s but got %s.',
        [getType_(type), getType_(value)],
        opt_message, Array.prototype.slice.call(arguments, 3));
  }
  return value;
};

/**
 * Checks whether the value is a finite number, if ENABLE_ASSERTS
 * is true.
 *
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @throws {AssertionError} When the value is not a number, or is
 *     a non-finite number such as NaN, Infinity or -Infinity.
 * @return {number} The value initially passed in.
 */
function assertFinite(value, opt_message, var_args) {
  if (ENABLE_ASSERTS &&
      (typeof value != 'number' || !isFinite(value))) {
    doAssertFailure_(
        'Expected %s to be a finite number but it is not.', [value],
        opt_message, Array.prototype.slice.call(arguments, 2));
  }
  return /** @type {number} */ (value);
};

/**
 * Checks that no enumerable keys are present in Object.prototype. Such keys
 * would break most code that use {@code for (var ... in ...)} loops.
 */
function assertObjectPrototypeIsIntact() {
  for (var key in Object.prototype) {
    fail(key + ' should not be enumerable in Object.prototype.');
  }
};

/**
 * Returns the type of a value. If a constructor is passed, and a suitable
 * string cannot be found, 'unknown type name' will be returned.
 * @param {*} value A constructor, object, or primitive.
 * @return {string} The best display name for the value, or 'unknown type name'.
 * @private
 */
function getType_(value) {
  if (value instanceof Function) {
    return value.displayName || value.name || 'unknown type name';
  } else if (value instanceof Object) {
    return /** @type {string} */ (value.constructor.displayName) ||
        value.constructor.name || Object.prototype.toString.call(value);
  } else {
    return value === null ? 'null' : typeof value;
  }
};

export {AssertionError, DEFAULT_ERROR_HANDLER, ENABLE_ASSERTS, assert, assertArray, assertBoolean, assertElement, assertExists, assertFinite, assertFunction, assertInstanceof, assertNumber, assertObject, assertObjectPrototypeIsIntact, assertString, fail, setErrorHandler};