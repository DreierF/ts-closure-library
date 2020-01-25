import * as dom from './../dom/dom.js';
import {DragDropItem} from './abstractdragdrop.js';
import {AbstractDragDrop} from './abstractdragdrop.js';
// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Multiple Element Drag and Drop.
 *
 * Drag and drop implementation for sources/targets consisting of multiple
 * elements.
 *
 * @see ../demos/dragdrop.html
 */

/**
 * Drag/drop implementation for creating drag sources/drop targets consisting of
 * multiple HTML Elements (items). All items share the same drop target(s) but
 * can be dragged individually.
 *
 * @extends {AbstractDragDrop}
 * @class
 */
class DragDropGroup extends AbstractDragDrop {

  /**
   * Drag/drop implementation for creating drag sources/drop targets consisting of
   * multiple HTML Elements (items). All items share the same drop target(s) but
   * can be dragged individually.
   *
   */
  constructor() {
    super();
  }

  /**
   * Add item to drag object.
   *
   * @param {Element|string} element Dom Node, or string representation of node
   *     id, to be used as drag source/drop target.
   * @param {Object=} opt_data Data associated with the source/target.
   * @throws Error If no element argument is provided or if the type is
   *     invalid
   * @override
   */
  addItem(element, opt_data) {
    var item = new DragDropItem(element, opt_data);
    this.addDragDropItem(item);
  };

  /**
   * Add DragDropItem to drag object.
   *
   * @param {DragDropItem} item DragDropItem being added to the
   *     drag object.
   * @throws Error If no element argument is provided or if the type is
   *     invalid
   */
  addDragDropItem(item) {
    item.setParent(this);
    this.items_.push(item);
    if (this.isInitialized()) {
      this.initItem(item);
    }
  };

  /**
   * Remove item from drag object.
   *
   * @param {Element|string} element Dom Node, or string representation of node
   *     id, that was previously added with addItem().
   */
  removeItem(element) {
    element = dom.getElement(element);
    for (var item, i = 0; item = this.items_[i]; i++) {
      if (item.element == element) {
        this.items_.splice(i, 1);
        this.disposeItem(item);
        break;
      }
    }
  };

  /**
   * Marks the supplied list of items as selected. A drag operation for any of the
   * selected items will affect all of them.
   *
   * @param {Array<DragDropItem>} list List of items to select or null to
   *     clear selection.
   *
   * TODO(eae): Not yet implemented.
   */
  setSelection(list) {
  
  };
}

export {DragDropGroup};