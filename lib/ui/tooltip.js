import * as googarray from './../array/array.js';
import * as asserts from './../asserts/asserts.js';
import {dispose} from './../disposable/disposable.js';
import * as googdom from './../dom/dom.js';
import {DomHelper} from './../dom/dom.js';
import * as safe from './../dom/safe.js';
import {TagName} from './../dom/tagname.js';
import {BrowserEvent as EventsBrowserEvent} from './../events/browserevent.js';
import * as goog_events from './../events/eventhandler.js';
import {EventType as EventsEventType} from './../events/eventtype.js';
import {FocusHandler} from './../events/focushandler.js';
import {EventType} from './../events/focushandler.js';
import * as google from './../google.js';
import {SafeHtml} from './../html/safehtml.js';
import {Box} from './../math/box.js';
import {Coordinate} from './../math/coordinate.js';
import {AbstractPosition} from './../positioning/abstractposition.js';
import {AnchoredPosition} from './../positioning/anchoredposition.js';
import * as goog_positioning from './../positioning/positioning.js';
import {Corner} from './../positioning/positioning.js';
import {Overflow} from './../positioning/positioning.js';
import {OverflowStatus} from './../positioning/positioning.js';
import {ViewportPosition} from './../positioning/viewportposition.js';
import {Set as StructsSet} from './../structs/set.js';
import * as style from './../style/style.js';
import {Timer} from './../timer/timer.js';
import {Popup} from './popup.js';
import {PopupBase} from './popupbase.js';
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
 * @fileoverview Tooltip widget implementation.
 *
 * @see ../demos/tooltip.html
 */

/**
 * Tooltip widget. Can be attached to one or more elements and is shown, with a
 * slight delay, when the the cursor is over the element or the element gains
 * focus.
 *
 *     element reference or string id.
 * @extends {Popup}
 */
class Tooltip extends Popup {

  /**
   * Tooltip widget. Can be attached to one or more elements and is shown, with a
   * slight delay, when the the cursor is over the element or the element gains
   * focus.
   *
   * @param {Element|string=} opt_el Element to display tooltip for, either
   *     element reference or string id.
   * @param {?string=} opt_str Text message to display in tooltip.
   * @param {DomHelper=} opt_domHelper Optional DOM helper.
   */
  constructor(opt_el, opt_str, opt_domHelper) {
    const tempDom = opt_domHelper ||
        (opt_el ? googdom.getDomHelper(googdom.getElement(opt_el)) :
                  googdom.getDomHelper());
  
    const element = tempDom.createDom(TagName.DIV, {
      'style': 'position:absolute;display:none;'
    });
    //EDITED: Added true
    super(element, undefined, true);
    /**
     * Active element reference. Used by the delayed show functionality to keep
     * track of the element the mouse is over or the element with focus.
     * @type {?Element}
     * @private
     */
    this.activeEl_ = null;
  
    /**
     * CSS class name for tooltip.
     *
     * @type {string}
     */
    this.className = google.getCssName('goog-tooltip');
  
    /**
     * Delay in milliseconds since the last mouseover or mousemove before the
     * tooltip is displayed for an element.
     *
     * @type {number}
     * @private
     */
    this.showDelayMs_ = 500;
  
    /**
     * Timer for when to show.
     *
     * @type {number|undefined}
     * @protected
     */
    this.showTimer = undefined;
  
    /**
     * Delay in milliseconds before tooltips are hidden.
     *
     * @type {number}
     * @private
     */
    this.hideDelayMs_ = 0;
  
    /**
     * Timer for when to hide.
     *
     * @type {number|undefined}
     * @protected
     */
    this.hideTimer = undefined;
  
    /**
     * Element that triggered the tooltip.  Note that if a second element triggers
     * this tooltip, anchor becomes that second element, even if its show is
     * cancelled and the original tooltip survives.
     *
     * @type {Element|undefined}
     * @protected
     */
    this.anchor = undefined;
  
    /**
     * Whether the anchor has seen the cursor move or has received focus since the
     * tooltip was last shown. Used to ignore mouse over events triggered by view
     * changes and UI updates.
     * @type {boolean|undefined}
     * @private
     */
    this.seenInteraction_ = undefined;
  
    /**
     * Whether the cursor must have moved before the tooltip will be shown.
     * @type {boolean|undefined}
     * @private
     */
    this.requireInteraction_ = undefined;
  
    /**
     * If this tooltip's element contains another tooltip that becomes active, this
     * property identifies that tooltip so that we can check if this tooltip should
     * not be hidden because the nested tooltip is active.
     * @type {Tooltip}
     * @private
     */
    this.childTooltip_ = null;
  
    /**
     * If this tooltip is inside another tooltip's element, then it may have
     * prevented that tooltip from hiding.  When this tooltip hides, we'll need
     * to check if the parent should be hidden as well.
     * @type {Tooltip}
     * @private
     */
    this.parentTooltip_ = null;
  
  
    /**
     * Dom Helper
     * @type {DomHelper}
     * @private
     */
    this.dom_ = tempDom;
  
    // EDITED: Moved down from PopupBase, because of moved super() call
    this.setElement(element);
  
    /**
     * Cursor position relative to the page.
     * @type {!Coordinate}
     * @protected
     */
    this.cursorPosition = new Coordinate(1, 1);
  
    /**
     * Elements this widget is attached to.
     * @type {StructsSet}
     * @private
     */
    this.elements_ = new StructsSet();
  
    /**
     * Keyboard focus event handler for elements inside the tooltip.
     * @private {?FocusHandler}
     */
    this.tooltipFocusHandler_ = null;
  
    // Attach to element, if specified
    if (opt_el) {
      this.attach(opt_el);
    }
  
    // Set message, if specified.
    if (opt_str != null) {
      this.setText(opt_str);
    }
  }

  /**
   * Returns the dom helper that is being used on this component.
   * @return {DomHelper} The dom helper used on this component.
   */
  getDomHelper() {
    return this.dom_;
  };

  /**
   * @return {Tooltip} Active tooltip in a child element, or null if none.
   * @protected
   */
  getChildTooltip() {
    return this.childTooltip_;
  };

  /**
   * Attach to element. Tooltip will be displayed when the cursor is over the
   * element or when the element has been active for a few milliseconds.
   *
   * @param {Element|string} el Element to display tooltip for, either element
   *                            reference or string id.
   */
  attach(el) {
    el = googdom.getElement(el);
  
    this.elements_.add(el);
    goog_events.listen(
        el, EventsEventType.MOUSEOVER, this.handleMouseOver, false, this);
    goog_events.listen(
        el, EventsEventType.MOUSEOUT, this.handleMouseOutAndBlur, false,
        this);
    goog_events.listen(
        el, EventsEventType.MOUSEMOVE, this.handleMouseMove, false, this);
    goog_events.listen(
        el, EventsEventType.FOCUS, this.handleFocus, false, this);
    goog_events.listen(
        el, EventsEventType.BLUR, this.handleMouseOutAndBlur, false, this);
  };

  /**
   * Detach from element(s).
   *
   * @param {Element|string=} opt_el Element to detach from, either element
   *                                reference or string id. If no element is
   *                                specified all are detached.
   */
  detach(opt_el) {
    if (opt_el) {
      var el = googdom.getElement(opt_el);
      this.detachElement_(el);
      this.elements_.remove(el);
    } else {
      var a = this.elements_.getValues();
      for (var el, i = 0; el = a[i]; i++) {
        this.detachElement_(el);
      }
      this.elements_.clear();
    }
  };

  /**
   * Detach from element.
   *
   * @param {Element} el Element to detach from.
   * @private
   */
  detachElement_(el) {
    goog_events.unlisten(
        el, EventsEventType.MOUSEOVER, this.handleMouseOver, false, this);
    goog_events.unlisten(
        el, EventsEventType.MOUSEOUT, this.handleMouseOutAndBlur, false,
        this);
    goog_events.unlisten(
        el, EventsEventType.MOUSEMOVE, this.handleMouseMove, false, this);
    goog_events.unlisten(
        el, EventsEventType.FOCUS, this.handleFocus, false, this);
    goog_events.unlisten(
        el, EventsEventType.BLUR, this.handleMouseOutAndBlur, false, this);
  };

  /**
   * Sets delay in milliseconds before tooltip is displayed for an element.
   *
   * @param {number} delay The delay in milliseconds.
   */
  setShowDelayMs(delay) {
    this.showDelayMs_ = delay;
  };

  /**
   * @return {number} The delay in milliseconds before tooltip is displayed for an
   *     element.
   */
  getShowDelayMs() {
    return this.showDelayMs_;
  };

  /**
   * Sets delay in milliseconds before tooltip is hidden once the cursor leavs
   * the element.
   *
   * @param {number} delay The delay in milliseconds.
   */
  setHideDelayMs(delay) {
    this.hideDelayMs_ = delay;
  };

  /**
   * @return {number} The delay in milliseconds before tooltip is hidden once the
   *     cursor leaves the element.
   */
  getHideDelayMs() {
    return this.hideDelayMs_;
  };

  /**
   * Sets tooltip message as plain text.
   *
   * @param {string} str Text message to display in tooltip.
   */
  setText(str) {
    googdom.setTextContent(this.getElement(), str);
  };

  /**
   * Sets tooltip message as HTML markup.
   * @param {!SafeHtml} html HTML message to display in tooltip.
   */
  setSafeHtml(html) {
    var element = this.getElement();
    if (element) {
      safe.setInnerHtml(element, html);
    }
  };

  /**
   * Sets tooltip element.
   *
   * @param {Element} el HTML element to use as the tooltip.
   * @override
   */
  setElement(el) {
    var oldElement = this.getElement();
    if (oldElement) {
      googdom.removeNode(oldElement);
    }
    super.setElement(el);
    if (el) {
      var body = this.dom_.getDocument().body;
      body.insertBefore(el, body.lastChild);
      this.registerContentFocusEvents_();
    } else {
      dispose(this.tooltipFocusHandler_);
      this.tooltipFocusHandler_ = null;
    }
  };

  /**
   * Handler for keyboard focus events of elements inside the tooltip's content
   * element. This should only be invoked if this.getElement() != null.
   * @private
   */
  registerContentFocusEvents_() {
    dispose(this.tooltipFocusHandler_);
    this.tooltipFocusHandler_ =
        new FocusHandler(asserts.assert(this.getElement()));
    this.registerDisposable(this.tooltipFocusHandler_);
  
    goog_events.listen(
        this.tooltipFocusHandler_, EventType.FOCUSIN,
        this.clearHideTimer, undefined /* opt_capt */, this);
    goog_events.listen(
        this.tooltipFocusHandler_, EventType.FOCUSOUT,
        this.startHideTimer, undefined /* opt_capt */, this);
  };

  /**
   * @return {string} The tooltip message as plain text.
   */
  getText() {
    return googdom.getTextContent(this.getElement());
  };

  /**
   * @return {string} The tooltip message as HTML as plain string.
   */
  getHtml() {
    return this.getElement().innerHTML;
  };

  /**
   * @return {State} Current state of tooltip.
   */
  getState() {
    return this.showTimer ?
        (this.isVisible() ? State.UPDATING :
                            State.WAITING_TO_SHOW) :
        this.hideTimer ? State.WAITING_TO_HIDE :
                         this.isVisible() ? State.SHOWING :
                                            State.INACTIVE;
  };

  /**
   * Sets whether tooltip requires the mouse to have moved or the anchor receive
   * focus before the tooltip will be shown.
   * @param {boolean} requireInteraction Whether tooltip should require some user
   *     interaction before showing tooltip.
   */
  setRequireInteraction(requireInteraction) {
    this.requireInteraction_ = requireInteraction;
  };

  /**
   * Returns true if the coord is in the tooltip.
   * @param {Coordinate} coord Coordinate being tested.
   * @return {boolean} Whether the coord is in the tooltip.
   */
  isCoordinateInTooltip(coord) {
    // Check if coord is inside the the tooltip
    if (!this.isVisible()) {
      return false;
    }
  
    var offset = style.getPageOffset(this.getElement());
    var size = style.getSize(this.getElement());
    return offset.x <= coord.x && coord.x <= offset.x + size.width &&
        offset.y <= coord.y && coord.y <= offset.y + size.height;
  };

  /**
   * Called before the popup is shown.
   *
   * @return {boolean} Whether tooltip should be shown.
   * @protected
   * @override
   */
  onBeforeShow() {
    if (!PopupBase.prototype.onBeforeShow.call(this)) {
      return false;
    }
  
    // Hide all open tooltips except if this tooltip is triggered by an element
    // inside another tooltip.
    if (this.anchor) {
      for (var tt, i = 0; tt = Tooltip.activeInstances_[i]; i++) {
        if (!googdom.contains(tt.getElement(), this.anchor)) {
          tt.setVisible(false);
        }
      }
    }
    googarray.insert(Tooltip.activeInstances_, this);
  
    var element = this.getElement();
    element.className = this.className;
    this.clearHideTimer();
  
    // Register event handlers for tooltip. Used to prevent the tooltip from
    // closing if the cursor is over the tooltip rather then the element that
    // triggered it.
    goog_events.listen(
        element, EventsEventType.MOUSEOVER, this.handleTooltipMouseOver,
        false, this);
    goog_events.listen(
        element, EventsEventType.MOUSEOUT, this.handleTooltipMouseOut,
        false, this);
  
    this.clearShowTimer();
    return true;
  };

  /** @override */
  onHide() {
    googarray.remove(Tooltip.activeInstances_, this);
  
    // Hide all open tooltips triggered by an element inside this tooltip.
    var element = this.getElement();
    for (var tt, i = 0; tt = Tooltip.activeInstances_[i]; i++) {
      if (tt.anchor && googdom.contains(element, tt.anchor)) {
        tt.setVisible(false);
      }
    }
  
    // If this tooltip is inside another tooltip, start hide timer for that
    // tooltip in case this tooltip was the only reason it was still showing.
    if (this.parentTooltip_) {
      this.parentTooltip_.startHideTimer();
    }
  
    goog_events.unlisten(
        element, EventsEventType.MOUSEOVER, this.handleTooltipMouseOver,
        false, this);
    goog_events.unlisten(
        element, EventsEventType.MOUSEOUT, this.handleTooltipMouseOut,
        false, this);
  
    this.anchor = undefined;
    // If we are still waiting to show a different hovercard, don't abort it
    // because you think you haven't seen a mouse move:
    if (this.getState() == State.INACTIVE) {
      this.seenInteraction_ = false;
    }
  
    PopupBase.prototype.onHide.call(this);
  };

  /**
   * Called by timer from mouse over handler. Shows tooltip if cursor is still
   * over the same element.
   *
   * @param {Element} el Element to show tooltip for.
   * @param {AbstractPosition=} opt_pos Position to display popup
   *     at.
   */
  maybeShow(el, opt_pos) {
    // Assert that the mouse is still over the same element, and that we have not
    // detached from the anchor in the meantime.
    if (this.anchor == el && this.elements_.contains(this.anchor)) {
      if (this.seenInteraction_ || !this.requireInteraction_) {
        // If it is currently showing, then hide it, and abort if it doesn't hide.
        this.setVisible(false);
        if (!this.isVisible()) {
          this.positionAndShow_(el, opt_pos);
        }
      } else {
        this.anchor = undefined;
      }
    }
    this.showTimer = undefined;
  };

  /**
   * @return {StructsSet} Elements this widget is attached to.
   * @protected
   */
  getElements() {
    return this.elements_;
  };

  /**
   * @return {Element} Active element reference.
   */
  getActiveElement() {
    return this.activeEl_;
  };

  /**
   * @param {Element} activeEl Active element reference.
   * @protected
   */
  setActiveElement(activeEl) {
    this.activeEl_ = activeEl;
  };

  /**
   * Shows tooltip for a specific element.
   *
   * @param {Element} el Element to show tooltip for.
   * @param {AbstractPosition=} opt_pos Position to display popup
   *     at.
   */
  showForElement(el, opt_pos) {
    this.attach(el);
    this.activeEl_ = el;
  
    this.positionAndShow_(el, opt_pos);
  };

  /**
   * Sets tooltip position and shows it.
   *
   * @param {Element} el Element to show tooltip for.
   * @param {AbstractPosition=} opt_pos Position to display popup
   *     at.
   * @private
   */
  positionAndShow_(el, opt_pos) {
    this.anchor = el;
    this.setPosition(
        opt_pos ||
        this.getPositioningStrategy(Tooltip.Activation.CURSOR));
    this.setVisible(true);
  };

  /**
   * Called by timer from mouse out handler. Hides tooltip if cursor is still
   * outside element and tooltip, or if a child of tooltip has the focus.
   * @param {?Element|undefined} el Tooltip's anchor when hide timer was started.
   */
  maybeHide(el) {
    this.hideTimer = undefined;
    if (el == this.anchor) {
      var dom = this.getDomHelper();
      var focusedEl = dom.getActiveElement();
      // If the tooltip content is focused, then don't hide the tooltip.
      var tooltipContentFocused = focusedEl && this.getElement() &&
          dom.contains(this.getElement(), focusedEl);
      if ((this.activeEl_ == null ||
           (this.activeEl_ != this.getElement() &&
            !this.elements_.contains(this.activeEl_))) &&
          !tooltipContentFocused && !this.hasActiveChild()) {
        this.setVisible(false);
      }
    }
  };

  /**
   * @return {boolean} Whether tooltip element contains an active child tooltip,
   *     and should thus not be hidden.  When the child tooltip is hidden, it
   *     will check if the parent should be hidden, too.
   * @protected
   */
  hasActiveChild() {
    return !!(this.childTooltip_ && this.childTooltip_.activeEl_);
  };

  /**
   * Saves the current mouse cursor position to `this.cursorPosition`.
   * @param {EventsBrowserEvent} event MOUSEOVER or MOUSEMOVE event.
   * @private
   */
  saveCursorPosition_(event) {
    var scroll = this.dom_.getDocumentScroll();
    this.cursorPosition.x = event.clientX + scroll.x;
    this.cursorPosition.y = event.clientY + scroll.y;
  };

  /**
   * Handler for mouse over events.
   *
   * @param {EventsBrowserEvent} event Event object.
   * @protected
   */
  handleMouseOver(event) {
    var el = this.getAnchorFromElement(/** @type {Element} */ (event.target));
    this.activeEl_ = el;
    this.clearHideTimer();
    if (el != this.anchor) {
      this.anchor = el;
      this.startShowTimer(el);
      this.checkForParentTooltip_();
      this.saveCursorPosition_(event);
    }
  };

  /**
   * Find anchor containing the given element, if any.
   *
   * @param {Element} el Element that triggered event.
   * @return {Element} Element in elements_ array that contains given element,
   *     or null if not found.
   * @protected
   */
  getAnchorFromElement(el) {
    // FireFox has a bug where mouse events relating to <input> elements are
    // sometimes duplicated (often in FF2, rarely in FF3): once for the
    // <input> element and once for a magic hidden <div> element.  JavaScript
    // code does not have sufficient permissions to read properties on that
    // magic element and thus will throw an error in this call to
    // getAnchorFromElement_().  In that case we swallow the error.
    // See https://bugzilla.mozilla.org/show_bug.cgi?id=330961
    try {
      while (el && !this.elements_.contains(el)) {
        el = /** @type {Element} */ (el.parentNode);
      }
      return el;
    } catch (e) {
      return null;
    }
  };

  /**
   * Handler for mouse move events.
   *
   * @param {EventsBrowserEvent} event MOUSEMOVE event.
   * @protected
   */
  handleMouseMove(event) {
    this.saveCursorPosition_(event);
    this.seenInteraction_ = true;
  };

  /**
   * Handler for focus events.
   *
   * @param {EventsBrowserEvent} event Event object.
   * @protected
   */
  handleFocus(event) {
    var el = this.getAnchorFromElement(/** @type {Element} */ (event.target));
    this.activeEl_ = el;
    this.seenInteraction_ = true;
  
    if (this.anchor != el) {
      this.anchor = el;
      var pos = this.getPositioningStrategy(Tooltip.Activation.FOCUS);
      this.clearHideTimer();
      this.startShowTimer(el, pos);
  
      this.checkForParentTooltip_();
    }
  };

  /**
   * Return a Position instance for repositioning the tooltip. Override in
   * subclasses to customize the way repositioning is done.
   *
   * @param {Tooltip.Activation} activationType Information about what
   *    kind of event caused the popup to be shown.
   * @return {!AbstractPosition} The position object used
   *    to position the tooltip.
   * @protected
   */
  getPositioningStrategy(activationType) {
    if (activationType == Tooltip.Activation.CURSOR) {
      var coord = this.cursorPosition.clone();
      return new CursorTooltipPosition(coord);
    }
    return new ElementTooltipPosition(this.activeEl_);
  };

  /**
   * Looks for an active tooltip whose element contains this tooltip's anchor.
   * This allows us to prevent hides until they are really necessary.
   *
   * @private
   */
  checkForParentTooltip_() {
    if (this.anchor) {
      for (var tt, i = 0; tt = Tooltip.activeInstances_[i]; i++) {
        if (googdom.contains(tt.getElement(), this.anchor)) {
          tt.childTooltip_ = this;
          this.parentTooltip_ = tt;
        }
      }
    }
  };

  /**
   * Handler for mouse out and blur events.
   *
   * @param {EventsBrowserEvent} event Event object.
   * @protected
   */
  handleMouseOutAndBlur(event) {
    var el = this.getAnchorFromElement(/** @type {Element} */ (event.target));
    var elTo = this.getAnchorFromElement(
        /** @type {Element} */ (event.relatedTarget));
    if (el == elTo) {
      // We haven't really left the anchor, just moved from one child to
      // another.
      return;
    }
  
    if (el == this.activeEl_) {
      this.activeEl_ = null;
    }
  
    this.clearShowTimer();
    this.seenInteraction_ = false;
    if (this.isVisible() &&
        (!event.relatedTarget ||
         !googdom.contains(this.getElement(), event.relatedTarget))) {
      this.startHideTimer();
    } else {
      this.anchor = undefined;
    }
  };

  /**
   * Handler for mouse over events for the tooltip element.
   *
   * @param {EventsBrowserEvent} event Event object.
   * @protected
   */
  handleTooltipMouseOver(event) {
    var element = this.getElement();
    if (this.activeEl_ != element) {
      this.clearHideTimer();
      this.activeEl_ = element;
    }
  };

  /**
   * Handler for mouse out events for the tooltip element.
   *
   * @param {EventsBrowserEvent} event Event object.
   * @protected
   */
  handleTooltipMouseOut(event) {
    var element = this.getElement();
    if (this.activeEl_ == element &&
        (!event.relatedTarget ||
         !googdom.contains(element, event.relatedTarget))) {
      this.activeEl_ = null;
      this.startHideTimer();
    }
  };

  /**
   * Helper method, starts timer that calls maybeShow. Parameters are passed to
   * the maybeShow method.
   *
   * @param {Element} el Element to show tooltip for.
   * @param {AbstractPosition=} opt_pos Position to display popup
   *     at.
   * @protected
   */
  startShowTimer(el, opt_pos) {
    if (!this.showTimer) {
      this.showTimer = Timer.callOnce(
          google.bind(this.maybeShow, this, el, opt_pos), this.showDelayMs_);
    }
  };

  /**
   * Helper method called to clear the show timer.
   *
   * @protected
   */
  clearShowTimer() {
    if (this.showTimer) {
      Timer.clear(this.showTimer);
      this.showTimer = undefined;
    }
  };

  /**
   * Helper method called to start the close timer.
   * @protected
   */
  startHideTimer() {
    if (this.getState() == State.SHOWING) {
      this.hideTimer = Timer.callOnce(
          google.bind(this.maybeHide, this, this.anchor), this.getHideDelayMs());
    }
  };

  /**
   * Helper method called to clear the close timer.
   * @protected
   */
  clearHideTimer() {
    if (this.hideTimer) {
      Timer.clear(this.hideTimer);
      this.hideTimer = undefined;
    }
  };

  /** @override */
  disposeInternal() {
    this.setVisible(false);
    this.clearShowTimer();
    this.detach();
    if (this.getElement()) {
      googdom.removeNode(this.getElement());
    }
    this.activeEl_ = null;
    delete this.dom_;
    super.disposeInternal();
  };
}

// google.tagUnsealableClass(Tooltip);

/**
 * List of active (open) tooltip widgets. Used to prevent multiple tooltips
 * from appearing at once.
 *
 * @type {!Array<Tooltip>}
 * @private
 */
Tooltip.activeInstances_ = [];

/**
 * Possible states for the tooltip to be in.
 * @enum {number}
 */
let State = {
  INACTIVE: 0,
  WAITING_TO_SHOW: 1,
  SHOWING: 2,
  WAITING_TO_HIDE: 3,
  UPDATING: 4  // waiting to show new hovercard while old one still showing.
};

/**
 * Popup activation types. Used to select a positioning strategy.
 * @enum {number}
 */
Tooltip.Activation = {
  CURSOR: 0,
  FOCUS: 1
};

/**
 * Popup position implementation that positions the popup (the tooltip in this
 * case) based on the cursor position. It's positioned below the cursor to the
 * right if there's enough room to fit all of it inside the Viewport. Otherwise
 * it's displayed as far right as possible either above or below the element.
 *
 * Used to position tooltips triggered by the cursor.
 *
 * @extends {ViewportPosition}
 * @final
 */
class CursorTooltipPosition extends ViewportPosition {

  /**
   * Popup position implementation that positions the popup (the tooltip in this
   * case) based on the cursor position. It's positioned below the cursor to the
   * right if there's enough room to fit all of it inside the Viewport. Otherwise
   * it's displayed as far right as possible either above or below the element.
   *
   * Used to position tooltips triggered by the cursor.
   *
   * @param {number|!Coordinate} arg1 Left position or coordinate.
   * @param {number=} opt_arg2 Top position.
   */
  constructor(arg1, opt_arg2) {
    super(arg1, opt_arg2);
  }

  /**
   * Repositions the popup based on cursor position.
   *
   * @param {Element} element The DOM element of the popup.
   * @param {Corner} popupCorner The corner of the popup element
   *     that that should be positioned adjacent to the anchorElement.
   * @param {Box=} opt_margin A margin specified in pixels.
   * @override
   */
  reposition(
      element, popupCorner, opt_margin) {
    var viewportElt = style.getClientViewportElement(element);
    var viewport = style.getVisibleRectForElement(viewportElt);
    var margin = opt_margin ? new Box(
                                  opt_margin.top + 10, opt_margin.right,
                                  opt_margin.bottom, opt_margin.left + 10) :
                              new Box(10, 0, 0, 10);
  
    if (goog_positioning.positionAtCoordinate(
            this.coordinate, element, Corner.TOP_START, margin,
            viewport,
            Overflow.ADJUST_X |
                Overflow.FAIL_Y) &
        OverflowStatus.FAILED) {
      goog_positioning.positionAtCoordinate(
          this.coordinate, element, Corner.TOP_START, margin,
          viewport,
          Overflow.ADJUST_X |
              Overflow.ADJUST_Y);
    }
  };
}

/**
 * Popup position implementation that positions the popup (the tooltip in this
 * case) based on the element position. It's positioned below the element to the
 * right if there's enough room to fit all of it inside the Viewport. Otherwise
 * it's displayed as far right as possible either above or below the element.
 *
 * Used to position tooltips triggered by focus changes.
 *
 * @extends {AnchoredPosition}
 */
class ElementTooltipPosition extends AnchoredPosition {

  /**
   * Popup position implementation that positions the popup (the tooltip in this
   * case) based on the element position. It's positioned below the element to the
   * right if there's enough room to fit all of it inside the Viewport. Otherwise
   * it's displayed as far right as possible either above or below the element.
   *
   * Used to position tooltips triggered by focus changes.
   *
   * @param {Element} element The element to anchor the popup at.
   */
  constructor(element) {
    super(element, Corner.BOTTOM_RIGHT);
  }

  /**
   * Repositions the popup based on element position.
   *
   * @param {Element} element The DOM element of the popup.
   * @param {Corner} popupCorner The corner of the popup element
   *     that should be positioned adjacent to the anchorElement.
   * @param {Box=} opt_margin A margin specified in pixels.
   * @override
   */
  reposition(
      element, popupCorner, opt_margin) {
    var offset = new Coordinate(10, 0);
  
    if (goog_positioning.positionAtAnchor(
            this.element, this.corner, element, popupCorner, offset, opt_margin,
            Overflow.ADJUST_X |
                Overflow.FAIL_Y) &
        OverflowStatus.FAILED) {
      goog_positioning.positionAtAnchor(
          this.element, Corner.TOP_RIGHT, element,
          Corner.BOTTOM_LEFT, offset, opt_margin,
          Overflow.ADJUST_X |
              Overflow.ADJUST_Y);
    }
  };
}

export {CursorTooltipPosition, ElementTooltipPosition, State, Tooltip};