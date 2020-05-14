/**
 * Determines if a value is a DOM Element.
 * @param {*} value
 * @return {boolean}
 */
export function isElement(value: any): boolean;
/**
 * Determines if a value is a DOM HTML Element.
 * @param {*} value
 * @return {boolean}
 */
export function isHtmlElement(value: any): boolean;
/**
 * Determines if a value is a DOM HTML Element of a specified tag name. For
 * modern browsers, tags that provide access to special DOM APIs are implemented
 * as special subclasses of HTMLElement.
 * @param {*} value
 * @param {!TagName} tagName
 * @return {boolean}
 */
export function isHtmlElementOfType(value: any, tagName: TagName): boolean;
/**
 * Determines if a value is an <A> Element.
 * @param {*} value
 * @return {boolean}
 */
export function isHtmlAnchorElement(value: any): boolean;
/**
 * Determines if a value is a <BUTTON> Element.
 * @param {*} value
 * @return {boolean}
 */
export function isHtmlButtonElement(value: any): boolean;
/**
 * Determines if a value is a <LINK> Element.
 * @param {*} value
 * @return {boolean}
 */
export function isHtmlLinkElement(value: any): boolean;
/**
 * Determines if a value is an <IMG> Element.
 * @param {*} value
 * @return {boolean}
 */
export function isHtmlImageElement(value: any): boolean;
/**
 * Determines if a value is an <AUDIO> Element.
 * @param {*} value
 * @return {boolean}
 */
export function isHtmlAudioElement(value: any): boolean;
/**
 * Determines if a value is a <VIDEO> Element.
 * @param {*} value
 * @return {boolean}
 */
export function isHtmlVideoElement(value: any): boolean;
/**
 * Determines if a value is an <INPUT> Element.
 * @param {*} value
 * @return {boolean}
 */
export function isHtmlInputElement(value: any): boolean;
/**
 * Determines if a value is a <TEXTAREA> Element.
 * @param {*} value
 * @return {boolean}
 */
export function isHtmlTextAreaElement(value: any): boolean;
/**
 * Determines if a value is a <CANVAS> Element.
 * @param {*} value
 * @return {boolean}
 */
export function isHtmlCanvasElement(value: any): boolean;
/**
 * Determines if a value is an <EMBED> Element.
 * @param {*} value
 * @return {boolean}
 */
export function isHtmlEmbedElement(value: any): boolean;
/**
 * Determines if a value is a <FORM> Element.
 * @param {*} value
 * @return {boolean}
 */
export function isHtmlFormElement(value: any): boolean;
/**
 * Determines if a value is a <FRAME> Element.
 * @param {*} value
 * @return {boolean}
 */
export function isHtmlFrameElement(value: any): boolean;
/**
 * Determines if a value is an <IFRAME> Element.
 * @param {*} value
 * @return {boolean}
 */
export function isHtmlIFrameElement(value: any): boolean;
/**
 * Determines if a value is an <OBJECT> Element.
 * @param {*} value
 * @return {boolean}
 */
export function isHtmlObjectElement(value: any): boolean;
/**
 * Determines if a value is a <SCRIPT> Element.
 * @param {*} value
 * @return {boolean}
 */
export function isHtmlScriptElement(value: any): boolean;
import { TagName } from "./tagname.js";
