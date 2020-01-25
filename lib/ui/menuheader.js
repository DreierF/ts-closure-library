import {DomHelper} from './../dom/dom.js';
import {Component} from './component.js';
import {State} from './component.js';
import {Control} from './control.js';
import * as registry from './control.js';
import {ControlContent} from './controlcontent.js';
import {MenuHeaderRenderer as Ui_MenuHeaderRenderer} from './menuheaderrenderer.js';
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
 * @fileoverview A class for representing menu headers.
 * @see goog.ui.Menu
 */

/**
 * Class representing a menu header.
 *     display as the content of the item (use to add icons or styling to
 *     menus).
 *     document interactions.
 * @extends {Control<Ui_MenuHeaderRenderer>}
 */
class MenuHeader extends Control {

  /**
   * Class representing a menu header.
   * @param {ControlContent} content Text caption or DOM structure to
   *     display as the content of the item (use to add icons or styling to
   *     menus).
   * @param {DomHelper=} opt_domHelper Optional DOM helper used for
   *     document interactions.
   * @param {Ui_MenuHeaderRenderer=} opt_renderer Optional renderer.
   */
  constructor(content, opt_domHelper, opt_renderer) {
    super(content, opt_renderer || Ui_MenuHeaderRenderer.getInstance(),
        opt_domHelper);
  
    this.setSupportedState(State.DISABLED, false);
    this.setSupportedState(State.HOVER, false);
    this.setSupportedState(State.ACTIVE, false);
    this.setSupportedState(State.FOCUSED, false);
  
    // Headers are always considered disabled.
    this.setStateInternal(State.DISABLED);
  }
}

// Register a decorator factory function for goog.ui.MenuHeaders.
registry.setDecoratorByClassName(
    Ui_MenuHeaderRenderer.CSS_CLASS, function() {
      // MenuHeader defaults to using MenuHeaderRenderer.
      return new MenuHeader(null);
    });

export {MenuHeader};