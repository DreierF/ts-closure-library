/**
 * @fileoverview A class for representing menu separators.
 * @see goog.ui.Menu
 */
/**
 * Class representing a menu separator.  A menu separator extends {@link
 * Separator} by always setting its renderer to {@link
 * Ui_MenuSeparatorRenderer}.
 *     document interactions.
 * @extends {Separator}
 */
export class MenuSeparator extends Separator {
    /**
     * Class representing a menu separator.  A menu separator extends {@link
     * Separator} by always setting its renderer to {@link
     * Ui_MenuSeparatorRenderer}.
     * @param {DomHelper=} opt_domHelper Optional DOM helper used for
     *     document interactions.
     */
    constructor(opt_domHelper?: DomHelper | undefined);
}
import { Separator } from "./separator.js";
import { DomHelper } from "../dom/dom.js";
