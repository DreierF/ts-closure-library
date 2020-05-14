export type InsertAdjacentHtmlPosition = string;
export namespace InsertAdjacentHtmlPosition {
    export const AFTERBEGIN: string;
    export const AFTEREND: string;
    export const BEFOREBEGIN: string;
    export const BEFOREEND: string;
}
/**
 * Safely assigns the URL of a Location object.
 *
 * If url is of type Html_SafeUrl, its value is unwrapped and
 * passed to Location#assign. If url is of type string however, it is
 * first sanitized using Html_SafeUrl.sanitize.
 *
 * Example usage:
 *   assignLocation(document.location, newUrl);
 * which is a safe alternative to
 *   document.location.assign(newUrl);
 * The latter can result in XSS vulnerabilities if newUrl is a
 * user-/attacker-controlled value.
 *
 * This has the same behaviour as setLocationHref, however some test
 * mock Location.assign instead of a property assignment.
 *
 * @param {!Location} loc The Location object which is to be assigned.
 * @param {string|!Html_SafeUrl} url The URL to assign.
 * @see Html_SafeUrl#sanitize
 */
export function assignLocation(loc: Location, url: string | Html_SafeUrl): void;
/**
 * Safely creates an HTMLImageElement from a Blob.
 *
 * Example usage:
 *     createImageFromBlob(blob);
 * which is a safe alternative to
 *     image.src = createObjectUrl(blob)
 * The latter can result in executing malicious same-origin scripts from a bad
 * Blob.
 * @param {!Blob} blob The blob to create the image from.
 * @return {!HTMLImageElement} The image element created from the blob.
 * @throws {!Error} If called with a Blob with a MIME type other than image/.*.
 */
export function createImageFromBlob(blob: Blob): HTMLImageElement;
/**
 * Writes known-safe HTML to a document.
 * @param {!Document} doc The document to be written to.
 * @param {!Html_SafeHtml} html The known-safe HTML to assign.
 */
export function documentWrite(doc: Document, html: Html_SafeHtml): void;
/**
 * Inserts known-safe HTML into a Node, at the specified position.
 * @param {!Node} node The node on which to call insertAdjacentHTML.
 * @param {!InsertAdjacentHtmlPosition} position Position where
 *     to insert the HTML.
 * @param {!Html_SafeHtml} html The known-safe HTML to insert.
 */
export function insertAdjacentHtml(node: Node, position: InsertAdjacentHtmlPosition, html: Html_SafeHtml): void;
/**
 * Safely opens a URL in a new window (via window.open).
 *
 * If url is of type Html_SafeUrl, its value is unwrapped and passed in to
 * window.open.  If url is of type string however, it is first sanitized
 * using Html_SafeUrl.sanitize.
 *
 * Note that this function does not prevent leakages via the referer that is
 * sent by window.open. It is advised to only use this to open 1st party URLs.
 *
 * Example usage:
 *   openInWindow(url);
 * which is a safe alternative to
 *   window.open(url);
 * The latter can result in XSS vulnerabilities if redirectUrl is a
 * user-/attacker-controlled value.
 *
 * @param {string|!Html_SafeUrl} url The URL to open.
 * @param {Window=} opt_openerWin Window of which to call the .open() method.
 *     Defaults to the global window.
 * @param {!Const=} opt_name Name of the window to open in. Can be
 *     _top, etc as allowed by window.open().
 * @param {string=} opt_specs Comma-separated list of specifications, same as
 *     in window.open().
 * @param {boolean=} opt_replace Whether to replace the current entry in browser
 *     history, same as in window.open().
 * @return {?Window} Window the url was opened in.
 */
export function openInWindow(url: string | Html_SafeUrl, opt_openerWin?: Window | undefined, opt_name?: Const | undefined, opt_specs?: string | undefined, opt_replace?: boolean | undefined): Window | null;
/**
 * Parses the string.
 * @param {!DOMParser} parser
 * @param {!Html_SafeHtml} content Note: We don't have a special type for
 *     XML od SVG supported by this function so we use SafeHtml.
 * @param {string} type
 * @return {?Document}
 */
export function parseFromString(parser: DOMParser, content: Html_SafeHtml, type: string): Document | null;
/**
 * Parses the HTML as 'text/html'.
 * @param {!DOMParser} parser
 * @param {!Html_SafeHtml} html The HTML to be parsed.
 * @return {?Document}
 */
export function parseFromStringHtml(parser: DOMParser, html: Html_SafeHtml): Document | null;
/**
 * Safely replaces the URL of a Location object.
 *
 * If url is of type Html_SafeUrl, its value is unwrapped and
 * passed to Location#replace. If url is of type string however, it is
 * first sanitized using Html_SafeUrl.sanitize.
 *
 * Example usage:
 *   replaceLocation(document.location, newUrl);
 * which is a safe alternative to
 *   document.location.replace(newUrl);
 * The latter can result in XSS vulnerabilities if newUrl is a
 * user-/attacker-controlled value.
 *
 * @param {!Location} loc The Location object which is to be replaced.
 * @param {string|!Html_SafeUrl} url The URL to assign.
 * @see Html_SafeUrl#sanitize
 */
export function replaceLocation(loc: Location, url: string | Html_SafeUrl): void;
/**
 * Safely assigns a URL to an anchor element's href property.
 *
 * If url is of type Html_SafeUrl, its value is unwrapped and assigned to
 * anchor's href property.  If url is of type string however, it is first
 * sanitized using Html_SafeUrl.sanitize.
 *
 * Example usage:
 *   setAnchorHref(anchorEl, url);
 * which is a safe alternative to
 *   anchorEl.href = url;
 * The latter can result in XSS vulnerabilities if url is a
 * user-/attacker-controlled value.
 *
 * @param {!HTMLAnchorElement} anchor The anchor element whose href property
 *     is to be assigned to.
 * @param {string|!Html_SafeUrl} url The URL to assign.
 * @see Html_SafeUrl#sanitize
 */
export function setAnchorHref(anchor: HTMLAnchorElement, url: string | Html_SafeUrl): void;
/**
 * Safely assigns a URL to a audio element's src property.
 *
 * If url is of type Html_SafeUrl, its value is unwrapped and assigned to
 * audio's src property.  If url is of type string however, it is first
 * sanitized using Html_SafeUrl.sanitize.
 *
 * @param {!HTMLAudioElement} audioElement The audio element whose src property
 *     is to be assigned to.
 * @param {string|!Html_SafeUrl} url The URL to assign.
 * @see Html_SafeUrl#sanitize
 */
export function setAudioSrc(audioElement: HTMLAudioElement, url: string | Html_SafeUrl): void;
/**
 * Safely assigns a URL to a button element's formaction property.
 *
 * If url is of type Html_SafeUrl, its value is unwrapped and assigned to
 * button's formaction property.  If url is of type string however, it is first
 * sanitized using Html_SafeUrl.sanitize.
 *
 * Example usage:
 *   setButtonFormAction(buttonEl, url);
 * which is a safe alternative to
 *   buttonEl.action = url;
 * The latter can result in XSS vulnerabilities if url is a
 * user-/attacker-controlled value.
 *
 * @param {!Element} button The button element whose action property
 *     is to be assigned to.
 * @param {string|!Html_SafeUrl} url The URL to assign.
 * @see Html_SafeUrl#sanitize
 */
export function setButtonFormAction(button: Element, url: string | Html_SafeUrl): void;
/**
 * Safely assigns a URL to an embed element's src property.
 *
 * Example usage:
 *   setEmbedSrc(embedEl, url);
 * which is a safe alternative to
 *   embedEl.src = url;
 * The latter can result in loading untrusted code unless it is ensured that
 * the URL refers to a trustworthy resource.
 *
 * @param {!HTMLEmbedElement} embed The embed element whose src property
 *     is to be assigned to.
 * @param {!TrustedResourceUrl} url The URL to assign.
 */
export function setEmbedSrc(embed: HTMLEmbedElement, url: TrustedResourceUrl): void;
/**
 * Safely assigns a URL a form element's action property.
 *
 * If url is of type Html_SafeUrl, its value is unwrapped and assigned to
 * form's action property.  If url is of type string however, it is first
 * sanitized using Html_SafeUrl.sanitize.
 *
 * Example usage:
 *   setFormElementAction(formEl, url);
 * which is a safe alternative to
 *   formEl.action = url;
 * The latter can result in XSS vulnerabilities if url is a
 * user-/attacker-controlled value.
 *
 * @param {!Element} form The form element whose action property
 *     is to be assigned to.
 * @param {string|!Html_SafeUrl} url The URL to assign.
 * @see Html_SafeUrl#sanitize
 */
export function setFormElementAction(form: Element, url: string | Html_SafeUrl): void;
/**
 * Safely assigns a URL to a frame element's src property.
 *
 * Example usage:
 *   setFrameSrc(frameEl, url);
 * which is a safe alternative to
 *   frameEl.src = url;
 * The latter can result in loading untrusted code unless it is ensured that
 * the URL refers to a trustworthy resource.
 *
 * @param {!HTMLFrameElement} frame The frame element whose src property
 *     is to be assigned to.
 * @param {!TrustedResourceUrl} url The URL to assign.
 */
export function setFrameSrc(frame: HTMLFrameElement, url: TrustedResourceUrl): void;
/**
 * Safely assigns a URL to an iframe element's src property.
 *
 * Example usage:
 *   setIframeSrc(iframeEl, url);
 * which is a safe alternative to
 *   iframeEl.src = url;
 * The latter can result in loading untrusted code unless it is ensured that
 * the URL refers to a trustworthy resource.
 *
 * @param {!HTMLIFrameElement} iframe The iframe element whose src property
 *     is to be assigned to.
 * @param {!TrustedResourceUrl} url The URL to assign.
 */
export function setIframeSrc(iframe: HTMLIFrameElement, url: TrustedResourceUrl): void;
/**
 * Safely assigns HTML to an iframe element's srcdoc property.
 *
 * Example usage:
 *   setIframeSrcdoc(iframeEl, safeHtml);
 * which is a safe alternative to
 *   iframeEl.srcdoc = html;
 * The latter can result in loading untrusted code.
 *
 * @param {!HTMLIFrameElement} iframe The iframe element whose srcdoc property
 *     is to be assigned to.
 * @param {!Html_SafeHtml} html The HTML to assign.
 */
export function setIframeSrcdoc(iframe: HTMLIFrameElement, html: Html_SafeHtml): void;
/**
 * Safely assigns a URL to an image element's src property.
 *
 * If url is of type Html_SafeUrl, its value is unwrapped and assigned to
 * image's src property.  If url is of type string however, it is first
 * sanitized using Html_SafeUrl.sanitize.
 *
 * @param {!HTMLImageElement} imageElement The image element whose src property
 *     is to be assigned to.
 * @param {string|!Html_SafeUrl} url The URL to assign.
 * @see Html_SafeUrl#sanitize
 */
export function setImageSrc(imageElement: HTMLImageElement, url: string | Html_SafeUrl): void;
/**
 * Assigns known-safe HTML to an element's innerHTML property.
 * @param {!Element} elem The element whose innerHTML is to be assigned to.
 * @param {!Html_SafeHtml} html The known-safe HTML to assign.
 * @throws {Error} If called with one of these tags: math, script, style, svg,
 *     template.
 */
export function setInnerHtml(elem: Element, html: Html_SafeHtml): void;
/**
 * Safely assigns a URL to an input element's formaction property.
 *
 * If url is of type Html_SafeUrl, its value is unwrapped and assigned to
 * input's formaction property.  If url is of type string however, it is first
 * sanitized using Html_SafeUrl.sanitize.
 *
 * Example usage:
 *   setInputFormAction(inputEl, url);
 * which is a safe alternative to
 *   inputEl.action = url;
 * The latter can result in XSS vulnerabilities if url is a
 * user-/attacker-controlled value.
 *
 * @param {!Element} input The input element whose action property
 *     is to be assigned to.
 * @param {string|!Html_SafeUrl} url The URL to assign.
 * @see Html_SafeUrl#sanitize
 */
export function setInputFormAction(input: Element, url: string | Html_SafeUrl): void;
/**
 * Safely sets a link element's href and rel properties. Whether or not
 * the URL assigned to href has to be a TrustedResourceUrl
 * depends on the value of the rel property. If rel contains "stylesheet"
 * then a TrustedResourceUrl is required.
 *
 * Example usage:
 *   setLinkHrefAndRel(linkEl, url, 'stylesheet');
 * which is a safe alternative to
 *   linkEl.rel = 'stylesheet';
 *   linkEl.href = url;
 * The latter can result in loading untrusted code unless it is ensured that
 * the URL refers to a trustworthy resource.
 *
 * @param {!HTMLLinkElement} link The link element whose href property
 *     is to be assigned to.
 * @param {string|!Html_SafeUrl|!TrustedResourceUrl} url The URL
 *     to assign to the href property. Must be a TrustedResourceUrl if the
 *     value assigned to rel contains "stylesheet". A string value is
 *     sanitized with Html_SafeUrl.sanitize.
 * @param {string} rel The value to assign to the rel property.
 * @throws {Error} if rel contains "stylesheet" and url is not a
 *     TrustedResourceUrl
 * @see Html_SafeUrl#sanitize
 */
export function setLinkHrefAndRel(link: HTMLLinkElement, url: string | Html_SafeUrl | TrustedResourceUrl, rel: string): void;
/**
 * Safely assigns a URL to a Location object's href property.
 *
 * If url is of type Html_SafeUrl, its value is unwrapped and assigned to
 * loc's href property.  If url is of type string however, it is first sanitized
 * using Html_SafeUrl.sanitize.
 *
 * Example usage:
 *   setLocationHref(document.location, redirectUrl);
 * which is a safe alternative to
 *   document.location.href = redirectUrl;
 * The latter can result in XSS vulnerabilities if redirectUrl is a
 * user-/attacker-controlled value.
 *
 * @param {!Location} loc The Location object whose href property is to be
 *     assigned to.
 * @param {string|!Html_SafeUrl} url The URL to assign.
 * @see Html_SafeUrl#sanitize
 */
export function setLocationHref(loc: Location, url: string | Html_SafeUrl): void;
/**
 * Safely assigns a URL to an object element's data property.
 *
 * Example usage:
 *   setObjectData(objectEl, url);
 * which is a safe alternative to
 *   objectEl.data = url;
 * The latter can result in loading untrusted code unless setit is ensured that
 * the URL refers to a trustworthy resource.
 *
 * @param {!HTMLObjectElement} object The object element whose data property
 *     is to be assigned to.
 * @param {!TrustedResourceUrl} url The URL to assign.
 */
export function setObjectData(object: HTMLObjectElement, url: TrustedResourceUrl): void;
/**
 * Assigns known-safe HTML to an element's outerHTML property.
 * @param {!Element} elem The element whose outerHTML is to be assigned to.
 * @param {!Html_SafeHtml} html The known-safe HTML to assign.
 */
export function setOuterHtml(elem: Element, html: Html_SafeHtml): void;
/**
 * Safely assigns a value to a script element's content.
 *
 * Example usage:
 *   setScriptContent(scriptEl, content);
 * which is a safe alternative to
 *   scriptEl.text = content;
 * The latter can result in executing untrusted code unless it is ensured that
 * the code is loaded from a trustworthy resource.
 *
 * @param {!HTMLScriptElement} script The script element whose content is being
 *     set.
 * @param {!SafeScript} content The content to assign.
 */
export function setScriptContent(script: HTMLScriptElement, content: SafeScript): void;
/**
 * Safely assigns a URL to a script element's src property.
 *
 * Example usage:
 *   setScriptSrc(scriptEl, url);
 * which is a safe alternative to
 *   scriptEl.src = url;
 * The latter can result in loading untrusted code unless it is ensured that
 * the URL refers to a trustworthy resource.
 *
 * @param {!HTMLScriptElement} script The script element whose src property
 *     is to be assigned to.
 * @param {!TrustedResourceUrl} url The URL to assign.
 */
export function setScriptSrc(script: HTMLScriptElement, url: TrustedResourceUrl): void;
/**
 * Sets the given element's style property to the contents of the provided
 * SafeStyle object.
 * @param {!Element} elem
 * @param {!SafeStyle} style
 */
export function setStyle(elem: Element, style: SafeStyle): void;
/**
 * Safely assigns a URL to a video element's src property.
 *
 * If url is of type Html_SafeUrl, its value is unwrapped and assigned to
 * video's src property.  If url is of type string however, it is first
 * sanitized using Html_SafeUrl.sanitize.
 *
 * @param {!HTMLVideoElement} videoElement The video element whose src property
 *     is to be assigned to.
 * @param {string|!Html_SafeUrl} url The URL to assign.
 * @see Html_SafeUrl#sanitize
 */
export function setVideoSrc(videoElement: HTMLVideoElement, url: string | Html_SafeUrl): void;
/**
 * Assigns HTML to an element's innerHTML property. Helper to use only here and
 * in soy.js.
 * @param {Element|null} elem The element whose innerHTML is to be assigned to.
 * @param {!Html_SafeHtml} html
 */
export function unsafeSetInnerHtmlDoNotUseOrElse(elem: Element | null, html: Html_SafeHtml): void;
import { SafeUrl as Html_SafeUrl } from "../html/safeurl.js";
import { SafeHtml as Html_SafeHtml } from "../html/safehtml.js";
import { Const } from "../string/const.js";
import { TrustedResourceUrl } from "../html/trustedresourceurl.js";
import { SafeScript } from "../html/safescript.js";
import { SafeStyle } from "../html/safestyle.js";
