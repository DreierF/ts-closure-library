/**
 * @fileoverview The SafeStyleSheet type and its builders.
 *
 * TODO(xtof): Link to document stating type contract.
 */
/**
 * A string-like object which represents a CSS style sheet and that carries the
 * security type contract that its value, as a string, will not cause untrusted
 * script execution (XSS) when evaluated as CSS in a browser.
 *
 * Instances of this type must be created via the factory method
 * `SafeStyleSheet.fromConstant` and not by invoking its
 * constructor. The constructor intentionally takes no parameters and the type
 * is immutable; hence only a default instance corresponding to the empty string
 * can be obtained via constructor invocation.
 *
 * A SafeStyleSheet's string representation can safely be interpolated as the
 * content of a style element within HTML. The SafeStyleSheet string should
 * not be escaped before interpolation.
 *
 * Values of this type must be composable, i.e. for any two values
 * `styleSheet1` and `styleSheet2` of this type,
 * {@code SafeStyleSheet.unwrap(styleSheet1) +
 * SafeStyleSheet.unwrap(styleSheet2)} must itself be a value that
 * satisfies the SafeStyleSheet type constraint. This requirement implies that
 * for any value `styleSheet` of this type,
 * `SafeStyleSheet.unwrap(styleSheet1)` must end in
 * "beginning of rule" context.

 * A SafeStyleSheet can be constructed via security-reviewed unchecked
 * conversions. In this case producers of SafeStyleSheet must ensure themselves
 * that the SafeStyleSheet does not contain unsafe script. Note in particular
 * that {@code &lt;} is dangerous, even when inside CSS strings, and so should
 * always be forbidden or CSS-escaped in user controlled input. For example, if
 * {@code &lt;/style&gt;&lt;script&gt;evil&lt;/script&gt;"} were interpolated
 * inside a CSS string, it would break out of the context of the original
 * style element and `evil` would execute. Also note that within an HTML
 * style (raw text) element, HTML character references, such as
 * {@code &amp;lt;}, are not allowed. See
 *
 http://www.w3.org/TR/html5/scripting-1.html#restrictions-for-contents-of-script-elements
 * (similar considerations apply to the style element).
 *
 * @see SafeStyleSheet#fromConstant
 * @final
 * @class
 * @implements {TypedString}
 */
export class SafeStyleSheet implements TypedString {
    /**
     * Creates a style sheet consisting of one selector and one style definition.
     * Use {@link SafeStyleSheet.concat} to create longer style sheets.
     * This function doesn't support @import, @media and similar constructs.
     * @param {string} selector CSS selector, e.g. '#id' or 'tag .class, #id'. We
     *     support CSS3 selectors: https://w3.org/TR/css3-selectors/#selectors.
     * @param {!HtmlSafeStyle.PropertyMap|!HtmlSafeStyle} style Style
     *     definition associated with the selector.
     * @return {!SafeStyleSheet}
     * @throws {Error} If invalid selector is provided.
     */
    static createRule(selector: string, style: HtmlSafeStyle.PropertyMap | HtmlSafeStyle): SafeStyleSheet;
    /**
     * Checks if a string has balanced () and [] brackets.
     * @param {string} s String to check.
     * @return {boolean}
     * @private
     */
    private static hasBalancedBrackets_;
    /**
     * Creates a new SafeStyleSheet object by concatenating values.
     * @suppress{checkTypes}
     * @param {...(!SafeStyleSheet|!Array<!SafeStyleSheet>)}
     *     var_args Values to concatenate.
     * @return {!SafeStyleSheet}
     */
    static concat(...args: (SafeStyleSheet | SafeStyleSheet[])[]): SafeStyleSheet;
    /**
     * Creates a SafeStyleSheet object from a compile-time constant string.
     *
     * `styleSheet` must not have any &lt; characters in it, so that
     * the syntactic structure of the surrounding HTML is not affected.
     *
     * @param {!Const} styleSheet A compile-time-constant string from
     *     which to create a SafeStyleSheet.
     * @return {!SafeStyleSheet} A SafeStyleSheet object initialized to
     *     `styleSheet`.
     */
    static fromConstant(styleSheet: Const): SafeStyleSheet;
    /**
     * Performs a runtime check that the provided object is indeed a
     * SafeStyleSheet object, and returns its value.
     *
     * @param {!SafeStyleSheet} safeStyleSheet The object to extract from.
     * @return {string} The safeStyleSheet object's contained string, unless
     *     the run-time type check fails. In that case, `unwrap` returns an
     *     innocuous string, or, if assertions are enabled, throws
     *     `AssertionError`.
     */
    static unwrap(safeStyleSheet: SafeStyleSheet): string;
    /**
     * Package-internal utility method to create SafeStyleSheet instances.
     *
     * @param {string} styleSheet The string to initialize the SafeStyleSheet
     *     object with.
     * @return {!SafeStyleSheet} The initialized SafeStyleSheet object.
     * @package
     */
    static createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(styleSheet: string): SafeStyleSheet;
    /**
     * @override
     * @const
     */
    implementsGoogStringTypedString: boolean;
    /**
     * The contained value of this SafeStyleSheet.  The field has a purposely
     * ugly name to make (non-compiled) code that attempts to directly access this
     * field stand out.
     * @private {string}
     */
    private privateDoNotAccessOrElseSafeStyleSheetWrappedValue_;
    /**
     * A type marker used to implement additional run-time type checking.
     * @see SafeStyleSheet#unwrap
     * @const {!Object}
     * @private
     */
    private SAFE_STYLE_SHEET_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
    /**
     * Returns this SafeStyleSheet's value as a string.
     *
     * IMPORTANT: In code where it is security relevant that an object's type is
     * indeed `SafeStyleSheet`, use `SafeStyleSheet.unwrap`
     * instead of this method. If in doubt, assume that it's security relevant. In
     * particular, note that google.html functions which return a google.html type do
     * not guarantee the returned instance is of the right type. For example:
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
     * @see SafeStyleSheet#unwrap
     * @override
     */
    getTypedStringValue(): string;
    /**
     * Called from createSafeStyleSheetSecurityPrivateDoNotAccessOrElse(). This
     * method exists only so that the compiler can dead code eliminate static
     * fields (like EMPTY) when they're not accessed.
     * @param {string} styleSheet
     * @return {!SafeStyleSheet}
     * @private
     */
    private initSecurityPrivateDoNotAccessOrElse_;
}
export namespace SafeStyleSheet {
    export const TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_: {};
    export const EMPTY: SafeStyleSheet;
}
import { TypedString } from "../string/typedstring.js";
import { SafeStyle as HtmlSafeStyle } from "./safestyle.js";
import { Const } from "../string/const.js";
