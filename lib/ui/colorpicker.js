import {DomHelper} from './../dom/dom.js';
import {Event as EventsEvent} from './../events/event.js';
import {Size} from './../math/size.js';
import {ColorPalette} from './colorpalette.js';
import {Component} from './component.js';
import {State} from './component.js';
import {EventType as ComponentEventType} from './component.js';
// Copyright 2007 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

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
class ColorPicker extends Component {

  /**
   * Create a new, empty color picker.
   *
   * @param {DomHelper=} opt_domHelper Optional DOM helper.
   * @param {ColorPalette=} opt_colorPalette Optional color palette to
   *     use for this color picker.
   */
  constructor(opt_domHelper, opt_colorPalette) {
    super(opt_domHelper);
    /**
     * Whether the component is focusable.
     * @type {boolean}
     * @private
     */
    this.focusable_ = true;
  
  
    /**
     * The color palette used inside the color picker.
     * @type {ColorPalette?}
     * @private
     */
    this.colorPalette_ = opt_colorPalette || null;
  
    this.getHandler().listen(
        this, ComponentEventType.ACTION, this.onColorPaletteAction_);
  }

  /**
   * Gets the array of colors displayed by the color picker.
   * Modifying this array will lead to unexpected behavior.
   * @return {Array<string>?} The colors displayed by this widget.
   */
  getColors() {
    return this.colorPalette_ ? this.colorPalette_.getColors() : null;
  };

  /**
   * Sets the array of colors to be displayed by the color picker.
   * @param {Array<string>} colors The array of colors to be added.
   */
  setColors(colors) {
    // TODO(user): Don't add colors directly, we should add palettes and the
    // picker should support multiple palettes.
    if (!this.colorPalette_) {
      this.createColorPalette_(colors);
    } else {
      this.colorPalette_.setColors(colors);
    }
  };

  /**
   * Sets the array of colors to be displayed by the color picker.
   * @param {Array<string>} colors The array of colors to be added.
   * @deprecated Use setColors.
   */
  addColors(colors) {
    this.setColors(colors);
  };

  /**
   * Sets the size of the palette.  Will throw an error after the picker has been
   * rendered.
   * @param {Size|number} size The size of the grid.
   */
  setSize(size) {
    // TODO(user): The color picker should contain multiple palettes which will
    // all be resized at this point.
    if (!this.colorPalette_) {
      this.createColorPalette_([]);
    }
    this.colorPalette_.setSize(size);
  };

  /**
   * Gets the number of columns displayed.
   * @return {Size?} The size of the grid.
   */
  getSize() {
    return this.colorPalette_ ? this.colorPalette_.getSize() : null;
  };

  /**
   * Sets the number of columns.  Will throw an error after the picker has been
   * rendered.
   * @param {number} n The number of columns.
   * @deprecated Use setSize.
   */
  setColumnCount(n) {
    this.setSize(n);
  };

  /**
   * @return {number} The index of the color selected.
   */
  getSelectedIndex() {
    return this.colorPalette_ ? this.colorPalette_.getSelectedIndex() : -1;
  };

  /**
   * Sets which color is selected. A value that is out-of-range means that no
   * color is selected.
   * @param {number} ind The index in this.colors_ of the selected color.
   */
  setSelectedIndex(ind) {
    if (this.colorPalette_) {
      this.colorPalette_.setSelectedIndex(ind);
    }
  };

  /**
   * Gets the color that is currently selected in this color picker.
   * @return {?string} The hex string of the color selected, or null if no
   *     color is selected.
   */
  getSelectedColor() {
    return this.colorPalette_ ? this.colorPalette_.getSelectedColor() : null;
  };

  /**
   * Sets which color is selected.  Noop if the color palette hasn't been created
   * yet.
   * @param {string} color The selected color.
   */
  setSelectedColor(color) {
    // TODO(user): This will set the color in the first available palette that
    // contains it
    if (this.colorPalette_) {
      this.colorPalette_.setSelectedColor(color);
    }
  };

  /**
   * Returns true if the component is focusable, false otherwise.  The default
   * is true.  Focusable components always have a tab index and allocate a key
   * handler to handle keyboard events while focused.
   * @return {boolean} True iff the component is focusable.
   */
  isFocusable() {
    return this.focusable_;
  };

  /**
   * Sets whether the component is focusable.  The default is true.
   * Focusable components always have a tab index and allocate a key handler to
   * handle keyboard events while focused.
   * @param {boolean} focusable True iff the component is focusable.
   */
  setFocusable(focusable) {
    this.focusable_ = focusable;
    if (this.colorPalette_) {
      this.colorPalette_.setSupportedState(
          State.FOCUSED, focusable);
    }
  };

  /**
   * ColorPickers cannot be used to decorate pre-existing html, since the
   * structure they build is fairly complicated.
   * @param {Element} element Element to decorate.
   * @return {boolean} Returns always false.
   * @override
   */
  canDecorate(element) {
    return false;
  };

  /**
   * Renders the color picker inside the provided element. This will override the
   * current content of the element.
   * @override
   */
  enterDocument() {
    super.enterDocument();
    if (this.colorPalette_) {
      this.colorPalette_.render(this.getElement());
    }
    this.getElement().unselectable = 'on';
  };

  /** @override */
  disposeInternal() {
    super.disposeInternal();
    if (this.colorPalette_) {
      this.colorPalette_.dispose();
      this.colorPalette_ = null;
    }
  };

  /**
   * Sets the focus to the color picker's palette.
   */
  focus() {
    if (this.colorPalette_) {
      this.colorPalette_.getElement().focus();
    }
  };

  /**
   * Handles actions from the color palette.
   *
   * @param {EventsEvent} e The event.
   * @private
   */
  onColorPaletteAction_(e) {
    e.stopPropagation();
    this.dispatchEvent(EventType.CHANGE);
  };

  /**
   * Create a color palette for the color picker.
   * @param {Array<string>} colors Array of colors.
   * @private
   */
  createColorPalette_(colors) {
    // TODO(user): The color picker should eventually just contain a number of
    // palettes and manage the interactions between them.  This will go away then.
    var cp = new ColorPalette(colors, null, this.getDomHelper());
    cp.setSize(ColorPicker.DEFAULT_NUM_COLS);
    cp.setSupportedState(State.FOCUSED, this.focusable_);
    // TODO(user): Use addChild(cp, true) and remove calls to render.
    this.addChild(cp);
    this.colorPalette_ = cp;
    if (this.isInDocument()) {
      this.colorPalette_.render(this.getElement());
    }
  };

  /**
   * Returns an unrendered instance of the color picker.  The colors and layout
   * are a simple color grid, the same as the old Gmail color picker.
   * @param {DomHelper=} opt_domHelper Optional DOM helper.
   * @return {!ColorPicker} The unrendered instance.
   */
  static createSimpleColorGrid(opt_domHelper) {
    var cp = new ColorPicker(opt_domHelper);
    cp.setSize(7);
    cp.setColors(ColorPicker.SIMPLE_GRID_COLORS);
    return cp;
  };
}

/**
 * Default number of columns in the color palette. May be overridden by calling
 * setSize.
 *
 * @type {number}
 */
ColorPicker.DEFAULT_NUM_COLS = 5;

/**
 * Constants for event names.
 * @enum {string}
 * @override
 * @suppress {checkTypes}
 */
let EventType = {
  CHANGE: 'change'
};

/**
 * Array of colors for a 7-cell wide simple-grid color picker.
 * @type {Array<string>}
 */
ColorPicker.SIMPLE_GRID_COLORS = [
  // grays
  '#ffffff', '#cccccc', '#c0c0c0', '#999999', '#666666', '#333333', '#000000',
  // reds
  '#ffcccc', '#ff6666', '#ff0000', '#cc0000', '#990000', '#660000', '#330000',
  // oranges
  '#ffcc99', '#ff9966', '#ff9900', '#ff6600', '#cc6600', '#993300', '#663300',
  // yellows
  '#ffff99', '#ffff66', '#ffcc66', '#ffcc33', '#cc9933', '#996633', '#663333',
  // olives
  '#ffffcc', '#ffff33', '#ffff00', '#ffcc00', '#999900', '#666600', '#333300',
  // greens
  '#99ff99', '#66ff99', '#33ff33', '#33cc00', '#009900', '#006600', '#003300',
  // turquoises
  '#99ffff', '#33ffff', '#66cccc', '#00cccc', '#339999', '#336666', '#003333',
  // blues
  '#ccffff', '#66ffff', '#33ccff', '#3366ff', '#3333ff', '#000099', '#000066',
  // purples
  '#ccccff', '#9999ff', '#6666cc', '#6633ff', '#6600cc', '#333399', '#330099',
  // violets
  '#ffccff', '#ff99ff', '#cc66cc', '#cc33cc', '#993399', '#663366', '#330033'
];

export {ColorPicker, EventType};