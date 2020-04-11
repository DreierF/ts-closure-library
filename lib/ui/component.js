import * as googarray from './../array/array.js';
import * as asserts from './../asserts/asserts.js';
import * as goog_dom from './../dom/dom.js';
import {DomHelper} from './../dom/dom.js';
import {NodeType} from './../dom/nodetype.js';
import {TagName} from './../dom/tagname.js';
import {EventTarget as EventsEventTarget} from './../events/eventhandler.js';
import {EventHandler} from './../events/eventhandler.js';
import * as object from './../object/object.js';
import * as style from './../style/style.js';
import {IdGenerator} from './idgenerator.js';
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
 * @fileoverview Abstract class for all UI components. This defines the standard
 * design pattern that all UI components should follow.
 *
 * @see ../demos/samplecomponent.html
 * @see http://code.google.com/p/closure-library/wiki/IntroToComponents
 */

/**
 * Default implementation of UI component.
 *
 * @extends {EventsEventTarget}
 * @suppress {underscore}
 */
class Component extends EventsEventTarget {

  /**
   * Default implementation of UI component.
   *
   * @param {DomHelper=} opt_domHelper Optional DOM helper.
   * @suppress {underscore}
   */
  constructor(opt_domHelper) {
    super();
    /**
     * Generator for unique IDs.
     * @type {IdGenerator}
     * @private
     */
    this.idGenerator_ = IdGenerator.getInstance();
  
    /**
     * DomHelper used to interact with the document, allowing components to be
     * created in a different window.
     * @protected {!DomHelper}
     * @suppress {underscore|visibility}
     */
    this.dom_ = opt_domHelper || goog_dom.getDomHelper();
  
    /**
     * Whether the component is rendered right-to-left.  Right-to-left is set
     * lazily when {@link #isRightToLeft} is called the first time, unless it has
     * been set by calling {@link #setRightToLeft} explicitly.
     * @private {?boolean}
     */
    this.rightToLeft_ = Component.defaultRightToLeft_;
  
    /**
     * Unique ID of the component, lazily initialized in {@link
     * Component#getId} if needed.  This property is strictly private and
     * must not be accessed directly outside of this class!
     * @private {?string}
     */
    this.id_ = null;
  
    /**
     * Whether the component is in the document.
     * @private {boolean}
     */
    this.inDocument_ = false;
  
    // TODO(attila): Stop referring to this private field in subclasses.
    /**
     * The DOM element for the component.
     * @private {?Element}
     */
    this.element_ = null;
  
    /**
     * Event handler.
     * TODO(user): rename it to handler_ after all component subclasses in
     * inside Google have been cleaned up.
     * Code search: http://go/component_code_search
     * @private {EventHandler|undefined}
     */
    this.googUiComponentHandler_ = void 0;
  
    /**
     * Arbitrary data object associated with the component.  Such as meta-data.
     * @private {*}
     */
    this.model_ = null;
  
    /**
     * Parent component to which events will be propagated.  This property is
     * strictly private and must not be accessed directly outside of this class!
     * @private {Component?}
     */
    this.parent_ = null;
  
    /**
     * Array of child components.  Lazily initialized on first use.  Must be kept
     * in sync with `childIndex_`.  This property is strictly private and
     * must not be accessed directly outside of this class!
     * @private {?Array<?Component>}
     */
    this.children_ = null;
  
    /**
     * Map of child component IDs to child components.  Used for constant-time
     * random access to child components by ID.  Lazily initialized on first use.
     * Must be kept in sync with `children_`.  This property is strictly
     * private and must not be accessed directly outside of this class!
     *
     * We use a plain Object, not a {@link goog.structs.Map}, for simplicity.
     * This means components can't have children with IDs such as 'constructor' or
     * 'valueOf', but this shouldn't really be an issue in practice, and if it is,
     * we can always fix it later without changing the API.
     *
     * @private {?Object}
     */
    this.childIndex_ = null;
  
    /**
     * Flag used to keep track of whether a component decorated an already
     * existing element or whether it created the DOM itself.
     *
     * If an element is decorated, dispose will leave the node in the document.
     * It is up to the app to remove the node.
     *
     * If an element was rendered, dispose will remove the node automatically.
     *
     * @private {boolean}
     */
    this.wasDecorated_ = false;
  
    /**
     * If true, listen for PointerEvent types rather than MouseEvent types. This
     * allows supporting drag gestures for touch/stylus input.
     * @private {boolean}
     */
    this.pointerEventsEnabled_ = false;
  }

  /**
   * Static helper method; returns the type of event components are expected to
   * dispatch when transitioning to or from the given state.
   * @param {State} state State to/from which the component
   *     is transitioning.
   * @param {boolean} isEntering Whether the component is entering or leaving the
   *     state.
   * @return {EventType} Event type to dispatch.
   */
  static getStateTransitionEvent(state, isEntering) {
    switch (state) {
      case State.DISABLED:
        return isEntering ? EventType.DISABLE :
                            EventType.ENABLE;
      case State.HOVER:
        return isEntering ? EventType.HIGHLIGHT :
                            EventType.UNHIGHLIGHT;
      case State.ACTIVE:
        return isEntering ? EventType.ACTIVATE :
                            EventType.DEACTIVATE;
      case State.SELECTED:
        return isEntering ? EventType.SELECT :
                            EventType.UNSELECT;
      case State.CHECKED:
        return isEntering ? EventType.CHECK :
                            EventType.UNCHECK;
      case State.FOCUSED:
        return isEntering ? EventType.FOCUS :
                            EventType.BLUR;
      case State.OPENED:
        return isEntering ? EventType.OPEN :
                            EventType.CLOSE;
      default:
        // Fall through.
    }
  
    // Invalid state.
    throw new Error(Component_Error.STATE_INVALID);
  };

  /**
   * Set the default right-to-left value. This causes all component's created from
   * this point forward to have the given value. This is useful for cases where
   * a given page is always in one directionality, avoiding unnecessary
   * right to left determinations.
   * @param {?boolean} rightToLeft Whether the components should be rendered
   *     right-to-left. Null iff components should determine their directionality.
   */
  static setDefaultRightToLeft(rightToLeft) {
    Component.defaultRightToLeft_ = rightToLeft;
  };

  /**
   * Gets the unique ID for the instance of this component.  If the instance
   * doesn't already have an ID, generates one on the fly.
   * @return {string} Unique component ID.
   */
  getId() {
    return this.id_ || (this.id_ = this.idGenerator_.getNextUniqueId());
  };

  /**
   * Assigns an ID to this component instance.  It is the caller's responsibility
   * to guarantee that the ID is unique.  If the component is a child of a parent
   * component, then the parent component's child index is updated to reflect the
   * new ID; this may throw an error if the parent already has a child with an ID
   * that conflicts with the new ID.
   * @param {string} id Unique component ID.
   */
  setId(id) {
    if (this.parent_ && this.parent_.childIndex_) {
      // Update the parent's child index.
      object.remove(this.parent_.childIndex_, this.id_);
      object.add(this.parent_.childIndex_, id, this);
    }
  
    // Update the component ID.
    this.id_ = id;
  };

  /**
   * Gets the component's element.
   * @return {Element} The element for the component.
   */
  getElement() {
    return this.element_;
  };

  /**
   * Gets the component's element. This differs from getElement in that
   * it assumes that the element exists (i.e. the component has been
   * rendered/decorated) and will cause an assertion error otherwise (if
   * assertion is enabled).
   * @return {!Element} The element for the component.
   */
  getElementStrict() {
    var el = this.element_;
    asserts.assert(
        el, 'Can not call getElementStrict before rendering/decorating.');
    return el;
  };

  /**
   * Sets the component's root element to the given element.  Considered
   * protected and final.
   *
   * This should generally only be called during createDom. Setting the element
   * does not actually change which element is rendered, only the element that is
   * associated with this UI component.
   *
   * This should only be used by subclasses and its associated renderers.
   *
   * @param {Element} element Root element for the component.
   */
  setElementInternal(element) {
    this.element_ = element;
  };

  /**
   * Returns an array of all the elements in this component's DOM with the
   * provided className.
   * @param {string} className The name of the class to look for.
   * @return {!IArrayLike<!Element>} The items found with the class name provided.
   */
  getElementsByClass(className) {
    return this.element_ ?
        this.dom_.getElementsByClass(className, this.element_) :
        [];
  };

  /**
   * Returns the first element in this component's DOM with the provided
   * className.
   * @param {string} className The name of the class to look for.
   * @return {Element} The first item with the class name provided.
   */
  getElementByClass(className) {
    return this.element_ ? this.dom_.getElementByClass(className, this.element_) :
                           null;
  };

  /**
   * Similar to `getElementByClass` except that it expects the
   * element to be present in the dom thus returning a required value. Otherwise,
   * will assert.
   * @param {string} className The name of the class to look for.
   * @return {!Element} The first item with the class name provided.
   */
  getRequiredElementByClass(className) {
    var el = this.getElementByClass(className);
    asserts.assert(
        el, 'Expected element in component with class: %s', className);
    return el;
  };

  /**
   * Returns the event handler for this component, lazily created the first time
   * this method is called.
   * @return {!EventHandler<T>} Event handler for this component.
   * @protected
   * @this {T}
   * @template T
   */
  getHandler() {
    // TODO(user): templated "this" values currently result in "this" being
    // "unknown" in the body of the function.
    var self = /** @type {Component} */ (this);
    if (!self.googUiComponentHandler_) {
      self.googUiComponentHandler_ = new EventHandler(self);
    }
    return asserts.assert(self.googUiComponentHandler_);
  };

  /**
   * Sets the parent of this component to use for event bubbling.  Throws an error
   * if the component already has a parent or if an attempt is made to add a
   * component to itself as a child.  Callers must use `removeChild`
   * or `removeChildAt` to remove components from their containers before
   * calling this method.
   * @see Component#removeChild
   * @see Component#removeChildAt
   * @param {Component} parent The parent component.
   */
  setParent(parent) {
    if (this == parent) {
      // Attempting to add a child to itself is an error.
      throw new Error(Component_Error.PARENT_UNABLE_TO_BE_SET);
    }
  
    if (parent && this.parent_ && this.id_ && this.parent_.getChild(this.id_) &&
        this.parent_ != parent) {
      // This component is already the child of some parent, so it should be
      // removed using removeChild/removeChildAt first.
      throw new Error(Component_Error.PARENT_UNABLE_TO_BE_SET);
    }
  
    this.parent_ = parent;
    super.setParentEventTarget(parent);
  };

  /**
   * Returns the component's parent, if any.
   * @return {?Component} The parent component.
   */
  getParent() {
    return this.parent_;
  };

  /**
   * Overrides {@link EventsEventTarget#setParentEventTarget} to throw an
   * error if the parent component is set, and the argument is not the parent.
   * @override
   */
  setParentEventTarget(parent) {
    if (this.parent_ && this.parent_ != parent) {
      throw new Error(Component_Error.NOT_SUPPORTED);
    }
    super.setParentEventTarget(parent);
  };

  /**
   * Returns the dom helper that is being used on this component.
   * @return {!DomHelper} The dom helper used on this component.
   */
  getDomHelper() {
    return this.dom_;
  };

  /**
   * Determines whether the component has been added to the document.
   * @return {boolean} TRUE if rendered. Otherwise, FALSE.
   */
  isInDocument() {
    return this.inDocument_;
  };

  /**
   * Creates the initial DOM representation for the component.  The default
   * implementation is to set this.element_ = div.
   */
  createDom() {
    this.element_ = this.dom_.createElement(TagName.DIV);
  };

  /**
   * Renders the component.  If a parent element is supplied, the component's
   * element will be appended to it.  If there is no optional parent element and
   * the element doesn't have a parentNode then it will be appended to the
   * document body.
   *
   * If this component has a parent component, and the parent component is
   * not in the document already, then this will not call `enterDocument`
   * on this component.
   *
   * Throws an Error if the component is already rendered.
   *
   * @param {Element=} opt_parentElement Optional parent element to render the
   *    component into.
   */
  render(opt_parentElement) {
    this.render_(opt_parentElement);
  };

  /**
   * Renders the component before another element. The other element should be in
   * the document already.
   *
   * Throws an Error if the component is already rendered.
   *
   * @param {Node} sibling Node to render the component before.
   */
  renderBefore(sibling) {
    this.render_(/** @type {Element} */ (sibling.parentNode), sibling);
  };

  /**
   * Renders the component.  If a parent element is supplied, the component's
   * element will be appended to it.  If there is no optional parent element and
   * the element doesn't have a parentNode then it will be appended to the
   * document body.
   *
   * If this component has a parent component, and the parent component is
   * not in the document already, then this will not call `enterDocument`
   * on this component.
   *
   * Throws an Error if the component is already rendered.
   *
   * @param {Element=} opt_parentElement Optional parent element to render the
   *    component into.
   * @param {Node=} opt_beforeNode Node before which the component is to
   *    be rendered.  If left out the node is appended to the parent element.
   * @private
   */
  render_(
      opt_parentElement, opt_beforeNode) {
    if (this.inDocument_) {
      throw new Error(Component_Error.ALREADY_RENDERED);
    }
  
    if (!this.element_) {
      this.createDom();
    }
  
    if (opt_parentElement) {
      opt_parentElement.insertBefore(this.element_, opt_beforeNode || null);
    } else {
      this.dom_.getDocument().body.appendChild(this.element_);
    }
  
    // If this component has a parent component that isn't in the document yet,
    // we don't call enterDocument() here.  Instead, when the parent component
    // enters the document, the enterDocument() call will propagate to its
    // children, including this one.  If the component doesn't have a parent
    // or if the parent is already in the document, we call enterDocument().
    if (!this.parent_ || this.parent_.isInDocument()) {
      this.enterDocument();
    }
  };

  /**
   * Decorates the element for the UI component. If the element is in the
   * document, the enterDocument method will be called.
   *
   * If ALLOW_DETACHED_DECORATION is false, the caller must
   * pass an element that is in the document.
   *
   * @param {Element} element Element to decorate.
   */
  decorate(element) {
    if (this.inDocument_) {
      throw new Error(Component_Error.ALREADY_RENDERED);
    } else if (element && this.canDecorate(element)) {
      this.wasDecorated_ = true;
  
      // Set the DOM helper of the component to match the decorated element.
      var doc = goog_dom.getOwnerDocument(element);
      if (!this.dom_ || this.dom_.getDocument() != doc) {
        this.dom_ = goog_dom.getDomHelper(element);
      }
  
      // Call specific component decorate logic.
      this.decorateInternal(element);
  
      // If supporting detached decoration, check that element is in doc.
      if (!ALLOW_DETACHED_DECORATION ||
          goog_dom.contains(doc, element)) {
        this.enterDocument();
      }
    } else {
      throw new Error(Component_Error.DECORATE_INVALID);
    }
  };

  /**
   * Determines if a given element can be decorated by this type of component.
   * This method should be overridden by inheriting objects.
   * @param {Element} element Element to decorate.
   * @return {boolean} True if the element can be decorated, false otherwise.
   */
  canDecorate(element) {
    return true;
  };

  /**
   * @return {boolean} Whether the component was decorated.
   */
  wasDecorated() {
    return this.wasDecorated_;
  };

  /**
   * Actually decorates the element. Should be overridden by inheriting objects.
   * This method can assume there are checks to ensure the component has not
   * already been rendered have occurred and that enter document will be called
   * afterwards. This method is considered protected.
   * @param {Element} element Element to decorate.
   * @protected
   */
  decorateInternal(element) {
    this.element_ = element;
  };

  /**
   * Called when the component's element is known to be in the document. Anything
   * using document.getElementById etc. should be done at this stage.
   *
   * If the component contains child components, this call is propagated to its
   * children.
   */
  enterDocument() {
    this.inDocument_ = true;
  
    // Propagate enterDocument to child components that have a DOM, if any.
    // If a child was decorated before entering the document (permitted when
    // ALLOW_DETACHED_DECORATION is true), its enterDocument
    // will be called here.
    this.forEachChild(function(child) {
      if (!child.isInDocument() && child.getElement()) {
        child.enterDocument();
      }
    });
  };

  /**
   * Called by dispose to clean up the elements and listeners created by a
   * component, or by a parent component/application who has removed the
   * component from the document but wants to reuse it later.
   *
   * If the component contains child components, this call is propagated to its
   * children.
   *
   * It should be possible for the component to be rendered again once this method
   * has been called.
   */
  exitDocument() {
    // Propagate exitDocument to child components that have been rendered, if any.
    this.forEachChild(function(child) {
      if (child.isInDocument()) {
        child.exitDocument();
      }
    });
  
    if (this.googUiComponentHandler_) {
      this.googUiComponentHandler_.removeAll();
    }
  
    this.inDocument_ = false;
  };

  /**
   * Disposes of the component.  Calls `exitDocument`, which is expected to
   * remove event handlers and clean up the component.  Propagates the call to
   * the component's children, if any. Removes the component's DOM from the
   * document unless it was decorated.
   * @override
   * @protected
   */
  disposeInternal() {
    if (this.inDocument_) {
      this.exitDocument();
    }
  
    if (this.googUiComponentHandler_) {
      this.googUiComponentHandler_.dispose();
      delete this.googUiComponentHandler_;
    }
  
    // Disposes of the component's children, if any.
    this.forEachChild(function(child) { child.dispose(); });
  
    // Detach the component's element from the DOM, unless it was decorated.
    if (!this.wasDecorated_ && this.element_) {
      goog_dom.removeNode(this.element_);
    }
  
    this.children_ = null;
    this.childIndex_ = null;
    this.element_ = null;
    this.model_ = null;
    this.parent_ = null;
  
    super.disposeInternal();
  };

  /**
   * Helper function for subclasses that gets a unique id for a given fragment,
   * this can be used by components to generate unique string ids for DOM
   * elements.
   * @param {string} idFragment A partial id.
   * @return {string} Unique element id.
   */
  makeId(idFragment) {
    return this.getId() + '.' + idFragment;
  };

  /**
   * Makes a collection of ids.  This is a convenience method for makeId.  The
   * object's values are the id fragments and the new values are the generated
   * ids.  The key will remain the same.
   * @param {Object} object The object that will be used to create the ids.
   * @return {!Object<string, string>} An object of id keys to generated ids.
   */
  makeIds(object) {
    var ids = {};
    for (var key in object) {
      ids[key] = this.makeId(object[key]);
    }
    return ids;
  };

  /**
   * Returns the model associated with the UI component.
   * @return {*} The model.
   */
  getModel() {
    return this.model_;
  };

  /**
   * Sets the model associated with the UI component.
   * @param {*} obj The model.
   */
  setModel(obj) {
    this.model_ = obj;
  };

  /**
   * Helper function for returning the fragment portion of an id generated using
   * makeId().
   * @param {string} id Id generated with makeId().
   * @return {string} Fragment.
   */
  getFragmentFromId(id) {
    return id.substring(this.getId().length + 1);
  };

  /**
   * Helper function for returning an element in the document with a unique id
   * generated using makeId().
   * @param {string} idFragment The partial id.
   * @return {Element} The element with the unique id, or null if it cannot be
   *     found.
   */
  getElementByFragment(idFragment) {
    if (!this.inDocument_) {
      throw new Error(Component_Error.NOT_IN_DOCUMENT);
    }
    return this.dom_.getElement(this.makeId(idFragment));
  };

  /**
   * Adds the specified component as the last child of this component.  See
   * {@link Component#addChildAt} for detailed semantics.
   *
   * @see Component#addChildAt
   * @param {Component} child The new child component.
   * @param {boolean=} opt_render If true, the child component will be rendered
   *    into the parent.
   */
  addChild(child, opt_render) {
    // TODO(gboyer): addChildAt(child, this.getChildCount(), false) will
    // reposition any already-rendered child to the end.  Instead, perhaps
    // addChild(child, false) should never reposition the child; instead, clients
    // that need the repositioning will use addChildAt explicitly.  Right now,
    // clients can get around this by calling addChild before calling decorate.
    this.addChildAt(child, this.getChildCount(), opt_render);
  };

  /**
   * Adds the specified component as a child of this component at the given
   * 0-based index.
   *
   * Both `addChild` and `addChildAt` assume the following contract
   * between parent and child components:
   *  <ul>
   *    <li>the child component's element must be a descendant of the parent
   *        component's element, and
   *    <li>the DOM state of the child component must be consistent with the DOM
   *        state of the parent component (see `isInDocument`) in the
   *        steady state -- the exception is to addChildAt(child, i, false) and
   *        then immediately decorate/render the child.
   *  </ul>
   *
   * In particular, `parent.addChild(child)` will throw an error if the
   * child component is already in the document, but the parent isn't.
   *
   * Clients of this API may call `addChild` and `addChildAt` with
   * `opt_render` set to true.  If `opt_render` is true, calling these
   * methods will automatically render the child component's element into the
   * parent component's element. If the parent does not yet have an element, then
   * `createDom` will automatically be invoked on the parent before
   * rendering the child.
   *
   * Invoking {@code parent.addChild(child, true)} will throw an error if the
   * child component is already in the document, regardless of the parent's DOM
   * state.
   *
   * If `opt_render` is true and the parent component is not already
   * in the document, `enterDocument` will not be called on this component
   * at this point.
   *
   * Finally, this method also throws an error if the new child already has a
   * different parent, or the given index is out of bounds.
   *
   * @see Component#addChild
   * @param {Component} child The new child component.
   * @param {number} index 0-based index at which the new child component is to be
   *    added; must be between 0 and the current child count (inclusive).
   * @param {boolean=} opt_render If true, the child component will be rendered
   *    into the parent.
   * @return {void} Nada.
   */
  addChildAt(child, index, opt_render) {
    asserts.assert(!!child, 'Provided element must not be null.');
  
    if (child.inDocument_ && (opt_render || !this.inDocument_)) {
      // Adding a child that's already in the document is an error, except if the
      // parent is also in the document and opt_render is false (e.g. decorate()).
      throw new Error(Component_Error.ALREADY_RENDERED);
    }
  
    if (index < 0 || index > this.getChildCount()) {
      // Allowing sparse child arrays would lead to strange behavior, so we don't.
      throw new Error(Component_Error.CHILD_INDEX_OUT_OF_BOUNDS);
    }
  
    // Create the index and the child array on first use.
    if (!this.childIndex_ || !this.children_) {
      this.childIndex_ = {};
      this.children_ = [];
    }
  
    // Moving child within component, remove old reference.
    if (child.getParent() == this) {
      object.set(this.childIndex_, child.getId(), child);
      googarray.remove(this.children_, child);
  
      // Add the child to this component.  object.add() throws an error if
      // a child with the same ID already exists.
    } else {
      object.add(this.childIndex_, child.getId(), child);
    }
  
    // Set the parent of the child to this component.  This throws an error if
    // the child is already contained by another component.
    child.setParent(this);
    googarray.insertAt(this.children_, child, index);
  
    if (child.inDocument_ && this.inDocument_ && child.getParent() == this) {
      // Changing the position of an existing child, move the DOM node (if
      // necessary).
      var contentElement = this.getContentElement();
      var insertBeforeElement = contentElement.childNodes[index] || null;
      if (insertBeforeElement != child.getElement()) {
        contentElement.insertBefore(child.getElement(), insertBeforeElement);
      }
    } else if (opt_render) {
      // If this (parent) component doesn't have a DOM yet, call createDom now
      // to make sure we render the child component's element into the correct
      // parent element (otherwise render_ with a null first argument would
      // render the child into the document body, which is almost certainly not
      // what we want).
      if (!this.element_) {
        this.createDom();
      }
      // Render the child into the parent at the appropriate location.  Note that
      // getChildAt(index + 1) returns undefined if inserting at the end.
      // TODO(attila): We should have a renderer with a renderChildAt API.
      var sibling = this.getChildAt(index + 1);
      // render_() calls enterDocument() if the parent is already in the document.
      child.render_(this.getContentElement(), sibling ? sibling.element_ : null);
    } else if (
        this.inDocument_ && !child.inDocument_ && child.element_ &&
        child.element_.parentNode &&
        // Under some circumstances, IE8 implicitly creates a Document Fragment
        // for detached nodes, so ensure the parent is an Element as it should be.
        child.element_.parentNode.nodeType == NodeType.ELEMENT) {
      // We don't touch the DOM, but if the parent is in the document, and the
      // child element is in the document but not marked as such, then we call
      // enterDocument on the child.
      // TODO(gboyer): It would be nice to move this condition entirely, but
      // there's a large risk of breaking existing applications that manually
      // append the child to the DOM and then call addChild.
      child.enterDocument();
    }
  };

  /**
   * Returns the DOM element into which child components are to be rendered,
   * or null if the component itself hasn't been rendered yet.  This default
   * implementation returns the component's root element.  Subclasses with
   * complex DOM structures must override this method.
   * @return {Element} Element to contain child elements (null if none).
   */
  getContentElement() {
    return this.element_;
  };

  /**
   * Returns true if the component is rendered right-to-left, false otherwise.
   * The first time this function is invoked, the right-to-left rendering property
   * is set if it has not been already.
   * @return {boolean} Whether the control is rendered right-to-left.
   */
  isRightToLeft() {
    if (this.rightToLeft_ == null) {
      this.rightToLeft_ = style.isRightToLeft(
          this.inDocument_ ? this.element_ : this.dom_.getDocument().body);
    }
    return this.rightToLeft_;
  };

  /**
   * Set is right-to-left. This function should be used if the component needs
   * to know the rendering direction during dom creation (i.e. before
   * {@link #enterDocument} is called and is right-to-left is set).
   * @param {boolean} rightToLeft Whether the component is rendered
   *     right-to-left.
   */
  setRightToLeft(rightToLeft) {
    if (this.inDocument_) {
      throw new Error(Component_Error.ALREADY_RENDERED);
    }
    this.rightToLeft_ = rightToLeft;
  };

  /**
   * Returns true if the component has children.
   * @return {boolean} True if the component has children.
   */
  hasChildren() {
    return !!this.children_ && this.children_.length != 0;
  };

  /**
   * Returns the number of children of this component.
   * @return {number} The number of children.
   */
  getChildCount() {
    return this.children_ ? this.children_.length : 0;
  };

  /**
   * Returns an array containing the IDs of the children of this component, or an
   * empty array if the component has no children.
   * @return {!Array<string>} Child component IDs.
   */
  getChildIds() {
    var ids = [];
  
    // We don't use object.getKeys(this.childIndex_) because we want to
    // return the IDs in the correct order as determined by this.children_.
    this.forEachChild(function(child) {
      // addChild()/addChildAt() guarantee that the child array isn't sparse.
      ids.push(child.getId());
    });
  
    return ids;
  };

  /**
   * Returns the child with the given ID, or null if no such child exists.
   * @param {string} id Child component ID.
   * @return {?Component} The child with the given ID; null if none.
   */
  getChild(id) {
    // Use childIndex_ for O(1) access by ID.
    return (this.childIndex_ && id) ?
        /** @type {Component} */ (
            object.get(this.childIndex_, id)) ||
            null :
        null;
  };

  /**
   * Returns the child at the given index, or null if the index is out of bounds.
   * @param {number} index 0-based index.
   * @return {?Component} The child at the given index; null if none.
   */
  getChildAt(index) {
    // Use children_ for access by index.
    return this.children_ ? this.children_[index] || null : null;
  };

  /**
   * Calls the given function on each of this component's children in order.  If
   * `opt_obj` is provided, it will be used as the 'this' object in the
   * function when called.  The function should take two arguments:  the child
   * component and its 0-based index.  The return value is ignored.
   * @param {function(this:T,?,number):?} f The function to call for every
   * child component; should take 2 arguments (the child and its index).
   * @param {T=} opt_obj Used as the 'this' object in f when called.
   * @template T
   */
  forEachChild(f, opt_obj) {
    if (this.children_) {
      googarray.forEach(this.children_, f, opt_obj);
    }
  };

  /**
   * Returns the 0-based index of the given child component, or -1 if no such
   * child is found.
   * @param {?Component} child The child component.
   * @return {number} 0-based index of the child component; -1 if not found.
   */
  indexOfChild(child) {
    return (this.children_ && child) ? googarray.indexOf(this.children_, child) :
                                       -1;
  };

  /**
   * Removes the given child from this component, and returns it.  Throws an error
   * if the argument is invalid or if the specified child isn't found in the
   * parent component.  The argument can either be a string (interpreted as the
   * ID of the child component to remove) or the child component itself.
   *
   * If `opt_unrender` is true, calls {@link goog.ui.component#exitDocument}
   * on the removed child, and subsequently detaches the child's DOM from the
   * document.  Otherwise it is the caller's responsibility to clean up the child
   * component's DOM.
   *
   * @see Component#removeChildAt
   * @param {string|Component|null} child The ID of the child to remove,
   *    or the child component itself.
   * @param {boolean=} opt_unrender If true, calls `exitDocument` on the
   *    removed child component, and detaches its DOM from the document.
   * @return {Component} The removed component, if any.
   */
  removeChild(child, opt_unrender) {
    if (child) {
      // Normalize child to be the object and id to be the ID string.  This also
      // ensures that the child is really ours.
      var id = (typeof child === 'string') ? child : child.getId();
      child = this.getChild(id);
  
      if (id && child) {
        object.remove(this.childIndex_, id);
        googarray.remove(this.children_, child);
  
        if (opt_unrender) {
          // Remove the child component's DOM from the document.  We have to call
          // exitDocument first (see documentation).
          child.exitDocument();
          if (child.element_) {
            goog_dom.removeNode(child.element_);
          }
        }
  
        // Child's parent must be set to null after exitDocument is called
        // so that the child can unlisten to its parent if required.
        child.setParent(null);
      }
    }
  
    if (!child) {
      throw new Error(Component_Error.NOT_OUR_CHILD);
    }
  
    return /** @type {!Component} */ (child);
  };

  /**
   * Removes the child at the given index from this component, and returns it.
   * Throws an error if the argument is out of bounds, or if the specified child
   * isn't found in the parent.  See {@link Component#removeChild} for
   * detailed semantics.
   *
   * @see Component#removeChild
   * @param {number} index 0-based index of the child to remove.
   * @param {boolean=} opt_unrender If true, calls `exitDocument` on the
   *    removed child component, and detaches its DOM from the document.
   * @return {Component} The removed component, if any.
   */
  removeChildAt(index, opt_unrender) {
    // removeChild(null) will throw error.
    return this.removeChild(this.getChildAt(index), opt_unrender);
  };

  /**
   * Removes every child component attached to this one and returns them.
   *
   * @see Component#removeChild
   * @param {boolean=} opt_unrender If true, calls {@link #exitDocument} on the
   *    removed child components, and detaches their DOM from the document.
   * @return {!Array<Component>} The removed components if any.
   */
  removeChildren(opt_unrender) {
    var removedChildren = [];
    while (this.hasChildren()) {
      removedChildren.push(this.removeChildAt(0, opt_unrender));
    }
    return removedChildren;
  };

  /**
   * Returns whether this component should listen for PointerEvent types rather
   * than MouseEvent types. This allows supporting drag gestures for touch/stylus
   * input.
   * @return {boolean}
   */
  pointerEventsEnabled() {
    return this.pointerEventsEnabled_;
  };

  /**
   * Indicates whether this component should listen for PointerEvent types rather
   * than MouseEvent types. This allows supporting drag gestures for touch/stylus
   * input. Must be called before enterDocument to listen for the correct event
   * types.
   * @param {boolean} enable
   */
  setPointerEventsEnabled(enable) {
    if (this.inDocument_) {
      throw new Error(Component_Error.ALREADY_RENDERED);
    }
    this.pointerEventsEnabled_ = enable;
  };
}

/**
 * @type {boolean} Whether to support calling decorate with an element that is
 *     not yet in the document. If true, we check if the element is in the
 *     document, and avoid calling enterDocument if it isn't. If false, we
 *     maintain legacy behavior (always call enterDocument from decorate).
 */
const ALLOW_DETACHED_DECORATION = false;

// TODO(gboyer): See if we can remove this and just check goog.i18n.bidi.IS_RTL.
/**
 * @type {number} Defines the default BIDI directionality.
 *     0: Unknown.
 *     1: Left-to-right.
 *     -1: Right-to-left.
 */
const DEFAULT_BIDI_DIR = 0;

/**
 * The default right to left value.
 * @type {?boolean}
 * @private
 */
Component.defaultRightToLeft_ =
    (DEFAULT_BIDI_DIR == 1) ?
    false :
    (DEFAULT_BIDI_DIR == -1) ? true : null;

/**
 * Common events fired by components so that event propagation is useful.  Not
 * all components are expected to dispatch or listen for all event types.
 * Events dispatched before a state transition should be cancelable to prevent
 * the corresponding state change.
 * @enum {string}
 */
let EventType = {
  /** Dispatched before the component becomes visible. */
  BEFORE_SHOW: 'beforeshow',

  /**
   * Dispatched after the component becomes visible.
   * NOTE(user): For goog.ui.Container, this actually fires before containers
   * are shown.  Use goog.ui.Container.EventType.AFTER_SHOW if you want an event
   * that fires after a goog.ui.Container is shown.
   */
  SHOW: 'show',

  /** Dispatched before the component becomes hidden. */
  HIDE: 'hide',

  /** Dispatched before the component becomes disabled. */
  DISABLE: 'disable',

  /** Dispatched before the component becomes enabled. */
  ENABLE: 'enable',

  /** Dispatched before the component becomes highlighted. */
  HIGHLIGHT: 'highlight',

  /** Dispatched before the component becomes un-highlighted. */
  UNHIGHLIGHT: 'unhighlight',

  /** Dispatched before the component becomes activated. */
  ACTIVATE: 'activate',

  /** Dispatched before the component becomes deactivated. */
  DEACTIVATE: 'deactivate',

  /** Dispatched before the component becomes selected. */
  SELECT: 'select',

  /** Dispatched before the component becomes un-selected. */
  UNSELECT: 'unselect',

  /** Dispatched before a component becomes checked. */
  CHECK: 'check',

  /** Dispatched before a component becomes un-checked. */
  UNCHECK: 'uncheck',

  /** Dispatched before a component becomes focused. */
  FOCUS: 'focus',

  /** Dispatched before a component becomes blurred. */
  BLUR: 'blur',

  /** Dispatched before a component is opened (expanded). */
  OPEN: 'open',

  /** Dispatched before a component is closed (collapsed). */
  CLOSE: 'close',

  /** Dispatched after a component is moused over. */
  ENTER: 'enter',

  /** Dispatched after a component is moused out of. */
  LEAVE: 'leave',

  /** Dispatched after the user activates the component. */
  ACTION: 'action',

  /** Dispatched after the external-facing state of a component is changed. */
  CHANGE: 'change'
};

/**
 * Errors thrown by the component.
 * @enum {string}
 */
let Component_Error = {
  /**
   * Error when a method is not supported.
   */
  NOT_SUPPORTED: 'Method not supported',

  /**
   * Error when the given element can not be decorated.
   */
  DECORATE_INVALID: 'Invalid element to decorate',

  /**
   * Error when the component is already rendered and another render attempt is
   * made.
   */
  ALREADY_RENDERED: 'Component already rendered',

  /**
   * Error when an attempt is made to set the parent of a component in a way
   * that would result in an inconsistent object graph.
   */
  PARENT_UNABLE_TO_BE_SET: 'Unable to set parent component',

  /**
   * Error when an attempt is made to add a child component at an out-of-bounds
   * index.  We don't support sparse child arrays.
   */
  CHILD_INDEX_OUT_OF_BOUNDS: 'Child component index out of bounds',

  /**
   * Error when an attempt is made to remove a child component from a component
   * other than its parent.
   */
  NOT_OUR_CHILD: 'Child is not in parent component',

  /**
   * Error when an operation requiring DOM interaction is made when the
   * component is not in the document
   */
  NOT_IN_DOCUMENT: 'Operation not supported while component is not in document',

  /**
   * Error when an invalid component state is encountered.
   */
  STATE_INVALID: 'Invalid component state'
};

/**
 * Common component states.  Components may have distinct appearance depending
 * on what state(s) apply to them.  Not all components are expected to support
 * all states.
 * @enum {number}
 */
let State = {
  /**
   * Union of all supported component states.
   */
  ALL: 0xFF,

  /**
   * Component is disabled.
   * @see EventType.DISABLE
   * @see EventType.ENABLE
   */
  DISABLED: 0x01,

  /**
   * Component is highlighted.
   * @see EventType.HIGHLIGHT
   * @see EventType.UNHIGHLIGHT
   */
  HOVER: 0x02,

  /**
   * Component is active (or "pressed").
   * @see EventType.ACTIVATE
   * @see EventType.DEACTIVATE
   */
  ACTIVE: 0x04,

  /**
   * Component is selected.
   * @see EventType.SELECT
   * @see EventType.UNSELECT
   */
  SELECTED: 0x08,

  /**
   * Component is checked.
   * @see EventType.CHECK
   * @see EventType.UNCHECK
   */
  CHECKED: 0x10,

  /**
   * Component has focus.
   * @see EventType.FOCUS
   * @see EventType.BLUR
   */
  FOCUSED: 0x20,

  /**
   * Component is opened (expanded).  Applies to tree nodes, menu buttons,
   * submenus, zippys (zippies?), etc.
   * @see EventType.OPEN
   * @see EventType.CLOSE
   */
  OPENED: 0x40
};

export {ALLOW_DETACHED_DECORATION, Component, Component_Error as Error, DEFAULT_BIDI_DIR, EventType, State};