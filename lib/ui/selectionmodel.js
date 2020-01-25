import * as googarray from './../array/array.js';
import {EventTarget as EventsEventTarget} from './../events/eventhandler.js';
import {EventType} from './../events/eventtype.js';
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
 * @fileoverview Single-selection model implemenation.
 *
 * TODO(attila): Add keyboard & mouse event hooks?
 * TODO(attila): Add multiple selection?
 */

/**
 * Single-selection model.  Dispatches a {@link EventType.SELECT}
 * event when a selection is made.
 * @extends {EventsEventTarget}
 */
class SelectionModel extends EventsEventTarget {

  /**
   * Single-selection model.  Dispatches a {@link EventType.SELECT}
   * event when a selection is made.
   * @param {Array<Object>=} opt_items Array of items; defaults to empty.
   */
  constructor(opt_items) {
    super();
    /**
     * The currently selected item (null if none).
     * @type {?Object}
     * @private
     */
    this.selectedItem_ = null;
  
    /**
     * Selection handler function.  Called with two arguments (the item to be
     * selected or deselected, and a Boolean indicating whether the item is to
     * be selected or deselected).
     * @type {?Function}
     * @private
     */
    this.selectionHandler_ = null;
  
  
    /**
     * Array of items controlled by the selection model.  If the items support
     * the `setSelected(Boolean)` interface, they will be (de)selected
     * as needed.
     * @type {!Array<Object>}
     * @private
     */
    this.items_ = [];
    this.addItems(opt_items);
  }

  /**
   * Returns the selection handler function used by the selection model to change
   * the internal selection state of items under its control.
   * @return {Function} Selection handler function (null if none).
   */
  getSelectionHandler() {
    return this.selectionHandler_;
  };

  /**
   * Sets the selection handler function to be used by the selection model to
   * change the internal selection state of items under its control.  The
   * function must take two arguments:  an item and a Boolean to indicate whether
   * the item is to be selected or deselected.  Selection handler functions are
   * only needed if the items in the selection model don't natively support the
   * `setSelected(Boolean)` interface.
   * @param {Function} handler Selection handler function.
   */
  setSelectionHandler(handler) {
    this.selectionHandler_ = handler;
  };

  /**
   * Returns the number of items controlled by the selection model.
   * @return {number} Number of items.
   */
  getItemCount() {
    return this.items_.length;
  };

  /**
   * Returns the 0-based index of the given item within the selection model, or
   * -1 if no such item is found.
   * @param {Object|undefined} item Item to look for.
   * @return {number} Index of the given item (-1 if none).
   */
  indexOfItem(item) {
    return item ? googarray.indexOf(this.items_, item) : -1;
  };

  /**
   * @return {Object|undefined} The first item, or undefined if there are no items
   *     in the model.
   */
  getFirst() {
    return this.items_[0];
  };

  /**
   * @return {Object|undefined} The last item, or undefined if there are no items
   *     in the model.
   */
  getLast() {
    return this.items_[this.items_.length - 1];
  };

  /**
   * Returns the item at the given 0-based index.
   * @param {number} index Index of the item to return.
   * @return {Object} Item at the given index (null if none).
   */
  getItemAt(index) {
    return this.items_[index] || null;
  };

  /**
   * Bulk-adds items to the selection model.  This is more efficient than calling
   * {@link #addItem} for each new item.
   * @param {Array<Object>|undefined} items New items to add.
   */
  addItems(items) {
    if (items) {
      // New items shouldn't be selected.
      googarray.forEach(
          items, function(item) { this.selectItem_(item, false); }, this);
      googarray.extend(this.items_, items);
    }
  };

  /**
   * Adds an item at the end of the list.
   * @param {Object} item Item to add.
   */
  addItem(item) {
    this.addItemAt(item, this.getItemCount());
  };

  /**
   * Adds an item at the given index.
   * @param {Object} item Item to add.
   * @param {number} index Index at which to add the new item.
   */
  addItemAt(item, index) {
    if (item) {
      // New items must not be selected.
      this.selectItem_(item, false);
      googarray.insertAt(this.items_, item, index);
    }
  };

  /**
   * Removes the given item (if it exists).  Dispatches a `SELECT` event if
   * the removed item was the currently selected item.
   * @param {Object} item Item to remove.
   */
  removeItem(item) {
    if (item && googarray.remove(this.items_, item)) {
      if (item == this.selectedItem_) {
        this.selectedItem_ = null;
        this.dispatchEvent(EventType.SELECT);
      }
    }
  };

  /**
   * Removes the item at the given index.
   * @param {number} index Index of the item to remove.
   */
  removeItemAt(index) {
    this.removeItem(this.getItemAt(index));
  };

  /**
   * @return {Object} The currently selected item, or null if none.
   */
  getSelectedItem() {
    return this.selectedItem_;
  };

  /**
   * @return {!Array<Object>} All items in the selection model.
   */
  getItems() {
    return googarray.clone(this.items_);
  };

  /**
   * Selects the given item, deselecting any previously selected item, and
   * dispatches a `SELECT` event.
   * @param {Object} item Item to select (null to clear the selection).
   */
  setSelectedItem(item) {
    if (item != this.selectedItem_) {
      this.selectItem_(this.selectedItem_, false);
      this.selectedItem_ = item;
      this.selectItem_(item, true);
    }
  
    // Always dispatch a SELECT event; let listeners decide what to do if the
    // selected item hasn't changed.
    this.dispatchEvent(EventType.SELECT);
  };

  /**
   * @return {number} The 0-based index of the currently selected item, or -1
   *     if none.
   */
  getSelectedIndex() {
    return this.indexOfItem(this.selectedItem_);
  };

  /**
   * Selects the item at the given index, deselecting any previously selected
   * item, and dispatches a `SELECT` event.
   * @param {number} index Index to select (-1 to clear the selection).
   */
  setSelectedIndex(index) {
    this.setSelectedItem(this.getItemAt(index));
  };

  /**
   * Clears the selection model by removing all items from the selection.
   */
  clear() {
    googarray.clear(this.items_);
    this.selectedItem_ = null;
  };

  /** @override */
  disposeInternal() {
    super.disposeInternal();
    delete this.items_;
    this.selectedItem_ = null;
  };

  /**
   * Private helper; selects or deselects the given item based on the value of
   * the `select` argument.  If a selection handler has been registered
   * (via {@link #setSelectionHandler}, calls it to update the internal selection
   * state of the item.  Otherwise, attempts to call `setSelected(Boolean)`
   * on the item itself, provided the object supports that interface.
   * @param {Object} item Item to select or deselect.
   * @param {boolean} select If true, the object will be selected; if false, it
   *     will be deselected.
   * @private
   */
  selectItem_(item, select) {
    if (item) {
      if (typeof this.selectionHandler_ == 'function') {
        // Use the registered selection handler function.
        this.selectionHandler_(item, select);
      } else if (typeof item.setSelected == 'function') {
        // Call setSelected() on the item, if it supports it.
        item.setSelected(select);
      }
    }
  };
}

// google.tagUnsealableClass(SelectionModel);

export {SelectionModel};