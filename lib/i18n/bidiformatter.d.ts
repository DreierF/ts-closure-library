/**
 * @fileoverview Utility for formatting text for display in a potentially
 * opposite-directionality context without garbling.
 * Mostly a port of http://go/formatter.cc.
 */
/**
 * Utility class for formatting text for display in a potentially
 * opposite-directionality context without garbling. Provides the following
 * functionality:
 *
 * 1. BiDi Wrapping
 * When text in one language is mixed into a document in another, opposite-
 * directionality language, e.g. when an English business name is embedded in a
 * Hebrew web page, both the inserted string and the text following it may be
 * displayed incorrectly unless the inserted string is explicitly separated
 * from the surrounding text in a "wrapper" that declares its directionality at
 * the start and then resets it back at the end. This wrapping can be done in
 * HTML mark-up (e.g. a 'span dir="rtl"' tag) or - only in contexts where
 * mark-up can not be used - in Unicode BiDi formatting codes (LRE|RLE and PDF).
 * Providing such wrapping services is the basic purpose of the BiDi formatter.
 *
 * 2. Directionality estimation
 * How does one know whether a string about to be inserted into surrounding
 * text has the same directionality? Well, in many cases, one knows that this
 * must be the case when writing the code doing the insertion, e.g. when a
 * localized message is inserted into a localized page. In such cases there is
 * no need to involve the BiDi formatter at all. In the remaining cases, e.g.
 * when the string is user-entered or comes from a database, the language of
 * the string (and thus its directionality) is not known a priori, and must be
 * estimated at run-time. The BiDi formatter does this automatically.
 *
 * 3. Escaping
 * When wrapping plain text - i.e. text that is not already HTML or HTML-
 * escaped - in HTML mark-up, the text must first be HTML-escaped to prevent XSS
 * attacks and other nasty business. This of course is always true, but the
 * escaping can not be done after the string has already been wrapped in
 * mark-up, so the BiDi formatter also serves as a last chance and includes
 * escaping services.
 *
 * Thus, in a single call, the formatter will escape the input string as
 * specified, determine its directionality, and wrap it as necessary. It is
 * then up to the caller to insert the return value in the output.
 *
 * See http://wiki/Main/TemplatesAndBiDi for more information.
 *
 *     directionality, in one of the following formats:
 *     1. A Dir constant. NEUTRAL is treated the same as null,
 *        i.e. unknown, for backward compatibility with legacy calls.
 *     2. A number (positive = LTR, negative = RTL, 0 = unknown).
 *     3. A boolean (true = RTL, false = LTR).
 *     4. A null for unknown directionality.
 *     use a 'span' tag, even when the input directionality is neutral or
 *     matches the context, so that the DOM structure of the output does not
 *     depend on the combination of directionalities. Default: false.
 * @final
 */
export class BidiFormatter {
    /**
     * Utility class for formatting text for display in a potentially
     * opposite-directionality context without garbling. Provides the following
     * functionality:
     *
     * 1. BiDi Wrapping
     * When text in one language is mixed into a document in another, opposite-
     * directionality language, e.g. when an English business name is embedded in a
     * Hebrew web page, both the inserted string and the text following it may be
     * displayed incorrectly unless the inserted string is explicitly separated
     * from the surrounding text in a "wrapper" that declares its directionality at
     * the start and then resets it back at the end. This wrapping can be done in
     * HTML mark-up (e.g. a 'span dir="rtl"' tag) or - only in contexts where
     * mark-up can not be used - in Unicode BiDi formatting codes (LRE|RLE and PDF).
     * Providing such wrapping services is the basic purpose of the BiDi formatter.
     *
     * 2. Directionality estimation
     * How does one know whether a string about to be inserted into surrounding
     * text has the same directionality? Well, in many cases, one knows that this
     * must be the case when writing the code doing the insertion, e.g. when a
     * localized message is inserted into a localized page. In such cases there is
     * no need to involve the BiDi formatter at all. In the remaining cases, e.g.
     * when the string is user-entered or comes from a database, the language of
     * the string (and thus its directionality) is not known a priori, and must be
     * estimated at run-time. The BiDi formatter does this automatically.
     *
     * 3. Escaping
     * When wrapping plain text - i.e. text that is not already HTML or HTML-
     * escaped - in HTML mark-up, the text must first be HTML-escaped to prevent XSS
     * attacks and other nasty business. This of course is always true, but the
     * escaping can not be done after the string has already been wrapped in
     * mark-up, so the BiDi formatter also serves as a last chance and includes
     * escaping services.
     *
     * Thus, in a single call, the formatter will escape the input string as
     * specified, determine its directionality, and wrap it as necessary. It is
     * then up to the caller to insert the return value in the output.
     *
     * See http://wiki/Main/TemplatesAndBiDi for more information.
     *
     * @param {Dir|number|boolean|null} contextDir The context
     *     directionality, in one of the following formats:
     *     1. A Dir constant. NEUTRAL is treated the same as null,
     *        i.e. unknown, for backward compatibility with legacy calls.
     *     2. A number (positive = LTR, negative = RTL, 0 = unknown).
     *     3. A boolean (true = RTL, false = LTR).
     *     4. A null for unknown directionality.
     * @param {boolean=} opt_alwaysSpan Whether {@link #spanWrap} should always
     *     use a 'span' tag, even when the input directionality is neutral or
     *     matches the context, so that the DOM structure of the output does not
     *     depend on the combination of directionalities. Default: false.
     */
    constructor(contextDir: Dir | number | boolean | null, opt_alwaysSpan?: boolean | undefined);
    /**
     * The overall directionality of the context in which the formatter is being
     * used.
     * @type {?Dir}
     * @private
     */
    private contextDir_;
    /**
     * Whether {@link #spanWrap} and similar methods should always use the same
     * span structure, regardless of the combination of directionalities, for a
     * stable DOM structure.
     * @type {boolean}
     * @private
     */
    private alwaysSpan_;
    /**
     * @return {?Dir} The context directionality.
     */
    getContextDir(): Dir | null;
    /**
     * @return {boolean} Whether alwaysSpan is set.
     */
    getAlwaysSpan(): boolean;
    /**
     * @param {Dir|number|boolean|null} contextDir The context
     *     directionality, in one of the following formats:
     *     1. A Dir constant. NEUTRAL is treated the same as null,
     *        i.e. unknown.
     *     2. A number (positive = LTR, negative = RTL, 0 = unknown).
     *     3. A boolean (true = RTL, false = LTR).
     *     4. A null for unknown directionality.
     */
    setContextDir(contextDir: Dir | number | boolean | null): void;
    /**
     * @param {boolean} alwaysSpan Whether {@link #spanWrap} should always use a
     *     'span' tag, even when the input directionality is neutral or matches the
     *     context, so that the DOM structure of the output does not depend on the
     *     combination of directionalities.
     */
    setAlwaysSpan(alwaysSpan: boolean): void;
    /**
     * Returns the directionality of input argument `str`.
     * Identical to {@link i18n_bidi.estimateDirection}.
     *
     * @param {string} str The input text.
     * @param {boolean=} opt_isHtml Whether `str` is HTML / HTML-escaped.
     *     Default: false.
     * @return {?Dir} Estimated overall directionality of `str`.
     */
    estimateDirection(str: string, opt_isHtml?: boolean | undefined): Dir | null;
    /**
     * Returns true if two given directionalities are opposite.
     * Note: the implementation is based on the numeric values of the Dir enum.
     *
     * @param {?Dir} dir1 1st directionality.
     * @param {?Dir} dir2 2nd directionality.
     * @return {boolean} Whether the directionalities are opposite.
     * @private
     */
    private areDirectionalitiesOpposite_;
    /**
     * Returns a unicode BiDi mark matching the context directionality (LRM or
     * RLM) if `opt_dirReset`, and if either the directionality or the exit
     * directionality of `str` is opposite to the context directionality.
     * Otherwise returns the empty string.
     *
     * @param {string} str The input text.
     * @param {?Dir} dir `str`'s overall directionality.
     * @param {boolean=} opt_isHtml Whether `str` is HTML / HTML-escaped.
     *     Default: false.
     * @param {boolean=} opt_dirReset Whether to perform the reset. Default: false.
     * @return {string} A unicode BiDi mark or the empty string.
     * @private
     */
    private dirResetIfNeeded_;
    /**
     * Returns "rtl" if `str`'s estimated directionality is RTL, and "ltr" if
     * it is LTR. In case it's NEUTRAL, returns "rtl" if the context directionality
     * is RTL, and "ltr" otherwise.
     * Needed for GXP, which can't handle dirAttr.
     * Example use case:
     * &lt;td expr:dir='bidiFormatter.dirAttrValue(foo)'&gt;
     *   &lt;gxp:eval expr='foo'&gt;
     * &lt;/td&gt;
     *
     * @param {string} str Text whose directionality is to be estimated.
     * @param {boolean=} opt_isHtml Whether `str` is HTML / HTML-escaped.
     *     Default: false.
     * @return {string} "rtl" or "ltr", according to the logic described above.
     */
    dirAttrValue(str: string, opt_isHtml?: boolean | undefined): string;
    /**
     * Returns "rtl" if the given directionality is RTL, and "ltr" if it is LTR. In
     * case it's NEUTRAL, returns "rtl" if the context directionality is RTL, and
     * "ltr" otherwise.
     *
     * @param {?Dir} dir A directionality.
     * @return {string} "rtl" or "ltr", according to the logic described above.
     */
    knownDirAttrValue(dir: Dir | null): string;
    /**
     * Returns 'dir="ltr"' or 'dir="rtl"', depending on `str`'s estimated
     * directionality, if it is not the same as the context directionality.
     * Otherwise, returns the empty string.
     *
     * @param {string} str Text whose directionality is to be estimated.
     * @param {boolean=} opt_isHtml Whether `str` is HTML / HTML-escaped.
     *     Default: false.
     * @return {string} 'dir="rtl"' for RTL text in non-RTL context; 'dir="ltr"' for
     *     LTR text in non-LTR context; else, the empty string.
     */
    dirAttr(str: string, opt_isHtml?: boolean | undefined): string;
    /**
     * Returns 'dir="ltr"' or 'dir="rtl"', depending on the given directionality, if
     * it is not the same as the context directionality. Otherwise, returns the
     * empty string.
     *
     * @param {?Dir} dir A directionality.
     * @return {string} 'dir="rtl"' for RTL text in non-RTL context; 'dir="ltr"' for
     *     LTR text in non-LTR context; else, the empty string.
     */
    knownDirAttr(dir: Dir | null): string;
    /**
     * Formats a string of unknown directionality for use in HTML output of the
     * context directionality, so an opposite-directionality string is neither
     * garbled nor garbles what follows it.
     * The algorithm: estimates the directionality of input argument `html`.
     * In case its directionality doesn't match the context directionality, wraps it
     * with a 'span' tag and adds a "dir" attribute (either 'dir="rtl"' or
     * 'dir="ltr"'). If setAlwaysSpan(true) was used, the input is always wrapped
     * with 'span', skipping just the dir attribute when it's not needed.
     *
     * If `opt_dirReset`, and if the overall directionality or the exit
     * directionality of `str` are opposite to the context directionality, a
     * trailing unicode BiDi mark matching the context directionality is appened
     * (LRM or RLM).
     *
     * @param {!SafeHtml} html The input HTML.
     * @param {boolean=} opt_dirReset Whether to append a trailing unicode bidi mark
     *     matching the context directionality, when needed, to prevent the possible
     *     garbling of whatever may follow `html`. Default: true.
     * @return {!SafeHtml} Input text after applying the processing.
     */
    spanWrapSafeHtml(html: SafeHtml, opt_dirReset?: boolean | undefined): SafeHtml;
    /**
     * Formats a string of given directionality for use in HTML output of the
     * context directionality, so an opposite-directionality string is neither
     * garbled nor garbles what follows it.
     * The algorithm: If `dir` doesn't match the context directionality, wraps
     * `html` with a 'span' tag and adds a "dir" attribute (either 'dir="rtl"'
     * or 'dir="ltr"'). If setAlwaysSpan(true) was used, the input is always wrapped
     * with 'span', skipping just the dir attribute when it's not needed.
     *
     * If `opt_dirReset`, and if `dir` or the exit directionality of
     * `html` are opposite to the context directionality, a trailing unicode
     * BiDi mark matching the context directionality is appened (LRM or RLM).
     *
     * @param {?Dir} dir `html`'s overall directionality, or
     *     null if unknown and needs to be estimated.
     * @param {!SafeHtml} html The input HTML.
     * @param {boolean=} opt_dirReset Whether to append a trailing unicode bidi mark
     *     matching the context directionality, when needed, to prevent the possible
     *     garbling of whatever may follow `html`. Default: true.
     * @return {!SafeHtml} Input text after applying the processing.
     */
    spanWrapSafeHtmlWithKnownDir(dir: Dir | null, html: SafeHtml, opt_dirReset?: boolean | undefined): SafeHtml;
    /**
     * The internal implementation of spanWrapSafeHtmlWithKnownDir for non-null dir,
     * to help the compiler optimize.
     *
     * @param {?Dir} dir `str`'s overall directionality.
     * @param {!SafeHtml} html The input HTML.
     * @param {boolean=} opt_dirReset Whether to append a trailing unicode bidi mark
     *     matching the context directionality, when needed, to prevent the possible
     *     garbling of whatever may follow `str`. Default: true.
     * @return {!SafeHtml} Input text after applying the above processing.
     * @private
     */
    private spanWrapWithKnownDir_;
    /**
     * Formats a string of unknown directionality for use in plain-text output of
     * the context directionality, so an opposite-directionality string is neither
     * garbled nor garbles what follows it.
     * As opposed to {@link #spanWrap}, this makes use of unicode BiDi formatting
     * characters. In HTML, its *only* valid use is inside of elements that do not
     * allow mark-up, e.g. an 'option' tag.
     * The algorithm: estimates the directionality of input argument `str`.
     * In case it doesn't match  the context directionality, wraps it with Unicode
     * BiDi formatting characters: RLE`str`PDF for RTL text, and
     * LRE`str`PDF for LTR text.
     *
     * If `opt_dirReset`, and if the overall directionality or the exit
     * directionality of `str` are opposite to the context directionality, a
     * trailing unicode BiDi mark matching the context directionality is appended
     * (LRM or RLM).
     *
     * Does *not* do HTML-escaping regardless of the value of `opt_isHtml`.
     * The return value can be HTML-escaped as necessary.
     *
     * @param {string} str The input text.
     * @param {boolean=} opt_isHtml Whether `str` is HTML / HTML-escaped.
     *     Default: false.
     * @param {boolean=} opt_dirReset Whether to append a trailing unicode bidi mark
     *     matching the context directionality, when needed, to prevent the possible
     *     garbling of whatever may follow `str`. Default: true.
     * @return {string} Input text after applying the above processing.
     */
    unicodeWrap(str: string, opt_isHtml?: boolean | undefined, opt_dirReset?: boolean | undefined): string;
    /**
     * Formats a string of given directionality for use in plain-text output of the
     * context directionality, so an opposite-directionality string is neither
     * garbled nor garbles what follows it.
     * As opposed to {@link #spanWrapWithKnownDir}, makes use of unicode BiDi
     * formatting characters. In HTML, its *only* valid use is inside of elements
     * that do not allow mark-up, e.g. an 'option' tag.
     * The algorithm: If `dir` doesn't match the context directionality, wraps
     * `str` with Unicode BiDi formatting characters: RLE`str`PDF for
     * RTL text, and LRE`str`PDF for LTR text.
     *
     * If `opt_dirReset`, and if the overall directionality or the exit
     * directionality of `str` are opposite to the context directionality, a
     * trailing unicode BiDi mark matching the context directionality is appended
     * (LRM or RLM).
     *
     * Does *not* do HTML-escaping regardless of the value of `opt_isHtml`.
     * The return value can be HTML-escaped as necessary.
     *
     * @param {?Dir} dir `str`'s overall directionality, or
     *     null if unknown and needs to be estimated.
     * @param {string} str The input text.
     * @param {boolean=} opt_isHtml Whether `str` is HTML / HTML-escaped.
     *     Default: false.
     * @param {boolean=} opt_dirReset Whether to append a trailing unicode bidi mark
     *     matching the context directionality, when needed, to prevent the possible
     *     garbling of whatever may follow `str`. Default: true.
     * @return {string} Input text after applying the above processing.
     */
    unicodeWrapWithKnownDir(dir: Dir | null, str: string, opt_isHtml?: boolean | undefined, opt_dirReset?: boolean | undefined): string;
    /**
     * The internal implementation of unicodeWrapWithKnownDir for non-null dir, to
     * help the compiler optimize.
     *
     * @param {?Dir} dir `str`'s overall directionality.
     * @param {string} str The input text.
     * @param {boolean=} opt_isHtml Whether `str` is HTML / HTML-escaped.
     *     Default: false.
     * @param {boolean=} opt_dirReset Whether to append a trailing unicode bidi mark
     *     matching the context directionality, when needed, to prevent the possible
     *     garbling of whatever may follow `str`. Default: true.
     * @return {string} Input text after applying the above processing.
     * @private
     */
    private unicodeWrapWithKnownDir_;
    /**
     * Returns a Unicode BiDi mark matching the context directionality (LRM or RLM)
     * if the directionality or the exit directionality of `str` are opposite
     * to the context directionality. Otherwise returns the empty string.
     *
     * @param {string} str The input text.
     * @param {boolean=} opt_isHtml Whether `str` is HTML / HTML-escaped.
     *     Default: false.
     * @return {string} A Unicode bidi mark matching the global directionality or
     *     the empty string.
     */
    markAfter(str: string, opt_isHtml?: boolean | undefined): string;
    /**
     * Returns a Unicode BiDi mark matching the context directionality (LRM or RLM)
     * if the given directionality or the exit directionality of `str` are
     * opposite to the context directionality. Otherwise returns the empty string.
     *
     * @param {?Dir} dir `str`'s overall directionality, or
     *     null if unknown and needs to be estimated.
     * @param {string} str The input text.
     * @param {boolean=} opt_isHtml Whether `str` is HTML / HTML-escaped.
     *     Default: false.
     * @return {string} A Unicode bidi mark matching the global directionality or
     *     the empty string.
     */
    markAfterKnownDir(dir: Dir | null, str: string, opt_isHtml?: boolean | undefined): string;
    /**
     * Returns the Unicode BiDi mark matching the context directionality (LRM for
     * LTR context directionality, RLM for RTL context directionality), or the
     * empty string for neutral / unknown context directionality.
     *
     * @return {string} LRM for LTR context directionality and RLM for RTL context
     *     directionality.
     */
    mark(): string;
    /**
     * Returns 'right' for RTL context directionality. Otherwise (LTR or neutral /
     * unknown context directionality) returns 'left'.
     *
     * @return {string} 'right' for RTL context directionality and 'left' for other
     *     context directionality.
     */
    startEdge(): string;
    /**
     * Returns 'left' for RTL context directionality. Otherwise (LTR or neutral /
     * unknown context directionality) returns 'right'.
     *
     * @return {string} 'left' for RTL context directionality and 'right' for other
     *     context directionality.
     */
    endEdge(): string;
}
import { Dir } from "./bidi.js";
import { SafeHtml } from "../html/safehtml.js";
