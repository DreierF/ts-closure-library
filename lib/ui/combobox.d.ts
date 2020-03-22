/**
 * @fileoverview A combo box control that allows user input with
 * auto-suggestion from a limited set of options.
 *
 * @see ../demos/combobox.html
 */
/**
 * A ComboBox control.
 *     This menu is disposed of by this control.
 *     This label input is disposed of by this control.
 * @extends {Component}
 */
export class ComboBox extends Component {
    /**
     * A ComboBox control.
     * @param {DomHelper=} opt_domHelper Optional DOM helper.
     * @param {Menu=} opt_menu Optional menu component.
     *     This menu is disposed of by this control.
     * @param {LabelInput=} opt_labelInput Optional label input.
     *     This label input is disposed of by this control.
     */
    constructor(opt_domHelper?: googdom.DomHelper | undefined, opt_menu?: Menu | undefined, opt_labelInput?: LabelInput | undefined);
    /**
     * A logger to help debugging of combo box behavior.
     * @type {?LogLogger}
     * @private
     */
    logger_: DebugLogger | null;
    /**
     * Keyboard event handler to manage key events dispatched by the input element.
     * @type {?KeyHandler}
     * @private
     */
    keyHandler_: KeyHandler | null;
    /**
     * Input handler to take care of firing events when the user inputs text in
     * the input.
     * @type {?InputHandler}
     * @private
     */
    inputHandler_: InputHandler | null;
    /**
     * The last input token.
     * @type {?string}
     * @private
     */
    lastToken_: string | null;
    /**
     * The cached visible count.
     * @type {number}
     * @private
     */
    visibleCount_: number;
    /**
     * The input element.
     * @type {Element|null}
     * @private
     */
    input_: Element | null;
    /**
     * The match function.  The first argument for the match function will be
     * a MenuItem's caption and the second will be the token to evaluate.
     * @type {?Function}
     * @private
     */
    matchFunction_: Function | null;
    /**
     * Element used as the combo boxes button.
     * @type {Element|null}
     * @private
     */
    button_: Element | null;
    /**
     * Default text content for the input box when it is unchanged and unfocussed.
     * @type {string}
     * @private
     */
    defaultText_: string;
    /**
     * Name for the input box created
     * @type {string}
     * @private
     */
    fieldName_: string;
    /**
     * Timer identifier for delaying the dismissal of the combo menu.
     * @type {?number}
     * @private
     */
    dismissTimer_: number | null;
    /**
     * True if the unicode inverted triangle should be displayed in the dropdown
     * button. Defaults to false.
     * @type {boolean} useDropdownArrow
     * @private
     */
    useDropdownArrow_: boolean;
    /**
     * A LabelInput control that manages the focus/blur state of the input box.
     * @type {?LabelInput}
     * @private
     */
    labelInput_: LabelInput | null;
    /**
     * Whether the combo box is enabled.
     * @type {boolean}
     * @private
     */
    enabled_: boolean;
    /**
     * Drop down menu for the combo box.  Will be created at construction time.
     * @type {?Menu}
     * @private
     */
    menu_: Menu | null;
    /**
     * Enables/Disables the combo box.
     * @param {boolean} enabled Whether to enable (true) or disable (false) the
     *     combo box.
     */
    setEnabled(enabled: boolean): void;
    /**
     * @return {boolean} Whether the menu item is enabled.
     */
    isEnabled(): boolean;
    /**
     * Combo box currently can't decorate elements.
     * @return {boolean} The value false.
     * @override
     */
    canDecorate(): boolean;
    /**
     * Dismisses the menu and resets the value of the edit field.
     */
    dismiss(): void;
    /**
     * Adds a new menu item at the end of the menu.
     * @param {?MenuItem} item Menu item to add to the menu.
     */
    addItem(item: MenuItem | null): void;
    /**
     * Adds a new menu item at a specific index in the menu.
     * @param {?MenuItem} item Menu item to add to the menu.
     * @param {number} n Index at which to insert the menu item.
     */
    addItemAt(item: MenuItem | null, n: number): void;
    /**
     * Removes an item from the menu and disposes it.
     * @param {?MenuItem} item The menu item to remove.
     */
    removeItem(item: MenuItem | null): void;
    /**
     * Remove all of the items from the ComboBox menu
     */
    removeAllItems(): void;
    /**
     * Removes a menu item at a given index in the menu.
     * @param {number} n Index of item.
     */
    removeItemAt(n: number): void;
    /**
     * Returns a reference to the menu item at a given index.
     * @param {number} n Index of menu item.
     * @return {MenuItem?} Reference to the menu item.
     */
    getItemAt(n: number): MenuItem | null;
    /**
     * Returns the number of items in the list, including non-visible items,
     * such as separators.
     * @return {number} Number of items in the menu for this combobox.
     */
    getItemCount(): number;
    /**
     * @return {?Menu} The menu that pops up.
     */
    getMenu(): Menu | null;
    /**
     * @return {?Element} The input element.
     */
    getInputElement(): Element | null;
    /**
     * @return {?LabelInput} A LabelInput control that manages the
     *     focus/blur state of the input box.
     */
    getLabelInput(): LabelInput | null;
    /**
     * @return {number} The number of visible items in the menu.
     * @private
     */
    getNumberOfVisibleItems_(): number;
    /**
     * Sets the match function to be used when filtering the combo box menu.
     * @param {?Function} matchFunction The match function to be used when filtering
     *     the combo box menu.
     */
    setMatchFunction(matchFunction: Function | null): void;
    /**
     * @return {?Function} The match function for the combox box.
     */
    getMatchFunction(): Function | null;
    /**
     * Sets the default text for the combo box.
     * @param {string} text The default text for the combo box.
     */
    setDefaultText(text: string): void;
    /**
     * @return {string} text The default text for the combox box.
     */
    getDefaultText(): string;
    /**
     * Sets the field name for the combo box.
     * @param {string} fieldName The field name for the combo box.
     */
    setFieldName(fieldName: string): void;
    /**
     * @return {string} The field name for the combo box.
     */
    getFieldName(): string;
    /**
     * Set to true if a unicode inverted triangle should be displayed in the
     * dropdown button.
     * This option defaults to false for backwards compatibility.
     * @param {boolean} useDropdownArrow True to use the dropdown arrow.
     */
    setUseDropdownArrow(useDropdownArrow: boolean): void;
    /**
     * Sets the current value of the combo box.
     * @param {string} value The new value.
     */
    setValue(value: string): void;
    /**
     * @return {string} The current value of the combo box.
     */
    getValue(): string;
    /**
     * @return {string} HTML escaped token.
     */
    getToken(): string;
    /**
     * @return {string} The token for the current cursor position in the
     *     input box, when multi-input is disabled it will be the full input value.
     * @private
     */
    getTokenText_(): string;
    /**
     * @private
     */
    setupMenu_(): void;
    /**
     * Shows the menu if it isn't already showing.  Also positions the menu
     * correctly, resets the menu item visibilities and highlights the relevant
     * item.
     * @param {boolean} showAll Whether to show all items, with the first matching
     *     item highlighted.
     * @private
     */
    maybeShowMenu_(showAll: boolean): void;
    /**
     * Positions the menu.
     * @protected
     */
    positionMenu(): void;
    /**
     * Show the menu and add an active class to the combo box's element.
     * @private
     */
    showMenu_(): void;
    /**
     * Hide the menu and remove the active class from the combo box's element.
     * @private
     */
    hideMenu_(): void;
    /**
     * Clears the dismiss timer if it's active.
     * @private
     */
    clearDismissTimer_(): void;
    /**
     * Event handler for when the combo box area has been clicked.
     * @param {?EventsBrowserEvent} e The browser event.
     * @private
     */
    onComboMouseDown_(e: EventsBrowserEvent | null): void;
    /**
     * Event handler for when the document is clicked.
     * @param {?EventsBrowserEvent} e The browser event.
     * @private
     */
    onDocClicked_(e: EventsBrowserEvent | null): void;
    /**
     * Handle the menu's select event.
     * @param {?EventsEvent} e The event.
     * @private
     */
    onMenuSelected_(e: EventsEvent | null): void;
    /**
     * Event handler for when the input box looses focus -- hide the menu
     * @param {?EventsBrowserEvent} e The browser event.
     * @private
     */
    onInputBlur_(e: EventsBrowserEvent | null): void;
    /**
     * Handles keyboard events from the input box.  Returns true if the combo box
     * was able to handle the event, false otherwise.
     * @param {?KeyEvent} e Key event to handle.
     * @return {boolean} Whether the event was handled by the combo box.
     * @protected
     * @suppress {visibility} performActionInternal
     */
    handleKeyEvent(e: KeyEvent | null): boolean;
    /**
     * Handles the content of the input box changing.
     * @param {?EventsEvent} e The INPUT event to handle.
     * @private
     */
    onInputEvent_(e: EventsEvent | null): void;
    /**
     * Handles the content of the input box changing, either because of user
     * interaction or programmatic changes.
     * @private
     */
    handleInputChange_(): void;
    /**
     * Loops through all menu items setting their visibility according to a token.
     * @param {string} token The token.
     * @private
     */
    setItemVisibilityFromToken_(token: string): void;
    /**
     * Highlights the first token that matches the given token.
     * @param {string} token The token.
     * @private
     */
    setItemHighlightFromToken_(token: string): void;
    /**
     * Returns true if the item has an isSticky method and the method returns true.
     * @param {?MenuItem} item The item.
     * @return {boolean} Whether the item has an isSticky method and the method
     *     returns true.
     * @private
     * @suppress {checkTypes}
     */
    isItemSticky_(item: MenuItem | null): boolean;
    actualEventTarget_: ComboBox;
}
export namespace ComboBox {
    export const BLUR_DISMISS_TIMER_MS: number;
}
/**
 * Class for combo box items.
 *     display as the content of the item (use to add icons or styling to
 *     menus).
 *     interactions.
 * @extends {MenuItem}
 */
export class ComboBoxItem extends MenuItem {
    /**
     * Class for combo box items.
     * @param {?ControlContent} content Text caption or DOM structure to
     *     display as the content of the item (use to add icons or styling to
     *     menus).
     * @param {*=} opt_data Identifying data for the menu item.
     * @param {DomHelper=} opt_domHelper Optional dom helper used for dom
     *     interactions.
     * @param {Ui_MenuItemRenderer=} opt_renderer Optional renderer.
     */
    constructor(content: any, opt_data?: any, opt_domHelper?: googdom.DomHelper | undefined, opt_renderer?: Ui_MenuItemRenderer | undefined);
    /**
     * Whether the menu item is sticky, non-sticky items will be hidden as the
     * user types.
     * @type {boolean}
     * @private
     */
    isSticky_: boolean;
    /**
     * Sets the menu item to be sticky or not sticky.
     * @param {boolean} sticky Whether the menu item should be sticky.
     */
    setSticky(sticky: boolean): void;
    /**
     * @return {boolean} Whether the menu item is sticky.
     */
    isSticky(): boolean;
    /**
     * Sets the format for a menu item based on a token, bolding the token.
     * @param {string} token The token.
     */
    setFormatFromToken(token: string): void;
    actualEventTarget_: ComboBoxItem;
}
import { Component } from "./component.js";
import { Logger as LogLogger } from "../log/log.js";
import { KeyHandler } from "../events/keyhandler.js";
import { InputHandler } from "../events/inputhandler.js";
import { LabelInput } from "./labelinput.js";
import { Menu } from "./menu.js";
import { MenuItem } from "./menu.js";
import { BrowserEvent as EventsBrowserEvent } from "../events/browserevent.js";
import { Event as EventsEvent } from "../events/event.js";
import { KeyEvent } from "../events/keyhandler.js";
import * as googdom from "../dom/dom.js";
import { MenuItemRenderer as Ui_MenuItemRenderer } from "./menuitemrenderer.js";
import {Logger as DebugLogger} from "../debug/logger";

