/**
 * @fileoverview A base menu class that supports key and mouse events. The menu
 * can be bound to an existing HTML structure or can generate its own DOM.
 *
 * To decorate, the menu should be bound to an element containing children
 * with the classname 'goog-menuitem'.  HRs will be classed as separators.
 *
 * Decorate Example:
 * <div id="menu" class="goog-menu" tabIndex="0">
 *   <div class="goog-menuitem">Google</div>
 *   <div class="goog-menuitem">Yahoo</div>
 *   <div class="goog-menuitem">MSN</div>
 *   <hr>
 *   <div class="goog-menuitem">New...</div>
 * </div>
 * <script>
 *
 * var menu = new Menu();
 * menu.decorate(googdom.getElement('menu'));
 *
 * TESTED=FireFox 2.0, IE6, Opera 9, Chrome.
 * TODO(user): Key handling is flaky in Opera and Chrome
 * TODO(user): Rename all references of "item" to child since menu is
 * essentially very generic and could, in theory, host a date or color picker.
 *
 * @see ../demos/menu.html
 * @see ../demos/menus.html
 */
/**
 * A basic menu class.
 *     decorate the container; defaults to {@link MenuRenderer}.
 * @extends {Container<MenuRenderer>}
 */
export class Menu extends Container<MenuRenderer> {
    /**
     * A basic menu class.
     * @param {DomHelper=} opt_domHelper Optional DOM helper.
     * @param {MenuRenderer=} opt_renderer Renderer used to render or
     *     decorate the container; defaults to {@link MenuRenderer}.
     */
    constructor(opt_domHelper?: DomHelper | undefined, opt_renderer?: MenuRenderer | undefined);
    /**
     * Coordinates of the mousedown event that caused this menu to be made visible.
     * Used to prevent the consequent mouseup event due to a simple click from
     * activating a menu item immediately. Considered protected; should only be used
     * within this package or by subclasses.
     * @type {Coordinate|undefined}
     */
    openingCoords: Coordinate | undefined;
    /**
     * Whether the menu can move the focus to its key event target when it is
     * shown.  Default = true
     * @type {boolean}
     * @private
     */
    private allowAutoFocus_;
    /**
     * Whether the menu should use windows style behavior and allow disabled menu
     * items to be highlighted (though not selectable).  Defaults to false
     * @type {boolean}
     * @private
     */
    private allowHighlightDisabled_;
    /**
     * Returns the CSS class applied to menu elements, also used as the prefix for
     * derived styles, if any.  Subclasses should override this method as needed.
     * Considered protected.
     * @return {string} The CSS class applied to menu elements.
     * @protected
     * @deprecated Use getRenderer().getCssClass().
     */
    protected getCssClass(): string;
    /**
     * Returns whether the provided element is to be considered inside the menu for
     * purposes such as dismissing the menu on an event.  This is so submenus can
     * make use of elements outside their own DOM.
     * @param {?Element} element The element to test for.
     * @return {boolean} Whether the provided element is to be considered inside
     *     the menu.
     */
    containsElement(element: Element | null): boolean;
    /**
     * Adds a new menu item at the end of the menu.
     * @param {MenuHeader|MenuItem|MenuSeparator} item Menu
     *     item to add to the menu.
     * @deprecated Use {@link #addChild} instead, with true for the second argument.
     */
    addItem(item: MenuHeader | MenuItem | MenuSeparator): void;
    /**
     * Adds a new menu item at a specific index in the menu.
     * @param {MenuHeader|MenuItem|MenuSeparator} item Menu
     *     item to add to the menu.
     * @param {number} n Index at which to insert the menu item.
     * @deprecated Use {@link #addChildAt} instead, with true for the third
     *     argument.
     */
    addItemAt(item: MenuHeader | MenuItem | MenuSeparator, n: number): void;
    /**
     * Removes an item from the menu and disposes of it.
     * @param {MenuHeader|MenuItem|MenuSeparator} item The
     *     menu item to remove.
     * @deprecated Use {@link #removeChild} instead.
     */
    removeItem(item: MenuHeader | MenuItem | MenuSeparator): void;
    /**
     * Removes a menu item at a given index in the menu and disposes of it.
     * @param {number} n Index of item.
     * @deprecated Use {@link #removeChildAt} instead.
     */
    removeItemAt(n: number): void;
    /**
     * Returns a reference to the menu item at a given index.
     * @param {number} n Index of menu item.
     * @return {MenuHeader|MenuItem|MenuSeparator|null}
     *     Reference to the menu item.
     * @deprecated Use {@link #getChildAt} instead.
     */
    getItemAt(n: number): MenuHeader | MenuItem | MenuSeparator | null;
    /**
     * Returns the number of items in the menu (including separators).
     * @return {number} The number of items in the menu.
     * @deprecated Use {@link #getChildCount} instead.
     */
    getItemCount(): number;
    /**
     * Returns an array containing the menu items contained in the menu.
     * @return {!Array<MenuItem>} An array of menu items.
     * @deprecated Use getChildAt, forEachChild, and getChildCount.
     */
    getItems(): Array<MenuItem>;
    /**
     * Sets the position of the menu relative to the view port.
     * @param {number|Coordinate} x Left position or coordinate obj.
     * @param {number=} opt_y Top position.
     */
    setPosition(x: number | Coordinate, opt_y?: number | undefined): void;
    /**
     * Gets the page offset of the menu, or null if the menu isn't visible
     * @return {Coordinate?} Object holding the x-y coordinates of the
     *     menu or null if the menu is not visible.
     */
    getPosition(): Coordinate | null;
    /**
     * Sets whether the menu can automatically move focus to its key event target
     * when it is set to visible.
     * @param {boolean} allow Whether the menu can automatically move focus to its
     *     key event target when it is set to visible.
     */
    setAllowAutoFocus(allow: boolean): void;
    /**
     * @return {boolean} Whether the menu can automatically move focus to its key
     *     event target when it is set to visible.
     */
    getAllowAutoFocus(): boolean;
    /**
     * Sets whether the menu will highlight disabled menu items or skip to the next
     * active item.
     * @param {boolean} allow Whether the menu will highlight disabled menu items or
     *     skip to the next active item.
     */
    setAllowHighlightDisabled(allow: boolean): void;
    /**
     * @return {boolean} Whether the menu will highlight disabled menu items or skip
     *     to the next active item.
     */
    getAllowHighlightDisabled(): boolean;
    /**
     * Highlights the next item that begins with the specified string.  If no
     * (other) item begins with the given string, the selection is unchanged.
     * @param {string} charStr The prefix to match.
     * @return {boolean} Whether a matching prefix was found.
     */
    highlightNextPrefix(charStr: string): boolean;
    /**
     * Decorate menu items located in any descendant node which as been explicitly
     * marked as a 'content' node.
     * @param {?Element} element Element to decorate.
     * @protected
     */
    protected decorateContent(element: Element | null): void;
}
export namespace Menu {
    import CSS_CLASS = MenuRenderer.CSS_CLASS;
    export { CSS_CLASS };
}
/**
 * @fileoverview A class for representing items in menus.
 * @see Menu
 *
 * @see ../demos/menuitem.html
 */
/**
 * Class representing an item in a menu.
 *
 *     display as the content of the item (use to add icons or styling to
 *     menus).
 *     document interactions.
 * @extends {Control<Ui_MenuItemRenderer>}
 */
export class MenuItem extends Control<Ui_MenuItemRenderer> {
    /**
     * Class representing an item in a menu.
     *
     * @param {?ControlContent} content Text caption or DOM structure to
     *     display as the content of the item (use to add icons or styling to
     *     menus).
     * @param {*=} opt_model Data/model associated with the menu item.
     * @param {DomHelper=} opt_domHelper Optional DOM helper used for
     *     document interactions.
     * @param {Ui_MenuItemRenderer=} opt_renderer Optional renderer.
     */
    constructor(content: ControlContent | null, opt_model?: any | undefined, opt_domHelper?: DomHelper | undefined, opt_renderer?: Ui_MenuItemRenderer | undefined);
    /**
     * The access key for this menu item. This key allows the user to quickly
     * trigger this item's action with they keyboard. For example, setting the
     * mnenomic key to 70 (F), when the user opens the menu and hits "F," the
     * menu item is triggered.
     *
     * @type {?KeyCodes}
     * @private
     */
    private mnemonicKey_;
    /**
     * Returns the value associated with the menu item.  The default implementation
     * returns the model object associated with the item (if any), or its caption.
     * @return {*} Value associated with the menu item, if any, or its caption.
     */
    getValue(): any;
    /**
     * Sets the value associated with the menu item.  The default implementation
     * stores the value as the model of the menu item.
     * @param {*} value Value to be associated with the menu item.
     */
    setValue(value: any): void;
    /**
     * Sets the menu item to be selectable or not.  Set to true for menu items
     * that represent selectable options.
     * @param {boolean} selectable Whether the menu item is selectable.
     */
    setSelectable(selectable: boolean): void;
    /**
     * Sets the menu item to be selectable or not.
     * @param {boolean} selectable  Whether the menu item is selectable.
     * @private
     */
    private setSelectableInternal_;
    /**
     * Sets the menu item to be checkable or not.  Set to true for menu items
     * that represent checkable options.
     * @param {boolean} checkable Whether the menu item is checkable.
     */
    setCheckable(checkable: boolean): void;
    /**
     * Sets the menu item to be checkable or not.
     * @param {boolean} checkable Whether the menu item is checkable.
     * @private
     */
    private setCheckableInternal_;
    /**
     * @suppress {checkTypes}
     * @return {?string} The keyboard accelerator text, or null if the menu item doesn't have one.
     */
    getAccelerator(): string | null;
    /**
     * Sets the mnemonic key code. The mnemonic is the key associated with this
     * action.
     * @param {?KeyCodes} key The key code.
     */
    setMnemonic(key: KeyCodes | null): void;
    /**
     * Gets the mnemonic key code. The mnemonic is the key associated with this
     * action.
     * @return {?KeyCodes} The key code of the mnemonic key.
     */
    getMnemonic(): KeyCodes | null;
}
export namespace MenuItem {
    export const MNEMONIC_WRAPPER_CLASS_: string;
    export const ACCELERATOR_CLASS: string;
}
/**
 * @fileoverview Renderer for {@link Menu}s.
 */
/**
 * Default renderer for {@link Menu}s, based on {@link
 * ContainerRenderer}.
 * @extends {ContainerRenderer}
 */
export class MenuRenderer extends ContainerRenderer {
    /** @override @return {!MenuRenderer} @suppress {checkTypes} */
    static getInstance(): MenuRenderer;
    /**
     * Default renderer for {@link Menu}s, based on {@link
     * ContainerRenderer}.
     * @param {string=} opt_ariaRole Optional ARIA role used for the element.
     */
    constructor(opt_ariaRole?: string | undefined);
    /**
     * Returns whether the given element is contained in the menu's DOM.
     * @param {?Menu} menu The menu to test.
     * @param {?Element} element The element to test.
     * @return {boolean} Whether the given element is contained in the menu.
     */
    containsElement(menu: Menu | null, element: Element | null): boolean;
}
export namespace MenuRenderer {
    export const instance_: MenuRenderer | null;
    const CSS_CLASS_1: string;
    export { CSS_CLASS_1 as CSS_CLASS };
}
import { Container } from "./container.js";
import { Coordinate } from "../math/coordinate.js";
import { MenuHeader } from "./menuheader.js";
import { MenuSeparator } from "./menuseparator.js";
import { DomHelper } from "../dom/dom.js";
import { MenuItemRenderer as Ui_MenuItemRenderer } from "./menuitemrenderer.js";
import { Control } from "./control.js";
import { KeyCodes } from "../events/keycodes.js";
import { ControlContent } from "./controlcontent.js";
import { ContainerRenderer } from "./container.js";
