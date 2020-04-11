import * as aria from './../a11y/aria/aria.js';
import {State as AriaState} from './../a11y/aria/attributes.js';
import {Role as AriaRole} from './../a11y/aria/roles.js';
import {Role} from './../a11y/aria/roles.js';
import * as googarray from './../array/array.js';
import * as asserts from './../asserts/asserts.js';
import * as classlist from './../dom/classlist.js';
import * as _googdom from './../dom/dom.js';
import * as googdom from './../dom/dom.js';
import {DomHelper} from './../dom/dom.js';
import {TagName as DomTagName} from './../dom/tagname.js';
import {TagName} from './../dom/tagname.js';
import {BrowserEvent as EventsBrowserEvent} from './../events/browserevent.js';
import {Event as EventsEvent} from './../events/event.js';
import {KeyCodes} from './../events/keycodes.js';
import * as google from './../google.js';
import {Coordinate as MathCoordinate} from './../math/coordinate.js';
import {Coordinate} from './../math/coordinate.js';
import * as googstrings from './../string/string.js';
import * as strings from './../string/string.js';
import * as style from './../style/style.js';
import {Component} from './component.js';
import {State} from './component.js';
import {EventType} from './component.js';
import {Container} from './container.js';
import {ContainerRenderer} from './container.js';
import {Orientation} from './container.js';
import {Control} from './control.js';
import * as registry from './control.js';
import {ControlContent} from './controlcontent.js';
import {MenuHeader} from './menuheader.js';
import {MenuItemRenderer as Ui_MenuItemRenderer} from './menuitemrenderer.js';
import {MenuSeparator} from './menuseparator.js';
import {Separator} from './separator.js';
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
 * @fileoverview Renderer for {@link Menu}s.
 */

/**
 * Default renderer for {@link Menu}s, based on {@link
 * ContainerRenderer}.
 * @extends {ContainerRenderer}
 */
class MenuRenderer extends ContainerRenderer {

  /**
   * Default renderer for {@link Menu}s, based on {@link
   * ContainerRenderer}.
   * @param {string=} opt_ariaRole Optional ARIA role used for the element.
   */
  constructor(opt_ariaRole) {
    super(opt_ariaRole || Role.MENU);
  }

  /** @override @return {!MenuRenderer} @suppress {checkTypes} */
  static getInstance() {
    if (MenuRenderer.instance_) {
      return /** @type {!MenuRenderer} */ (MenuRenderer.instance_);
    }
    return /** @type {!MenuRenderer} */ (MenuRenderer.instance_) = new MenuRenderer();
  };

  /**
   * Returns whether the element is a UL or acceptable to our superclass.
   * @param {Element} element Element to decorate.
   * @return {boolean} Whether the renderer can decorate the element.
   * @override
   */
  canDecorate(element) {
    return element.tagName == TagName.UL ||
        super.canDecorate(element);
  };

  /**
   * Inspects the element, and creates an instance of {@link Control} or
   * an appropriate subclass best suited to decorate it.  Overrides the superclass
   * implementation by recognizing HR elements as separators.
   * @param {Element} element Element to decorate.
   * @return {Control?} A new control suitable to decorate the element
   *     (null if none).
   * @override
   */
  getDecoratorForChild(element) {
    return element.tagName == TagName.HR ?
        new Separator() :
        super.getDecoratorForChild(element);
  };

  /**
   * Returns whether the given element is contained in the menu's DOM.
   * @param {Menu} menu The menu to test.
   * @param {Element} element The element to test.
   * @return {boolean} Whether the given element is contained in the menu.
   */
  containsElement(menu, element) {
    return googdom.contains(menu.getElement(), element);
  };

  /**
   * Returns the CSS class to be applied to the root element of containers
   * rendered using this renderer.
   * @return {string} Renderer-specific CSS class.
   * @override
   */
  getCssClass() {
    return MenuRenderer.CSS_CLASS;
  };

  /** @override */
  initializeDom(container) {
    super.initializeDom(container);
  
    var element = container.getElement();
    asserts.assert(element, 'The menu DOM element cannot be null.');
    aria.setState(element, AriaState.HASPOPUP, 'true');
  };
}

/** @type {?MenuRenderer} @suppress {underscore,checkTypes} @override */
MenuRenderer.instance_ = undefined;

/**
 * Default CSS class to be applied to the root element of toolbars rendered
 * by this renderer.
 * @type {string}
 * @override
 */
MenuRenderer.CSS_CLASS = google.getCssName('goog-menu');

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
 * @fileoverview A class for representing items in menus.
 * @see Menu
 *
 * @see ../demos/menuitem.html
 */

  // circular

/**
 * Class representing an item in a menu.
 *
 *     display as the content of the item (use to add icons or styling to
 *     menus).
 *     document interactions.
 * @extends {Control<Ui_MenuItemRenderer>}
 */
class MenuItem extends Control {

  /**
   * Class representing an item in a menu.
   *
   * @param {ControlContent} content Text caption or DOM structure to
   *     display as the content of the item (use to add icons or styling to
   *     menus).
   * @param {*=} opt_model Data/model associated with the menu item.
   * @param {DomHelper=} opt_domHelper Optional DOM helper used for
   *     document interactions.
   * @param {Ui_MenuItemRenderer=} opt_renderer Optional renderer.
   */
  constructor(content, opt_model, opt_domHelper, opt_renderer) {
    super(content, opt_renderer || Ui_MenuItemRenderer.getInstance(),
        opt_domHelper);
    /**
     * The access key for this menu item. This key allows the user to quickly
     * trigger this item's action with they keyboard. For example, setting the
     * mnenomic key to 70 (F), when the user opens the menu and hits "F," the
     * menu item is triggered.
     *
     * @type {?KeyCodes}
     * @private
     */
    this.mnemonicKey_ = null;
  
    this.setValue(opt_model);
  }

  /**
   * Returns the value associated with the menu item.  The default implementation
   * returns the model object associated with the item (if any), or its caption.
   * @return {*} Value associated with the menu item, if any, or its caption.
   */
  getValue() {
    var model = this.getModel();
    return model != null ? model : this.getCaption();
  };

  /**
   * Sets the value associated with the menu item.  The default implementation
   * stores the value as the model of the menu item.
   * @param {*} value Value to be associated with the menu item.
   */
  setValue(value) {
    this.setModel(value);
  };

  /** @override */
  setSupportedState(state, support) {
    super.setSupportedState(state, support);
    switch (state) {
      case State.SELECTED:
        this.setSelectableInternal_(support);
        break;
      case State.CHECKED:
        this.setCheckableInternal_(support);
        break;
    }
  };

  /**
   * Sets the menu item to be selectable or not.  Set to true for menu items
   * that represent selectable options.
   * @param {boolean} selectable Whether the menu item is selectable.
   */
  setSelectable(selectable) {
    this.setSupportedState(State.SELECTED, selectable);
  };

  /**
   * Sets the menu item to be selectable or not.
   * @param {boolean} selectable  Whether the menu item is selectable.
   * @private
   */
  setSelectableInternal_(selectable) {
    if (this.isChecked() && !selectable) {
      this.setChecked(false);
    }
  
    var element = this.getElement();
    if (element) {
      this.getRenderer().setSelectable(this, element, selectable);
    }
  };

  /**
   * Sets the menu item to be checkable or not.  Set to true for menu items
   * that represent checkable options.
   * @param {boolean} checkable Whether the menu item is checkable.
   */
  setCheckable(checkable) {
    this.setSupportedState(State.CHECKED, checkable);
  };

  /**
   * Sets the menu item to be checkable or not.
   * @param {boolean} checkable Whether the menu item is checkable.
   * @private
   */
  setCheckableInternal_(checkable) {
    var element = this.getElement();
    if (element) {
      this.getRenderer().setCheckable(this, element, checkable);
    }
  };

  /**
   * Returns the text caption of the component while ignoring accelerators.
   * @suppress{checkTypes}
   * @override
   */
  getCaption() {
    var content = this.getContent();
    if (google.isArray(content)) {
      var acceleratorClass = MenuItem.ACCELERATOR_CLASS;
      var mnemonicWrapClass = MenuItem.MNEMONIC_WRAPPER_CLASS_;
      var caption =
          googarray
              .map(
                  content,
                  function(node) {
                    if (googdom.isElement(node) &&
                        (classlist.contains(
                             /** @type {!Element} */ (node), acceleratorClass) ||
                         classlist.contains(
                             /** @type {!Element} */ (node),
                             mnemonicWrapClass))) {
                      return '';
                    } else {
                      return googdom.getRawTextContent(node);
                    }
                  })
              .join('');
      return strings.collapseBreakingSpaces(caption);
    }
    return super.getCaption();
  };

  /**
   * @suppress {checkTypes}
   * @return {?string} The keyboard accelerator text, or null if the menu item doesn't have one.
   */
  getAccelerator() {
    var dom = this.getDomHelper();
    var content = this.getContent();
    if (google.isArray(content)) {
      var acceleratorEl = googarray.find(content, function(e) {
        return classlist.contains(
            /** @type {!Element} */ (e), MenuItem.ACCELERATOR_CLASS);
      });
      if (acceleratorEl) {
        return dom.getTextContent(acceleratorEl);
      }
    }
    return null;
  };

  /** @override */
  handleMouseUp(e) {
    var parentMenu = /** @type {Menu} */ (this.getParent());
  
    e = /** @type {!EventsBrowserEvent} */ (e);
    if (parentMenu) {
      var oldCoords = parentMenu.openingCoords;
      // Clear out the saved opening coords immediately so they're not used twice.
      parentMenu.openingCoords = null;
  
      if (oldCoords && typeof e.clientX === 'number') {
        var newCoords = new Coordinate(e.clientX, e.clientY);
        if (Coordinate.equals(oldCoords, newCoords)) {
          // This menu was opened by a mousedown and we're handling the consequent
          // mouseup. The coords haven't changed, meaning this was a simple click,
          // not a click and drag. Don't do the usual behavior because the menu
          // just popped up under the mouse and the user didn't mean to activate
          // this item.
          return;
        }
      }
    }
  
    super.handleMouseUp(e);
  };

  /** @override */
  handleKeyEventInternal(e) {
    if (e.keyCode == this.getMnemonic() && this.performActionInternal(e)) {
      return true;
    } else {
      return super.handleKeyEventInternal(e);
    }
  };

  /**
   * Sets the mnemonic key code. The mnemonic is the key associated with this
   * action.
   * @param {KeyCodes} key The key code.
   */
  setMnemonic(key) {
    this.mnemonicKey_ = key;
  };

  /**
   * Gets the mnemonic key code. The mnemonic is the key associated with this
   * action.
   * @return {?KeyCodes} The key code of the mnemonic key.
   */
  getMnemonic() {
    return this.mnemonicKey_;
  };

  /**
   * @override
   */
  getPreferredAriaRole() {
    if (this.isSupportedState(State.CHECKED)) {
      return Role.MENU_ITEM_CHECKBOX;
    }
    if (this.isSupportedState(State.SELECTED)) {
      return Role.MENU_ITEM_RADIO;
    }
    return super.getPreferredAriaRole();
  };

  /**
   * @override
   * @return {Menu}
   */
  getParent() {
    return /** @type {Menu} */ (
        Control.prototype.getParent.call(this));
  };

  /**
   * @override
   * @return {Menu}
   */
  getParentEventTarget() {
    return /** @type {Menu} */ (
        Control.prototype.getParentEventTarget.call(this));
  };
}

// google.tagUnsealableClass(MenuItem);

/**
 * The class set on an element that contains a parenthetical mnemonic key hint.
 * Parenthetical hints are added to items in which the mnemonic key is not found
 * within the menu item's caption itself. For example, if you have a menu item
 * with the caption "Record," but its mnemonic key is "I", the caption displayed
 * in the menu will appear as "Record (I)".
 *
 * @type {string}
 * @private
 */
MenuItem.MNEMONIC_WRAPPER_CLASS_ =
    google.getCssName('goog-menuitem-mnemonic-separator');

/**
 * The class set on an element that contains a keyboard accelerator hint.
 * @type {string}
 */
MenuItem.ACCELERATOR_CLASS = google.getCssName('goog-menuitem-accel');

// Component and Control implementation.

// Register a decorator factory function for goog.ui.MenuItems.
registry.setDecoratorByClassName(
    Ui_MenuItemRenderer.CSS_CLASS, function() {
      // MenuItem defaults to using MenuItemRenderer.
      return new MenuItem(null);
    });

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
 * @fileoverview A base menu class that supports key and mouse events. The menu
 * can be bound to an existing HTML structure or can generate its own DOM.
 *
 * To decorate, the menu should be bound to an element containing children
 * with the classname 'goog-menuitem'.  HRs will be classed as separators.
 *
 * Decorate Example:
 * <div id="menu" class="goog-menu" tabIndex="0">
 *   <div class="goog-menuitem">Google</div>
 *   <div class="goog-menuitem">Yahoo</div>
 *   <div class="goog-menuitem">MSN</div>
 *   <hr>
 *   <div class="goog-menuitem">New...</div>
 * </div>
 * <script>
 *
 * var menu = new Menu();
 * menu.decorate(googdom.getElement('menu'));
 *
 * TESTED=FireFox 2.0, IE6, Opera 9, Chrome.
 * TODO(user): Key handling is flaky in Opera and Chrome
 * TODO(user): Rename all references of "item" to child since menu is
 * essentially very generic and could, in theory, host a date or color picker.
 *
 * @see ../demos/menu.html
 * @see ../demos/menus.html
 */

// The dependencies MenuHeader, MenuItem, and MenuSeparator are implicit.
// There are no references in the code, but we need to load these
// classes before Menu.

// TODO(robbyw): Reverse constructor argument order for consistency.
/**
 * A basic menu class.
 *     decorate the container; defaults to {@link MenuRenderer}.
 * @extends {Container<MenuRenderer>}
 */
class Menu extends Container {

  /**
   * A basic menu class.
   * @param {DomHelper=} opt_domHelper Optional DOM helper.
   * @param {MenuRenderer=} opt_renderer Renderer used to render or
   *     decorate the container; defaults to {@link MenuRenderer}.
   */
  constructor(opt_domHelper, opt_renderer) {
    super(Orientation.VERTICAL,
        opt_renderer || MenuRenderer.getInstance(), opt_domHelper);
    /**
     * Coordinates of the mousedown event that caused this menu to be made visible.
     * Used to prevent the consequent mouseup event due to a simple click from
     * activating a menu item immediately. Considered protected; should only be used
     * within this package or by subclasses.
     * @type {Coordinate|undefined}
     */
    this.openingCoords = undefined;
  
    /**
     * Whether the menu can move the focus to its key event target when it is
     * shown.  Default = true
     * @type {boolean}
     * @private
     */
    this.allowAutoFocus_ = true;
  
    /**
     * Whether the menu should use windows style behavior and allow disabled menu
     * items to be highlighted (though not selectable).  Defaults to false
     * @type {boolean}
     * @private
     */
    this.allowHighlightDisabled_ = false;
  
  
    // Unlike Containers, Menus aren't keyboard-accessible by default.  This line
    // preserves backwards compatibility with code that depends on menus not
    // receiving focus - e.g. `goog.ui.MenuButton`.
    this.setFocusable(false);
  }

  /**
   * Returns the CSS class applied to menu elements, also used as the prefix for
   * derived styles, if any.  Subclasses should override this method as needed.
   * Considered protected.
   * @return {string} The CSS class applied to menu elements.
   * @protected
   * @deprecated Use getRenderer().getCssClass().
   */
  getCssClass() {
    return this.getRenderer().getCssClass();
  };

  /**
   * Returns whether the provided element is to be considered inside the menu for
   * purposes such as dismissing the menu on an event.  This is so submenus can
   * make use of elements outside their own DOM.
   * @param {Element} element The element to test for.
   * @return {boolean} Whether the provided element is to be considered inside
   *     the menu.
   */
  containsElement(element) {
    if (this.getRenderer().containsElement(this, element)) {
      return true;
    }
  
    for (var i = 0, count = this.getChildCount(); i < count; i++) {
      var child = this.getChildAt(i);
      if (typeof child.containsElement == 'function' &&
          child.containsElement(element)) {
        return true;
      }
    }
  
    return false;
  };

  /**
   * Adds a new menu item at the end of the menu.
   * @param {MenuHeader|MenuItem|MenuSeparator} item Menu
   *     item to add to the menu.
   * @deprecated Use {@link #addChild} instead, with true for the second argument.
   */
  addItem(item) {
    this.addChild(item, true);
  };

  /**
   * Adds a new menu item at a specific index in the menu.
   * @param {MenuHeader|MenuItem|MenuSeparator} item Menu
   *     item to add to the menu.
   * @param {number} n Index at which to insert the menu item.
   * @deprecated Use {@link #addChildAt} instead, with true for the third
   *     argument.
   */
  addItemAt(item, n) {
    this.addChildAt(item, n, true);
  };

  /**
   * Removes an item from the menu and disposes of it.
   * @param {MenuHeader|MenuItem|MenuSeparator} item The
   *     menu item to remove.
   * @deprecated Use {@link #removeChild} instead.
   */
  removeItem(item) {
    var removedChild = this.removeChild(item, true);
    if (removedChild) {
      removedChild.dispose();
    }
  };

  /**
   * Removes a menu item at a given index in the menu and disposes of it.
   * @param {number} n Index of item.
   * @deprecated Use {@link #removeChildAt} instead.
   */
  removeItemAt(n) {
    var removedChild = this.removeChildAt(n, true);
    if (removedChild) {
      removedChild.dispose();
    }
  };

  /**
   * Returns a reference to the menu item at a given index.
   * @param {number} n Index of menu item.
   * @return {MenuHeader|MenuItem|MenuSeparator|null}
   *     Reference to the menu item.
   * @deprecated Use {@link #getChildAt} instead.
   */
  getItemAt(n) {
    return /** @type {MenuItem?} */ (this.getChildAt(n));
  };

  /**
   * Returns the number of items in the menu (including separators).
   * @return {number} The number of items in the menu.
   * @deprecated Use {@link #getChildCount} instead.
   */
  getItemCount() {
    return this.getChildCount();
  };

  /**
   * Returns an array containing the menu items contained in the menu.
   * @return {!Array<MenuItem>} An array of menu items.
   * @deprecated Use getChildAt, forEachChild, and getChildCount.
   */
  getItems() {
    // TODO(user): Remove reference to getItems and instead use getChildAt,
    // forEachChild, and getChildCount
    var children = [];
    this.forEachChild(function(child) { children.push(child); });
    return children;
  };

  /**
   * Sets the position of the menu relative to the view port.
   * @param {number|Coordinate} x Left position or coordinate obj.
   * @param {number=} opt_y Top position.
   */
  setPosition(x, opt_y) {
    // NOTE(user): It is necessary to temporarily set the display from none, so
    // that the position gets set correctly.
    var visible = this.isVisible();
    if (!visible) {
      style.setElementShown(this.getElement(), true);
    }
    style.setPageOffset(this.getElement(), x, opt_y);
    if (!visible) {
      style.setElementShown(this.getElement(), false);
    }
  };

  /**
   * Gets the page offset of the menu, or null if the menu isn't visible
   * @return {Coordinate?} Object holding the x-y coordinates of the
   *     menu or null if the menu is not visible.
   */
  getPosition() {
    return this.isVisible() ? style.getPageOffset(this.getElement()) : null;
  };

  /**
   * Sets whether the menu can automatically move focus to its key event target
   * when it is set to visible.
   * @param {boolean} allow Whether the menu can automatically move focus to its
   *     key event target when it is set to visible.
   */
  setAllowAutoFocus(allow) {
    this.allowAutoFocus_ = allow;
    if (allow) {
      this.setFocusable(true);
    }
  };

  /**
   * @return {boolean} Whether the menu can automatically move focus to its key
   *     event target when it is set to visible.
   */
  getAllowAutoFocus() {
    return this.allowAutoFocus_;
  };

  /**
   * Sets whether the menu will highlight disabled menu items or skip to the next
   * active item.
   * @param {boolean} allow Whether the menu will highlight disabled menu items or
   *     skip to the next active item.
   */
  setAllowHighlightDisabled(allow) {
    this.allowHighlightDisabled_ = allow;
  };

  /**
   * @return {boolean} Whether the menu will highlight disabled menu items or skip
   *     to the next active item.
   */
  getAllowHighlightDisabled() {
    return this.allowHighlightDisabled_;
  };

  /**
   * @override
   * @param {boolean} show Whether to show or hide the menu.
   * @param {boolean=} opt_force If true, doesn't check whether the menu
   *     already has the requested visibility, and doesn't dispatch any events.
   * @param {EventsEvent=} opt_e Mousedown event that caused this menu to
   *     be made visible (ignored if show is false).
   * @suppress {checkTypes}
   */
  setVisible(show, opt_force, opt_e) {
    var visibilityChanged =
        super.setVisible(show, opt_force);
    if (visibilityChanged && show && this.isInDocument() &&
        this.allowAutoFocus_) {
      this.getKeyEventTarget().focus();
    }
    if (show && opt_e && typeof opt_e.clientX === 'number') {
      this.openingCoords = new Coordinate(opt_e.clientX, opt_e.clientY);
    } else {
      this.openingCoords = null;
    }
    return visibilityChanged;
  };

  /** @override */
  handleEnterItem(e) {
    if (this.allowAutoFocus_) {
      this.getKeyEventTarget().focus();
    }
  
    return super.handleEnterItem(e);
  };

  /**
   * Highlights the next item that begins with the specified string.  If no
   * (other) item begins with the given string, the selection is unchanged.
   * @param {string} charStr The prefix to match.
   * @return {boolean} Whether a matching prefix was found.
   */
  highlightNextPrefix(charStr) {
    var re = new RegExp('^' + strings.regExpEscape(charStr), 'i');
    return this.highlightHelper(function(index, max) {
      // Index is >= -1 because it is set to -1 when nothing is selected.
      var start = index < 0 ? 0 : index;
      var wrapped = false;
  
      // We always start looking from one after the current, because we
      // keep the current selection only as a last resort. This makes the
      // loop a little awkward in the case where there is no current
      // selection, as we need to stop somewhere but can't just stop
      // when index == start, which is why we need the 'wrapped' flag.
      do {
        ++index;
        if (index == max) {
          index = 0;
          wrapped = true;
        }
        var name = this.getChildAt(index).getCaption();
        if (name && name.match(re)) {
          return index;
        }
      } while (!wrapped || index != start);
      return this.getHighlightedIndex();
    }, this.getHighlightedIndex());
  };

  /** @override */
  canHighlightItem(item) {
    return (this.allowHighlightDisabled_ || item.isEnabled()) &&
        item.isVisible() && item.isSupportedState(State.HOVER);
  };

  /** @override */
  decorateInternal(element) {
    this.decorateContent(element);
    super.decorateInternal(element);
  };

  /** @override */
  handleKeyEventInternal(e) {
    var handled = super.handleKeyEventInternal(e);
    if (!handled) {
      // Loop through all child components, and for each menu item call its
      // key event handler so that keyboard mnemonics can be handled.
      this.forEachChild(function(menuItem) {
        if (!handled && menuItem.getMnemonic &&
            menuItem.getMnemonic() == e.keyCode) {
          if (this.isEnabled()) {
            this.setHighlighted(menuItem);
          }
          // We still delegate to handleKeyEvent, so that it can handle
          // enabled/disabled state.
          handled = menuItem.handleKeyEvent(e);
        }
      }, this);
    }
    return handled;
  };

  /** @override */
  setHighlightedIndex(index) {
    super.setHighlightedIndex(index);
  
    // Bring the highlighted item into view. This has no effect if the menu is not
    // scrollable.
    var child = this.getChildAt(index);
    if (child) {
      style.scrollIntoContainerView(child.getElement(), this.getElement());
    }
  };

  /**
   * Decorate menu items located in any descendant node which as been explicitly
   * marked as a 'content' node.
   * @param {Element} element Element to decorate.
   * @protected
   */
  decorateContent(element) {
    var renderer = this.getRenderer();
    var contentElements = this.getDomHelper().getElementsByTagNameAndClass(
        TagName.DIV, google.getCssName(renderer.getCssClass(), 'content'),
        element);
  
    // Some versions of IE do not like it when you access this nodeList
    // with invalid indices. See
    // http://code.google.com/p/closure-library/issues/detail?id=373
    var length = contentElements.length;
    for (var i = 0; i < length; i++) {
      renderer.decorateChildren(this, contentElements[i]);
    }
  };
}

// google.tagUnsealableClass(Menu);

// TODO(robbyw): Remove this and all references to it.
/**
 * CSS class for menus.
 * @type {string}
 * @deprecated Use MenuRenderer.CSS_CLASS.
 */
Menu.CSS_CLASS = MenuRenderer.CSS_CLASS;

export {Menu, MenuItem, MenuRenderer};