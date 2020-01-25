/**
 * @fileoverview The SafeUrl type and its builders.
 *
 * TODO(xtof): Link to document stating type contract.
 */
/**
 * A string that is safe to use in URL context in DOM APIs and HTML documents.
 *
 * A SafeUrl is a string-like object that carries the security type contract
 * that its value as a string will not cause untrusted script execution
 * when evaluated as a hyperlink URL in a browser.
 *
 * Values of this type are guaranteed to be safe to use in URL/hyperlink
 * contexts, such as assignment to URL-valued DOM properties, in the sense that
 * the use will not result in a Cross-Site-Scripting vulnerability. Similarly,
 * SafeUrls can be interpolated into the URL context of an HTML template (e.g.,
 * inside a href attribute). However, appropriate HTML-escaping must still be
 * applied.
 *
 * Note that, as documented in `SafeUrl.unwrap`, this type's
 * contract does not guarantee that instances are safe to interpolate into HTML
 * without appropriate escaping.
 *
 * Note also that this type's contract does not imply any guarantees regarding
 * the resource the URL refers to.  In particular, SafeUrls are <b>not</b>
 * safe to use in a context where the referred-to resource is interpreted as
 * trusted code, e.g., as the src of a script tag.
 *
 * Instances of this type must be created via the factory methods
 * (`SafeUrl.fromConstant`, `SafeUrl.sanitize`),
 * etc and not by invoking its constructor. The constructor is organized in a
 * way that only methods from that file can call it and initialize with
 * non-empty values. Anyone else calling constructor will get default instance
 * with empty value.
 *
 * @see SafeUrl#fromConstant
 * @see SafeUrl#from
 * @see SafeUrl#sanitize
 * @final
 * @class
 * @implements {DirectionalString}
 * @implements {TypedString}
 */
export class SafeUrl {
    /**
     * A string that is safe to use in URL context in DOM APIs and HTML documents.
     *
     * A SafeUrl is a string-like object that carries the security type contract
     * that its value as a string will not cause untrusted script execution
     * when evaluated as a hyperlink URL in a browser.
     *
     * Values of this type are guaranteed to be safe to use in URL/hyperlink
     * contexts, such as assignment to URL-valued DOM properties, in the sense that
     * the use will not result in a Cross-Site-Scripting vulnerability. Similarly,
     * SafeUrls can be interpolated into the URL context of an HTML template (e.g.,
     * inside a href attribute). However, appropriate HTML-escaping must still be
     * applied.
     *
     * Note that, as documented in `SafeUrl.unwrap`, this type's
     * contract does not guarantee that instances are safe to interpolate into HTML
     * without appropriate escaping.
     *
     * Note also that this type's contract does not imply any guarantees regarding
     * the resource the URL refers to.  In particular, SafeUrls are <b>not</b>
     * safe to use in a context where the referred-to resource is interpreted as
     * trusted code, e.g., as the src of a script tag.
     *
     * Instances of this type must be created via the factory methods
     * (`SafeUrl.fromConstant`, `SafeUrl.sanitize`),
     * etc and not by invoking its constructor. The constructor is organized in a
     * way that only methods from that file can call it and initialize with
     * non-empty values. Anyone else calling constructor will get default instance
     * with empty value.
     *
     * @see SafeUrl#fromConstant
     * @see SafeUrl#from
     * @see SafeUrl#sanitize
     * @param {!Object=} opt_token package-internal implementation detail.
     * @param {string=} opt_content package-internal implementation detail.
     */
    constructor(opt_token?: any, opt_content?: string);
    /**
     * @override
     * @const
     */
    implementsGoogStringTypedString: boolean;
    /**
     * @override
     * @const
     */
    implementsGoogI18nBidiDirectionalString: boolean;
    /**
     * The contained value of this SafeUrl.  The field has a purposely ugly
     * name to make (non-compiled) code that attempts to directly access this
     * field stand out.
     * @private {string}
     */
    privateDoNotAccessOrElseSafeUrlWrappedValue_: string;
    /**
     * A type marker used to implement additional run-time type checking.
     * @see SafeUrl#unwrap
     * @const {!Object}
     * @private
     */
    SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_: {};
    /**
     * Returns this SafeUrl's value a string.
     *
     * IMPORTANT: In code where it is security relevant that an object's type is
     * indeed `SafeUrl`, use `SafeUrl.unwrap` instead of this
     * method. If in doubt, assume that it's security relevant. In particular, note
     * that google.html functions which return a google.html type do not guarantee that
     * the returned instance is of the right type.
     *
     * IMPORTANT: The guarantees of the SafeUrl type contract only extend to the
     * behavior of browsers when interpreting URLs. Values of SafeUrl objects MUST
     * be appropriately escaped before embedding in a HTML document. Note that the
     * required escaping is context-sensitive (e.g. a different escaping is
     * required for embedding a URL in a style property within a style
     * attribute, as opposed to embedding in a href attribute).
     *
     * @see SafeUrl#unwrap
     * @override
     */
    getTypedStringValue(): string;
    /**
     * Returns this URLs directionality, which is always `LTR`.
     * @override
     */
    getDirection(): any;
}
export namespace SafeUrl {
    export const INNOCUOUS_STRING: string;
    export { SAFE_URL_PATTERN_ as SAFE_URL_PATTERN };
    export const TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_: {};
    export const ABOUT_BLANK: SafeUrl;
    export const CONSTRUCTOR_TOKEN_PRIVATE_: {};
}
/**
 * A pattern that recognizes a commonly useful subset of URLs that satisfy
 * the SafeUrl contract.
 *
 * This regular expression matches a subset of URLs that will not cause script
 * execution if used in URL context within a HTML document. Specifically, this
 * regular expression matches if (comment from here on and regex copied from
 * Soy's EscapingConventions):
 * (1) Either a protocol in a whitelist (http, https, mailto or ftp).
 * (2) or no protocol.  A protocol must be followed by a colon. The below
 *     allows that by allowing colons only after one of the characters [/?#].
 *     A colon after a hash (#) must be in the fragment.
 *     Otherwise, a colon after a (?) must be in a query.
 *     Otherwise, a colon after a single solidus (/) must be in a path.
 *     Otherwise, a colon after a double solidus (//) must be in the authority
 *     (before port).
 *
 * @private
 * @const {!RegExp}
 */
declare let SAFE_URL_PATTERN_: RegExp;
export {};
