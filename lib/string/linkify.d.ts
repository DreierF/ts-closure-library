/**
 * Gets the first email address in text.
 * @param {string} text Plain text.
 * @return {string} The first email address, or an empty string if not found.
 */
export function findFirstEmail(text: string): string;
/**
 * Gets the first URI in text.
 * @param {string} text Plain text.
 * @return {string} The first URL, or an empty string if not found.
 */
export function findFirstUrl(text: string): string;
/**
 * @fileoverview Utility function for linkifying text.
 */
/**
 * Takes a string of plain text and linkifies URLs and email addresses. For a
 * URL (unless opt_attributes is specified), the target of the link will be
 * _blank and it will have a rel=nofollow attribute applied to it so that links
 * created by linkify will not be of interest to search engines.
 * @param {string} text Plain text.
 * @param {!Object<string, ?SafeHtml.AttributeValue>=} opt_attributes
 *     Attributes to add to all links created. Default are rel=nofollow and
 *     target=_blank. To clear those default attributes set rel='' and
 *     target=''.
 * @param {boolean=} opt_preserveNewlines Whether to preserve newlines with
 *     &lt;br&gt;.
 * @return {!SafeHtml} Linkified HTML. Any text that is not part of a
 *      link will be HTML-escaped.
 */
export function linkifyPlainTextAsHtml(text: string, opt_attributes?: {
    [x: string]: SafeHtml.AttributeValue | null;
} | undefined, opt_preserveNewlines?: boolean | undefined): SafeHtml;
import { SafeHtml } from "../html/safehtml.js";
