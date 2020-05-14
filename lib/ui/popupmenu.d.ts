/**
 * @fileoverview A menu class for showing popups.  A single popup can be
 * attached to multiple anchor points.  The menu will try to reposition itself
 * if it goes outside the viewport.
 *
 * Decoration is the same as Menu except that the outer DIV can have a
 * 'for' property, which is the ID of the element which triggers the popup.
 *
 * Decorate Example:
 * <button id="dButton">Decorated Popup</button>
 * <div id="dMenu" for="dButton" class="goog-menu">
 *   <div class="goog-menuitem">A a</div>
 *   <div class="goog-menuitem">B b</div>
 *   <div class="goog-menuitem">C c</div>
 *   <div class="goog-menuitem">D d</div>
 *   <div class="goog-menuitem">E e</div>
 *   <div class="goog-menuitem">F f</div>
 * </div>
 *
 * TESTED=FireFox 2.0, IE6, Opera 9, Chrome.
 * TODO(user): Key handling is flakey in Opera and Chrome
 *
 * @see ../demos/popupmenu.html
 */
/**
 * A basic menu class.
 *     decorate the container; defaults to {@link MenuRenderer}.
 * @extends {Menu}
 */
export class PopupMenu extends Menu {
    /**
     * A basic menu class.
     * @param {?DomHelper=} opt_domHelper Optional DOM helper.
     * @param {?MenuRenderer=} opt_renderer Renderer used to render or
     *     decorate the container; defaults to {@link MenuRenderer}.
     */
    constructor(opt_domHelper?: (DomHelper | null) | undefined, opt_renderer?: (MenuRenderer | null) | undefined);
    /**
     * If true, then if the menu will toggle off if it is already visible.
     * @type {boolean}
     * @private
     */
    private toggleMode_;
    /**
     * If true, then the browser context menu will override the menu activation when
     * the shift key is held down.
     * @type {boolean}
     * @private
     */
    private shiftOverride_;
    /**
     * Time that the menu was last shown.
     * @type {number}
     * @private
     */
    private lastHide_;
    /**
     * Current element where the popup menu is anchored.
     * @type {Element|null}
     * @private
     */
    private currentAnchor_;
    /**
     * Map of attachment points for the menu.  Key -> Object
     * @type {!StructsMap}
     * @private
     */
    private targets_;
    /**
     * Attaches the menu to a new popup position and anchor element.  A menu can
     * only be attached to an element once, since attaching the same menu for
     * multiple positions doesn't make sense.
     *
     * @param {Element|null} element Element whose click event should trigger the menu.
     * @param {?Corner=} opt_targetCorner Corner of the target that
     *     the menu should be anchored to.
     * @param {Corner=} opt_menuCorner Corner of the menu that
     *     should be anchored.
     * @param {boolean=} opt_contextMenu Whether the menu should show on
     *     {@link EventsEventType.CONTEXTMENU} events, false if it should
     *     show on {@link EventsEventType.MOUSEDOWN} events. Default is
     *     MOUSEDOWN.
     * @param {?Box=} opt_margin Margin for the popup used in positioning
     *     algorithms.
     */
    attach(element: Element | null, opt_targetCorner?: (Corner | null) | undefined, opt_menuCorner?: Corner | undefined, opt_contextMenu?: boolean | undefined, opt_margin?: (Box | null) | undefined): void;
    /**
     * Handles keyboard actions on the PopupMenu, according to
     * http://www.w3.org/WAI/PF/aria-practices/#menubutton.
     *
     * <p>If the ESC key is pressed, the menu is hidden (which is handled by
     * this.onAction_), and the focus is returned to the element whose click event
     * triggered opening of the menu.
     *
     * <p>If the SPACE or ENTER keys are pressed, the highlighted menu item's
     * listeners are fired.
     *
     * @param {?Element} element Element whose click event triggered the menu.
     * @param {!EventsBrowserEvent} e The key down event.
     * @private
     */
    private onMenuKeyboardAction_;
    /**
     * Creates an object describing how the popup menu should be attached to the
     * anchoring element based on the given parameters. The created object is
     * stored, keyed by `element` and is retrievable later by invoking
     * {@link #getAttachTarget(element)} at a later point.
     *
     * Subclass may add more properties to the returned object, as needed.
     *
     * @param {Element|null} element Element whose click event should trigger the menu.
     * @param {?Corner=} opt_targetCorner Corner of the target that
     *     the menu should be anchored to.
     * @param {?Corner=} opt_menuCorner Corner of the menu that
     *     should be anchored.
     * @param {boolean=} opt_contextMenu Whether the menu should show on
     *     {@link EventsEventType.CONTEXTMENU} events, false if it should
     *     show on {@link EventsEventType.MOUSEDOWN} events. Default is
     *     MOUSEDOWN.
     * @param {?Box=} opt_margin Margin for the popup used in positioning
     *     algorithms.
     *
     * @return {?Object} An object that describes how the popup menu should be
     *     attached to the anchoring element.
     *
     * @protected
     */
    protected createAttachTarget(element: Element | null, opt_targetCorner?: (Corner | null) | undefined, opt_menuCorner?: (Corner | null) | undefined, opt_contextMenu?: boolean | undefined, opt_margin?: (Box | null) | undefined): any | null;
    /**
     * Returns the object describing how the popup menu should be attach to given
     * element or `null`. The object is created and the association is formed
     * when {@link #attach} is invoked.
     *
     * @param {Element|null} element DOM element.
     * @return {?Object} The object created when {@link attach} is invoked on
     *     `element`. Returns `null` if the element does not trigger
     *     the menu (i.e. {@link attach} has never been invoked on
     *     `element`).
     * @protected
     */
    protected getAttachTarget(element: Element | null): any | null;
    /**
     * @param {Element|null} element Any DOM element.
     * @return {boolean} Whether clicking on the given element will trigger the
     *     menu.
     *
     * @protected
     */
    protected isAttachTarget(element: Element | null): boolean;
    /**
     * @return {Element|null} The current element where the popup is anchored, if it's
     *     visible.
     */
    getAttachedElement(): Element | null;
    /**
     * Attaches two event listeners to a target. One with corresponding event type,
     * and one with the KEYDOWN event type for accessibility purposes.
     * @param {?Object} target The target to attach an event to.
     * @private
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    private attachEvent_;
    /**
     * Detaches all listeners
     */
    detachAll(): void;
    /**
     * Detaches a menu from a given element.
     * @param {Element|null} element Element whose click event should trigger the menu.
     */
    detach(element: Element | null): void;
    /**
     * Detaches an event listener to a target
     * @param {!Object} target The target to detach events from.
     * @private
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    private detachEvent_;
    /**
     * Sets whether the menu should toggle if it is already open.  For context
     * menus this should be false, for toolbar menus it makes more sense to be true.
     * @param {boolean} toggle The new toggle mode.
     */
    setToggleMode(toggle: boolean): void;
    /**
     * Sets whether the browser context menu will override the menu activation when
     * the shift key is held down.
     * @param {boolean} shiftOverride
     */
    setShiftOverride(shiftOverride: boolean): void;
    /**
     * Gets whether the menu is in toggle mode
     * @return {boolean} toggle.
     */
    getToggleMode(): boolean;
    /**
     * Gets whether the browser context menu will override the menu activation when
     * the shift key is held down.
     * @return {boolean}
     */
    getShiftOverride(): boolean;
    /**
     * Show the menu using given positioning object.
     * @param {?AbstractPosition} position The positioning
     *     instance.
     * @param {Corner=} opt_menuCorner The corner of the menu to be
     *     positioned.
     * @param {?Box=} opt_margin A margin specified in pixels.
     * @param {?Element=} opt_anchor The element which acts as visual anchor for
     *     this menu.
     */
    showWithPosition(position: AbstractPosition | null, opt_menuCorner?: Corner | undefined, opt_margin?: (Box | null) | undefined, opt_anchor?: (Element | null) | undefined): void;
    /**
     * Show the menu at a given attached target.
     * @param {!Object} target Popup target.
     * @param {number} x The client-X associated with the show event.
     * @param {number} y The client-Y associated with the show event.
     * @protected
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    protected showMenu(target: any, x: number, y: number): void;
    /**
     * Shows the menu immediately at the given client coordinates.
     * @param {number} x The client-X associated with the show event.
     * @param {number} y The client-Y associated with the show event.
     * @param {Corner=} opt_menuCorner Corner of the menu that
     *     should be anchored.
     */
    showAt(x: number, y: number, opt_menuCorner?: Corner | undefined): void;
    /**
     * Shows the menu immediately attached to the given element
     * @param {Element|null} element The element to show at.
     * @param {?Corner} targetCorner The corner of the target to
     *     anchor to.
     * @param {Corner=} opt_menuCorner Corner of the menu that
     *     should be anchored.
     */
    showAtElement(element: Element | null, targetCorner: Corner | null, opt_menuCorner?: Corner | undefined): void;
    /**
     * Hides the menu.
     */
    hide(): void;
    /**
     * Returns whether the menu is currently visible or was visible within about
     * 150 ms ago.  This stops the menu toggling back on if the toggleMode == false.
     * @return {boolean} Whether the popup is currently visible or was visible
     *     within about 150 ms ago.
     */
    isOrWasRecentlyVisible(): boolean;
    /**
     * Used to stop the menu toggling back on if the toggleMode == false.
     * @return {boolean} Whether the menu was recently hidden.
     * @protected
     */
    protected wasRecentlyHidden(): boolean;
    /**
     * Dismiss the popup menu when an action fires.
     * @param {?EventsEvent=} opt_e The optional event.
     * @private
     */
    private onAction_;
    /**
     * Handles a browser click event on one of the popup targets.
     * @param {?EventsBrowserEvent} e The browser event.
     * @private
     */
    private onTargetClick_;
    /**
     * Handles a KEYDOWN browser event on one of the popup targets.
     * @param {!EventsBrowserEvent} e The browser event.
     * @private
     */
    private onTargetKeyboardAction_;
    /**
     * Handles a browser event on one of the popup targets.
     * @param {?EventsBrowserEvent} e The browser event.
     * @private
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    private onTargetActivation_;
    /**
     * Handles click events that propagate to the document.
     * @param {!EventsBrowserEvent} e The browser event.
     * @protected
     */
    protected onDocClick(e: EventsBrowserEvent): void;
}
import { Menu } from "./menu.js";
import { Corner } from "../positioning/positioning.js";
import { Box } from "../math/box.js";
import { AbstractPosition } from "../positioning/abstractposition.js";
import { BrowserEvent as EventsBrowserEvent } from "../events/browserevent.js";
import { DomHelper } from "../dom/dom.js";
import { MenuRenderer } from "./menu.js";
