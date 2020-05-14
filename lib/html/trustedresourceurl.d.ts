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
export class TrustedResourceUrl implements DirectionalString, TypedString {
    /**
     * Performs a runtime check that the provided object is indeed a
     * TrustedResourceUrl object, and returns its value.
     *
     * @param {!TrustedResourceUrl} trustedResourceUrl The object to
     *     extract from.
     * @return {string} The trustedResourceUrl object's contained string, unless
     *     the run-time type check fails. In that case, `unwrap` returns an
     *     innocuous string, or, if assertions are enabled, throws
     *     `AssertionError`.
     */
    static unwrap(trustedResourceUrl: TrustedResourceUrl): string;
    /**
     * Unwraps value as TrustedScriptURL if supported or as a string if not.
     * @param {!TrustedResourceUrl} trustedResourceUrl
     * @return {!TrustedScriptURL|string}
     * @see TrustedResourceUrl.unwrap
     */
    static unwrapTrustedScriptURL(trustedResourceUrl: TrustedResourceUrl): any | string;
    /**
     * Creates a TrustedResourceUrl from a format string and arguments.
     *
     * The arguments for interpolation into the format string map labels to values.
     * Values of type `Const` are interpolated without modifcation.
     * Values of other types are cast to string and encoded with
     * encodeURIComponent.
     *
     * `%{<label>}` markers are used in the format string to indicate locations
     * to be interpolated with the valued mapped to the given label. `<label>`
     * must contain only alphanumeric and `_` characters.
     *
     * The format string must match TrustedResourceUrl.BASE_URL_.
     *
     * Example usage:
     *
     *    var url = TrustedResourceUrl.format(Const.from(
     *        'https://www.google.com/search?q=%{query}'), {'query': searchTerm});
     *
     *    var url = TrustedResourceUrl.format(Const.from(
     *        '//www.youtube.com/v/%{videoId}?hl=en&fs=1%{autoplay}'), {
     *        'videoId': videoId,
     *        'autoplay': opt_autoplay ?
     *            Const.from('&autoplay=1') : Const.EMPTY
     *    });
     *
     * While this function can be used to create a TrustedResourceUrl from only
     * constants, fromConstant() and fromConstants() are generally preferable for
     * that purpose.
     *
     * @param {!Const} format The format string.
     * @param {!Object<string, (string|number|!Const)>} args Mapping
     *     of labels to values to be interpolated into the format string.
     *     Const values are interpolated without encoding.
     * @return {!TrustedResourceUrl}
     * @throws {!Error} On an invalid format string or if a label used in the
     *     the format string is not present in args.
     */
    static format(format: Const, args: {
        [x: string]: (string | number | Const);
    }): TrustedResourceUrl;
    /**
     * Formats the URL same as TrustedResourceUrl.format and then adds extra URL
     * parameters.
     *
     * Example usage:
     *
     *     // Creates '//www.youtube.com/v/abc?autoplay=1' for videoId='abc' and
     *     // opt_autoplay=1. Creates '//www.youtube.com/v/abc' for videoId='abc'
     *     // and opt_autoplay=undefined.
     *     var url = TrustedResourceUrl.formatWithParams(
     *         Const.from('//www.youtube.com/v/%{videoId}'),
     *         {'videoId': videoId},
     *         {'autoplay': opt_autoplay});
     *
     * @param {!Const} format The format string.
     * @param {!Object<string, (string|number|!Const)>} args Mapping
     *     of labels to values to be interpolated into the format string.
     *     Const values are interpolated without encoding.
     * @param {string|?Object<string, *>|undefined} searchParams Parameters to add
     *     to URL. See TrustedResourceUrl.stringifyParams_ for exact
     *     format definition.
     * @param {(string|?Object<string, *>)=} opt_hashParams Hash parameters to add
     *     to URL. See TrustedResourceUrl.stringifyParams_ for exact
     *     format definition.
     * @return {!TrustedResourceUrl}
     * @throws {!Error} On an invalid format string or if a label used in the
     *     the format string is not present in args.
     */
    static formatWithParams(format: Const, args: {
        [x: string]: (string | number | Const);
    }, searchParams: string | (({
        [x: string]: any;
    } | undefined) | null), opt_hashParams?: (string | ({
        [x: string]: any;
    } | null)) | undefined): TrustedResourceUrl;
    /**
     * Creates a TrustedResourceUrl object from a compile-time constant string.
     *
     * Compile-time constant strings are inherently program-controlled and hence
     * trusted.
     *
     * @param {!Const} url A compile-time-constant string from which to
     *     create a TrustedResourceUrl.
     * @return {!TrustedResourceUrl} A TrustedResourceUrl object
     *     initialized to `url`.
     */
    static fromConstant(url: Const): TrustedResourceUrl;
    /**
     * Creates a TrustedResourceUrl object from a compile-time constant strings.
     *
     * Compile-time constant strings are inherently program-controlled and hence
     * trusted.
     *
     * @param {!Array<!Const>} parts Compile-time-constant strings from
     *     which to create a TrustedResourceUrl.
     * @return {!TrustedResourceUrl} A TrustedResourceUrl object
     *     initialized to concatenation of `parts`.
     */
    static fromConstants(parts: Array<Const>): TrustedResourceUrl;
    /**
     * Stringifies the passed params to be used as either a search or hash field of
     * a URL.
     *
     * @param {string} prefix The prefix character for the given field ('?' or '#').
     * @param {string} currentString The existing field value (including the prefix
     *     character, if the field is present).
     * @param {string|?Object<string, *>|undefined} params The params to set or
     *     append to the field.
     * - If `undefined` or `null`, the field remains unchanged.
     * - If a string, then the string will be escaped and the field will be
     *   overwritten with that value.
     * - If an Object, that object is treated as a set of key-value pairs to be
     *   appended to the current field. Note that JavaScript doesn't guarantee the
     *   order of values in an object which might result in non-deterministic order
     *   of the parameters. However, browsers currently preserve the order. The
     *   rules for each entry:
     *   - If an array, it will be processed as if each entry were an additional
     *     parameter with exactly the same key, following the same logic below.
     *   - If `undefined` or `null`, it will be skipped.
     *   - Otherwise, it will be turned into a string, escaped, and appended.
     * @return {string}
     * @private
     */
    private static stringifyParams_;
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
    constructor(opt_token?: any | undefined, opt_content?: (any | string) | undefined);
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
    private privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_;
    /**
     * A type marker used to implement additional run-time type checking.
     * @see TrustedResourceUrl#unwrap
     * @const {!Object}
     * @private
     */
    private TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
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
    cloneWithParams(searchParams: string | (({
        [x: string]: any;
    } | undefined) | null), opt_hashParams?: (string | ({
        [x: string]: any;
    } | null)) | undefined): TrustedResourceUrl;
}
export namespace TrustedResourceUrl {
    export const FORMAT_MARKER_: RegExp;
    export const BASE_URL_: RegExp;
    export const URL_PARAM_PARSER_: RegExp;
    export const TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_: {};
    export function createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(url: string): TrustedResourceUrl;
    export const CONSTRUCTOR_TOKEN_PRIVATE_: {};
}
import { DirectionalString } from "../i18n/bidi.js";
import { TypedString } from "../string/typedstring.js";
import { Const } from "../string/const.js";
