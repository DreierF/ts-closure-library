/**
 * @fileoverview Transitional utilities to unsafely trust random strings as
 * google.html types. Intended for temporary use when upgrading a library that
 * used to accept plain strings to use safe types, but where it's not
 * practical to transitively update callers.
 *
 * IMPORTANT: No new code should use the conversion functions in this file,
 * they are intended for refactoring old code to use google.html types. New code
 * should construct google.html types via their APIs, template systems or
 * sanitizers. If that’s not possible it should use
 * goog.html.uncheckedconversions and undergo security review.

 *
 * The semantics of the conversions in goog.html.legacyconversions are very
 * different from the ones provided by goog.html.uncheckedconversions. The
 * latter are for use in code where it has been established through manual
 * security review that the value produced by a piece of code will always
 * satisfy the SafeHtml contract (e.g., the output of a secure HTML sanitizer).
 * In uses of goog.html.legacyconversions, this guarantee is not given -- the
 * value in question originates in unreviewed legacy code and there is no
 * guarantee that it satisfies the SafeHtml contract.
 *
 * There are only three valid uses of legacyconversions:
 *
 * 1. Introducing a google.html version of a function which currently consumes
 * string and passes that string to a DOM API which can execute script - and
 * hence cause XSS - like innerHTML. For example, Dialog might expose a
 * setContent method which takes a string and sets the innerHTML property of
 * an element with it. In this case a setSafeHtmlContent function could be
 * added, consuming Html_SafeHtml instead of string, and using
 * goog.dom.safe.setInnerHtml instead of directly setting innerHTML.
 * setContent could then internally use legacyconversions to create a SafeHtml
 * from string and pass the SafeHtml to setSafeHtmlContent. In this scenario
 * remember to document the use of legacyconversions in the modified setContent
 * and consider deprecating it as well.
 *
 * 2. Automated refactoring of application code which handles HTML as string
 * but needs to call a function which only takes google.html types. For example,
 * in the Dialog scenario from (1) an alternative option would be to refactor
 * setContent to accept Html_SafeHtml instead of string and then refactor
 * all current callers to use legacyconversions to pass SafeHtml. This is
 * generally preferable to (1) because it keeps the library clean of
 * legacyconversions, and makes code sites in application code that are
 * potentially vulnerable to XSS more apparent.
 *
 * 3. Old code which needs to call APIs which consume google.html types and for
 * which it is prohibitively expensive to refactor to use google.html types.
 * Generally, this is code where safety from XSS is either hopeless or
 * unimportant.
 */
/**
 * Performs an "unchecked conversion" from string to SafeHtml for legacy API
 * purposes.
 *
 * Please read fileoverview documentation before using.
 *
 * @param {string} html A string to be converted to SafeHtml.
 * @return {!Html_SafeHtml} The value of html, wrapped in a SafeHtml
 *     object.
 */
export function safeHtmlFromString(html: string): Html_SafeHtml;
/**
 * Performs an "unchecked conversion" from string to SafeScript for legacy API
 * purposes.
 *
 * Please read fileoverview documentation before using.
 *
 * @param {string} script A string to be converted to SafeScript.
 * @return {!Html_SafeScript} The value of script, wrapped in a SafeScript
 *     object.
 */
export function safeScriptFromString(script: string): Html_SafeScript;
/**
 * Performs an "unchecked conversion" from string to SafeStyle for legacy API
 * purposes.
 *
 * Please read fileoverview documentation before using.
 *
 * @param {string} style A string to be converted to SafeStyle.
 * @return {!Html_SafeStyle} The value of style, wrapped in a SafeStyle
 *     object.
 */
export function safeStyleFromString(style: string): Html_SafeStyle;
/**
 * Performs an "unchecked conversion" from string to SafeStyleSheet for legacy
 * API purposes.
 *
 * Please read fileoverview documentation before using.
 *
 * @param {string} styleSheet A string to be converted to SafeStyleSheet.
 * @return {!Html_SafeStyleSheet} The value of style sheet, wrapped in
 *     a SafeStyleSheet object.
 */
export function safeStyleSheetFromString(styleSheet: string): Html_SafeStyleSheet;
/**
 * Performs an "unchecked conversion" from string to SafeUrl for legacy API
 * purposes.
 *
 * Please read fileoverview documentation before using.
 *
 * @param {string} url A string to be converted to SafeUrl.
 * @return {!Html_SafeUrl} The value of url, wrapped in a SafeUrl
 *     object.
 */
export function safeUrlFromString(url: string): Html_SafeUrl;
/**
 * Sets a function that will be called every time a legacy conversion is
 * performed. The function is called with no parameters but it can use
 * goog.debug.getStacktrace to get a stacktrace.
 *
 * @param {function(): undefined} callback Error callback as defined above.
 */
export function setReportCallback(callback: () => undefined): void;
/**
 * Performs an "unchecked conversion" from string to TrustedResourceUrl for
 * legacy API purposes.
 *
 * Please read fileoverview documentation before using.
 *
 * @param {string} url A string to be converted to TrustedResourceUrl.
 * @return {!Html_TrustedResourceUrl} The value of url, wrapped in a
 *     TrustedResourceUrl object.
 */
export function trustedResourceUrlFromString(url: string): Html_TrustedResourceUrl;
import { SafeHtml as Html_SafeHtml } from "./safehtml.js";
import { SafeScript as Html_SafeScript } from "./safescript.js";
import { SafeStyle as Html_SafeStyle } from "./safestyle.js";
import { SafeStyleSheet as Html_SafeStyleSheet } from "./safestylesheet.js";
import { SafeUrl as Html_SafeUrl } from "./safeurl.js";
import { TrustedResourceUrl as Html_TrustedResourceUrl } from "./trustedresourceurl.js";
