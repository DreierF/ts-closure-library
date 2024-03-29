/**
 * A string-like object which represents a sequence of CSS declarations
 * (`propertyName1: propertyvalue1; propertyName2: propertyValue2; ...`)
 * and that carries the security type contract that its value, as a string,
 * will not cause untrusted script execution (XSS) when evaluated as CSS in a
 * browser.
 *
 * Instances of this type must be created via the factory methods
 * (`SafeStyle.create` or `SafeStyle.fromConstant`)
 * and not by invoking its constructor. The constructor intentionally takes an
 * extra parameter that cannot be constructed outside of this file and the type
 * is immutable; hence only a default instance corresponding to the empty string
 * can be obtained via constructor invocation.
 *
 * SafeStyle's string representation can safely be:
 * <ul>
 *   <li>Interpolated as the content of a *quoted* HTML style attribute.
 *       However, the SafeStyle string *must be HTML-attribute-escaped* before
 *       interpolation.
 *   <li>Interpolated as the content of a {}-wrapped block within a stylesheet.
 *       '<' characters in the SafeStyle string *must be CSS-escaped* before
 *       interpolation. The SafeStyle string is also guaranteed not to be able
 *       to introduce new properties or elide existing ones.
 *   <li>Interpolated as the content of a {}-wrapped block within an HTML
 *       &lt;style&gt; element. '<' characters in the SafeStyle string
 *       *must be CSS-escaped* before interpolation.
 *   <li>Assigned to the style property of a DOM node. The SafeStyle string
 *       should not be escaped before being assigned to the property.
 * </ul>
 *
 * A SafeStyle may never contain literal angle brackets. Otherwise, it could
 * be unsafe to place a SafeStyle into a &lt;style&gt; tag (where it can't
 * be HTML escaped). For example, if the SafeStyle containing
 * `font: 'foo &lt;style/&gt;&lt;script&gt;evil&lt;/script&gt;'` were
 * interpolated within a &lt;style&gt; tag, this would then break out of the
 * style context into HTML.
 *
 * A SafeStyle may contain literal single or double quotes, and as such the
 * entire style string must be escaped when used in a style attribute (if
 * this were not the case, the string could contain a matching quote that
 * would escape from the style attribute).
 *
 * Values of this type must be composable, i.e. for any two values
 * `style1` and `style2` of this type,
 * `SafeStyle.unwrap(style1) +
 * SafeStyle.unwrap(style2)` must itself be a value that satisfies
 * the SafeStyle type constraint. This requirement implies that for any value
 * `style` of this type, `SafeStyle.unwrap(style)` must
 * not end in a "property value" or "property name" context. For example,
 * a value of `background:url("` or `font-` would not satisfy the
 * SafeStyle contract. This is because concatenating such strings with a
 * second value that itself does not contain unsafe CSS can result in an
 * overall string that does. For example, if `javascript:evil())"` is
 * appended to `background:url("}, the resulting string may result in
 * the execution of a malicious script.
 *
 * TODO(mlourenco): Consider whether we should implement UTF-8 interchange
 * validity checks and blacklisting of newlines (including Unicode ones) and
 * other whitespace characters (\t, \f). Document here if so and also update
 * SafeStyle.fromConstant().
 *
 * The following example values comply with this type's contract:
 * <ul>
 *   <li><pre>width: 1em;</pre>
 *   <li><pre>height:1em;</pre>
 *   <li><pre>width: 1em;height: 1em;</pre>
 *   <li><pre>background:url('http://url');</pre>
 * </ul>
 * In addition, the empty string is safe for use in a CSS attribute.
 *
 * The following example values do NOT comply with this type's contract:
 * <ul>
 *   <li><pre>background: red</pre> (missing a trailing semi-colon)
 *   <li><pre>background:</pre> (missing a value and a trailing semi-colon)
 *   <li><pre>1em</pre> (missing an attribute name, which provides context for
 *       the value)
 * </ul>
 *
 * @see SafeStyle#create
 * @see SafeStyle#fromConstant
 * @see http://www.w3.org/TR/css3-syntax/
 * @final
 * @struct
 * @implements {TypedString}
 */
export class SafeStyle implements TypedString {
    /**
     * Creates a SafeStyle object from a compile-time constant string.
     *
     * `style` should be in the format
     * `name: value; [name: value; ...]` and must not have any < or >
     * characters in it. This is so that SafeStyle's contract is preserved,
     * allowing the SafeStyle to correctly be interpreted as a sequence of CSS
     * declarations and without affecting the syntactic structure of any
     * surrounding CSS and HTML.
     *
     * This method performs basic sanity checks on the format of `style`
     * but does not constrain the format of `name` and `value`, except
     * for disallowing tag characters.
     *
     * @param {!Const} style A compile-time-constant string from which
     *     to create a SafeStyle.
     * @return {!SafeStyle} A SafeStyle object initialized to
     *     `style`.
     */
    static fromConstant(style: Const): SafeStyle;
    /**
     * Performs a runtime check that the provided object is indeed a
     * SafeStyle object, and returns its value.
     *
     * @param {!SafeStyle} safeStyle The object to extract from.
     * @return {string} The safeStyle object's contained string, unless
     *     the run-time type check fails. In that case, `unwrap` returns an
     *     innocuous string, or, if assertions are enabled, throws
     *     `AssertionError`.
     */
    static unwrap(safeStyle: SafeStyle): string;
    /**
     * Package-internal utility method to create SafeStyle instances.
     *
     * @param {string} style The string to initialize the SafeStyle object with.
     * @return {!SafeStyle} The initialized SafeStyle object.
     * @package
     */
    static createSafeStyleSecurityPrivateDoNotAccessOrElse(style: string): SafeStyle;
    /**
     * Creates a new SafeStyle object from the properties specified in the map.
     * @param {!SafeStyle.PropertyMap} map Mapping of property names to
     *     their values, for example {'margin': '1px'}. Names must consist of
     *     [-_a-zA-Z0-9]. Values might be strings consisting of
     *     [-,.'"%_!# a-zA-Z0-9[\]], where ", ', and [] must be properly balanced.
     *     We also allow simple functions like rgb() and url() which sanitizes its
     *     contents. Other values must be wrapped in Const. URLs might
     *     be passed as SafeUrl which will be wrapped into url(""). We
     *     also support array whose elements are joined with ' '. Null value
     * causes skipping the property.
     * @return {!SafeStyle}
     * @throws {!Error} If invalid name is provided.
   * @suppress{checkTypes}
     * @throws {!AssertionError} If invalid value is provided. With
     *     disabled assertions, invalid value is replaced by
     *     SafeStyle.INNOCUOUS_STRING.
     */
    static create(map: SafeStyle.PropertyMap): SafeStyle;
    /**
     * Creates a new SafeStyle object by concatenating the values.
   * @suppress{checkTypes}
     * @param {...(!SafeStyle|!Array<!SafeStyle>)} var_args
     *     SafeStyles to concatenate.
     * @return {!SafeStyle}
     */
    static concat(...args: (SafeStyle | SafeStyle[])[]): SafeStyle;
    /**
     * @param {string} value
     * @param {!Object} token package-internal implementation detail.
     */
    constructor(value: string, token: any);
    /**
     * The contained value of this SafeStyle.  The field has a purposely
     * ugly name to make (non-compiled) code that attempts to directly access
     * this field stand out.
     * @private {string}
     */
    private privateDoNotAccessOrElseSafeStyleWrappedValue_;
    /**
     * @override
     * @const {boolean}
     */
    implementsGoogStringTypedString: boolean;
    /**
     * Returns this SafeStyle's value as a string.
     *
     * IMPORTANT: In code where it is security relevant that an object's type is
     * indeed `SafeStyle`, use `SafeStyle.unwrap` instead of
     * this method. If in doubt, assume that it's security relevant. In
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
     * @return {string}
     * @see SafeStyle#unwrap
     * @override
     */
    getTypedStringValue(): string;
    /**
     * Returns a string-representation of this value.
     *
     * To obtain the actual string value wrapped in a SafeStyle, use
     * `SafeStyle.unwrap`.
     *
     * @return {string}
     * @see SafeStyle#unwrap
     * @override
     */
    toString(): string;
}
export namespace SafeStyle {
    const EMPTY: SafeStyle;
    const INNOCUOUS_STRING: string;
    /**
     * A single property value.
     */
    type PropertyValue = string | Const | SafeUrl;
    /**
     * Mapping of property names to their values.
     * We don't support numbers even though some values might be numbers (e.g.
     * line-height or 0 for any length). The reason is that most numeric values need
     * units (e.g. '1px') and allowing numbers could cause users forgetting about
     * them.
     */
    type PropertyMap = {
        [x: string]: string | Const | SafeUrl | PropertyValue[] | null;
    };
}
import { TypedString } from "../string/typedstring.js";
import { Const } from "../string/const.js";
import { SafeUrl } from "./safeurl.js";
