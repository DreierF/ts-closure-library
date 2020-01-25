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
export class Const {
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
    constructor(opt_token?: any, opt_content?: string);
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
    stringConstValueWithSecurityContract__googStringSecurityPrivate_: string;
    /**
     * A type marker used to implement additional run-time type checking.
     * @see Const#unwrap
     * @const {!Object}
     * @private
     */
    STRING_CONST_TYPE_MARKER__GOOG_STRING_SECURITY_PRIVATE_: {};
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
    export const GOOG_STRING_CONSTRUCTOR_TOKEN_PRIVATE_: Object;
    export const EMPTY: Const;
}
