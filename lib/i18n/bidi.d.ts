/**
 * Directionality enum.
 */
export type Dir = number;
/**
 * Unicode formatting characters and directionality string constants.
 */
export type Format = string;
export namespace Dir {
    export const LTR: number;
    export const RTL: number;
    export const NEUTRAL: number;
}
/**
 * Strings that have an (optional) known direction.
 *
 * Implementations of this interface are string-like objects that carry an
 * attached direction, if known.
 * @interface
 */
export class DirectionalString {
    /**
     * Retrieves this object's known direction (if any).
     * @return {?Dir} The known direction. Null if unknown.
     */
    getDirection(): Dir | null;
    /**
     * Interface marker of the DirectionalString interface.
     *
     * This property can be used to determine at runtime whether or not an object
     * implements this interface.  All implementations of this interface set this
     * property to `true`.
     * @type {boolean}
     */
    implementsGoogI18nBidiDirectionalString: boolean;
}
/**
 * @fileoverview Utility functions for supporting Bidi issues.
 */
/**
 * Namespace for bidi supporting functions.
 */
/**
 * @type {boolean} FORCE_RTL forces the {@link IS_RTL} constant
 * to say that the current locale is a RTL locale.  This should only be used
 * if you want to override the default behavior for deciding whether the
 * current locale is RTL or not.
 *
 * {@see IS_RTL}
 */
export const FORCE_RTL: boolean;
export namespace Format {
    export const LRE: string;
    export const RLE: string;
    export const PDF: string;
    export const LRM: string;
    export const RLM: string;
}
/**
 * 'right' if locale is RTL, 'left' if not.
 * @type {string}
 */
export let I18N_LEFT: string;
/**
 * 'left' if locale is RTL, 'right' if not.
 * @type {string}
 */
export let I18N_RIGHT: string;
/**
 * Constant that defines whether or not the current locale is a RTL locale.
 * If {@link FORCE_RTL} is not true, this constant will default
 * to check that {@link google.LOCALE} is one of a few major RTL locales.
 *
 * <p>This is designed to be a maximally efficient compile-time constant. For
 * example, for the default google.LOCALE, compiling
 * "if (IS_RTL) alert('rtl') else {}" should produce no code. It
 * is this design consideration that limits the implementation to only
 * supporting a few major RTL locales, as opposed to the broader repertoire of
 * something like isRtlLanguage.
 *
 * <p>Since this constant refers to the directionality of the locale, it is up
 * to the caller to determine if this constant should also be used for the
 * direction of the UI.
 *
 * {@see google.LOCALE}
 *
 * @type {boolean}
 *
 * TODO(user): write a test that checks that this is a compile-time constant.
 */
export let IS_RTL: boolean;
/**
 * 'left' string constant.
 * @type {string}
 */
export let LEFT: string;
/**
 * 'right' string constant.
 * @type {string}
 */
export let RIGHT: string;
/**
 * Check the directionality of a piece of text, return true if the piece of
 * text should be laid out in RTL direction.
 * @param {string} str The piece of text that need to be detected.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether this piece of text should be laid out in RTL.
 */
export function detectRtlDirectionality(str: string, opt_isHtml?: boolean | undefined): boolean;
/**
 * Check if the exit directionality a piece of text is LTR, i.e. if the last
 * strongly-directional character in the string is LTR.
 * @param {string} str String being checked.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether LTR exit directionality was detected.
 */
export function endsWithLtr(str: string, opt_isHtml?: boolean | undefined): boolean;
/**
 * Check if the exit directionality a piece of text is RTL, i.e. if the last
 * strongly-directional character in the string is RTL.
 * @param {string} str String being checked.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether RTL exit directionality was detected.
 */
export function endsWithRtl(str: string, opt_isHtml?: boolean | undefined): boolean;
/**
 * Enforce the html snippet in RTL directionality regardless or overall context.
 * If the html piece was enclosed by tag, dir will be applied to existing
 * tag, otherwise a span tag will be added as wrapper. For this reason, if
 * html snippet starts with a tag, this tag must enclose the whole piece. If
 * the tag already has a dir specified, this new one will override existing
 * one in behavior (tested on FF and IE).
 * @param {string} html The string that need to be processed.
 * @return {string} The processed string, with directionality enforced to RTL.
 */
export function enforceLtrInHtml(html: string): string;
/**
 * Enforce LTR on both end of the given text piece using unicode BiDi formatting
 * characters LRE and PDF.
 * @param {string} text The piece of text that need to be wrapped.
 * @return {string} The wrapped string after process.
 */
export function enforceLtrInText(text: string): string;
/**
 * Enforce the html snippet in RTL directionality regardless of overall context.
 * If the html piece was enclosed by tag, dir will be applied to existing
 * tag, otherwise a span tag will be added as wrapper. For this reason, if
 * html snippet starts with a tag, this tag must enclose the whole piece. If
 * the tag already has a dir specified, this new one will override existing
 * one in behavior (tested on FF and IE).
 * @param {string} html The string that need to be processed.
 * @return {string} The processed string, with directionality enforced to RTL.
 */
export function enforceRtlInHtml(html: string): string;
/**
 * Enforce RTL on both end of the given text piece using unicode BiDi formatting
 * characters RLE and PDF.
 * @param {string} text The piece of text that need to be wrapped.
 * @return {string} The wrapped string after process.
 */
export function enforceRtlInText(text: string): string;
/**
 * Estimates the directionality of a string based on relative word counts.
 * If the number of RTL words is above a certain percentage of the total number
 * of strongly directional words, returns RTL.
 * Otherwise, if any words are strongly or weakly LTR, returns LTR.
 * Otherwise, returns UNKNOWN, which is used to mean "neutral".
 * Numbers are counted as weakly LTR.
 * @param {string} str The string to be checked.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {?Dir} Estimated overall directionality of `str`.
 */
export function estimateDirection(str: string, opt_isHtml?: boolean | undefined): Dir | null;
/**
 * Apply bracket guard using LRM and RLM. This is to address the problem of
 * messy bracket display frequently happens in RTL layout.
 * This function works for plain text, not for HTML. In HTML, the opening
 * bracket might be in a different context than the closing bracket (such as
 * an attribute value).
 * @param {string} s The string that need to be processed.
 * @param {boolean=} opt_isRtlContext specifies default direction (usually
 *     direction of the UI).
 * @return {string} The processed string, with all bracket guarded.
 */
export function guardBracketInText(s: string, opt_isRtlContext?: boolean | undefined): string;
/**
 * Test whether the given string has any LTR characters in it.
 * @param {string} str The given string that need to be tested.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether the string contains LTR characters.
 */
export function hasAnyLtr(str: string, opt_isHtml?: boolean | undefined): boolean;
/**
 * Test whether the given string has any RTL characters in it.
 * @param {string} str The given string that need to be tested.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether the string contains RTL characters.
 */
export function hasAnyRtl(str: string, opt_isHtml?: boolean | undefined): boolean;
/**
 * Test whether the given string has any RTL characters in it.
 * @param {string} str The given string that need to be tested.
 * @return {boolean} Whether the string contains RTL characters.
 * @deprecated Use hasAnyRtl.
 */
export function hasRtlChar(str: string): boolean;
/**
 * Check if the first character in the string is LTR or not.
 * @param {string} str The given string that need to be tested.
 * @return {boolean} Whether the first character in str is an LTR char.
 */
export function isLtrChar(str: string): boolean;
/**
 * Check if the exit directionality a piece of text is LTR, i.e. if the last
 * strongly-directional character in the string is LTR.
 * @param {string} str String being checked.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether LTR exit directionality was detected.
 * @deprecated Use endsWithLtr.
 */
export function isLtrExitText(str: string, opt_isHtml?: boolean | undefined): boolean;
/**
 * Check whether the first strongly directional character (if any) is LTR.
 * @param {string} str String being checked.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether LTR directionality is detected using the first
 *     strongly-directional character method.
 * @deprecated Use startsWithLtr.
 */
export function isLtrText(str: string, opt_isHtml?: boolean | undefined): boolean;
/**
 * Check if the first character in the string is neutral or not.
 * @param {string} str The given string that need to be tested.
 * @return {boolean} Whether the first character in str is a neutral char.
 */
export function isNeutralChar(str: string): boolean;
/**
 * Check whether the input string either contains no strongly directional
 * characters or looks like a url.
 * @param {string} str String being checked.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether neutral directionality is detected.
 */
export function isNeutralText(str: string, opt_isHtml?: boolean | undefined): boolean;
/**
 * Check if the first character in the string is RTL or not.
 * @param {string} str The given string that need to be tested.
 * @return {boolean} Whether the first character in str is an RTL char.
 */
export function isRtlChar(str: string): boolean;
/**
 * Check if the exit directionality a piece of text is RTL, i.e. if the last
 * strongly-directional character in the string is RTL.
 * @param {string} str String being checked.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether RTL exit directionality was detected.
 * @deprecated Use endsWithRtl.
 */
export function isRtlExitText(str: string, opt_isHtml?: boolean | undefined): boolean;
/**
 * Check if a BCP 47 / III language code indicates an RTL language, i.e. either:
 * - a language code explicitly specifying one of the right-to-left scripts,
 *   e.g. "az-Arab", or<p>
 * - a language code specifying one of the languages normally written in a
 *   right-to-left script, e.g. "fa" (Farsi), except ones explicitly specifying
 *   Latin or Cyrillic script (which are the usual LTR alternatives).<p>
 * The list of right-to-left scripts appears in the 100-199 range in
 * http://www.unicode.org/iso15924/iso15924-num.html, of which Arabic and
 * Hebrew are by far the most widely used. We also recognize Thaana, and N'Ko,
 * which also have significant modern usage. Adlam and Rohingya
 * scripts are now included since they can be expected to be used in the
 * future. The rest (Syriac, Samaritan, Mandaic, etc.) seem to have extremely
 * limited or no modern usage and are not recognized to save on code size. The
 * languages usually written in a right-to-left script are taken as those with
 * Suppress-Script: Hebr|Arab|Thaa|Nkoo|Adlm|Rohg in
 * http://www.iana.org/assignments/language-subtag-registry,
 * as well as Central (or Sorani) Kurdish (ckb), Sindhi (sd) and Uyghur (ug).
 * Other subtags of the language code, e.g. regions like EG (Egypt), are
 * ignored.
 * @param {string} lang BCP 47 (a.k.a III) language code.
 * @return {boolean} Whether the language code is an RTL language.
 */
export function isRtlLanguage(lang: string): boolean;
/**
 * Check whether the first strongly directional character (if any) is RTL.
 * @param {string} str String being checked.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether RTL directionality is detected using the first
 *     strongly-directional character method.
 * @deprecated Use startsWithRtl.
 */
export function isRtlText(str: string, opt_isHtml?: boolean | undefined): boolean;
/**
 * Swap location parameters and 'left'/'right' in CSS specification. The
 * processed string will be suited for RTL layout. Though this function can
 * cover most cases, there are always exceptions. It is suggested to put
 * those exceptions in separate group of CSS string.
 * @param {string} cssStr CSS spefication string.
 * @return {string} Processed CSS specification string.
 */
export function mirrorCSS(cssStr: string): string;
/**
 * Replace the double and single quote directly after a Hebrew character with
 * GERESH and GERSHAYIM. In such case, most likely that's user intention.
 * @param {string} str String that need to be processed.
 * @return {string} Processed string with double/single quote replaced.
 */
export function normalizeHebrewQuote(str: string): string;
/**
 * Sets text input element's directionality and text alignment based on a
 * given directionality. Does nothing if the given directionality is unknown or
 * neutral.
 * @param {?Element} element Input field element to set directionality to.
 * @param {Dir|number|boolean|null} dir Desired directionality,
 *     given in one of the following formats:
 *     1. A Dir constant.
 *     2. A number (positive = LRT, negative = RTL, 0 = neutral).
 *     3. A boolean (true = RTL, false = LTR).
 *     4. A null for unknown directionality.
 */
export function setElementDirAndAlign(element: Element | null, dir: Dir | number | boolean | null): void;
/**
 * Sets element dir based on estimated directionality of the given text.
 * @param {!Element} element
 * @param {string} text
 */
export function setElementDirByTextDirectionality(element: Element, text: string): void;
/**
 * Check whether the first strongly directional character (if any) is LTR.
 * @param {string} str String being checked.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether LTR directionality is detected using the first
 *     strongly-directional character method.
 */
export function startsWithLtr(str: string, opt_isHtml?: boolean | undefined): boolean;
/**
 * Check whether the first strongly directional character (if any) is RTL.
 * @param {string} str String being checked.
 * @param {boolean=} opt_isHtml Whether str is HTML / HTML-escaped.
 *     Default: false.
 * @return {boolean} Whether RTL directionality is detected using the first
 *     strongly-directional character method.
 */
export function startsWithRtl(str: string, opt_isHtml?: boolean | undefined): boolean;
/**
 * Convert a directionality given in various formats to a Dir
 * constant. Useful for interaction with different standards of directionality
 * representation.
 *
 * @param {Dir|number|boolean|null} givenDir Directionality given
 *     in one of the following formats:
 *     1. A Dir constant.
 *     2. A number (positive = LTR, negative = RTL, 0 = neutral).
 *     3. A boolean (true = RTL, false = LTR).
 *     4. A null for unknown directionality.
 * @param {boolean=} opt_noNeutral Whether a givenDir of zero or
 *     Dir.NEUTRAL should be treated as null, i.e. unknown, in
 *     order to preserve legacy behavior.
 * @return {?Dir} A Dir constant matching the
 *     given directionality. If given null, returns null (i.e. unknown).
 */
export function toDir(givenDir: Dir | number | boolean | null, opt_noNeutral?: boolean | undefined): Dir | null;
