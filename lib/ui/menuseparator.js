import {DomHelper} from './../dom/dom.js';
import * as registry from './control.js';
import {MenuSeparatorRenderer as Ui_MenuSeparatorRenderer} from './menuseparatorrenderer.js';
import {Separator} from './separator.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

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