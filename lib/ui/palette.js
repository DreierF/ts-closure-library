import * as googarray from './../array/array.js';
import * as goog_dom from './../dom/dom.js';
import {DomHelper} from './../dom/dom.js';
import {BrowserEvent as EventsBrowserEvent} from './../events/browserevent.js';
import {Event as EventsEvent} from './../events/event.js';
import * as goog_events from './../events/eventhandler.js';
import {Key} from './../events/eventhandler.js';
import {EventType} from './../events/eventtype.js';
import {KeyCodes} from './../events/keycodes.js';
import {KeyEvent} from './../events/keyhandler.js';
import * as google from './../google.js';
import {Size} from './../math/size.js';
import {Component} from './component.js';
import {State} from './component.js';
import {Error as ComponentError} from './component.js';
import {Control} from './control.js';
import {ControlContent} from './controlcontent.js';
import {PaletteRenderer} from './paletterenderer.js';
import {SelectionModel} from './selectionmodel.js';
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
class Palette extends Control {

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
  constructor(items, opt_renderer, opt_domHelper) {
    super(items,
        opt_renderer || PaletteRenderer.getInstance(), opt_domHelper);
    /**
     * Palette dimensions (columns x rows).  If the number of rows is undefined,
     * it is calculated on first use.
     * @type {?Size}
     * @private
     */
    this.size_ = null;
  
    /**
     * Index of the currently highlighted item (-1 if none).
     * @type {number}
     * @private
     */
    this.highlightedIndex_ = -1;
  
    /**
     * Selection model controlling the palette's selection state.
     * @type {?SelectionModel}
     * @private
     */
    this.selectionModel_ = null;
  
    this.setAutoStates(
        State.CHECKED | State.SELECTED |
            State.OPENED,
        false);
  
    /**
     * A fake component for dispatching events on palette cell changes.
     * @type {!Palette.CurrentCell_}
     * @private
     */
    this.currentCellControl_ = new Palette.CurrentCell_();
    this.currentCellControl_.setParentEventTarget(this);
  
    /**
     * @private {number} The last highlighted index, or -1 if it never had one.
     */
    this.lastHighlightedIndex_ = -1;
  }

  /** @override */
  disposeInternal() {
    super.disposeInternal();
  
    if (this.selectionModel_) {
      this.selectionModel_.dispose();
      this.selectionModel_ = null;
    }
  
    this.size_ = null;
  
    this.currentCellControl_.dispose();
  };

  /**
   * Overrides {@link Control#setContentInternal} by also updating the
   * grid size and the selection model.  Considered protected.
   * @param {ControlContent} content Array of DOM nodes to be displayed
   *     as items in the palette grid (one item per cell).
   * @protected
   * @override
   */
  setContentInternal(content) {
    var items = /** @type {Array<Node>} */ (content);
    super.setContentInternal(items);
  
    // Adjust the palette size.
    this.adjustSize_();
  
    // Add the items to the selection model, replacing previous items (if any).
    if (this.selectionModel_) {
      // We already have a selection model; just replace the items.
      this.selectionModel_.clear();
      this.selectionModel_.addItems(items);
    } else {
      // Create a selection model, initialize the items, and hook up handlers.
      this.selectionModel_ = new SelectionModel(items);
      this.selectionModel_.setSelectionHandler(google.bind(this.selectItem_, this));
      this.getHandler().listen(
          this.selectionModel_, EventType.SELECT,
          this.handleSelectionChange);
    }
  
    // In all cases, clear the highlight.
    this.highlightedIndex_ = -1;
  };

  /**
   * Overrides {@link Control#getCaption} to return the empty string,
   * since palettes don't have text captions.
   * @return {string} The empty string.
   * @override
   */
  getCaption() {
    return '';
  };

  /**
   * Overrides {@link Control#setCaption} to be a no-op, since palettes
   * don't have text captions.
   * @param {string} caption Ignored.
   * @override
   */
  setCaption(caption) {
    // Do nothing.
  };

  /**
   * Handles mouseover events.  Overrides {@link Control#handleMouseOver}
   * by determining which palette item (if any) was moused over, highlighting it,
   * and un-highlighting any previously-highlighted item.
   * @param {EventsBrowserEvent} e Mouse event to handle.
   * @override
   */
  handleMouseOver(e) {
    super.handleMouseOver(e);
  
    var item = this.getRenderer().getContainingItem(this, e.target);
    if (item && e.relatedTarget && goog_dom.contains(item, e.relatedTarget)) {
      // Ignore internal mouse moves.
      return;
    }
  
    if (item != this.getHighlightedItem()) {
      this.setHighlightedItem(item);
    }
  };

  /**
   * Handles mousedown events.  Overrides {@link Control#handleMouseDown}
   * by ensuring that the item on which the user moused down is highlighted.
   * @param {EventsEvent} e Mouse event to handle.
   * @override
   */
  handleMouseDown(e) {
    super.handleMouseDown(e);
  
    if (this.isActive()) {
      // Make sure we move the highlight to the cell on which the user moused
      // down.
      var item = this.getRenderer().getContainingItem(this, e.target);
      if (item != this.getHighlightedItem()) {
        this.setHighlightedItem(item);
      }
    }
  };

  /**
   * Selects the currently highlighted palette item (triggered by mouseup or by
   * keyboard action).  Overrides {@link Control#performActionInternal}
   * by selecting the highlighted item and dispatching an ACTION event.
   * @param {EventsEvent} e Mouse or key event that triggered the action.
   * @return {boolean} True if the action was allowed to proceed, false otherwise.
   * @override
   */
  performActionInternal(e) {
    var highlightedItem = this.getHighlightedItem();
    if (highlightedItem) {
      if (e && this.shouldSelectHighlightedItem_(e)) {
        this.setSelectedItem(highlightedItem);
      }
      return super.performActionInternal(e);
    }
    return false;
  };

  /**
   * Determines whether to select the highlighted item while handling an internal
   * action. The highlighted item should not be selected if the action is a mouse
   * event occurring outside the palette or in an "empty" cell.
   * @param {!EventsEvent} e Mouseup or key event being handled.
   * @return {boolean} True if the highlighted item should be selected.
   * @private
   */
  shouldSelectHighlightedItem_(e) {
    if (!this.getSelectedItem()) {
      // It's always ok to select when nothing is selected yet.
      return true;
    } else if (e.type != 'mouseup') {
      // Keyboard can only act on valid cells.
      return true;
    } else {
      // Return whether or not the mouse action was in the palette.
      return !!this.getRenderer().getContainingItem(this, e.target);
    }
  };

  /**
   * Handles keyboard events dispatched while the palette has focus.  Moves the
   * highlight on arrow keys, and selects the highlighted item on Enter or Space.
   * Returns true if the event was handled, false otherwise.  In particular, if
   * the user attempts to navigate out of the grid, the highlight isn't changed,
   * and this method returns false; it is then up to the parent component to
   * handle the event (e.g. by wrapping the highlight around).  Overrides {@link
   * Control#handleKeyEvent}.
   * @param {KeyEvent} e Key event to handle.
   * @return {boolean} True iff the key event was handled by the component.
   * @override
   */
  handleKeyEvent(e) {
    var items = this.getContent();
    var numItems = items ? items.length : 0;
    var numColumns = this.size_.width;
  
    // If the component is disabled or the palette is empty, bail.
    if (numItems == 0 || !this.isEnabled()) {
      return false;
    }
  
    // User hit ENTER or SPACE; trigger action.
    if (e.keyCode == KeyCodes.ENTER ||
        e.keyCode == KeyCodes.SPACE) {
      return this.performActionInternal(e);
    }
  
    // User hit HOME or END; move highlight.
    if (e.keyCode == KeyCodes.HOME) {
      this.setHighlightedIndex(0);
      return true;
    } else if (e.keyCode == KeyCodes.END) {
      this.setHighlightedIndex(numItems - 1);
      return true;
    }
  
    // If nothing is highlighted, start from the selected index.  If nothing is
    // selected either, highlightedIndex is -1.
    var highlightedIndex = this.highlightedIndex_ < 0 ? this.getSelectedIndex() :
                                                        this.highlightedIndex_;
  
    switch (e.keyCode) {
      case KeyCodes.LEFT:
        // If the highlighted index is uninitialized, or is at the beginning, move
        // it to the end.
        if (highlightedIndex == -1 || highlightedIndex == 0) {
          highlightedIndex = numItems;
        }
        this.setHighlightedIndex(highlightedIndex - 1);
        e.preventDefault();
        return true;
        break;
  
      case KeyCodes.RIGHT:
        // If the highlighted index at the end, move it to the beginning.
        if (highlightedIndex == numItems - 1) {
          highlightedIndex = -1;
        }
        this.setHighlightedIndex(highlightedIndex + 1);
        e.preventDefault();
        return true;
        break;
  
      case KeyCodes.UP:
        if (highlightedIndex == -1) {
          highlightedIndex = numItems + numColumns - 1;
        }
        if (highlightedIndex >= numColumns) {
          this.setHighlightedIndex(highlightedIndex - numColumns);
          e.preventDefault();
          return true;
        }
        break;
  
      case KeyCodes.DOWN:
        if (highlightedIndex == -1) {
          highlightedIndex = -numColumns;
        }
        if (highlightedIndex < numItems - numColumns) {
          this.setHighlightedIndex(highlightedIndex + numColumns);
          e.preventDefault();
          return true;
        }
        break;
    }
  
    return false;
  };

  /**
   * Handles selection change events dispatched by the selection model.
   * @param {EventsEvent} e Selection event to handle.
   */
  handleSelectionChange(e) {
    // No-op in the base class.
  };

  /**
   * Returns the size of the palette grid.
   * @return {Size} Palette size (columns x rows).
   */
  getSize() {
    return this.size_;
  };

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
  setSize(size, opt_rows) {
    if (this.getElement()) {
      throw new Error(ComponentError.ALREADY_RENDERED);
    }
  
    this.size_ = (typeof size === 'number') ?
        new Size(size, /** @type {number} */ (opt_rows)) :
        size;
  
    // Adjust size, if needed.
    this.adjustSize_();
  };

  /**
   * Returns the 0-based index of the currently highlighted palette item, or -1
   * if no item is highlighted.
   * @return {number} Index of the highlighted item (-1 if none).
   */
  getHighlightedIndex() {
    return this.highlightedIndex_;
  };

  /**
   * Returns the currently highlighted palette item, or null if no item is
   * highlighted.
   * @return {Node} The highlighted item (undefined if none).
   */
  getHighlightedItem() {
    var items = this.getContent();
    return items && items[this.highlightedIndex_];
  };

  /**
   * @return {Element} The highlighted cell.
   * @private
   */
  getHighlightedCellElement_() {
    return this.getRenderer().getCellForItem(this.getHighlightedItem());
  };

  /**
   * Highlights the item at the given 0-based index, or removes the highlight
   * if the argument is -1 or out of range.  Any previously-highlighted item
   * will be un-highlighted.
   * @param {number} index 0-based index of the item to highlight.
   */
  setHighlightedIndex(index) {
    if (index != this.highlightedIndex_) {
      this.highlightIndex_(this.highlightedIndex_, false);
      this.lastHighlightedIndex_ = this.highlightedIndex_;
      this.highlightedIndex_ = index;
      this.highlightIndex_(index, true);
      this.dispatchEvent(Palette.EventType.AFTER_HIGHLIGHT);
    }
  };

  /**
   * Highlights the given item, or removes the highlight if the argument is null
   * or invalid.  Any previously-highlighted item will be un-highlighted.
   * @param {Node|undefined} item Item to highlight.
   */
  setHighlightedItem(item) {
    var items = /** @type {Array<Node>} */ (this.getContent());
    this.setHighlightedIndex(
        (items && item) ? googarray.indexOf(items, item) : -1);
  };

  /**
   * Returns the 0-based index of the currently selected palette item, or -1
   * if no item is selected.
   * @return {number} Index of the selected item (-1 if none).
   */
  getSelectedIndex() {
    return this.selectionModel_ ? this.selectionModel_.getSelectedIndex() : -1;
  };

  /**
   * Returns the currently selected palette item, or null if no item is selected.
   * @return {Node} The selected item (null if none).
   */
  getSelectedItem() {
    return this.selectionModel_ ?
        /** @type {Node} */ (this.selectionModel_.getSelectedItem()) :
                            null;
  };

  /**
   * Selects the item at the given 0-based index, or clears the selection
   * if the argument is -1 or out of range.  Any previously-selected item
   * will be deselected.
   * @param {number} index 0-based index of the item to select.
   */
  setSelectedIndex(index) {
    if (this.selectionModel_) {
      this.selectionModel_.setSelectedIndex(index);
    }
  };

  /**
   * Selects the given item, or clears the selection if the argument is null or
   * invalid.  Any previously-selected item will be deselected.
   * @param {Node} item Item to select.
   */
  setSelectedItem(item) {
    if (this.selectionModel_) {
      this.selectionModel_.setSelectedItem(item);
    }
  };

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
  highlightIndex_(index, highlight) {
    if (this.getElement()) {
      var items = this.getContent();
      if (items && index >= 0 && index < items.length) {
        var cellEl = this.getHighlightedCellElement_();
        if (this.currentCellControl_.getElement() != cellEl) {
          this.currentCellControl_.setElementInternal(cellEl);
        }
        if (this.currentCellControl_.tryHighlight(highlight)) {
          this.getRenderer().highlightCell(this, items[index], highlight);
        }
      }
    }
  };

  /** @override */
  setHighlighted(highlight) {
    if (highlight && this.highlightedIndex_ == -1) {
      // If there was a last highlighted index, use that. Otherwise, highlight the
      // first cell.
      this.setHighlightedIndex(
          this.lastHighlightedIndex_ > -1 ? this.lastHighlightedIndex_ : 0);
    } else if (!highlight) {
      this.setHighlightedIndex(-1);
    }
    // The highlight event should be fired once the component has updated its own
    // state.
    super.setHighlighted(highlight);
  };

  /**
   * Private helper; selects or deselects the given item based on the value of
   * the Boolean argument.  This implementation simply applies selection styling
   * to the cell containing the item to be selected.  Does nothing if the palette
   * hasn't been rendered yet.
   * @param {Node} item Item to select or deselect.
   * @param {boolean} select If true, the item is selected; otherwise it is
   *     deselected.
   * @private
   */
  selectItem_(item, select) {
    if (this.getElement()) {
      this.getRenderer().selectCell(this, item, select);
    }
  };

  /**
   * Calculates and updates the size of the palette based on any preset values
   * and the number of palette items.  If there is no preset size, sets the
   * palette size to the smallest square big enough to contain all items.  If
   * there is a preset number of columns, increases the number of rows to hold
   * all items if needed.  (If there are too many rows, does nothing.)
   * @private
   */
  adjustSize_() {
    var items = this.getContent();
    if (items) {
      if (this.size_ && this.size_.width) {
        // There is already a size set; honor the number of columns (if >0), but
        // increase the number of rows if needed.
        var minRows = Math.ceil(items.length / this.size_.width);
        if (typeof this.size_.height !== 'number' ||
            this.size_.height < minRows) {
          this.size_.height = minRows;
        }
      } else {
        // No size has been set; size the grid to the smallest square big enough
        // to hold all items (hey, why not?).
        var length = Math.ceil(Math.sqrt(items.length));
        this.size_ = new Size(length, length);
      }
    } else {
      // No items; set size to 0x0.
      this.size_ = new Size(0, 0);
    }
  };
}

// google.tagUnsealableClass(Palette);

/**
 * Events fired by the palette object
 * @enum {string}
 * @override
 * @suppress {checkTypes}
 */
Palette.EventType = {
  AFTER_HIGHLIGHT: goog_events.getUniqueId('afterhighlight')
};

// Component / Control implementation.

// Palette event handling.

// Palette management.

/**
 * A component to represent the currently highlighted cell.
 * @extends {Control}
 * @private
 */
Palette.CurrentCell_ = class extends Control {

  /**
   * A component to represent the currently highlighted cell.
   * @private
   */
  constructor() {
    super(null);
    this.setDispatchTransitionEvents(State.HOVER, true);
  }

  /**
   * @param {boolean} highlight Whether to highlight or unhighlight the component.
   * @return {boolean} Whether it was successful.
   */
  tryHighlight(highlight) {
    this.setHighlighted(highlight);
    return this.isHighlighted() == highlight;
  };
}

export {Palette};