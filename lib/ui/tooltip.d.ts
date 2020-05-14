/**
 * Possible states for the tooltip to be in.
 */
export type State = number;
/**
 * Popup position implementation that positions the popup (the tooltip in this
 * case) based on the cursor position. It's positioned below the cursor to the
 * right if there's enough room to fit all of it inside the Viewport. Otherwise
 * it's displayed as far right as possible either above or below the element.
 *
 * Used to position tooltips triggered by the cursor.
 *
 * @extends {ViewportPosition}
 * @final
 */
export class CursorTooltipPosition extends ViewportPosition {
    /**
     * Popup position implementation that positions the popup (the tooltip in this
     * case) based on the cursor position. It's positioned below the cursor to the
     * right if there's enough room to fit all of it inside the Viewport. Otherwise
     * it's displayed as far right as possible either above or below the element.
     *
     * Used to position tooltips triggered by the cursor.
     *
     * @param {number|!Coordinate} arg1 Left position or coordinate.
     * @param {number=} opt_arg2 Top position.
     */
    constructor(arg1: number | Coordinate, opt_arg2?: number | undefined);
}
/**
 * Popup position implementation that positions the popup (the tooltip in this
 * case) based on the element position. It's positioned below the element to the
 * right if there's enough room to fit all of it inside the Viewport. Otherwise
 * it's displayed as far right as possible either above or below the element.
 *
 * Used to position tooltips triggered by focus changes.
 *
 * @extends {AnchoredPosition}
 */
export class ElementTooltipPosition extends AnchoredPosition {
    /**
     * Popup position implementation that positions the popup (the tooltip in this
     * case) based on the element position. It's positioned below the element to the
     * right if there's enough room to fit all of it inside the Viewport. Otherwise
     * it's displayed as far right as possible either above or below the element.
     *
     * Used to position tooltips triggered by focus changes.
     *
     * @param {?Element} element The element to anchor the popup at.
     */
    constructor(element: Element | null);
}
export namespace State {
    export const INACTIVE: number;
    export const WAITING_TO_SHOW: number;
    export const SHOWING: number;
    export const WAITING_TO_HIDE: number;
    export const UPDATING: number;
}
/**
 * @fileoverview Tooltip widget implementation.
 *
 * @see ../demos/tooltip.html
 */
/**
 * Tooltip widget. Can be attached to one or more elements and is shown, with a
 * slight delay, when the the cursor is over the element or the element gains
 * focus.
 *
 *     element reference or string id.
 * @extends {Popup}
 */
export class Tooltip extends Popup {
    /**
     * Tooltip widget. Can be attached to one or more elements and is shown, with a
     * slight delay, when the the cursor is over the element or the element gains
     * focus.
     *
     * @param {?Element|string=} opt_el Element to display tooltip for, either
     *     element reference or string id.
     * @param {?string=} opt_str Text message to display in tooltip.
     * @param {DomHelper=} opt_domHelper Optional DOM helper.
     */
    constructor(opt_el?: ((Element | string) | null) | undefined, opt_str?: (string | null) | undefined, opt_domHelper?: DomHelper | undefined);
    /**
     * Active element reference. Used by the delayed show functionality to keep
     * track of the element the mouse is over or the element with focus.
     * @type {Element|null}
     * @private
     */
    private activeEl_;
    /**
     * CSS class name for tooltip.
     *
     * @type {string}
     */
    className: string;
    /**
     * Delay in milliseconds since the last mouseover or mousemove before the
     * tooltip is displayed for an element.
     *
     * @type {number}
     * @private
     */
    private showDelayMs_;
    /**
     * Timer for when to show.
     *
     * @type {number|undefined}
     * @protected
     */
    protected showTimer: number | undefined;
    /**
     * Delay in milliseconds before tooltips are hidden.
     *
     * @type {number}
     * @private
     */
    private hideDelayMs_;
    /**
     * Timer for when to hide.
     *
     * @type {number|undefined}
     * @protected
     */
    protected hideTimer: number | undefined;
    /**
     * Element that triggered the tooltip.  Note that if a second element triggers
     * this tooltip, anchor becomes that second element, even if its show is
     * cancelled and the original tooltip survives.
     *
     * @type {?Element|undefined}
     * @protected
     */
    protected anchor: (Element | undefined) | null;
    /**
     * Whether the anchor has seen the cursor move or has received focus since the
     * tooltip was last shown. Used to ignore mouse over events triggered by view
     * changes and UI updates.
     * @type {boolean|undefined}
     * @private
     */
    private seenInteraction_;
    /**
     * Whether the cursor must have moved before the tooltip will be shown.
     * @type {boolean|undefined}
     * @private
     */
    private requireInteraction_;
    /**
     * If this tooltip's element contains another tooltip that becomes active, this
     * property identifies that tooltip so that we can check if this tooltip should
     * not be hidden because the nested tooltip is active.
     * @type {?Tooltip}
     * @private
     */
    private childTooltip_;
    /**
     * If this tooltip is inside another tooltip's element, then it may have
     * prevented that tooltip from hiding.  When this tooltip hides, we'll need
     * to check if the parent should be hidden as well.
     * @type {?Tooltip}
     * @private
     */
    private parentTooltip_;
    /**
     * Dom Helper
     * @type {?DomHelper}
     * @private
     */
    private dom_;
    /**
     * Cursor position relative to the page.
     * @type {!Coordinate}
     * @protected
     */
    protected cursorPosition: Coordinate;
    /**
     * Elements this widget is attached to.
     * @type {?StructsSet}
     * @private
     */
    private elements_;
    /**
     * Keyboard focus event handler for elements inside the tooltip.
     * @private {?FocusHandler}
     */
    private tooltipFocusHandler_;
    /**
     * Returns the dom helper that is being used on this component.
     * @return {?DomHelper} The dom helper used on this component.
     */
    getDomHelper(): DomHelper | null;
    /**
     * @return {?Tooltip} Active tooltip in a child element, or null if none.
     * @protected
     */
    protected getChildTooltip(): Tooltip | null;
    /**
     * Attach to element. Tooltip will be displayed when the cursor is over the
     * element or when the element has been active for a few milliseconds.
     *
     * @param {?Element|string} el Element to display tooltip for, either element
     *                            reference or string id.
     */
    attach(el: (Element | string) | null): void;
    /**
     * Detach from element(s).
     *
     * @param {?Element|string=} opt_el Element to detach from, either element
     *                                reference or string id. If no element is
     *                                specified all are detached.
     */
    detach(opt_el?: ((Element | string) | null) | undefined): void;
    /**
     * Detach from element.
     *
     * @param {?Element} el Element to detach from.
     * @private
     */
    private detachElement_;
    /**
     * Sets delay in milliseconds before tooltip is displayed for an element.
     *
     * @param {number} delay The delay in milliseconds.
     */
    setShowDelayMs(delay: number): void;
    /**
     * @return {number} The delay in milliseconds before tooltip is displayed for an
     *     element.
     */
    getShowDelayMs(): number;
    /**
     * Sets delay in milliseconds before tooltip is hidden once the cursor leavs
     * the element.
     *
     * @param {number} delay The delay in milliseconds.
     */
    setHideDelayMs(delay: number): void;
    /**
     * @return {number} The delay in milliseconds before tooltip is hidden once the
     *     cursor leaves the element.
     */
    getHideDelayMs(): number;
    /**
     * Sets tooltip message as plain text.
     *
     * @param {string} str Text message to display in tooltip.
     */
    setText(str: string): void;
    /**
     * Sets tooltip message as HTML markup.
     * @param {!SafeHtml} html HTML message to display in tooltip.
     */
    setSafeHtml(html: SafeHtml): void;
    /**
     * Handler for keyboard focus events of elements inside the tooltip's content
     * element. This should only be invoked if this.getElement() != null.
     * @private
     */
    private registerContentFocusEvents_;
    /**
     * @return {string} The tooltip message as plain text.
     */
    getText(): string;
    /**
     * @return {string} The tooltip message as HTML as plain string.
     */
    getHtml(): string;
    /**
     * @return {?State} Current state of tooltip.
     */
    getState(): State | null;
    /**
     * Sets whether tooltip requires the mouse to have moved or the anchor receive
     * focus before the tooltip will be shown.
     * @param {boolean} requireInteraction Whether tooltip should require some user
     *     interaction before showing tooltip.
     */
    setRequireInteraction(requireInteraction: boolean): void;
    /**
     * Returns true if the coord is in the tooltip.
     * @param {?Coordinate} coord Coordinate being tested.
     * @return {boolean} Whether the coord is in the tooltip.
     */
    isCoordinateInTooltip(coord: Coordinate | null): boolean;
    /**
     * Called by timer from mouse over handler. Shows tooltip if cursor is still
     * over the same element.
     *
     * @param {?Element} el Element to show tooltip for.
     * @param {AbstractPosition=} opt_pos Position to display popup
     *     at.
     */
    maybeShow(el: Element | null, opt_pos?: AbstractPosition | undefined): void;
    /**
     * @return {?StructsSet} Elements this widget is attached to.
     * @protected
     */
    protected getElements(): StructsSet | null;
    /**
     * @return {?Element} Active element reference.
     */
    getActiveElement(): Element | null;
    /**
     * @param {?Element} activeEl Active element reference.
     * @protected
     */
    protected setActiveElement(activeEl: Element | null): void;
    /**
     * Shows tooltip for a specific element.
     *
     * @param {?Element} el Element to show tooltip for.
     * @param {AbstractPosition=} opt_pos Position to display popup
     *     at.
     */
    showForElement(el: Element | null, opt_pos?: AbstractPosition | undefined): void;
    /**
     * Sets tooltip position and shows it.
     *
     * @param {?Element} el Element to show tooltip for.
     * @param {AbstractPosition=} opt_pos Position to display popup
     *     at.
     * @private
     */
    private positionAndShow_;
    /**
     * Called by timer from mouse out handler. Hides tooltip if cursor is still
     * outside element and tooltip, or if a child of tooltip has the focus.
     * @param {?Element|undefined} el Tooltip's anchor when hide timer was started.
     */
    maybeHide(el: (Element | undefined) | null): void;
    /**
     * @return {boolean} Whether tooltip element contains an active child tooltip,
     *     and should thus not be hidden.  When the child tooltip is hidden, it
     *     will check if the parent should be hidden, too.
     * @protected
     */
    protected hasActiveChild(): boolean;
    /**
     * Saves the current mouse cursor position to `this.cursorPosition`.
     * @param {?EventsBrowserEvent} event MOUSEOVER or MOUSEMOVE event.
     * @private
     */
    private saveCursorPosition_;
    /**
     * Handler for mouse over events.
     *
     * @param {?EventsBrowserEvent} event Event object.
     * @protected
     */
    protected handleMouseOver(event: EventsBrowserEvent | null): void;
    /**
     * Find anchor containing the given element, if any.
     *
     * @param {?Element} el Element that triggered event.
     * @return {?Element} Element in elements_ array that contains given element,
     *     or null if not found.
     * @protected
     */
    protected getAnchorFromElement(el: Element | null): Element | null;
    /**
     * Handler for mouse move events.
     *
     * @param {?EventsBrowserEvent} event MOUSEMOVE event.
     * @protected
     */
    protected handleMouseMove(event: EventsBrowserEvent | null): void;
    /**
     * Handler for focus events.
     *
     * @param {?EventsBrowserEvent} event Event object.
     * @protected
     */
    protected handleFocus(event: EventsBrowserEvent | null): void;
    /**
     * Return a Position instance for repositioning the tooltip. Override in
     * subclasses to customize the way repositioning is done.
     *
     * @param {Tooltip.Activation} activationType Information about what
     *    kind of event caused the popup to be shown.
     * @return {!AbstractPosition} The position object used
     *    to position the tooltip.
     * @protected
     */
    protected getPositioningStrategy(activationType: Tooltip.Activation): AbstractPosition;
    /**
     * Looks for an active tooltip whose element contains this tooltip's anchor.
     * This allows us to prevent hides until they are really necessary.
     *
     * @private
     */
    private checkForParentTooltip_;
    /**
     * Handler for mouse out and blur events.
     *
     * @param {?EventsBrowserEvent} event Event object.
     * @protected
     */
    protected handleMouseOutAndBlur(event: EventsBrowserEvent | null): void;
    /**
     * Handler for mouse over events for the tooltip element.
     *
     * @param {?EventsBrowserEvent} event Event object.
     * @protected
     */
    protected handleTooltipMouseOver(event: EventsBrowserEvent | null): void;
    /**
     * Handler for mouse out events for the tooltip element.
     *
     * @param {?EventsBrowserEvent} event Event object.
     * @protected
     */
    protected handleTooltipMouseOut(event: EventsBrowserEvent | null): void;
    /**
     * Helper method, starts timer that calls maybeShow. Parameters are passed to
     * the maybeShow method.
     *
     * @param {?Element} el Element to show tooltip for.
     * @param {AbstractPosition=} opt_pos Position to display popup
     *     at.
     * @protected
     */
    protected startShowTimer(el: Element | null, opt_pos?: AbstractPosition | undefined): void;
    /**
     * Helper method called to clear the show timer.
     *
     * @protected
     */
    protected clearShowTimer(): void;
    /**
     * Helper method called to start the close timer.
     * @protected
     */
    protected startHideTimer(): void;
    /**
     * Helper method called to clear the close timer.
     * @protected
     */
    protected clearHideTimer(): void;
}
export namespace Tooltip {
    export const activeInstances_: Array<Tooltip>;
    export namespace Activation {
        export const CURSOR: number;
        export const FOCUS: number;
    }
    /**
     * Popup activation types. Used to select a positioning strategy.
     */
    export type Activation = number;
}
import { ViewportPosition } from "../positioning/viewportposition.js";
import { Coordinate } from "../math/coordinate.js";
import { AnchoredPosition } from "../positioning/anchoredposition.js";
import { Popup } from "./popup.js";
import { DomHelper } from "../dom/dom.js";
import { SafeHtml } from "../html/safehtml.js";
import { AbstractPosition } from "../positioning/abstractposition.js";
import { Set as StructsSet } from "../structs/set.js";
import { BrowserEvent as EventsBrowserEvent } from "../events/browserevent.js";
