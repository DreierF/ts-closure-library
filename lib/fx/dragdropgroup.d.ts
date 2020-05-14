/**
 * @fileoverview Multiple Element Drag and Drop.
 *
 * Drag and drop implementation for sources/targets consisting of multiple
 * elements.
 *
 * @see ../demos/dragdrop.html
 */
/**
 * Drag/drop implementation for creating drag sources/drop targets consisting of
 * multiple HTML Elements (items). All items share the same drop target(s) but
 * can be dragged individually.
 *
 * @extends {AbstractDragDrop}
 * @class
 */
export class DragDropGroup extends AbstractDragDrop {
    /**
     * Add item to drag object.
     *
     * @param {?Element|string} element Dom Node, or string representation of node
     *     id, to be used as drag source/drop target.
     * @param {Object=} opt_data Data associated with the source/target.
     * @throws Error If no element argument is provided or if the type is
     *     invalid
     * @override
     */
    addItem(element: string | Element | null, opt_data?: any): void;
    /**
     * Add DragDropItem to drag object.
     *
     * @param {?DragDropItem} item DragDropItem being added to the
     *     drag object.
     * @throws Error If no element argument is provided or if the type is
     *     invalid
     */
    addDragDropItem(item: DragDropItem | null): void;
    /**
     * Remove item from drag object.
     *
     * @param {?Element|string} element Dom Node, or string representation of node
     *     id, that was previously added with addItem().
     */
    removeItem(element: (Element | string) | null): void;
    /**
     * Marks the supplied list of items as selected. A drag operation for any of the
     * selected items will affect all of them.
     *
     * @param {Array<DragDropItem>} list List of items to select or null to
     *     clear selection.
     *
     * TODO(eae): Not yet implemented.
     */
    setSelection(list: Array<DragDropItem>): void;
}
import { AbstractDragDrop } from "./abstractdragdrop.js";
import { DragDropItem } from "./abstractdragdrop.js";
