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
export class SafeUrl implements DirectionalString, TypedString {
    /**
     * Performs a runtime check that the provided object is indeed a SafeUrl
     * object, and returns its value.
     *
     * IMPORTANT: The guarantees of the SafeUrl type contract only extend to the
     * behavior of  browsers when interpreting URLs. Values of SafeUrl objects MUST
     * be appropriately escaped before embedding in a HTML document. Note that the
     * required escaping is context-sensitive (e.g. a different escaping is
     * required for embedding a URL in a style property within a style
     * attribute, as opposed to embedding in a href attribute).
     *
     * @param {!SafeUrl} safeUrl The object to extract from.
     * @return {string} The SafeUrl object's contained string, unless the run-time
     *     type check fails. In that case, `unwrap` returns an innocuous
     *     string, or, if assertions are enabled, throws
     *     `AssertionError`.
     */
    static unwrap(safeUrl: SafeUrl): string;
    /**
     * Creates a SafeUrl object from a compile-time constant string.
     *
     * Compile-time constant strings are inherently program-controlled and hence
     * trusted.
     *
     * @param {!Const} url A compile-time-constant string from which to
     *         create a SafeUrl.
     * @return {!SafeUrl} A SafeUrl object initialized to `url`.
     */
    static fromConstant(url: Const): SafeUrl;
    /**
     * @param {string} mimeType The MIME type to check if safe.
     * @return {boolean} True if the MIME type is safe and creating a Blob via
     *   `SafeUrl.fromBlob()` with that type will not fail due to the type. False
     *   otherwise.
     */
    static isSafeMimeType(mimeType: string): boolean;
    /**
     * Creates a SafeUrl wrapping a blob URL for the given `blob`.
     *
     * The blob URL is created with `URL.createObjectURL`. If the MIME type
     * for `blob` is not of a known safe audio, image or video MIME type,
     * then the SafeUrl will wrap {@link #INNOCUOUS_STRING}.
     *
     * @see http://www.w3.org/TR/FileAPI/#url
     * @param {!Blob} blob
     * @return {!SafeUrl} The blob URL, or an innocuous string wrapped
     *   as a SafeUrl.
     */
    static fromBlob(blob: Blob): SafeUrl;
    /**
     * Creates a SafeUrl wrapping a data: URL, after validating it matches a
     * known-safe audio, image or video MIME type.
     *
     * @param {string} dataUrl A valid base64 data URL with one of the whitelisted
     *     audio, image or video MIME types.
     * @return {!SafeUrl} A matching safe URL, or {@link INNOCUOUS_STRING}
     *     wrapped as a SafeUrl if it does not pass.
     */
    static fromDataUrl(dataUrl: string): SafeUrl;
    /**
     * Creates a SafeUrl wrapping a tel: URL.
     *
     * @param {string} telUrl A tel URL.
     * @return {!SafeUrl} A matching safe URL, or {@link INNOCUOUS_STRING}
     *     wrapped as a SafeUrl if it does not pass.
     */
    static fromTelUrl(telUrl: string): SafeUrl;
    /**
     * Creates a SafeUrl wrapping a sip: URL. We only allow urls that consist of an
     * email address. The characters '?' and '#' are not allowed in the local part
     * of the email address.
     *
     * @param {string} sipUrl A sip URL.
     * @return {!SafeUrl} A matching safe URL, or {@link INNOCUOUS_STRING}
     *     wrapped as a SafeUrl if it does not pass.
     */
    static fromSipUrl(sipUrl: string): SafeUrl;
    /**
     * Creates a SafeUrl wrapping a fb-messenger://share URL.
     *
     * @param {string} facebookMessengerUrl A facebook messenger URL.
     * @return {!SafeUrl} A matching safe URL, or {@link INNOCUOUS_STRING}
     *     wrapped as a SafeUrl if it does not pass.
     */
    static fromFacebookMessengerUrl(facebookMessengerUrl: string): SafeUrl;
    /**
     * Creates a SafeUrl wrapping a whatsapp://send URL.
     *
     * @param {string} whatsAppUrl A WhatsApp URL.
     * @return {!SafeUrl} A matching safe URL, or {@link INNOCUOUS_STRING}
     *     wrapped as a SafeUrl if it does not pass.
     */
    static fromWhatsAppUrl(whatsAppUrl: string): SafeUrl;
    /**
     * Creates a SafeUrl wrapping a sms: URL.
     *
     * @param {string} smsUrl A sms URL.
     * @return {!SafeUrl} A matching safe URL, or {@link INNOCUOUS_STRING}
     *     wrapped as a SafeUrl if it does not pass.
     */
    static fromSmsUrl(smsUrl: string): SafeUrl;
    /**
     * Validates SMS URL `body` parameter, which is optional and should appear at
     * most once and should be percent-encoded if present. Rejects many malformed
     * bodies, but may spuriously reject some URLs and does not reject all malformed
     * sms: URLs.
     *
     * @param {string} smsUrl A sms URL.
     * @return {boolean} Whether SMS URL has a valid `body` parameter if it exists.
     * @private
     */
    private static isSmsUrlBodyValid_;
    /**
     * Creates a SafeUrl wrapping a ssh: URL.
     *
     * @param {string} sshUrl A ssh URL.
     * @return {!SafeUrl} A matching safe URL, or {@link INNOCUOUS_STRING}
     *     wrapped as a SafeUrl if it does not pass.
     */
    static fromSshUrl(sshUrl: string): SafeUrl;
    /**
     * Sanitizes a Chrome extension URL to SafeUrl, given a compile-time-constant
     * extension identifier. Can also be restricted to chrome extensions.
     *
     * @param {string} url The url to sanitize. Should start with the extension
     *     scheme and the extension identifier.
     * @param {!Const|!Array<!Const>} extensionId The
     *     extension id to accept, as a compile-time constant or an array of those.
     *
     * @return {!SafeUrl} Either `url` if it's deemed safe, or
     *     `INNOCUOUS_STRING` if it's not.
     */
    static sanitizeChromeExtensionUrl(url: string, extensionId: Const | Array<Const>): SafeUrl;
    /**
     * Sanitizes a Firefox extension URL to SafeUrl, given a compile-time-constant
     * extension identifier. Can also be restricted to chrome extensions.
     *
     * @param {string} url The url to sanitize. Should start with the extension
     *     scheme and the extension identifier.
     * @param {!Const|!Array<!Const>} extensionId The
     *     extension id to accept, as a compile-time constant or an array of those.
     *
     * @return {!SafeUrl} Either `url` if it's deemed safe, or
     *     `INNOCUOUS_STRING` if it's not.
     */
    static sanitizeFirefoxExtensionUrl(url: string, extensionId: Const | Array<Const>): SafeUrl;
    /**
     * Sanitizes a Edge extension URL to SafeUrl, given a compile-time-constant
     * extension identifier. Can also be restricted to chrome extensions.
     *
     * @param {string} url The url to sanitize. Should start with the extension
     *     scheme and the extension identifier.
     * @param {!Const|!Array<!Const>} extensionId The
     *     extension id to accept, as a compile-time constant or an array of those.
     *
     * @return {!SafeUrl} Either `url` if it's deemed safe, or
     *     `INNOCUOUS_STRING` if it's not.
     */
    static sanitizeEdgeExtensionUrl(url: string, extensionId: Const | Array<Const>): SafeUrl;
    /**
     * Private helper for converting extension URLs to SafeUrl, given the scheme for
     * that particular extension type. Use the sanitizeFirefoxExtensionUrl,
     * sanitizeChromeExtensionUrl or sanitizeEdgeExtensionUrl unless you're building
     * new helpers.
     *
     * @private
     * @param {!RegExp} scheme The scheme to accept as a RegExp extracting the
     *     extension identifier.
     * @param {string} url The url to sanitize. Should start with the extension
     *     scheme and the extension identifier.
     * @param {!Const|!Array<!Const>} extensionId The
     *     extension id to accept, as a compile-time constant or an array of those.
     *
     * @return {!SafeUrl} Either `url` if it's deemed safe, or
     *     `INNOCUOUS_STRING` if it's not.
     */
    private static sanitizeExtensionUrl_;
    /**
     * Creates a SafeUrl from TrustedResourceUrl. This is safe because
     * TrustedResourceUrl is more tightly restricted than SafeUrl.
     *
     * @param {!Html_TrustedResourceUrl} trustedResourceUrl
     * @return {!SafeUrl}
     */
    static fromTrustedResourceUrl(trustedResourceUrl: Html_TrustedResourceUrl): SafeUrl;
    /**
     * Creates a SafeUrl object from `url`. If `url` is a
     * SafeUrl then it is simply returned. Otherwise the input string is
     * validated to match a pattern of commonly used safe URLs.
     *
     * `url` may be a URL with the http, https, mailto or ftp scheme,
     * or a relative URL (i.e., a URL without a scheme; specifically, a
     * scheme-relative, absolute-path-relative, or path-relative URL).
     *
     * @see http://url.spec.whatwg.org/#concept-relative-url
     * @param {string|!TypedString} url The URL to validate.
     * @return {!SafeUrl} The validated URL, wrapped as a SafeUrl.
     */
    static sanitize(url: string | TypedString): SafeUrl;
    /**
     * Creates a SafeUrl object from `url`. If `url` is a
     * SafeUrl then it is simply returned. Otherwise the input string is
     * validated to match a pattern of commonly used safe URLs.
     *
     * `url` may be a URL with the http, https, mailto or ftp scheme,
     * or a relative URL (i.e., a URL without a scheme; specifically, a
     * scheme-relative, absolute-path-relative, or path-relative URL).
     *
     * This function asserts (using goog_asserts) that the URL matches this pattern.
     * If it does not, in addition to failing the assert, an innocous URL will be
     * returned.
     *
     * @see http://url.spec.whatwg.org/#concept-relative-url
     * @param {string|!TypedString} url The URL to validate.
     * @param {boolean=} opt_allowDataUrl Whether to allow valid data: URLs.
     * @return {!SafeUrl} The validated URL, wrapped as a SafeUrl.
     */
    static sanitizeAssertUnchanged(url: string | TypedString, opt_allowDataUrl?: boolean | undefined): SafeUrl;
    /**
     * Package-internal utility method to create SafeUrl instances.
     *
     * @param {string} url The string to initialize the SafeUrl object with.
     * @return {!SafeUrl} The initialized SafeUrl object.
     * @package
     */
    static createSafeUrlSecurityPrivateDoNotAccessOrElse(url: string): SafeUrl;
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
    constructor(opt_token?: any | undefined, opt_content?: string | undefined);
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
    private privateDoNotAccessOrElseSafeUrlWrappedValue_;
    /**
     * A type marker used to implement additional run-time type checking.
     * @see SafeUrl#unwrap
     * @const {!Object}
     * @private
     */
    private SAFE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
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
import { DirectionalString } from "../i18n/bidi.js";
import { TypedString } from "../string/typedstring.js";
import { Const } from "../string/const.js";
import { TrustedResourceUrl as Html_TrustedResourceUrl } from "./trustedresourceurl.js";
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
