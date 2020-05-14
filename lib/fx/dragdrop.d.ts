/**
 * @fileoverview Single Element Drag and Drop.
 *
 * Drag and drop implementation for sources/targets consisting of a single
 * element.
 *
 * @see ../demos/dragdrop.html
 */
/**
 * Drag/drop implementation for creating drag sources/drop targets consisting of
 * a single HTML Element.
 *
 *     id, to be used as drag source/drop target.
 * @throws Error If no element argument is provided or if the type is invalid
 * @extends {AbstractDragDrop}
 * @class
 * @abstract
 */
export class DragDrop extends AbstractDragDrop {
    /**
     * Drag/drop implementation for creating drag sources/drop targets consisting of
     * a single HTML Element.
     *
     * @param {?Element|string} element Dom Node, or string representation of node
     *     id, to be used as drag source/drop target.
     * @param {Object=} opt_data Data associated with the source/target.
     * @throws Error If no element argument is provided or if the type is invalid
     */
    constructor(element: (Element | string) | null, opt_data?: any | undefined);
}
import { AbstractDragDrop } from "./abstractdragdrop.js";
