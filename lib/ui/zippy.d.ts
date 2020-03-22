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
     * @param {Element|string|null} header Header element, either element
     *     reference, string id or null if no header exists.
     * @param {Element|string|function():Element=} opt_content Content element
     *     (if any), either element reference or string id.  If skipped, the caller
     *     should handle the TOGGLE event in its own way. If a function is passed,
     *     then if will be called to create the content element the first time the
     *     zippy is expanded.
     * @param {boolean=} opt_expanded Initial expanded/visibility state. If
     *     undefined, attempts to infer the state from the DOM. Setting visibility
     *     using one of the standard Soy templates guarantees correct inference.
     * @param {Element|string=} opt_expandedHeader Element to use as the header when
     *     the zippy is expanded.
     * @param {DomHelper=} opt_domHelper An optional DOM helper.
     * @param {Role<string>=} opt_role ARIA role, default TAB.
     */
    constructor(header: string | Element | null, opt_content?: string | Element | (() => Element) | undefined, opt_expanded?: boolean | undefined, opt_expandedHeader?: string | Element | undefined, opt_domHelper?: goog_dom.DomHelper | undefined, opt_role?: any);
    /**
     * Whether to listen for and handle mouse events; defaults to true.
     * @type {boolean}
     * @private
     */
    handleMouseEvents_: boolean;
    /**
     * Whether to listen for and handle key events; defaults to true.
     * @type {boolean}
     * @private
     */
    handleKeyEvents_: boolean;
    /**
     * DomHelper used to interact with the document, allowing components to be
     * created in a different window.
     * @type {!DomHelper}
     * @private
     */
    dom_: DomHelper;
    /**
     * Header element or null if no header exists.
     * @type {?Element}
     * @private
     */
    elHeader_: Element | null;
    /**
     * When present, the header to use when the zippy is expanded.
     * @type {?Element}
     * @private
     */
    elExpandedHeader_: Element | null;
    /**
     * Function that will create the content element, or false if there is no such
     * function.
     * @type {?function():Element}
   * @suppress{checkTypes}
     * @private
     */
    lazyCreateFunc_: (() => Element) | null;
    /**
     * ARIA role.
     * @type {Role<string>}
     * @private
     */
     role_: Role;
    /**
     * Content element.
     * @type {?Element}
     * @private
     */
    elContent_: Element | null;
    /**
     * Expanded state.
     * @type {boolean}
     * @private
     */
    expanded_: boolean;
    /**
     * A keyboard events handler. If there are two headers it is shared for both.
     * @type {EventHandler<!Zippy>}
     * @private
     */
    keyboardEventHandler_: EventHandler<Zippy>;
    /**
     * The keyhandler used for listening on most key events. This takes care of
     * abstracting away some of the browser differences.
     * @private {!KeyHandler}
     */
    keyHandler_: KeyHandler;
    /**
     * A mouse events handler. If there are two headers it is shared for both.
     * @type {EventHandler<!Zippy>}
     * @private
     */
    mouseEventHandler_: EventHandler<Zippy>;
    /**
     * @return {?Role} The ARIA role to be applied to Zippy element.
     */
    getAriaRole(): string | null;
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
    setExpandedInternal(expanded: boolean): void;
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
    updateHeaderClassName(expanded: boolean): void;
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
    enableKeyboardEventsHandling_(header: Element | null): void;
    /**
     * Enables mouse events handling for the passed header element.
     * @param {?Element} header The header element.
     * @private
     */
    enableMouseEventsHandling_(header: Element | null): void;
    /**
     * KeyDown event handler for header element. Enter and space toggles expanded
     * state.
     *
     * @param {!EventsBrowserEvent} event KeyDown event.
     * @private
     */
    onHeaderKeyDown_(event: EventsBrowserEvent): void;
    /**
     * Click event handler for header element.
     *
     * @param {!EventsBrowserEvent} event Click event.
     * @private
     */
    onHeaderClick_(event: EventsBrowserEvent): void;
    /**
     * Dispatch an ACTION event whenever there is user interaction with the header.
     * Please note that after the zippy state change is completed a TOGGLE event
     * will be dispatched. However, the TOGGLE event is dispatch on every toggle,
     * including programmatic call to `#toggle`.
     * @param {!EventsBrowserEvent} triggeringEvent
     * @private
     */
    dispatchActionEvent_(triggeringEvent: EventsBrowserEvent): void;
    actualEventTarget_: Zippy;
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
import { DomHelper } from "../dom/dom.js";
import { Role } from "../a11y/aria/roles.js";
import { EventHandler } from "../events/eventhandler.js";
import { KeyHandler } from "../events/keyhandler.js";
import { BrowserEvent as EventsBrowserEvent } from "../events/browserevent.js";
import * as goog_dom from "../dom/dom.js";
import { Event as EventsEvent } from "../events/event.js";
