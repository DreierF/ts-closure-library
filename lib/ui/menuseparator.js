import {DomHelper} from './../dom/dom.js';
import * as registry from './control.js';
import {MenuSeparatorRenderer as Ui_MenuSeparatorRenderer} from './menuseparatorrenderer.js';
import {Separator} from './separator.js';
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
 * @fileoverview A class for representing menu separators.
 * @see goog.ui.Menu
 */

/**
 * Class representing a menu separator.  A menu separator extends {@link
 * Separator} by always setting its renderer to {@link
 * Ui_MenuSeparatorRenderer}.
 *     document interactions.
 * @extends {Separator}
 */
class MenuSeparator extends Separator {

  /**
   * Class representing a menu separator.  A menu separator extends {@link
   * Separator} by always setting its renderer to {@link
   * Ui_MenuSeparatorRenderer}.
   * @param {DomHelper=} opt_domHelper Optional DOM helper used for
   *     document interactions.
   */
  constructor(opt_domHelper) {
    super(Ui_MenuSeparatorRenderer.getInstance(), opt_domHelper);
  }
}

// Register a decorator factory function for goog.ui.MenuSeparators.
registry.setDecoratorByClassName(
    Ui_MenuSeparatorRenderer.CSS_CLASS, function() {
      // Separator defaults to using MenuSeparatorRenderer.
      return new Separator();
    });

export {MenuSeparator};