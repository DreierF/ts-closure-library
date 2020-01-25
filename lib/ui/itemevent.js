import {Event as EventsEvent} from './../events/event.js';
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
 * @fileoverview Definition of the ItemEvent class.
 */

/**
 * Generic ui event class for events that take a single item like a menu click
 * event.
 *
 * @extends {EventsEvent}
 *                        of this event.
 * @final
 */
class ItemEvent extends EventsEvent {

  /**
   * Generic ui event class for events that take a single item like a menu click
   * event.
   *
   * @param {string} type Event Type.
   * @param {Object} target Reference to the object that is the target
   *                        of this event.
   * @param {Object} item The item that was clicked.
   */
  constructor(type, target, item) {
    super(type, target);
  
    /**
     * Item for the event. The type of this object is specific to the type
     * of event. For a menu, it would be the menu item that was clicked. For a
     * listbox selection, it would be the listitem that was selected.
     *
     * @type {Object}
     */
    this.item = item;
  }
}

export {ItemEvent};