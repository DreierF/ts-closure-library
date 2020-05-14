/**
 * Legacy version of BLANK_SOURCE_URL.
 * @const {string}
 */
export let BLANK_SOURCE: string;
/**
 * Legacy version of BLANK_SOURCE_NEW_FRAME_URL.
 * @const {string}
 */
export let BLANK_SOURCE_NEW_FRAME: string;
/**
 * Safe source for a new blank iframe that may not cause a new load of the
 * iframe. This is different from `BLANK_SOURCE` in that
 * it will allow an iframe to be loaded synchronously in more browsers, notably
 * Gecko, following the javascript protocol spec.
 *
 * NOTE: This should not be used to replace the source of an existing iframe.
 * The new src value will be ignored, per the spec.
 *
 * Due to cross-browser differences, the load is not guaranteed  to be
 * synchronous. If code depends on the load of the iframe,
 * then `goog.net.IframeLoadMonitor` or a similar technique should be
 * used.
 *
 * According to
 * http://www.whatwg.org/specs/web-apps/current-work/multipage/webappapis.html#javascript-protocol
 * the 'javascript:""' URL should trigger a new load of the iframe, which may be
 * asynchronous. A void src, such as 'javascript:undefined', does not change
 * the browsing context document's, and thus should not trigger another load.
 *
 * Intentionally not about:blank, which also triggers a load.
 *
 * NOTE: 'javascript:' URL handling spec compliance varies per browser. IE
 * throws an error with 'javascript:undefined'. Webkit browsers will reload the
 * iframe when setting this source on an existing iframe.
 *
 * @const {!TrustedResourceUrl}
 */
export let BLANK_SOURCE_NEW_FRAME_URL: TrustedResourceUrl;
/**
 * @fileoverview Utilities for creating and working with iframes
 * cross-browser.
 */
/**
 * Safe source for a blank iframe.
 *
 * Intentionally not about:blank for IE, which gives mixed content warnings in
 * IE6 over HTTPS. Using 'about:blank' for all other browsers to support Content
 * Security Policy (CSP). According to http://www.w3.org/TR/CSP/ CSP does not
 * allow inline javascript by default.
 *
 * @const {!TrustedResourceUrl}
 */
export let BLANK_SOURCE_URL: TrustedResourceUrl;
/**
 * Creates a completely blank iframe element.
 *
 * The iframe will not caused mixed-content warnings for IE6 under HTTPS.
 * The iframe will also have no borders or padding, so that the styled width
 * and height will be the actual width and height of the iframe.
 *
 * This function currently only attempts to create a blank iframe.  There
 * are no guarantees to the contents of the iframe or whether it is rendered
 * in quirks mode.
 *
 * @param {?DomHelper} domHelper The dom helper to use.
 * @param {!SafeStyle=} opt_styles CSS styles for the iframe.
 * @return {!HTMLIFrameElement} A completely blank iframe.
 */
export function createBlank(domHelper: DomHelper | null, opt_styles?: SafeStyle | undefined): HTMLIFrameElement;
/**
 * Creates a same-domain iframe containing preloaded content.
 *
 * This is primarily useful for DOM sandboxing.  One use case is to embed
 * a trusted JavaScript app with potentially conflicting CSS styles.  The
 * second case is to reduce the cost of layout passes by the browser -- for
 * example, you can perform sandbox sizing of characters in an iframe while
 * manipulating a heavy DOM in the main window.  The iframe and parent frame
 * can access each others' properties and functions without restriction.
 *
 * @param {!Element} parentElement The parent element in which to append the
 *     iframe.
 * @param {!SafeHtml=} opt_headContents Contents to go into the
 *     iframe's head.
 * @param {!SafeHtml=} opt_bodyContents Contents to go into the
 *     iframe's body.
 * @param {!SafeStyle=} opt_styles CSS styles for the iframe itself,
 *     before adding to the parent element.
 * @param {boolean=} opt_quirks Whether to use quirks mode (false by default).
 * @return {!HTMLIFrameElement} An iframe that has the specified contents.
 */
export function createWithContent(parentElement: Element, opt_headContents?: SafeHtml | undefined, opt_bodyContents?: SafeHtml | undefined, opt_styles?: SafeStyle | undefined, opt_quirks?: boolean | undefined): HTMLIFrameElement;
/**
 * Writes the contents of a blank iframe that has already been inserted
 * into the document.
 * @param {!HTMLIFrameElement} iframe An iframe with no contents, such as
 *     one created by {@link #createBlank}, but already appended to
 *     a parent document.
 * @param {!SafeHtml} content Content to write to the iframe,
 *     from doctype to the HTML close tag.
 */
export function writeSafeContent(iframe: HTMLIFrameElement, content: SafeHtml): void;
import { TrustedResourceUrl } from "../html/trustedresourceurl.js";
import { DomHelper } from "./dom.js";
import { SafeStyle } from "../html/safestyle.js";
import { SafeHtml } from "../html/safehtml.js";
