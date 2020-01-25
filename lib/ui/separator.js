import * as aria from './../a11y/aria/aria.js';
import * as asserts from './../asserts/asserts.js';
import {DomHelper} from './../dom/dom.js';
import {Component} from './component.js';
import {State} from './component.js';
import {Control} from './control.js';
import * as registry from './control.js';
import {MenuSeparatorRenderer as Ui_MenuSeparatorRenderer} from './menuseparatorrenderer.js';
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
 * @fileoverview A class for representing a separator, with renderers for both
 * horizontal (menu) and vertical (toolbar) separators.
 */

/**
 * Class representing a separator.  Although it extends {@link Control},
 * the Separator class doesn't allocate any event handlers, nor does it change
 * its appearance on mouseover, etc.
 *    decorate the separator; defaults to {@link Ui_MenuSeparatorRenderer}.
 *    document interaction.
 * @extends {Control<Ui_MenuSeparatorRenderer>}
 */
class Separator extends Control {

  /**
   * Class representing a separator.  Although it extends {@link Control},
   * the Separator class doesn't allocate any event handlers, nor does it change
   * its appearance on mouseover, etc.
   * @param {Ui_MenuSeparatorRenderer=} opt_renderer Renderer to render or
   *    decorate the separator; defaults to {@link Ui_MenuSeparatorRenderer}.
   * @param {DomHelper=} opt_domHelper Optional DOM helper, used for
   *    document interaction.
   */
  constructor(opt_renderer, opt_domHelper) {
    super(null, opt_renderer || Ui_MenuSeparatorRenderer.getInstance(),
        opt_domHelper);
  
    this.setSupportedState(State.DISABLED, false);
    this.setSupportedState(State.HOVER, false);
    this.setSupportedState(State.ACTIVE, false);
    this.setSupportedState(State.FOCUSED, false);
  
    // Separators are always considered disabled.
    this.setStateInternal(State.DISABLED);
  }

  /**
   * Configures the component after its DOM has been rendered.  Overrides
   * {@link Control#enterDocument} by making sure no event handler
   * is allocated.
   * @override
   */
  enterDocument() {
    super.enterDocument();
    var element = this.getElement();
    asserts.assert(
        element, 'The DOM element for the separator cannot be null.');
    aria.setRole(element, 'separator');
  };
}

// Register a decorator factory function for goog.ui.MenuSeparators.
registry.setDecoratorByClassName(
    Ui_MenuSeparatorRenderer.CSS_CLASS, function() {
      // Separator defaults to using MenuSeparatorRenderer.
      return new Separator();
    });

export {Separator};