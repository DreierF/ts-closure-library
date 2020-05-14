/**
 * @fileoverview The SafeScript type and its builders.
 *
 * TODO(xtof): Link to document stating type contract.
 */
/**
 * A string-like object which represents JavaScript code and that carries the
 * security type contract that its value, as a string, will not cause execution
 * of unconstrained attacker controlled code (XSS) when evaluated as JavaScript
 * in a browser.
 *
 * Instances of this type must be created via the factory method
 * `SafeScript.fromConstant` and not by invoking its
 * constructor. The constructor intentionally takes no parameters and the type
 * is immutable; hence only a default instance corresponding to the empty string
 * can be obtained via constructor invocation.
 *
 * A SafeScript's string representation can safely be interpolated as the
 * content of a script element within HTML. The SafeScript string should not be
 * escaped before interpolation.
 *
 * Note that the SafeScript might contain text that is attacker-controlled but
 * that text should have been interpolated with appropriate escaping,
 * sanitization and/or validation into the right location in the script, such
 * that it is highly constrained in its effect (for example, it had to match a
 * set of whitelisted words).
 *
 * A SafeScript can be constructed via security-reviewed unchecked
 * conversions. In this case producers of SafeScript must ensure themselves that
 * the SafeScript does not contain unsafe script. Note in particular that
 * {@code &lt;} is dangerous, even when inside JavaScript strings, and so should
 * always be forbidden or JavaScript escaped in user controlled input. For
 * example, if {@code &lt;/script&gt;&lt;script&gt;evil&lt;/script&gt;"} were
 * interpolated inside a JavaScript string, it would break out of the context
 * of the original script element and `evil` would execute. Also note
 * that within an HTML script (raw text) element, HTML character references,
 * such as "&lt;" are not allowed. See
 * http://www.w3.org/TR/html5/scripting-1.html#restrictions-for-contents-of-script-elements.
 *
 * @see SafeScript#fromConstant
 * @final
 * @class
 * @implements {TypedString}
 */
export class SafeScript implements TypedString {
    /**
     * Creates a SafeScript object from a compile-time constant string.
     *
     * @param {!String_Const} script A compile-time-constant string from which
     *     to create a SafeScript.
     * @return {!SafeScript} A SafeScript object initialized to
     *     `script`.
     */
    static fromConstant(script: String_Const): SafeScript;
    /**
     * Creates a SafeScript from a compile-time constant string but with arguments
     * that can vary at run-time. The code argument should be formatted as an
     * inline function (see example below). The arguments will be JSON-encoded and
     * provided as input to the function specified in code.
     *
     * Example Usage:
     *
     *     let safeScript = SafeScript.fromConstantAndArgs(
     *         Const.from('function(arg1, arg2) { doSomething(arg1, arg2); }'),
     *         arg1,
     *         arg2);
     *
     * This produces a SafeScript equivalent to the following:
     *
     *     (function(arg1, arg2) { doSomething(arg1, arg2); })("value1", "value2");
     *
     * @param {!String_Const} code
     * @param {...*} var_args
     * @return {!SafeScript}
     */
    static fromConstantAndArgs(code: String_Const, ...args: any[]): SafeScript;
    /**
     * Creates a SafeScript JSON representation from anything that could be passed
     * to JSON.stringify.
     * @param {*} val
     * @return {!SafeScript}
     */
    static fromJson(val: any): SafeScript;
    /**
     * Performs a runtime check that the provided object is indeed a
     * SafeScript object, and returns its value.
     *
     * @param {!SafeScript} safeScript The object to extract from.
     * @return {string} The safeScript object's contained string, unless
     *     the run-time type check fails. In that case, `unwrap` returns an
     *     innocuous string, or, if assertions are enabled, throws
     *     `AssertionError`.
     */
    static unwrap(safeScript: SafeScript): string;
    /**
     * Unwraps value as TrustedScript if supported or as a string if not.
     * @param {!SafeScript} safeScript
     * @return {!TrustedScript|string}
     * @see SafeScript.unwrap
     */
    static unwrapTrustedScript(safeScript: SafeScript): any | string;
    /**
     * Converts the given value to a embeddabel JSON string and returns it. The
     * resulting string can be embedded in HTML because the '<' character is
     * encoded.
     *
     * @param {*} val
     * @return {string}
     * @private
     */
    private static stringify_;
    /**
     * Package-internal utility method to create SafeScript instances.
     *
     * @param {string} script The string to initialize the SafeScript object with.
     * @return {!SafeScript} The initialized SafeScript object.
     * @package
     */
    static createSafeScriptSecurityPrivateDoNotAccessOrElse(script: string): SafeScript;
    /**
     * @override
     * @const
     */
    implementsGoogStringTypedString: boolean;
    /**
     * The contained value of this SafeScript.  The field has a purposely
     * ugly name to make (non-compiled) code that attempts to directly access this
     * field stand out.
     * @private {!TrustedScript|string}
     */
    private privateDoNotAccessOrElseSafeScriptWrappedValue_;
    /**
     * A type marker used to implement additional run-time type checking.
     * @see SafeScript#unwrap
     * @const {!Object}
     * @private
     */
    private SAFE_SCRIPT_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
    /**
     * Returns this SafeScript's value as a string.
     *
     * IMPORTANT: In code where it is security relevant that an object's type is
     * indeed `SafeScript`, use `SafeScript.unwrap` instead of
     * this method. If in doubt, assume that it's security relevant. In particular,
     * note that google.html functions which return a google.html type do not guarantee
     * the returned instance is of the right type. For example:
     *
     * <pre>
     * var fakeSafeHtml = new String('fake');
     * fakeSafeHtml.__proto__ = goog.html.SafeHtml.prototype;
     * var newSafeHtml = goog.html.SafeHtml.htmlEscape(fakeSafeHtml);
     * // newSafeHtml is just an alias for fakeSafeHtml, it's passed through by
     * // goog.html.SafeHtml.htmlEscape() as fakeSafeHtml
     * // instanceof goog.html.SafeHtml.
     * </pre>
     *
     * @see SafeScript#unwrap
     * @override
     */
    getTypedStringValue(): string;
    /**
     * Called from createSafeScriptSecurityPrivateDoNotAccessOrElse(). This
     * method exists only so that the compiler can dead code eliminate static
     * fields (like EMPTY) when they're not accessed.
     * @param {string} script
     * @return {!SafeScript}
     * @private
     */
    private initSecurityPrivateDoNotAccessOrElse_;
}
export namespace SafeScript {
    export const TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_: {};
    export const EMPTY: SafeScript;
}
import { TypedString } from "../string/typedstring.js";
import { Const as String_Const } from "../string/const.js";
