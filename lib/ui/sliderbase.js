import * as aria from './../a11y/aria/aria.js';
import {State} from './../a11y/aria/attributes.js';
import {Role} from './../a11y/aria/roles.js';
import * as googarray from './../array/array.js';
import * as asserts from './../asserts/asserts.js';
import {disposeAll} from './../disposable/disposable.js';
import * as classlist from './../dom/classlist.js';
import * as goog_dom from './../dom/dom.js';
import {DomHelper} from './../dom/dom.js';
import {TagName} from './../dom/tagname.js';
import {Event as EventsEvent} from './../events/event.js';
import * as goog_events from './../events/eventhandler.js';
import {Key} from './../events/eventhandler.js';
import {EventType as EventsEventType} from './../events/eventtype.js';
import {KeyCodes} from './../events/keycodes.js';
import {KeyEvent} from './../events/keyhandler.js';
import {KeyHandler} from './../events/keyhandler.js';
import {EventType as KeyHandlerEventType} from './../events/keyhandler.js';
import {MouseWheelEvent} from './../events/mousewheelhandler.js';
import {MouseWheelHandler} from './../events/mousewheelhandler.js';
import {EventType} from './../events/mousewheelhandler.js';
import * as functions from './../functions/functions.js';
import {AnimationEvent} from './../fx/animation.js';
import {AnimationParallelQueue} from './../fx/animationqueue.js';
import {Slide as DomSlide} from './../fx/dom.js';
import {ResizeWidth} from './../fx/dom.js';
import {ResizeHeight} from './../fx/dom.js';
import {Dragger} from './../fx/dragger.js';
import {DragEvent} from './../fx/dragger.js';
import {EventType as DraggerEventType} from './../fx/dragger.js';
import {Transition} from './../fx/transition.js';
import {EventType as TransitionEventType} from './../fx/transition.js';
import {TransitionBase} from './../fx/transitionbase.js';
import * as google from './../google.js';
import {Coordinate} from './../math/coordinate.js';
import * as math from './../math/math.js';
import * as bidi from './../style/bidi.js';
import * as style from './../style/style.js';
import {Timer} from './../timer/timer.js';
import {Component} from './component.js';
import {EventType as ComponentEventType} from './component.js';
import {RangeModel} from './rangemodel.js';
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
 * @fileoverview Implementation of a basic slider control.
 *
 * Models a control that allows to select a sub-range within a given
 * range of values using two thumbs.  The underlying range is modeled
 * as a range model, where the min thumb points to value of the
 * rangemodel, and the max thumb points to value + extent of the range
 * model.
 *
 * The currently selected range is exposed through methods
 * getValue() and getExtent().
 *
 * The reason for modelling the basic slider state as value + extent is
 * to be able to capture both, a two-thumb slider to select a range, and
 * a single-thumb slider to just select a value (in the latter case, extent
 * is always zero). We provide subclasses (twothumbslider.js and slider.js)
 * that model those special cases of this control.
 *
 * All rendering logic is left out, so that the subclasses can define
 * their own rendering. To do so, the subclasses overwrite:
 * - createDom
 * - decorateInternal
 * - getCssClass
 */

/**
 * This creates a SliderBase object.
 *     slider values to a description of the value.
 * @extends {Component}
 * @abstract
 */
class SliderBase extends Component {

  /**
   * This creates a SliderBase object.
   * @param {DomHelper=} opt_domHelper Optional DOM helper.
   * @param {(function(number):?string)=} opt_labelFn An optional function mapping
   *     slider values to a description of the value.
   */
  constructor(opt_domHelper, opt_labelFn) {
    super(opt_domHelper);
    /**
     * Orientation of the slider.
     * @type {Orientation}
     * @private
     */
    this.orientation_ =
        Orientation.HORIZONTAL;
  
    /** @private
      * @type {AnimationParallelQueue} */
    this.currentAnimation_ = null;
  
    /** @private
      * @type {Timer} */
    this.incTimer_ = null;
  
    /** @private
      * @type {boolean|null} */
    this.incrementing_ = null;
  
    /** @private
      * @type {number|null} */
    this.lastMousePosition_ = null;
  
    /**
     * The minThumb dom-element, pointing to the start of the selected range.
     * @type {HTMLDivElement}
     * @protected
     */
    this.valueThumb = null;
  
    /**
     * The maxThumb dom-element, pointing to the end of the selected range.
     * @type {HTMLDivElement}
     * @protected
     */
    this.extentThumb = null;
  
    /**
     * The dom-element highlighting the selected range.
     * @type {HTMLDivElement}
     * @protected
     */
    this.rangeHighlight = null;
  
    /**
     * The thumb that we should be moving (only relevant when timed move is active).
     * @type {HTMLDivElement}
     * @private
     */
    this.thumbToMove_ = null;
  
    /**
     * The object handling keyboard events.
     * @type {KeyHandler}
     * @private
     */
    this.keyHandler_ = null;
  
    /**
     * The object handling mouse wheel events.
     * @type {MouseWheelHandler}
     * @private
     */
    this.mouseWheelHandler_ = null;
  
    /**
     * The Dragger for dragging the valueThumb.
     * @type {Dragger}
     * @private
     */
    this.valueDragger_ = null;
  
    /**
     * The Dragger for dragging the extentThumb.
     * @type {Dragger}
     * @private
     */
    this.extentDragger_ = null;
  
    /**
     * If we are currently animating the thumb.
     * @private
     * @type {boolean}
     */
    this.isAnimating_ = false;
  
    /**
     * Whether clicking on the backgtround should move directly to that point.
     * @private
     * @type {boolean}
     */
    this.moveToPointEnabled_ = false;
  
    /**
     * The amount to increment/decrement for page up/down as well as when holding
     * down the mouse button on the background.
     * @private
     * @type {number}
     */
    this.blockIncrement_ = 10;
  
    /**
     * The minimal extent. The class will ensure that the extent cannot shrink
     * to a value smaller than minExtent.
     * @private
     * @type {number}
     */
    this.minExtent_ = 0;
  
    /**
     * Whether the slider should handle mouse wheel events.
     * @private
     * @type {boolean}
     */
    this.isHandleMouseWheel_ = true;
  
    /**
     * The time the last mousedown event was received.
     * @private
     * @type {number}
     */
    this.mouseDownTime_ = 0;
  
    /**
     * Whether the slider is enabled or not.
     * @private
     * @type {boolean}
     */
    this.enabled_ = true;
  
    /**
     * Whether the slider implements the changes described in http://b/6324964,
     * making it truly RTL.  This is a temporary flag to allow clients to transition
     * to the new behavior at their convenience.  At some point it will be the
     * default.
     * @type {boolean}
     * @private
     */
    this.flipForRtl_ = false;
  
    /**
     * The amount to increment/decrement for up, down, left and right arrow keys
     * and mouse wheel events.
     * @private
     * @type {number}
     */
    this.unitIncrement_ = 1;
  
  
    /**
     * The factory to use to generate additional animations when animating to a
     * new value.
     * @type {?AnimationFactory}
     * @private
     */
    this.additionalAnimations_ = null;
  
    /**
     * The model for the range of the slider.
     * @protected {!RangeModel}
     */
    this.rangeModel = new RangeModel();
  
    /**
     * A function mapping slider values to text description.
     * @private {function(number):?string}
     */
    this.labelFn_ = opt_labelFn || functions.NULL;
  
    /**
     * Whether to move the focus to the top level element when dragging the
     * slider, default true.
     * @private {boolean}
     */
    this.focusElementOnSliderDrag_ = true;
  
    // Don't use getHandler because it gets cleared in exitDocument.
    goog_events.listen(
        this.rangeModel, ComponentEventType.CHANGE,
        this.handleRangeModelChange, false, this);
  }

  /**
   * Enables/disables true RTL behavior.  This should be called immediately after
   * construction.  This is a temporary flag to allow clients to transition
   * to the new behavior at their convenience.  At some point it will be the
   * default.
   * @param {boolean} flipForRtl True if the slider should be flipped for RTL,
   *     false otherwise.
   */
  enableFlipForRtl(flipForRtl) {
    this.flipForRtl_ = flipForRtl;
  };

  /**
   * Returns the CSS class applied to the slider element for the given
   * orientation. Subclasses must override this method.
   * @param {Orientation} orient The orientation.
   * @return {string} The CSS class applied to slider elements.
   * @protected
   * @abstract
   */
  getCssClass(orient) {}

  /** @override */
  createDom() {
    super.createDom();
    var element = this.getDomHelper().createDom(
        TagName.DIV, this.getCssClass(this.orientation_));
    this.decorateInternal(element);
  };

  /**
   * Subclasses must implement this method and set the valueThumb and
   * extentThumb to non-null values. They can also set the rangeHighlight
   * element if a range highlight is desired. * @protected
   * @abstract
   */
  createThumbs() {}

  /** @override */
  decorateInternal(element) {
    super.decorateInternal(element);
    asserts.assert(element);
    classlist.add(element, this.getCssClass(this.orientation_));
    this.createThumbs();
    this.setAriaRoles();
  };

  /**
   * Called when the DOM for the component is for sure in the document.
   * Subclasses should override this method to set this element's role.
   * @override
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  enterDocument() {
    super.enterDocument();
  
    // Attach the events
    this.valueDragger_ = new Dragger(this.valueThumb);
    this.extentDragger_ = new Dragger(this.extentThumb);
    this.valueDragger_.enableRightPositioningForRtl(this.flipForRtl_);
    this.extentDragger_.enableRightPositioningForRtl(this.flipForRtl_);
  
    // The slider is handling the positioning so make the defaultActions empty.
    this.valueDragger_.defaultAction = this.extentDragger_.defaultAction =
        google.nullFunction;
    this.keyHandler_ = new KeyHandler(this.getElement());
    this.enableEventHandlers_(true);
  
    this.getElement().tabIndex = 0;
    this.updateUi_();
  };

  /**
   * Attaches/Detaches the event handlers on the slider.
   * @param {boolean} enable Whether to attach or detach the event handlers.
   * @private
   */
  enableEventHandlers_(enable) {
    if (enable) {
      this.getHandler()
          .listen(
              this.valueDragger_, DraggerEventType.BEFOREDRAG,
              this.handleBeforeDrag_)
          .listen(
              this.extentDragger_, DraggerEventType.BEFOREDRAG,
              this.handleBeforeDrag_)
          .listen(
              this.valueDragger_,
              [DraggerEventType.START, DraggerEventType.END],
              this.handleThumbDragStartEnd_)
          .listen(
              this.extentDragger_,
              [DraggerEventType.START, DraggerEventType.END],
              this.handleThumbDragStartEnd_)
          .listen(
              this.keyHandler_, KeyHandlerEventType.KEY,
              this.handleKeyDown_)
          .listen(
              this.getElement(), EventsEventType.CLICK,
              this.handleMouseDownAndClick_)
          .listen(
              this.getElement(), EventsEventType.MOUSEDOWN,
              this.handleMouseDownAndClick_);
      if (this.isHandleMouseWheel()) {
        this.enableMouseWheelHandling_(true);
      }
    } else {
      this.getHandler()
          .unlisten(
              this.valueDragger_, DraggerEventType.BEFOREDRAG,
              this.handleBeforeDrag_)
          .unlisten(
              this.extentDragger_, DraggerEventType.BEFOREDRAG,
              this.handleBeforeDrag_)
          .unlisten(
              this.valueDragger_,
              [DraggerEventType.START, DraggerEventType.END],
              this.handleThumbDragStartEnd_)
          .unlisten(
              this.extentDragger_,
              [DraggerEventType.START, DraggerEventType.END],
              this.handleThumbDragStartEnd_)
          .unlisten(
              this.keyHandler_, KeyHandlerEventType.KEY,
              this.handleKeyDown_)
          .unlisten(
              this.getElement(), EventsEventType.CLICK,
              this.handleMouseDownAndClick_)
          .unlisten(
              this.getElement(), EventsEventType.MOUSEDOWN,
              this.handleMouseDownAndClick_);
      if (this.isHandleMouseWheel()) {
        this.enableMouseWheelHandling_(false);
      }
    }
  };

  /** @override */
  exitDocument() {
    super.exitDocument();
    disposeAll(
        this.valueDragger_, this.extentDragger_, this.keyHandler_,
        this.mouseWheelHandler_);
  };

  /**
   * Handler for the before drag event. We use the event properties to determine
   * the new value.
   * @param {DragEvent} e  The drag event used to drag the thumb.
   * @private
   */
  handleBeforeDrag_(e) {
    var thumbToDrag =
        e.dragger == this.valueDragger_ ? this.valueThumb : this.extentThumb;
    var value;
    if (this.orientation_ == Orientation.VERTICAL) {
      var availHeight = this.getElement().clientHeight - thumbToDrag.offsetHeight;
      value = (availHeight - e.top) / availHeight *
              (this.getMaximum() - this.getMinimum()) +
          this.getMinimum();
    } else {
      var availWidth = this.getElement().clientWidth - thumbToDrag.offsetWidth;
      value = (e.left / availWidth) * (this.getMaximum() - this.getMinimum()) +
          this.getMinimum();
    }
    // Bind the value within valid range before calling setThumbPosition_.
    // This is necessary because setThumbPosition_ is a no-op for values outside
    // of the legal range. For drag operations, we want the handle to snap to the
    // last valid value instead of remaining at the previous position.
    if (e.dragger == this.valueDragger_) {
      value = Math.min(
          Math.max(value, this.getMinimum()), this.getValue() + this.getExtent());
    } else {
      value = Math.min(Math.max(value, this.getValue()), this.getMaximum());
    }
    this.setThumbPosition_(thumbToDrag, value);
  };

  /**
   * Handler for the start/end drag event on the thumbs. Adds/removes
   * the "-dragging" CSS classes on the slider and thumb.
   * @param {DragEvent} e The drag event used to drag the thumb.
   * @private
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  handleThumbDragStartEnd_(e) {
    var isDragStart = e.type == DraggerEventType.START;
    classlist.enable(
        asserts.assertElement(this.getElement()),
        SliderBase.SLIDER_DRAGGING_CSS_CLASS_, isDragStart);
    classlist.enable(
        asserts.assertElement(e.target.handle),
        SliderBase.THUMB_DRAGGING_CSS_CLASS_, isDragStart);
    var isValueDragger = e.dragger == this.valueDragger_;
    if (isDragStart) {
      this.dispatchEvent(SliderBase.EventType.DRAG_START);
      this.dispatchEvent(
          isValueDragger ? SliderBase.EventType.DRAG_VALUE_START :
                           SliderBase.EventType.DRAG_EXTENT_START);
    } else {
      this.dispatchEvent(SliderBase.EventType.DRAG_END);
      this.dispatchEvent(
          isValueDragger ? SliderBase.EventType.DRAG_VALUE_END :
                           SliderBase.EventType.DRAG_EXTENT_END);
    }
  };

  /**
   * Event handler for the key down event. This is used to update the value
   * based on the key pressed.
   * @param {KeyEvent} e  The keyboard event object.
   * @private
   */
  handleKeyDown_(e) {
    var handled = true;
    switch (e.keyCode) {
      case KeyCodes.HOME:
        this.animatedSetValue(this.getMinimum());
        break;
      case KeyCodes.END:
        this.animatedSetValue(this.getMaximum());
        break;
      case KeyCodes.PAGE_UP:
        this.moveThumbs(this.getBlockIncrement());
        break;
      case KeyCodes.PAGE_DOWN:
        this.moveThumbs(-this.getBlockIncrement());
        break;
      case KeyCodes.LEFT:
        var sign = this.flipForRtl_ && this.isRightToLeft() ? 1 : -1;
        this.moveThumbs(
            e.shiftKey ? sign * this.getBlockIncrement() :
                         sign * this.getUnitIncrement());
        break;
      case KeyCodes.DOWN:
        this.moveThumbs(
            e.shiftKey ? -this.getBlockIncrement() : -this.getUnitIncrement());
        break;
      case KeyCodes.RIGHT:
        var sign = this.flipForRtl_ && this.isRightToLeft() ? -1 : 1;
        this.moveThumbs(
            e.shiftKey ? sign * this.getBlockIncrement() :
                         sign * this.getUnitIncrement());
        break;
      case KeyCodes.UP:
        this.moveThumbs(
            e.shiftKey ? this.getBlockIncrement() : this.getUnitIncrement());
        break;
  
      default:
        handled = false;
    }
  
    if (handled) {
      e.preventDefault();
    }
  };

  /**
   * Handler for the mouse down event and click event.
   * @param {EventsEvent} e  The mouse event object.
   * @private
   */
  handleMouseDownAndClick_(e) {
    if (this.focusElementOnSliderDrag_ && this.getElement().focus) {
      this.getElement().focus();
    }
  
    // Known Element.
    var target = /** @type {Element} */ (e.target);
  
    if (!goog_dom.contains(this.valueThumb, target) &&
        !goog_dom.contains(this.extentThumb, target)) {
      var isClick = e.type == EventsEventType.CLICK;
      if (isClick && google.now() < this.mouseDownTime_ + this.MOUSE_DOWN_DELAY_) {
        // Ignore a click event that comes a short moment after a mousedown
        // event.  This happens for desktop.  For devices with both a touch
        // screen and a mouse pad we do not get a mousedown event from the mouse
        // pad and do get a click event.
        return;
      }
      if (!isClick) {
        this.mouseDownTime_ = google.now();
      }
  
      if (this.moveToPointEnabled_) {
        // just set the value directly based on the position of the click
        this.animatedSetValue(this.getValueFromMousePosition(e));
      } else {
        // start a timer that incrementally moves the handle
        this.startBlockIncrementing_(e);
      }
    }
  };

  /**
   * Handler for the mouse wheel event.
   * @param {MouseWheelEvent} e  The mouse wheel event object.
   * @private
   */
  handleMouseWheel_(e) {
    // Just move one unit increment per mouse wheel event
    var direction = e.detail > 0 ? -1 : 1;
    this.moveThumbs(direction * this.getUnitIncrement());
    e.preventDefault();
  };

  /**
   * Starts the animation that causes the thumb to increment/decrement by the
   * block increment when the user presses down on the background.
   * @param {EventsEvent} e  The mouse event object.
   * @private
   */
  startBlockIncrementing_(e) {
    this.storeMousePos_(e);
    this.thumbToMove_ = this.getClosestThumb_(this.getValueFromMousePosition(e));
    if (this.orientation_ == Orientation.VERTICAL) {
      this.incrementing_ = this.lastMousePosition_ < this.thumbToMove_.offsetTop;
    } else {
      this.incrementing_ = this.lastMousePosition_ >
          this.getOffsetStart_(this.thumbToMove_) + this.thumbToMove_.offsetWidth;
    }
  
    var doc = goog_dom.getOwnerDocument(this.getElement());
    this.getHandler()
        .listen(
            doc, EventsEventType.MOUSEUP, this.stopBlockIncrementing_, true)
        .listen(
            this.getElement(), EventsEventType.MOUSEMOVE,
            this.storeMousePos_);
  
    if (!this.incTimer_) {
      this.incTimer_ =
          new Timer(SliderBase.MOUSE_DOWN_INCREMENT_INTERVAL_);
      this.getHandler().listen(
          this.incTimer_, Timer.TICK, this.handleTimerTick_);
    }
    this.handleTimerTick_();
    this.incTimer_.start();
  };

  /**
   * Handler for the tick event dispatched by the timer used to update the value
   * in a block increment. This is also called directly from
   * startBlockIncrementing_.
   * @private
   */
  handleTimerTick_() {
    var value;
    if (this.orientation_ == Orientation.VERTICAL) {
      var mouseY = this.lastMousePosition_;
      var thumbY = this.thumbToMove_.offsetTop;
      if (this.incrementing_) {
        if (mouseY < thumbY) {
          value = this.getThumbPosition_(this.thumbToMove_) +
              this.getBlockIncrement();
        }
      } else {
        var thumbH = this.thumbToMove_.offsetHeight;
        if (mouseY > thumbY + thumbH) {
          value = this.getThumbPosition_(this.thumbToMove_) -
              this.getBlockIncrement();
        }
      }
    } else {
      var mouseX = this.lastMousePosition_;
      var thumbX = this.getOffsetStart_(this.thumbToMove_);
      if (this.incrementing_) {
        var thumbW = this.thumbToMove_.offsetWidth;
        if (mouseX > thumbX + thumbW) {
          value = this.getThumbPosition_(this.thumbToMove_) +
              this.getBlockIncrement();
        }
      } else {
        if (mouseX < thumbX) {
          value = this.getThumbPosition_(this.thumbToMove_) -
              this.getBlockIncrement();
        }
      }
    }
  
    if (value !== undefined) {  // not all code paths sets the value variable
      this.setThumbPosition_(this.thumbToMove_, value);
    }
  };

  /**
   * Stops the block incrementing animation and unlistens the necessary
   * event handlers.
   * @private
   */
  stopBlockIncrementing_() {
    if (this.incTimer_) {
      this.incTimer_.stop();
    }
  
    var doc = goog_dom.getOwnerDocument(this.getElement());
    this.getHandler()
        .unlisten(
            doc, EventsEventType.MOUSEUP, this.stopBlockIncrementing_, true)
        .unlisten(
            this.getElement(), EventsEventType.MOUSEMOVE,
            this.storeMousePos_);
  };

  /**
   * Returns the relative mouse position to the slider.
   * @param {EventsEvent} e  The mouse event object.
   * @return {number} The relative mouse position to the slider.
   * @private
   */
  getRelativeMousePos_(e) {
    var coord = style.getRelativePosition(e, this.getElement());
    if (this.orientation_ == Orientation.VERTICAL) {
      return coord.y;
    } else {
      if (this.flipForRtl_ && this.isRightToLeft()) {
        return this.getElement().clientWidth - coord.x;
      } else {
        return coord.x;
      }
    }
  };

  /**
   * Stores the current mouse position so that it can be used in the timer.
   * @param {EventsEvent} e  The mouse event object.
   * @private
   */
  storeMousePos_(e) {
    this.lastMousePosition_ = this.getRelativeMousePos_(e);
  };

  /**
   * Returns the value to use for the current mouse position
   * @param {EventsEvent} e  The mouse event object.
   * @return {number} The value that this mouse position represents.
   */
  getValueFromMousePosition(e) {
    var min = this.getMinimum();
    var max = this.getMaximum();
    if (this.orientation_ == Orientation.VERTICAL) {
      var thumbH = this.valueThumb.offsetHeight;
      var availH = this.getElement().clientHeight - thumbH;
      var y = this.getRelativeMousePos_(e) - thumbH / 2;
      return (max - min) * (availH - y) / availH + min;
    } else {
      var thumbW = this.valueThumb.offsetWidth;
      var availW = this.getElement().clientWidth - thumbW;
      var x = this.getRelativeMousePos_(e) - thumbW / 2;
      return (max - min) * x / availW + min;
    }
  };

  /**
   * @param {HTMLDivElement} thumb  The thumb object.
   * @return {number} The position of the specified thumb.
   * @private
   */
  getThumbPosition_(thumb) {
    if (thumb == this.valueThumb) {
      return this.rangeModel.getValue();
    } else if (thumb == this.extentThumb) {
      return this.rangeModel.getValue() + this.rangeModel.getExtent();
    } else {
      throw new Error('Illegal thumb element. Neither minThumb nor maxThumb');
    }
  };

  /**
   * Returns whether a thumb is currently being dragged with the mouse (or via
   * touch). Note that changing the value with keyboard, mouswheel, or via
   * move-to-point click immediately sends a CHANGE event without going through a
   * dragged state.
   * @return {boolean} Whether a dragger is currently being dragged.
   */
  isDragging() {
    return this.valueDragger_.isDragging() || this.extentDragger_.isDragging();
  };

  /**
   * Moves the thumbs by the specified delta as follows
   * - as long as both thumbs stay within [min,max], both thumbs are moved
   * - once a thumb reaches or exceeds min (or max, respectively), it stays
   * - at min (or max, respectively).
   * In case both thumbs have reached min (or max), no change event will fire.
   * If the specified delta is smaller than the step size, it will be rounded
   * to the step size.
   * @param {number} delta The delta by which to move the selected range.
   * @suppress {strictPrimitiveOperators} Part of the go/strict_warnings_migration
   */
  moveThumbs(delta) {
    // Assume that a small delta is supposed to be at least a step.
    if (Math.abs(delta) < this.getStep()) {
      delta = math.sign(delta) * this.getStep();
    }
    var newMinPos = this.getThumbPosition_(this.valueThumb) + delta;
    var newMaxPos = this.getThumbPosition_(this.extentThumb) + delta;
    // correct min / max positions to be within bounds
    newMinPos = math.clamp(
        newMinPos, this.getMinimum(), this.getMaximum() - this.minExtent_);
    newMaxPos = math.clamp(
        newMaxPos, this.getMinimum() + this.minExtent_, this.getMaximum());
    // Set value and extent atomically
    this.setValueAndExtent(newMinPos, newMaxPos - newMinPos);
  };

  /**
   * Sets the position of the given thumb. The set is ignored and no CHANGE event
   * fires if it violates the constraint minimum <= value (valueThumb position) <=
   * value + extent (extentThumb position) <= maximum.
   *
   * Note: To keep things simple, the setThumbPosition_ function does not have the
   * side-effect of "correcting" value or extent to fit the above constraint as it
   * is the case in the underlying range model. Instead, we simply ignore the
   * call. Callers must make these adjustements explicitly if they wish.
   * @param {Element} thumb The thumb whose position to set.
   * @param {number} position The position to move the thumb to.
   * @private
   */
  setThumbPosition_(thumb, position) {
    // Round first so that all computations and checks are consistent.
    var roundedPosition = this.rangeModel.roundToStepWithMin(position);
    var value =
        thumb == this.valueThumb ? roundedPosition : this.rangeModel.getValue();
    var end = thumb == this.extentThumb ?
        roundedPosition :
        this.rangeModel.getValue() + this.rangeModel.getExtent();
    if (value >= this.getMinimum() && end >= value + this.minExtent_ &&
        this.getMaximum() >= end) {
      this.setValueAndExtent(value, end - value);
    }
  };

  /**
   * Sets the value and extent of the underlying range model. We enforce that
   * getMinimum() <= value <= getMaximum() - extent and
   * getMinExtent <= extent <= getMaximum() - getValue()
   * If this is not satisfied for the given extent, the call is ignored and no
   * CHANGE event fires. This is a utility method to allow setting the thumbs
   * simultaneously and ensuring that only one event fires.
   * @param {number} value The value to which to set the value.
   * @param {number} extent The value to which to set the extent.
   */
  setValueAndExtent(value, extent) {
    if (this.getMinimum() <= value && value <= this.getMaximum() - extent &&
        this.minExtent_ <= extent && extent <= this.getMaximum() - value) {
      if (value == this.getValue() && extent == this.getExtent()) {
        return;
      }
      // because the underlying range model applies adjustements of value
      // and extent to fit within bounds, we need to reset the extent
      // first so these adjustements don't kick in.
      this.rangeModel.setMute(true);
      this.rangeModel.setExtent(0);
      this.rangeModel.setValue(value);
      this.rangeModel.setExtent(extent);
      this.rangeModel.setMute(false);
      this.handleRangeModelChange(null);
    }
  };

  /**
   * @return {number} The minimum value.
   */
  getMinimum() {
    return this.rangeModel.getMinimum();
  };

  /**
   * Sets the minimum number.
   * @param {number} min The minimum value.
   */
  setMinimum(min) {
    this.rangeModel.setMinimum(min);
  };

  /**
   * @return {number} The maximum value.
   */
  getMaximum() {
    return this.rangeModel.getMaximum();
  };

  /**
   * Sets the maximum number.
   * @param {number} max The maximum value.
   */
  setMaximum(max) {
    this.rangeModel.setMaximum(max);
  };

  /**
   * @return {HTMLDivElement} The value thumb element.
   */
  getValueThumb() {
    return this.valueThumb;
  };

  /**
   * @return {HTMLDivElement} The extent thumb element.
   */
  getExtentThumb() {
    return this.extentThumb;
  };

  /**
   * @param {number} position The position to get the closest thumb to.
   * @return {HTMLDivElement} The thumb that is closest to the given position.
   * @private
   */
  getClosestThumb_(position) {
    if (position <=
        (this.rangeModel.getValue() + this.rangeModel.getExtent() / 2)) {
      return this.valueThumb;
    } else {
      return this.extentThumb;
    }
  };

  /**
   * Call back when the internal range model changes. Sub-classes may override
   * and re-enter this method to update a11y state. Consider protected.
   * @param {EventsEvent} e The event object.
   * @protected
   */
  handleRangeModelChange(e) {
    this.updateUi_();
    this.updateAriaStates();
    this.dispatchEvent(ComponentEventType.CHANGE);
  };

  /**
   * This is called when we need to update the size of the thumb. This happens
   * when first created as well as when the value and the orientation changes.
   * @private
   */
  updateUi_() {
    if (this.valueThumb && !this.isAnimating_) {
      var minCoord = this.getThumbCoordinateForValue(
          this.getThumbPosition_(this.valueThumb));
      var maxCoord = this.getThumbCoordinateForValue(
          this.getThumbPosition_(this.extentThumb));
  
      if (this.orientation_ == Orientation.VERTICAL) {
        this.valueThumb.style.top = minCoord.y + 'px';
        this.extentThumb.style.top = maxCoord.y + 'px';
        if (this.rangeHighlight) {
          var highlightPositioning = this.calculateRangeHighlightPositioning_(
              maxCoord.y, minCoord.y, this.valueThumb.offsetHeight);
          this.rangeHighlight.style.top = highlightPositioning.offset + 'px';
          this.rangeHighlight.style.height = highlightPositioning.size + 'px';
        }
      } else {
        var pos = (this.flipForRtl_ && this.isRightToLeft()) ? 'right' : 'left';
        this.valueThumb.style[pos] = minCoord.x + 'px';
        this.extentThumb.style[pos] = maxCoord.x + 'px';
        if (this.rangeHighlight) {
          var highlightPositioning = this.calculateRangeHighlightPositioning_(
              minCoord.x, maxCoord.x, this.valueThumb.offsetWidth);
          this.rangeHighlight.style[pos] = highlightPositioning.offset + 'px';
          this.rangeHighlight.style.width = highlightPositioning.size + 'px';
        }
      }
    }
  };

  /**
   * Calculates the start position (offset) and size of the range highlight, e.g.
   * for a horizontal slider, this will return [left, width] for the highlight.
   * @param {number} firstThumbPos The position of the first thumb along the
   *     slider axis.
   * @param {number} secondThumbPos The position of the second thumb along the
   *     slider axis, must be >= firstThumbPos.
   * @param {number} thumbSize The size of the thumb, along the slider axis.
   * @return {{offset: number, size: number}} The positioning parameters for the
   *     range highlight.
   * @private
   */
  calculateRangeHighlightPositioning_(
      firstThumbPos, secondThumbPos, thumbSize) {
    // Highlight is inset by half the thumb size, from the edges of the thumb.
    var highlightInset = Math.ceil(thumbSize / 2);
    var size = secondThumbPos - firstThumbPos + thumbSize - 2 * highlightInset;
    // Don't return negative size since it causes an error. IE sometimes attempts
    // to position the thumbs while slider size is 0, resulting in size < 0 here.
    return {offset: firstThumbPos + highlightInset, size: Math.max(size, 0)};
  };

  /**
   * Returns the position to move the handle to for a given value
   * @param {number} val  The value to get the coordinate for.
   * @return {!Coordinate} Coordinate with either x or y set.
   */
  getThumbCoordinateForValue(val) {
    var coord = new Coordinate;
    if (this.valueThumb) {
      var min = this.getMinimum();
      var max = this.getMaximum();
  
      // This check ensures the ratio never take NaN value, which is possible when
      // the slider min & max are same numbers (i.e. 1).
      var ratio = (val == min && min == max) ? 0 : (val - min) / (max - min);
  
      if (this.orientation_ == Orientation.VERTICAL) {
        var thumbHeight = this.valueThumb.offsetHeight;
        var h = this.getElement().clientHeight - thumbHeight;
        var bottom = Math.round(ratio * h);
        if (this.moveToPointEnabled_) {
          coord.x = 0;
        } else {
          coord.x = this.getOffsetStart_(this.valueThumb);  // Keep x the same.
        }
        coord.y = h - bottom;
      } else {
        var w = this.getElement().clientWidth - this.valueThumb.offsetWidth;
        var left = Math.round(ratio * w);
        coord.x = left;
        if (this.moveToPointEnabled_) {
          coord.y = 0;
        } else {
          coord.y = this.valueThumb.offsetTop;  // Keep y the same.
        }
      }
    }
    return coord;
  };

  /**
   * Sets the value and starts animating the handle towards that position.
   * @param {number} v Value to set and animate to.
   * @suppress {strictPrimitiveOperators} Part of the go/strict_warnings_migration
   */
  animatedSetValue(v) {
    // the value might be out of bounds
    v = math.clamp(v, this.getMinimum(), this.getMaximum());
  
    if (this.isAnimating_) {
      this.currentAnimation_.stop(true);
      this.currentAnimation_.dispose();
    }
    var animations = new AnimationParallelQueue();
    var end;
  
    var thumb = this.getClosestThumb_(v);
    var previousValue = this.getValue();
    var previousExtent = this.getExtent();
    var previousThumbValue = this.getThumbPosition_(thumb);
    var previousCoord = this.getThumbCoordinateForValue(previousThumbValue);
    var stepSize = this.getStep();
  
    // If the delta is less than a single step, increase it to a step, else the
    // range model will reduce it to zero.
    if (Math.abs(v - previousThumbValue) < stepSize) {
      var delta = v > previousThumbValue ? stepSize : -stepSize;
      v = previousThumbValue + delta;
  
      // The resulting value may be out of bounds, sanitize.
      v = math.clamp(v, this.getMinimum(), this.getMaximum());
    }
  
    this.setThumbPosition_(thumb, v);
    var coord = this.getThumbCoordinateForValue(this.getThumbPosition_(thumb));
  
    if (this.orientation_ == Orientation.VERTICAL) {
      end = [this.getOffsetStart_(thumb), coord.y];
    } else {
      end = [coord.x, thumb.offsetTop];
    }
  
    var slide = new DomSlide(
        thumb, [previousCoord.x, previousCoord.y], end,
        SliderBase.ANIMATION_INTERVAL_);
    slide.enableRightPositioningForRtl(this.flipForRtl_);
    animations.add(slide);
    if (this.rangeHighlight) {
      this.addRangeHighlightAnimations_(
          thumb, previousValue, previousExtent, coord, animations);
    }
  
    // Create additional animations to play if a factory has been set.
    if (this.additionalAnimations_) {
      var additionalAnimations = this.additionalAnimations_.createAnimations(
          previousValue, v, SliderBase.ANIMATION_INTERVAL_);
      googarray.forEach(additionalAnimations, function(animation) {
        animations.add(animation);
      });
    }
  
    this.currentAnimation_ = animations;
    this.getHandler().listen(
        animations, TransitionEventType.END, this.endAnimation_);
  
    this.isAnimating_ = true;
    animations.play(false);
  };

  /**
   * @return {boolean} True if the slider is animating, false otherwise.
   */
  isAnimating() {
    return this.isAnimating_;
  };

  /**
   * Sets the factory that will be used to create additional animations to be
   * played when animating to a new value.  These animations can be for any
   * element and the animations will be played in addition to the default
   * animation(s).  The animations will also be played in the same parallel queue
   * ensuring that all animations are played at the same time.
   * @see #animatedSetValue
   *
   * @param {AnimationFactory} factory The animation factory to
   *     use.  This will not change the default animations played by the slider.
   *     It will only allow for additional animations.
   */
  setAdditionalAnimations(factory) {
    this.additionalAnimations_ = factory;
  };

  /**
   * Adds animations for the range highlight element to the animation queue.
   *
   * @param {Element} thumb The thumb that's moving, must be
   *     either valueThumb or extentThumb.
   * @param {number} previousValue The previous value of the slider.
   * @param {number} previousExtent The previous extent of the
   *     slider.
   * @param {Coordinate} newCoord The new pixel coordinate of the
   *     thumb that's moving.
   * @param {AnimationParallelQueue} animations The animation queue.
   * @private
   */
  addRangeHighlightAnimations_(
      thumb, previousValue, previousExtent, newCoord, animations) {
    var previousMinCoord = this.getThumbCoordinateForValue(previousValue);
    var previousMaxCoord =
        this.getThumbCoordinateForValue(previousValue + previousExtent);
    var minCoord = previousMinCoord;
    var maxCoord = previousMaxCoord;
    if (thumb == this.valueThumb) {
      minCoord = newCoord;
    } else {
      maxCoord = newCoord;
    }
  
    if (this.orientation_ == Orientation.VERTICAL) {
      var previousHighlightPositioning = this.calculateRangeHighlightPositioning_(
          previousMaxCoord.y, previousMinCoord.y, this.valueThumb.offsetHeight);
      var highlightPositioning = this.calculateRangeHighlightPositioning_(
          maxCoord.y, minCoord.y, this.valueThumb.offsetHeight);
      var slide = new DomSlide(
          this.rangeHighlight,
          [
            this.getOffsetStart_(this.rangeHighlight),
            previousHighlightPositioning.offset
          ],
          [
            this.getOffsetStart_(this.rangeHighlight), highlightPositioning.offset
          ],
          SliderBase.ANIMATION_INTERVAL_);
      var resizeHeight = new ResizeHeight(
          this.rangeHighlight, previousHighlightPositioning.size,
          highlightPositioning.size, SliderBase.ANIMATION_INTERVAL_);
      slide.enableRightPositioningForRtl(this.flipForRtl_);
      resizeHeight.enableRightPositioningForRtl(this.flipForRtl_);
      animations.add(slide);
      animations.add(resizeHeight);
    } else {
      var previousHighlightPositioning = this.calculateRangeHighlightPositioning_(
          previousMinCoord.x, previousMaxCoord.x, this.valueThumb.offsetWidth);
      var highlightPositioning = this.calculateRangeHighlightPositioning_(
          minCoord.x, maxCoord.x, this.valueThumb.offsetWidth);
      var slide = new DomSlide(
          this.rangeHighlight,
          [previousHighlightPositioning.offset, this.rangeHighlight.offsetTop],
          [highlightPositioning.offset, this.rangeHighlight.offsetTop],
          SliderBase.ANIMATION_INTERVAL_);
      var resizeWidth = new ResizeWidth(
          this.rangeHighlight, previousHighlightPositioning.size,
          highlightPositioning.size, SliderBase.ANIMATION_INTERVAL_);
      slide.enableRightPositioningForRtl(this.flipForRtl_);
      resizeWidth.enableRightPositioningForRtl(this.flipForRtl_);
      animations.add(slide);
      animations.add(resizeWidth);
    }
  };

  /**
   * Sets the isAnimating_ field to false once the animation is done.
   * @param {AnimationEvent} e Event object passed by the animation
   *     object.
   * @private
   */
  endAnimation_(e) {
    this.isAnimating_ = false;
    this.dispatchEvent(SliderBase.EventType.ANIMATION_END);
  };

  /**
   * Changes the orientation.
   * @param {Orientation} orient The orientation.
   */
  setOrientation(orient) {
    if (this.orientation_ != orient) {
      var oldCss = this.getCssClass(this.orientation_);
      var newCss = this.getCssClass(orient);
      this.orientation_ = orient;
  
      // Update the DOM
      if (this.getElement()) {
        classlist.swap(
            asserts.assert(this.getElement()), oldCss, newCss);
        // we need to reset the left and top, plus range highlight
        var pos = (this.flipForRtl_ && this.isRightToLeft()) ? 'right' : 'left';
        this.valueThumb.style[pos] = this.valueThumb.style.top = '';
        this.extentThumb.style[pos] = this.extentThumb.style.top = '';
        if (this.rangeHighlight) {
          this.rangeHighlight.style[pos] = this.rangeHighlight.style.top = '';
          this.rangeHighlight.style.width = this.rangeHighlight.style.height = '';
        }
        this.updateUi_();
      }
    }
  };

  /**
   * @return {Orientation} the orientation of the slider.
   */
  getOrientation() {
    return this.orientation_;
  };

  /** @override */
  disposeInternal() {
    super.disposeInternal();
    if (this.incTimer_) {
      this.incTimer_.dispose();
    }
    delete this.incTimer_;
    if (this.currentAnimation_) {
      this.currentAnimation_.dispose();
    }
    delete this.currentAnimation_;
    delete this.valueThumb;
    delete this.extentThumb;
    if (this.rangeHighlight) {
      delete this.rangeHighlight;
    }
    this.rangeModel.dispose();
    delete this.rangeModel;
    if (this.keyHandler_) {
      this.keyHandler_.dispose();
      delete this.keyHandler_;
    }
    if (this.mouseWheelHandler_) {
      this.mouseWheelHandler_.dispose();
      delete this.mouseWheelHandler_;
    }
    if (this.valueDragger_) {
      this.valueDragger_.dispose();
      delete this.valueDragger_;
    }
    if (this.extentDragger_) {
      this.extentDragger_.dispose();
      delete this.extentDragger_;
    }
  };

  /**
   * @return {number} The amount to increment/decrement for page up/down as well
   *     as when holding down the mouse button on the background.
   */
  getBlockIncrement() {
    return this.blockIncrement_;
  };

  /**
   * Sets the amount to increment/decrement for page up/down as well as when
   * holding down the mouse button on the background.
   *
   * @param {number} value The value to set the block increment to.
   */
  setBlockIncrement(value) {
    this.blockIncrement_ = value;
  };

  /**
   * Sets the minimal value that the extent may have.
   *
   * @param {number} value The minimal value for the extent.
   */
  setMinExtent(value) {
    this.minExtent_ = value;
  };

  /**
   * @return {number} The amount to increment/decrement for up, down, left and
   *     right arrow keys and mouse wheel events.
   */
  getUnitIncrement() {
    return this.unitIncrement_;
  };

  /**
   * Sets the amount to increment/decrement for up, down, left and right arrow
   * keys and mouse wheel events.
   * @param {number} value  The value to set the unit increment to.
   */
  setUnitIncrement(value) {
    this.unitIncrement_ = value;
  };

  /**
   * @return {?number} The step value used to determine how to round the value.
   */
  getStep() {
    return this.rangeModel.getStep();
  };

  /**
   * Sets the step value. The step value is used to determine how to round the
   * value.
   * @param {?number} step  The step size.
   */
  setStep(step) {
    this.rangeModel.setStep(step);
  };

  /**
   * @return {boolean} Whether clicking on the backgtround should move directly to
   *     that point.
   */
  getMoveToPointEnabled() {
    return this.moveToPointEnabled_;
  };

  /**
   * Sets whether clicking on the background should move directly to that point.
   * @param {boolean} val Whether clicking on the background should move directly
   *     to that point.
   */
  setMoveToPointEnabled(val) {
    this.moveToPointEnabled_ = val;
  };

  /**
   * @return {number} The value of the underlying range model.
   */
  getValue() {
    return this.rangeModel.getValue();
  };

  /**
   * Sets the value of the underlying range model. We enforce that
   * getMinimum() <= value <= getMaximum() - getExtent()
   * If this is not satisifed for the given value, the call is ignored and no
   * CHANGE event fires.
   * @param {number} value The value.
   */
  setValue(value) {
    // Set the position through the thumb method to enforce constraints.
    this.setThumbPosition_(this.valueThumb, value);
  };

  /**
   * @return {number} The value of the extent of the underlying range model.
   */
  getExtent() {
    return this.rangeModel.getExtent();
  };

  /**
   * Sets the extent of the underlying range model. We enforce that
   * getMinExtent() <= extent <= getMaximum() - getValue()
   * If this is not satisifed for the given extent, the call is ignored and no
   * CHANGE event fires.
   * @param {number} extent The value to which to set the extent.
   */
  setExtent(extent) {
    // Set the position through the thumb method to enforce constraints.
    this.setThumbPosition_(
        this.extentThumb, (this.rangeModel.getValue() + extent));
  };

  /**
   * Change the visibility of the slider.
   * You must call this if you had set the slider's value when it was invisible.
   * @param {boolean} visible Whether to show the slider.
   */
  setVisible(visible) {
    style.setElementShown(this.getElement(), visible);
    if (visible) {
      this.updateUi_();
    }
  };

  /**
   * Set a11y roles and state.
   * @protected
   */
  setAriaRoles() {
    var el = this.getElement();
    asserts.assert(
        el, 'The DOM element for the slider base cannot be null.');
    aria.setRole(el, Role.SLIDER);
    this.updateAriaStates();
  };

  /**
   * Set a11y roles and state when values change.
   * @protected
   */
  updateAriaStates() {
    var element = this.getElement();
    if (element) {
      aria.setState(
          element, State.VALUEMIN, this.getMinimum());
      aria.setState(
          element, State.VALUEMAX, this.getMaximum());
      aria.setState(
          element, State.VALUENOW, this.getValue());
      // Passing an empty value to setState will restore the default.
      aria.setState(
          element, State.VALUETEXT, this.getTextValue() || '');
    }
  };

  /**
   * Enables or disables mouse wheel handling for the slider. The mouse wheel
   * handler enables the user to change the value of slider using a mouse wheel.
   *
   * @param {boolean} enable Whether to enable mouse wheel handling.
   */
  setHandleMouseWheel(enable) {
    if (this.isInDocument() && enable != this.isHandleMouseWheel()) {
      this.enableMouseWheelHandling_(enable);
    }
  
    this.isHandleMouseWheel_ = enable;
  };

  /**
   * @return {boolean} Whether the slider handles mousewheel.
   */
  isHandleMouseWheel() {
    return this.isHandleMouseWheel_;
  };

  /**
   * Enable/Disable mouse wheel handling.
   * @param {boolean} enable Whether to enable mouse wheel handling.
   * @private
   */
  enableMouseWheelHandling_(enable) {
    if (enable) {
      if (!this.mouseWheelHandler_) {
        this.mouseWheelHandler_ =
            new MouseWheelHandler(this.getElement());
      }
      this.getHandler().listen(
          this.mouseWheelHandler_,
          EventType.MOUSEWHEEL,
          this.handleMouseWheel_, {passive: false});
    } else {
      this.getHandler().unlisten(
          this.mouseWheelHandler_,
          EventType.MOUSEWHEEL,
          this.handleMouseWheel_, {passive: false});
    }
  };

  /**
   * Enables or disables the slider. A disabled slider will ignore all
   * user-initiated events. Also fires ComponentEventType.ENABLE/DISABLE
   * event as appropriate.
   * @param {boolean} enable Whether to enable the slider or not.
   */
  setEnabled(enable) {
    if (this.enabled_ == enable) {
      return;
    }
  
    var eventType = enable ? ComponentEventType.ENABLE :
                             ComponentEventType.DISABLE;
    if (this.dispatchEvent(eventType)) {
      this.enabled_ = enable;
      this.enableEventHandlers_(enable);
      if (!enable) {
        // Disabling a slider is equivalent to a mouse up event when the block
        // increment (if happening) should be halted and any possible event
        // handlers be appropriately unlistened.
        this.stopBlockIncrementing_();
      }
      classlist.enable(
          asserts.assert(this.getElement()),
          SliderBase.DISABLED_CSS_CLASS_, !enable);
    }
  };

  /**
   * @return {boolean} Whether the slider is enabled or not.
   */
  isEnabled() {
    return this.enabled_;
  };

  /**
   * @param {Element} element An element for which we want offsetLeft.
   * @return {number} Returns the element's offsetLeft, accounting for RTL if
   *     flipForRtl_ is true.
   * @private
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  getOffsetStart_(element) {
    return this.flipForRtl_ ? bidi.getOffsetStart(element) :
                              element.offsetLeft;
  };

  /**
   * @return {?string} The text value for the slider's current value, or null if
   *     unavailable.
   */
  getTextValue() {
    return this.labelFn_(this.getValue());
  };

  /**
   * Sets whether focus will be moved to the top-level element when the slider is
   * dragged.
   * @param {boolean} focusElementOnSliderDrag
   */
  setFocusElementOnSliderDrag(
      focusElementOnSliderDrag) {
    this.focusElementOnSliderDrag_ = focusElementOnSliderDrag;
  };
}

// google.tagUnsealableClass(SliderBase);

/**
 * Event types used to listen for dragging events. Note that extent drag events
 * are also sent for single-thumb sliders, since the one thumb controls both
 * value and extent together; in this case, they can simply be ignored.
 * @enum {string}
 * @suppress {checkTypes}
 */
SliderBase.EventType = {
  /** User started dragging the value thumb */
  DRAG_VALUE_START: goog_events.getUniqueId('dragvaluestart'),
  /** User is done dragging the value thumb */
  DRAG_VALUE_END: goog_events.getUniqueId('dragvalueend'),
  /** User started dragging the extent thumb */
  DRAG_EXTENT_START: goog_events.getUniqueId('dragextentstart'),
  /** User is done dragging the extent thumb */
  DRAG_EXTENT_END: goog_events.getUniqueId('dragextentend'),
  // Note that the following two events are sent twice, once for the value
  // dragger, and once of the extent dragger. If you need to differentiate
  // between the two, or if your code relies on receiving a single event per
  // START/END event, it should listen to one of the VALUE/EXTENT-specific
  // events.
  /** User started dragging a thumb */
  DRAG_START: goog_events.getUniqueId('dragstart'),
  /** User is done dragging a thumb */
  DRAG_END: goog_events.getUniqueId('dragend'),
  /** Animation on the value thumb ends */
  ANIMATION_END: goog_events.getUniqueId('animationend')
};

/**
 * Enum for representing the orientation of the slider.
 *
 * @enum {string}
 */
let Orientation = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal'
};

/**
 * When the user holds down the mouse on the slider background, the closest
 * thumb will move in "lock-step" towards the mouse. This number indicates how
 * long each step should take (in milliseconds).
 * @type {number}
 * @private
 */
SliderBase.MOUSE_DOWN_INCREMENT_INTERVAL_ = 200;

/**
 * How long the animations should take (in milliseconds).
 * @type {number}
 * @private
 */
SliderBase.ANIMATION_INTERVAL_ = 100;

/**
 * The delay after mouseDownTime_ during which a click event is ignored.
 * @private
 * @type {number}
 * @const
 */
SliderBase.prototype.MOUSE_DOWN_DELAY_ = 1000;

// TODO: Make this return a base CSS class (without orientation), in subclasses.

/**
 * CSS class name applied to the slider while its thumbs are being dragged.
 * @type {string}
 * @private
 */
SliderBase.SLIDER_DRAGGING_CSS_CLASS_ =
    google.getCssName('goog-slider-dragging');

/**
 * CSS class name applied to a thumb while it's being dragged.
 * @type {string}
 * @private
 */
SliderBase.THUMB_DRAGGING_CSS_CLASS_ =
    google.getCssName('goog-slider-thumb-dragging');

/**
 * CSS class name applied when the slider is disabled.
 * @type {string}
 * @private
 */
SliderBase.DISABLED_CSS_CLASS_ =
    google.getCssName('goog-slider-disabled');

/**
 * The factory for creating additional animations to be played when animating to
 * a new value.
 * @interface
 */
class AnimationFactory {

  /**
   * The factory for creating additional animations to be played when animating to
   * a new value.
   */
  constructor() {}

  /**
   * Creates an additional animation to play when animating to a new value.
   *
   * @param {number} previousValue The previous value (before animation).
   * @param {number} newValue The new value (after animation).
   * @param {number} interval The animation interval.
   * @return {!Array<!TransitionBase>} The additional animations to play.
   */
  createAnimations(previousValue, newValue, interval) {}
}

export {AnimationFactory, Orientation, SliderBase};