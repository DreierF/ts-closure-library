import {DomHelper} from './../dom/dom.js';
import {Component} from './component.js';
import {State} from './component.js';
import {Control} from './control.js';
import * as registry from './control.js';
import {ControlContent} from './controlcontent.js';
import {MenuHeaderRenderer as Ui_MenuHeaderRenderer} from './menuheaderrenderer.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

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