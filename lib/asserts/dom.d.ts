type Include<T, U> = T extends U ? T : never;
/**
 * Checks if the value is a DOM Element if goog.asserts.ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @return {!Element} The value, likely to be a DOM Element when asserts are
 *     enabled.
 * @throws {!asserts.AssertionError} When the value is not an Element.
 * @closurePrimitive {asserts.matchesReturn}
 */
export function assertIsElement(value: any): Include<typeof value, Element>;
/**
 * Checks if the value is a DOM HTMLElement if goog.asserts.ENABLE_ASSERTS is
 * true.
 * @param {*} value The value to check.
 * @return {!HTMLElement} The value, likely to be a DOM HTMLElement when asserts
 *     are enabled.
 * @throws {!asserts.AssertionError} When the value is not an HTMLElement.
 * @closurePrimitive {asserts.matchesReturn}
 */
export function assertIsHtmlElement(value: any): Include<typeof value, HTMLElement>;
/**
 * Checks if the value is a DOM HTMLElement of the specified tag name / subclass
 * if goog.asserts.ENABLE_ASSERTS is true.
 * @param {*} value The value to check.
 * @param {!TagName<T>} tagName The element tagName to verify the value against.
 * @return {T} The value, likely to be a DOM HTMLElement when asserts are
 *     enabled. The exact return type will match the parameterized type
 *     of the tagName as specified in goog.dom.TagName.
 * @throws {!asserts.AssertionError} When the value is not an HTMLElement with
 *     the appropriate tagName.
 * @template T
 * @closurePrimitive {asserts.matchesReturn}
 */
export function assertIsHtmlElementOfType<T>(value: any, tagName: TagName<T>): T;
/**
 * Checks if the value is an HTMLAnchorElement if goog.asserts.ENABLE_ASSERTS is
 * true.
 * @param {*} value
 * @return {!HTMLAnchorElement}
 * @throws {!asserts.AssertionError}
 * @closurePrimitive {asserts.matchesReturn}
 */
export function assertIsHtmlAnchorElement(value: any): Include<typeof value, HTMLAnchorElement>;
/**
 * Checks if the value is an HTMLButtonElement if goog.asserts.ENABLE_ASSERTS is
 * true.
 * @param {*} value
 * @return {!HTMLButtonElement}
 * @throws {!asserts.AssertionError}
 * @closurePrimitive {asserts.matchesReturn}
 */
export function assertIsHtmlButtonElement(value: any): Include<typeof value, HTMLButtonElement>;
/**
 * Checks if the value is an HTMLLinkElement if goog.asserts.ENABLE_ASSERTS is
 * true.
 * @param {*} value
 * @return {!HTMLLinkElement}
 * @throws {!asserts.AssertionError}
 * @closurePrimitive {asserts.matchesReturn}
 */
export function assertIsHtmlLinkElement(value: any): Include<typeof value, HTMLLinkElement>;
/**
 * Checks if the value is an HTMLImageElement if goog.asserts.ENABLE_ASSERTS is
 * true.
 * @param {*} value
 * @return {!HTMLImageElement}
 * @throws {!asserts.AssertionError}
 * @closurePrimitive {asserts.matchesReturn}
 */
export function assertIsHtmlImageElement(value: any): Include<typeof value, HTMLImageElement>;
/**
 * Checks if the value is an HTMLAudioElement if goog.asserts.ENABLE_ASSERTS is
 * true.
 * @param {*} value
 * @return {!HTMLAudioElement}
 * @throws {!asserts.AssertionError}
 * @closurePrimitive {asserts.matchesReturn}
 */
export function assertIsHtmlAudioElement(value: any): Include<typeof value, HTMLAudioElement>;
/**
 * Checks if the value is an HTMLVideoElement if goog.asserts.ENABLE_ASSERTS is
 * true.
 * @param {*} value
 * @return {!HTMLVideoElement}
 * @throws {!asserts.AssertionError}
 * @closurePrimitive {asserts.matchesReturn}
 */
export function assertIsHtmlVideoElement(value: any): Include<typeof value, HTMLVideoElement>;
/**
 * Checks if the value is an HTMLInputElement if goog.asserts.ENABLE_ASSERTS is
 * true.
 * @param {*} value
 * @return {!HTMLInputElement}
 * @throws {!asserts.AssertionError}
 * @closurePrimitive {asserts.matchesReturn}
 */
export function assertIsHtmlInputElement(value: any): Include<typeof value, HTMLInputElement>;
/**
 * Checks if the value is an HTMLTextAreaElement if goog.asserts.ENABLE_ASSERTS
 * is true.
 * @param {*} value
 * @return {!HTMLTextAreaElement}
 * @throws {!asserts.AssertionError}
 * @closurePrimitive {asserts.matchesReturn}
 */
export function assertIsHtmlTextAreaElement(value: any): Include<typeof value, HTMLTextAreaElement>;
/**
 * Checks if the value is an HTMLCanvasElement if goog.asserts.ENABLE_ASSERTS is
 * true.
 * @param {*} value
 * @return {!HTMLCanvasElement}
 * @throws {!asserts.AssertionError}
 * @closurePrimitive {asserts.matchesReturn}
 */
export function assertIsHtmlCanvasElement(value: any): Include<typeof value, HTMLCanvasElement>;
/**
 * Checks if the value is an HTMLEmbedElement if goog.asserts.ENABLE_ASSERTS is
 * true.
 * @param {*} value
 * @return {!HTMLEmbedElement}
 * @throws {!asserts.AssertionError}
 * @closurePrimitive {asserts.matchesReturn}
 */
export function assertIsHtmlEmbedElement(value: any): Include<typeof value, HTMLEmbedElement>;
/**
 * Checks if the value is an HTMLFormElement if goog.asserts.ENABLE_ASSERTS is
 * true.
 * @param {*} value
 * @return {!HTMLFormElement}
 * @throws {!asserts.AssertionError}
 * @closurePrimitive {asserts.matchesReturn}
 */
export function assertIsHtmlFormElement(value: any): Include<typeof value, HTMLFormElement>;
/**
 * Checks if the value is an HTMLFrameElement if goog.asserts.ENABLE_ASSERTS is
 * true.
 * @param {*} value
 * @return {!HTMLFrameElement}
 * @throws {!asserts.AssertionError}
 * @closurePrimitive {asserts.matchesReturn}
 */
export function assertIsHtmlFrameElement(value: any): Include<typeof value, HTMLFrameElement>;
/**
 * Checks if the value is an HTMLIFrameElement if goog.asserts.ENABLE_ASSERTS is
 * true.
 * @param {*} value
 * @return {!HTMLIFrameElement}
 * @throws {!asserts.AssertionError}
 * @closurePrimitive {asserts.matchesReturn}
 */
export function assertIsHtmlIFrameElement(value: any): Include<typeof value, HTMLIFrameElement>;
/**
 * Checks if the value is an HTMLObjectElement if goog.asserts.ENABLE_ASSERTS is
 * true.
 * @param {*} value
 * @return {!HTMLObjectElement}
 * @throws {!asserts.AssertionError}
 * @closurePrimitive {asserts.matchesReturn}
 */
export function assertIsHtmlObjectElement(value: any): Include<typeof value, HTMLObjectElement>;
/**
 * Checks if the value is an HTMLScriptElement if goog.asserts.ENABLE_ASSERTS is
 * true.
 * @param {*} value
 * @return {!HTMLScriptElement}
 * @throws {!asserts.AssertionError}
 * @closurePrimitive {asserts.matchesReturn}
 */
export function assertIsHtmlScriptElement(value: any): Include<typeof value, HTMLScriptElement>;
import { TagName } from "../dom/tagname.js";
