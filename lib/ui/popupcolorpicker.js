import * as asserts from './../asserts/asserts.js';
import * as classlist from './../dom/classlist.js';
import {DomHelper} from './../dom/dom.js';
import {BrowserEvent as EventsBrowserEvent} from './../events/browserevent.js';
import {Event as EventsEvent} from './../events/event.js';
import {EventType as EventsEventType} from './../events/eventtype.js';
import * as google from './../google.js';
import {AnchoredPosition} from './../positioning/anchoredposition.js';
import {Corner} from './../positioning/positioning.js';
import {ColorPicker} from './colorpicker.js';
import {EventType} from './colorpicker.js';
import {Component} from './component.js';
import {Popup as UiPopup} from './popup.js';
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
 * @fileoverview Popup Color Picker implementation.  This is intended to be
 * less general than ColorPicker and presents a default set of colors
 * that CCC apps currently use in their color pickers.
 *
 * @see ../demos/popupcolorpicker.html
 */

/**
 * Popup color picker widget.
 *
 *     for this popup.
 * @extends {Component}
 */
class PopupColorPicker extends Component {

  /**
   * Popup color picker widget.
   *
   * @param {DomHelper=} opt_domHelper Optional DOM helper.
   * @param {ColorPicker=} opt_colorPicker Optional color picker to use
   *     for this popup.
   */
  constructor(opt_domHelper, opt_colorPicker) {
    super(opt_domHelper);
    /**
     * Whether the color picker is initialized.
     * @type {boolean}
     * @private
     */
    this.initialized_ = false;
  
    /**
     * Instance of a color picker control.
     * @type {?ColorPicker}
     * @private
     */
    this.colorPicker_ = null;
  
    /**
     * Instance of UiPopup used to manage the behavior of the color picker.
     * @type {?UiPopup}
     * @private
     */
    this.popup_ = null;
  
    /**
     * Corner of the popup which is pinned to the attaching element.
     * @type {Corner}
     * @private
     */
    this.pinnedCorner_ =
        Corner.TOP_START;
  
    /**
     * Corner of the attaching element where the popup shows.
     * @type {Corner}
     * @private
     */
    this.popupCorner_ =
        Corner.BOTTOM_START;
  
    /**
     * Reference to the element that triggered the last popup.
     * @type {?Element}
     * @private
     */
    this.lastTarget_ = null;
  
    /** @private
      * @type {boolean} */
    this.rememberSelection_ = false;
  
    /**
     * Whether the color picker can move the focus to its key event target when it
     * is shown.  The default is true.  Setting to false can break keyboard
     * navigation, but this is needed for certain scenarios, for example the
     * toolbar menu in trogedit which can't have the selection changed.
     * @type {boolean}
     * @private
     */
    this.allowAutoFocus_ = true;
  
    /**
     * Whether the color picker can accept focus.
     * @type {boolean}
     * @private
     */
    this.focusable_ = true;
  
    /**
     * If true, then the colorpicker will toggle off if it is already visible.
     *
     * @type {boolean}
     * @private
     */
    this.toggleMode_ = true;
  
    /**
     * If true, the colorpicker will appear on hover.
     * @type {boolean}
     * @private
     */
    this.showOnHover_ = false;
  
  
    if (opt_colorPicker) {
      this.colorPicker_ = opt_colorPicker;
    }
  }

  /** @override */
  createDom() {
    super.createDom();
    this.popup_ = new UiPopup(this.getElement());
    this.popup_.setPinnedCorner(this.pinnedCorner_);
    classlist.set(
        asserts.assert(this.getElement()),
        google.getCssName('goog-popupcolorpicker'));
    this.getElement().unselectable = 'on';
  };

  /** @override */
  disposeInternal() {
    super.disposeInternal();
    this.colorPicker_ = null;
    this.lastTarget_ = null;
    this.initialized_ = false;
    if (this.popup_) {
      this.popup_.dispose();
      this.popup_ = null;
    }
  };

  /**
   * ColorPickers cannot be used to decorate pre-existing html, since the
   * structure they build is fairly complicated.
   * @param {Element} element Element to decorate.
   * @return {boolean} Returns always false.
   * @override
   */
  canDecorate(element) {
    return false;
  };

  /**
   * @return {ColorPicker} The color picker instance.
   */
  getColorPicker() {
    return this.colorPicker_;
  };

  /**
   * Returns whether the Popup dismisses itself when the user clicks outside of
   * it.
   * @return {boolean} Whether the Popup autohides on an external click.
   */
  getAutoHide() {
    return !!this.popup_ && this.popup_.getAutoHide();
  };

  /**
   * Sets whether the Popup dismisses itself when the user clicks outside of it -
   * must be called after the Popup has been created (in createDom()),
   * otherwise it does nothing.
   *
   * @param {boolean} autoHide Whether to autohide on an external click.
   */
  setAutoHide(autoHide) {
    if (this.popup_) {
      this.popup_.setAutoHide(autoHide);
    }
  };

  /**
   * Returns the region inside which the Popup dismisses itself when the user
   * clicks, or null if it was not set. Null indicates the entire document is
   * the autohide region.
   * @return {Element} The DOM element for autohide, or null if it hasn't been
   *     set.
   */
  getAutoHideRegion() {
    return this.popup_ && this.popup_.getAutoHideRegion();
  };

  /**
   * Sets the region inside which the Popup dismisses itself when the user
   * clicks - must be called after the Popup has been created (in createDom()),
   * otherwise it does nothing.
   *
   * @param {Element} element The DOM element for autohide.
   */
  setAutoHideRegion(element) {
    if (this.popup_) {
      this.popup_.setAutoHideRegion(element);
    }
  };

  /**
   * Returns the {@link PopupBase} from this picker. Returns null if the
   * popup has not yet been created.
   *
   * NOTE: This should *ONLY* be called from tests. If called before createDom(),
   * this should return null.
   *
   * @return {PopupBase?} The popup or null if it hasn't been created.
   */
  getPopup() {
    return this.popup_;
  };

  /**
   * @return {Element} The last element that triggered the popup.
   */
  getLastTarget() {
    return this.lastTarget_;
  };

  /**
   * Attaches the popup color picker to an element.
   * @param {Element} element The element to attach to.
   */
  attach(element) {
    if (this.showOnHover_) {
      this.getHandler().listen(
          element, EventsEventType.MOUSEOVER, this.show_);
    } else {
      this.getHandler().listen(
          element, EventsEventType.MOUSEDOWN, this.show_);
    }
  };

  /**
   * Detatches the popup color picker from an element.
   * @param {Element} element The element to detach from.
   */
  detach(element) {
    if (this.showOnHover_) {
      this.getHandler().unlisten(
          element, EventsEventType.MOUSEOVER, this.show_);
    } else {
      this.getHandler().unlisten(
          element, EventsEventType.MOUSEOVER, this.show_);
    }
  };

  /**
   * Gets the color that is currently selected in this color picker.
   * @return {?string} The hex string of the color selected, or null if no
   *     color is selected.
   */
  getSelectedColor() {
    return this.colorPicker_.getSelectedColor();
  };

  /**
   * Sets whether the color picker can accept focus.
   * @param {boolean} focusable True iff the color picker can accept focus.
   */
  setFocusable(focusable) {
    this.focusable_ = focusable;
    if (this.colorPicker_) {
      // TODO(user): In next revision sort the behavior of passing state to
      // children correctly
      this.colorPicker_.setFocusable(focusable);
    }
  };

  /**
   * Sets whether the color picker can automatically move focus to its key event
   * target when it is set to visible.
   * @param {boolean} allow Whether to allow auto focus.
   */
  setAllowAutoFocus(allow) {
    this.allowAutoFocus_ = allow;
  };

  /**
   * @return {boolean} Whether the color picker can automatically move focus to
   *     its key event target when it is set to visible.
   */
  getAllowAutoFocus() {
    return this.allowAutoFocus_;
  };

  /**
   * Sets whether the color picker should toggle off if it is already open.
   * @param {boolean} toggle The new toggle mode.
   */
  setToggleMode(toggle) {
    this.toggleMode_ = toggle;
  };

  /**
   * Gets whether the colorpicker is in toggle mode
   * @return {boolean} toggle.
   */
  getToggleMode() {
    return this.toggleMode_;
  };

  /**
   * Sets whether the picker remembers the last selected color between popups.
   *
   * @param {boolean} remember Whether to remember the selection.
   */
  setRememberSelection(remember) {
    this.rememberSelection_ = remember;
  };

  /**
   * @return {boolean} Whether the picker remembers the last selected color
   *     between popups.
   */
  getRememberSelection() {
    return this.rememberSelection_;
  };

  /**
   * Add an array of colors to the colors displayed by the color picker.
   * Does not add duplicated colors.
   * @param {Array<string>} colors The array of colors to be added.
   */
  addColors(colors) {
  
  };

  /**
   * Clear the colors displayed by the color picker.
   */
  clearColors() {
  
  };

  /**
   * Set the pinned corner of the popup.
   * @param {Corner} corner The corner of the popup which is
   *     pinned to the attaching element.
   */
  setPinnedCorner(corner) {
    this.pinnedCorner_ = corner;
    if (this.popup_) {
      this.popup_.setPinnedCorner(this.pinnedCorner_);
    }
  };

  /**
   * Sets which corner of the attaching element this popup shows up.
   * @param {Corner} corner The corner of the attaching element
   *     where to show the popup.
   */
  setPopupCorner(corner) {
    this.popupCorner_ = corner;
  };

  /**
   * Sets whether the popup shows up on hover. By default, appears on click.
   * @param {boolean} showOnHover True if popup should appear on hover.
   */
  setShowOnHover(showOnHover) {
    this.showOnHover_ = showOnHover;
  };

  /**
   * Handles click events on the targets and shows the color picker.
   * @param {EventsBrowserEvent} e The browser event.
   * @private
   */
  show_(e) {
    if (!this.initialized_) {
      this.colorPicker_ = this.colorPicker_ ||
          ColorPicker.createSimpleColorGrid(this.getDomHelper());
      this.colorPicker_.setFocusable(this.focusable_);
      this.addChild(this.colorPicker_, true);
      this.getHandler().listen(
          this.colorPicker_, EventType.CHANGE,
          this.onColorPicked_);
      this.initialized_ = true;
    }
  
    if (this.popup_.isOrWasRecentlyVisible() && this.toggleMode_ &&
        this.lastTarget_ == e.currentTarget) {
      this.popup_.setVisible(false);
      return;
    }
  
    this.lastTarget_ = /** @type {Element} */ (e.currentTarget);
    this.popup_.setPosition(
        new AnchoredPosition(
            this.lastTarget_, this.popupCorner_));
    if (!this.rememberSelection_) {
      this.colorPicker_.setSelectedIndex(-1);
    }
    this.popup_.setVisible(true);
    if (this.allowAutoFocus_) {
      this.colorPicker_.focus();
    }
  };

  /**
   * Handles the color change event.
   * @param {EventsEvent} e The event.
   * @private
   */
  onColorPicked_(e) {
    // When we show the color picker we reset the color, which triggers an event.
    // Here we block that event so that it doesn't dismiss the popup
    // TODO(user): Update the colorpicker to allow selection to be cleared
    if (this.colorPicker_.getSelectedIndex() == -1) {
      e.stopPropagation();
      return;
    }
    this.popup_.setVisible(false);
    if (this.allowAutoFocus_) {
      this.lastTarget_.focus();
    }
  };
}

// google.tagUnsealableClass(PopupColorPicker);

export {PopupColorPicker};