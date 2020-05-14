/**
 * @fileoverview A control for representing a palette of colors, that the user
 * can highlight or select via the keyboard or the mouse.
 */
/**
 * A color palette is a grid of color swatches that the user can highlight or
 * select via the keyboard or the mouse.  The selection state of the palette is
 * controlled by a selection model.  When the user makes a selection, the
 * component fires an ACTION event.  Event listeners may retrieve the selected
 * color using the {@link #getSelectedColor} method.
 *
 *     format.
 *     decorate the palette; defaults to {@link PaletteRenderer}.
 *     document interaction.
 * @extends {Palette}
 */
export class ColorPalette extends Palette {
    /**
     * Takes a string, attempts to parse it as a color spec, and returns a
     * normalized hex color spec if successful (null otherwise).
     * @param {?string} color String possibly containing a color spec; may be null.
     * @return {?string} Normalized hex color spec, or null if the argument can't
     *     be parsed as a color.
     * @private
     */
    private static parseColor_;
    /**
     * A color palette is a grid of color swatches that the user can highlight or
     * select via the keyboard or the mouse.  The selection state of the palette is
     * controlled by a selection model.  When the user makes a selection, the
     * component fires an ACTION event.  Event listeners may retrieve the selected
     * color using the {@link #getSelectedColor} method.
     *
     * @param {Array<string>=} opt_colors Array of colors in any valid CSS color
     *     format.
     * @param {PaletteRenderer=} opt_renderer Renderer used to render or
     *     decorate the palette; defaults to {@link PaletteRenderer}.
     * @param {DomHelper=} opt_domHelper Optional DOM helper, used for
     *     document interaction.
     */
    constructor(opt_colors?: Array<string> | undefined, opt_renderer?: PaletteRenderer | undefined, opt_domHelper?: DomHelper | undefined);
    /**
     * Array of normalized colors. Initialized lazily as often never needed.
     * @type {?Array<string>}
     * @private
     */
    private normalizedColors_;
    /**
     * Array of labels for the colors. Will be used for the tooltips and
     * accessibility.
     * @type {?Array<string>}
     * @private
     */
    private labels_;
    /**
     * Array of colors to show in the palette.
     * @type {Array<string>}
     * @private
     */
    private colors_;
    /**
     * Returns the array of colors represented in the color palette.
     * @return {Array<string>} Array of colors.
     */
    getColors(): Array<string>;
    /**
     * Sets the colors that are contained in the palette.
     * @param {Array<string>} colors Array of colors in any valid CSS color format.
     * @param {Array<string>=} opt_labels The array of labels to be used as
     *        tooltips. When not provided, the color value will be used.
     */
    setColors(colors: Array<string>, opt_labels?: Array<string> | undefined): void;
    /**
     * @return {?string} The current selected color in hex, or null.
     */
    getSelectedColor(): string | null;
    /**
     * Sets the selected color.  Clears the selection if the argument is null or
     * can't be parsed as a color.
     * @param {?string} color The color to set as selected; null clears the
     *     selection.
     */
    setSelectedColor(color: string | null): void;
    /**
     * @return {!Array<!Node>} An array of DOM nodes for each color.
     * @protected
     */
    protected createColorNodes(): Array<Node>;
}
import { Palette } from "./palette.js";
import { PaletteRenderer } from "./paletterenderer.js";
import { DomHelper } from "../dom/dom.js";
