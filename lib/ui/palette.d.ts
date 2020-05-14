/**
 * @fileoverview A palette control.  A palette is a grid that the user can
 * highlight or select via the keyboard or the mouse.
 *
 * @see ../demos/palette.html
 */
/**
 * A palette is a grid of DOM nodes that the user can highlight or select via
 * the keyboard or the mouse.  The selection state of the palette is controlled
 * an ACTION event.  Event listeners may retrieve the selected item using the
 * {@link #getSelectedItem} or {@link #getSelectedIndex} method.
 *
 * Use this class as the base for components like color palettes or emoticon
 * pickers.  Use {@link #setContent} to set/change the items in the palette
 * after construction.  See palette.html demo for example usage.
 *
 *     in the palette grid (limited to one per cell).
 *     decorate the palette; defaults to {@link PaletteRenderer}.
 *     document interaction.
 * @extends {Control<PaletteRenderer>}
 */
export class Palette extends Control<PaletteRenderer> {
    /**
     * A palette is a grid of DOM nodes that the user can highlight or select via
     * the keyboard or the mouse.  The selection state of the palette is controlled
     * an ACTION event.  Event listeners may retrieve the selected item using the
     * {@link #getSelectedItem} or {@link #getSelectedIndex} method.
     *
     * Use this class as the base for components like color palettes or emoticon
     * pickers.  Use {@link #setContent} to set/change the items in the palette
     * after construction.  See palette.html demo for example usage.
     *
     * @param {Array<Node>} items Array of DOM nodes to be displayed as items
     *     in the palette grid (limited to one per cell).
     * @param {PaletteRenderer=} opt_renderer Renderer used to render or
     *     decorate the palette; defaults to {@link PaletteRenderer}.
     * @param {DomHelper=} opt_domHelper Optional DOM helper, used for
     *     document interaction.
     */
    constructor(items: Array<Node>, opt_renderer?: PaletteRenderer | undefined, opt_domHelper?: DomHelper | undefined);
    /**
     * Palette dimensions (columns x rows).  If the number of rows is undefined,
     * it is calculated on first use.
     * @type {?Size}
     * @private
     */
    private size_;
    /**
     * Index of the currently highlighted item (-1 if none).
     * @type {number}
     * @private
     */
    private highlightedIndex_;
    /**
     * Selection model controlling the palette's selection state.
     * @type {?SelectionModel}
     * @private
     */
    private selectionModel_;
    /**
     * A fake component for dispatching events on palette cell changes.
     * @type {!CurrentCell_}
     * @private
     */
    private currentCellControl_;
    /**
     * @private {number} The last highlighted index, or -1 if it never had one.
     */
    private lastHighlightedIndex_;
    /**
     * Determines whether to select the highlighted item while handling an internal
     * action. The highlighted item should not be selected if the action is a mouse
     * event occurring outside the palette or in an "empty" cell.
     * @param {!EventsEvent} e Mouseup or key event being handled.
     * @return {boolean} True if the highlighted item should be selected.
     * @private
     */
    private shouldSelectHighlightedItem_;
    /**
     * Handles selection change events dispatched by the selection model.
     * @param {?EventsEvent} e Selection event to handle.
     */
    handleSelectionChange(e: EventsEvent | null): void;
    /**
     * Returns the size of the palette grid.
     * @return {?Size} Palette size (columns x rows).
     */
    getSize(): Size | null;
    /**
     * Sets the size of the palette grid to the given size.  Callers can either
     * pass a single {@link Size} or a pair of numbers (first the number
     * of columns, then the number of rows) to this method.  In both cases, the
     * number of rows is optional and will be calculated automatically if needed.
     * It is an error to attempt to change the size of the palette after it has
     * been rendered.
     * @param {Size|number} size Either a size object or the number of
     *     columns.
     * @param {number=} opt_rows The number of rows (optional).
     */
    setSize(size: Size | number, opt_rows?: number | undefined): void;
    /**
     * Returns the 0-based index of the currently highlighted palette item, or -1
     * if no item is highlighted.
     * @return {number} Index of the highlighted item (-1 if none).
     */
    getHighlightedIndex(): number;
    /**
     * Returns the currently highlighted palette item, or null if no item is
     * highlighted.
     * @return {?Node} The highlighted item (undefined if none).
     */
    getHighlightedItem(): Node | null;
    /**
     * @return {?Element} The highlighted cell.
     * @private
     */
    private getHighlightedCellElement_;
    /**
     * Highlights the item at the given 0-based index, or removes the highlight
     * if the argument is -1 or out of range.  Any previously-highlighted item
     * will be un-highlighted.
     * @param {number} index 0-based index of the item to highlight.
     */
    setHighlightedIndex(index: number): void;
    /**
     * Highlights the given item, or removes the highlight if the argument is null
     * or invalid.  Any previously-highlighted item will be un-highlighted.
     * @param {Node|undefined} item Item to highlight.
     */
    setHighlightedItem(item: Node | undefined): void;
    /**
     * Returns the 0-based index of the currently selected palette item, or -1
     * if no item is selected.
     * @return {number} Index of the selected item (-1 if none).
     */
    getSelectedIndex(): number;
    /**
     * Returns the currently selected palette item, or null if no item is selected.
     * @return {?Node} The selected item (null if none).
     */
    getSelectedItem(): Node | null;
    /**
     * Selects the item at the given 0-based index, or clears the selection
     * if the argument is -1 or out of range.  Any previously-selected item
     * will be deselected.
     * @param {number} index 0-based index of the item to select.
     */
    setSelectedIndex(index: number): void;
    /**
     * Selects the given item, or clears the selection if the argument is null or
     * invalid.  Any previously-selected item will be deselected.
     * @param {?Node} item Item to select.
     */
    setSelectedItem(item: Node | null): void;
    /**
     * Private helper; highlights or un-highlights the item at the given index
     * based on the value of the Boolean argument.  This implementation simply
     * applies highlight styling to the cell containing the item to be highighted.
     * Does nothing if the palette hasn't been rendered yet.
     * @param {number} index 0-based index of item to highlight or un-highlight.
     * @param {boolean} highlight If true, the item is highlighted; otherwise it
     *     is un-highlighted.
     * @private
     */
    private highlightIndex_;
    /**
     * Private helper; selects or deselects the given item based on the value of
     * the Boolean argument.  This implementation simply applies selection styling
     * to the cell containing the item to be selected.  Does nothing if the palette
     * hasn't been rendered yet.
     * @param {?Node} item Item to select or deselect.
     * @param {boolean} select If true, the item is selected; otherwise it is
     *     deselected.
     * @private
     */
    private selectItem_;
    /**
     * Calculates and updates the size of the palette based on any preset values
     * and the number of palette items.  If there is no preset size, sets the
     * palette size to the smallest square big enough to contain all items.  If
     * there is a preset number of columns, increases the number of rows to hold
     * all items if needed.  (If there are too many rows, does nothing.)
     * @private
     */
    private adjustSize_;
}
export namespace Palette {
    export namespace EventType {
        export const AFTER_HIGHLIGHT: string;
    }
    /**
     * *
     */
    export type EventType = string;
}
import { PaletteRenderer } from "./paletterenderer.js";
import { Control } from "./control.js";
import { Event as EventsEvent } from "../events/event.js";
import { Size } from "../math/size.js";
import { DomHelper } from "../dom/dom.js";
