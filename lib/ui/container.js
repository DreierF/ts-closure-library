import * as googa11yaria from './../a11y/aria/aria.js';
import * as a11yaria from './../a11y/aria/aria.js';
import {State as AriaState} from './../a11y/aria/attributes.js';
import * as googarray from './../array/array.js';
import * as googasserts from './../asserts/asserts.js';
import * as asserts from './../asserts/asserts.js';
import * as classlist from './../dom/classlist.js';
import * as goog_dom from './../dom/dom.js';
import {DomHelper} from './../dom/dom.js';
import {NodeType} from './../dom/nodetype.js';
import {TagName} from './../dom/tagname.js';
import {BrowserEvent as EventsBrowserEvent} from './../events/browserevent.js';
import {Event as EventsEvent} from './../events/event.js';
import {EventType as EventsEventType} from './../events/eventtype.js';
import {KeyCodes} from './../events/keycodes.js';
import {KeyEvent} from './../events/keyhandler.js';
import {KeyHandler} from './../events/keyhandler.js';
import {EventType as KeyHandlerEventType} from './../events/keyhandler.js';
import * as google from './../google.js';
import * as object from './../object/object.js';
import * as strings from './../string/string.js';
import * as googstyle from './../style/style.js';
import * as style from './../style/style.js';
import * as userAgent from './../useragent/useragent.js';
import {Component as Ui_Component} from './component.js';
import {State} from './component.js';
import {Error as ComponentError} from './component.js';
import {EventType as ComponentEventType} from './component.js';
import * as ComponentUtil from './componentutil.js';
import {Control as UiControl} from './control.js';
import {Control} from './control.js';
import * as registry from './control.js';
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
 * @fileoverview Base class for containers that host {@link Control}s,
 * such as menus and toolbars.  Provides default keyboard and mouse event
 * handling and child management, based on a generalized version of
 * {@link goog.ui.Menu}.
 *
 * @see ../demos/container.html
 */
// TODO(attila):  Fix code/logic duplication between this and Control.
// TODO(attila):  Maybe pull common stuff all the way up into Component...?

/**
 * Base class for containers.  Extends {@link Ui_Component} by adding
 * the following:
 *  <ul>
 *    <li>a {@link KeyHandler}, to simplify keyboard handling,
 *    <li>a pluggable <em>renderer</em> framework, to simplify the creation of
 *        containers without the need to subclass this class,
 *    <li>methods to manage child controls hosted in the container,
 *    <li>default mouse and keyboard event handling methods.
 *  </ul>
 *     orientation; defaults to `VERTICAL`.
 *     decorate the container; defaults to {@link ContainerRenderer}.
 *     interaction.
 * @extends {Ui_Component}
 * @template T
 */
class Container extends Ui_Component {

  /**
   * Base class for containers.  Extends {@link Ui_Component} by adding
   * the following:
   *  <ul>
   *    <li>a {@link KeyHandler}, to simplify keyboard handling,
   *    <li>a pluggable <em>renderer</em> framework, to simplify the creation of
   *        containers without the need to subclass this class,
   *    <li>methods to manage child controls hosted in the container,
   *    <li>default mouse and keyboard event handling methods.
   *  </ul>
   * @param {?Orientation=} opt_orientation Container
   *     orientation; defaults to `VERTICAL`.
   * @param {T=} opt_renderer Renderer used to render or
   *     decorate the container; defaults to {@link ContainerRenderer}.
   * @param {DomHelper=} opt_domHelper DOM helper, used for document
   *     interaction.
   * @template T
   */
  constructor(opt_orientation, opt_renderer, opt_domHelper) {
    super(opt_domHelper);
    /**
     * Allows an alternative element to be set to receive key events, otherwise
     * defers to the renderer's element choice.
     * @type {?Element|undefined}
     * @private
     */
    this.keyEventTarget_ = null;
  
    /**
     * Keyboard event handler.
     * @type {KeyHandler?}
     * @private
     */
    this.keyHandler_ = null;
  
    /**
     * Whether the container is set to be visible.  Defaults to true.
     * @type {boolean}
     * @private
     */
    this.visible_ = true;
  
    /**
     * Whether the container is enabled and reacting to keyboard and mouse events.
     * Defaults to true.
     * @type {boolean}
     * @private
     */
    this.enabled_ = true;
  
    /**
     * Whether the container supports keyboard focus.  Defaults to true.  Focusable
     * containers have a `tabIndex` and can be navigated to via the keyboard.
     * @type {boolean}
     * @private
     */
    this.focusable_ = true;
  
    /**
     * The 0-based index of the currently highlighted control in the container
     * (-1 if none).
     * @type {number}
     * @private
     */
    this.highlightedIndex_ = -1;
  
    /**
     * The currently open (expanded) control in the container (null if none).
     * @type {Control?}
     * @private
     */
    this.openItem_ = null;
  
    /**
     * Whether the mouse button is held down.  Defaults to false.  This flag is set
     * when the user mouses down over the container, and remains set until they
     * release the mouse button.
     * @type {boolean}
     * @private
     */
    this.mouseButtonPressed_ = false;
  
    /**
     * Whether focus of child components should be allowed.  Only effective if
     * focusable_ is set to false.
     * @type {boolean}
     * @private
     */
    this.allowFocusableChildren_ = false;
  
    /**
     * Whether highlighting a child component should also open it.
     * @type {boolean}
     * @private
     */
    this.openFollowsHighlight_ = true;
  
    /**
     * Map of DOM IDs to child controls.  Each key is the DOM ID of a child
     * control's root element; each value is a reference to the child control
     * itself.  Used for looking up the child control corresponding to a DOM
     * node in O(1) time.
     * @type {?Object}
     * @private
     */
    this.childElementIdMap_ = null;
  
  
    /**
     * Renderer for the container.  Defaults to {@link ContainerRenderer}.
     * @type {T|undefined}
     * @private
     */
    this.renderer_ = opt_renderer || ContainerRenderer.getInstance();
  
    /**
     * Container orientation; determines layout and default keyboard navigation.
     * @type {?Orientation}
     * @private
     */
    this.orientation_ = opt_orientation || this.renderer_.getDefaultOrientation();
  }

  /**
   * Returns the DOM element on which the container is listening for keyboard
   * events (null if none).
   * @return {Element} Element on which the container is listening for key
   *     events.
   */
  getKeyEventTarget() {
    // Delegate to renderer, unless we've set an explicit target.
    return this.keyEventTarget_ || this.renderer_.getKeyEventTarget(this);
  };

  /**
   * Attaches an element on which to listen for key events.
   * @param {Element|undefined} element The element to attach, or null/undefined
   *     to attach to the default element.
   */
  setKeyEventTarget(element) {
    if (this.focusable_) {
      var oldTarget = this.getKeyEventTarget();
      var inDocument = this.isInDocument();
  
      this.keyEventTarget_ = element;
      var newTarget = this.getKeyEventTarget();
  
      if (inDocument) {
        // Unlisten for events on the old key target.  Requires us to reset
        // key target state temporarily.
        this.keyEventTarget_ = oldTarget;
        this.enableFocusHandling_(false);
        this.keyEventTarget_ = element;
  
        // Listen for events on the new key target.
        this.getKeyHandler().attach(newTarget);
        this.enableFocusHandling_(true);
      }
    } else {
      throw new Error(
          'Can\'t set key event target for container ' +
          'that doesn\'t support keyboard focus!');
    }
  };

  /**
   * Returns the keyboard event handler for this container, lazily created the
   * first time this method is called.  The keyboard event handler listens for
   * keyboard events on the container's key event target, as determined by its
   * renderer.
   * @return {!KeyHandler} Keyboard event handler for this container.
   */
  getKeyHandler() {
    return this.keyHandler_ ||
        (this.keyHandler_ = new KeyHandler(this.getKeyEventTarget()));
  };

  /**
   * Returns the renderer used by this container to render itself or to decorate
   * an existing element.
   * @return {T} Renderer used by the container.
   */
  getRenderer() {
    return this.renderer_;
  };

  /**
   * Registers the given renderer with the container.  Changing renderers after
   * the container has already been rendered or decorated is an error.
   * @param {T} renderer Renderer used by the container.
   */
  setRenderer(renderer) {
    if (this.getElement()) {
      // Too late.
      throw new Error(ComponentError.ALREADY_RENDERED);
    }
  
    this.renderer_ = renderer;
  };

  /**
   * Creates the container's DOM.
   * @override
   */
  createDom() {
    // Delegate to renderer.
    this.setElementInternal(this.renderer_.createDom(this));
  };

  /**
   * Returns the DOM element into which child components are to be rendered,
   * or null if the container itself hasn't been rendered yet.  Overrides
   * {@link Ui_Component#getContentElement} by delegating to the renderer.
   * @return {Element} Element to contain child elements (null if none).
   * @override
   */
  getContentElement() {
    // Delegate to renderer.
    return this.renderer_.getContentElement(this.getElement());
  };

  /**
   * Returns true if the given element can be decorated by this container.
   * Overrides {@link Ui_Component#canDecorate}.
   * @param {Element} element Element to decorate.
   * @return {boolean} True iff the element can be decorated.
   * @override
   */
  canDecorate(element) {
    // Delegate to renderer.
    return this.renderer_.canDecorate(element);
  };

  /**
   * Decorates the given element with this container. Overrides {@link
   * Ui_Component#decorateInternal}.  Considered protected.
   * @param {Element} element Element to decorate.
   * @override
   */
  decorateInternal(element) {
    // Delegate to renderer.
    this.setElementInternal(this.renderer_.decorate(this, element));
    // Check whether the decorated element is explicitly styled to be invisible.
    if (element.style.display == 'none') {
      this.visible_ = false;
    }
  };

  /**
   * Configures the container after its DOM has been rendered, and sets up event
   * handling.  Overrides {@link Ui_Component#enterDocument}.
   * @override
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  enterDocument() {
    super.enterDocument();
  
    this.forEachChild(function(child) {
      if (child.isInDocument()) {
        this.registerChildId_(child);
      }
    }, this);
  
    var elem = this.getElement();
  
    // Call the renderer's initializeDom method to initialize the container's DOM.
    this.renderer_.initializeDom(this);
  
    // Initialize visibility (opt_force = true, so we don't dispatch events).
    this.setVisible(this.visible_, true);
  
    var MouseEventType = ComponentUtil.getMouseEventType(this);
  
    // Handle events dispatched by child controls.
    this.getHandler()
        .listen(this, ComponentEventType.ENTER, this.handleEnterItem)
        .listen(
            this, ComponentEventType.HIGHLIGHT, this.handleHighlightItem)
        .listen(
            this, ComponentEventType.UNHIGHLIGHT,
            this.handleUnHighlightItem)
        .listen(this, ComponentEventType.OPEN, this.handleOpenItem)
        .listen(this, ComponentEventType.CLOSE, this.handleCloseItem)
  
        // Handle mouse events.
        .listen(elem, MouseEventType.MOUSEDOWN, this.handleMouseDown)
        .listen(
            goog_dom.getOwnerDocument(elem),
            [MouseEventType.MOUSEUP, MouseEventType.MOUSECANCEL],
            this.handleDocumentMouseUp)
  
        // Handle mouse events on behalf of controls in the container.
        .listen(
            elem,
            [
              MouseEventType.MOUSEDOWN, MouseEventType.MOUSEUP,
              MouseEventType.MOUSECANCEL, EventsEventType.MOUSEOVER,
              EventsEventType.MOUSEOUT, EventsEventType.CONTEXTMENU
            ],
            this.handleChildMouseEvents);
  
    if (this.pointerEventsEnabled()) {
      // Prevent pointer events from capturing the target element so they behave
      // more like mouse events.
      this.getHandler().listen(
          elem, EventsEventType.GOTPOINTERCAPTURE,
          this.preventPointerCapture_);
    }
  
    // If the container is focusable, set up keyboard event handling.
    if (this.isFocusable()) {
      this.enableFocusHandling_(true);
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
   * Sets up listening for events applicable to focusable containers.
   * @param {boolean} enable Whether to enable or disable focus handling.
   * @private
   */
  enableFocusHandling_(enable) {
    var handler = this.getHandler();
    var keyTarget = this.getKeyEventTarget();
    if (enable) {
      handler.listen(keyTarget, EventsEventType.FOCUS, this.handleFocus)
          .listen(keyTarget, EventsEventType.BLUR, this.handleBlur)
          .listen(
              this.getKeyHandler(), KeyHandlerEventType.KEY,
              this.handleKeyEvent);
    } else {
      handler.unlisten(keyTarget, EventsEventType.FOCUS, this.handleFocus)
          .unlisten(keyTarget, EventsEventType.BLUR, this.handleBlur)
          .unlisten(
              this.getKeyHandler(), KeyHandlerEventType.KEY,
              this.handleKeyEvent);
    }
  };

  /**
   * Cleans up the container before its DOM is removed from the document, and
   * removes event handlers.  Overrides {@link Ui_Component#exitDocument}.
   * @override
   */
  exitDocument() {
    // {@link #setHighlightedIndex} has to be called before
    // {@link Ui_Component#exitDocument}, otherwise it has no effect.
    this.setHighlightedIndex(-1);
  
    if (this.openItem_) {
      this.openItem_.setOpen(false);
    }
  
    this.mouseButtonPressed_ = false;
  
    super.exitDocument();
  };

  /** @override */
  disposeInternal() {
    super.disposeInternal();
  
    if (this.keyHandler_) {
      this.keyHandler_.dispose();
      this.keyHandler_ = null;
    }
  
    this.keyEventTarget_ = null;
    this.childElementIdMap_ = null;
    this.openItem_ = null;
    this.renderer_ = null;
  };

  /**
   * Handles ENTER events raised by child controls when they are navigated to.
   * @param {EventsEvent} e ENTER event to handle.
   * @return {boolean} Whether to prevent handleMouseOver from handling
   *    the event.
   */
  handleEnterItem(e) {
    // Allow the Control to highlight itself.
    return true;
  };

  /**
   * Handles HIGHLIGHT events dispatched by items in the container when
   * they are highlighted.
   * @param {EventsEvent} e Highlight event to handle.
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  handleHighlightItem(e) {
    var index = this.indexOfChild(/** @type {Control} */ (e.target));
    if (index > -1 && index != this.highlightedIndex_) {
      var item = this.getHighlighted();
      if (item) {
        // Un-highlight previously highlighted item.
        item.setHighlighted(false);
      }
  
      this.highlightedIndex_ = index;
      item = this.getHighlighted();
  
      if (this.isMouseButtonPressed()) {
        // Activate item when mouse button is pressed, to allow MacOS-style
        // dragging to choose menu items.  Although this should only truly
        // happen if the highlight is due to mouse movements, there is little
        // harm in doing it for keyboard or programmatic highlights.
        item.setActive(true);
      }
  
      // Update open item if open item needs follow highlight.
      if (this.openFollowsHighlight_ && this.openItem_ &&
          item != this.openItem_) {
        if (item.isSupportedState(State.OPENED)) {
          item.setOpen(true);
        } else {
          this.openItem_.setOpen(false);
        }
      }
    }
  
    var element = this.getElement();
    asserts.assert(
        element, 'The DOM element for the container cannot be null.');
    if (e.target.getElement() != null) {
      a11yaria.setState(
          element, AriaState.ACTIVEDESCENDANT,
          e.target.getElement().id);
    }
  };

  /**
   * Handles UNHIGHLIGHT events dispatched by items in the container when
   * they are unhighlighted.
   * @param {EventsEvent} e Unhighlight event to handle.
   */
  handleUnHighlightItem(e) {
    if (e.target == this.getHighlighted()) {
      this.highlightedIndex_ = -1;
    }
    var element = this.getElement();
    asserts.assert(
        element, 'The DOM element for the container cannot be null.');
    // Setting certain ARIA attributes to empty strings is problematic.
    // Just remove the attribute instead.
    a11yaria.removeState(element, AriaState.ACTIVEDESCENDANT);
  };

  /**
   * Handles OPEN events dispatched by items in the container when they are
   * opened.
   * @param {EventsEvent} e Open event to handle.
   */
  handleOpenItem(e) {
    var item = /** @type {Control} */ (e.target);
    if (item && item != this.openItem_ && item.getParent() == this) {
      if (this.openItem_) {
        this.openItem_.setOpen(false);
      }
      this.openItem_ = item;
    }
  };

  /**
   * Handles CLOSE events dispatched by items in the container when they are
   * closed.
   * @param {EventsEvent} e Close event to handle.
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  handleCloseItem(e) {
    if (e.target == this.openItem_) {
      this.openItem_ = null;
    }
  
    var element = this.getElement();
    var targetEl = e.target.getElement();
    // Set the active descendant to the menu item when its submenu is closed and
    // it is still highlighted. This can sometimes be called when the menuitem is
    // unhighlighted because the focus moved elsewhere, do nothing at that point.
    if (element && e.target.isHighlighted() && targetEl) {
      a11yaria.setActiveDescendant(element, targetEl);
    }
  };

  /**
   * Handles mousedown events over the container.  The default implementation
   * sets the "mouse button pressed" flag and, if the container is focusable,
   * grabs keyboard focus.
   * @param {EventsBrowserEvent} e Mousedown event to handle.
   */
  handleMouseDown(e) {
    if (this.enabled_) {
      this.setMouseButtonPressed(true);
    }
  
    var keyTarget = this.getKeyEventTarget();
    if (keyTarget && goog_dom.isFocusableTabIndex(keyTarget)) {
      // The container is configured to receive keyboard focus.
      keyTarget.focus();
    } else {
      // The control isn't configured to receive keyboard focus; prevent it
      // from stealing focus or destroying the selection.
      e.preventDefault();
    }
  };

  /**
   * Handles mouseup events over the document.  The default implementation
   * clears the "mouse button pressed" flag.
   * @param {EventsBrowserEvent} e Mouseup event to handle.
   */
  handleDocumentMouseUp(e) {
    this.setMouseButtonPressed(false);
  };

  /**
   * Handles mouse events originating from nodes belonging to the controls hosted
   * in the container.  Locates the child control based on the DOM node that
   * dispatched the event, and forwards the event to the control for handling.
   * @param {EventsBrowserEvent} e Mouse event to handle.
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  handleChildMouseEvents(e) {
    var MouseEventType = ComponentUtil.getMouseEventType(this);
  
    var control = this.getOwnerControl(/** @type {Node} */ (e.target));
    if (control) {
      // Child control identified; forward the event.
      switch (e.type) {
        case MouseEventType.MOUSEDOWN:
          control.handleMouseDown(e);
          break;
        case MouseEventType.MOUSEUP:
        case MouseEventType.MOUSECANCEL:
          control.handleMouseUp(e);
          break;
        case EventsEventType.MOUSEOVER:
          control.handleMouseOver(e);
          break;
        case EventsEventType.MOUSEOUT:
          control.handleMouseOut(e);
          break;
        case EventsEventType.CONTEXTMENU:
          control.handleContextMenu(e);
          break;
      }
    }
  };

  /**
   * Returns the child control that owns the given DOM node, or null if no such
   * control is found.
   * @param {Node} node DOM node whose owner is to be returned.
   * @return {Control?} Control hosted in the container to which the node
   *     belongs (if found).
   * @protected
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  getOwnerControl(node) {
    // Ensure that this container actually has child controls before
    // looking up the owner.
    if (this.childElementIdMap_) {
      var elem = this.getElement();
      // See http://b/2964418 . IE9 appears to evaluate '!=' incorrectly, so
      // using '!==' instead.
      // TODO(user): Possibly revert this change if/when IE9 fixes the issue.
      while (node && node !== elem) {
        var id = node.id;
        if (id in this.childElementIdMap_) {
          return this.childElementIdMap_[id];
        }
        node = node.parentNode;
      }
    }
    return null;
  };

  /**
   * Handles focus events raised when the container's key event target receives
   * keyboard focus.
   * @param {EventsBrowserEvent} e Focus event to handle.
   */
  handleFocus(e) {
    // No-op in the base class.
  };

  /**
   * Handles blur events raised when the container's key event target loses
   * keyboard focus.  The default implementation clears the highlight index.
   * @param {EventsBrowserEvent} e Blur event to handle.
   */
  handleBlur(e) {
    this.setHighlightedIndex(-1);
    this.setMouseButtonPressed(false);
    // If the container loses focus, and one of its children is open, close it.
    if (this.openItem_) {
      this.openItem_.setOpen(false);
    }
  };

  /**
   * Attempts to handle a keyboard event, if the control is enabled, by calling
   * {@link handleKeyEventInternal}.  Considered protected; should only be used
   * within this package and by subclasses.
   * @param {KeyEvent} e Key event to handle.
   * @return {boolean} Whether the key event was handled.
   */
  handleKeyEvent(e) {
    if (this.isEnabled() && this.isVisible() &&
        (this.getChildCount() != 0 || this.keyEventTarget_) &&
        this.handleKeyEventInternal(e)) {
      e.preventDefault();
      e.stopPropagation();
      return true;
    }
    return false;
  };

  /**
   * Attempts to handle a keyboard event; returns true if the event was handled,
   * false otherwise.  If the container is enabled, and a child is highlighted,
   * calls the child control's `handleKeyEvent` method to give the control
   * a chance to handle the event first.
   * @param {KeyEvent} e Key event to handle.
   * @return {boolean} Whether the event was handled by the container (or one of
   *     its children).
   */
  handleKeyEventInternal(e) {
    // Give the highlighted control the chance to handle the key event.
    var highlighted = this.getHighlighted();
    if (highlighted && typeof highlighted.handleKeyEvent == 'function' &&
        highlighted.handleKeyEvent(e)) {
      return true;
    }
  
    // Give the open control the chance to handle the key event.
    if (this.openItem_ && this.openItem_ != highlighted &&
        typeof this.openItem_.handleKeyEvent == 'function' &&
        this.openItem_.handleKeyEvent(e)) {
      return true;
    }
  
    // Do not handle the key event if any modifier key is pressed.
    if (e.shiftKey || e.ctrlKey || e.metaKey || e.altKey) {
      return false;
    }
  
    // Either nothing is highlighted, or the highlighted control didn't handle
    // the key event, so attempt to handle it here.
    switch (e.keyCode) {
      case KeyCodes.ESC:
        if (this.isFocusable()) {
          this.getKeyEventTarget().blur();
        } else {
          return false;
        }
        break;
  
      case KeyCodes.HOME:
        this.highlightFirst();
        break;
  
      case KeyCodes.END:
        this.highlightLast();
        break;
  
      case KeyCodes.UP:
        if (this.orientation_ == Orientation.VERTICAL) {
          this.highlightPrevious();
        } else {
          return false;
        }
        break;
  
      case KeyCodes.LEFT:
        if (this.orientation_ == Orientation.HORIZONTAL) {
          if (this.isRightToLeft()) {
            this.highlightNext();
          } else {
            this.highlightPrevious();
          }
        } else {
          return false;
        }
        break;
  
      case KeyCodes.DOWN:
        if (this.orientation_ == Orientation.VERTICAL) {
          this.highlightNext();
        } else {
          return false;
        }
        break;
  
      case KeyCodes.RIGHT:
        if (this.orientation_ == Orientation.HORIZONTAL) {
          if (this.isRightToLeft()) {
            this.highlightPrevious();
          } else {
            this.highlightNext();
          }
        } else {
          return false;
        }
        break;
  
      default:
        return false;
    }
  
    return true;
  };

  /**
   * Creates a DOM ID for the child control and registers it to an internal
   * hash table to be able to find it fast by id.
   * @param {Ui_Component} child The child control. Its root element has
   *     to be created yet.
   * @private
   */
  registerChildId_(child) {
    // Map the DOM ID of the control's root element to the control itself.
    var childElem = child.getElement();
  
    // If the control's root element doesn't have a DOM ID assign one.
    var id = childElem.id || (childElem.id = child.getId());
  
    // Lazily create the child element ID map on first use.
    if (!this.childElementIdMap_) {
      this.childElementIdMap_ = {};
    }
    this.childElementIdMap_[id] = child;
  };

  /**
   * Adds the specified control as the last child of this container.  See
   * {@link Container#addChildAt} for detailed semantics.
   * @param {Ui_Component} child The new child control.
   * @param {boolean=} opt_render Whether the new child should be rendered
   *     immediately after being added (defaults to false).
   * @override
   */
  addChild(child, opt_render) {
    asserts.assertInstanceof(
        child, Control, 'The child of a container must be a control');
    super.addChild(child, opt_render);
  };

  /**
   * Overrides {@link Container#getChild} to make it clear that it
   * only returns {@link Control}s.
   * @param {string} id Child component ID.
   * @return {Control} The child with the given ID; null if none.
   * @override
   */
  getChild(id) {
    return /** @type {Control} */(super.getChild(id));
  };

  /**
   * Overrides {@link Container#getChildAt} to make it clear that it
   * only returns {@link Control}s.
   * @param {number} index 0-based index.
   * @return {Control} The child with the given ID; null if none.
   * @override
   */
  getChildAt(index) {
    return /** @type {Control} */(super.getChildAt(index));
  };

  /**
   * Adds the control as a child of this container at the given 0-based index.
   * Overrides {@link Ui_Component#addChildAt} by also updating the
   * container's highlight index.  Since {@link Ui_Component#addChild} uses
   * {@link #addChildAt} internally, we only need to override this method.
   * @param {Ui_Component} control New child.
   * @param {number} index Index at which the new child is to be added.
   * @param {boolean=} opt_render Whether the new child should be rendered
   *     immediately after being added (defaults to false).
   * @override
   */
  addChildAt(control, index, opt_render) {
    asserts.assertInstanceof(control, Control);
  
    // Make sure the child control dispatches HIGHLIGHT, UNHIGHLIGHT, OPEN, and
    // CLOSE events, and that it doesn't steal keyboard focus.
    control.setDispatchTransitionEvents(State.HOVER, true);
    control.setDispatchTransitionEvents(State.OPENED, true);
    if (this.isFocusable() || !this.isFocusableChildrenAllowed()) {
      control.setSupportedState(State.FOCUSED, false);
    }
  
    // Disable mouse event handling by child controls.
    control.setHandleMouseEvents(false);
  
    var srcIndex =
        (control.getParent() == this) ? this.indexOfChild(control) : -1;
  
    // Let the superclass implementation do the work.
    super.addChildAt(control, index, opt_render);
  
    if (control.isInDocument() && this.isInDocument()) {
      this.registerChildId_(control);
    }
  
    this.updateHighlightedIndex_(srcIndex, index);
  };

  /**
   * Updates the highlighted index when children are added or moved.
   * @param {number} fromIndex Index of the child before it was moved, or -1 if
   *     the child was added.
   * @param {number} toIndex Index of the child after it was moved or added.
   * @private
   */
  updateHighlightedIndex_(
      fromIndex, toIndex) {
    if (fromIndex == -1) {
      fromIndex = this.getChildCount();
    }
    if (fromIndex == this.highlightedIndex_) {
      // The highlighted element itself was moved.
      this.highlightedIndex_ = Math.min(this.getChildCount() - 1, toIndex);
    } else if (
        fromIndex > this.highlightedIndex_ && toIndex <= this.highlightedIndex_) {
      // The control was added or moved behind the highlighted index.
      this.highlightedIndex_++;
    } else if (
        fromIndex < this.highlightedIndex_ && toIndex > this.highlightedIndex_) {
      // The control was moved from before to behind the highlighted index.
      this.highlightedIndex_--;
    }
  };

  /**
   * Removes a child control.  Overrides {@link Ui_Component#removeChild} by
   * updating the highlight index.  Since {@link Ui_Component#removeChildAt}
   * uses {@link #removeChild} internally, we only need to override this method.
   * @param {string|Ui_Component} control The ID of the child to remove, or
   *     the control itself.
   * @param {boolean=} opt_unrender Whether to call `exitDocument` on the
   *     removed control, and detach its DOM from the document (defaults to
   *     false).
   * @return {Control} The removed control, if any.
   * @override
   */
  removeChild(control, opt_unrender) {
    control = (typeof control === 'string') ? this.getChild(control) : control;
    asserts.assertInstanceof(control, Control);
  
    if (control) {
      var index = this.indexOfChild(control);
      if (index != -1) {
        if (index == this.highlightedIndex_) {
          control.setHighlighted(false);
          this.highlightedIndex_ = -1;
        } else if (index < this.highlightedIndex_) {
          this.highlightedIndex_--;
        }
      }
  
      // Remove the mapping from the child element ID map.
      var childElem = control.getElement();
      if (childElem && childElem.id && this.childElementIdMap_) {
        object.remove(this.childElementIdMap_, childElem.id);
      }
    }
  
    control = /** @type {!Control} */ (
        super.removeChild(control, opt_unrender));
  
    // Re-enable mouse event handling (in case the control is reused elsewhere).
    control.setHandleMouseEvents(true);
  
    return control;
  };

  /**
   * Returns the container's orientation.
   * @return {?Orientation} Container orientation.
   */
  getOrientation() {
    return this.orientation_;
  };

  /**
   * Returns true if the container's visibility is set to visible, false if
   * it is set to hidden.  A container that is set to hidden is guaranteed
   * to be hidden from the user, but the reverse isn't necessarily true.
   * A container may be set to visible but can otherwise be obscured by another
   * element, rendered off-screen, or hidden using direct CSS manipulation.
   * @return {boolean} Whether the container is set to be visible.
   */
  isVisible() {
    return this.visible_;
  };

  /**
   * Shows or hides the container.  Does nothing if the container already has
   * the requested visibility.  Otherwise, dispatches a SHOW or HIDE event as
   * appropriate, giving listeners a chance to prevent the visibility change.
   * @param {boolean} visible Whether to show or hide the container.
   * @param {boolean=} opt_force If true, doesn't check whether the container
   *     already has the requested visibility, and doesn't dispatch any events.
   * @return {boolean} Whether the visibility was changed.
   */
  setVisible(visible, opt_force) {
    if (opt_force || (this.visible_ != visible &&
                      this.dispatchEvent(
                          visible ? ComponentEventType.SHOW :
                                    ComponentEventType.HIDE))) {
      this.visible_ = visible;
  
      var elem = this.getElement();
      if (elem) {
        style.setElementShown(elem, visible);
        if (this.isFocusable()) {
          // Enable keyboard access only for enabled & visible containers.
          this.renderer_.enableTabIndex(
              this.getKeyEventTarget(), this.enabled_ && this.visible_);
        }
        if (!opt_force) {
          this.dispatchEvent(
              this.visible_ ? EventType.AFTER_SHOW :
                              EventType.AFTER_HIDE);
        }
      }
  
      return true;
    }
  
    return false;
  };

  /**
   * Returns true if the container is enabled, false otherwise.
   * @return {boolean} Whether the container is enabled.
   */
  isEnabled() {
    return this.enabled_;
  };

  /**
   * Enables/disables the container based on the `enable` argument.
   * Dispatches an `ENABLED` or `DISABLED` event prior to changing
   * the container's state, which may be caught and canceled to prevent the
   * container from changing state.  Also enables/disables child controls.
   * @param {boolean} enable Whether to enable or disable the container.
   */
  setEnabled(enable) {
    if (this.enabled_ != enable &&
        this.dispatchEvent(
            enable ? ComponentEventType.ENABLE :
                     ComponentEventType.DISABLE)) {
      if (enable) {
        // Flag the container as enabled first, then update children.  This is
        // because controls can't be enabled if their parent is disabled.
        this.enabled_ = true;
        this.forEachChild(function(child) {
          // Enable child control unless it is flagged.
          if (child.wasDisabled) {
            delete child.wasDisabled;
          } else {
            child.setEnabled(true);
          }
        });
      } else {
        // Disable children first, then flag the container as disabled.  This is
        // because controls can't be disabled if their parent is already disabled.
        this.forEachChild(function(child) {
          // Disable child control, or flag it if it's already disabled.
          if (child.isEnabled()) {
            child.setEnabled(false);
          } else {
            child.wasDisabled = true;
          }
        });
        this.enabled_ = false;
        this.setMouseButtonPressed(false);
      }
  
      if (this.isFocusable()) {
        // Enable keyboard access only for enabled & visible components.
        this.renderer_.enableTabIndex(
            this.getKeyEventTarget(), enable && this.visible_);
      }
    }
  };

  /**
   * Returns true if the container is focusable, false otherwise.  The default
   * is true.  Focusable containers always have a tab index and allocate a key
   * handler to handle keyboard events while focused.
   * @return {boolean} Whether the component is focusable.
   */
  isFocusable() {
    return this.focusable_;
  };

  /**
   * Sets whether the container is focusable.  The default is true.  Focusable
   * containers always have a tab index and allocate a key handler to handle
   * keyboard events while focused.
   * @param {boolean} focusable Whether the component is to be focusable.
   */
  setFocusable(focusable) {
    if (focusable != this.focusable_ && this.isInDocument()) {
      this.enableFocusHandling_(focusable);
    }
    this.focusable_ = focusable;
    if (this.enabled_ && this.visible_) {
      this.renderer_.enableTabIndex(this.getKeyEventTarget(), focusable);
    }
  };

  /**
   * Returns true if the container allows children to be focusable, false
   * otherwise.  Only effective if the container is not focusable.
   * @return {boolean} Whether children should be focusable.
   */
  isFocusableChildrenAllowed() {
    return this.allowFocusableChildren_;
  };

  /**
   * Sets whether the container allows children to be focusable, false
   * otherwise.  Only effective if the container is not focusable.
   * @param {boolean} focusable Whether the children should be focusable.
   */
  setFocusableChildrenAllowed(focusable) {
    this.allowFocusableChildren_ = focusable;
  };

  /**
   * @return {boolean} Whether highlighting a child component should also open it.
   */
  isOpenFollowsHighlight() {
    return this.openFollowsHighlight_;
  };

  /**
   * Sets whether highlighting a child component should also open it.
   * @param {boolean} follow Whether highlighting a child component also opens it.
   */
  setOpenFollowsHighlight(follow) {
    this.openFollowsHighlight_ = follow;
  };

  /**
   * Returns the index of the currently highlighted item (-1 if none).
   * @return {number} Index of the currently highlighted item.
   */
  getHighlightedIndex() {
    return this.highlightedIndex_;
  };

  /**
   * Highlights the item at the given 0-based index (if any).  If another item
   * was previously highlighted, it is un-highlighted.
   * @param {number} index Index of item to highlight (-1 removes the current
   *     highlight).
   */
  setHighlightedIndex(index) {
    var child = this.getChildAt(index);
    if (child) {
      child.setHighlighted(true);
    } else if (this.highlightedIndex_ > -1) {
      this.getHighlighted().setHighlighted(false);
    }
  };

  /**
   * Highlights the given item if it exists and is a child of the container;
   * otherwise un-highlights the currently highlighted item.
   * @param {Control} item Item to highlight.
   */
  setHighlighted(item) {
    this.setHighlightedIndex(this.indexOfChild(item));
  };

  /**
   * Returns the currently highlighted item (if any).
   * @return {Control?} Highlighted item (null if none).
   */
  getHighlighted() {
    return this.getChildAt(this.highlightedIndex_);
  };

  /**
   * Highlights the first highlightable item in the container
   */
  highlightFirst() {
    this.highlightHelper(function(index, max) {
      return (index + 1) % max;
    }, this.getChildCount() - 1);
  };

  /**
   * Highlights the last highlightable item in the container.
   */
  highlightLast() {
    this.highlightHelper(function(index, max) {
      index--;
      return index < 0 ? max - 1 : index;
    }, 0);
  };

  /**
   * Highlights the next highlightable item (or the first if nothing is currently
   * highlighted).
   */
  highlightNext() {
    this.highlightHelper(function(index, max) {
      return (index + 1) % max;
    }, this.highlightedIndex_);
  };

  /**
   * Highlights the previous highlightable item (or the last if nothing is
   * currently highlighted).
   */
  highlightPrevious() {
    this.highlightHelper(function(index, max) {
      index--;
      return index < 0 ? max - 1 : index;
    }, this.highlightedIndex_);
  };

  /**
   * Helper function that manages the details of moving the highlight among
   * child controls in response to keyboard events.
   * @param {function(this: Container, number, number) : number} fn
   *     Function that accepts the current and maximum indices, and returns the
   *     next index to check.
   * @param {number} startIndex Start index.
   * @return {boolean} Whether the highlight has changed.
   * @protected
   */
  highlightHelper(fn, startIndex) {
    // If the start index is -1 (meaning there's nothing currently highlighted),
    // try starting from the currently open item, if any.
    var curIndex =
        startIndex < 0 ? this.indexOfChild(this.openItem_) : startIndex;
    var numItems = this.getChildCount();
  
    curIndex = fn.call(this, curIndex, numItems);
    var visited = 0;
    while (visited <= numItems) {
      var control = this.getChildAt(curIndex);
      if (control && this.canHighlightItem(control)) {
        this.setHighlightedIndexFromKeyEvent(curIndex);
        return true;
      }
      visited++;
      curIndex = fn.call(this, curIndex, numItems);
    }
    return false;
  };

  /**
   * Returns whether the given item can be highlighted.
   * @param {Control} item The item to check.
   * @return {boolean} Whether the item can be highlighted.
   * @protected
   */
  canHighlightItem(item) {
    return item.isVisible() && item.isEnabled() &&
        item.isSupportedState(State.HOVER);
  };

  /**
   * Helper method that sets the highlighted index to the given index in response
   * to a keyboard event.  The base class implementation simply calls the
   * {@link #setHighlightedIndex} method, but subclasses can override this
   * behavior as needed.
   * @param {number} index Index of item to highlight.
   * @protected
   */
  setHighlightedIndexFromKeyEvent(index) {
    this.setHighlightedIndex(index);
  };

  /**
   * Returns the currently open (expanded) control in the container (null if
   * none).
   * @return {Control?} The currently open control.
   */
  getOpenItem() {
    return this.openItem_;
  };

  /**
   * Returns true if the mouse button is pressed, false otherwise.
   * @return {boolean} Whether the mouse button is pressed.
   */
  isMouseButtonPressed() {
    return this.mouseButtonPressed_;
  };

  /**
   * Sets or clears the "mouse button pressed" flag.
   * @param {boolean} pressed Whether the mouse button is presed.
   */
  setMouseButtonPressed(pressed) {
    this.mouseButtonPressed_ = pressed;
  };
}

// google.tagUnsealableClass(Container);

/**
 * Container-specific events.
 * @enum {string}
 * @override
 * @suppress {checkTypes}
 */
let EventType = {
  /**
   * Dispatched after a Container becomes visible. Non-cancellable.
   * NOTE(user): This event really shouldn't exist, because the
   * ComponentEventType.SHOW event should behave like this one. But the
   * SHOW event for containers has been behaving as other components'
   * BEFORE_SHOW event for a long time, and too much code relies on that old
   * behavior to fix it now.
   */
  AFTER_SHOW: 'aftershow',

  /**
   * Dispatched after a Container becomes invisible. Non-cancellable.
   */
  AFTER_HIDE: 'afterhide'
};

/**
 * Container orientation constants.
 * @enum {string}
 */
let Orientation = {
  HORIZONTAL: 'horizontal',
  VERTICAL: 'vertical'
};

// Event handler and renderer management.

// Standard Ui_Component implementation.

// Default event handlers.

// Child component management.

// Container state management.

/**
 * Sets the container's orientation.
 * @param {Orientation} orientation Container orientation.
 */
// TODO(attila): Do we need to support containers with dynamic orientation?
Container.prototype.setOrientation = function(orientation) {
  if (this.getElement()) {
    // Too late.
    throw new Error(ComponentError.ALREADY_RENDERED);
  }

  this.orientation_ = orientation;
};

// Highlight management.

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
 * @fileoverview Base class for container renderers.
 */

/**
 * Default renderer for {@link Container}.  Can be used as-is, but
 * subclasses of Container will probably want to use renderers specifically
 * tailored for them by extending this class.
 */
class ContainerRenderer {

  /**
   * Default renderer for {@link Container}.  Can be used as-is, but
   * subclasses of Container will probably want to use renderers specifically
   * tailored for them by extending this class.
   * @param {string=} opt_ariaRole Optional ARIA role used for the element.
   */
  constructor(opt_ariaRole) {
    // By default, the ARIA role is unspecified.
    /** @private {string|undefined} */
    this.ariaRole_ = opt_ariaRole;
  }

  /** @return {!ContainerRenderer} @suppress {checkTypes} */
  static getInstance() {
    if (ContainerRenderer.instance_) {
      return /** @type {!ContainerRenderer} */ (ContainerRenderer.instance_);
    }
    return /** @type {!ContainerRenderer} */ (ContainerRenderer.instance_) = new ContainerRenderer();
  };

  /**
   * Constructs a new renderer and sets the CSS class that the renderer will use
   * as the base CSS class to apply to all elements rendered by that renderer.
   * An example to use this function using a menu is:
   *
   * <pre>
   * var myCustomRenderer = ContainerRenderer.getCustomRenderer(
   *     goog.ui.MenuRenderer, 'my-special-menu');
   * var newMenu = new goog.ui.Menu(opt_domHelper, myCustomRenderer);
   * </pre>
   *
   * Your styles for the menu can now be:
   * <pre>
   * .my-special-menu { }
   * </pre>
   *
   * <em>instead</em> of
   * <pre>
   * .CSS_MY_SPECIAL_MENU .goog-menu { }
   * </pre>
   *
   * You would want to use this functionality when you want an instance of a
   * component to have specific styles different than the other components of the
   * same type in your application.  This avoids using descendant selectors to
   * apply the specific styles to this component.
   *
   * @param {Function} ctor The constructor of the renderer you want to create.
   * @param {string} cssClassName The name of the CSS class for this renderer.
   * @return {ContainerRenderer} An instance of the desired renderer with
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
   * Returns the ARIA role to be applied to the container.
   * See http://wiki/Main/ARIA for more info.
   * @return {undefined|string} ARIA role.
   */
  getAriaRole() {
    return this.ariaRole_;
  };

  /**
   * Enables or disables the tab index of the element.  Only elements with a
   * valid tab index can receive focus.
   * @param {Element} element Element whose tab index is to be changed.
   * @param {boolean} enable Whether to add or remove the element's tab index.
   */
  enableTabIndex(element, enable) {
    if (element) {
      element.tabIndex = enable ? 0 : -1;
    }
  };

  /**
   * Creates and returns the container's root element.  The default
   * simply creates a DIV and applies the renderer's own CSS class name to it.
   * To be overridden in subclasses.
   * @param {Container} container Container to render.
   * @return {Element} Root element for the container.
   */
  createDom(container) {
    return container.getDomHelper().createDom(
        TagName.DIV, this.getClassNames(container).join(' '));
  };

  /**
   * Returns the DOM element into which child components are to be rendered,
   * or null if the container hasn't been rendered yet.
   * @param {Element} element Root element of the container whose content element
   *     is to be returned.
   * @return {Element} Element to contain child elements (null if none).
   */
  getContentElement(element) {
    return element;
  };

  /**
   * Default implementation of `canDecorate`; returns true if the element
   * is a DIV, false otherwise.
   * @param {Element} element Element to decorate.
   * @return {boolean} Whether the renderer can decorate the element.
   */
  canDecorate(element) {
    return element.tagName == 'DIV';
  };

  /**
   * Default implementation of `decorate` for {@link Container}s.
   * Decorates the element with the container, and attempts to decorate its child
   * elements.  Returns the decorated element.
   * @param {Container} container Container to decorate the element.
   * @param {Element} element Element to decorate.
   * @return {!Element} Decorated element.
   */
  decorate(container, element) {
    // Set the container's ID to the decorated element's DOM ID, if any.
    if (element.id) {
      container.setId(element.id);
    }
  
    // Configure the container's state based on the CSS class names it has.
    var baseClass = this.getCssClass();
    var hasBaseClass = false;
    var classNames = classlist.get(element);
    if (classNames) {
      googarray.forEach(classNames, function(className) {
        if (className == baseClass) {
          hasBaseClass = true;
        } else if (className) {
          this.setStateFromClassName(container, className, baseClass);
        }
      }, this);
    }
  
    if (!hasBaseClass) {
      // Make sure the container's root element has the renderer's own CSS class.
      classlist.add(element, baseClass);
    }
  
    // Decorate the element's children, if applicable.  This should happen after
    // the container's own state has been initialized, since how children are
    // decorated may depend on the state of the container.
    this.decorateChildren(container, this.getContentElement(element));
  
    return element;
  };

  /**
   * Sets the container's state based on the given CSS class name, encountered
   * during decoration.  CSS class names that don't represent container states
   * are ignored.  Considered protected; subclasses should override this method
   * to support more states and CSS class names.
   * @param {Container} container Container to update.
   * @param {string} className CSS class name.
   * @param {string} baseClass Base class name used as the root of state-specific
   *     class names (typically the renderer's own class name).
   * @protected
   * @suppress {missingRequire} Container
   */
  setStateFromClassName(
      container, className, baseClass) {
    if (className == google.getCssName(baseClass, 'disabled')) {
      container.setEnabled(false);
    } else if (className == google.getCssName(baseClass, 'horizontal')) {
      container.setOrientation(Orientation.HORIZONTAL);
    } else if (className == google.getCssName(baseClass, 'vertical')) {
      container.setOrientation(Orientation.VERTICAL);
    }
  };

  /**
   * Takes a container and an element that may contain child elements, decorates
   * the child elements, and adds the corresponding components to the container
   * as child components.  Any non-element child nodes (e.g. empty text nodes
   * introduced by line breaks in the HTML source) are removed from the element.
   * @param {Container} container Container whose children are to be
   *     discovered.
   * @param {Element} element Element whose children are to be decorated.
   * @param {Element=} opt_firstChild the first child to be decorated.
   */
  decorateChildren(
      container, element, opt_firstChild) {
    if (element) {
      var node = opt_firstChild || element.firstChild, next;
      // Tag soup HTML may result in a DOM where siblings have different parents.
      while (node && node.parentNode == element) {
        // Get the next sibling here, since the node may be replaced or removed.
        next = node.nextSibling;
        if (node.nodeType == NodeType.ELEMENT) {
          // Decorate element node.
          var child = this.getDecoratorForChild(/** @type {!Element} */ (node));
          if (child) {
            // addChild() may need to look at the element.
            child.setElementInternal(/** @type {!Element} */ (node));
            // If the container is disabled, mark the child disabled too.  See
            // bug 1263729.  Note that this must precede the call to addChild().
            if (!container.isEnabled()) {
              child.setEnabled(false);
            }
            container.addChild(child);
            child.decorate(/** @type {!Element} */ (node));
          }
        } else if (!node.nodeValue || strings.trim(node.nodeValue) == '') {
          // Remove empty text node, otherwise madness ensues (e.g. controls that
          // use goog-inline-block will flicker and shift on hover on Gecko).
          element.removeChild(node);
        }
        node = next;
      }
    }
  };

  /**
   * Inspects the element, and creates an instance of {@link Control} or
   * an appropriate subclass best suited to decorate it.  Returns the control (or
   * null if no suitable class was found).  This default implementation uses the
   * element's CSS class to find the appropriate control class to instantiate.
   * May be overridden in subclasses.
   * @param {Element} element Element to decorate.
   * @return {Control?} A new control suitable to decorate the element
   *     (null if none).
   */
  getDecoratorForChild(element) {
    return /** @type {Control} */ (
        registry.getDecorator(element));
  };

  /**
   * Initializes the container's DOM when the container enters the document.
   * Called from {@link Container#enterDocument}.
   * @param {Container} container Container whose DOM is to be initialized
   *     as it enters the document.
   */
  initializeDom(container) {
    var elem = container.getElement();
    asserts.assert(elem, 'The container DOM element cannot be null.');
    // Make sure the container's element isn't selectable.  On Gecko, recursively
    // marking each child element unselectable is expensive and unnecessary, so
    // only mark the root element unselectable.
    style.setUnselectable(elem, true, userAgent.GECKO);
  
    // IE doesn't support outline:none, so we have to use the hideFocus property.
    if (userAgent.IE) {
      elem.hideFocus = true;
    }
  
    // Set the ARIA role.
    var ariaRole = this.getAriaRole();
    if (ariaRole) {
      a11yaria.setRole(elem, ariaRole);
    }
  };

  /**
   * Returns the element within the container's DOM that should receive keyboard
   * focus (null if none).  The default implementation returns the container's
   * root element.
   * @param {Container} container Container whose key event target is
   *     to be returned.
   * @return {Element} Key event target (null if none).
   */
  getKeyEventTarget(container) {
    return container.getElement();
  };

  /**
   * Returns the CSS class to be applied to the root element of containers
   * rendered using this renderer.
   * @return {string} Renderer-specific CSS class.
   */
  getCssClass() {
    return ContainerRenderer.CSS_CLASS;
  };

  /**
   * Returns all CSS class names applicable to the given container, based on its
   * state.  The array of class names returned includes the renderer's own CSS
   * class, followed by a CSS class indicating the container's orientation,
   * followed by any state-specific CSS classes.
   * @param {Container} container Container whose CSS classes are to be
   *     returned.
   * @return {!Array<string>} Array of CSS class names applicable to the
   *     container.
   */
  getClassNames(container) {
    var baseClass = this.getCssClass();
    var isHorizontal =
        container.getOrientation() == Orientation.HORIZONTAL;
    var classNames = [
      baseClass, (isHorizontal ? google.getCssName(baseClass, 'horizontal') :
                                 google.getCssName(baseClass, 'vertical'))
    ];
    if (!container.isEnabled()) {
      classNames.push(google.getCssName(baseClass, 'disabled'));
    }
    return classNames;
  };

  /**
   * Returns the default orientation of containers rendered or decorated by this
   * renderer.  The base class implementation returns `VERTICAL`.
   * @return {Orientation} Default orientation for containers
   *     created or decorated by this renderer.
   * @suppress {missingRequire} Container
   */
  getDefaultOrientation() {
    return Orientation.VERTICAL;
  };
}
/** @type {undefined|!ContainerRenderer} @suppress {underscore,checkTypes}*/
ContainerRenderer.instance_ = undefined;

/**
 * Default CSS class to be applied to the root element of containers rendered
 * by this renderer.
 * @type {string}
 */
ContainerRenderer.CSS_CLASS = google.getCssName('goog-container');

export {Container, ContainerRenderer, EventType, Orientation};