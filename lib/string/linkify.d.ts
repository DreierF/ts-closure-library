/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Utility function for linkifying text.
 */
/**
 * Options bag for linkifyPlainTextAsHtml's second parameter.
 * @interface
 */
export class LinkifyOptions {
}
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
 * Takes a string of plain text and linkifies URLs and email addresses. For a
 * URL (unless opt_attributes is specified), the target of the link will be
 * _blank and it will have a rel=nofollow attribute applied to it so that links
 * created by linkify will not be of interest to search engines.
 * @param {string} text Plain text.
 * @param {!LinkifyOptions=} opt_options Options bag.
 * @return {!SafeHtml} Linkified HTML. Any text that is not part of a
 *      link will be HTML-escaped.
 * @suppress {strictMissingProperties} opt_attributes type is a union
 */
export function linkifyPlainTextAsHtml(text: string, opt_options?: LinkifyOptions | undefined): SafeHtml;
import { SafeHtml } from "../html/safehtml.js";
