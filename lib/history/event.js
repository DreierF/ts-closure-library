import {Event as EventsEvent} from './../events/event.js';
import {EventType} from './eventtype.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview The event object dispatched when the history changes.
 */

/**
 * Event object dispatched after the history state has changed.
 *     action, such as forward or back, clicking on a link, editing the URL, or
 *     calling {@code window.history.(go|back|forward)}.
 *     False if the token has been changed by a `setToken` or
 *     `replaceToken` call.
 * @extends {EventsEvent}
 * @final
 */
class history_Event extends EventsEvent {

  /**
   * Event object dispatched after the history state has changed.
   * @param {string} token The string identifying the new history state.
   * @param {boolean} isNavigation True if the event was triggered by a browser
   *     action, such as forward or back, clicking on a link, editing the URL, or
   *     calling {@code window.history.(go|back|forward)}.
   *     False if the token has been changed by a `setToken` or
   *     `replaceToken` call.
   */
  constructor(token, isNavigation) {
    super(EventType.NAVIGATE);
  
    /**
     * The current history state.
     * @type {string}
     */
    this.token = token;
  
    /**
     * Whether the event was triggered by browser navigation.
     * @type {boolean}
     */
    this.isNavigation = isNavigation;
  }
}

export {history_Event as Event};