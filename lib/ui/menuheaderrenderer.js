import * as google from './../google.js';
import {ControlRenderer} from './control.js';
import {MenuHeader as UiMenuHeader} from './menuheader.js';
// Copyright 2008 The Closure Library Authors. All Rights Reserved.
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