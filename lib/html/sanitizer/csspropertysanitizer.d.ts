/**
 * Sanitizes the value for a given a browser-parsed CSS value.
 * @param {string} propName A property name.
 * @param {string} propValue Value of the property as parsed by the browser.
 * @param {function(string, string):?SafeUrl=} opt_uriRewriter A URI
 *     rewriter that returns an unwrapped goog.html.SafeUrl.
 * @return {?string} Sanitized property value or null if the property should be
 *     rejected altogether.
 */
export function sanitizeProperty(propName: string, propValue: string, opt_uriRewriter?: ((arg0: string, arg1: string) => SafeUrl | null) | undefined): string | null;
import { SafeUrl } from "../safeurl.js";
