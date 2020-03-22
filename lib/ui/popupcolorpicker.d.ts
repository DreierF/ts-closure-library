/**
 * @fileoverview Popup Color Picker implementation.  This is intended to be
 * less general than ColorPicker and presents a default set of colors
 * that CCC apps currently use in their color pickers.
 *
 * @see ../demos/popupcolorpicker.html
 */
/**
 * Popup color picker widget.
 *
 *     for this popup.
 * @extends {Component}
 */
export class PopupColorPicker extends Component {
    /**
     * Popup color picker widget.
     *
     * @param {DomHelper=} opt_domHelper Optional DOM helper.
     * @param {ColorPicker=} opt_colorPicker Optional color picker to use
     *     for this popup.
     */
    constructor(opt_domHelper?: DomHelper | undefined, opt_colorPicker?: ColorPicker | undefined);
    /**
     * Whether the color picker is initialized.
     * @type {boolean}
     * @private
     */
    initialized_: boolean;
    /**
     * Instance of a color picker control.
     * @type {?ColorPicker}
     * @private
     */
    colorPicker_: ColorPicker | null;
    /**
     * Instance of UiPopup used to manage the behavior of the color picker.
     * @type {?UiPopup}
     * @private
     */
    popup_: UiPopup | null;
    /**
     * Corner of the popup which is pinned to the attaching element.
     * @type {?Corner}
     * @private
     */
    pinnedCorner_: Corner | null;
    /**
     * Corner of the attaching element where the popup shows.
     * @type {?Corner}
     * @private
     */
    popupCorner_: Corner | null;
    /**
     * Reference to the element that triggered the last popup.
     * @type {Element|null}
     * @private
     */
    lastTarget_: Element | null;
    /** @private
      * @type {boolean} */
    rememberSelection_: boolean;
    /**
     * Whether the color picker can move the focus to its key event target when it
     * is shown.  The default is true.  Setting to false can break keyboard
     * navigation, but this is needed for certain scenarios, for example the
     * toolbar menu in trogedit which can't have the selection changed.
     * @type {boolean}
     * @private
     */
    allowAutoFocus_: boolean;
    /**
     * Whether the color picker can accept focus.
     * @type {boolean}
     * @private
     */
    focusable_: boolean;
    /**
     * If true, then the colorpicker will toggle off if it is already visible.
     *
     * @type {boolean}
     * @private
     */
    toggleMode_: boolean;
    /**
     * If true, the colorpicker will appear on hover.
     * @type {boolean}
     * @private
     */
    showOnHover_: boolean;
    /**
     * @return {?ColorPicker} The color picker instance.
     */
    getColorPicker(): ColorPicker | null;
    /**
     * Returns whether the Popup dismisses itself when the user clicks outside of
     * it.
     * @return {boolean} Whether the Popup autohides on an external click.
     */
    getAutoHide(): boolean;
    /**
     * Sets whether the Popup dismisses itself when the user clicks outside of it -
     * must be called after the Popup has been created (in createDom()),
     * otherwise it does nothing.
     *
     * @param {boolean} autoHide Whether to autohide on an external click.
     */
    setAutoHide(autoHide: boolean): void;
    /**
     * Returns the region inside which the Popup dismisses itself when the user
     * clicks, or null if it was not set. Null indicates the entire document is
     * the autohide region.
     * @return {?Element} The DOM element for autohide, or null if it hasn't been
     *     set.
     */
    getAutoHideRegion(): Element | null;
    /**
     * Sets the region inside which the Popup dismisses itself when the user
     * clicks - must be called after the Popup has been created (in createDom()),
     * otherwise it does nothing.
     *
     * @param {?Element} element The DOM element for autohide.
     */
    setAutoHideRegion(element: Element | null): void;
    /**
     * Returns the {@link PopupBase} from this picker. Returns null if the
     * popup has not yet been created.
     *
     * NOTE: This should *ONLY* be called from tests. If called before createDom(),
     * this should return null.
     *
     * @return {PopupBase?} The popup or null if it hasn't been created.
     */
    getPopup(): PopupBase | null;
    /**
     * @return {?Element} The last element that triggered the popup.
     */
    getLastTarget(): Element | null;
    /**
     * Attaches the popup color picker to an element.
     * @param {?Element} element The element to attach to.
     */
    attach(element: Element | null): void;
    /**
     * Detatches the popup color picker from an element.
     * @param {?Element} element The element to detach from.
     */
    detach(element: Element | null): void;
    /**
     * Gets the color that is currently selected in this color picker.
     * @return {?string} The hex string of the color selected, or null if no
     *     color is selected.
     */
    getSelectedColor(): string | null;
    /**
     * Sets whether the color picker can accept focus.
     * @param {boolean} focusable True iff the color picker can accept focus.
     */
    setFocusable(focusable: boolean): void;
    /**
     * Sets whether the color picker can automatically move focus to its key event
     * target when it is set to visible.
     * @param {boolean} allow Whether to allow auto focus.
     */
    setAllowAutoFocus(allow: boolean): void;
    /**
     * @return {boolean} Whether the color picker can automatically move focus to
     *     its key event target when it is set to visible.
     */
    getAllowAutoFocus(): boolean;
    /**
     * Sets whether the color picker should toggle off if it is already open.
     * @param {boolean} toggle The new toggle mode.
     */
    setToggleMode(toggle: boolean): void;
    /**
     * Gets whether the colorpicker is in toggle mode
     * @return {boolean} toggle.
     */
    getToggleMode(): boolean;
    /**
     * Sets whether the picker remembers the last selected color between popups.
     *
     * @param {boolean} remember Whether to remember the selection.
     */
    setRememberSelection(remember: boolean): void;
    /**
     * @return {boolean} Whether the picker remembers the last selected color
     *     between popups.
     */
    getRememberSelection(): boolean;
    /**
     * Add an array of colors to the colors displayed by the color picker.
     * Does not add duplicated colors.
     * @param {Array<string>} colors The array of colors to be added.
     */
    addColors(colors: string[]): void;
    /**
     * Clear the colors displayed by the color picker.
     */
    clearColors(): void;
    /**
     * Set the pinned corner of the popup.
     * @param {?Corner} corner The corner of the popup which is
     *     pinned to the attaching element.
     */
    setPinnedCorner(corner: Corner | null): void;
    /**
     * Sets which corner of the attaching element this popup shows up.
     * @param {?Corner} corner The corner of the attaching element
     *     where to show the popup.
     */
    setPopupCorner(corner: Corner | null): void;
    /**
     * Sets whether the popup shows up on hover. By default, appears on click.
     * @param {boolean} showOnHover True if popup should appear on hover.
     */
    setShowOnHover(showOnHover: boolean): void;
    /**
     * Handles click events on the targets and shows the color picker.
     * @param {?EventsBrowserEvent} e The browser event.
     * @private
     */
    show_(e: EventsBrowserEvent | null): void;
    /**
     * Handles the color change event.
     * @param {?EventsEvent} e The event.
     * @private
     */
    onColorPicked_(e: EventsEvent | null): void;
    actualEventTarget_: PopupColorPicker;
}
import { Component } from "./component.js";
import { ColorPicker } from "./colorpicker.js";
import { Popup as UiPopup } from "./popup.js";
import { Corner } from "../positioning/positioning.js";
import { PopupBase } from "./popupbase.js";
import { BrowserEvent as EventsBrowserEvent } from "../events/browserevent.js";
import { Event as EventsEvent } from "../events/event.js";
import { DomHelper } from "../dom/dom.js";
