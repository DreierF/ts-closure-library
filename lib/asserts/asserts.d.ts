/**
 * Error object for failed assertions.
 * @extends {DebugError}
 * @final
 */
export class AssertionError extends DebugError {
    /**
     * Error object for failed assertions.
     * @param {string} messagePattern The pattern that was used to form message.
     * @param {!Array<*>} messageArgs The items to substitute into the pattern.
     */
    constructor(messagePattern: string, messageArgs: Array<any>);
    /**
     * The message pattern used to format the error message. Error handlers can
     * use this to uniquely identify the assertion.
     * @type {string}
     */
    messagePattern: string;
}
/**
 * The default error handler.
 * @param {!AssertionError} e The exception to be handled.
 */
export function DEFAULT_ERROR_HANDLER(e: AssertionError): void;
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
export const ENABLE_ASSERTS: boolean;
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
export function assert<T>(condition: T, opt_message?: string | undefined, ...args: any[]): asserts condition;
/**
 * Checks if the value is an Array if ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {!Array<?>} The value, guaranteed to be a non-null array.
 * @throws {AssertionError} When the value is not an array.
 * @closurePrimitive {asserts.matchesReturn}
 */
export function assertArray(value: any, opt_message?: string | undefined, ...args: any[]): Array<unknown>;
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
export function assertBoolean(value: any, opt_message?: string | undefined, ...args: any[]): boolean;
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
export function assertElement(value: any, opt_message?: string | undefined, ...args: any[]): Element;
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
export function assertExists<T, R>(value: T, opt_message?: string | undefined, ...args: any[]): R;
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
export function assertFinite(value: any, opt_message?: string | undefined, ...args: any[]): number;
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
export function assertFunction(value: any, opt_message?: string | undefined, ...args: any[]): Function;
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
export function assertInstanceof<T>(value: unknown, type: new (...arg1: any[]) => T, opt_message?: string | undefined, ...args: any[]): T;
/**
 * Checks if the value is a number if ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {number} The value, guaranteed to be a number when asserts enabled.
 * @throws {AssertionError} When the value is not a number.
 * @closurePrimitive {asserts.matchesReturn}
 */
export function assertNumber(value: any, opt_message?: string | undefined, ...args: any[]): number;
/**
 * Checks if the value is an Object if ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {!Object} The value, guaranteed to be a non-null object.
 * @throws {AssertionError} When the value is not an object.
 * @closurePrimitive {asserts.matchesReturn}
 */
export function assertObject<T>(value: T, opt_message?: string, ...args: any[]): T extends NonNullable<T> ? NonNullable<T> : never;
/**
 * Checks that no enumerable keys are present in Object.prototype. Such keys
 * would break most code that use {@code for (var ... in ...)} loops.
 */
export function assertObjectPrototypeIsIntact(): void;
/**
 * Checks if the value is a string if ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {string=} opt_message Error message in case of failure.
 * @param {...*} var_args The items to substitute into the failure message.
 * @return {string} The value, guaranteed to be a string when asserts enabled.
 * @throws {AssertionError} When the value is not a string.
 * @closurePrimitive {asserts.matchesReturn}
 */
export function assertString(value: any, opt_message?: string | undefined, ...args: any[]): string;
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
export function fail(opt_message?: string, ...args: any[]): never;
/**
 * Sets a custom error handler that can be used to customize the behavior of
 * assertion failures, for example by turning all assertion failures into log
 * messages.
 * @param {function(!AssertionError)} errorHandler
 */
export function setErrorHandler(errorHandler: (arg0: AssertionError) => void): void;
import { Error as DebugError } from "../debug/error.js";
