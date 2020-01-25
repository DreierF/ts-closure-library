import * as googarray from './../array/array.js';
import * as asserts from './../asserts/asserts.js';
import * as classlist from './../dom/classlist.js';
import * as goog_dom from './../dom/dom.js';
import {BrowserEvent as EventsBrowserEvent} from './../events/browserevent.js';
import {Event as EventsEvent} from './../events/event.js';
import * as goog_events from './../events/eventhandler.js';
import {EventTarget as EventsEventTarget} from './../events/eventhandler.js';
import {EventHandler} from './../events/eventhandler.js';
import {EventType as EventsEventType} from './../events/eventtype.js';
import {Box} from './../math/box.js';
import {Coordinate} from './../math/coordinate.js';
import * as style from './../style/style.js';
import {Dragger as Fx_Dragger} from './dragger.js';
import {DragEvent} from './dragger.js';
import {EventType as DraggerEventType} from './dragger.js';
// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Abstract Base Class for Drag and Drop.
 *
 * Provides functionality for implementing drag and drop classes. Also provides
 * support classes and events.
 */

/**
 * Abstract class that provides reusable functionality for implementing drag
 * and drop functionality.
 *
 * This class also allows clients to define their own subtargeting function
 * so that drop areas can have finer granularity than a single element. This is
 * accomplished by using a client provided function to map from element and
 * coordinates to a subregion id.
 *
 * This class can also be made aware of scrollable containers that contain
 * drop targets by calling addScrollableContainer. This will cause dnd to
 * take changing scroll positions into account while a drag is occurring.
 *
 * @extends {EventsEventTarget}
 * @class
 * @abstract
 */
class AbstractDragDrop extends EventsEventTarget {

  /**
   * Abstract class that provides reusable functionality for implementing drag
   * and drop functionality.
   *
   * This class also allows clients to define their own subtargeting function
   * so that drop areas can have finer granularity than a single element. This is
   * accomplished by using a client provided function to map from element and
   * coordinates to a subregion id.
   *
   * This class can also be made aware of scrollable containers that contain
   * drop targets by calling addScrollableContainer. This will cause dnd to
   * take changing scroll positions into account while a drag is occurring.
   *
   */
  constructor() {
    super();
  
    /**
     * List of items that makes up the drag source or drop target.
     * @protected {Array<DragDropItem>}
     * @suppress {underscore|visibility}
     */
    this.items_ = [];
  
    /**
     * List of associated drop targets.
     * @private {Array<AbstractDragDrop>}
     */
    this.targets_ = [];
  
    /**
     * Scrollable containers to account for during drag
     * @private {Array<ScrollableContainer_>}
     */
    this.scrollableContainers_ = [];
  
    /**
     * Flag indicating if it's a drag source, set by addTarget.
     * @private {boolean}
     */
    this.isSource_ = false;
  
    /**
     * Flag indicating if it's a drop target, set when added as target to another
     * DragDrop object.
     * @private {boolean}
     */
    this.isTarget_ = false;
  
    /**
     * Subtargeting function accepting args:
     * (DragDropItem, Box, number, number)
     * @private {?Function}
     */
    this.subtargetFunction_;
  
    /**
     * Last active subtarget.
     * @private {?Object}
     */
    this.activeSubtarget_;
  
    /**
     * Class name to add to source elements being dragged. Set by setDragClass.
     * @private {?string}
     */
    this.dragClass_;
  
    /**
     * Class name to add to source elements. Set by setSourceClass.
     * @private {?string}
     */
    this.sourceClass_;
  
    /**
     * Class name to add to target elements. Set by setTargetClass.
     * @private {?string}
     */
    this.targetClass_;
  
    /**
     * The SCROLL event target used to make drag element follow scrolling.
     * @private {?EventTarget}
     */
    this.scrollTarget_;
  
    /**
     * Dummy target, {@see maybeCreateDummyTargetForPosition_}.
     * @private {?ActiveDropTarget_}
     */
    this.dummyTarget_;
  
    /**
     * Whether the object has been initialized.
     * @private {boolean}
     */
    this.initialized_ = false;
  
    /** @private {?Element} */
    this.dragEl_;
  
    /** @private {?Array<!ActiveDropTarget_>} */
    this.targetList_;
  
    /** @private {?Box} */
    this.targetBox_;
  
    /** @private {?ActiveDropTarget_} */
    this.activeTarget_;
  
    /** @private {?DragDropItem} */
    this.dragItem_;
  
    /** @private {?Fx_Dragger} */
    this.dragger_;
  }

  /**
   * Set class to add to source elements being dragged.
   *
   * @param {string} className Class to be added.  Must be a single, valid
   *     classname.
   */
  setDragClass(className) {
    this.dragClass_ = className;
  };

  /**
   * Set class to add to source elements.
   *
   * @param {string} className Class to be added.  Must be a single, valid
   *     classname.
   */
  setSourceClass(className) {
    this.sourceClass_ = className;
  };

  /**
   * Set class to add to target elements.
   *
   * @param {string} className Class to be added.  Must be a single, valid
   *     classname.
   */
  setTargetClass(className) {
    this.targetClass_ = className;
  };

  /**
   * Whether the control has been initialized.
   *
   * @return {boolean} True if it's been initialized.
   */
  isInitialized() {
    return this.initialized_;
  };

  /**
   * Add item to drag object.
   *
   * @param {Element|string} element Dom Node, or string representation of node
   *     id, to be used as drag source/drop target.
   * @throws Error Thrown if called on instance of abstract class
   * @abstract
   */
  addItem(element) {}

  /**
   * Associate drop target with drag element.
   *
   * @param {AbstractDragDrop} target Target to add.
   */
  addTarget(target) {
    this.targets_.push(target);
    target.isTarget_ = true;
    this.isSource_ = true;
  };

  /**
   * Removes the specified target from the list of drop targets.
   *
   * @param {!AbstractDragDrop} target Target to remove.
   */
  removeTarget(target) {
    googarray.remove(this.targets_, target);
    if (this.activeTarget_ && this.activeTarget_.target_ == target) {
      this.activeTarget_ = null;
    }
    this.recalculateDragTargets();
  };

  /**
   * Sets the SCROLL event target to make drag element follow scrolling.
   *
   * @param {EventTarget} scrollTarget The element that dispatches SCROLL events.
   */
  setScrollTarget(scrollTarget) {
    this.scrollTarget_ = scrollTarget;
  };

  /**
   * Initialize drag and drop functionality for sources/targets already added.
   * Sources/targets added after init has been called will initialize themselves
   * one by one.
   */
  init() {
    if (this.initialized_) {
      return;
    }
    for (var item, i = 0; item = this.items_[i]; i++) {
      this.initItem(item);
    }
  
    this.initialized_ = true;
  };

  /**
   * Initializes a single item.
   *
   * @param {DragDropItem} item Item to initialize.
   * @protected
   */
  initItem(item) {
    if (this.isSource_) {
      goog_events.listen(
          item.element, EventsEventType.MOUSEDOWN, item.mouseDown_, false,
          item);
      if (this.sourceClass_) {
        classlist.add(
            asserts.assert(item.element), this.sourceClass_);
      }
    }
  
    if (this.isTarget_ && this.targetClass_) {
      classlist.add(
          asserts.assert(item.element), this.targetClass_);
    }
  };

  /**
   * Called when removing an item. Removes event listeners and classes.
   *
   * @param {DragDropItem} item Item to dispose.
   * @protected
   */
  disposeItem(item) {
    if (this.isSource_) {
      goog_events.unlisten(
          item.element, EventsEventType.MOUSEDOWN, item.mouseDown_, false,
          item);
      if (this.sourceClass_) {
        classlist.remove(
            asserts.assert(item.element), this.sourceClass_);
      }
    }
    if (this.isTarget_ && this.targetClass_) {
      classlist.remove(
          asserts.assert(item.element), this.targetClass_);
    }
    item.dispose();
  };

  /**
   * Removes all items.
   */
  removeItems() {
    for (var item, i = 0; item = this.items_[i]; i++) {
      this.disposeItem(item);
    }
    this.items_.length = 0;
  };

  /**
   * Starts a drag event for an item if the mouse button stays pressed and the
   * cursor moves a few pixels. Allows dragging of items without first having to
   * register them with addItem.
   *
   * @param {EventsBrowserEvent} event Mouse down event.
   * @param {DragDropItem} item Item that's being dragged.
   */
  maybeStartDrag(event, item) {
    item.maybeStartDrag_(event, item.element);
  };

  /**
   * Event handler that's used to start drag.
   *
   * @param {EventsBrowserEvent} event Mouse move event.
   * @param {DragDropItem} item Item that's being dragged.
   */
  startDrag(event, item) {
  
    // Prevent a new drag operation from being started if another one is already
    // in progress (could happen if the mouse was released outside of the
    // document).
    if (this.dragItem_) {
      return;
    }
  
    this.dragItem_ = item;
  
    // Dispatch DRAGSTART event
    var dragStartEvent = new DragDropEvent(
        EventType.DRAGSTART, this, this.dragItem_,
        undefined,  // opt_target
        undefined,  // opt_targetItem
        undefined,  // opt_targetElement
        undefined,  // opt_clientX
        undefined,  // opt_clientY
        undefined,  // opt_x
        undefined,  // opt_y
        undefined,  // opt_subtarget
        event);
    if (this.dispatchEvent(dragStartEvent) == false) {
      this.dragItem_ = null;
      return;
    }
  
    // Get the source element and create a drag element for it.
    var el = item.getCurrentDragElement();
    this.dragEl_ = this.createDragElement(el);
    var doc = goog_dom.getOwnerDocument(el);
    doc.body.appendChild(this.dragEl_);
  
    this.dragger_ = this.createDraggerFor(el, this.dragEl_, event);
    this.dragger_.setScrollTarget(this.scrollTarget_);
  
    goog_events.listen(
        this.dragger_, DraggerEventType.DRAG, this.moveDrag_, false,
        this);
  
    goog_events.listen(
        this.dragger_, DraggerEventType.END, this.endDrag, false, this);
  
    // IE may issue a 'selectstart' event when dragging over an iframe even when
    // default mousemove behavior is suppressed. If the default selectstart
    // behavior is not suppressed, elements dragged over will show as selected.
    goog_events.listen(
        doc.body, EventsEventType.SELECTSTART, this.suppressSelect_);
  
    this.recalculateDragTargets();
    this.recalculateScrollableContainers();
    this.activeTarget_ = null;
    this.initScrollableContainerListeners_();
    this.dragger_.startDrag(event);
  
    event.preventDefault();
  };

  /**
   * Recalculates the geometry of this source's drag targets.  Call this
   * if the position or visibility of a drag target has changed during
   * a drag, or if targets are added or removed.
   *
   * TODO(user): this is an expensive operation;  more efficient APIs
   * may be necessary.
   */
  recalculateDragTargets() {
    this.targetList_ = [];
    for (var target, i = 0; target = this.targets_[i]; i++) {
      for (var itm, j = 0; itm = target.items_[j]; j++) {
        this.addDragTarget_(target, itm);
      }
    }
    if (!this.targetBox_) {
      this.targetBox_ = new Box(0, 0, 0, 0);
    }
  };

  /**
   * Recalculates the current scroll positions of scrollable containers and
   * allocates targets. Call this if the position of a container changed or if
   * targets are added or removed.
   */
  recalculateScrollableContainers() {
    var container, i, j, target;
    for (i = 0; container = this.scrollableContainers_[i]; i++) {
      container.containedTargets_ = [];
      container.savedScrollLeft_ = container.element_.scrollLeft;
      container.savedScrollTop_ = container.element_.scrollTop;
      var pos = style.getPageOffset(container.element_);
      var size = style.getSize(container.element_);
      container.box_ = new Box(
          pos.y, pos.x + size.width, pos.y + size.height, pos.x);
    }
  
    for (i = 0; target = this.targetList_[i]; i++) {
      for (j = 0; container = this.scrollableContainers_[j]; j++) {
        if (goog_dom.contains(container.element_, target.element_)) {
          container.containedTargets_.push(target);
          target.scrollableContainer_ = container;
        }
      }
    }
  };

  /**
   * Creates the Dragger for the drag element.
   * @param {Element} sourceEl Drag source element.
   * @param {Element} el the element created by createDragElement().
   * @param {EventsBrowserEvent} event Mouse down event for start of drag.
   * @return {!Fx_Dragger} The new Dragger.
   * @protected
   */
  createDraggerFor(
      sourceEl, el, event) {
    // Position the drag element.
    var pos = this.getDragElementPosition(sourceEl, el, event);
    el.style.position = 'absolute';
    el.style.left = pos.x + 'px';
    el.style.top = pos.y + 'px';
    return new Fx_Dragger(el);
  };

  /**
   * Event handler that's used to stop drag. Fires a drop event if over a valid
   * target.
   *
   * @param {DragEvent} event Drag event.
   */
  endDrag(event) {
    var activeTarget = event.dragCanceled ? null : this.activeTarget_;
    if (activeTarget && activeTarget.target_) {
      var clientX = event.clientX;
      var clientY = event.clientY;
      var scroll = this.getScrollPos();
      var x = clientX + scroll.x;
      var y = clientY + scroll.y;
  
      var subtarget;
      // If a subtargeting function is enabled get the current subtarget
      if (this.subtargetFunction_) {
        subtarget =
            this.subtargetFunction_(activeTarget.item_, activeTarget.box_, x, y);
      }
  
      var dragEvent = new DragDropEvent(
          EventType.DRAG, this, this.dragItem_,
          activeTarget.target_, activeTarget.item_, activeTarget.element_,
          clientX, clientY, x, y);
      this.dispatchEvent(dragEvent);
  
      var dropEvent = new DragDropEvent(
          EventType.DROP, this, this.dragItem_,
          activeTarget.target_, activeTarget.item_, activeTarget.element_,
          clientX, clientY, x, y, subtarget, event.browserEvent);
      activeTarget.target_.dispatchEvent(dropEvent);
    }
  
    var dragEndEvent = new DragDropEvent(
        EventType.DRAGEND, this, this.dragItem_,
        activeTarget ? activeTarget.target_ : undefined,
        activeTarget ? activeTarget.item_ : undefined,
        activeTarget ? activeTarget.element_ : undefined);
    this.dispatchEvent(dragEndEvent);
  
    goog_events.unlisten(
        this.dragger_, DraggerEventType.DRAG, this.moveDrag_, false,
        this);
    goog_events.unlisten(
        this.dragger_, DraggerEventType.END, this.endDrag, false, this);
    var doc = goog_dom.getOwnerDocument(this.dragItem_.getCurrentDragElement());
    goog_events.unlisten(
        doc.body, EventsEventType.SELECTSTART, this.suppressSelect_);
  
  
    this.afterEndDrag(this.activeTarget_ ? this.activeTarget_.item_ : null);
  };

  /**
   * Called after a drag operation has finished.
   *
   * @param {DragDropItem=} opt_dropTarget Target for successful drop.
   * @protected
   */
  afterEndDrag(opt_dropTarget) {
    this.disposeDrag();
  };

  /**
   * Called once a drag operation has finished. Removes event listeners and
   * elements.
   *
   * @protected
   */
  disposeDrag() {
    this.disposeScrollableContainerListeners_();
    this.dragger_.dispose();
  
    goog_dom.removeNode(this.dragEl_);
    delete this.dragItem_;
    delete this.dragEl_;
    delete this.dragger_;
    delete this.targetList_;
    delete this.activeTarget_;
  };

  /**
   * Event handler for drag events. Determines the active drop target, if any, and
   * fires dragover and dragout events appropriately.
   *
   * @param {DragEvent} event Drag event.
   * @private
   */
  moveDrag_(event) {
    var position = this.getEventPosition(event);
    var x = position.x;
    var y = position.y;
  
    var activeTarget = this.activeTarget_;
  
    this.dispatchEvent(
        new DragDropEvent(
            EventType.DRAG, this, this.dragItem_,
            activeTarget ? activeTarget.target_ : undefined,
            activeTarget ? activeTarget.item_ : undefined,
            activeTarget ? activeTarget.element_ : undefined, event.clientX,
            event.clientY, x, y));
  
    // Check if we're still inside the bounds of the active target, if not fire
    // a dragout event and proceed to find a new target.
    var subtarget;
    if (activeTarget) {
      // If a subtargeting function is enabled get the current subtarget
      if (this.subtargetFunction_ && activeTarget.target_) {
        subtarget =
            this.subtargetFunction_(activeTarget.item_, activeTarget.box_, x, y);
      }
  
      if (activeTarget.box_.contains(position) &&
          subtarget == this.activeSubtarget_) {
        return;
      }
  
      if (activeTarget.target_) {
        var sourceDragOutEvent = new DragDropEvent(
            EventType.DRAGOUT, this, this.dragItem_,
            activeTarget.target_, activeTarget.item_, activeTarget.element_);
        this.dispatchEvent(sourceDragOutEvent);
  
        // The event should be dispatched the by target DragDrop so that the
        // target DragDrop can manage these events without having to know what
        // sources this is a target for.
        var targetDragOutEvent = new DragDropEvent(
            EventType.DRAGOUT, this, this.dragItem_,
            activeTarget.target_, activeTarget.item_, activeTarget.element_,
            undefined, undefined, undefined, undefined, this.activeSubtarget_);
        activeTarget.target_.dispatchEvent(targetDragOutEvent);
      }
      this.activeSubtarget_ = subtarget;
      this.activeTarget_ = null;
    }
  
    // Check if inside target box
    if (this.targetBox_.contains(position)) {
      // Search for target and fire a dragover event if found
      activeTarget = this.activeTarget_ = this.getTargetFromPosition_(position);
      if (activeTarget && activeTarget.target_) {
        // If a subtargeting function is enabled get the current subtarget
        if (this.subtargetFunction_) {
          subtarget = this.subtargetFunction_(
              activeTarget.item_, activeTarget.box_, x, y);
        }
        var sourceDragOverEvent = new DragDropEvent(
            EventType.DRAGOVER, this, this.dragItem_,
            activeTarget.target_, activeTarget.item_, activeTarget.element_);
        sourceDragOverEvent.subtarget = subtarget;
        this.dispatchEvent(sourceDragOverEvent);
  
        // The event should be dispatched by the target DragDrop so that the
        // target DragDrop can manage these events without having to know what
        // sources this is a target for.
        var targetDragOverEvent = new DragDropEvent(
            EventType.DRAGOVER, this, this.dragItem_,
            activeTarget.target_, activeTarget.item_, activeTarget.element_,
            event.clientX, event.clientY, undefined, undefined, subtarget);
        activeTarget.target_.dispatchEvent(targetDragOverEvent);
  
      } else if (!activeTarget) {
        // If no target was found create a dummy one so we won't have to iterate
        // over all possible targets for every move event.
        this.activeTarget_ = this.maybeCreateDummyTargetForPosition_(x, y);
      }
    }
  };

  /**
   * Event handler for suppressing selectstart events. Selecting should be
   * disabled while dragging.
   *
   * @param {EventsEvent} event The selectstart event to suppress.
   * @return {boolean} Whether to perform default behavior.
   * @private
   */
  suppressSelect_(event) {
    return false;
  };

  /**
   * Sets up listeners for the scrollable containers that keep track of their
   * scroll positions.
   * @private
   */
  initScrollableContainerListeners_() {
    var container, i;
    for (i = 0; container = this.scrollableContainers_[i]; i++) {
      goog_events.listen(
          container.element_, EventsEventType.SCROLL,
          this.containerScrollHandler_, false, this);
    }
  };

  /**
   * Cleans up the scrollable container listeners.
   * @private
   */
  disposeScrollableContainerListeners_() {
    for (var i = 0, container; container = this.scrollableContainers_[i]; i++) {
      goog_events.unlisten(
          container.element_, 'scroll', this.containerScrollHandler_, false,
          this);
      container.containedTargets_ = [];
    }
  };

  /**
   * Makes drag and drop aware of a target container that could scroll mid drag.
   * @param {Element} element The scroll container.
   */
  addScrollableContainer(element) {
    this.scrollableContainers_.push(new ScrollableContainer_(element));
  };

  /**
   * Removes all scrollable containers.
   */
  removeAllScrollableContainers() {
    this.disposeScrollableContainerListeners_();
    this.scrollableContainers_ = [];
  };

  /**
   * Event handler for containers scrolling.
   * @param {EventsBrowserEvent} e The event.
   * @suppress {visibility} TODO(martone): update dependent projects.
   * @private
   */
  containerScrollHandler_(e) {
    for (var i = 0, container; container = this.scrollableContainers_[i]; i++) {
      if (e.target == container.element_) {
        var deltaTop = container.savedScrollTop_ - container.element_.scrollTop;
        var deltaLeft =
            container.savedScrollLeft_ - container.element_.scrollLeft;
        container.savedScrollTop_ = container.element_.scrollTop;
        container.savedScrollLeft_ = container.element_.scrollLeft;
  
        // When the container scrolls, it's possible that one of the targets will
        // move to the region contained by the dummy target. Since we don't know
        // which sides (if any) of the dummy target are defined by targets
        // contained by this container, we are conservative and just shrink it.
        if (this.dummyTarget_ && this.activeTarget_ == this.dummyTarget_) {
          if (deltaTop > 0) {
            this.dummyTarget_.box_.top += deltaTop;
          } else {
            this.dummyTarget_.box_.bottom += deltaTop;
          }
          if (deltaLeft > 0) {
            this.dummyTarget_.box_.left += deltaLeft;
          } else {
            this.dummyTarget_.box_.right += deltaLeft;
          }
        }
        for (var j = 0, target; target = container.containedTargets_[j]; j++) {
          var box = target.box_;
          box.top += deltaTop;
          box.left += deltaLeft;
          box.bottom += deltaTop;
          box.right += deltaLeft;
  
          this.calculateTargetBox_(box);
        }
      }
    }
    this.dragger_.onScroll_(e);
  };

  /**
   * Set a function that provides subtargets. A subtargeting function
   * returns an arbitrary identifier for each subtarget of an element.
   * DnD code will generate additional drag over / out events when
   * switching from subtarget to subtarget. This is useful for instance
   * if you are interested if you are on the top half or the bottom half
   * of the element.
   * The provided function will be given the DragDropItem, box, x, y
   * box is the current window coordinates occupied by element
   * x, y is the mouse position in window coordinates
   *
   * @param {Function} f The new subtarget function.
   */
  setSubtargetFunction(f) {
    this.subtargetFunction_ = f;
  };

  /**
   * Creates an element for the item being dragged.
   *
   * @param {Element} sourceEl Drag source element.
   * @return {Element} The new drag element.
   */
  createDragElement(sourceEl) {
    var dragEl = this.createDragElementInternal(sourceEl);
    asserts.assert(dragEl);
    if (this.dragClass_) {
      classlist.add(dragEl, this.dragClass_);
    }
  
    return dragEl;
  };

  /**
   * Returns the position for the drag element.
   *
   * @param {Element} el Drag source element.
   * @param {Element} dragEl The dragged element created by createDragElement().
   * @param {EventsBrowserEvent} event Mouse down event for start of drag.
   * @return {!Coordinate} The position for the drag element.
   */
  getDragElementPosition(
      el, dragEl, event) {
    var pos = style.getPageOffset(el);
  
    // Subtract margin from drag element position twice, once to adjust the
    // position given by the original node and once for the drag node.
    var marginBox = style.getMarginBox(el);
    pos.x -= (marginBox.left || 0) * 2;
    pos.y -= (marginBox.top || 0) * 2;
  
    return pos;
  };

  /**
   * Returns the dragger object.
   *
   * @return {Fx_Dragger} The dragger object used by this drag and drop
   *     instance.
   */
  getDragger() {
    return this.dragger_;
  };

  /**
   * Creates copy of node being dragged.
   *
   * @param {Element} sourceEl Element to copy.
   * @return {!Element} The clone of `sourceEl`.
   * @deprecated Use Fx_Dragger.cloneNode().
   * @private
   */
  cloneNode_(sourceEl) {
    return Fx_Dragger.cloneNode(sourceEl);
  };

  /**
   * Generates an element to follow the cursor during dragging, given a drag
   * source element.  The default behavior is simply to clone the source element,
   * but this may be overridden in subclasses.  This method is called by
   * `createDragElement()` before the drag class is added.
   *
   * @param {Element} sourceEl Drag source element.
   * @return {!Element} The new drag element.
   * @protected
   * @suppress {deprecated}
   */
  createDragElementInternal(
      sourceEl) {
    return this.cloneNode_(sourceEl);
  };

  /**
   * Add possible drop target for current drag operation.
   *
   * @param {AbstractDragDrop} target Drag handler.
   * @param {DragDropItem} item Item that's being dragged.
   * @private
   */
  addDragTarget_(target, item) {
  
    // Get all the draggable elements and add each one.
    var draggableElements = item.getDraggableElements();
    for (var i = 0; i < draggableElements.length; i++) {
      var draggableElement = draggableElements[i];
  
      // Determine target position and dimension
      var box = this.getElementBox(item, draggableElement);
  
      this.targetList_.push(
          new ActiveDropTarget_(box, target, item, draggableElement));
  
      this.calculateTargetBox_(box);
    }
  };

  /**
   * Calculates the position and dimension of a draggable element.
   *
   * @param {DragDropItem} item Item that's being dragged.
   * @param {Element} element The element to calculate the box.
   *
   * @return {!Box} Box describing the position and dimension
   *     of element.
   * @protected
   */
  getElementBox(item, element) {
    var pos = style.getPageOffset(element);
    var size = style.getSize(element);
    return new Box(
        pos.y, pos.x + size.width, pos.y + size.height, pos.x);
  };

  /**
   * Calculate the outer bounds (the region all targets are inside).
   *
   * @param {Box} box Box describing the position and dimension
   *     of a drag target.
   * @private
   */
  calculateTargetBox_(box) {
    if (this.targetList_.length == 1) {
      this.targetBox_ =
          new Box(box.top, box.right, box.bottom, box.left);
    } else {
      var tb = this.targetBox_;
      tb.left = Math.min(box.left, tb.left);
      tb.right = Math.max(box.right, tb.right);
      tb.top = Math.min(box.top, tb.top);
      tb.bottom = Math.max(box.bottom, tb.bottom);
    }
  };

  /**
   * Creates a dummy target for the given cursor position. The assumption is to
   * create as big dummy target box as possible, the only constraints are:
   * - The dummy target box cannot overlap any of real target boxes.
   * - The dummy target has to contain a point with current mouse coordinates.
   *
   * NOTE: For performance reasons the box construction algorithm is kept simple
   * and it is not optimal (see example below). Currently it is O(n) in regard to
   * the number of real drop target boxes, but its result depends on the order
   * of those boxes being processed (the order in which they're added to the
   * targetList_ collection).
   *
   * The algorithm.
   * a) Assumptions
   * - Mouse pointer is in the bounding box of real target boxes.
   * - None of the boxes have negative coordinate values.
   * - Mouse pointer is not contained by any of "real target" boxes.
   * - For targets inside a scrollable container, the box used is the
   *   intersection of the scrollable container's box and the target's box.
   *   This is because the part of the target that extends outside the scrollable
   *   container should not be used in the clipping calculations.
   *
   * b) Outline
   * - Initialize the fake target to the bounding box of real targets.
   * - For each real target box - clip the fake target box so it does not contain
   *   that target box, but does contain the mouse pointer.
   *   -- Project the real target box, mouse pointer and fake target box onto
   *      both axes and calculate the clipping coordinates.
   *   -- Only one coordinate is used to clip the fake target box to keep the
   *      fake target as big as possible.
   *   -- If the projection of the real target box contains the mouse pointer,
   *      clipping for a given axis is not possible.
   *   -- If both clippings are possible, the clipping more distant from the
   *      mouse pointer is selected to keep bigger fake target area.
   * - Save the created fake target only if it has a big enough area.
   *
   *
   * c) Example
   * <pre>
   *        Input:           Algorithm created box:        Maximum box:
   * +---------------------+ +---------------------+ +---------------------+
   * | B1      |        B2 | | B1               B2 | | B1               B2 |
   * |         |           | |   +-------------+   | |+-------------------+|
   * |---------x-----------| |   |             |   | ||                   ||
   * |         |           | |   |             |   | ||                   ||
   * |         |           | |   |             |   | ||                   ||
   * |         |           | |   |             |   | ||                   ||
   * |         |           | |   |             |   | ||                   ||
   * |         |           | |   +-------------+   | |+-------------------+|
   * | B4      |        B3 | | B4               B3 | | B4               B3 |
   * +---------------------+ +---------------------+ +---------------------+
   * </pre>
   *
   * @param {number} x Cursor position on the x-axis.
   * @param {number} y Cursor position on the y-axis.
   * @return {ActiveDropTarget_} Dummy drop target.
   * @private
   */
  maybeCreateDummyTargetForPosition_(x, y) {
    if (!this.dummyTarget_) {
      this.dummyTarget_ = new ActiveDropTarget_(this.targetBox_.clone());
    }
    var fakeTargetBox = this.dummyTarget_.box_;
  
    // Initialize the fake target box to the bounding box of DnD targets.
    fakeTargetBox.top = this.targetBox_.top;
    fakeTargetBox.right = this.targetBox_.right;
    fakeTargetBox.bottom = this.targetBox_.bottom;
    fakeTargetBox.left = this.targetBox_.left;
  
    // Clip the fake target based on mouse position and DnD target boxes.
    for (var i = 0, target; target = this.targetList_[i]; i++) {
      var box = target.box_;
  
      if (target.scrollableContainer_) {
        // If the target has a scrollable container, use the intersection of that
        // container's box and the target's box.
        var scrollBox = target.scrollableContainer_.box_;
  
        box = new Box(
            Math.max(box.top, scrollBox.top),
            Math.min(box.right, scrollBox.right),
            Math.min(box.bottom, scrollBox.bottom),
            Math.max(box.left, scrollBox.left));
      }
  
      // Calculate clipping coordinates for horizontal and vertical axis.
      // The clipping coordinate is calculated by projecting fake target box,
      // the mouse pointer and DnD target box onto an axis and checking how
      // box projections overlap and if the projected DnD target box contains
      // mouse pointer. The clipping coordinate cannot be computed and is set to
      // a negative value if the projected DnD target contains the mouse pointer.
  
      var horizontalClip = null;  // Assume mouse is above or below the DnD box.
      if (x >= box.right) {       // Mouse is to the right of the DnD box.
        // Clip the fake box only if the DnD box overlaps it.
        horizontalClip =
            box.right > fakeTargetBox.left ? box.right : fakeTargetBox.left;
      } else if (x < box.left) {  // Mouse is to the left of the DnD box.
        // Clip the fake box only if the DnD box overlaps it.
        horizontalClip =
            box.left < fakeTargetBox.right ? box.left : fakeTargetBox.right;
      }
      var verticalClip = null;
      if (y >= box.bottom) {
        verticalClip =
            box.bottom > fakeTargetBox.top ? box.bottom : fakeTargetBox.top;
      } else if (y < box.top) {
        verticalClip =
            box.top < fakeTargetBox.bottom ? box.top : fakeTargetBox.bottom;
      }
  
      // If both clippings are possible, choose one that gives us larger distance
      // to mouse pointer (mark the shorter clipping as impossible, by setting it
      // to null).
      if (horizontalClip !== null && verticalClip !== null) {
        if (Math.abs(horizontalClip - x) > Math.abs(verticalClip - y)) {
          verticalClip = null;
        } else {
          horizontalClip = null;
        }
      }
  
      // Clip none or one of fake target box sides (at most one clipping
      // coordinate can be active).
      if (horizontalClip !== null) {
        if (horizontalClip <= x) {
          fakeTargetBox.left = horizontalClip;
        } else {
          fakeTargetBox.right = horizontalClip;
        }
      } else if (verticalClip !== null) {
        if (verticalClip <= y) {
          fakeTargetBox.top = verticalClip;
        } else {
          fakeTargetBox.bottom = verticalClip;
        }
      }
    }
  
    // Only return the new fake target if it is big enough.
    return (fakeTargetBox.right - fakeTargetBox.left) *
                (fakeTargetBox.bottom - fakeTargetBox.top) >=
            AbstractDragDrop.DUMMY_TARGET_MIN_SIZE_ ?
        this.dummyTarget_ :
        null;
  };

  /**
   * Returns the target for a given cursor position.
   *
   * @param {Coordinate} position Cursor position.
   * @return {ActiveDropTarget_} Target for position or null if no target
   *     was defined for the given position.
   * @private
   */
  getTargetFromPosition_(position) {
    for (var target, i = 0; target = this.targetList_[i]; i++) {
      if (target.box_.contains(position)) {
        if (target.scrollableContainer_) {
          // If we have a scrollable container we will need to make sure
          // we account for clipping of the scroll area
          var box = target.scrollableContainer_.box_;
          if (box.contains(position)) {
            return target;
          }
        } else {
          return target;
        }
      }
    }
  
    return null;
  };

  /**
   * Checks whatever a given point is inside a given box.
   *
   * @param {number} x Cursor position on the x-axis.
   * @param {number} y Cursor position on the y-axis.
   * @param {Box} box Box to check position against.
   * @return {boolean} Whether the given point is inside `box`.
   * @protected
   * @deprecated Use Box.contains.
   */
  isInside(x, y, box) {
    return x >= box.left && x < box.right && y >= box.top && y < box.bottom;
  };

  /**
   * Gets the scroll distance as a coordinate object, using
   * the window of the current drag element's dom.
   * @return {!Coordinate} Object with scroll offsets 'x' and 'y'.
   * @protected
   */
  getScrollPos() {
    return goog_dom.getDomHelper(this.dragEl_).getDocumentScroll();
  };

  /**
   * Get the position of a drag event.
   * @param {DragEvent} event Drag event.
   * @return {!Coordinate} Position of the event.
   * @protected
   */
  getEventPosition(event) {
    var scroll = this.getScrollPos();
    return new Coordinate(
        event.clientX + scroll.x, event.clientY + scroll.y);
  };

  /**
   * @override
   * @protected
   */
  disposeInternal() {
    super.disposeInternal();
    this.removeItems();
  };
}

/**
 * Minimum size (in pixels) for a dummy target. If the box for the target is
 * less than the specified size it's not created.
 * @type {number}
 * @private
 */
AbstractDragDrop.DUMMY_TARGET_MIN_SIZE_ = 10;

/**
 * Constants for event names
 * @const
 */
let EventType = {
  DRAGOVER: 'dragover',
  DRAGOUT: 'dragout',
  DRAG: 'drag',
  DROP: 'drop',
  DRAGSTART: 'dragstart',
  DRAGEND: 'dragend'
};

/**
 * Constant for distance threshold, in pixels, an element has to be moved to
 * initiate a drag operation.
 * @type {number}
 */
AbstractDragDrop.initDragDistanceThreshold = 5;

/**
 * Object representing a drag and drop event.
 *
 *     that caused this dragdrop event.
 * @extends {EventsEvent}
 * @class
 */
class DragDropEvent extends EventsEvent {

  /**
   * Object representing a drag and drop event.
   *
   * @param {string} type Event type.
   * @param {AbstractDragDrop} source Source drag drop object.
   * @param {DragDropItem} sourceItem Source item.
   * @param {AbstractDragDrop=} opt_target Target drag drop object.
   * @param {DragDropItem=} opt_targetItem Target item.
   * @param {Element=} opt_targetElement Target element.
   * @param {number=} opt_clientX X-Position relative to the screen.
   * @param {number=} opt_clientY Y-Position relative to the screen.
   * @param {number=} opt_x X-Position relative to the viewport.
   * @param {number=} opt_y Y-Position relative to the viewport.
   * @param {Object=} opt_subtarget The currently active subtarget.
   * @param {EventsBrowserEvent=} opt_browserEvent The browser event
   *     that caused this dragdrop event.
   */
  constructor(
      type, source, sourceItem, opt_target, opt_targetItem, opt_targetElement,
      opt_clientX, opt_clientY, opt_x, opt_y, opt_subtarget, opt_browserEvent) {
    // TODO(eae): Get rid of all the optional parameters and have the caller set
    // the fields directly instead.
    super(type);
  
    /**
     * Reference to the source AbstractDragDrop object.
     * @type {AbstractDragDrop}
     */
    this.dragSource = source;
  
    /**
     * Reference to the source DragDropItem object.
     * @type {DragDropItem}
     */
    this.dragSourceItem = sourceItem;
  
    /**
     * Reference to the target AbstractDragDrop object.
     * @type {AbstractDragDrop|undefined}
     */
    this.dropTarget = opt_target;
  
    /**
     * Reference to the target DragDropItem object.
     * @type {DragDropItem|undefined}
     */
    this.dropTargetItem = opt_targetItem;
  
    /**
     * The actual element of the drop target that is the target for this event.
     * @type {Element|undefined}
     */
    this.dropTargetElement = opt_targetElement;
  
    /**
     * X-Position relative to the screen.
     * @type {number|undefined}
     */
    this.clientX = opt_clientX;
  
    /**
     * Y-Position relative to the screen.
     * @type {number|undefined}
     */
    this.clientY = opt_clientY;
  
    /**
     * X-Position relative to the viewport.
     * @type {number|undefined}
     */
    this.viewportX = opt_x;
  
    /**
     * Y-Position relative to the viewport.
     * @type {number|undefined}
     */
    this.viewportY = opt_y;
  
    /**
     * The subtarget that is currently active if a subtargeting function
     * is supplied.
     * @type {Object|undefined}
     */
    this.subtarget = opt_subtarget;
  
    /**
     * The browser event that caused this dragdrop event.
     * @const
     */
    this.browserEvent = opt_browserEvent;
  }
}

/**
 * Class representing a source or target element for drag and drop operations.
 *
 *     id, to be used as drag source/drop target.
 * @throws Error If no element argument is provided or if the type is invalid
 * @extends {EventsEventTarget}
 * @class
 */
class DragDropItem extends EventsEventTarget {

  /**
   * Class representing a source or target element for drag and drop operations.
   *
   * @param {Element|string} element Dom Node, or string representation of node
   *     id, to be used as drag source/drop target.
   * @param {Object=} opt_data Data associated with the source/target.
   * @throws Error If no element argument is provided or if the type is invalid
   */
  constructor(element, opt_data) {
    super();
  
    /**
     * Reference to drag source/target element
     * @type {Element}
     */
    this.element = goog_dom.getElement(element);
  
    /**
     * Data associated with element.
     * @type {Object|undefined}
     */
    this.data = opt_data;
  
    /**
     * Drag object the item belongs to.
     * @type {AbstractDragDrop?}
     * @private
     */
    this.parent_ = null;
  
    /**
     * Event handler for listeners on events that can initiate a drag.
     * @type {!EventHandler<!DragDropItem>}
     * @private
     */
    this.eventHandler_ = new EventHandler(this);
    this.registerDisposable(this.eventHandler_);
  
    /**
     * The current element being dragged. This is needed because a DragDropItem
     * can have multiple elements that can be dragged.
     * @private {?Element}
     */
    this.currentDragElement_ = null;
  
    /** @private {?Coordinate} */
    this.startPosition_;
  
    if (!this.element) {
      throw new Error('Invalid argument');
    }
  }

  /**
   * Get the data associated with the source/target.
   * @return {Object|null|undefined} Data associated with the source/target.
   */
  getData() {
    return this.data;
  };

  /**
   * Gets the element that is actually draggable given that the given target was
   * attempted to be dragged. This should be overridden when the element that was
   * given actually contains many items that can be dragged. From the target, you
   * can determine what element should actually be dragged.
   *
   * @param {Element} target The target that was attempted to be dragged.
   * @return {Element} The element that is draggable given the target. If
   *     none are draggable, this will return null.
   */
  getDraggableElement(target) {
    return target;
  };

  /**
   * Gets the element that is currently being dragged.
   *
   * @return {Element} The element that is currently being dragged.
   */
  getCurrentDragElement() {
    return this.currentDragElement_;
  };

  /**
   * Gets all the elements of this item that are potentially draggable/
   *
   * @return {!Array<Element>} The draggable elements.
   */
  getDraggableElements() {
    return [this.element];
  };

  /**
   * Event handler for mouse down.
   *
   * @param {EventsBrowserEvent} event Mouse down event.
   * @private
   */
  mouseDown_(event) {
    if (!event.isMouseActionButton()) {
      return;
    }
  
    // Get the draggable element for the target.
    var element = this.getDraggableElement(/** @type {Element} */ (event.target));
    if (element) {
      this.maybeStartDrag_(event, element);
    }
  };

  /**
   * Sets the dragdrop to which this item belongs.
   * @param {AbstractDragDrop} parent The parent dragdrop.
   */
  setParent(parent) {
    this.parent_ = parent;
  };

  /**
   * Adds mouse move, mouse out and mouse up handlers.
   *
   * @param {EventsBrowserEvent} event Mouse down event.
   * @param {Element} element Element.
   * @private
   */
  maybeStartDrag_(event, element) {
    var eventType = EventsEventType;
    this.eventHandler_
        .listen(element, eventType.MOUSEMOVE, this.mouseMove_, false)
        .listen(element, eventType.MOUSEOUT, this.mouseMove_, false);
  
    // Capture the MOUSEUP on the document to ensure that we cancel the start
    // drag handlers even if the mouse up occurs on some other element. This can
    // happen for instance when the mouse down changes the geometry of the element
    // clicked on (e.g. through changes in activation styling) such that the mouse
    // up occurs outside the original element.
    var doc = goog_dom.getOwnerDocument(element);
    this.eventHandler_.listen(doc, eventType.MOUSEUP, this.mouseUp_, true);
  
    this.currentDragElement_ = element;
  
    this.startPosition_ = new Coordinate(event.clientX, event.clientY);
  };

  /**
   * Event handler for mouse move. Starts drag operation if moved more than the
   * threshold value.
   *
   * @param {EventsBrowserEvent} event Mouse move or mouse out event.
   * @private
   */
  mouseMove_(event) {
    var distance = Math.abs(event.clientX - this.startPosition_.x) +
        Math.abs(event.clientY - this.startPosition_.y);
    // Fire dragStart event if the drag distance exceeds the threshold or if the
    // mouse leave the dragged element.
    // TODO(user): Consider using the Fx_Dragger to track the distance
    // even after the mouse leaves the dragged element.
    var currentDragElement = this.currentDragElement_;
    var distanceAboveThreshold =
        distance > AbstractDragDrop.initDragDistanceThreshold;
    var mouseOutOnDragElement = event.type == EventsEventType.MOUSEOUT &&
        event.target == currentDragElement;
    if (distanceAboveThreshold || mouseOutOnDragElement) {
      this.eventHandler_.removeAll();
      this.parent_.startDrag(event, this);
    }
  
    // Prevent text selection while dragging an element.
    event.preventDefault();
  };

  /**
   * Event handler for mouse up. Removes mouse move, mouse out and mouse up event
   * handlers.
   *
   * @param {EventsBrowserEvent} event Mouse up event.
   * @private
   */
  mouseUp_(event) {
    this.eventHandler_.removeAll();
    delete this.startPosition_;
    this.currentDragElement_ = null;
  };
}

/**
 * Class representing an active drop target
 *
 *     target item.
       associated with position.
 * @class
 * @private
 */
class ActiveDropTarget_ {

  /**
   * Class representing an active drop target
   *
   * @param {Box} box Box describing the position and dimension of the
   *     target item.
   * @param {AbstractDragDrop=} opt_target Target that contains the item
         associated with position.
   * @param {DragDropItem=} opt_item Item associated with position.
   * @param {Element=} opt_element Element of item associated with position.
   * @private
   */
  constructor(box, opt_target, opt_item, opt_element) {
  
    /**
     * Box describing the position and dimension of the target item
     * @type {Box}
     * @private
     */
    this.box_ = box;
  
    /**
     * Target that contains the item associated with position
     * @type {AbstractDragDrop|undefined}
     * @private
     */
    this.target_ = opt_target;
  
    /**
     * Item associated with position
     * @type {DragDropItem|undefined}
     * @private
     */
    this.item_ = opt_item;
  
    /**
     * The draggable element of the item associated with position.
     * @type {Element}
     * @private
     */
    this.element_ = opt_element || null;
  
    /**
     * If this target is in a scrollable container this is it.
     * @private {?ScrollableContainer_}
     */
    this.scrollableContainer_ = null;
  }
}

/**
 * Class for representing a scrollable container
 * @private
 */
class ScrollableContainer_ {

  /**
   * Class for representing a scrollable container
   * @param {Element} element the scrollable element.
   * @private
   */
  constructor(element) {
  
    /**
     * The targets that lie within this container.
     * @type {Array<ActiveDropTarget_>}
     * @private
     */
    this.containedTargets_ = [];
  
    /**
     * The element that is this container
     * @type {Element}
     * @private
     */
    this.element_ = element;
  
    /**
     * The saved scroll left location for calculating deltas.
     * @type {number}
     * @private
     */
    this.savedScrollLeft_ = 0;
  
    /**
     * The saved scroll top location for calculating deltas.
     * @type {number}
     * @private
     */
    this.savedScrollTop_ = 0;
  
    /**
     * The space occupied by the container.
     * @type {?Box}
     * @private
     */
    this.box_ = null;
  }
}

/**
 * Test-only exports.
 * @const
 */
AbstractDragDrop.TEST_ONLY = {
  ActiveDropTarget: ActiveDropTarget_,
};

export {AbstractDragDrop, DragDropEvent, DragDropItem, EventType};