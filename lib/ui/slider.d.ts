/**
 * Expose Enum of superclass (representing the orientation of the slider) within
 * Slider namespace.
 */
export type Orientation = string;
/**
 * Expose Enum of superclass (representing the orientation of the slider) within
 * Slider namespace.
 *
 * @enum {string}
 */
export let Orientation: any;
/**
 * @fileoverview A slider implementation that allows to select a value within a
 * range by dragging a thumb. The selected value is exposed through getValue().
 *
 * To decorate, the slider should be bound to an element with the class name
 * 'goog-slider' containing a child with the class name 'goog-slider-thumb',
 * whose position is set to relative.
 * Note that you won't be able to see these elements unless they are styled.
 *
 * Slider orientation is horizontal by default.
 * Use setOrientation(Orientation.VERTICAL) for a vertical
 * slider.
 *
 * Decorate Example:
 * <div id="slider" class="goog-slider">
 *   <div class="goog-slider-thumb"></div>
 * </div>
 *
 * JavaScript code:
 * <code>
 *   var slider = new Slider;
 *   slider.decorate(document.getElementById('slider'));
 * </code>
 *
 * @see ../demos/slider.html
 */
/**
 * This creates a slider object.
 *     slider values to a description of the value.
 * @extends {SliderBase}
 */
export class Slider extends SliderBase {
    /**
     * This creates a slider object.
     * @param {DomHelper=} opt_domHelper Optional DOM helper.
     * @param {(function(number):?string)=} opt_labelFn An optional function mapping
     *     slider values to a description of the value.
     */
    constructor(opt_domHelper?: DomHelper | undefined, opt_labelFn?: ((arg0: number) => string | null) | undefined);
    /**
     * Returns CSS class applied to the slider's thumb element.
     * @return {string} The CSS class applied to the slider's thumb element.
     * @protected
     */
    protected getThumbCssClass(): string;
    /**
     * Creates the thumb element.
     * @return {!HTMLDivElement} The created thumb element.
     * @private
     */
    private createThumb_;
}
export namespace Slider {
    export const CSS_CLASS_PREFIX: string;
    export const THUMB_CSS_CLASS: string;
}
import { SliderBase } from "./sliderbase.js";
import { DomHelper } from "../dom/dom.js";
