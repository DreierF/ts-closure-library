/**
 * @fileoverview The TrustedResourceUrl type and its builders.
 *
 * TODO(xtof): Link to document stating type contract.
 */
/**
 * A URL which is under application control and from which script, CSS, and
 * other resources that represent executable code, can be fetched.
 *
 * Given that the URL can only be constructed from strings under application
 * control and is used to load resources, bugs resulting in a malformed URL
 * should not have a security impact and are likely to be easily detectable
 * during testing. Given the wide number of non-RFC compliant URLs in use,
 * stricter validation could prevent some applications from being able to use
 * this type.
 *
 * Instances of this type must be created via the factory method,
 * (`fromConstant`, `fromConstants`, `format` or
 * `formatWithParams`), and not by invoking its constructor. The constructor
 * is organized in a way that only methods from that file can call it and
 * initialize with non-empty values. Anyone else calling constructor will
 * get default instance with empty value.
 *
 * @see TrustedResourceUrl#fromConstant
 * @final
 * @class
 * @implements {DirectionalString}
 * @implements {TypedString}
 *     implementation detail.
 */
export class TrustedResourceUrl {
    /**
     * A URL which is under application control and from which script, CSS, and
     * other resources that represent executable code, can be fetched.
     *
     * Given that the URL can only be constructed from strings under application
     * control and is used to load resources, bugs resulting in a malformed URL
     * should not have a security impact and are likely to be easily detectable
     * during testing. Given the wide number of non-RFC compliant URLs in use,
     * stricter validation could prevent some applications from being able to use
     * this type.
     *
     * Instances of this type must be created via the factory method,
     * (`fromConstant`, `fromConstants`, `format` or
     * `formatWithParams`), and not by invoking its constructor. The constructor
     * is organized in a way that only methods from that file can call it and
     * initialize with non-empty values. Anyone else calling constructor will
     * get default instance with empty value.
     *
     * @see TrustedResourceUrl#fromConstant
     * @param {!Object=} opt_token package-internal implementation detail.
     * @param {!TrustedScriptURL|string=} opt_content package-internal
     *     implementation detail.
     */
    constructor(opt_token?: any, opt_content?: any);
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
     * The contained value of this TrustedResourceUrl.  The field has a purposely
     * ugly name to make (non-compiled) code that attempts to directly access this
     * field stand out.
     * @const
     * @private {!TrustedScriptURL|string}
     */
    privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_: any;
    /**
     * A type marker used to implement additional run-time type checking.
     * @see TrustedResourceUrl#unwrap
     * @const {!Object}
     * @private
     */
    TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_: {};
    /**
     * Returns this TrustedResourceUrl's value as a string.
     *
     * IMPORTANT: In code where it is security relevant that an object's type is
     * indeed `TrustedResourceUrl`, use
     * `TrustedResourceUrl.unwrap` instead of this method. If in
     * doubt, assume that it's security relevant. In particular, note that
     * google.html functions which return a google.html type do not guarantee that
     * the returned instance is of the right type. For example:
     *
     * <pre>
     * var fakeSafeHtml = new String('fake');
     * fakeSafeHtml.__proto__ = goog.html.SafeHtml.prototype;
     * var newSafeHtml = goog.html.SafeHtml.htmlEscape(fakeSafeHtml);
     * // newSafeHtml is just an alias for fakeSafeHtml, it's passed through by
     * // goog.html.SafeHtml.htmlEscape() as fakeSafeHtml instanceof
     * // goog.html.SafeHtml.
     * </pre>
     *
     * @see TrustedResourceUrl#unwrap
     * @override
     */
    getTypedStringValue(): any;
    /**
     * Returns this URLs directionality, which is always `LTR`.
     * @override
     */
    getDirection(): any;
    /**
     * Creates a new TrustedResourceUrl with params added to URL. Both search and
     * hash params can be specified.
     *
     * @param {string|?Object<string, *>|undefined} searchParams Search parameters
     *     to add to URL. See TrustedResourceUrl.stringifyParams_ for
     *     exact format definition.
     * @param {(string|?Object<string, *>)=} opt_hashParams Hash parameters to add
     *     to URL. See TrustedResourceUrl.stringifyParams_ for exact
     *     format definition.
     * @return {!TrustedResourceUrl} New TrustedResourceUrl with params.
     */
    cloneWithParams(searchParams: string | {
        [x: string]: any;
    }, opt_hashParams?: string | {
        [x: string]: any;
    }): TrustedResourceUrl;
}
export namespace TrustedResourceUrl {
    export const FORMAT_MARKER_: RegExp;
    export const BASE_URL_: RegExp;
    export const URL_PARAM_PARSER_: RegExp;
    export const TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_: {};
    export const CONSTRUCTOR_TOKEN_PRIVATE_: {};
}
