/**
 * @fileoverview Definition of the Popup class.
 *
 * @see ../demos/popup.html
 */
/**
 * The Popup class provides functionality for displaying an absolutely
 * positioned element at a particular location in the window. It's designed to
 * be used as the foundation for building controls like a menu or tooltip. The
 * Popup class includes functionality for displaying a Popup near adjacent to
 * an anchor element.
 *
 * This works cross browser and thus does not use IE's createPopup feature
 * which supports extending outside the edge of the brower window.
 *
 *     object.
 * @extends {Ui_PopupBase}
 */
export class Popup extends Ui_PopupBase {
    /**
     * The Popup class provides functionality for displaying an absolutely
     * positioned element at a particular location in the window. It's designed to
     * be used as the foundation for building controls like a menu or tooltip. The
     * Popup class includes functionality for displaying a Popup near adjacent to
     * an anchor element.
     *
     * This works cross browser and thus does not use IE's createPopup feature
     * which supports extending outside the edge of the brower window.
     *
     * @param {Element=} opt_element A DOM element for the popup.
     * @param {AbstractPosition=} opt_position A positioning helper
     *     object.
     * @param {boolean=} opt_dontSetElement EDITED: Disables calling of setElement in the constructor.
     */
    constructor(opt_element?: Element, opt_position?: AbstractPosition, opt_dontSetElement?: boolean);
    /**
     * Margin for the popup used in positioning algorithms.
     *
     * @type {Math_Box|undefined}
     * @private
     */
    margin_: Math_Box | undefined;
    /**
     * Corner of the popup to used in the positioning algorithm.
     *
     * @type {?Corner}
     * @private
     */
    popupCorner_: Corner | null;
    /**
     * Positioning helper object.
     *
     * @private {AbstractPosition|undefined}
     */
    position_: AbstractPosition;
    /**
     * Returns the corner of the popup to used in the positioning algorithm.
     *
     * @return {?Corner} The popup corner used for positioning.
     */
    getPinnedCorner(): Corner;
    /**
     * Sets the corner of the popup to used in the positioning algorithm.
     *
     * @param {?Corner} corner The popup corner used for
     *     positioning.
     */
    setPinnedCorner(corner: Corner): void;
    /**
     * @return {?AbstractPosition} The position helper object
     *     associated with the popup.
     */
    getPosition(): AbstractPosition;
    /**
     * Sets the position helper object associated with the popup.
     *
     * @param {?AbstractPosition} position A position helper object.
     */
    setPosition(position: AbstractPosition): void;
    /**
     * Returns the margin to place around the popup.
     *
     * @return {Math_Box?} The margin.
     */
    getMargin(): Math_Box;
    /**
     * Sets the margin to place around the popup.
     *
     * @param {Math_Box|number|null} arg1 Top value or Box.
     * @param {number=} opt_arg2 Right value.
     * @param {number=} opt_arg3 Bottom value.
     * @param {number=} opt_arg4 Left value.
     */
    setMargin(arg1: number | Math_Box, opt_arg2?: number, opt_arg3?: number, opt_arg4?: number): void;
    actualEventTarget_: Popup;
}
import { PopupBase as Ui_PopupBase } from "./popupbase.js";
import { Box as Math_Box } from "../math/box.js";
import { Corner } from "../positioning/positioning.js";
import { AbstractPosition } from "../positioning/abstractposition.js";
