import {Event as EventsEvent} from './event.js';
import {EventId} from './eventid.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview A typedef for event like objects that are dispatchable via the
 * goog.events.dispatchEvent function.
 */

/**
 * A typedef for event like objects that are dispatchable via the
 * goog.events.dispatchEvent function. strings are treated as the type for a
 * EventsEvent. Objects are treated as an extension of a new
 * EventsEvent with the type property of the object being used as the type
 * of the Event.
 * @typedef {string|Object|EventsEvent|EventId}
 */
let EventLike;

export {EventLike};