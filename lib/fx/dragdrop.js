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
 * @fileoverview Single Element Drag and Drop.
 *
 * Drag and drop implementation for sources/targets consisting of a single
 * element.
 *
 * @see ../demos/dragdrop.html
 */

/**
 * Drag/drop implementation for creating drag sources/drop targets consisting of
 * a single HTML Element.
 *
 *     id, to be used as drag source/drop target.
 * @throws Error If no element argument is provided or if the type is invalid
 * @extends {AbstractDragDrop}
 * @class
 * @abstract
 */
class DragDrop extends AbstractDragDrop {

  /**
   * Drag/drop implementation for creating drag sources/drop targets consisting of
   * a single HTML Element.
   *
   * @param {Element|string} element Dom Node, or string representation of node
   *     id, to be used as drag source/drop target.
   * @param {Object=} opt_data Data associated with the source/target.
   * @throws Error If no element argument is provided or if the type is invalid
   */
  constructor(element, opt_data) {
    super();
  
    var item = new DragDropItem(element, opt_data);
    item.setParent(this);
    this.items_.push(item);
  }
}

export {DragDrop};