/**
 * Event types for full screen.
 */
export type EventType = string;
/**
 * Options for fullscreen navigation UI:
 * https://fullscreen.spec.whatwg.org/#dictdef-fullscreenoptions
 */
export type FullscreenNavigationUI = string;
export namespace EventType {
    export const CHANGE: string;
}
export namespace FullscreenNavigationUI {
    export const AUTO: string;
    export const HIDE: string;
    export const SHOW: string;
}
/**
 * @interface
 */
export function FullscreenOptions(): void;
export class FullscreenOptions {
    /** @type {!FullscreenNavigationUI} */
    navigationUI: FullscreenNavigationUI;
}
/**
 * Exits full screen.
 * @param {!DomHelper=} opt_domHelper The DomHelper for the DOM being
 *     queried. If not provided, use the current DOM.
 */
export function exitFullScreen(opt_domHelper?: DomHelper | undefined): void;
/**
 * Get the root element in full screen mode.
 * @param {!DomHelper=} opt_domHelper The DomHelper for the DOM being
 *     queried. If not provided, use the current DOM.
 * @return {Element|null} The root element in full screen mode.
 */
export function getFullScreenElement(opt_domHelper?: DomHelper | undefined): Element | null;
/**
 * Determines if the document is full screen.
 * @param {!DomHelper=} opt_domHelper The DomHelper for the DOM being
 *     queried. If not provided, use the current DOM.
 * @return {boolean} Whether the document is full screen.
 */
export function isFullScreen(opt_domHelper?: DomHelper | undefined): boolean;
/**
 * Determines if full screen is supported.
 * @param {!DomHelper=} opt_domHelper The DomHelper for the DOM being
 *     queried. If not provided, use the current DOM.
 * @return {boolean} True iff full screen is supported.
 */
export function isSupported(opt_domHelper?: DomHelper | undefined): boolean;
/**
 * Requests putting the element in full screen.
 * @param {!Element} element The element to put full screen.
 * @param {!FullscreenOptions=} opt_options Options for full
 *     screen. This field will be ignored on older browsers.
 */
export function requestFullScreen(element: Element, opt_options?: FullscreenOptions | undefined): void;
/**
 * Requests putting the element in full screen with full keyboard access.
 * @param {!Element} element The element to put full screen.
 */
export function requestFullScreenWithKeys(element: Element): void;
import { DomHelper } from "./dom.js";
