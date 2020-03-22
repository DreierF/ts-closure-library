/**
 * @fileoverview The SafeStyle type and its builders.
 *
 * TODO(xtof): Link to document stating type contract.
 */
/**
 * A string-like object which represents a sequence of CSS declarations
 * ({@code propertyName1: propertyvalue1; propertyName2: propertyValue2; ...})
 * and that carries the security type contract that its value, as a string,
 * will not cause untrusted script execution (XSS) when evaluated as CSS in a
 * browser.
 *
 * Instances of this type must be created via the factory methods
 * (`SafeStyle.create` or
 * `SafeStyle.fromConstant`) and not by invoking its
 * constructor. The constructor intentionally takes no parameters and the type
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
 * "{@code font: 'foo &lt;style/&gt;&lt;script&gt;evil&lt;/script&gt;'}" were
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
 * {@code SafeStyle.unwrap(style1) +
 * SafeStyle.unwrap(style2)} must itself be a value that satisfies
 * the SafeStyle type constraint. This requirement implies that for any value
 * `style` of this type, `SafeStyle.unwrap(style)` must
 * not end in a "property value" or "property name" context. For example,
 * a value of {@code background:url("} or {@code font-} would not satisfy the
 * SafeStyle contract. This is because concatenating such strings with a
 * second value that itself does not contain unsafe CSS can result in an
 * overall string that does. For example, if {@code javascript:evil())"} is
 * appended to {@code background:url("}, the resulting string may result in
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
 * @class
 * @implements {TypedString}
 */
export class SafeStyle {
    /**
     * @override
     * @const
     */
    implementsGoogStringTypedString: boolean;
    /**
     * The contained value of this SafeStyle.  The field has a purposely
     * ugly name to make (non-compiled) code that attempts to directly access this
     * field stand out.
     * @private {string}
     */
    privateDoNotAccessOrElseSafeStyleWrappedValue_: string;
    /**
     * A type marker used to implement additional run-time type checking.
     * @see SafeStyle#unwrap
     * @const {!Object}
     * @private
     */
    SAFE_STYLE_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_: {};
    /**
     * Returns this SafeStyle's value as a string.
     *
     * IMPORTANT: In code where it is security relevant that an object's type is
     * indeed `SafeStyle`, use `SafeStyle.unwrap` instead of
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
     * @see SafeStyle#unwrap
     * @override
     */
    getTypedStringValue(): string;
    /**
     * Called from createSafeStyleSecurityPrivateDoNotAccessOrElse(). This
     * method exists only so that the compiler can dead code eliminate static
     * fields (like EMPTY) when they're not accessed.
     * @param {string} style
     * @return {!SafeStyle}
     * @private
     */
    initSecurityPrivateDoNotAccessOrElse_(style: string): SafeStyle;
}
export namespace SafeStyle {
    export const TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_: {};
    export const EMPTY: SafeStyle;
    export const INNOCUOUS_STRING: string;
    export const VALUE_ALLOWED_CHARS_: string;
    export const VALUE_RE_: RegExp;
    export const URL_RE_: RegExp;
    export const ALLOWED_FUNCTIONS_: string[];
    export const FUNCTIONS_RE_: RegExp;
    export const COMMENT_RE_: RegExp;
    /**
     * A single property value.
     */
    export type PropertyValue = string | Const | SafeUrl;
    /**
     * Mapping of property names to their values.
     * We don't support numbers even though some values might be numbers (e.g.
     * line-height or 0 for any length). The reason is that most numeric values need
     * units (e.g. '1px') and allowing numbers could cause users forgetting about
     * them.
     */
    export type PropertyMap = {
        [x: string]: string | Const | SafeUrl | (string | Const | SafeUrl)[] | null;
    };
}
import { Const } from "../string/const.js";
import { SafeUrl } from "./safeurl.js";
