/**
 * @fileoverview Renderer for {@link UiPalette}s.
 */
/**
 * Default renderer for {@link UiPalette}s.  Renders the palette as an
 * HTML table wrapped in a DIV, with one palette item per cell:
 *
 *    <div class="goog-palette">
 *      <table class="goog-palette-table">
 *        <tbody class="goog-palette-body">
 *          <tr class="goog-palette-row">
 *            <td class="goog-palette-cell">...Item 0...</td>
 *            <td class="goog-palette-cell">...Item 1...</td>
 *            ...
 *          </tr>
 *          <tr class="goog-palette-row">
 *            ...
 *          </tr>
 *        </tbody>
 *      </table>
 *    </div>
 *
 * @extends {ControlRenderer<UiPalette>}
 */
export class PaletteRenderer extends ControlRenderer<UiPalette> {
    /** @override @return {!PaletteRenderer} @suppress {checkTypes} */
    static getInstance(): PaletteRenderer;
    /**
     * Returns the given items in a table with `size.width` columns and
     * `size.height` rows.  If the table is too big, empty cells will be
     * created as needed.  If the table is too small, the items that don't fit
     * will not be rendered.
     * @param {Array<Node>} items Palette items.
     * @param {?Size} size Palette size (columns x rows); both dimensions
     *     must be specified as numbers.
     * @param {?DomHelper} dom DOM helper for document interaction.
     * @return {!Element} Palette table element.
     */
    createGrid(items: Array<Node>, size: Size | null, dom: DomHelper | null): Element;
    /**
     * Returns a table element (or equivalent) that wraps the given rows.
     * @param {Array<Element>} rows Array of row elements.
     * @param {?DomHelper} dom DOM helper for document interaction.
     * @return {!Element} Palette table element.
     */
    createTable(rows: Array<Element>, dom: DomHelper | null): Element;
    /**
     * Returns a table row element (or equivalent) that wraps the given cells.
     * @param {Array<Element>} cells Array of cell elements.
     * @param {?DomHelper} dom DOM helper for document interaction.
     * @return {!Element} Row element.
     */
    createRow(cells: Array<Element>, dom: DomHelper | null): Element;
    /**
     * Returns a table cell element (or equivalent) that wraps the given palette
     * item (which must be a DOM node).
     * @param {Node|string} node Palette item.
     * @param {?DomHelper} dom DOM helper for document interaction.
     * @return {!Element} Cell element.
     */
    createCell(node: Node | string, dom: DomHelper | null): Element;
    /**
     * Updates the aria label of the cell if it doesn't have one. Descends the DOM
     * and tries to find an aria label for a grid cell from the first child with a
     * label or title.
     * @param {!Element} cell The cell.
     * @private
     */
    private maybeUpdateAriaLabel_;
    /**
     * Returns the item corresponding to the given node, or null if the node is
     * neither a palette cell nor part of a palette item.
     * @param {?UiPalette} palette Palette in which to look for the item.
     * @param {?Node} node Node to look for.
     * @return {?Node} The corresponding palette item (null if not found).
     */
    getContainingItem(palette: UiPalette | null, node: Node | null): Node | null;
    /**
     * Updates the highlight styling of the palette cell containing the given node
     * based on the value of the Boolean argument.
     * @param {?UiPalette} palette Palette containing the item.
     * @param {?Node} node Item whose cell is to be highlighted or un-highlighted.
     * @param {boolean} highlight If true, the cell is highlighted; otherwise it is
     *     un-highlighted.
     */
    highlightCell(palette: UiPalette | null, node: Node | null, highlight: boolean): void;
    /**
     * @param {?Node} node Item whose cell is to be returned.
     * @return {?Element} The grid cell for the palette item.
     */
    getCellForItem(node: Node | null): Element | null;
    /**
     * Updates the selection styling of the palette cell containing the given node
     * based on the value of the Boolean argument.
     * @param {?UiPalette} palette Palette containing the item.
     * @param {?Node} node Item whose cell is to be selected or deselected.
     * @param {boolean} select If true, the cell is selected; otherwise it is
     *     deselected.
     */
    selectCell(palette: UiPalette | null, node: Node | null, select: boolean): void;
}
export namespace PaletteRenderer {
    export const instance_: PaletteRenderer | null;
    export const cellId_: number;
    export const CSS_CLASS: string;
    export const GRID_WIDTH_ATTRIBUTE: string;
}
import { Palette as UiPalette } from "./palette.js";
import { ControlRenderer } from "./control.js";
import { Size } from "../math/size.js";
import { DomHelper } from "../dom/dom.js";
