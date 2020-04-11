import {Role} from './../a11y/aria/roles.js';
import * as asserts from './../asserts/asserts.js';
import * as classlist from './../dom/classlist.js';
import * as goog_dom from './../dom/dom.js';
import {DomHelper} from './../dom/dom.js';
import {TagName} from './../dom/tagname.js';
import * as google from './../google.js';
import {Component} from './component.js';
import {State} from './component.js';
import {Control} from './control.js';
import {ControlRenderer} from './control.js';
import {ControlContent} from './controlcontent.js';
import {MenuItem as UiMenuItem} from './menu.js';
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
 * @fileoverview Renderer for {@link UiMenuItem}s.
 */

/**
 * Default renderer for {@link UiMenuItem}s.  Each item has the following
 * structure:
 *
 *    <div class="goog-menuitem">
 *      <div class="goog-menuitem-content">
 *        ...(menu item contents)...
 *      </div>
 *    </div>
 *
 * @extends {ControlRenderer<UiMenuItem>}
 */
class MenuItemRenderer extends ControlRenderer {

  /**
   * Default renderer for {@link UiMenuItem}s.  Each item has the following
   * structure:
   *
   *    <div class="goog-menuitem">
   *      <div class="goog-menuitem-content">
   *        ...(menu item contents)...
   *      </div>
   *    </div>
   *
   */
  constructor() {
    super();
  
    /**
     * Commonly used CSS class names, cached here for convenience (and to avoid
     * unnecessary string concatenation).
     * @type {!Array<string>}
     * @private
     */
    this.classNameCache_ = [];
  }

  /** @override @return {!MenuItemRenderer} @suppress {checkTypes} */
  static getInstance() {
    if (MenuItemRenderer.instance_) {
      return /** @type {!MenuItemRenderer} */ (MenuItemRenderer.instance_);
    }
    return /** @type {!MenuItemRenderer} */ (MenuItemRenderer.instance_) = new MenuItemRenderer();
  };

  /**
   * Returns the composite CSS class by using the cached value or by constructing
   * the value from the base CSS class and the passed index.
   * @param {MenuItemRenderer.CompositeCssClassIndex_} index Index for the
   *     CSS class - could be highlight, checkbox or content in usual cases.
   * @return {string} The composite CSS class.
   * @private
   */
  getCompositeCssClass_(index) {
    var result = this.classNameCache_[index];
    if (!result) {
      switch (index) {
        case MenuItemRenderer.CompositeCssClassIndex_.HOVER:
          result = google.getCssName(this.getStructuralCssClass(), 'highlight');
          break;
        case MenuItemRenderer.CompositeCssClassIndex_.CHECKBOX:
          result = google.getCssName(this.getStructuralCssClass(), 'checkbox');
          break;
        case MenuItemRenderer.CompositeCssClassIndex_.CONTENT:
          result = google.getCssName(this.getStructuralCssClass(), 'content');
          break;
      }
      this.classNameCache_[index] = result;
    }
  
    return result;
  };

  /** @override */
  getAriaRole() {
    return Role.MENU_ITEM;
  };

  /**
   * Overrides {@link ControlRenderer#createDom} by adding extra markup
   * and stying to the menu item's element if it is selectable or checkable.
   * @param {Control} item Menu item to render.
   * @return {Element} Root element for the item.
   * @override
   */
  createDom(item) {
    var element = item.getDomHelper().createDom(
        TagName.DIV, this.getClassNames(item).join(' '),
        this.createContent(item.getContent(), item.getDomHelper()));
    this.setEnableCheckBoxStructure(
        item, element, item.isSupportedState(State.SELECTED) ||
            item.isSupportedState(State.CHECKED));
    return element;
  };

  /** @override */
  getContentElement(element) {
    return /** @type {Element} */ (element && element.firstChild);
  };

  /**
   * Overrides {@link ControlRenderer#decorate} by initializing the
   * menu item to checkable based on whether the element to be decorated has
   * extra stying indicating that it should be.
   * @param {Control} item Menu item instance to decorate the element.
   * @param {Element} element Element to decorate.
   * @return {Element} Decorated element.
   * @override
   */
  decorate(item, element) {
    asserts.assert(element);
    if (!this.hasContentStructure(element)) {
      element.appendChild(
          this.createContent(element.childNodes, item.getDomHelper()));
    }
    if (classlist.contains(element, google.getCssName('goog-option'))) {
      (/** @type {UiMenuItem} */ (item)).setCheckable(true);
      this.setCheckable(item, element, true);
    }
    return super.decorate(item, element);
  };

  /**
   * Takes a menu item's root element, and sets its content to the given text
   * caption or DOM structure.  Overrides the superclass immplementation by
   * making sure that the checkbox structure (for selectable/checkable menu
   * items) is preserved.
   * @param {Element} element The item's root element.
   * @param {ControlContent} content Text caption or DOM structure to be
   *     set as the item's content.
   * @override
   */
  setContent(element, content) {
    // Save the checkbox element, if present.
    var contentElement = this.getContentElement(element);
    var checkBoxElement =
        this.hasCheckBoxStructure(element) ? contentElement.firstChild : null;
    super.setContent(element, content);
    if (checkBoxElement && !this.hasCheckBoxStructure(element)) {
      // The call to setContent() blew away the checkbox element; reattach it.
      contentElement.insertBefore(
          checkBoxElement, contentElement.firstChild || null);
    }
  };

  /**
   * Returns true if the element appears to have a proper menu item structure by
   * checking whether its first child has the appropriate structural class name.
   * @param {Element} element Element to check.
   * @return {boolean} Whether the element appears to have a proper menu item DOM.
   * @protected
   */
  hasContentStructure(element) {
    var child = goog_dom.getFirstElementChild(element);
    var contentClassName = this.getCompositeCssClass_(
        MenuItemRenderer.CompositeCssClassIndex_.CONTENT);
    return !!child && classlist.contains(child, contentClassName);
  };

  /**
   * Wraps the given text caption or existing DOM node(s) in a structural element
   * containing the menu item's contents.
   * @param {ControlContent} content Menu item contents.
   * @param {DomHelper} dom DOM helper for document interaction.
   * @return {Element} Menu item content element.
   * @protected
   */
  createContent(content, dom) {
    var contentClassName = this.getCompositeCssClass_(
        MenuItemRenderer.CompositeCssClassIndex_.CONTENT);
    return dom.createDom(TagName.DIV, contentClassName, content);
  };

  /**
   * Enables/disables radio button semantics on the menu item.
   * @param {Control} item Menu item to update.
   * @param {Element} element Menu item element to update (may be null if the
   *     item hasn't been rendered yet).
   * @param {boolean} selectable Whether the item should be selectable.
   */
  setSelectable(
      item, element, selectable) {
    if (item && element) {
      this.setEnableCheckBoxStructure(item, element, selectable);
    }
  };

  /**
   * Enables/disables checkbox semantics on the menu item.
   * @param {Control} item Menu item to update.
   * @param {Element} element Menu item element to update (may be null if the
   *     item hasn't been rendered yet).
   * @param {boolean} checkable Whether the item should be checkable.
   */
  setCheckable(
      item, element, checkable) {
    if (item && element) {
      this.setEnableCheckBoxStructure(item, element, checkable);
    }
  };

  /**
   * Determines whether the item contains a checkbox element.
   * @param {Element} element Menu item root element.
   * @return {boolean} Whether the element contains a checkbox element.
   * @protected
   */
  hasCheckBoxStructure(element) {
    var contentElement = this.getContentElement(element);
    if (contentElement) {
      var child = contentElement.firstChild;
      var checkboxClassName = this.getCompositeCssClass_(
          MenuItemRenderer.CompositeCssClassIndex_.CHECKBOX);
      return !!child && goog_dom.isElement(child) &&
          classlist.contains(
              /** @type {!Element} */ (child), checkboxClassName);
    }
    return false;
  };

  /**
   * Adds or removes extra markup and CSS styling to the menu item to make it
   * selectable or non-selectable, depending on the value of the
   * `selectable` argument.
   * @param {!Control} item Menu item to update.
   * @param {!Element} element Menu item element to update.
   * @param {boolean} enable Whether to add or remove the checkbox structure.
   * @protected
   */
  setEnableCheckBoxStructure(
      item, element, enable) {
    this.setAriaRole(element, item.getPreferredAriaRole());
    this.setAriaStates(item, element);
    if (enable != this.hasCheckBoxStructure(element)) {
      classlist.enable(element, google.getCssName('goog-option'), enable);
      var contentElement = this.getContentElement(element);
      if (enable) {
        // Insert checkbox structure.
        var checkboxClassName = this.getCompositeCssClass_(
            MenuItemRenderer.CompositeCssClassIndex_.CHECKBOX);
        contentElement.insertBefore(
            item.getDomHelper().createDom(
                TagName.DIV, checkboxClassName),
            contentElement.firstChild || null);
      } else {
        // Remove checkbox structure.
        contentElement.removeChild(contentElement.firstChild);
      }
    }
  };

  /**
   * Takes a single {@link State}, and returns the
   * corresponding CSS class name (null if none).  Overrides the superclass
   * implementation by using 'highlight' as opposed to 'hover' as the CSS
   * class name suffix for the HOVER state, for backwards compatibility.
   * @param {State} state Component state.
   * @return {string|undefined} CSS class representing the given state
   *     (undefined if none).
   * @override
   */
  getClassForState(state) {
    switch (state) {
      case State.HOVER:
        // We use 'highlight' as the suffix, for backwards compatibility.
        return this.getCompositeCssClass_(
            MenuItemRenderer.CompositeCssClassIndex_.HOVER);
      case State.CHECKED:
      case State.SELECTED:
        // We use 'goog-option-selected' as the class, for backwards
        // compatibility.
        return google.getCssName('goog-option-selected');
      default:
        return super.getClassForState(state);
    }
  };

  /**
   * Takes a single CSS class name which may represent a component state, and
   * returns the corresponding component state (0x00 if none).  Overrides the
   * superclass implementation by treating 'goog-option-selected' as special,
   * for backwards compatibility.
   * @param {string} className CSS class name, possibly representing a component
   *     state.
   * @return {State} state Component state corresponding
   *     to the given CSS class (0x00 if none).
   * @override
   */
  getStateFromClass(className) {
    var hoverClassName = this.getCompositeCssClass_(
        MenuItemRenderer.CompositeCssClassIndex_.HOVER);
    switch (className) {
      case google.getCssName('goog-option-selected'):
        return State.CHECKED;
      case hoverClassName:
        return State.HOVER;
      default:
        return super.getStateFromClass(className);
    }
  };

  /** @override */
  getCssClass() {
    return MenuItemRenderer.CSS_CLASS;
  };
}

/** @type {?MenuItemRenderer} @suppress {underscore,checkTypes} @override */
MenuItemRenderer.instance_ = undefined;

/**
 * CSS class name the renderer applies to menu item elements.
 * @type {string}
 * @override
 */
MenuItemRenderer.CSS_CLASS = google.getCssName('goog-menuitem');

/**
 * Constants for referencing composite CSS classes.
 * @enum {number}
 * @private
 */
MenuItemRenderer.CompositeCssClassIndex_ = {
  HOVER: 0,
  CHECKBOX: 1,
  CONTENT: 2
};

export {MenuItemRenderer};