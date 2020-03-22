/**
 * @fileoverview Class for showing simple modal popup.
 */
/**
 * Base class for modal popup UI components. This can also be used as
 * a standalone component to render a modal popup with an empty div.
 *
 * WARNING: ModalPopup is only guaranteed to work when it is rendered
 * directly in the 'body' element.
 *
 * The Html structure of the modal popup is:
 * <pre>
 *  Element         Function              Class-name, goog-modalpopup = default
 * ----------------------------------------------------------------------------
 * - iframe         Iframe mask           goog-modalpopup-bg
 * - div            Background mask       goog-modalpopup-bg
 * - div            Modal popup area      goog-modalpopup
 * - span           Tab catcher
 * </pre>
 *     issue by using an iframe instead of a div for bg element.
 *     Component} for semantics.
 * @extends {Component}
 */
export class ModalPopup extends Component {
    /**
     * Base class for modal popup UI components. This can also be used as
     * a standalone component to render a modal popup with an empty div.
     *
     * WARNING: ModalPopup is only guaranteed to work when it is rendered
     * directly in the 'body' element.
     *
     * The Html structure of the modal popup is:
     * <pre>
     *  Element         Function              Class-name, goog-modalpopup = default
     * ----------------------------------------------------------------------------
     * - iframe         Iframe mask           goog-modalpopup-bg
     * - div            Background mask       goog-modalpopup-bg
     * - div            Modal popup area      goog-modalpopup
     * - span           Tab catcher
     * </pre>
     * @param {boolean=} opt_useIframeMask Work around windowed controls z-index
     *     issue by using an iframe instead of a div for bg element.
     * @param {DomHelper=} opt_domHelper Optional DOM helper; see {@link
     *     Component} for semantics.
     */
    constructor(opt_useIframeMask?: boolean | undefined, opt_domHelper?: googdom.DomHelper | undefined);
    /**
     * Focus handler. It will be initialized in enterDocument.
     * @type {?FocusHandler}
     * @private
     */
    focusHandler_: FocusHandler | null;
    /**
     * Whether the modal popup is visible.
     * @type {boolean}
     * @private
     */
    visible_: boolean;
    /**
     * Element for the background which obscures the UI and blocks events.
     * @type {Element|null}
     * @private
     */
    bgEl_: Element | null;
    /**
     * Iframe element that is only used for IE as a workaround to keep select-type
     * elements from burning through background.
     * @type {Element|null}
     * @private
     */
    bgIframeEl_: Element | null;
    /**
     * Element used to catch focus and prevent the user from tabbing out
     * of the popup.
     * @type {Element|null}
     * @private
     */
    tabCatcherElement_: Element | null;
    /**
     * Whether the modal popup is in the process of wrapping focus from the top of
     * the popup to the last tabbable element.
     * @type {boolean}
     * @private
     */
    backwardTabWrapInProgress_: boolean;
    /**
     * Transition to show the popup.
     * @type {?Transition}
     * @private
     */
    popupShowTransition_: Transition | null;
    /**
     * Transition to hide the popup.
     * @type {?Transition}
     * @private
     */
    popupHideTransition_: Transition | null;
    /**
     * Transition to show the background.
     * @type {?Transition}
     * @private
     */
    bgShowTransition_: Transition | null;
    /**
     * Transition to hide the background.
     * @type {?Transition}
     * @private
     */
    bgHideTransition_: Transition | null;
    /**
     * Helper object to control aria visibility of the rest of the page.
     * @type {?ModalAriaVisibilityHelper}
     * @private
     */
    modalAriaVisibilityHelper_: ModalAriaVisibilityHelper | null;
    /**
     * Whether the modal popup should use an iframe as the background
     * element to work around z-order issues.
     * @type {boolean}
     * @private
     */
    useIframeMask_: boolean;
    /**
     * The element that had focus before the popup was displayed.
     * @type {Element|null}
     * @private
     */
    lastFocus_: Element | null;
    /**
     * The animation task that resizes the background, scheduled to run in the
     * next animation frame.
     * @type {function(...?)}
     * @private
     */
    resizeBackgroundTask_: () => void;
    /**
     * @return {string} Base CSS class for this component.
     * @protected
     */
    getCssClass(): string;
    /**
     * Returns the background iframe mask element, if any.
     * @return {?Element} The background iframe mask element, may return
     *     null/undefined if the modal popup does not use iframe mask.
     */
    getBackgroundIframe(): Element | null;
    /**
     * Returns the background mask element.
     * @return {?Element} The background mask element.
     */
    getBackgroundElement(): Element | null;
    /**
     * Creates and disposes of the DOM for background mask elements.
     * @private
     */
    manageBackgroundDom_(): void;
    /**
     * Creates the tab catcher element.
     * @private
     */
    createTabCatcher_(): void;
    /**
     * Allow a shift-tab from the top of the modal popup to the last tabbable
     * element by moving focus to the tab catcher. This should be called after
     * catching a wrapping shift-tab event and before allowing it to propagate, so
     * that focus will land on the last tabbable element before the tab catcher.
     * @protected
     */
    setupBackwardTabWrap(): void;
    /**
     * Resets the backward tab wrap flag.
     * @private
     */
    resetBackwardTabWrap_(): void;
    /**
     * Renders the background mask.
     * @private
     */
    renderBackground_(): void;
    /** @override */
    canDecorate(element: any): boolean;
    /** @override */
    decorateInternal(element: any): void;
    /**
     * Sets the visibility of the modal popup box and focus to the popup.
     * @param {boolean} visible Whether the modal popup should be visible.
     */
    setVisible(visible: boolean): void;
    /**
     * Sets aria-hidden on the rest of the page to restrict screen reader focus.
     * Top-level elements with an explicit aria-hidden state are not altered.
     * @param {boolean} hide Whether to hide or show the rest of the page.
     * @protected
     */
    setA11YDetectBackground(hide: boolean): void;
    /**
     * Sets the transitions to show and hide the popup and background.
     * @param {!Transition} popupShowTransition Transition to show the
     *     popup.
     * @param {!Transition} popupHideTransition Transition to hide the
     *     popup.
     * @param {!Transition} bgShowTransition Transition to show
     *     the background.
     * @param {!Transition} bgHideTransition Transition to hide
     *     the background.
     */
    setTransition(popupShowTransition: Transition, popupHideTransition: Transition, bgShowTransition: Transition, bgHideTransition: Transition): void;
    /**
     * Shows the popup.
     * @private
     */
    show_(): void;
    /**
     * Hides the popup.
     * @private
     */
    hide_(): void;
    /**
     * Attempts to return the focus back to the element that had it before the popup
     * was opened.
     * @private
     */
    returnFocus_(): void;
    /**
     * Shows or hides the popup element.
     * @param {boolean} visible Shows the popup element if true, hides if false.
     * @private
     */
    showPopupElement_(visible: boolean): void;
    /**
     * Called after the popup is shown. If there is a transition, this
     * will be called after the transition completed or stopped.
     * @protected
     */
    onShow(): void;
    /**
     * Called after the popup is hidden. If there is a transition, this
     * will be called after the transition completed or stopped.
     * @protected
     */
    onHide(): void;
    /**
     * @return {boolean} Whether the modal popup is visible.
     */
    isVisible(): boolean;
    /**
     * Focuses on the modal popup.
     */
    focus(): void;
    /**
     * Make the background element the size of the document.
     *
     * NOTE(user): We must hide the background element before measuring the
     * document, otherwise the size of the background will stop the document from
     * shrinking to fit a smaller window.  This does cause a slight flicker in Linux
     * browsers, but should not be a common scenario.
     * @private
     */
    resizeBackground_(): void;
    /**
     * Centers the modal popup in the viewport, taking scrolling into account.
     */
    reposition(): void;
    /**
     * Handles focus events.  Makes sure that if the user tabs past the
     * elements in the modal popup, the focus wraps back to the beginning, and that
     * if the user shift-tabs past the front of the modal popup, focus wraps around
     * to the end.
     * @param {?EventsBrowserEvent} e Browser's event object.
     * @protected
     */
    onFocus(e: EventsBrowserEvent | null): void;
    /**
     * Returns the magic tab catcher element used to detect when the user has
     * rolled focus off of the popup content.  It is automatically created during
     * the createDom method() and can be used by subclasses to implement custom
     * tab-loop behavior.
     * @return {?Element} The tab catcher element.
     * @protected
     */
    getTabCatcherElement(): Element | null;
    /**
     * Moves the focus to the modal popup.
     * @private
     */
    focusElement_(): void;
    actualEventTarget_: ModalPopup;
}
import { Component } from "./component.js";
import { FocusHandler } from "../events/focushandler.js";
import { Transition } from "../fx/transition.js";
import { ModalAriaVisibilityHelper } from "./modalariavisibilityhelper.js";
import { BrowserEvent as EventsBrowserEvent } from "../events/browserevent.js";
import * as googdom from "../dom/dom.js";
