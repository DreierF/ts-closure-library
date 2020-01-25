/**
 * @type {boolean} Whether to strip out error messages or to leave them in.
 */
export const ENABLE_ERROR_MESSAGES: boolean;
/**
 * Whether the `style` attribute is supported. Set to false to avoid the byte
 * weight of `SafeStyle` where unneeded. An error will be thrown if
 * the `style` attribute is used.
 * @type {boolean}
 */
export const SUPPORT_STYLE_ATTRIBUTE: boolean;
/**
 * @fileoverview The SafeHtml type and its builders.
 *
 * TODO(xtof): Link to document stating type contract.
 */
/**
 * A string that is safe to use in HTML context in DOM APIs and HTML documents.
 *
 * A SafeHtml is a string-like object that carries the security type contract
 * that its value as a string will not cause untrusted script execution when
 * evaluated as HTML in a browser.
 *
 * Values of this type are guaranteed to be safe to use in HTML contexts,
 * such as, assignment to the innerHTML DOM property, or interpolation into
 * a HTML template in HTML PC_DATA context, in the sense that the use will not
 * result in a Cross-Site-Scripting vulnerability.
 *
 * Instances of this type must be created via the factory methods
 * (`SafeHtml.create`, `SafeHtml.htmlEscape`),
 * etc and not by invoking its constructor.  The constructor intentionally
 * takes no parameters and the type is immutable; hence only a default instance
 * corresponding to the empty string can be obtained via constructor invocation.
 *
 * Note that there is no `SafeHtml.fromConstant`. The reason is that
 * the following code would create an unsafe HTML:
 *
 * ```
 * SafeHtml.concat(
 *     SafeHtml.fromConstant(Const.from('<script>')),
 *     SafeHtml.htmlEscape(userInput),
 *     SafeHtml.fromConstant(Const.from('<\/script>')));
 * ```
 *
 * There's `goog.dom.constHtmlToNode` to create a node from constant strings
 * only.
 *
 * @see SafeHtml.create
 * @see SafeHtml.htmlEscape
 * @final
 * @class
 * @implements {DirectionalString}
 * @implements {TypedString}
 */
export class SafeHtml {
    /**
     * @override
     * @const
     */
    implementsGoogI18nBidiDirectionalString: boolean;
    /**
     * @override
     * @const
     */
    implementsGoogStringTypedString: boolean;
    /**
     * The contained value of this SafeHtml.  The field has a purposely ugly
     * name to make (non-compiled) code that attempts to directly access this
     * field stand out.
     * @private {!TrustedHTML|string}
     */
    privateDoNotAccessOrElseSafeHtmlWrappedValue_: string;
    /**
     * A type marker used to implement additional run-time type checking.
     * @see SafeHtml.unwrap
     * @const {!Object}
     * @private
     */
    SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_: {};
    /**
     * This SafeHtml's directionality, or null if unknown.
     * @private {?Dir}
     */
    dir_: number;
    /** @override */
    getDirection(): number;
    /**
     * Returns this SafeHtml's value as string.
     *
     * IMPORTANT: In code where it is security relevant that an object's type is
     * indeed `SafeHtml`, use `SafeHtml.unwrap` instead of
     * this method. If in doubt, assume that it's security relevant. In particular,
     * note that google.html functions which return a google.html type do not guarantee
     * that the returned instance is of the right type. For example:
     *
     * <pre>
     * var fakeSafeHtml = new String('fake');
     * fakeSafeHtml.__proto__ = SafeHtml.prototype;
     * var newSafeHtml = SafeHtml.htmlEscape(fakeSafeHtml);
     * // newSafeHtml is just an alias for fakeSafeHtml, it's passed through by
     * // SafeHtml.htmlEscape() as fakeSafeHtml
     * // instanceof SafeHtml.
     * </pre>
     *
     * @see SafeHtml.unwrap
     * @override
     */
    getTypedStringValue(): string;
    /**
     * Called from createSafeHtmlSecurityPrivateDoNotAccessOrElse(). This
     * method exists only so that the compiler can dead code eliminate static
     * fields (like EMPTY) when they're not accessed.
     * @param {string} html
     * @param {?Dir} dir
     * @return {!SafeHtml}
     * @private
     */
    initSecurityPrivateDoNotAccessOrElse_(html: string, dir: number): SafeHtml;
}
export namespace SafeHtml {
    export const htmlEscape: (textOrHtml: TextOrHtml_) => SafeHtml;
    export const VALID_NAMES_IN_TAG_: RegExp;
    export const URL_ATTRIBUTES_: any;
    export const NOT_ALLOWED_TAG_NAMES_: any;
    export const TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_: {};
    export const DOCTYPE_HTML: SafeHtml;
    export const EMPTY: SafeHtml;
    export const BR: SafeHtml;
    /**
     * Shorthand for union of types that can sensibly be converted to strings
     * or might already be SafeHtml (as SafeHtml is a TypedString).
     */
    export type TextOrHtml_ = string | number | boolean | DirectionalString | TypedString;
    export type AttributeValue = string | number | TypedString | {
        [x: string]: string | Const | Html_SafeUrl | (string | Const | Html_SafeUrl)[];
    };
}
import { DirectionalString } from "../i18n/bidi.js";
import { TypedString } from "../string/typedstring.js";
import { Const } from "../string/const.js";
import { SafeUrl as Html_SafeUrl } from "./safeurl.js";
