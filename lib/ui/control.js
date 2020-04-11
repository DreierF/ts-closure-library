import * as a11yaria from './../a11y/aria/aria.js';
import {State as AriaState} from './../a11y/aria/attributes.js';
import {Role} from './../a11y/aria/roles.js';
import * as _googarray from './../array/array.js';
import * as googarray from './../array/array.js';
import * as googasserts from './../asserts/asserts.js';
import * as asserts from './../asserts/asserts.js';
import {dispose} from './../disposable/disposable.js';
import {Disposable} from './../disposable/disposable.js';
import * as domclasslist from './../dom/classlist.js';
import * as classlist from './../dom/classlist.js';
import * as goog_doms from './../dom/dom.js';
import * as goog_dom from './../dom/dom.js';
import {DomHelper} from './../dom/dom.js';
import {TagName} from './../dom/tagname.js';
import {BrowserEvent as EventsBrowserEvent} from './../events/browserevent.js';
import {MouseButton} from './../events/browserevent.js';
import {Event as EventsEvent} from './../events/event.js';
import {EventHandler} from './../events/eventhandler.js';
import {EventType as EventsEventType} from './../events/eventtype.js';
import {KeyCodes} from './../events/keycodes.js';
import {KeyEvent} from './../events/keyhandler.js';
import {KeyHandler} from './../events/keyhandler.js';
import {EventType} from './../events/keyhandler.js';
import * as google from './../google.js';
import * as goog_object from './../object/object.js';
import * as googstrings from './../string/string.js';
import * as strings from './../string/string.js';
import * as style from './../style/style.js';
import * as googuserAgent from './../useragent/useragent.js';
import * as userAgent from './../useragent/useragent.js';
import {Component as Ui_Component} from './component.js';
import {Error as ComponentError} from './component.js';
import {State} from './component.js';
import {EventType as ComponentEventType} from './component.js';
import * as ComponentUtil from './componentutil.js';
import {ControlContent as UiControlContent} from './controlcontent.js';
import {ControlContent} from './controlcontent.js';
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
 * @fileoverview Base class for control renderers.
 * TODO(attila):  If the renderer framework works well, pull it into Component.
 */

  // circular

/**
 * Default renderer for {@link Control}s.  Can be used as-is, but
 * subclasses of Control will probably want to use renderers specifically
 * tailored for them by extending this class.  Controls that use renderers
 * delegate one or more of the following API methods to the renderer:
 * <ul>
 *    <li>`createDom` - renders the DOM for the component
 *    <li>`canDecorate` - determines whether an element can be decorated
 *        by the component
 *    <li>`decorate` - decorates an existing element with the component
 *    <li>`setState` - updates the appearance of the component based on
 *        its state
 *    <li>`getContent` - returns the component's content
 *    <li>`setContent` - sets the component's content
 * </ul>
 * Controls are stateful; renderers, on the other hand, should be stateless and
 * reusable.
 * @template CONTROL
 */
class ControlRenderer {

  /**
   * Default renderer for {@link Control}s.  Can be used as-is, but
   * subclasses of Control will probably want to use renderers specifically
   * tailored for them by extending this class.  Controls that use renderers
   * delegate one or more of the following API methods to the renderer:
   * <ul>
   *    <li>`createDom` - renders the DOM for the component
   *    <li>`canDecorate` - determines whether an element can be decorated
   *        by the component
   *    <li>`decorate` - decorates an existing element with the component
   *    <li>`setState` - updates the appearance of the component based on
   *        its state
   *    <li>`getContent` - returns the component's content
   *    <li>`setContent` - sets the component's content
   * </ul>
   * Controls are stateful; renderers, on the other hand, should be stateless and
   * reusable.
   * @template CONTROL
   */
  constructor() {}

  /** @return {!ControlRenderer} @suppress {checkTypes} */
  static getInstance() {
    if (ControlRenderer.instance_) {
      return /** @type {!ControlRenderer} */ (ControlRenderer.instance_);
    }
    return /** @type {!ControlRenderer} */ (ControlRenderer.instance_) = new ControlRenderer();
  };

  /**
   * Constructs a new renderer and sets the CSS class that the renderer will use
   * as the base CSS class to apply to all elements rendered by that renderer.
   * An example to use this function using a color palette:
   *
   * <pre>
   * var myCustomRenderer = ControlRenderer.getCustomRenderer(
   *     goog.ui.PaletteRenderer, 'my-special-palette');
   * var newColorPalette = new goog.ui.ColorPalette(
   *     colors, myCustomRenderer, opt_domHelper);
   * </pre>
   *
   * Your CSS can look like this now:
   * <pre>
   * .my-special-palette { }
   * .my-special-palette-table { }
   * .my-special-palette-cell { }
   * etc.
   * </pre>
   *
   * <em>instead</em> of
   * <pre>
   * .CSS_MY_SPECIAL_PALETTE .goog-palette { }
   * .CSS_MY_SPECIAL_PALETTE .goog-palette-table { }
   * .CSS_MY_SPECIAL_PALETTE .goog-palette-cell { }
   * etc.
   * </pre>
   *
   * You would want to use this functionality when you want an instance of a
   * component to have specific styles different than the other components of the
   * same type in your application.  This avoids using descendant selectors to
   * apply the specific styles to this component.
   *
   * @param {Function} ctor The constructor of the renderer you are trying to
   *     create.
   * @param {string} cssClassName The name of the CSS class for this renderer.
   * @return {ControlRenderer} An instance of the desired renderer with
   *     its getCssClass() method overridden to return the supplied custom CSS
   *     class name.
   */
  static getCustomRenderer(ctor, cssClassName) {
    var renderer = new ctor();
  
    /**
     * Returns the CSS class to be applied to the root element of components
     * rendered using this renderer.
     * @return {string} Renderer-specific CSS class.
     */
    renderer.getCssClass = function() { return cssClassName; };
  
    return renderer;
  };

  /**
   * Returns the ARIA role to be applied to the control.
   * See http://wiki/Main/ARIA for more info.
   * @return {Role|undefined} ARIA role.
   */
  getAriaRole() {
    // By default, the ARIA role is unspecified.
    return undefined;
  };

  /**
   * Returns the control's contents wrapped in a DIV, with the renderer's own
   * CSS class and additional state-specific classes applied to it.
   * @param {CONTROL} control Control to render.
   * @return {Element} Root element for the control.
   */
  createDom(control) {
    // Create and return DIV wrapping contents.
    var element = control.getDomHelper().createDom(
        TagName.DIV, this.getClassNames(control).join(' '),
        control.getContent());
  
    return element;
  };

  /**
   * Takes the control's root element and returns the parent element of the
   * control's contents.  Since by default controls are rendered as a single
   * DIV, the default implementation returns the element itself.  Subclasses
   * with more complex DOM structures must override this method as needed.
   * @param {Element} element Root element of the control whose content element
   *     is to be returned.
   * @return {Element} The control's content element.
   */
  getContentElement(element) {
    return element;
  };

  /**
   * Updates the control's DOM by adding or removing the specified class name
   * to/from its root element. May add additional combined classes as needed in
   * IE6 and lower. Because of this, subclasses should use this method when
   * modifying class names on the control's root element.
   * @param {CONTROL|Element} control Control instance (or root element)
   *     to be updated.
   * @param {string} className CSS class name to add or remove.
   * @param {boolean} enable Whether to add or remove the class name.
   */
  enableClassName(
      control, className, enable) {
    var element = /** @type {Element} */ (
        control.getElement ? control.getElement() : control);
    if (element) {
      var classNames = [className];
  
      // For IE6, we need to enable any combined classes involving this class
      // as well.
      // TODO(user): Remove this as IE6 is no longer in use.
      if (userAgent.IE && !userAgent.isVersionOrHigher('7')) {
        classNames = this.getAppliedCombinedClassNames_(
            classlist.get(element), className);
        classNames.push(className);
      }
  
      classlist.enableAll(element, classNames, enable);
    }
  };

  /**
   * Updates the control's DOM by adding or removing the specified extra class
   * name to/from its element.
   * @param {CONTROL} control Control to be updated.
   * @param {string} className CSS class name to add or remove.
   * @param {boolean} enable Whether to add or remove the class name.
   */
  enableExtraClassName(
      control, className, enable) {
    // The base class implementation is trivial; subclasses should override as
    // needed.
    this.enableClassName(control, className, enable);
  };

  /**
   * Returns true if this renderer can decorate the element, false otherwise.
   * The default implementation always returns true.
   * @param {Element} element Element to decorate.
   * @return {boolean} Whether the renderer can decorate the element.
   */
  canDecorate(element) {
    return true;
  };

  /**
   * Default implementation of `decorate` for {@link Control}s.
   * Initializes the control's ID, content, and state based on the ID of the
   * element, its child nodes, and its CSS classes, respectively.  Returns the
   * element.
   * @param {CONTROL} control Control instance to decorate the element.
   * @param {Element} element Element to decorate.
   * @return {Element} Decorated element.
   */
  decorate(control, element) {
    // Set the control's ID to the decorated element's DOM ID, if any.
    if (element.id) {
      control.setId(element.id);
    }
  
    // Set the control's content to the decorated element's content.
    var contentElem = this.getContentElement(element);
    if (contentElem && contentElem.firstChild) {
      control.setContentInternal(
          contentElem.firstChild.nextSibling ?
              googarray.clone(contentElem.childNodes) :
              contentElem.firstChild);
    } else {
      control.setContentInternal(null);
    }
  
    // Initialize the control's state based on the decorated element's CSS class.
    // This implementation is optimized to minimize object allocations, string
    // comparisons, and DOM access.
    var state = 0x00;
    var rendererClassName = this.getCssClass();
    var structuralClassName = this.getStructuralCssClass();
    var hasRendererClassName = false;
    var hasStructuralClassName = false;
    var hasCombinedClassName = false;
    var classNames = googarray.toArray(classlist.get(element));
    googarray.forEach(classNames, function(className) {
      if (!hasRendererClassName && className == rendererClassName) {
        hasRendererClassName = true;
        if (structuralClassName == rendererClassName) {
          hasStructuralClassName = true;
        }
      } else if (!hasStructuralClassName && className == structuralClassName) {
        hasStructuralClassName = true;
      } else {
        state |= this.getStateFromClass(className);
      }
      if (this.getStateFromClass(className) == State.DISABLED) {
        asserts.assertElement(contentElem);
        if (goog_dom.isFocusableTabIndex(contentElem)) {
          goog_dom.setFocusableTabIndex(contentElem, false);
        }
      }
    }, this);
    control.setStateInternal(state);
  
    // Make sure the element has the renderer's CSS classes applied, as well as
    // any extra class names set on the control.
    if (!hasRendererClassName) {
      classNames.push(rendererClassName);
      if (structuralClassName == rendererClassName) {
        hasStructuralClassName = true;
      }
    }
    if (!hasStructuralClassName) {
      classNames.push(structuralClassName);
    }
    var extraClassNames = control.getExtraClassNames();
    if (extraClassNames) {
      classNames.push.apply(classNames, extraClassNames);
    }
  
    // For IE6, rewrite all classes on the decorated element if any combined
    // classes apply.
    if (userAgent.IE && !userAgent.isVersionOrHigher('7')) {
      var combinedClasses = this.getAppliedCombinedClassNames_(classNames);
      if (combinedClasses.length > 0) {
        classNames.push.apply(classNames, combinedClasses);
        hasCombinedClassName = true;
      }
    }
  
    // Only write to the DOM if new class names had to be added to the element.
    if (!hasRendererClassName || !hasStructuralClassName || extraClassNames ||
        hasCombinedClassName) {
      classlist.set(element, classNames.join(' '));
    }
  
    return element;
  };

  /**
   * Initializes the control's DOM by configuring properties that can only be set
   * after the DOM has entered the document.  This implementation sets up BiDi
   * and keyboard focus.  Called from {@link Control#enterDocument}.
   * @param {CONTROL} control Control whose DOM is to be initialized
   *     as it enters the document.
   */
  initializeDom(control) {
    // Initialize render direction (BiDi).  We optimize the left-to-right render
    // direction by assuming that elements are left-to-right by default, and only
    // updating their styling if they are explicitly set to right-to-left.
    if (control.isRightToLeft()) {
      this.setRightToLeft(control.getElement(), true);
    }
  
    // Initialize keyboard focusability (tab index).  We assume that components
    // aren't focusable by default (i.e have no tab index), and only touch the
    // DOM if the component is focusable, enabled, and visible, and therefore
    // needs a tab index.
    if (control.isEnabled()) {
      this.setFocusable(control, control.isVisible());
    }
  };

  /**
   * Sets the element's ARIA role.
   * @param {Element} element Element to update.
   * @param {?Role=} opt_preferredRole The preferred ARIA role.
   */
  setAriaRole(
      element, opt_preferredRole) {
    var ariaRole = opt_preferredRole || this.getAriaRole();
    if (ariaRole) {
      asserts.assert(
          element, 'The element passed as a first parameter cannot be null.');
      var currentRole = a11yaria.getRole(element);
      if (ariaRole == currentRole) {
        return;
      }
      a11yaria.setRole(element, ariaRole);
    }
  };

  /**
   * Sets the element's ARIA attributes, including distinguishing between
   * universally supported ARIA properties and ARIA states that are only
   * supported by certain ARIA roles. Only attributes which are initialized to be
   * true will be set.
   * @param {!Control} control Control whose ARIA state will be updated.
   * @param {!Element} element Element whose ARIA state is to be updated.
   */
  setAriaStates(control, element) {
    asserts.assert(control);
    asserts.assert(element);
  
    var ariaLabel = control.getAriaLabel();
    if (ariaLabel != null) {
      this.setAriaLabel(element, ariaLabel);
    }
  
    if (!control.isVisible()) {
      a11yaria.setState(
          element, AriaState.HIDDEN, !control.isVisible());
    }
    if (!control.isEnabled()) {
      this.updateAriaState(
          element, State.DISABLED, !control.isEnabled());
    }
    if (control.isSupportedState(State.SELECTED)) {
      this.updateAriaState(
          element, State.SELECTED, control.isSelected());
    }
    if (control.isSupportedState(State.CHECKED)) {
      this.updateAriaState(
          element, State.CHECKED, control.isChecked());
    }
    if (control.isSupportedState(State.OPENED)) {
      this.updateAriaState(
          element, State.OPENED, control.isOpen());
    }
  };

  /**
   * Sets the element's ARIA label. This should be overriden by subclasses that
   * don't apply the role directly on control.element_.
   * @param {!Element} element Element whose ARIA label is to be updated.
   * @param {string} ariaLabel Label to add to the element.
   */
  setAriaLabel(element, ariaLabel) {
    a11yaria.setLabel(element, ariaLabel);
  };

  /**
   * Allows or disallows text selection within the control's DOM.
   * @param {Element} element The control's root element.
   * @param {boolean} allow Whether the element should allow text selection.
   */
  setAllowTextSelection(
      element, allow) {
    // On all browsers other than IE and Opera, it isn't necessary to recursively
    // apply unselectable styling to the element's children.
    style.setUnselectable(
        element, !allow, !userAgent.IE && !userAgent.OPERA);
  };

  /**
   * Applies special styling to/from the control's element if it is rendered
   * right-to-left, and removes it if it is rendered left-to-right.
   * @param {Element} element The control's root element.
   * @param {boolean} rightToLeft Whether the component is rendered
   *     right-to-left.
   */
  setRightToLeft(
      element, rightToLeft) {
    this.enableClassName(
        element, google.getCssName(this.getStructuralCssClass(), 'rtl'),
        rightToLeft);
  };

  /**
   * Returns true if the control's key event target supports keyboard focus
   * (based on its `tabIndex` attribute), false otherwise.
   * @param {CONTROL} control Control whose key event target is to be
   *     checked.
   * @return {boolean} Whether the control's key event target is focusable.
   */
  isFocusable(control) {
    var keyTarget;
    if (control.isSupportedState(State.FOCUSED) &&
        (keyTarget = control.getKeyEventTarget())) {
      return goog_dom.isFocusableTabIndex(keyTarget);
    }
    return false;
  };

  /**
   * Updates the control's key event target to make it focusable or non-focusable
   * via its `tabIndex` attribute.  Does nothing if the control doesn't
   * support the `FOCUSED` state, or if it has no key event target.
   * @param {CONTROL} control Control whose key event target is to be
   *     updated.
   * @param {boolean} focusable Whether to enable keyboard focus support on the
   *     control's key event target.
   */
  setFocusable(control, focusable) {
    var keyTarget;
    if (control.isSupportedState(State.FOCUSED) &&
        (keyTarget = control.getKeyEventTarget())) {
      if (!focusable && control.isFocused()) {
        // Blur before hiding.  Note that IE calls onblur handlers asynchronously.
        try {
          keyTarget.blur();
        } catch (e) {
          // TODO(user|user):  Find out why this fails on IE.
        }
        // The blur event dispatched by the key event target element when blur()
        // was called on it should have been handled by the control's handleBlur()
        // method, so at this point the control should no longer be focused.
        // However, blur events are unreliable on IE and FF3, so if at this point
        // the control is still focused, we trigger its handleBlur() method
        // programmatically.
        if (control.isFocused()) {
          control.handleBlur(null);
        }
      }
      // Don't overwrite existing tab index values unless needed.
      if (goog_dom.isFocusableTabIndex(keyTarget) != focusable) {
        goog_dom.setFocusableTabIndex(keyTarget, focusable);
      }
    }
  };

  /**
   * Shows or hides the element.
   * @param {Element} element Element to update.
   * @param {boolean} visible Whether to show the element.
   */
  setVisible(element, visible) {
    // The base class implementation is trivial; subclasses should override as
    // needed.  It should be possible to do animated reveals, for example.
    style.setElementShown(element, visible);
    if (element) {
      a11yaria.setState(element, AriaState.HIDDEN, !visible);
    }
  };

  /**
   * Updates the appearance of the control in response to a state change.
   * @param {CONTROL} control Control instance to update.
   * @param {State} state State to enable or disable.
   * @param {boolean} enable Whether the control is entering or exiting the state.
   */
  setState(control, state, enable) {
    var element = control.getElement();
    if (element) {
      var className = this.getClassForState(state);
      if (className) {
        this.enableClassName(control, className, enable);
      }
      this.updateAriaState(element, state, enable);
    }
  };

  /**
   * Updates the element's ARIA (accessibility) attributes , including
   * distinguishing between universally supported ARIA properties and ARIA states
   * that are only supported by certain ARIA roles.
   * @param {Element} element Element whose ARIA state is to be updated.
   * @param {State} state Component state being enabled or
   *     disabled.
   * @param {boolean} enable Whether the state is being enabled or disabled.
   * @protected
   */
  updateAriaState(
      element, state, enable) {
    // Ensure the ARIA attribute map exists.
    if (!ControlRenderer.ariaAttributeMap_) {
      ControlRenderer.ariaAttributeMap_ = goog_object.create(
          State.DISABLED, AriaState.DISABLED,
          State.SELECTED, AriaState.SELECTED,
          State.CHECKED, AriaState.CHECKED,
          State.OPENED, AriaState.EXPANDED);
    }
    asserts.assert(
        element, 'The element passed as a first parameter cannot be null.');
    var ariaAttr = ControlRenderer.getAriaStateForAriaRole_(
        element, ControlRenderer.ariaAttributeMap_[state]);
    if (ariaAttr) {
      a11yaria.setState(element, ariaAttr, enable);
    }
  };

  /**
   * Returns the appropriate ARIA attribute based on ARIA role if the ARIA
   * attribute is an ARIA state.
   * @param {!Element} element The element from which to get the ARIA role for
   * matching ARIA state.
   * @param {AriaState} attr The ARIA attribute to check to see if it
   * can be applied to the given ARIA role.
   * @return {AriaState} An ARIA attribute that can be applied to the
   * given ARIA role.
   * @private
   */
  static getAriaStateForAriaRole_(element, attr) {
    var role = a11yaria.getRole(element);
    if (!role) {
      return attr;
    }
    role = /** @type {Role} */ (role);
    var matchAttr = ControlRenderer.TOGGLE_ARIA_STATE_MAP_[role] || attr;
    return ControlRenderer.isAriaState_(attr) ? matchAttr : attr;
  };

  /**
   * Determines if the given ARIA attribute is an ARIA property or ARIA state.
   * @param {AriaState} attr The ARIA attribute to classify.
   * @return {boolean} If the ARIA attribute is an ARIA state.
   * @private
   */
  static isAriaState_(attr) {
    return attr == AriaState.CHECKED ||
        attr == AriaState.SELECTED;
  };

  /**
   * Takes a control's root element, and sets its content to the given text
   * caption or DOM structure.  The default implementation replaces the children
   * of the given element.  Renderers that create more complex DOM structures
   * must override this method accordingly.
   * @suppress{checkTypes}
   * @param {Element} element The control's root element.
   * @param {ControlContent} content Text caption or DOM structure to be
   *     set as the control's content. The DOM nodes will not be cloned, they
   *     will only moved under the content element of the control.
   */
  setContent(element, content) {
    var contentElem = this.getContentElement(element);
    if (contentElem) {
      goog_dom.removeChildren(contentElem);
      if (content) {
        if (typeof content === 'string') {
          goog_dom.setTextContent(contentElem, content);
        } else {
          function childHandler(child) {
            if (child) {
              var doc = goog_dom.getOwnerDocument(contentElem);
              contentElem.appendChild(
                  typeof child === 'string' ? doc.createTextNode(child) : child);
            }
          };
          if (google.isArray(content)) {
            // Array of nodes.
            googarray.forEach(content, childHandler);
          } else if (google.isArrayLike(content) && !('nodeType' in content)) {
            // NodeList. The second condition filters out TextNode which also has
            // length attribute but is not array like. The nodes have to be cloned
            // because childHandler removes them from the list during iteration.
            googarray.forEach(
                googarray.clone(/** @type {!NodeList<?>} */ (content)),
                childHandler);
          } else {
            // Node or string.
            childHandler(content);
          }
        }
      }
    }
  };

  /**
   * Returns the element within the component's DOM that should receive keyboard
   * focus (null if none).  The default implementation returns the control's root
   * element.
   * @param {CONTROL} control Control whose key event target is to be
   *     returned.
   * @return {Element} The key event target.
   */
  getKeyEventTarget(control) {
    return control.getElement();
  };

  /**
   * Returns the CSS class name to be applied to the root element of all
   * components rendered or decorated using this renderer.  The class name
   * is expected to uniquely identify the renderer class, i.e. no two
   * renderer classes are expected to share the same CSS class name.
   * @return {string} Renderer-specific CSS class name.
   */
  getCssClass() {
    return ControlRenderer.CSS_CLASS;
  };

  /**
   * Returns an array of combinations of classes to apply combined class names for
   * in IE6 and below. See {@link IE6_CLASS_COMBINATIONS} for more detail. This
   * method doesn't reference {@link IE6_CLASS_COMBINATIONS} so that it can be
   * compiled out, but subclasses should return their IE6_CLASS_COMBINATIONS
   * static constant instead.
   * @return {Array<Array<string>>} Array of class name combinations.
   */
  getIe6ClassCombinations() {
    return [];
  };

  /**
   * Returns the name of a DOM structure-specific CSS class to be applied to the
   * root element of all components rendered or decorated using this renderer.
   * Unlike the class name returned by {@link #getCssClass}, the structural class
   * name may be shared among different renderers that generate similar DOM
   * structures.  The structural class name also serves as the basis of derived
   * class names used to identify and style structural elements of the control's
   * DOM, as well as the basis for state-specific class names.  The default
   * implementation returns the same class name as {@link #getCssClass}, but
   * subclasses are expected to override this method as needed.
   * @return {string} DOM structure-specific CSS class name (same as the renderer-
   *     specific CSS class name by default).
   */
  getStructuralCssClass() {
    return this.getCssClass();
  };

  /**
   * Returns all CSS class names applicable to the given control, based on its
   * state.  The return value is an array of strings containing
   * <ol>
   *   <li>the renderer-specific CSS class returned by {@link #getCssClass},
   *       followed by
   *   <li>the structural CSS class returned by {@link getStructuralCssClass} (if
   *       different from the renderer-specific CSS class), followed by
   *   <li>any state-specific classes returned by {@link #getClassNamesForState},
   *       followed by
   *   <li>any extra classes returned by the control's `getExtraClassNames`
   *       method and
   *   <li>for IE6 and lower, additional combined classes from
   *       {@link getAppliedCombinedClassNames_}.
   * </ol>
   * Since all controls have at least one renderer-specific CSS class name, this
   * method is guaranteed to return an array of at least one element.
   * @param {CONTROL} control Control whose CSS classes are to be
   *     returned.
   * @return {!Array<string>} Array of CSS class names applicable to the control.
   * @protected
   */
  getClassNames(control) {
    var cssClass = this.getCssClass();
  
    // Start with the renderer-specific class name.
    var classNames = [cssClass];
  
    // Add structural class name, if different.
    var structuralCssClass = this.getStructuralCssClass();
    if (structuralCssClass != cssClass) {
      classNames.push(structuralCssClass);
    }
  
    // Add state-specific class names, if any.
    var classNamesForState = this.getClassNamesForState(control.getState());
    classNames.push.apply(classNames, classNamesForState);
  
    // Add extra class names, if any.
    var extraClassNames = control.getExtraClassNames();
    if (extraClassNames) {
      classNames.push.apply(classNames, extraClassNames);
    }
  
    // Add composite classes for IE6 support
    if (userAgent.IE && !userAgent.isVersionOrHigher('7')) {
      classNames.push.apply(
          classNames, this.getAppliedCombinedClassNames_(classNames));
    }
  
    return classNames;
  };

  /**
   * Returns an array of all the combined class names that should be applied based
   * on the given list of classes. Checks the result of
   * {@link getIe6ClassCombinations} for any combinations that have all
   * members contained in classes. If a combination matches, the members are
   * joined with an underscore (in order), and added to the return array.
   *
   * If opt_includedClass is provided, return only the combined classes that have
   * all members contained in classes AND include opt_includedClass as well.
   * opt_includedClass is added to classes as well.
   * @param {IArrayLike<string>} classes Array-like thing of classes to
   *     return matching combined classes for.
   * @param {?string=} opt_includedClass If provided, get only the combined
   *     classes that include this one.
   * @return {!Array<string>} Array of combined class names that should be
   *     applied.
   * @private
   */
  getAppliedCombinedClassNames_(
      classes, opt_includedClass) {
    var toAdd = [];
    if (opt_includedClass) {
      classes = googarray.concat(classes, [opt_includedClass]);
    }
    googarray.forEach(this.getIe6ClassCombinations(), function(combo) {
      if (googarray.every(combo, google.partial(googarray.contains, classes)) &&
          (!opt_includedClass || googarray.contains(combo, opt_includedClass))) {
        toAdd.push(combo.join('_'));
      }
    });
    return toAdd;
  };

  /**
   * Takes a bit mask of {@link State}s, and returns an array
   * of the appropriate class names representing the given state, suitable to be
   * applied to the root element of a component rendered using this renderer, or
   * null if no state-specific classes need to be applied.  This default
   * implementation uses the renderer's {@link getClassForState} method to
   * generate each state-specific class.
   * @param {number} state Bit mask of component states.
   * @return {!Array<string>} Array of CSS class names representing the given
   *     state.
   * @protected
   */
  getClassNamesForState(state) {
    var classNames = [];
    while (state) {
      // For each enabled state, push the corresponding CSS class name onto
      // the classNames array.
      var mask = state & -state;  // Least significant bit
      classNames.push(
          this.getClassForState(
              /** @type {State} */ (mask)));
      state &= ~mask;
    }
    return classNames;
  };

  /**
   * Takes a single {@link State}, and returns the
   * corresponding CSS class name (null if none).
   * @param {State} state Component state.
   * @return {string|undefined} CSS class representing the given state (undefined
   *     if none).
   * @protected
   */
  getClassForState(state) {
    if (!this.classByState_) {
      this.createClassByStateMap_();
    }
    return this.classByState_[state];
  };

  /**
   * Takes a single CSS class name which may represent a component state, and
   * returns the corresponding component state (0x00 if none).
   * @param {string} className CSS class name, possibly representing a component
   *     state.
   * @return {State} state Component state corresponding
   *     to the given CSS class (0x00 if none).
   * @protected
   */
  getStateFromClass(className) {
    if (!this.stateByClass_) {
      this.createStateByClassMap_();
    }
    var state = parseInt(this.stateByClass_[className], 10);
    return /** @type {State} */ (isNaN(state) ? 0x00 : state);
  };

  /**
   * Creates the lookup table of states to classes, used during state changes.
   * @private
   */
  createClassByStateMap_() {
    var baseClass = this.getStructuralCssClass();
  
    // This ensures space-separated css classnames are not allowed, which some
    // ControlRenderers had been doing.  See http://b/13694665.
    var isValidClassName =
        !strings.contains(strings.normalizeWhitespace(baseClass), ' ');
    asserts.assert(
        isValidClassName,
        'ControlRenderer has an invalid css class: \'' + baseClass + '\'');
  
    /**
     * Map of component states to state-specific structural class names,
     * used when changing the DOM in response to a state change.  Precomputed
     * and cached on first use to minimize object allocations and string
     * concatenation.
     * @type {Object}
     * @private
     */
    this.classByState_ = goog_object.create(
        State.DISABLED, google.getCssName(baseClass, 'disabled'),
        State.HOVER, google.getCssName(baseClass, 'hover'),
        State.ACTIVE, google.getCssName(baseClass, 'active'),
        State.SELECTED, google.getCssName(baseClass, 'selected'),
        State.CHECKED, google.getCssName(baseClass, 'checked'),
        State.FOCUSED, google.getCssName(baseClass, 'focused'),
        State.OPENED, google.getCssName(baseClass, 'open'));
  };

  /**
   * Creates the lookup table of classes to states, used during decoration.
   * @private
   */
  createStateByClassMap_() {
    // We need the classByState_ map so we can transpose it.
    if (!this.classByState_) {
      this.createClassByStateMap_();
    }
  
    /**
     * Map of state-specific structural class names to component states,
     * used during element decoration.  Precomputed and cached on first use
     * to minimize object allocations and string concatenation.
     * @type {Object}
     * @private
     */
    this.stateByClass_ = goog_object.transpose(this.classByState_);
  };
}
/** @type {undefined|!ControlRenderer} @suppress {underscore,checkTypes}*/
ControlRenderer.instance_ = undefined;

// google.tagUnsealableClass(ControlRenderer);

/**
 * Default CSS class to be applied to the root element of components rendered
 * by this renderer.
 * @type {string}
 */
ControlRenderer.CSS_CLASS = google.getCssName('goog-control');

/**
 * Array of arrays of CSS classes that we want composite classes added and
 * removed for in IE6 and lower as a workaround for lack of multi-class CSS
 * selector support.
 *
 * Subclasses that have accompanying CSS requiring this workaround should define
 * their own static IE6_CLASS_COMBINATIONS constant and override
 * getIe6ClassCombinations to return it.
 *
 * For example, if your stylesheet uses the selector .button.collapse-left
 * (and is compiled to .button_collapse-left for the IE6 version of the
 * stylesheet,) you should include ['button', 'collapse-left'] in this array
 * and the class button_collapse-left will be applied to the root element
 * whenever both button and collapse-left are applied individually.
 *
 * Members of each class name combination will be joined with underscores in the
 * order that they're defined in the array. You should alphabetize them (for
 * compatibility with the CSS compiler) unless you are doing something special.
 * @type {Array<Array<string>>}
 */
ControlRenderer.IE6_CLASS_COMBINATIONS = [];

/**
 * Map of component states to corresponding ARIA attributes.  Since the mapping
 * of component states to ARIA attributes is neither component- nor
 * renderer-specific, this is a static property of the renderer class, and is
 * initialized on first use.
 * @type {Object<State, AriaState>}
 * @private
 */
ControlRenderer.ariaAttributeMap_;

/**
 * Map of certain ARIA states to ARIA roles that support them. Used for checked
 * and selected Component states because they are used on Components with ARIA
 * roles that do not support the corresponding ARIA state.
 * @private {!Object<Role, AriaState>}
 * @const
 */
ControlRenderer.TOGGLE_ARIA_STATE_MAP_ = goog_object.create(
    Role.BUTTON, AriaState.PRESSED,
    Role.CHECKBOX, AriaState.CHECKED,
    Role.MENU_ITEM, AriaState.SELECTED,
    Role.MENU_ITEM_CHECKBOX, AriaState.CHECKED,
    Role.MENU_ITEM_RADIO, AriaState.CHECKED,
    Role.RADIO, AriaState.CHECKED,
    Role.TAB, AriaState.SELECTED,
    Role.TREEITEM, AriaState.SELECTED);

// CSS class name management.

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
 * @fileoverview Global renderer and decorator registry.
 */

/**
 * Given a {@link Ui_Component} constructor, returns an instance of its
 * default renderer.  If the default renderer is a singleton, returns the
 * singleton instance; otherwise returns a new instance of the renderer class.
 * @param {Function} componentCtor Component constructor function (for example
 *     `goog.ui.Button`).
 * @return {ControlRenderer?} Renderer instance (for example the
 *     singleton instance of `goog.ui.ButtonRenderer`), or null if
 *     no default renderer was found.
 */
function getDefaultRenderer(componentCtor) {
  // TODO(b/141512323): This should probably be implemented with a `WeakMap`.
  // Locate the default renderer based on the constructor's unique ID.  If no
  // renderer is registered for this class, walk up the superClass_ chain.
  var key;
  /** @type {Function|undefined} */ var rendererCtor;
  while (componentCtor) {
    key = google.getUid(componentCtor);
    if ((rendererCtor = defaultRenderers_[key])) {
      break;
    }
    componentCtor = componentCtor.superClass_ ?
        componentCtor.superClass_.constructor :
        null;
  }

  // If the renderer has a static getInstance method, return the singleton
  // instance; otherwise create and return a new instance.
  if (rendererCtor) {
    return google.isFunction(rendererCtor.getInstance) ?
        rendererCtor.getInstance() :
        new rendererCtor();
  }

  return null;
};

/**
 * Sets the default renderer for the given {@link Ui_Component}
 * constructor.
 * @param {Function} componentCtor Component constructor function (for example
 *     `goog.ui.Button`).
 * @param {Function} rendererCtor Renderer constructor function (for example
 *     `goog.ui.ButtonRenderer`).
 * @throws {Error} If the arguments aren't functions.
 */
function setDefaultRenderer(componentCtor, rendererCtor) {
  // In this case, explicit validation has negligible overhead (since each
  // renderer is only registered once), and helps catch subtle bugs.
  if (!google.isFunction(componentCtor)) {
    throw new Error('Invalid component class ' + componentCtor);
  }
  if (!google.isFunction(rendererCtor)) {
    throw new Error('Invalid renderer class ' + rendererCtor);
  }

  // Map the component constructor's unique ID to the renderer constructor.
  var key = google.getUid(componentCtor);
  defaultRenderers_[key] = rendererCtor;
};

/**
 * Returns the {@link Ui_Component} instance created by the decorator
 * factory function registered for the given CSS class name, or null if no
 * decorator factory function was found.
 * @param {string} className CSS class name.
 * @return {Ui_Component?} Component instance.
 */
function getDecoratorByClassName(className) {
  return className in decoratorFunctions_ ?
      decoratorFunctions_[className]() :
      null;
};

/**
 * Maps a CSS class name to a function that returns a new instance of
 * {@link Ui_Component} or a subclass, suitable to decorate an element
 * that has the specified CSS class.
 * @param {string} className CSS class name.
 * @param {Function} decoratorFn No-argument function that returns a new
 *     instance of a {@link Ui_Component} to decorate an element.
 * @throws {Error} If the class name or the decorator function is invalid.
 */
function setDecoratorByClassName(className, decoratorFn) {
  // In this case, explicit validation has negligible overhead (since each
  // decorator  is only registered once), and helps catch subtle bugs.
  if (!className) {
    throw new Error('Invalid class name ' + className);
  }
  if (!google.isFunction(decoratorFn)) {
    throw new Error('Invalid decorator function ' + decoratorFn);
  }

  decoratorFunctions_[className] = decoratorFn;
};

/**
 * Returns an instance of {@link Ui_Component} or a subclass suitable to
 * decorate the given element, based on its CSS class.
 *
 * TODO(nnaze): Type of element should be {!Element}.
 *
 * @param {Element} element Element to decorate.
 * @return {Ui_Component?} Component to decorate the element (null if
 *     none).
 */
function getDecorator(element) {
  var decorator;
  asserts.assert(element);
  var classNames = classlist.get(element);
  for (var i = 0, len = classNames.length; i < len; i++) {
    if ((decorator = getDecoratorByClassName(classNames[i]))) {
      return decorator;
    }
  }
  return null;
};

/**
 * Resets the global renderer and decorator registry.
 */
function reset() {
  defaultRenderers_ = {};
  decoratorFunctions_ = {};
};

/**
 * Map of {@link Ui_Component} constructor unique IDs to the constructors
 * of their default {@link goog.ui.Renderer}s.
 * @type {Object}
 * @private
 */
let defaultRenderers_ = {};

/**
 * Map of CSS class names to registry factory functions.  The keys are
 * class names.  The values are function objects that return new instances
 * of {@link goog.ui.registry} or one of its subclasses, suitable to
 * decorate elements marked with the corresponding CSS class.  Used by
 * containers while decorating their children.
 * @type {Object}
 * @private
 */
let decoratorFunctions_ = {};

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
 * @fileoverview Base class for UI controls such as buttons, menus, menu items,
 * toolbar buttons, etc.  The implementation is based on a generalized version
 * of {@link goog.ui.MenuItem}.
 * TODO(attila):  If the renderer framework works well, pull it into Component.
 *
 * @see ../demos/control.html
 * @see http://code.google.com/p/closure-library/wiki/IntroToControls
 */

/**  */

/**
 * Base class for UI controls.  Extends {@link Ui_Component} by adding
 * the following:
 *  <ul>
 *    <li>a {@link KeyHandler}, to simplify keyboard handling,
 *    <li>a pluggable <em>renderer</em> framework, to simplify the creation of
 *        simple controls without the need to subclass this class,
 *    <li>the notion of component <em>content</em>, like a text caption or DOM
 *        structure displayed in the component (e.g. a button label),
 *    <li>getter and setter for component content, as well as a getter and
 *        setter specifically for caption text (for convenience),
 *    <li>support for hiding/showing the component,
      <li>fine-grained control over supported states and state transition
          events, and
 *    <li>default mouse and keyboard event handling.
 *  </ul>
 * This class has sufficient built-in functionality for most simple UI controls.
 * All controls dispatch SHOW, HIDE, ENTER, LEAVE, and ACTION events on show,
 * hide, mouseover, mouseout, and user action, respectively.  Additional states
 * are also supported.  See closure/demos/control.html
 * for example usage.
 *     to display as the content of the control (if any).
 *     decorate the component; defaults to {@link ControlRenderer}.
 *     document interaction.
 * @extends {Ui_Component}
 * @template T
 */
class Control extends Ui_Component {

  /**
   * Base class for UI controls.  Extends {@link Ui_Component} by adding
   * the following:
   *  <ul>
   *    <li>a {@link KeyHandler}, to simplify keyboard handling,
   *    <li>a pluggable <em>renderer</em> framework, to simplify the creation of
   *        simple controls without the need to subclass this class,
   *    <li>the notion of component <em>content</em>, like a text caption or DOM
   *        structure displayed in the component (e.g. a button label),
   *    <li>getter and setter for component content, as well as a getter and
   *        setter specifically for caption text (for convenience),
   *    <li>support for hiding/showing the component,
        <li>fine-grained control over supported states and state transition
            events, and
   *    <li>default mouse and keyboard event handling.
   *  </ul>
   * This class has sufficient built-in functionality for most simple UI controls.
   * All controls dispatch SHOW, HIDE, ENTER, LEAVE, and ACTION events on show,
   * hide, mouseover, mouseout, and user action, respectively.  Additional states
   * are also supported.  See closure/demos/control.html
   * for example usage.
   * @param {ControlContent=} opt_content Text caption or DOM structure
   *     to display as the content of the control (if any).
   * @param {T=} opt_renderer Renderer used to render or
   *     decorate the component; defaults to {@link ControlRenderer}.
   * @param {DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   * @template T
   */
  constructor(opt_content, opt_renderer, opt_domHelper) {
    super(opt_domHelper);
    /**
     * Text caption or DOM structure displayed in the component.
     * @type {?ControlContent}
     * @private
     */
    this.content_ = null;
  
    /**
     * Current component state; a bit mask of {@link State}s.
     * @type {number}
     * @private
     */
    this.state_ = 0x00;
  
    /**
     * A bit mask of {@link State}s this component supports.
     * @type {number}
     * @private
     */
    this.supportedStates_ = State.DISABLED |
        State.HOVER | State.ACTIVE |
        State.FOCUSED;
  
    /**
     * A bit mask of {@link State}s for which this component
     * provides default event handling.  For example, a component that handles
     * the HOVER state automatically will highlight itself on mouseover, whereas
     * a component that doesn't handle HOVER automatically will only dispatch
     * ENTER and LEAVE events but not call {@link setHighlighted} on itself.
     * By default, components provide default event handling for all states.
     * Controls hosted in containers (e.g. menu items in a menu, or buttons in a
     * toolbar) will typically want to have their container manage their highlight
     * state.  Selectable controls managed by a selection model will also typically
     * want their selection state to be managed by the model.
     * @type {number}
     * @private
     */
    this.autoStates_ = State.ALL;
  
    /**
     * A bit mask of {@link State}s for which this component
     * dispatches state transition events.  Because events are expensive, the
     * default behavior is to not dispatch any state transition events at all.
     * Use the {@link #setDispatchTransitionEvents} API to request transition
     * events  as needed.  Subclasses may enable transition events by default.
     * Controls hosted in containers or managed by a selection model will typically
     * want to dispatch transition events.
     * @type {number}
     * @private
     */
    this.statesWithTransitionEvents_ = 0x00;
  
    /**
     * Component visibility.
     * @type {boolean}
     * @private
     */
    this.visible_ = true;
  
    /**
     * Keyboard event handler.
     * @type {KeyHandler}
     * @private
     */
    this.keyHandler_ = null;
  
    /**
     * Additional class name(s) to apply to the control's root element, if any.
     * @type {Array<string>?}
     * @private
     */
    this.extraClassNames_ = null;
  
    /**
     * Whether the control should listen for and handle mouse events; defaults to
     * true.
     * @type {boolean}
     * @private
     */
    this.handleMouseEvents_ = true;
  
    /**
     * Whether the control allows text selection within its DOM.  Defaults to false.
     * @type {boolean}
     * @private
     */
    this.allowTextSelection_ = false;
  
    /**
     * The control's preferred ARIA role.
     * @type {?Role}
     * @private
     */
    this.preferredAriaRole_ = null;
  
    
    /**
     * Renderer associated with the component.
     * @type {T}
     * @private
     */
    this.renderer_ =
        opt_renderer || getDefaultRenderer(this.constructor);
    this.setContentInternal(opt_content !== undefined ? opt_content : null);
  
    /** @private {?string} The control's aria-label. */
    this.ariaLabel_ = null;
  
    /** @private {Control.IeMouseEventSequenceSimulator_} */
    this.ieMouseEventSequenceSimulator_;
  }

  /**
   * Maps a CSS class name to a function that returns a new instance of
   * {@link Control} or a subclass thereof, suitable to decorate
   * an element that has the specified CSS class.  UI components that extend
   * {@link Control} and want {@link goog.ui.Container}s to be able
   * to discover and decorate elements using them should register a factory
   * function via this API.
   * @param {string} className CSS class name.
   * @param {Function} decoratorFunction Function that takes no arguments and
   *     returns a new instance of a control to decorate an element with the
   *     given class.
   * @deprecated Use {@link setDecoratorByClassName} instead.
   */
  static registerDecorator(className, decoratorFunction) {
    return setDecoratorByClassName(className, decoratorFunction);
  }

  /**
   * Takes an element and returns a new instance of {@link Control}
   * or a subclass, suitable to decorate it (based on the element's CSS class).
   * @param {Element} element Element to decorate.
   * @return {Control?} New control instance to decorate the element
   *     (null if none).
   * @deprecated Use {@link getDecorator} instead.
   * @suppress {checkTypes}
   */
  static getDecorator(element) {
    return getDecorator(element);
  }

  /**
   * Returns true if the control is configured to handle its own mouse events,
   * false otherwise.  Controls not hosted in {@link goog.ui.Container}s have
   * to handle their own mouse events, but controls hosted in containers may
   * allow their parent to handle mouse events on their behalf.  Considered
   * protected; should only be used within this package and by subclasses.
   * @return {boolean} Whether the control handles its own mouse events.
   */
  isHandleMouseEvents() {
    return this.handleMouseEvents_;
  };

  /**
   * Enables or disables mouse event handling for the control.  Containers may
   * use this method to disable mouse event handling in their child controls.
   * Considered protected; should only be used within this package and by
   * subclasses.
   * @param {boolean} enable Whether to enable or disable mouse event handling.
   */
  setHandleMouseEvents(enable) {
    if (this.isInDocument() && enable != this.handleMouseEvents_) {
      // Already in the document; need to update event handler.
      this.enableMouseEventHandling_(enable);
    }
    this.handleMouseEvents_ = enable;
  };

  /**
   * Returns the DOM element on which the control is listening for keyboard
   * events (null if none).
   * @return {Element} Element on which the control is listening for key
   *     events.
   */
  getKeyEventTarget() {
    // Delegate to renderer.
    return this.renderer_.getKeyEventTarget(this);
  };

  /**
   * Returns the keyboard event handler for this component, lazily created the
   * first time this method is called.  Considered protected; should only be
   * used within this package and by subclasses.
   * @return {!KeyHandler} Keyboard event handler for this component.
   * @protected
   */
  getKeyHandler() {
    return this.keyHandler_ || (this.keyHandler_ = new KeyHandler());
  };

  /**
   * Returns the renderer used by this component to render itself or to decorate
   * an existing element.
   * @return {T|undefined} Renderer used by the component
   *     (undefined if none).
   */
  getRenderer() {
    return this.renderer_;
  };

  /**
   * Registers the given renderer with the component.  Changing renderers after
   * the component has entered the document is an error.
   * @param {T} renderer Renderer used by the component.
   * @throws {Error} If the control is already in the document.
   */
  setRenderer(renderer) {
    if (this.isInDocument()) {
      // Too late.
      throw new Error(ComponentError.ALREADY_RENDERED);
    }
  
    if (this.getElement()) {
      // The component has already been rendered, but isn't yet in the document.
      // Replace the renderer and delete the current DOM, so it can be re-rendered
      // using the new renderer the next time someone calls render().
      this.setElementInternal(null);
    }
  
    this.renderer_ = renderer;
  };

  /**
   * Returns any additional class name(s) to be applied to the component's
   * root element, or null if no extra class names are needed.
   * @return {Array<string>?} Additional class names to be applied to
   *     the component's root element (null if none).
   */
  getExtraClassNames() {
    return this.extraClassNames_;
  };

  /**
   * Adds the given class name to the list of classes to be applied to the
   * component's root element.
   * @param {string} className Additional class name to be applied to the
   *     component's root element.
   */
  addClassName(className) {
    if (className) {
      if (this.extraClassNames_) {
        if (!googarray.contains(this.extraClassNames_, className)) {
          this.extraClassNames_.push(className);
        }
      } else {
        this.extraClassNames_ = [className];
      }
      this.renderer_.enableExtraClassName(this, className, true);
    }
  };

  /**
   * Removes the given class name from the list of classes to be applied to
   * the component's root element.
   * @param {string} className Class name to be removed from the component's root
   *     element.
   */
  removeClassName(className) {
    if (className && this.extraClassNames_ &&
        googarray.remove(this.extraClassNames_, className)) {
      if (this.extraClassNames_.length == 0) {
        this.extraClassNames_ = null;
      }
      this.renderer_.enableExtraClassName(this, className, false);
    }
  };

  /**
   * Adds or removes the given class name to/from the list of classes to be
   * applied to the component's root element.
   * @param {string} className CSS class name to add or remove.
   * @param {boolean} enable Whether to add or remove the class name.
   */
  enableClassName(className, enable) {
    if (enable) {
      this.addClassName(className);
    } else {
      this.removeClassName(className);
    }
  };

  /**
   * Creates the control's DOM.  Overrides {@link Ui_Component#createDom} by
   * delegating DOM manipulation to the control's renderer.
   * @override
   */
  createDom() {
    var element = this.renderer_.createDom(this);
    this.setElementInternal(element);
  
    // Initialize ARIA role.
    this.renderer_.setAriaRole(element, this.getPreferredAriaRole());
  
    // Initialize text selection.
    if (!this.isAllowTextSelection()) {
      // The renderer is assumed to create selectable elements.  Since making
      // elements unselectable is expensive, only do it if needed (bug 1037090).
      this.renderer_.setAllowTextSelection(element, false);
    }
  
    // Initialize visibility.
    if (!this.isVisible()) {
      // The renderer is assumed to create visible elements. Since hiding
      // elements can be expensive, only do it if needed (bug 1037105).
      this.renderer_.setVisible(element, false);
    }
  };

  /**
   * Returns the control's preferred ARIA role. This can be used by a control to
   * override the role that would be assigned by the renderer.  This is useful in
   * cases where a different ARIA role is appropriate for a control because of the
   * context in which it's used.  E.g., a {@link goog.ui.MenuButton} added to a
   * {@link goog.ui.Select} should have an ARIA role of LISTBOX and not MENUITEM.
   * @return {?Role} This control's preferred ARIA role or null if
   *     no preferred ARIA role is set.
   */
  getPreferredAriaRole() {
    return this.preferredAriaRole_;
  };

  /**
   * Sets the control's preferred ARIA role. This can be used to override the role
   * that would be assigned by the renderer.  This is useful in cases where a
   * different ARIA role is appropriate for a control because of the
   * context in which it's used.  E.g., a {@link goog.ui.MenuButton} added to a
   * {@link goog.ui.Select} should have an ARIA role of LISTBOX and not MENUITEM.
   * @param {Role} role This control's preferred ARIA role.
   */
  setPreferredAriaRole(role) {
    this.preferredAriaRole_ = role;
  };

  /**
   * Gets the control's aria label.
   * @return {?string} This control's aria label.
   */
  getAriaLabel() {
    return this.ariaLabel_;
  };

  /**
   * Sets the control's aria label. This can be used to assign aria label to the
   * element after it is rendered.
   * @param {string} label The string to set as the aria label for this control.
   *     No escaping is done on this value.
   */
  setAriaLabel(label) {
    this.ariaLabel_ = label;
    var element = this.getElement();
    if (element) {
      this.renderer_.setAriaLabel(element, label);
    }
  };

  /**
   * Returns the DOM element into which child components are to be rendered,
   * or null if the control itself hasn't been rendered yet.  Overrides
   * {@link Ui_Component#getContentElement} by delegating to the renderer.
   * @return {Element} Element to contain child elements (null if none).
   * @override
   */
  getContentElement() {
    // Delegate to renderer.
    return this.renderer_.getContentElement(this.getElement());
  };

  /**
   * Returns true if the given element can be decorated by this component.
   * Overrides {@link Ui_Component#canDecorate}.
   * @param {Element} element Element to decorate.
   * @return {boolean} Whether the element can be decorated by this component.
   * @override
   */
  canDecorate(element) {
    // Controls support pluggable renderers; delegate to the renderer.
    return this.renderer_.canDecorate(element);
  };

  /**
   * Decorates the given element with this component. Overrides {@link
   * Ui_Component#decorateInternal} by delegating DOM manipulation
   * to the control's renderer.
   * @param {Element} element Element to decorate.
   * @protected
   * @override
   */
  decorateInternal(element) {
    element = this.renderer_.decorate(this, element);
    this.setElementInternal(element);
  
    // Initialize ARIA role.
    this.renderer_.setAriaRole(element, this.getPreferredAriaRole());
  
    // Initialize text selection.
    if (!this.isAllowTextSelection()) {
      // Decorated elements are assumed to be selectable.  Since making elements
      // unselectable is expensive, only do it if needed (bug 1037090).
      this.renderer_.setAllowTextSelection(element, false);
    }
  
    // Initialize visibility based on the decorated element's styling.
    this.visible_ = element.style.display != 'none';
  };

  /**
   * Configures the component after its DOM has been rendered, and sets up event
   * handling.  Overrides {@link Ui_Component#enterDocument}.
   * @override
   */
  enterDocument() {
    super.enterDocument();
  
    // Call the renderer's setAriaStates method to set element's aria attributes.
    this.renderer_.setAriaStates(this, this.getElementStrict());
  
    // Call the renderer's initializeDom method to configure properties of the
    // control's DOM that can only be done once it's in the document.
    this.renderer_.initializeDom(this);
  
    // Initialize event handling if at least one state other than DISABLED is
    // supported.
    if (this.supportedStates_ & ~State.DISABLED) {
      // Initialize mouse event handling if the control is configured to handle
      // its own mouse events.  (Controls hosted in containers don't need to
      // handle their own mouse events.)
      if (this.isHandleMouseEvents()) {
        this.enableMouseEventHandling_(true);
      }
  
      // Initialize keyboard event handling if the control is focusable and has
      // a key event target.  (Controls hosted in containers typically aren't
      // focusable, allowing their container to handle keyboard events for them.)
      if (this.isSupportedState(State.FOCUSED)) {
        var keyTarget = this.getKeyEventTarget();
        if (keyTarget) {
          var keyHandler = this.getKeyHandler();
          keyHandler.attach(keyTarget);
          this.getHandler()
              .listen(
                  keyHandler, EventType.KEY,
                  this.handleKeyEvent)
              .listen(keyTarget, EventsEventType.FOCUS, this.handleFocus)
              .listen(keyTarget, EventsEventType.BLUR, this.handleBlur);
        }
      }
    }
  };

  /**
   * Enables or disables mouse event handling on the control.
   * @param {boolean} enable Whether to enable mouse event handling.
   * @private
   */
  enableMouseEventHandling_(enable) {
    var MouseEventType = ComponentUtil.getMouseEventType(this);
  
    var handler = this.getHandler();
    var element = this.getElement();
    if (enable) {
      handler.listen(element, MouseEventType.MOUSEDOWN, this.handleMouseDown)
          .listen(
              element, [MouseEventType.MOUSEUP, MouseEventType.MOUSECANCEL],
              this.handleMouseUp)
          .listen(element, EventsEventType.MOUSEOVER, this.handleMouseOver)
          .listen(element, EventsEventType.MOUSEOUT, this.handleMouseOut);
      if (this.pointerEventsEnabled()) {
        // Prevent pointer events from capturing the target element so they behave
        // more like mouse events.
        handler.listen(
            element, EventsEventType.GOTPOINTERCAPTURE,
            this.preventPointerCapture_);
      }
      if (this.handleContextMenu != google.nullFunction) {
        handler.listen(
            element, EventsEventType.CONTEXTMENU, this.handleContextMenu);
      }
      if (userAgent.IE) {
        // Versions of IE before 9 send only one click event followed by a
        // dblclick, so we must explicitly listen for these. In later versions,
        // two click events are fired  and so a dblclick listener is unnecessary.
        if (!userAgent.isVersionOrHigher(9)) {
          handler.listen(
              element, EventsEventType.DBLCLICK, this.handleDblClick);
        }
        if (!this.ieMouseEventSequenceSimulator_) {
          this.ieMouseEventSequenceSimulator_ =
              new Control.IeMouseEventSequenceSimulator_(this);
          this.registerDisposable(this.ieMouseEventSequenceSimulator_);
        }
      }
    } else {
      handler.unlisten(element, MouseEventType.MOUSEDOWN, this.handleMouseDown)
          .unlisten(
              element, [MouseEventType.MOUSEUP, MouseEventType.MOUSECANCEL],
              this.handleMouseUp)
          .unlisten(
              element, EventsEventType.MOUSEOVER, this.handleMouseOver)
          .unlisten(element, EventsEventType.MOUSEOUT, this.handleMouseOut);
      if (this.pointerEventsEnabled()) {
        handler.unlisten(
            element, EventsEventType.GOTPOINTERCAPTURE,
            this.preventPointerCapture_);
      }
      if (this.handleContextMenu != google.nullFunction) {
        handler.unlisten(
            element, EventsEventType.CONTEXTMENU, this.handleContextMenu);
      }
      if (userAgent.IE) {
        if (!userAgent.isVersionOrHigher(9)) {
          handler.unlisten(
              element, EventsEventType.DBLCLICK, this.handleDblClick);
        }
        dispose(this.ieMouseEventSequenceSimulator_);
        this.ieMouseEventSequenceSimulator_ = null;
      }
    }
  };

  /**
   * Cleans up the component before its DOM is removed from the document, and
   * removes event handlers.  Overrides {@link Ui_Component#exitDocument}
   * by making sure that components that are removed from the document aren't
   * focusable (i.e. have no tab index).
   * @override
   */
  exitDocument() {
    super.exitDocument();
    if (this.keyHandler_) {
      this.keyHandler_.detach();
    }
    if (this.isVisible() && this.isEnabled()) {
      this.renderer_.setFocusable(this, false);
    }
  };

  /** @override */
  disposeInternal() {
    super.disposeInternal();
    if (this.keyHandler_) {
      this.keyHandler_.dispose();
      delete this.keyHandler_;
    }
    delete this.renderer_;
    this.content_ = null;
    this.extraClassNames_ = null;
    this.ieMouseEventSequenceSimulator_ = null;
  };

  /**
   * Returns the text caption or DOM structure displayed in the component.
   * @return {ControlContent} Text caption or DOM structure
   *     comprising the component's contents.
   */
  getContent() {
    return this.content_;
  };

  /**
   * Sets the component's content to the given text caption, element, or array of
   * nodes.  (If the argument is an array of nodes, it must be an actual array,
   * not an array-like object.)
   * @param {ControlContent} content Text caption or DOM
   *     structure to set as the component's contents.
   */
  setContent(content) {
    // Controls support pluggable renderers; delegate to the renderer.
    this.renderer_.setContent(this.getElement(), content);
  
    // setContentInternal needs to be after the renderer, since the implementation
    // may depend on the content being in the DOM.
    this.setContentInternal(content);
  };

  /**
   * Sets the component's content to the given text caption, element, or array
   * of nodes.  Unlike {@link #setContent}, doesn't modify the component's DOM.
   * Called by renderers during element decoration.
   *
   * This should only be used by subclasses and its associated renderers.
   *
   * @param {ControlContent} content Text caption or DOM structure
   *     to set as the component's contents.
   */
  setContentInternal(content) {
    this.content_ = content;
  };

  /**
   * @return {string} Text caption of the control or empty string if none.
   * @suppress{checkTypes}
   */
  getCaption() {
    var content = this.getContent();
    if (!content) {
      return '';
    }
    var caption = (typeof content === 'string') ?
        content :
        google.isArray(content) ?
        googarray.map(content, goog_dom.getRawTextContent).join('') :
        goog_dom.getTextContent(/** @type {!Node} */ (content));
    return strings.collapseBreakingSpaces(caption);
  };

  /**
   * Sets the text caption of the component.
   * @param {string} caption Text caption of the component.
   */
  setCaption(caption) {
    this.setContent(caption);
  };

  /** @override */
  setRightToLeft(rightToLeft) {
    // The superclass implementation ensures the control isn't in the document.
    super.setRightToLeft(rightToLeft);
  
    var element = this.getElement();
    if (element) {
      this.renderer_.setRightToLeft(element, rightToLeft);
    }
  };

  /**
   * Returns true if the control allows text selection within its DOM, false
   * otherwise.  Controls that disallow text selection have the appropriate
   * unselectable styling applied to their elements.  Note that controls hosted
   * in containers will report that they allow text selection even if their
   * container disallows text selection.
   * @return {boolean} Whether the control allows text selection.
   */
  isAllowTextSelection() {
    return this.allowTextSelection_;
  };

  /**
   * Allows or disallows text selection within the control's DOM.
   * @param {boolean} allow Whether the control should allow text selection.
   */
  setAllowTextSelection(allow) {
    this.allowTextSelection_ = allow;
  
    var element = this.getElement();
    if (element) {
      this.renderer_.setAllowTextSelection(element, allow);
    }
  };

  /**
   * Returns true if the component's visibility is set to visible, false if
   * it is set to hidden.  A component that is set to hidden is guaranteed
   * to be hidden from the user, but the reverse isn't necessarily true.
   * A component may be set to visible but can otherwise be obscured by another
   * element, rendered off-screen, or hidden using direct CSS manipulation.
   * @return {boolean} Whether the component is visible.
   */
  isVisible() {
    return this.visible_;
  };

  /**
   * Shows or hides the component.  Does nothing if the component already has
   * the requested visibility.  Otherwise, dispatches a SHOW or HIDE event as
   * appropriate, giving listeners a chance to prevent the visibility change.
   * When showing a component that is both enabled and focusable, ensures that
   * its key target has a tab index.  When hiding a component that is enabled
   * and focusable, blurs its key target and removes its tab index.
   * @param {boolean} visible Whether to show or hide the component.
   * @param {boolean=} opt_force If true, doesn't check whether the component
   *     already has the requested visibility, and doesn't dispatch any events.
   * @return {boolean} Whether the visibility was changed.
   */
  setVisible(visible, opt_force) {
    if (opt_force || (this.visible_ != visible &&
                      this.dispatchEvent(
                          visible ? ComponentEventType.SHOW :
                                    ComponentEventType.HIDE))) {
      var element = this.getElement();
      if (element) {
        this.renderer_.setVisible(element, visible);
      }
      if (this.isEnabled()) {
        this.renderer_.setFocusable(this, visible);
      }
      this.visible_ = visible;
      return true;
    }
    return false;
  };

  /**
   * Returns true if the component is enabled, false otherwise.
   * @return {boolean} Whether the component is enabled.
   */
  isEnabled() {
    return !this.hasState(State.DISABLED);
  };

  /**
   * Returns true if the control has a parent that is itself disabled, false
   * otherwise.
   * @return {boolean} Whether the component is hosted in a disabled container.
   * @private
   */
  isParentDisabled_() {
    var parent = this.getParent();
    return !!parent && typeof parent.isEnabled == 'function' &&
        !parent.isEnabled();
  };

  /**
   * Enables or disables the component.  Does nothing if this state transition
   * is disallowed.  If the component is both visible and focusable, updates its
   * focused state and tab index as needed.  If the component is being disabled,
   * ensures that it is also deactivated and un-highlighted first.  Note that the
   * component's enabled/disabled state is "locked" as long as it is hosted in a
   * {@link goog.ui.Container} that is itself disabled; this is to prevent clients
   * from accidentally re-enabling a control that is in a disabled container.
   * @param {boolean} enable Whether to enable or disable the component.
   * @see #isTransitionAllowed
   */
  setEnabled(enable) {
    if (!this.isParentDisabled_() &&
        this.isTransitionAllowed(State.DISABLED, !enable)) {
      if (!enable) {
        this.setActive(false);
        this.setHighlighted(false);
      }
      if (this.isVisible()) {
        this.renderer_.setFocusable(this, enable);
      }
      this.setState(State.DISABLED, !enable, true);
    }
  };

  /**
   * Returns true if the component is currently highlighted, false otherwise.
   * @return {boolean} Whether the component is highlighted.
   */
  isHighlighted() {
    return this.hasState(State.HOVER);
  };

  /**
   * Highlights or unhighlights the component.  Does nothing if this state
   * transition is disallowed.
   * @param {boolean} highlight Whether to highlight or unhighlight the component.
   * @see #isTransitionAllowed
   */
  setHighlighted(highlight) {
    if (this.isTransitionAllowed(State.HOVER, highlight)) {
      this.setState(State.HOVER, highlight);
    }
  };

  /**
   * Returns true if the component is active (pressed), false otherwise.
   * @return {boolean} Whether the component is active.
   */
  isActive() {
    return this.hasState(State.ACTIVE);
  };

  /**
   * Activates or deactivates the component.  Does nothing if this state
   * transition is disallowed.
   * @param {boolean} active Whether to activate or deactivate the component.
   * @see #isTransitionAllowed
   */
  setActive(active) {
    if (this.isTransitionAllowed(State.ACTIVE, active)) {
      this.setState(State.ACTIVE, active);
    }
  };

  /**
   * Returns true if the component is selected, false otherwise.
   * @return {boolean} Whether the component is selected.
   */
  isSelected() {
    return this.hasState(State.SELECTED);
  };

  /**
   * Selects or unselects the component.  Does nothing if this state transition
   * is disallowed.
   * @param {boolean} select Whether to select or unselect the component.
   * @see #isTransitionAllowed
   */
  setSelected(select) {
    if (this.isTransitionAllowed(State.SELECTED, select)) {
      this.setState(State.SELECTED, select);
    }
  };

  /**
   * Returns true if the component is checked, false otherwise.
   * @return {boolean} Whether the component is checked.
   */
  isChecked() {
    return this.hasState(State.CHECKED);
  };

  /**
   * Checks or unchecks the component.  Does nothing if this state transition
   * is disallowed.
   * @param {boolean} check Whether to check or uncheck the component.
   * @see #isTransitionAllowed
   */
  setChecked(check) {
    if (this.isTransitionAllowed(State.CHECKED, check)) {
      this.setState(State.CHECKED, check);
    }
  };

  /**
   * Returns true if the component is styled to indicate that it has keyboard
   * focus, false otherwise.  Note that `isFocused()` returning true
   * doesn't guarantee that the component's key event target has keyboard focus,
   * only that it is styled as such.
   * @return {boolean} Whether the component is styled to indicate as having
   *     keyboard focus.
   */
  isFocused() {
    return this.hasState(State.FOCUSED);
  };

  /**
   * Applies or removes styling indicating that the component has keyboard focus.
   * Note that unlike the other "set" methods, this method is called as a result
   * of the component's element having received or lost keyboard focus, not the
   * other way around, so calling `setFocused(true)` doesn't guarantee that
   * the component's key event target has keyboard focus, only that it is styled
   * as such.
   * @param {boolean} focused Whether to apply or remove styling to indicate that
   *     the component's element has keyboard focus.
   */
  setFocused(focused) {
    if (this.isTransitionAllowed(State.FOCUSED, focused)) {
      this.setState(State.FOCUSED, focused);
    }
  };

  /**
   * Returns true if the component is open (expanded), false otherwise.
   * @return {boolean} Whether the component is open.
   */
  isOpen() {
    return this.hasState(State.OPENED);
  };

  /**
   * Opens (expands) or closes (collapses) the component.  Does nothing if this
   * state transition is disallowed.
   * @param {boolean} open Whether to open or close the component.
   * @see #isTransitionAllowed
   */
  setOpen(open) {
    if (this.isTransitionAllowed(State.OPENED, open)) {
      this.setState(State.OPENED, open);
    }
  };

  /**
   * Returns the component's state as a bit mask of {@link
   * State}s.
   * @return {number} Bit mask representing component state.
   */
  getState() {
    return this.state_;
  };

  /**
   * Returns true if the component is in the specified state, false otherwise.
   * @param {State} state State to check.
   * @return {boolean} Whether the component is in the given state.
   */
  hasState(state) {
    return !!(this.state_ & state);
  };

  /**
   * Sets or clears the given state on the component, and updates its styling
   * accordingly.  Does nothing if the component is already in the correct state
   * or if it doesn't support the specified state.  Doesn't dispatch any state
   * transition events; use advisedly.
   * @param {State} state State to set or clear.
   * @param {boolean} enable Whether to set or clear the state (if supported).
   * @param {boolean=} opt_calledFrom Prevents looping with setEnabled.
   */
  setState(state, enable, opt_calledFrom) {
    if (!opt_calledFrom && state == State.DISABLED) {
      this.setEnabled(!enable);
      return;
    }
    if (this.isSupportedState(state) && enable != this.hasState(state)) {
      // Delegate actual styling to the renderer, since it is DOM-specific.
      this.renderer_.setState(this, state, enable);
      this.state_ = enable ? this.state_ | state : this.state_ & ~state;
    }
  };

  /**
   * Sets the component's state to the state represented by a bit mask of
   * {@link State}s.  Unlike {@link #setState}, doesn't
   * update the component's styling, and doesn't reject unsupported states.
   * Called by renderers during element decoration.  Considered protected;
   * should only be used within this package and by subclasses.
   *
   * This should only be used by subclasses and its associated renderers.
   *
   * @param {number} state Bit mask representing component state.
   */
  setStateInternal(state) {
    this.state_ = state;
  };

  /**
   * Returns true if the component supports the specified state, false otherwise.
   * @param {State} state State to check.
   * @return {boolean} Whether the component supports the given state.
   */
  isSupportedState(state) {
    return !!(this.supportedStates_ & state);
  };

  /**
   * Enables or disables support for the given state. Disabling support
   * for a state while the component is in that state is an error.
   * @param {State} state State to support or de-support.
   * @param {boolean} support Whether the component should support the state.
   * @throws {Error} If disabling support for a state the control is currently in.
   */
  setSupportedState(state, support) {
    if (this.isInDocument() && this.hasState(state) && !support) {
      // Since we hook up event handlers in enterDocument(), this is an error.
      throw new Error(ComponentError.ALREADY_RENDERED);
    }
  
    if (!support && this.hasState(state)) {
      // We are removing support for a state that the component is currently in.
      this.setState(state, false);
    }
  
    this.supportedStates_ =
        support ? this.supportedStates_ | state : this.supportedStates_ & ~state;
  };

  /**
   * Returns true if the component provides default event handling for the state,
   * false otherwise.
   * @param {State} state State to check.
   * @return {boolean} Whether the component provides default event handling for
   *     the state.
   */
  isAutoState(state) {
    return !!(this.autoStates_ & state) && this.isSupportedState(state);
  };

  /**
   * Enables or disables automatic event handling for the given state(s).
   * @param {number} states Bit mask of {@link State}s for which
   *     default event handling is to be enabled or disabled.
   * @param {boolean} enable Whether the component should provide default event
   *     handling for the state(s).
   */
  setAutoStates(states, enable) {
    this.autoStates_ =
        enable ? this.autoStates_ | states : this.autoStates_ & ~states;
  };

  /**
   * Returns true if the component is set to dispatch transition events for the
   * given state, false otherwise.
   * @param {State} state State to check.
   * @return {boolean} Whether the component dispatches transition events for
   *     the state.
   */
  isDispatchTransitionEvents(state) {
    return !!(this.statesWithTransitionEvents_ & state) &&
        this.isSupportedState(state);
  };

  /**
   * Enables or disables transition events for the given state(s).  Controls
   * handle state transitions internally by default, and only dispatch state
   * transition events if explicitly requested to do so by calling this method.
   * @param {number} states Bit mask of {@link State}s for
   *     which transition events should be enabled or disabled.
   * @param {boolean} enable Whether transition events should be enabled.
   */
  setDispatchTransitionEvents(
      states, enable) {
    this.statesWithTransitionEvents_ = enable ?
        this.statesWithTransitionEvents_ | states :
        this.statesWithTransitionEvents_ & ~states;
  };

  /**
   * Returns true if the transition into or out of the given state is allowed to
   * proceed, false otherwise.  A state transition is allowed under the following
   * conditions:
   * <ul>
   *   <li>the component supports the state,
   *   <li>the component isn't already in the target state,
   *   <li>either the component is configured not to dispatch events for this
   *       state transition, or a transition event was dispatched and wasn't
   *       canceled by any event listener, and
   *   <li>the component hasn't been disposed of
   * </ul>
   * Considered protected; should only be used within this package and by
   * subclasses.
   * @param {State} state State to/from which the control is
   *     transitioning.
   * @param {boolean} enable Whether the control is entering or leaving the state.
   * @return {boolean} Whether the state transition is allowed to proceed.
   * @protected
   */
  isTransitionAllowed(state, enable) {
    return this.isSupportedState(state) && this.hasState(state) != enable &&
        (!(this.statesWithTransitionEvents_ & state) ||
         this.dispatchEvent(
             Ui_Component.getStateTransitionEvent(state, enable))) &&
        !this.isDisposed();
  };

  /**
   * Handles mouseover events.  Dispatches an ENTER event; if the event isn't
   * canceled, the component is enabled, and it supports auto-highlighting,
   * highlights the component.  Considered protected; should only be used
   * within this package and by subclasses.
   * @param {EventsBrowserEvent} e Mouse event to handle.
   */
  handleMouseOver(e) {
    // Ignore mouse moves between descendants.
    if (!Control.isMouseEventWithinElement_(e, this.getElement()) &&
        this.dispatchEvent(ComponentEventType.ENTER) &&
        this.isEnabled() && this.isAutoState(State.HOVER)) {
      this.setHighlighted(true);
    }
  };

  /**
   * Handles mouseout events.  Dispatches a LEAVE event; if the event isn't
   * canceled, and the component supports auto-highlighting, deactivates and
   * un-highlights the component.  Considered protected; should only be used
   * within this package and by subclasses.
   * @param {EventsBrowserEvent} e Mouse event to handle.
   */
  handleMouseOut(e) {
    if (!Control.isMouseEventWithinElement_(e, this.getElement()) &&
        this.dispatchEvent(ComponentEventType.LEAVE)) {
      if (this.isAutoState(State.ACTIVE)) {
        // Deactivate on mouseout; otherwise we lose track of the mouse button.
        this.setActive(false);
      }
      if (this.isAutoState(State.HOVER)) {
        this.setHighlighted(false);
      }
    }
  };

  /**
   * @param {!EventsBrowserEvent} e Event to handle.
   * @private
   */
  preventPointerCapture_(e) {
    var elem = /** @type {!Element} */ (e.target);
    if (!!elem.releasePointerCapture) {
      elem.releasePointerCapture(e.pointerId);
    }
  };

  /**
   * Handles contextmenu events.
   * @param {EventsBrowserEvent} e Event to handle.
   */
  handleContextMenu(e) {}

  /**
   * Checks if a mouse event (mouseover or mouseout) occurred below an element.
   * @param {EventsBrowserEvent} e Mouse event (should be mouseover or
   *     mouseout).
   * @param {Element} elem The ancestor element.
   * @return {boolean} Whether the event has a relatedTarget (the element the
   *     mouse is coming from) and it's a descendant of elem.
   * @private
   */
  static isMouseEventWithinElement_(e, elem) {
    // If relatedTarget is null, it means there was no previous element (e.g.
    // the mouse moved out of the window).  Assume this means that the mouse
    // event was not within the element.
    return !!e.relatedTarget && goog_dom.contains(elem, e.relatedTarget);
  };

  /**
   * Handles mousedown events.  If the component is enabled, highlights and
   * activates it.  If the component isn't configured for keyboard access,
   * prevents it from receiving keyboard focus.  Considered protected; should
   * only be used within this package and by subclasses.
   * @param {EventsEvent} e Mouse event to handle.
   */
  handleMouseDown(e) {
      e = /** @type {!EventsBrowserEvent} */ (e);
    if (this.isEnabled()) {
      // Highlight enabled control on mousedown, regardless of the mouse button.
      if (this.isAutoState(State.HOVER)) {
        this.setHighlighted(true);
      }
  
      // For the left button only, activate the control, and focus its key event
      // target (if supported).
      if (e.isMouseActionButton()) {
        if (this.isAutoState(State.ACTIVE)) {
          this.setActive(true);
        }
        if (this.renderer_ && this.renderer_.isFocusable(this)) {
          this.getKeyEventTarget().focus();
        }
      }
    }
  
    // Cancel the default action unless the control allows text selection.
    if (!this.isAllowTextSelection() && e.isMouseActionButton()) {
      e.preventDefault();
    }
  };

  /**
   * Handles mouseup events.  If the component is enabled, highlights it.  If
   * the component has previously been activated, performs its associated action
   * by calling {@link performActionInternal}, then deactivates it.  Considered
   * protected; should only be used within this package and by subclasses.
   * @param {EventsEvent} e Mouse event to handle.
   */
  handleMouseUp(e) {
    if (this.isEnabled()) {
      if (this.isAutoState(State.HOVER)) {
        this.setHighlighted(true);
      }
      if (this.isActive() && this.performActionInternal(e) &&
          this.isAutoState(State.ACTIVE)) {
        this.setActive(false);
      }
    }
  };

  /**
   * Handles dblclick events.  Should only be registered if the user agent is
   * IE.  If the component is enabled, performs its associated action by calling
   * {@link performActionInternal}.  This is used to allow more performant
   * buttons in IE.  In IE, no mousedown event is fired when that mousedown will
   * trigger a dblclick event.  Because of this, a user clicking quickly will
   * only cause ACTION events to fire on every other click.  This is a workaround
   * to generate ACTION events for every click.  Unfortunately, this workaround
   * won't ever trigger the ACTIVE state.  This is roughly the same behaviour as
   * if this were a 'button' element with a listener on mouseup.  Considered
   * protected; should only be used within this package and by subclasses.
   * @param {EventsEvent} e Mouse event to handle.
   */
  handleDblClick(e) {
    if (this.isEnabled()) {
      this.performActionInternal(e);
    }
  };

  /**
   * Performs the appropriate action when the control is activated by the user.
   * The default implementation first updates the checked and selected state of
   * controls that support them, then dispatches an ACTION event.  Considered
   * protected; should only be used within this package and by subclasses.
   * @param {EventsEvent} e Event that triggered the action.
   * @return {boolean} Whether the action is allowed to proceed.
   * @protected
   * @suppress {checkTypes}
   */
  performActionInternal(e) {
    if (this.isAutoState(State.CHECKED)) {
      this.setChecked(!this.isChecked());
    }
    if (this.isAutoState(State.SELECTED)) {
      this.setSelected(true);
    }
    if (this.isAutoState(State.OPENED)) {
      this.setOpen(!this.isOpen());
    }
  
    var actionEvent =
        /** @type {EventsBrowserEvent} */(new EventsEvent(ComponentEventType.ACTION, this));
    if (e) {
      actionEvent.altKey = e.altKey;
      actionEvent.ctrlKey = e.ctrlKey;
      actionEvent.metaKey = e.metaKey;
      actionEvent.shiftKey = e.shiftKey;
      actionEvent.platformModifierKey = e.platformModifierKey;
    }
    return this.dispatchEvent(actionEvent);
  };

  /**
   * Handles focus events on the component's key event target element.  If the
   * component is focusable, updates its state and styling to indicate that it
   * now has keyboard focus.  Considered protected; should only be used within
   * this package and by subclasses.  <b>Warning:</b> IE dispatches focus and
   * blur events asynchronously!
   * @param {EventsEvent} e Focus event to handle.
   */
  handleFocus(e) {
    if (this.isAutoState(State.FOCUSED)) {
      this.setFocused(true);
    }
  };

  /**
   * Handles blur events on the component's key event target element.  Always
   * deactivates the component.  In addition, if the component is focusable,
   * updates its state and styling to indicate that it no longer has keyboard
   * focus.  Considered protected; should only be used within this package and
   * by subclasses.  <b>Warning:</b> IE dispatches focus and blur events
   * asynchronously!
   * @param {EventsEvent} e Blur event to handle.
   */
  handleBlur(e) {
    if (this.isAutoState(State.ACTIVE)) {
      this.setActive(false);
    }
    if (this.isAutoState(State.FOCUSED)) {
      this.setFocused(false);
    }
  };

  /**
   * Attempts to handle a keyboard event, if the component is enabled and visible,
   * by calling {@link handleKeyEventInternal}.  Considered protected; should only
   * be used within this package and by subclasses.
   * @param {KeyEvent} e Key event to handle.
   * @return {boolean} Whether the key event was handled.
   */
  handleKeyEvent(e) {
    if (this.isVisible() && this.isEnabled() && this.handleKeyEventInternal(e)) {
      e.preventDefault();
      e.stopPropagation();
      return true;
    }
    return false;
  };

  /**
   * Attempts to handle a keyboard event; returns true if the event was handled,
   * false otherwise.  Considered protected; should only be used within this
   * package and by subclasses.
   * @param {KeyEvent} e Key event to handle.
   * @return {boolean} Whether the key event was handled.
   * @protected
   */
  handleKeyEventInternal(e) {
    return e.keyCode == KeyCodes.ENTER &&
        this.performActionInternal(e);
  };
}

// google.tagUnsealableClass(Control);

// Renderer registry.
// TODO(attila): Refactor existing usages inside Google in a follow-up CL.

// Event handler and renderer management.

// Support for additional styling.

// Standard Ui_Component implementation.

// Component content management.

// Component state management.

// Default event handlers, to be overridden in subclasses.

// Register the default renderer for goog.ui.Controls.
setDefaultRenderer(Control, ControlRenderer);

// Register a decorator factory function for goog.ui.Controls.
setDecoratorByClassName(
    ControlRenderer.CSS_CLASS,
    function() { return new Control(null); });

/**
 * A singleton that helps Control instances play well with screen
 * readers.  It necessitated by shortcomings in IE, and need not be
 * instantiated in any other browser.
 *
 * In most cases, a click on a Control results in a sequence of events:
 * MOUSEDOWN, MOUSEUP and CLICK.  UI controls rely on this sequence since most
 * behavior is trigged by MOUSEDOWN and MOUSEUP.  But when IE is used with some
 * traditional screen readers (JAWS, NVDA and perhaps others), IE only sends
 * the CLICK event, resulting in the control being unresponsive.  This class
 * monitors the sequence of these events, and if it detects a CLICK event not
 * not preceded by a MOUSEUP event, directly calls the control's event handlers
 * for MOUSEDOWN, then MOUSEUP.  While the resulting sequence is different from
 * the norm (the CLICK comes first instead of last), testing thus far shows
 * the resulting behavior to be correct.
 *
 * See http://goo.gl/qvQR4C for more details.
 *
 * @extends {Disposable}
 * @private
 */
Control.IeMouseEventSequenceSimulator_ = class extends Disposable {

  /**
   * A singleton that helps Control instances play well with screen
   * readers.  It necessitated by shortcomings in IE, and need not be
   * instantiated in any other browser.
   *
   * In most cases, a click on a Control results in a sequence of events:
   * MOUSEDOWN, MOUSEUP and CLICK.  UI controls rely on this sequence since most
   * behavior is trigged by MOUSEDOWN and MOUSEUP.  But when IE is used with some
   * traditional screen readers (JAWS, NVDA and perhaps others), IE only sends
   * the CLICK event, resulting in the control being unresponsive.  This class
   * monitors the sequence of these events, and if it detects a CLICK event not
   * not preceded by a MOUSEUP event, directly calls the control's event handlers
   * for MOUSEDOWN, then MOUSEUP.  While the resulting sequence is different from
   * the norm (the CLICK comes first instead of last), testing thus far shows
   * the resulting behavior to be correct.
   *
   * See http://goo.gl/qvQR4C for more details.
   *
   * @param {!Control} control
   * @private
   */
  constructor(control) {
    super();
  
    /** @private {Control}*/
    this.control_ = control;
  
    /** @private {boolean} */
    this.clickExpected_ = false;
  
    /** @private @const {!EventHandler<
     *                       !Control.IeMouseEventSequenceSimulator_>}
     */
    this.handler_ = new EventHandler(this);
    this.registerDisposable(this.handler_);
  
    var element = this.control_.getElementStrict();
    var MouseEventType = ComponentUtil.getMouseEventType(control);
  
    this.handler_.listen(element, MouseEventType.MOUSEDOWN, this.handleMouseDown_)
        .listen(element, MouseEventType.MOUSEUP, this.handleMouseUp_)
        .listen(element, EventsEventType.CLICK, this.handleClick_);
  }

  /** @private */
  handleMouseDown_() {
    this.clickExpected_ = false;
  };

  /** @private */
  handleMouseUp_() {
    this.clickExpected_ = true;
  };

  /**
   * @param {!MouseEvent} e
   * @param {EventsEventType} typeArg
   * @return {!MouseEvent}
   * @private
   */
  static makeLeftMouseEvent_(
      e, typeArg) {
    'use strict';
  
    if (!Control.IeMouseEventSequenceSimulator_.SYNTHETIC_EVENTS_) {
      // IE < 9 does not support synthetic mouse events. Therefore, reuse the
      // existing MouseEvent by overwriting the read only button and type
      // properties. As IE < 9 does not support ES5 strict mode this will not
      // generate an exception even when the script specifies "use strict".
      e.button = MouseButton.LEFT;
      e.type = typeArg;
      return e;
    }
  
    var event = /** @type {!MouseEvent} */ (document.createEvent('MouseEvents'));
    event.initMouseEvent(
        typeArg, e.bubbles, e.cancelable,
        e.view || null,  // IE9 errors if view is undefined
        e.detail, e.screenX, e.screenY, e.clientX, e.clientY, e.ctrlKey, e.altKey,
        e.shiftKey, e.metaKey, MouseButton.LEFT,
        e.relatedTarget || null);  // IE9 errors if relatedTarget is undefined
    return event;
  };

  /**
   * @param {!EventsEvent} e
   * @private
   */
  handleClick_(e) {
    if (this.clickExpected_) {
      // This is the end of a normal click sequence: mouse-down, mouse-up, click.
      // Assume appropriate actions have already been performed.
      this.clickExpected_ = false;
      return;
    }
  
    // For click events not part of a normal sequence, similate the mouse-down and
    // mouse-up events by creating synthetic events for each and directly invoke
    // the corresponding event listeners in order.
  
    var browserEvent = /** @type {EventsBrowserEvent} */ (e);
  
    var event = /** @type {!MouseEvent} */ (browserEvent.getBrowserEvent());
    var origEventButton = event.button;
    var origEventType = event.type;
  
    var down = Control.IeMouseEventSequenceSimulator_.makeLeftMouseEvent_(
        event, EventsEventType.MOUSEDOWN);
    this.control_.handleMouseDown(
        new EventsBrowserEvent(down, browserEvent.currentTarget));
  
    var up = Control.IeMouseEventSequenceSimulator_.makeLeftMouseEvent_(
        event, EventsEventType.MOUSEUP);
    this.control_.handleMouseUp(
        new EventsBrowserEvent(up, browserEvent.currentTarget));
  
    if (Control.IeMouseEventSequenceSimulator_.SYNTHETIC_EVENTS_) {
      // This browser supports synthetic events. Avoid resetting the read only
      // properties (type, button) as they were not overwritten and writing them
      // results in an exception when running in ES5 strict mode.
      return;
    }
  
    // Restore original values for click handlers that have not yet been invoked.
    event.button = origEventButton;
    event.type = origEventType;
  };

  /** @override */
  disposeInternal() {
    this.control_ = null;
    super.disposeInternal();
  };
}

/**
 * Whether this browser supports synthetic MouseEvents.
 *
 * See https://msdn.microsoft.com/library/dn905219(v=vs.85).aspx for details.
 *
 * @private {boolean}
 * @const
 */
Control.IeMouseEventSequenceSimulator_.SYNTHETIC_EVENTS_ =
    !userAgent.IE || userAgent.isDocumentModeOrHigher(9);

export {Control, ControlRenderer, getDecorator, getDecoratorByClassName, getDefaultRenderer, reset, setDecoratorByClassName, setDefaultRenderer};