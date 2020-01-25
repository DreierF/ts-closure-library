import {MouseEvents} from './../events/eventtype.js';
import {MouseAsMouseEventType} from './../events/eventtype.js';
import {PointerAsMouseEventType} from './../events/eventtype.js';
import {Component} from './component.js';
// Copyright 2018 The Closure Library Authors. All Rights Reserved.
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