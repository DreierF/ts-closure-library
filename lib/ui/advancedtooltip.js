import {DomHelper} from './../dom/dom.js';
import {BrowserEvent as EventsBrowserEvent} from './../events/browserevent.js';
import * as goog_events from './../events/eventhandler.js';
import {EventType} from './../events/eventtype.js';
import {Box} from './../math/box.js';
import {Coordinate} from './../math/coordinate.js';
import * as style from './../style/style.js';
import * as userAgent from './../useragent/useragent.js';
import {Tooltip} from './tooltip.js';
import {State} from './tooltip.js';
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
 * @fileoverview Advanced tooltip widget implementation.
 *
 * @see ../demos/advancedtooltip.html
 */

/**
 * Advanced tooltip widget with cursor tracking abilities. Works like a regular
 * tooltip but can track the cursor position and direction to determine if the
 * tooltip should be dismissed or remain open.
 *
 *     element reference or string id.
 * @extends {Tooltip}
 */
class AdvancedTooltip extends Tooltip {

  /**
   * Advanced tooltip widget with cursor tracking abilities. Works like a regular
   * tooltip but can track the cursor position and direction to determine if the
   * tooltip should be dismissed or remain open.
   *
   * @param {Element|string=} opt_el Element to display tooltip for, either
   *     element reference or string id.
   * @param {?string=} opt_str Text message to display in tooltip.
   * @param {DomHelper=} opt_domHelper Optional DOM helper.
   */
  constructor(opt_el, opt_str, opt_domHelper) {
    super(opt_el, opt_str, opt_domHelper);
    /**
     * Whether to track the cursor and thereby close the tooltip if it moves away
     * from the tooltip and keep it open if it moves towards it.
     *
     * @type {boolean}
     * @private
     */
    this.cursorTracking_ = false;
  
    /**
     * Delay in milliseconds before tooltips are hidden if cursor tracking is
     * enabled and the cursor is moving away from the tooltip.
     *
     * @type {number}
     * @private
     */
    this.cursorTrackingHideDelayMs_ = 100;
  
    /**
     * Box object representing a margin around the tooltip where the cursor is
     * allowed without dismissing the tooltip.
     *
     * @type {Box}
     * @private
     */
    this.hotSpotPadding_ = null;
  
    /**
     * Bounding box.
     *
     * @type {Box}
     * @private
     */
    this.boundingBox_ = null;
  
    /**
     * Anchor bounding box.
     *
     * @type {Box}
     * @private
     */
    this.anchorBox_ = null;
  
    /**
     * Whether the cursor tracking is active.
     *
     * @type {boolean}
     * @private
     */
    this.tracking_ = false;
  
  }

  /**
   * Sets margin around the tooltip where the cursor is allowed without dismissing
   * the tooltip.
   *
   * @param {Box=} opt_box The margin around the tooltip.
   */
  setHotSpotPadding(opt_box) {
    this.hotSpotPadding_ = opt_box || null;
  };

  /**
   * @return {Box} box The margin around the tooltip where the cursor is
   *     allowed without dismissing the tooltip.
   */
  getHotSpotPadding() {
    return this.hotSpotPadding_;
  };

  /**
   * Sets whether to track the cursor and thereby close the tooltip if it moves
   * away from the tooltip and keep it open if it moves towards it.
   *
   * @param {boolean} b Whether to track the cursor.
   */
  setCursorTracking(b) {
    this.cursorTracking_ = b;
  };

  /**
   * @return {boolean} Whether to track the cursor and thereby close the tooltip
   *     if it moves away from the tooltip and keep it open if it moves towards
   *     it.
   */
  getCursorTracking() {
    return this.cursorTracking_;
  };

  /**
   * Sets delay in milliseconds before tooltips are hidden if cursor tracking is
   * enabled and the cursor is moving away from the tooltip.
   *
   * @param {number} delay The delay in milliseconds.
   */
  setCursorTrackingHideDelayMs(
      delay) {
    this.cursorTrackingHideDelayMs_ = delay;
  };

  /**
   * @return {number} The delay in milliseconds before tooltips are hidden if
   *     cursor tracking is enabled and the cursor is moving away from the
   *     tooltip.
   */
  getCursorTrackingHideDelayMs() {
    return this.cursorTrackingHideDelayMs_;
  };

  /**
   * Called after the popup is shown.
   * @protected
   * @override
   */
  onShow() {
    super.onShow();
  
    this.boundingBox_ = style.getBounds(this.getElement()).toBox();
    if (this.anchor) {
      this.anchorBox_ = style.getBounds(this.anchor).toBox();
    }
  
    this.tracking_ = this.cursorTracking_;
    goog_events.listen(
        this.getDomHelper().getDocument(), EventType.MOUSEMOVE,
        this.handleMouseMove, false, this);
  };

  /**
   * Called after the popup is hidden.
   * @protected
   * @override
   */
  onHide() {
    goog_events.unlisten(
        this.getDomHelper().getDocument(), EventType.MOUSEMOVE,
        this.handleMouseMove, false, this);
  
    this.boundingBox_ = null;
    this.anchorBox_ = null;
    this.tracking_ = false;
  
    super.onHide();
  };

  /**
   * Returns true if the mouse is in the tooltip.
   * @return {boolean} True if the mouse is in the tooltip.
   */
  isMouseInTooltip() {
    return this.isCoordinateInTooltip(this.cursorPosition);
  };

  /**
   * Checks whether the supplied coordinate is inside the tooltip, including
   * padding if any.
   * @param {Coordinate} coord Coordinate being tested.
   * @return {boolean} Whether the coord is in the tooltip.
   * @override
   */
  isCoordinateInTooltip(coord) {
    // Check if coord is inside the bounding box of the tooltip
    if (this.hotSpotPadding_) {
      var offset = style.getPageOffset(this.getElement());
      var size = style.getSize(this.getElement());
      return offset.x - this.hotSpotPadding_.left <= coord.x &&
          coord.x <= offset.x + size.width + this.hotSpotPadding_.right &&
          offset.y - this.hotSpotPadding_.top <= coord.y &&
          coord.y <= offset.y + size.height + this.hotSpotPadding_.bottom;
    }
  
    return super.isCoordinateInTooltip(coord);
  };

  /**
   * Checks if supplied coordinate is in the tooltip, its triggering anchor, or
   * a tooltip that has been triggered by a child of this tooltip.
   * Called from handleMouseMove to determine if hide timer should be started,
   * and from maybeHide to determine if tooltip should be hidden.
   * @param {Coordinate} coord Coordinate being tested.
   * @return {boolean} Whether coordinate is in the anchor, the tooltip, or any
   *     tooltip whose anchor is a child of this tooltip.
   * @private
   */
  isCoordinateActive_(coord) {
    if ((this.anchorBox_ && this.anchorBox_.contains(coord)) ||
        this.isCoordinateInTooltip(coord)) {
      return true;
    }
  
    // Check if mouse might be in active child element.
    var childTooltip = this.getChildTooltip();
    return !!childTooltip && childTooltip.isCoordinateInTooltip(coord);
  };

  /**
   * Called by timer from mouse out handler. Hides tooltip if cursor is still
   * outside element and tooltip.
   * @param {?Element|undefined} el Anchor when hide timer was started.
   * @override
   */
  maybeHide(el) {
    this.hideTimer = undefined;
    if (el == this.anchor) {
      // Check if cursor is inside the bounding box of the tooltip or the element
      // that triggered it, or if tooltip is active (possibly due to receiving
      // the focus), or if there is a nested tooltip being shown.
      if (!this.isCoordinateActive_(this.cursorPosition) &&
          !this.getActiveElement() && !this.hasActiveChild()) {
        // Under certain circumstances gecko fires ghost mouse events with the
        // coordinates 0, 0 regardless of the cursors position.
        if (userAgent.GECKO && this.cursorPosition.x == 0 &&
            this.cursorPosition.y == 0) {
          return;
        }
        this.setVisible(false);
      }
    }
  };

  /**
   * Handler for mouse move events.
   *
   * @param {EventsBrowserEvent} event Event object.
   * @protected
   * @override
   */
  handleMouseMove(event) {
    var startTimer = this.isVisible();
    if (this.boundingBox_) {
      var scroll = this.getDomHelper().getDocumentScroll();
      var c = new Coordinate(
          event.clientX + scroll.x, event.clientY + scroll.y);
      if (this.isCoordinateActive_(c)) {
        startTimer = false;
      } else if (this.tracking_) {
        var prevDist =
            Box.distance(this.boundingBox_, this.cursorPosition);
        var currDist = Box.distance(this.boundingBox_, c);
        startTimer = currDist >= prevDist;
      }
    }
  
    if (startTimer) {
      this.startHideTimer();
  
      // Even though the mouse coordinate is not on the tooltip (or nested child),
      // they may have an active element because of a focus event.  Don't let
      // that prevent us from taking down the tooltip(s) on this mouse move.
      this.setActiveElement(null);
      var childTooltip = this.getChildTooltip();
      if (childTooltip) {
        childTooltip.setActiveElement(null);
      }
    } else if (this.getState() == State.WAITING_TO_HIDE) {
      this.clearHideTimer();
    }
  
    super.handleMouseMove(event);
  };

  /**
   * Handler for mouse over events for the tooltip element.
   *
   * @param {EventsBrowserEvent} event Event object.
   * @protected
   * @override
   */
  handleTooltipMouseOver(event) {
    if (this.getActiveElement() != this.getElement()) {
      this.tracking_ = false;
      this.setActiveElement(this.getElement());
    }
  };

  /**
   * Override hide delay with cursor tracking hide delay while tracking.
   * @return {number} Hide delay to use.
   * @override
   */
  getHideDelayMs() {
    return this.tracking_ ? this.cursorTrackingHideDelayMs_ :
                            super.getHideDelayMs();
  };

  /**
   * Forces the recalculation of the hotspot on the next mouse over event.
   * @deprecated Not ever necessary to call this function. Hot spot is calculated
   *     as necessary.
   */
  resetHotSpot() {}
}

// google.tagUnsealableClass(AdvancedTooltip);

export {AdvancedTooltip};