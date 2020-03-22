/**
 * @fileoverview A class for representing a separator, with renderers for both
 * horizontal (menu) and vertical (toolbar) separators.
 */
/**
 * Class representing a separator.  Although it extends {@link Control},
 * the Separator class doesn't allocate any event handlers, nor does it change
 * its appearance on mouseover, etc.
 *    decorate the separator; defaults to {@link Ui_MenuSeparatorRenderer}.
 *    document interaction.
 * @extends {Control<Ui_MenuSeparatorRenderer>}
 */
export class Separator extends Control<Ui_MenuSeparatorRenderer> {
    /**
     * Class representing a separator.  Although it extends {@link Control},
     * the Separator class doesn't allocate any event handlers, nor does it change
     * its appearance on mouseover, etc.
     * @param {Ui_MenuSeparatorRenderer=} opt_renderer Renderer to render or
     *    decorate the separator; defaults to {@link Ui_MenuSeparatorRenderer}.
     * @param {DomHelper=} opt_domHelper Optional DOM helper, used for
     *    document interaction.
     */
    constructor(opt_renderer?: Ui_MenuSeparatorRenderer | undefined, opt_domHelper?: DomHelper | undefined);
}
import { MenuSeparatorRenderer as Ui_MenuSeparatorRenderer } from "./menuseparatorrenderer.js";
import { Control } from "./control.js";
import { DomHelper } from "../dom/dom.js";
