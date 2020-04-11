import * as googarray from './../array/array.js';
import * as googcolor from './../color/color.js';
import {DomHelper} from './../dom/dom.js';
import {TagName} from './../dom/tagname.js';
import * as google from './../google.js';
import * as style from './../style/style.js';
import {Palette} from './palette.js';
import {PaletteRenderer} from './paletterenderer.js';
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
class ColorPalette extends Palette {

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
  constructor(opt_colors, opt_renderer, opt_domHelper) {
  
    super(null, opt_renderer || PaletteRenderer.getInstance(),
        opt_domHelper);
    /**
     * Array of normalized colors. Initialized lazily as often never needed.
     * @type {?Array<string>}
     * @private
     */
    this.normalizedColors_ = null;
  
    /**
     * Array of labels for the colors. Will be used for the tooltips and
     * accessibility.
     * @type {?Array<string>}
     * @private
     */
    this.labels_ = null;
  
  
    /**
     * Array of colors to show in the palette.
     * @type {Array<string>}
     * @private
     */
    this.colors_ = opt_colors || [];
  
    // Set the colors separately from the super call since we need the correct
    // DomHelper to be initialized for this class.
    this.setColors(this.colors_);
  }

  /**
   * Returns the array of colors represented in the color palette.
   * @return {Array<string>} Array of colors.
   */
  getColors() {
    return this.colors_;
  };

  /**
   * Sets the colors that are contained in the palette.
   * @param {Array<string>} colors Array of colors in any valid CSS color format.
   * @param {Array<string>=} opt_labels The array of labels to be used as
   *        tooltips. When not provided, the color value will be used.
   */
  setColors(colors, opt_labels) {
    this.colors_ = colors;
    this.labels_ = opt_labels || null;
    this.normalizedColors_ = null;
    this.setContent(this.createColorNodes());
  };

  /**
   * @return {?string} The current selected color in hex, or null.
   */
  getSelectedColor() {
    var selectedItem = /** @type {Element} */ (this.getSelectedItem());
    if (selectedItem) {
      var color = style.getStyle(selectedItem, 'background-color');
      return ColorPalette.parseColor_(color);
    } else {
      return null;
    }
  };

  /**
   * Sets the selected color.  Clears the selection if the argument is null or
   * can't be parsed as a color.
   * @param {?string} color The color to set as selected; null clears the
   *     selection.
   */
  setSelectedColor(color) {
    var hexColor = ColorPalette.parseColor_(color);
    if (!this.normalizedColors_) {
      this.normalizedColors_ = googarray.map(this.colors_, function(color) {
        return ColorPalette.parseColor_(color);
      });
    }
    this.setSelectedIndex(
        hexColor ? googarray.indexOf(this.normalizedColors_, hexColor) : -1);
  };

  /**
   * @return {!Array<!Node>} An array of DOM nodes for each color.
   * @protected
   */
  createColorNodes() {
    return googarray.map(this.colors_, function(color, index) {
      var swatch = this.getDomHelper().createDom(TagName.DIV, {
        'class': google.getCssName(this.getRenderer().getCssClass(), 'colorswatch'),
        'style': 'background-color:' + color
      });
      if (this.labels_ && this.labels_[index]) {
        swatch.title = this.labels_[index];
      } else {
        swatch.title = color.charAt(0) == '#' ?
            'RGB (' + googcolor.hexToRgb(color).join(', ') + ')' :
            color;
      }
      return swatch;
    }, this);
  };

  /**
   * Takes a string, attempts to parse it as a color spec, and returns a
   * normalized hex color spec if successful (null otherwise).
   * @param {?string} color String possibly containing a color spec; may be null.
   * @return {?string} Normalized hex color spec, or null if the argument can't
   *     be parsed as a color.
   * @private
   */
  static parseColor_(color) {
    if (color) {
  
      try {
        return googcolor.parse(color).hex;
      } catch (ex) {
        // Fall through.
      }
    }
    return null;
  };
}

// google.tagUnsealableClass(ColorPalette);

export {ColorPalette};