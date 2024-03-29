import {Event as EventsEvent} from './../events/event.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

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