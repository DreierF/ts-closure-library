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
export class SafeHtml implements DirectionalString, TypedString {
    /**
     * Performs a runtime check that the provided object is indeed a SafeHtml
     * object, and returns its value.
     * @param {!SafeHtml} safeHtml The object to extract from.
     * @return {string} The SafeHtml object's contained string, unless the run-time
     *     type check fails. In that case, `unwrap` returns an innocuous
     *     string, or, if assertions are enabled, throws
     *     `AssertionError`.
     */
    static unwrap(safeHtml: SafeHtml): string;
    /**
     * Unwraps value as TrustedHTML if supported or as a string if not.
     * @param {!SafeHtml} safeHtml
     * @return {!TrustedHTML|string}
     * @see SafeHtml.unwrap
     */
    static unwrapTrustedHTML(safeHtml: SafeHtml): any | string;
    /**
     * Returns HTML-escaped text as a SafeHtml object.
     *
     * If text is of a type that implements
     * `DirectionalString`, the directionality of the new
     * `SafeHtml` object is set to `text`'s directionality, if known.
     * Otherwise, the directionality of the resulting SafeHtml is unknown (i.e.,
     * `null`).
     *
     * @param {!SafeHtml.TextOrHtml_} textOrHtml The text to escape. If
     *     the parameter is of type SafeHtml it is returned directly (no escaping
     *     is done).
     * @return {!SafeHtml} The escaped text, wrapped as a SafeHtml.
     */
    static htmlEscape(textOrHtml: SafeHtml.TextOrHtml_): SafeHtml;
    /**
     * Returns HTML-escaped text as a SafeHtml object, with newlines changed to
     * &lt;br&gt;.
     * @param {!SafeHtml.TextOrHtml_} textOrHtml The text to escape. If
     *     the parameter is of type SafeHtml it is returned directly (no escaping
     *     is done).
     * @return {!SafeHtml} The escaped text, wrapped as a SafeHtml.
     */
    static htmlEscapePreservingNewlines(textOrHtml: SafeHtml.TextOrHtml_): SafeHtml;
    /**
     * Returns HTML-escaped text as a SafeHtml object, with newlines changed to
     * &lt;br&gt; and escaping whitespace to preserve spatial formatting. Character
     * entity #160 is used to make it safer for XML.
     * @param {!SafeHtml.TextOrHtml_} textOrHtml The text to escape. If
     *     the parameter is of type SafeHtml it is returned directly (no escaping
     *     is done).
     * @return {!SafeHtml} The escaped text, wrapped as a SafeHtml.
     */
    static htmlEscapePreservingNewlinesAndSpaces(textOrHtml: SafeHtml.TextOrHtml_): SafeHtml;
    /**
     * Coerces an arbitrary object into a SafeHtml object.
     *
     * If `textOrHtml` is already of type `SafeHtml`, the same
     * object is returned. Otherwise, `textOrHtml` is coerced to string, and
     * HTML-escaped. If `textOrHtml` is of a type that implements
     * `DirectionalString`, its directionality, if known, is
     * preserved.
     *
     * @param {!SafeHtml.TextOrHtml_} textOrHtml The text or SafeHtml to
     *     coerce.
     * @return {!SafeHtml} The resulting SafeHtml object.
     * @deprecated Use SafeHtml.htmlEscape.
     */
    static from(textOrHtml: SafeHtml.TextOrHtml_): SafeHtml;
    /**
     * Creates a SafeHtml content consisting of a tag with optional attributes and
     * optional content.
     *
     * For convenience tag names and attribute names are accepted as regular
     * strings, instead of Const. Nevertheless, you should not pass
     * user-controlled values to these parameters. Note that these parameters are
     * syntactically validated at runtime, and invalid values will result in
     * an exception.
     *
     * Example usage:
     *
     * SafeHtml.create('br');
     * SafeHtml.create('div', {'class': 'a'});
     * SafeHtml.create('p', {}, 'a');
     * SafeHtml.create('p', {}, SafeHtml.create('br'));
     *
     * SafeHtml.create('span', {
     *   'style': {'margin': '0'}
     * });
     *
     * To guarantee SafeHtml's type contract is upheld there are restrictions on
     * attribute values and tag names.
     *
     * - For attributes which contain script code (on*), a Const is
     *   required.
     * - For attributes which contain style (style), a SafeStyle or a
     *   SafeStyle.PropertyMap is required.
     * - For attributes which are interpreted as URLs (e.g. src, href) a
     *   Html_SafeUrl, Const or string is required. If a string
     *   is passed, it will be sanitized with SafeUrl.sanitize().
     * - For tags which can load code or set security relevant page metadata,
     *   more specific SafeHtml.create*() functions must be used. Tags
     *   which are not supported by this function are applet, base, embed, iframe,
     *   link, math, object, script, style, svg, and template.
     *
     * @param {!TagName|string} tagName The name of the tag. Only tag names
     *     consisting of [a-zA-Z0-9-] are allowed. Tag names documented above are
     *     disallowed.
     * @param {?Object<string, ?SafeHtml.AttributeValue>=} opt_attributes
     *     Mapping from attribute names to their values. Only attribute names
     *     consisting of [a-zA-Z0-9-] are allowed. Value of null or undefined causes
     *     the attribute to be omitted.
     * @param {!SafeHtml.TextOrHtml_|
     *     !Array<!SafeHtml.TextOrHtml_>=} opt_content Content to
     *     HTML-escape and put inside the tag. This must be empty for void tags
     *     like <br>. Array elements are concatenated.
     * @return {!SafeHtml} The SafeHtml content with the tag.
     * @throws {Error} If invalid tag name, attribute name, or attribute value is
     *     provided.
     * @throws {AssertionError} If content for void tag is provided.
     */
    static create(tagName: TagName | string, opt_attributes?: ({
        [x: string]: SafeHtml.AttributeValue | null;
    } | null) | undefined, opt_content?: (SafeHtml.TextOrHtml_ | Array<SafeHtml.TextOrHtml_>) | undefined): SafeHtml;
    /**
     * Verifies if the tag name is valid and if it doesn't change the context.
     * E.g. STRONG is fine but SCRIPT throws because it changes context. See
     * SafeHtml.create for an explanation of allowed tags.
     * @param {string} tagName
     * @throws {Error} If invalid tag name is provided.
     * @package
     */
    static verifyTagName(tagName: string): void;
    /**
     * Creates a SafeHtml representing an iframe tag.
     *
     * This by default restricts the iframe as much as possible by setting the
     * sandbox attribute to the empty string. If the iframe requires less
     * restrictions, set the sandbox attribute as tight as possible, but do not rely
     * on the sandbox as a security feature because it is not supported by older
     * browsers. If a sandbox is essential to security (e.g. for third-party
     * frames), use createSandboxIframe which checks for browser support.
     *
     * @see https://developer.mozilla.org/en/docs/Web/HTML/Element/iframe#attr-sandbox
     *
     * @param {?Html_TrustedResourceUrl=} opt_src The value of the src
     *     attribute. If null or undefined src will not be set.
     * @param {?SafeHtml=} opt_srcdoc The value of the srcdoc attribute.
     *     If null or undefined srcdoc will not be set.
     * @param {?Object<string, ?SafeHtml.AttributeValue>=} opt_attributes
     *     Mapping from attribute names to their values. Only attribute names
     *     consisting of [a-zA-Z0-9-] are allowed. Value of null or undefined causes
     *     the attribute to be omitted.
     * @param {!SafeHtml.TextOrHtml_|
     *     !Array<!SafeHtml.TextOrHtml_>=} opt_content Content to
     *     HTML-escape and put inside the tag. Array elements are concatenated.
     * @return {!SafeHtml} The SafeHtml content with the tag.
     * @throws {Error} If invalid tag name, attribute name, or attribute value is
     *     provided. If opt_attributes contains the src or srcdoc attributes.
     */
    static createIframe(opt_src?: (Html_TrustedResourceUrl | null) | undefined, opt_srcdoc?: (SafeHtml | null) | undefined, opt_attributes?: ({
        [x: string]: SafeHtml.AttributeValue | null;
    } | null) | undefined, opt_content?: (SafeHtml.TextOrHtml_ | Array<SafeHtml.TextOrHtml_>) | undefined): SafeHtml;
    /**
     * Creates a SafeHtml representing a sandboxed iframe tag.
     *
     * The sandbox attribute is enforced in its most restrictive mode, an empty
     * string. Consequently, the security requirements for the src and srcdoc
     * attributes are relaxed compared to SafeHtml.createIframe. This function
     * will throw on browsers that do not support the sandbox attribute, as
     * determined by SafeHtml.canUseSandboxIframe.
     *
     * The SafeHtml returned by this function can trigger downloads with no
     * user interaction on Chrome (though only a few, further attempts are blocked).
     * Firefox and IE will block all downloads from the sandbox.
     *
     * @see https://developer.mozilla.org/en/docs/Web/HTML/Element/iframe#attr-sandbox
     * @see https://lists.w3.org/Archives/Public/public-whatwg-archive/2013Feb/0112.html
     *
     * @param {string|!Html_SafeUrl=} opt_src The value of the src
     *     attribute. If null or undefined src will not be set.
     * @param {string=} opt_srcdoc The value of the srcdoc attribute.
     *     If null or undefined srcdoc will not be set. Will not be sanitized.
     * @param {!Object<string, ?SafeHtml.AttributeValue>=} opt_attributes
     *     Mapping from attribute names to their values. Only attribute names
     *     consisting of [a-zA-Z0-9-] are allowed. Value of null or undefined causes
     *     the attribute to be omitted.
     * @param {!SafeHtml.TextOrHtml_|
     *     !Array<!SafeHtml.TextOrHtml_>=} opt_content Content to
     *     HTML-escape and put inside the tag. Array elements are concatenated.
     * @return {!SafeHtml} The SafeHtml content with the tag.
     * @throws {Error} If invalid tag name, attribute name, or attribute value is
     *     provided. If opt_attributes contains the src, srcdoc or sandbox
     *     attributes. If browser does not support the sandbox attribute on iframe.
     */
    static createSandboxIframe(opt_src?: (string | Html_SafeUrl) | undefined, opt_srcdoc?: string | undefined, opt_attributes?: {
        [x: string]: SafeHtml.AttributeValue | null;
    } | undefined, opt_content?: (SafeHtml.TextOrHtml_ | Array<SafeHtml.TextOrHtml_>) | undefined): SafeHtml;
    /**
     * Checks if the user agent supports sandboxed iframes.
     * @return {boolean}
     */
    static canUseSandboxIframe(): boolean;
    /**
     * Creates a SafeHtml representing a script tag with the src attribute.
     * @param {!Html_TrustedResourceUrl} src The value of the src
     * attribute.
     * @param {?Object<string, ?SafeHtml.AttributeValue>=}
     * opt_attributes
     *     Mapping from attribute names to their values. Only attribute names
     *     consisting of [a-zA-Z0-9-] are allowed. Value of null or undefined
     *     causes the attribute to be omitted.
     * @return {!SafeHtml} The SafeHtml content with the tag.
     * @throws {Error} If invalid attribute name or value is provided. If
     *     opt_attributes contains the src attribute.
     */
    static createScriptSrc(src: Html_TrustedResourceUrl, opt_attributes?: ({
        [x: string]: SafeHtml.AttributeValue | null;
    } | null) | undefined): SafeHtml;
    /**
     * Creates a SafeHtml representing a script tag. Does not allow the language,
     * src, text or type attributes to be set.
     * @param {!SafeScript|!Array<!SafeScript>}
     *     script Content to put inside the tag. Array elements are
     *     concatenated.
     * @param {?Object<string, ?SafeHtml.AttributeValue>=} opt_attributes
     *     Mapping from attribute names to their values. Only attribute names
     *     consisting of [a-zA-Z0-9-] are allowed. Value of null or undefined causes
     *     the attribute to be omitted.
     * @return {!SafeHtml} The SafeHtml content with the tag.
     * @throws {Error} If invalid attribute name or attribute value is provided. If
     *     opt_attributes contains the language, src, text or type attribute.
     */
    static createScript(script: SafeScript | Array<SafeScript>, opt_attributes?: ({
        [x: string]: SafeHtml.AttributeValue | null;
    } | null) | undefined): SafeHtml;
    /**
     * Creates a SafeHtml representing a style tag. The type attribute is set
     * to "text/css".
     * @param {!SafeStyleSheet|!Array<!SafeStyleSheet>}
     *     styleSheet Content to put inside the tag. Array elements are
     *     concatenated.
     * @param {?Object<string, ?SafeHtml.AttributeValue>=} opt_attributes
     *     Mapping from attribute names to their values. Only attribute names
     *     consisting of [a-zA-Z0-9-] are allowed. Value of null or undefined causes
     *     the attribute to be omitted.
     * @return {!SafeHtml} The SafeHtml content with the tag.
     * @throws {Error} If invalid attribute name or attribute value is provided. If
     *     opt_attributes contains the type attribute.
     */
    static createStyle(styleSheet: SafeStyleSheet | Array<SafeStyleSheet>, opt_attributes?: ({
        [x: string]: SafeHtml.AttributeValue | null;
    } | null) | undefined): SafeHtml;
    /**
     * Creates a SafeHtml representing a meta refresh tag.
     * @param {!Html_SafeUrl|string} url Where to redirect. If a string is
     *     passed, it will be sanitized with SafeUrl.sanitize().
     * @param {number=} opt_secs Number of seconds until the page should be
     *     reloaded. Will be set to 0 if unspecified.
     * @return {!SafeHtml} The SafeHtml content with the tag.
     */
    static createMetaRefresh(url: Html_SafeUrl | string, opt_secs?: number | undefined): SafeHtml;
    /**
     * @param {string} tagName The tag name.
     * @param {string} name The attribute name.
     * @param {!SafeHtml.AttributeValue} value The attribute value.
     * @return {string} A "name=value" string.
     * @throws {Error} If attribute value is unsafe for the given tag and attribute.
     * @private
     */
    private static getAttrNameAndValue_;
    /**
     * Gets value allowed in "style" attribute
     * @suppress{checkTypes}.
     * @param {!SafeHtml.AttributeValue} value It could be SafeStyle or a
     *     map which will be passed to SafeStyle.create.
     * @return {string} Unwrapped value.
     * @throws {Error} If string value is given.
     * @private
     */
    private static getStyleValue_;
    /**
     * Creates a SafeHtml content with known directionality consisting of a tag with
     * optional attributes and optional content.
     * @param {!Dir} dir Directionality.
     * @param {string} tagName
     * @param {?Object<string, ?SafeHtml.AttributeValue>=} opt_attributes
     * @param {!SafeHtml.TextOrHtml_|
     *     !Array<!SafeHtml.TextOrHtml_>=} opt_content
     * @return {!SafeHtml} The SafeHtml content with the tag.
     */
    static createWithDir(dir: Dir, tagName: string, opt_attributes?: ({
        [x: string]: SafeHtml.AttributeValue | null;
    } | null) | undefined, opt_content?: (SafeHtml.TextOrHtml_ | Array<SafeHtml.TextOrHtml_>) | undefined): SafeHtml;
    /**
     * Creates a new SafeHtml object by joining the parts with separator.
     * @suppress{checkTypes}
     * @param {!SafeHtml.TextOrHtml_} separator
     * @param {!Array<!SafeHtml.TextOrHtml_|
     *     !Array<!SafeHtml.TextOrHtml_>>} parts Parts to join. If a part
     *     contains an array then each member of this array is also joined with the
     *     separator.
     * @return {!SafeHtml}
     */
    static join(separator: SafeHtml.TextOrHtml_, parts: Array<SafeHtml.TextOrHtml_ | Array<SafeHtml.TextOrHtml_>>): SafeHtml;
    /**
     * Creates a new SafeHtml object by concatenating values.
     * @param {...(!SafeHtml.TextOrHtml_|
     *     !Array<!SafeHtml.TextOrHtml_>)} var_args Values to concatenate.
     * @return {!SafeHtml}
     */
    static concat(...args: (string | number | boolean | DirectionalString | TypedString | (string | number | boolean | DirectionalString | TypedString)[])[]): SafeHtml;
    /**
     * Creates a new SafeHtml object with known directionality by concatenating the
     * values.
     * @param {!Dir} dir Directionality.
     * @param {...(!SafeHtml.TextOrHtml_|
     *     !Array<!SafeHtml.TextOrHtml_>)} var_args Elements of array
     *     arguments would be processed recursively.
     * @return {!SafeHtml}
     */
    static concatWithDir(dir: Dir, ...args: (string | number | boolean | DirectionalString | TypedString | (string | number | boolean | DirectionalString | TypedString)[])[]): SafeHtml;
    /**
     * Package-internal utility method to create SafeHtml instances.
     *
     * @param {string} html The string to initialize the SafeHtml object with.
     * @param {?Dir} dir The directionality of the SafeHtml to be
     *     constructed, or null if unknown.
     * @return {!SafeHtml} The initialized SafeHtml object.
     * @package
     */
    static createSafeHtmlSecurityPrivateDoNotAccessOrElse(html: string, dir: Dir | null): SafeHtml;
    /**
     * Like create() but does not restrict which tags can be constructed.
     *
     * @param {string} tagName Tag name. Set or validated by caller.
     * @param {?Object<string, ?SafeHtml.AttributeValue>=} opt_attributes
     * @param {(!SafeHtml.TextOrHtml_|
     *     !Array<!SafeHtml.TextOrHtml_>)=} opt_content
     * @return {!SafeHtml}
     * @throws {Error} If invalid or unsafe attribute name or value is provided.
     * @throws {AssertionError} If content for void tag is provided.
     * @package
     */
    static createSafeHtmlTagSecurityPrivateDoNotAccessOrElse(tagName: string, opt_attributes?: ({
        [x: string]: SafeHtml.AttributeValue | null;
    } | null) | undefined, opt_content?: (SafeHtml.TextOrHtml_ | Array<SafeHtml.TextOrHtml_>) | undefined): SafeHtml;
    /**
     * Creates a string with attributes to insert after tagName.
     * @param {string} tagName
     * @param {?Object<string, ?SafeHtml.AttributeValue>=} opt_attributes
     * @return {string} Returns an empty string if there are no attributes, returns
     *     a string starting with a space otherwise.
     * @throws {Error} If attribute value is unsafe for the given tag and attribute.
     * @package
     */
    static stringifyAttributes(tagName: string, opt_attributes?: ({
        [x: string]: SafeHtml.AttributeValue | null;
    } | null) | undefined): string;
    /**
     * @param {!Object<string, ?SafeHtml.AttributeValue>} fixedAttributes
     * @param {!Object<string, string>} defaultAttributes
     * @param {?Object<string, ?SafeHtml.AttributeValue>=} opt_attributes
     *     Optional attributes passed to create*().
     * @return {!Object<string, ?SafeHtml.AttributeValue>}
     * @throws {Error} If opt_attributes contains an attribute with the same name
     *     as an attribute in fixedAttributes.
     * @package
     */
    static combineAttributes(fixedAttributes: {
        [x: string]: SafeHtml.AttributeValue | null;
    }, defaultAttributes: {
        [x: string]: string;
    }, opt_attributes?: ({
        [x: string]: SafeHtml.AttributeValue | null;
    } | null) | undefined): {
        [x: string]: SafeHtml.AttributeValue | null;
    };
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
    private privateDoNotAccessOrElseSafeHtmlWrappedValue_;
    /**
     * A type marker used to implement additional run-time type checking.
     * @see SafeHtml.unwrap
     * @const {!Object}
     * @private
     */
    private SAFE_HTML_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
    /**
     * This SafeHtml's directionality, or null if unknown.
     * @private {?Dir}
     */
    private dir_;
    /** @override */
    getDirection(): number | null;
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
    private initSecurityPrivateDoNotAccessOrElse_;
}
export namespace SafeHtml {
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
        [x: string]: string | Const | Html_SafeUrl | (string | Const | Html_SafeUrl)[] | null;
    } | undefined;
}
import { DirectionalString } from "../i18n/bidi.js";
import { TypedString } from "../string/typedstring.js";
import { TagName } from "../dom/tagname.js";
import { TrustedResourceUrl as Html_TrustedResourceUrl } from "./trustedresourceurl.js";
import { SafeUrl as Html_SafeUrl } from "./safeurl.js";
import { SafeScript } from "./safescript.js";
import { SafeStyleSheet } from "./safestylesheet.js";
import { Dir } from "../i18n/bidi.js";
import { Const } from "../string/const.js";
