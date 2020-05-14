/**
 * Constants for event type fired by Popup
 */
export type EventType = string;
/**
 * Constants for type of Popup
 */
export type Type = string;
export namespace EventType {
    export const BEFORE_SHOW: string;
    export const SHOW: string;
    export const BEFORE_HIDE: string;
    export const HIDE: string;
}
/**
 * @fileoverview Definition of the PopupBase class.
 */
/**
 * The PopupBase class provides functionality for showing and hiding a generic
 * container element. It also provides the option for hiding the popup element
 * if the user clicks outside the popup or the popup loses focus.
 *
 * @extends {EventsEventTarget}
 */
export class PopupBase extends events.EventTarget {
    /**
     * The PopupBase class provides functionality for showing and hiding a generic
     * container element. It also provides the option for hiding the popup element
     * if the user clicks outside the popup or the popup loses focus.
     *
     * @param {?Element=} opt_element A DOM element for the popup.
     * @param {Type=} opt_type Type of popup.
     * @param {boolean=} opt_dontSetElement EDITED: Disables calling of setElement in the constructor.
     */
    constructor(opt_element?: (Element | null) | undefined, opt_type?: Type | undefined, opt_dontSetElement?: boolean | undefined);
    /**
     * The popup dom element that this Popup wraps.
     * @type {Element|null}
     * @private
     */
    private element_;
    /**
     * Whether the Popup dismisses itself it the user clicks outside of it or the
     * popup loses focus
     * @type {boolean}
     * @private
     */
    private autoHide_;
    /**
     * Mouse events without auto hide partner elements will not dismiss the popup.
     * @type {?Array<?Element>}
     * @private
     */
    private autoHidePartners_;
    /**
     * Clicks outside the popup but inside this element will cause the popup to
     * hide if autoHide_ is true. If this is null, then the entire document is used.
     * For example, you can use a body-size div so that clicks on the browser
     * scrollbar do not dismiss the popup.
     * @type {Element|null}
     * @private
     */
    private autoHideRegion_;
    /**
     * Whether the popup is currently being shown.
     * @type {boolean}
     * @private
     */
    private isVisible_;
    /**
     * Whether the popup should hide itself asynchrously. This was added because
     * there are cases where hiding the element in mouse down handler in IE can
     * cause textinputs to get into a bad state if the element that had focus is
     * hidden.
     * @type {boolean}
     * @private
     */
    private shouldHideAsync_;
    /**
     * The time when the popup was last shown.
     * @type {number}
     * @private
     */
    private lastShowTime_;
    /**
     * The time when the popup was last hidden.
     * @type {number}
     * @private
     */
    private lastHideTime_;
    /**
     * Whether to hide when the escape key is pressed.
     * @type {boolean}
     * @private
     */
    private hideOnEscape_;
    /**
     * Whether to enable cross-iframe dismissal.
     * @type {boolean}
     * @private
     */
    private enableCrossIframeDismissal_;
    /**
     * The type of popup
     * @type {?Type}
     * @private
     */
    private type_;
    /**
     * Transition to play on showing the popup.
     * @type {Transition|undefined}
     * @private
     */
    private showTransition_;
    /**
     * Transition to play on hiding the popup.
     * @type {Transition|undefined}
     * @private
     */
    private hideTransition_;
    /**
     * An event handler to manage the events easily
     * @type {EventHandler<!PopupBase>}
     * @private
     */
    private handler_;
    /**
     * @return {?Type} The type of popup this is.
     */
    getType(): Type | null;
    /**
     * Specifies the type of popup to use.
     *
     * @param {?Type} type Type of popup.
     */
    setType(type: Type | null): void;
    /**
     * Returns whether the popup should hide itself asynchronously using a timeout
     * instead of synchronously.
     * @return {boolean} Whether to hide async.
     */
    shouldHideAsync(): boolean;
    /**
     * Sets whether the popup should hide itself asynchronously using a timeout
     * instead of synchronously.
     * @param {boolean} b Whether to hide async.
     */
    setShouldHideAsync(b: boolean): void;
    /**
     * Returns the dom element that should be used for the popup.
     *
     * @return {?Element} The popup element.
     */
    getElement(): Element | null;
    /**
     * Specifies the dom element that should be used for the popup.
     *
     * @param {?Element} elt A DOM element for the popup.
     */
    setElement(elt: Element | null): void;
    /**
     * Returns whether the Popup dismisses itself when the user clicks outside of
     * it.
     * @return {boolean} Whether the Popup autohides on an external click.
     */
    getAutoHide(): boolean;
    /**
     * Sets whether the Popup dismisses itself when the user clicks outside of it.
     * @param {boolean} autoHide Whether to autohide on an external click.
     */
    setAutoHide(autoHide: boolean): void;
    /**
     * Mouse events that occur within an autoHide partner will not hide a popup
     * set to autoHide.
     * @param {!Element} partner The auto hide partner element.
     */
    addAutoHidePartner(partner: Element): void;
    /**
     * Removes a previously registered auto hide partner.
     * @param {!Element} partner The auto hide partner element.
     */
    removeAutoHidePartner(partner: Element): void;
    /**
     * @return {boolean} Whether the Popup autohides on the escape key.
     */
    getHideOnEscape(): boolean;
    /**
     * Sets whether the Popup dismisses itself on the escape key.
     * @param {boolean} hideOnEscape Whether to autohide on the escape key.
     */
    setHideOnEscape(hideOnEscape: boolean): void;
    /**
     * @return {boolean} Whether cross iframe dismissal is enabled.
     */
    getEnableCrossIframeDismissal(): boolean;
    /**
     * Sets whether clicks in other iframes should dismiss this popup.  In some
     * cases it should be disabled, because it can cause spurious
     * @param {boolean} enable Whether to enable cross iframe dismissal.
     */
    setEnableCrossIframeDismissal(enable: boolean): void;
    /**
     * Returns the region inside which the Popup dismisses itself when the user
     * clicks, or null if it's the entire document.
     * @return {?Element} The DOM element for autohide, or null if it hasn't been
     *     set.
     */
    getAutoHideRegion(): Element | null;
    /**
     * Sets the region inside which the Popup dismisses itself when the user
     * clicks.
     * @param {?Element} element The DOM element for autohide.
     */
    setAutoHideRegion(element: Element | null): void;
    /**
     * Sets transition animation on showing and hiding the popup.
     * @param {Transition=} opt_showTransition Transition to play on
     *     showing the popup.
     * @param {Transition=} opt_hideTransition Transition to play on
     *     hiding the popup.
     */
    setTransition(opt_showTransition?: Transition | undefined, opt_hideTransition?: Transition | undefined): void;
    /**
     * Returns the time when the popup was last shown.
     *
     * @return {number} time in ms since epoch when the popup was last shown, or
     * -1 if the popup was never shown.
     */
    getLastShowTime(): number;
    /**
     * Returns the time when the popup was last hidden.
     *
     * @return {number} time in ms since epoch when the popup was last hidden, or
     * -1 if the popup was never hidden or is currently showing.
     */
    getLastHideTime(): number;
    /**
     * Returns the event handler for the popup. All event listeners belonging to
     * this handler are removed when the tooltip is hidden. Therefore,
     * the recommended usage of this handler is to listen on events in
     * {@link #onShow}.
     * @return {EventHandler<T>} Event handler for this popup.
     * @protected
     * @this {T}
     * @template T
     */
    protected getHandler<T>(): events.EventHandler<T>;
    /**
     * Helper to throw exception if the popup is showing.
     * @private
     */
    private ensureNotVisible_;
    /**
     * Returns whether the popup is currently visible.
     *
     * @return {boolean} whether the popup is currently visible.
     */
    isVisible(): boolean;
    /**
     * Returns whether the popup is currently visible or was visible within about
     * 150 ms ago. This is used by clients to handle a very specific, but common,
     * popup scenario. The button that launches the popup should close the popup
     * on mouse down if the popup is already open. The problem is that the popup
     * closes itself during the capture phase of the mouse down and thus the button
     * thinks it's hidden and this should show it again. This method provides a
     * good heuristic for clients. Typically in their event handler they will have
     * code that is:
     *
     * if (menu.isOrWasRecentlyVisible()) {
     *   menu.setVisible(false);
     * } else {
     *   ... // code to position menu and initialize other state
     *   menu.setVisible(true);
     * }
     * @return {boolean} Whether the popup is currently visible or was visible
     *     within about 150 ms ago.
     */
    isOrWasRecentlyVisible(): boolean;
    /**
     * Sets whether the popup should be visible. After this method
     * returns, isVisible() will always return the new state, even if
     * there is a transition.
     *
     * @param {boolean} visible Desired visibility state.
     */
    setVisible(visible: boolean): void;
    /**
     * Repositions the popup according to the current state.
     * Should be overriden by subclases.
     */
    reposition(): void;
    /**
     * Does the work to show the popup.
     * @private
     */
    private show_;
    /**
     * Hides the popup. This call is idempotent.
     *
     * @param {?Node=} opt_target Target of the event causing the hide.
     * @return {boolean} Whether the popup was hidden and not cancelled.
     * @private
     */
    private hide_;
    /**
     * Continues hiding the popup. This is a continuation from hide_. It is
     * a separate method so that we can add a transition before hiding.
     * @param {?Node=} opt_target Target of the event causing the hide.
     * @private
     */
    private continueHidingPopup_;
    /**
     * Shows the popup element.
     * @protected
     */
    protected showPopupElement(): void;
    /**
     * Hides the popup element.
     * @protected
     */
    protected hidePopupElement(): void;
    /**
     * Hides the popup by moving it offscreen.
     *
     * @private
     */
    private moveOffscreen_;
    /**
     * Called before the popup is shown. Derived classes can override to hook this
     * event but should make sure to call the parent class method.
     *
     * @return {boolean} If anyone called preventDefault on the event object (or
     *     if any of the handlers returns false this will also return false.
     * @protected
     */
    protected onBeforeShow(): boolean;
    /**
     * Called after the popup is shown. Derived classes can override to hook this
     * event but should make sure to call the parent class method.
     * @protected
     */
    protected onShow(): void;
    /**
     * Called before the popup is hidden. Derived classes can override to hook this
     * event but should make sure to call the parent class method.
     *
     * @param {?Node=} opt_target Target of the event causing the hide.
     * @return {boolean} If anyone called preventDefault on the event object (or
     *     if any of the handlers returns false this will also return false.
     * @protected
     */
    protected onBeforeHide(opt_target?: (Node | null) | undefined): boolean;
    /**
     * Called after the popup is hidden. Derived classes can override to hook this
     * event but should make sure to call the parent class method.
     * @param {?Node=} opt_target Target of the event causing the hide.
     * @protected
     */
    protected onHide(opt_target?: (Node | null) | undefined): void;
    /**
     * Mouse down handler for the document on capture phase. Used to hide the
     * popup for auto-hide mode.
     *
     * @param {?EventsBrowserEvent} e The event object.
     * @private
     */
    private onDocumentMouseDown_;
    /**
     * Handles key-downs on the document to handle the escape key.
     *
     * @param {?EventsBrowserEvent} e The event object.
     * @private
     */
    private onDocumentKeyDown_;
    /**
     * Deactivate handler(IE) and blur handler (other browsers) for document.
     * Used to hide the popup for auto-hide mode.
     *
     * @param {?EventsBrowserEvent} e The event object.
     * @private
     */
    private onDocumentBlur_;
    /**
     * @param {?Node} element The element to inspect.
     * @return {boolean} Returns true if the given element is one of the auto hide
     *     partners or is a child of an auto hide partner.
     * @private
     */
    private isOrWithinAutoHidePartner_;
    /**
     * @param {?Node} element The element to inspect.
     * @return {boolean} Returns true if the element is contained within
     *     the autohide region. If unset, the autohide region is the entire
     *     entire document.
     * @private
     */
    private isWithinAutoHideRegion_;
    /**
     * @return {boolean} Whether the time since last show is less than the debounce
     *     delay.
     * @private
     */
    private shouldDebounce_;
}
export namespace PopupBase {
    export const DEBOUNCE_DELAY_MS: number;
}
export namespace Type {
    export const TOGGLE_DISPLAY: string;
    export const MOVE_OFFSCREEN: string;
}
import * as events from "../events/eventhandler.js";
import { Transition } from "../fx/transition.js";
import { EventHandler } from "../events/eventhandler.js";
