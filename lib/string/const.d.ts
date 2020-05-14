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
export class Const implements TypedString {
    /**
     * Performs a runtime check that the provided object is indeed an instance
     * of `Const`, and returns its value.
     * @param {!Const} stringConst The object to extract from.
     * @return {string} The Const object's contained string, unless the run-time
     *     type check fails. In that case, `unwrap` returns an innocuous
     *     string, or, if assertions are enabled, throws
     *     `AssertionError`.
     */
    static unwrap(stringConst: Const): string;
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
    static from(s: string): Const;
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
    constructor(opt_token?: any | undefined, opt_content?: string | undefined);
    /**
     * @override
     * @const
     */
    implementsGoogStringTypedString: boolean;
    /**
     * The wrapped value of this Const object.  The field has a purposely ugly
     * name to make (non-compiled) code that attempts to directly access this
     * field stand out.
     * @private {string}
     */
    private stringConstValueWithSecurityContract__googStringSecurityPrivate_;
    /**
     * A type marker used to implement additional run-time type checking.
     * @see Const#unwrap
     * @const {!Object}
     * @private
     */
    private STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_;
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
    getTypedStringValue(): string;
}
export namespace Const {
    export const TYPE_MARKER_: {};
    export const GOOG_STRING_CONSTRUCTOR_TOKEN_PRIVATE_: any;
    export const EMPTY: Const;
}
import { TypedString } from "./typedstring.js";
