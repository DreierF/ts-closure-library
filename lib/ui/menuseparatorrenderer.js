import * as classlist from './../dom/classlist.js';
import * as dom from './../dom/dom.js';
import {TagName} from './../dom/tagname.js';
import * as google from './../google.js';
import {Control} from './control.js';
import {ControlRenderer} from './control.js';
import {ControlContent} from './controlcontent.js';
import {MenuSeparator as UiMenuSeparator} from './menuseparator.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Renderer for {@link UiMenuSeparator}s.
 */

/**
 * Renderer for menu separators.
 * @extends {ControlRenderer<UiMenuSeparator>}
 */
class MenuSeparatorRenderer extends ControlRenderer {

  /**
   * Renderer for menu separators.
   */
  constructor() {
    super();
  }

  /** @override @return {!MenuSeparatorRenderer} @suppress {checkTypes} */
  static getInstance() {
    if (MenuSeparatorRenderer.instance_) {
      return /** @type {!MenuSeparatorRenderer} */ (MenuSeparatorRenderer.instance_);
    }
    return /** @type {!MenuSeparatorRenderer} */ (MenuSeparatorRenderer.instance_) = new MenuSeparatorRenderer();
  };

  /**
   * Returns an empty, styled menu separator DIV.  Overrides {@link
   * ControlRenderer#createDom}.
   * @param {UiMenuSeparator} separator to render.
   * @return {!Element} Root element for the separator.
   * @override
   */
  createDom(separator) {
    return separator.getDomHelper().createDom(
        TagName.DIV, this.getCssClass());
  };

  /**
   * Takes an existing element, and decorates it with the separator.  Overrides
   * {@link ControlRenderer#decorate}.
   * @param {UiMenuSeparator} separator UiMenuSeparator to decorate the
   *     element.
   * @param {Element} element Element to decorate.
   * @return {!Element} Decorated element.
   * @override
   */
  decorate(
      separator, element) {
    // Normally handled in the superclass. But we don't call the superclass.
    if (element.id) {
      separator.setId(element.id);
    }
  
    if (element.tagName == TagName.HR) {
      // Replace HR with separator.
      var hr = element;
      element = this.createDom(separator);
      dom.insertSiblingBefore(element, hr);
      dom.removeNode(hr);
    } else {
      classlist.add(element, this.getCssClass());
    }
    return element;
  };

  /**
   * Overrides {@link ControlRenderer#setContent} to do nothing, since
   * separators are empty.
   * @param {Element} separator The separator's root element.
   * @param {ControlContent} content Text caption or DOM structure to be
   *    set as the separators's content (ignored).
   * @override
   */
  setContent(
      separator, content) {
    // Do nothing.  Separators are empty.
  };

  /**
   * Returns the CSS class to be applied to the root element of components
   * rendered using this renderer.
   * @return {string} Renderer-specific CSS class.
   * @override
   */
  getCssClass() {
    return MenuSeparatorRenderer.CSS_CLASS;
  };
}

/** @type {?MenuSeparatorRenderer} @suppress {underscore,checkTypes} @override */
MenuSeparatorRenderer.instance_ = undefined;

/**
 * Default CSS class to be applied to the root element of components rendered
 * by this renderer.
 * @type {string}
 * @override
 */
MenuSeparatorRenderer.CSS_CLASS = google.getCssName('goog-menuseparator');

export {MenuSeparatorRenderer};