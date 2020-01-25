export function safeHtmlFromStringKnownToSatisfyTypeContract(justification: Const, html: string, opt_dir?: number): SafeHtml;
export function safeScriptFromStringKnownToSatisfyTypeContract(justification: Const, script: string): Html_SafeScript;
export function safeStyleFromStringKnownToSatisfyTypeContract(justification: Const, style: string): Html_SafeStyle;
/**
 * Performs an "unchecked conversion" to SafeStyleSheet from a plain string
 * that is known to satisfy the SafeStyleSheet type contract.
 *
 * IMPORTANT: Uses of this method must be carefully security-reviewed to ensure
 * that the value of `styleSheet` satisfies the SafeStyleSheet type
 * contract in all possible program states.
 *
 *
 * @param {!Const} justification A constant string explaining why
 *     this use of this method is safe. May include a security review ticket
 *     number.
 * @param {string} styleSheet The string to wrap as a SafeStyleSheet.
 * @return {!Html_SafeStyleSheet} The value of `styleSheet`, wrapped
 *     in a SafeStyleSheet object.
 */
export function safeStyleSheetFromStringKnownToSatisfyTypeContract(justification: Const, styleSheet: string): Html_SafeStyleSheet;
export function safeUrlFromStringKnownToSatisfyTypeContract(justification: Const, url: string): Html_SafeUrl;
/**
 * Performs an "unchecked conversion" to TrustedResourceUrl from a plain string
 * that is known to satisfy the TrustedResourceUrl type contract.
 *
 * IMPORTANT: Uses of this method must be carefully security-reviewed to ensure
 * that the value of `url` satisfies the TrustedResourceUrl type contract
 * in all possible program states.
 *
 *
 * @param {!Const} justification A constant string explaining why
 *     this use of this method is safe. May include a security review ticket
 *     number.
 * @param {string} url The string to wrap as a TrustedResourceUrl.
 * @return {!Html_TrustedResourceUrl} The value of `url`, wrapped in
 *     a TrustedResourceUrl object.
 */
export function trustedResourceUrlFromStringKnownToSatisfyTypeContract(justification: Const, url: string): Html_TrustedResourceUrl;
import { Const } from "../string/const.js";
import { SafeHtml } from "./safehtml.js";
import { SafeScript as Html_SafeScript } from "./safescript.js";
import { SafeStyle as Html_SafeStyle } from "./safestyle.js";
import { SafeStyleSheet as Html_SafeStyleSheet } from "./safestylesheet.js";
import { SafeUrl as Html_SafeUrl } from "./safeurl.js";
import { TrustedResourceUrl as Html_TrustedResourceUrl } from "./trustedresourceurl.js";
