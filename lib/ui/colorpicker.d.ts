/**
 * Constants for event names.
 */
export type EventType = string;
/**
 * @fileoverview A color picker component.  A color picker can compose several
 * instances of ColorPalette.
 *
 * NOTE: The ColorPicker is in a state of transition towards the common
 * component/control/container interface we are developing.  If the API changes
 * we will do our best to update your code.  The end result will be that a
 * color picker will compose multiple color palettes.  In the simple case this
 * will be one grid, but may consistute 3 distinct grids, a custom color picker
 * or even a color wheel.
 */
/**
 * Create a new, empty color picker.
 *
 *     use for this color picker.
 * @extends {Component}
 * @final
 */
export class ColorPicker extends Component {
    /**
     * Create a new, empty color picker.
     *
     * @param {DomHelper=} opt_domHelper Optional DOM helper.
     * @param {ColorPalette=} opt_colorPalette Optional color palette to
     *     use for this color picker.
     */
    constructor(opt_domHelper?: DomHelper, opt_colorPalette?: ColorPalette);
    /**
     * Whether the component is focusable.
     * @type {boolean}
     * @private
     */
    focusable_: boolean;
    /**
     * The color palette used inside the color picker.
     * @type {ColorPalette?}
     * @private
     */
    colorPalette_: ColorPalette | null;
    /**
     * Gets the array of colors displayed by the color picker.
     * Modifying this array will lead to unexpected behavior.
     * @return {Array<string>?} The colors displayed by this widget.
     */
    getColors(): string[];
    /**
     * Sets the array of colors to be displayed by the color picker.
     * @param {Array<string>} colors The array of colors to be added.
     */
    setColors(colors: string[]): void;
    /**
     * Sets the array of colors to be displayed by the color picker.
     * @param {Array<string>} colors The array of colors to be added.
     * @deprecated Use setColors.
     */
    addColors(colors: string[]): void;
    /**
     * Sets the size of the palette.  Will throw an error after the picker has been
     * rendered.
     * @param {Size|number} size The size of the grid.
     */
    setSize(size: number | Size): void;
    /**
     * Gets the number of columns displayed.
     * @return {Size?} The size of the grid.
     */
    getSize(): Size;
    /**
     * Sets the number of columns.  Will throw an error after the picker has been
     * rendered.
     * @param {number} n The number of columns.
     * @deprecated Use setSize.
     */
    setColumnCount(n: number): void;
    /**
     * @return {number} The index of the color selected.
     */
    getSelectedIndex(): number;
    /**
     * Sets which color is selected. A value that is out-of-range means that no
     * color is selected.
     * @param {number} ind The index in this.colors_ of the selected color.
     */
    setSelectedIndex(ind: number): void;
    /**
     * Gets the color that is currently selected in this color picker.
     * @return {?string} The hex string of the color selected, or null if no
     *     color is selected.
     */
    getSelectedColor(): string;
    /**
     * Sets which color is selected.  Noop if the color palette hasn't been created
     * yet.
     * @param {string} color The selected color.
     */
    setSelectedColor(color: string): void;
    /**
     * Returns true if the component is focusable, false otherwise.  The default
     * is true.  Focusable components always have a tab index and allocate a key
     * handler to handle keyboard events while focused.
     * @return {boolean} True iff the component is focusable.
     */
    isFocusable(): boolean;
    /**
     * Sets whether the component is focusable.  The default is true.
     * Focusable components always have a tab index and allocate a key handler to
     * handle keyboard events while focused.
     * @param {boolean} focusable True iff the component is focusable.
     */
    setFocusable(focusable: boolean): void;
    /**
     * Sets the focus to the color picker's palette.
     */
    focus(): void;
    /**
     * Handles actions from the color palette.
     *
     * @param {?EventsEvent} e The event.
     * @private
     */
    onColorPaletteAction_(e: EventsEvent): void;
    /**
     * Create a color palette for the color picker.
     * @param {Array<string>} colors Array of colors.
     * @private
     */
    createColorPalette_(colors: string[]): void;
    actualEventTarget_: ColorPicker;
}
export namespace ColorPicker {
    export const DEFAULT_NUM_COLS: number;
    export const SIMPLE_GRID_COLORS: Array<string>;
}
export namespace EventType {
    export const CHANGE: string;
}
import { Component } from "./component.js";
import { ColorPalette } from "./colorpalette.js";
import { Size } from "../math/size.js";
import { Event as EventsEvent } from "../events/event.js";
import { DomHelper } from "../dom/dom.js";
