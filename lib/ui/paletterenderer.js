import * as aria from './../a11y/aria/aria.js';
import {State} from './../a11y/aria/attributes.js';
import {Role} from './../a11y/aria/roles.js';
import * as googarray from './../array/array.js';
import * as asserts from './../asserts/asserts.js';
import * as classlist from './../dom/classlist.js';
import * as dataset from './../dom/dataset.js';
import * as googdom from './../dom/dom.js';
import {DomHelper} from './../dom/dom.js';
import {NodeIterator} from './../dom/nodeiterator.js';
import {NodeType} from './../dom/nodetype.js';
import {TagName} from './../dom/tagname.js';
import * as google from './../google.js';
import * as googiter from './../iter/iter.js';
import {Size} from './../math/size.js';
import * as style from './../style/style.js';
import * as userAgent from './../useragent/useragent.js';
import {Control} from './control.js';
import {ControlRenderer} from './control.js';
import {ControlContent} from './controlcontent.js';
import {Palette as UiPalette} from './palette.js';
// Copyright 2008 The Closure Library Authors. All Rights Reserved.
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
class PaletteRenderer extends ControlRenderer {

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
   */
  constructor() {
    super();
  }

  /** @override @return {!PaletteRenderer} @suppress {checkTypes} */
  static getInstance() {
    if (PaletteRenderer.instance_) {
      return /** @type {!PaletteRenderer} */ (PaletteRenderer.instance_);
    }
    return /** @type {!PaletteRenderer} */ (PaletteRenderer.instance_) = new PaletteRenderer();
  };

  /**
   * Returns the palette items arranged in a table wrapped in a DIV, with the
   * renderer's own CSS class and additional state-specific classes applied to
   * it.
   * @param {UiPalette} palette UiPalette to render.
   * @return {!Element} Root element for the palette.
   * @override
   */
  createDom(palette) {
    var classNames = this.getClassNames(palette);
    var element = palette.getDomHelper().createDom(
        TagName.DIV, classNames,
        this.createGrid(
            /** @type {Array<Node>} */ (palette.getContent()), palette.getSize(),
            palette.getDomHelper()));
    aria.setRole(element, Role.GRID);
    // It's safe to store grid width here since `UiPalette#setSize` cannot
    // be called after createDom.
    dataset.set(
        element, PaletteRenderer.GRID_WIDTH_ATTRIBUTE,
        ''+palette.getSize().width);
    return element;
  };

  /**
   * Returns the given items in a table with `size.width` columns and
   * `size.height` rows.  If the table is too big, empty cells will be
   * created as needed.  If the table is too small, the items that don't fit
   * will not be rendered.
   * @param {Array<Node>} items Palette items.
   * @param {Size} size Palette size (columns x rows); both dimensions
   *     must be specified as numbers.
   * @param {DomHelper} dom DOM helper for document interaction.
   * @return {!Element} Palette table element.
   */
  createGrid(items, size, dom) {
    var rows = [];
    for (var row = 0, index = 0; row < size.height; row++) {
      var cells = [];
      for (var column = 0; column < size.width; column++) {
        var item = items && items[index++];
        cells.push(this.createCell(item, dom));
      }
      rows.push(this.createRow(cells, dom));
    }
  
    return this.createTable(rows, dom);
  };

  /**
   * Returns a table element (or equivalent) that wraps the given rows.
   * @param {Array<Element>} rows Array of row elements.
   * @param {DomHelper} dom DOM helper for document interaction.
   * @return {!Element} Palette table element.
   */
  createTable(rows, dom) {
    var table = dom.createDom(
        TagName.TABLE, google.getCssName(this.getCssClass(), 'table'),
        dom.createDom(
            TagName.TBODY, google.getCssName(this.getCssClass(), 'body'),
            rows));
    table.cellSpacing = '0';
    table.cellPadding = '0';
    return table;
  };

  /**
   * Returns a table row element (or equivalent) that wraps the given cells.
   * @param {Array<Element>} cells Array of cell elements.
   * @param {DomHelper} dom DOM helper for document interaction.
   * @return {!Element} Row element.
   */
  createRow(cells, dom) {
    var row = dom.createDom(
        TagName.TR, google.getCssName(this.getCssClass(), 'row'), cells);
    aria.setRole(row, Role.ROW);
    return row;
  };

  /**
   * Returns a table cell element (or equivalent) that wraps the given palette
   * item (which must be a DOM node).
   * @param {Node|string} node Palette item.
   * @param {DomHelper} dom DOM helper for document interaction.
   * @return {!Element} Cell element.
   */
  createCell(node, dom) {
    var cell = dom.createDom(
        TagName.TD, {
          'class': google.getCssName(this.getCssClass(), 'cell'),
          // Cells must have an ID, for accessibility, so we generate one here.
          'id': google.getCssName(this.getCssClass(), 'cell-') +
              PaletteRenderer.cellId_++
        },
        node);
    aria.setRole(cell, Role.GRIDCELL);
    // Initialize to an unselected state.
    aria.setState(cell, State.SELECTED, false);
    this.maybeUpdateAriaLabel_(cell);
  
    return cell;
  };

  /**
   * Updates the aria label of the cell if it doesn't have one. Descends the DOM
   * and tries to find an aria label for a grid cell from the first child with a
   * label or title.
   * @param {!Element} cell The cell.
   * @private
   */
  maybeUpdateAriaLabel_(cell) {
    if (googdom.getTextContent(cell) || aria.getLabel(cell)) {
      return;
    }
    var iter = new NodeIterator(cell);
    var label = '';
    var node;
    while (!label && (node = googiter.nextOrValue(iter, null))) {
      if (node.nodeType == NodeType.ELEMENT) {
        label =
            aria.getLabel(/** @type {!Element} */ (node)) || node.title;
      }
    }
    if (label) {
      aria.setLabel(cell, label);
    }
  
    return;
  };

  /**
   * Overrides {@link ControlRenderer#canDecorate} to always return false.
   * @param {Element} element Ignored.
   * @return {boolean} False, since palettes don't support the decorate flow (for
   *     now).
   * @override
   */
  canDecorate(element) {
    return false;
  };

  /**
   * Overrides {@link ControlRenderer#decorate} to be a no-op, since
   * palettes don't support the decorate flow (for now).
   * @param {Control} palette Ignored.
   * @param {Element} element Ignored.
   * @return {null} Always null.
   * @override
   */
  decorate(palette, element) {
    return null;
  };

  /**
   * Overrides {@link ControlRenderer#setContent} for palettes.  Locates
   * the HTML table representing the palette grid, and replaces the contents of
   * each cell with a new element from the array of nodes passed as the second
   * argument.  If the new content has too many items the table will have more
   * rows added to fit, if there are less items than the table has cells, then the
   * left over cells will be empty.
   * @param {Element} element Root element of the palette control.
   * @param {ControlContent} content Array of items to replace existing
   *     palette items.
   * @override
   */
  setContent(element, content) {
    var items = /** @type {Array<Node>} */ (content);
    if (element) {
      var tbody = googdom.getElementsByTagNameAndClass(
          TagName.TBODY, google.getCssName(this.getCssClass(), 'body'),
          element)[0];
      if (tbody) {
        var index = 0;
        googarray.forEach(tbody.rows, function(row) {
          googarray.forEach(row.cells, function(cell) {
            googdom.removeChildren(cell);
            aria.removeState(cell, State.LABEL);
            if (items) {
              var item = items[index++];
              if (item) {
                googdom.appendChild(cell, item);
                this.maybeUpdateAriaLabel_(cell);
              }
            }
          }, this);
        }, this);
  
        // Make space for any additional items.
        if (index < items.length) {
          var cells = [];
          var dom = googdom.getDomHelper(element);
          var width = dataset.get(
              element, PaletteRenderer.GRID_WIDTH_ATTRIBUTE);
          while (index < items.length) {
            var item = items[index++];
            cells.push(this.createCell(item, dom));
            if (cells.length == width) {
              var row = this.createRow(cells, dom);
              googdom.appendChild(tbody, row);
              cells.length = 0;
            }
          }
          if (cells.length > 0) {
            while (cells.length < width) {
              cells.push(this.createCell('', dom));
            }
            var row = this.createRow(cells, dom);
            googdom.appendChild(tbody, row);
          }
        }
      }
      // Make sure the new contents are still unselectable.
      style.setUnselectable(element, true, userAgent.GECKO);
    }
  };

  /**
   * Returns the item corresponding to the given node, or null if the node is
   * neither a palette cell nor part of a palette item.
   * @param {UiPalette} palette Palette in which to look for the item.
   * @param {Node} node Node to look for.
   * @return {Node} The corresponding palette item (null if not found).
   */
  getContainingItem(palette, node) {
    var root = palette.getElement();
    while (node && node.nodeType == NodeType.ELEMENT && node != root) {
      if (node.tagName == TagName.TD &&
          classlist.contains(
              /** @type {!Element} */ (node),
              google.getCssName(this.getCssClass(), 'cell'))) {
        return node.firstChild;
      }
      node = node.parentNode;
    }
  
    return null;
  };

  /**
   * Updates the highlight styling of the palette cell containing the given node
   * based on the value of the Boolean argument.
   * @param {UiPalette} palette Palette containing the item.
   * @param {Node} node Item whose cell is to be highlighted or un-highlighted.
   * @param {boolean} highlight If true, the cell is highlighted; otherwise it is
   *     un-highlighted.
   */
  highlightCell(
      palette, node, highlight) {
    if (node) {
      var cell = this.getCellForItem(node);
      asserts.assert(cell);
      classlist.enable(
          cell, google.getCssName(this.getCssClass(), 'cell-hover'), highlight);
      // See https://www.w3.org/TR/wai-aria/#aria-activedescendant
      // for an explanation of the activedescendant.
      if (highlight) {
        aria.setState(
            palette.getElementStrict(), State.ACTIVEDESCENDANT,
            cell.id);
      } else if (
          cell.id ==
          aria.getState(
              palette.getElementStrict(),
              State.ACTIVEDESCENDANT)) {
        aria.removeState(
            palette.getElementStrict(), State.ACTIVEDESCENDANT);
      }
    }
  };

  /**
   * @param {Node} node Item whose cell is to be returned.
   * @return {Element} The grid cell for the palette item.
   */
  getCellForItem(node) {
    return /** @type {Element} */ (node ? node.parentNode : null);
  };

  /**
   * Updates the selection styling of the palette cell containing the given node
   * based on the value of the Boolean argument.
   * @param {UiPalette} palette Palette containing the item.
   * @param {Node} node Item whose cell is to be selected or deselected.
   * @param {boolean} select If true, the cell is selected; otherwise it is
   *     deselected.
   */
  selectCell(palette, node, select) {
    if (node) {
      var cell = /** @type {!Element} */ (node.parentNode);
      classlist.enable(
          cell, google.getCssName(this.getCssClass(), 'cell-selected'), select);
      aria.setState(cell, State.SELECTED, select);
    }
  };

  /**
   * Returns the CSS class to be applied to the root element of components
   * rendered using this renderer.
   * @return {string} Renderer-specific CSS class.
   * @override
   */
  getCssClass() {
    return PaletteRenderer.CSS_CLASS;
  };
}

/** @type {?PaletteRenderer} @suppress {underscore,checkTypes} @override */
PaletteRenderer.instance_ = undefined;

/**
 * Globally unique ID sequence for cells rendered by this renderer class.
 * @type {number}
 * @private
 */
PaletteRenderer.cellId_ = 0;

/**
 * Default CSS class to be applied to the root element of components rendered
 * by this renderer.
 * @type {string}
 * @override
 */
PaletteRenderer.CSS_CLASS = google.getCssName('goog-palette');

/**
 * Data attribute to store grid width from palette control.
 * @const {string}
 */
PaletteRenderer.GRID_WIDTH_ATTRIBUTE = 'gridWidth';

export {PaletteRenderer};