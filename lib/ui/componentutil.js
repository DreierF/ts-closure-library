import {MouseEvents} from './../events/eventtype.js';
import {MouseAsMouseEventType} from './../events/eventtype.js';
import {PointerAsMouseEventType} from './../events/eventtype.js';
import {Component} from './component.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Static utility methods for UI components.
 */

/**
 * @param {!Component} component
 * @return {!MouseEvents} The browser events that should be listened
 *     to for the given mouse events.
 */
function getMouseEventType(component) {
  return component.pointerEventsEnabled() ?
      PointerAsMouseEventType :
      MouseAsMouseEventType;
};

export {getMouseEventType};