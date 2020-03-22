/**
 * @fileoverview A class for representing menu headers.
 * @see goog.ui.Menu
 */
/**
 * Class representing a menu header.
 *     display as the content of the item (use to add icons or styling to
 *     menus).
 *     document interactions.
 * @extends {Control<Ui_MenuHeaderRenderer>}
 */
export class MenuHeader extends Control<Ui_MenuHeaderRenderer> {
    /**
     * Class representing a menu header.
     * @param {?ControlContent} content Text caption or DOM structure to
     *     display as the content of the item (use to add icons or styling to
     *     menus).
     * @param {DomHelper=} opt_domHelper Optional DOM helper used for
     *     document interactions.
     * @param {Ui_MenuHeaderRenderer=} opt_renderer Optional renderer.
     */
    constructor(content: any, opt_domHelper?: DomHelper | undefined, opt_renderer?: Ui_MenuHeaderRenderer | undefined);
}
import { MenuHeaderRenderer as Ui_MenuHeaderRenderer } from "./menuheaderrenderer.js";
import { Control } from "./control.js";
import { DomHelper } from "../dom/dom.js";
