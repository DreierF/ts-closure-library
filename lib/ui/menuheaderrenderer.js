import * as google from './../google.js';
import {ControlRenderer} from './control.js';
import {MenuHeader as UiMenuHeader} from './menuheader.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Renderer for {@link UiMenuHeader}s.
 */

/**
 * Renderer for menu headers.
 * @extends {ControlRenderer<UiMenuHeader>}
 */
class MenuHeaderRenderer extends ControlRenderer {

  /**
   * Renderer for menu headers.
   */
  constructor() {
    super();
  }

  /** @override @return {!MenuHeaderRenderer} @suppress {checkTypes} */
  static getInstance() {
    if (MenuHeaderRenderer.instance_) {
      return /** @type {!MenuHeaderRenderer} */ (MenuHeaderRenderer.instance_);
    }
    return /** @type {!MenuHeaderRenderer} */ (MenuHeaderRenderer.instance_) = new MenuHeaderRenderer();
  };

  /**
   * Returns the CSS class to be applied to the root element of components
   * rendered using this renderer.
   * @return {string} Renderer-specific CSS class.
   * @override
   */
  getCssClass() {
    return MenuHeaderRenderer.CSS_CLASS;
  };
}

/** @type {?MenuHeaderRenderer} @suppress {underscore,checkTypes} @override */
MenuHeaderRenderer.instance_ = undefined;

/**
 * Default CSS class to be applied to the root element of components rendered
 * by this renderer.
 * @type {string}
 * @override
 */
MenuHeaderRenderer.CSS_CLASS = google.getCssName('goog-menuheader');

export {MenuHeaderRenderer};