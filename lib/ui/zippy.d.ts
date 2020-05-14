/**
 * Constants for event names
 */
export type Events = string;
export namespace Events {
    export const ACTION: string;
    export const TOGGLE: string;
}
/**
 * @fileoverview Zippy widget implementation.
 *
 * @see ../demos/zippy.html
 */
/**
 * Zippy widget. Expandable/collapsible container, clicking the header toggles
 * the visibility of the content.
 *
 * @extends {EventsEventTarget}
 *     reference, string id or null if no header exists.
 *     (if any), either element reference or string id.  If skipped, the caller
 *     should handle the TOGGLE event in its own way. If a function is passed,
 *     then if will be called to create the content element the first time the
 *     zippy is expanded.
 *     undefined, attempts to infer the state from the DOM. Setting visibility
 *     using one of the standard Soy templates guarantees correct inference.
 *     the zippy is expanded.
 */
export class Zippy extends EventsEventTarget {
    /**
     * Zippy widget. Expandable/collapsible container, clicking the header toggles
     * the visibility of the content.
     *
     * @param {?Element|string|null} header Header element, either element
     *     reference, string id or null if no header exists.
     * @param {?Element|string|function():Element=} opt_content Content element
     *     (if any), either element reference or string id.  If skipped, the caller
     *     should handle the TOGGLE event in its own way. If a function is passed,
     *     then if will be called to create the content element the first time the
     *     zippy is expanded.
     * @param {boolean=} opt_expanded Initial expanded/visibility state. If
     *     undefined, attempts to infer the state from the DOM. Setting visibility
     *     using one of the standard Soy templates guarantees correct inference.
     * @param {?Element|string=} opt_expandedHeader Element to use as the header when
     *     the zippy is expanded.
     * @param {DomHelper=} opt_domHelper An optional DOM helper.
     * @param {Role<string>=} opt_role ARIA role, default TAB.
     */
    constructor(header: (Element | string | null) | null, opt_content?: ((Element | string | (() => Element)) | null) | undefined, opt_expanded?: boolean | undefined, opt_expandedHeader?: ((Element | string) | null) | undefined, opt_domHelper?: DomHelper | undefined, opt_role?: Role<string> | undefined);
    /**
     * Whether to listen for and handle mouse events; defaults to true.
     * @type {boolean}
     * @private
     */
    private handleMouseEvents_;
    /**
     * Whether to listen for and handle key events; defaults to true.
     * @type {boolean}
     * @private
     */
    private handleKeyEvents_;
    /**
     * DomHelper used to interact with the document, allowing components to be
     * created in a different window.
     * @type {!DomHelper}
     * @private
     */
    private dom_;
    /**
     * Header element or null if no header exists.
     * @type {?Element}
     * @private
     */
    private elHeader_;
    /**
     * When present, the header to use when the zippy is expanded.
     * @type {?Element}
     * @private
     */
    private elExpandedHeader_;
    /**
     * Function that will create the content element, or false if there is no such
     * function.
     * @type {?function():Element}
   * @suppress{checkTypes}
     * @private
     */
    private lazyCreateFunc_;
    /**
     * ARIA role.
     * @type {Role<string>}
     * @private
     */
    private role_;
    /**
     * Content element.
     * @type {?Element}
     * @private
     */
    private elContent_;
    /**
     * Expanded state.
     * @type {boolean}
     * @private
     */
    private expanded_;
    /**
     * A keyboard events handler. If there are two headers it is shared for both.
     * @type {EventHandler<!Zippy>}
     * @private
     */
    private keyboardEventHandler_;
    /**
     * The keyhandler used for listening on most key events. This takes care of
     * abstracting away some of the browser differences.
     * @private {!KeyHandler}
     */
    private keyHandler_;
    /**
     * A mouse events handler. If there are two headers it is shared for both.
     * @type {EventHandler<!Zippy>}
     * @private
     */
    private mouseEventHandler_;
    /**
     * @return {?Role} The ARIA role to be applied to Zippy element.
     */
    getAriaRole(): Role | null;
    /**
     * @return {?HTMLElement} The content element.
     */
    getContentElement(): HTMLElement | null;
    /**
     * @return {?Element} The visible header element.
     */
    getVisibleHeaderElement(): Element | null;
    /**
     * Expands content pane.
     */
    expand(): void;
    /**
     * Collapses content pane.
     */
    collapse(): void;
    /**
     * Toggles expanded state.
     */
    toggle(): void;
    /**
     * Sets expanded state.
     *
     * @param {boolean} expanded Expanded/visibility state.
     */
    setExpanded(expanded: boolean): void;
    /**
     * Sets expanded internal state.
     *
     * @param {boolean} expanded Expanded/visibility state.
     * @protected
     */
    protected setExpandedInternal(expanded: boolean): void;
    /**
     * @return {boolean} Whether the zippy is expanded.
     */
    isExpanded(): boolean;
    /**
     * Updates the header element's className and ARIA (accessibility) EXPANDED
     * state.
     *
     * @param {boolean} expanded Expanded/visibility state.
     * @protected
     */
    protected updateHeaderClassName(expanded: boolean): void;
    /**
     * @return {boolean} Whether the Zippy handles its own key events.
     */
    isHandleKeyEvents(): boolean;
    /**
     * @return {boolean} Whether the Zippy handles its own mouse events.
     */
    isHandleMouseEvents(): boolean;
    /**
     * Sets whether the Zippy handles it's own keyboard events.
     * @param {boolean} enable Whether the Zippy handles keyboard events.
     */
    setHandleKeyboardEvents(enable: boolean): void;
    /**
     * Sets whether the Zippy handles it's own mouse events.
     * @param {boolean} enable Whether the Zippy handles mouse events.
     */
    setHandleMouseEvents(enable: boolean): void;
    /**
     * Enables keyboard events handling for the passed header element.
     * @param {?Element} header The header element.
     * @private
     */
    private enableKeyboardEventsHandling_;
    /**
     * Enables mouse events handling for the passed header element.
     * @param {?Element} header The header element.
     * @private
     */
    private enableMouseEventsHandling_;
    /**
     * KeyDown event handler for header element. Enter and space toggles expanded
     * state.
     *
     * @param {!EventsBrowserEvent} event KeyDown event.
     * @private
     */
    private onHeaderKeyDown_;
    /**
     * Click event handler for header element.
     *
     * @param {!EventsBrowserEvent} event Click event.
     * @private
     */
    private onHeaderClick_;
    /**
     * Dispatch an ACTION event whenever there is user interaction with the header.
     * Please note that after the zippy state change is completed a TOGGLE event
     * will be dispatched. However, the TOGGLE event is dispatch on every toggle,
     * including programmatic call to `#toggle`.
     * @param {!EventsBrowserEvent} triggeringEvent
     * @private
     */
    private dispatchActionEvent_;
}
/**
 * Object representing a zippy toggle event.
 *
 * @extends {EventsEvent}
 * @final
 */
export class ZippyEvent extends EventsEvent {
    /**
     * Object representing a zippy toggle event.
     *
     * @param {string} type Event type.
     * @param {?Zippy} target Zippy widget initiating event.
     * @param {boolean} expanded Expanded state.
     * @param {!EventsBrowserEvent=} opt_triggeringEvent
     */
    constructor(type: string, target: Zippy | null, expanded: boolean, opt_triggeringEvent?: EventsBrowserEvent | undefined);
    /**
     * The expanded state.
     * @type {boolean}
     */
    expanded: boolean;
    /**
     * For ACTION events, the key or mouse event that triggered this event, if
     * there was one.
     * @type {?EventsBrowserEvent}
     */
    triggeringEvent: EventsBrowserEvent | null;
}
import { EventTarget as EventsEventTarget } from "../events/eventhandler.js";
import { Role } from "../a11y/aria/roles.js";
import { DomHelper } from "../dom/dom.js";
import { Event as EventsEvent } from "../events/event.js";
import { BrowserEvent as EventsBrowserEvent } from "../events/browserevent.js";
