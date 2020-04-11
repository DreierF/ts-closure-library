import * as googarray from './../array/array.js';
import {dispose} from './../disposable/disposable.js';
import * as dom from './../dom/dom.js';
import {TagName} from './../dom/tagname.js';
import {BrowserEvent as EventsBrowserEvent} from './../events/browserevent.js';
import * as events from './../events/eventhandler.js';
import {Key} from './../events/eventhandler.js';
import {EventTarget as EventsEventTarget} from './../events/eventhandler.js';
import {EventHandler} from './../events/eventhandler.js';
import {EventType as EventsEventType} from './../events/eventtype.js';
import {KeyCodes} from './../events/keycodes.js';
import {Transition} from './../fx/transition.js';
import {EventType as TransitionEventType} from './../fx/transition.js';
import * as google from './../google.js';
import * as style from './../style/style.js';
import {Timer} from './../timer/timer.js';
import * as userAgent from './../useragent/useragent.js';
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
 * @fileoverview Definition of the PopupBase class.
 */

/**
 * The PopupBase class provides functionality for showing and hiding a generic
 * container element. It also provides the option for hiding the popup element
 * if the user clicks outside the popup or the popup loses focus.
 *
 * @extends {EventsEventTarget}
 */
class PopupBase extends EventsEventTarget {

  /**
   * The PopupBase class provides functionality for showing and hiding a generic
   * container element. It also provides the option for hiding the popup element
   * if the user clicks outside the popup or the popup loses focus.
   *
   * @param {Element=} opt_element A DOM element for the popup.
   * @param {Type=} opt_type Type of popup.
   * @param {boolean=} opt_dontSetElement EDITED: Disables calling of setElement in the constructor.
   */
  constructor(opt_element, opt_type, opt_dontSetElement) {
    super();
    /**
     * The popup dom element that this Popup wraps.
     * @type {?Element}
     * @private
     */
    this.element_ = null;
  
    /**
     * Whether the Popup dismisses itself it the user clicks outside of it or the
     * popup loses focus
     * @type {boolean}
     * @private
     */
    this.autoHide_ = true;
  
    /**
     * Mouse events without auto hide partner elements will not dismiss the popup.
     * @type {?Array<?Element>}
     * @private
     */
    this.autoHidePartners_ = null;
  
    /**
     * Clicks outside the popup but inside this element will cause the popup to
     * hide if autoHide_ is true. If this is null, then the entire document is used.
     * For example, you can use a body-size div so that clicks on the browser
     * scrollbar do not dismiss the popup.
     * @type {?Element}
     * @private
     */
    this.autoHideRegion_ = null;
  
    /**
     * Whether the popup is currently being shown.
     * @type {boolean}
     * @private
     */
    this.isVisible_ = false;
  
    /**
     * Whether the popup should hide itself asynchrously. This was added because
     * there are cases where hiding the element in mouse down handler in IE can
     * cause textinputs to get into a bad state if the element that had focus is
     * hidden.
     * @type {boolean}
     * @private
     */
    this.shouldHideAsync_ = false;
  
    /**
     * The time when the popup was last shown.
     * @type {number}
     * @private
     */
    this.lastShowTime_ = -1;
  
    /**
     * The time when the popup was last hidden.
     * @type {number}
     * @private
     */
    this.lastHideTime_ = -1;
  
    /**
     * Whether to hide when the escape key is pressed.
     * @type {boolean}
     * @private
     */
    this.hideOnEscape_ = false;
  
    /**
     * Whether to enable cross-iframe dismissal.
     * @type {boolean}
     * @private
     */
    this.enableCrossIframeDismissal_ = true;
  
    /**
     * The type of popup
     * @type {Type}
     * @private
     */
    this.type_ = Type.TOGGLE_DISPLAY;
  
    /**
     * Transition to play on showing the popup.
     * @type {Transition|undefined}
     * @private
     */
    this.showTransition_ = undefined;
  
    /**
     * Transition to play on hiding the popup.
     * @type {Transition|undefined}
     * @private
     */
    this.hideTransition_ = undefined;
  
  
    /**
     * An event handler to manage the events easily
     * @type {EventHandler<!PopupBase>}
     * @private
     */
    this.handler_ = new EventHandler(this);
  
    // EDITED: Called in subclass instead in this case
    if(!opt_dontSetElement) {
      this.setElement(opt_element || null);
    }
    if (opt_type) {
      this.setType(opt_type);
    }
  }

  /**
   * @return {Type} The type of popup this is.
   */
  getType() {
    return this.type_;
  };

  /**
   * Specifies the type of popup to use.
   *
   * @param {Type} type Type of popup.
   */
  setType(type) {
    this.type_ = type;
  };

  /**
   * Returns whether the popup should hide itself asynchronously using a timeout
   * instead of synchronously.
   * @return {boolean} Whether to hide async.
   */
  shouldHideAsync() {
    return this.shouldHideAsync_;
  };

  /**
   * Sets whether the popup should hide itself asynchronously using a timeout
   * instead of synchronously.
   * @param {boolean} b Whether to hide async.
   */
  setShouldHideAsync(b) {
    this.shouldHideAsync_ = b;
  };

  /**
   * Returns the dom element that should be used for the popup.
   *
   * @return {Element} The popup element.
   */
  getElement() {
    return this.element_;
  };

  /**
   * Specifies the dom element that should be used for the popup.
   *
   * @param {Element} elt A DOM element for the popup.
   */
  setElement(elt) {
    this.ensureNotVisible_();
    this.element_ = elt;
  };

  /**
   * Returns whether the Popup dismisses itself when the user clicks outside of
   * it.
   * @return {boolean} Whether the Popup autohides on an external click.
   */
  getAutoHide() {
    return this.autoHide_;
  };

  /**
   * Sets whether the Popup dismisses itself when the user clicks outside of it.
   * @param {boolean} autoHide Whether to autohide on an external click.
   */
  setAutoHide(autoHide) {
    this.ensureNotVisible_();
    this.autoHide_ = autoHide;
  };

  /**
   * Mouse events that occur within an autoHide partner will not hide a popup
   * set to autoHide.
   * @param {!Element} partner The auto hide partner element.
   */
  addAutoHidePartner(partner) {
    if (!this.autoHidePartners_) {
      this.autoHidePartners_ = [];
    }
  
    googarray.insert(this.autoHidePartners_, partner);
  };

  /**
   * Removes a previously registered auto hide partner.
   * @param {!Element} partner The auto hide partner element.
   */
  removeAutoHidePartner(partner) {
    if (this.autoHidePartners_) {
      googarray.remove(this.autoHidePartners_, partner);
    }
  };

  /**
   * @return {boolean} Whether the Popup autohides on the escape key.
   */
  getHideOnEscape() {
    return this.hideOnEscape_;
  };

  /**
   * Sets whether the Popup dismisses itself on the escape key.
   * @param {boolean} hideOnEscape Whether to autohide on the escape key.
   */
  setHideOnEscape(hideOnEscape) {
    this.ensureNotVisible_();
    this.hideOnEscape_ = hideOnEscape;
  };

  /**
   * @return {boolean} Whether cross iframe dismissal is enabled.
   */
  getEnableCrossIframeDismissal() {
    return this.enableCrossIframeDismissal_;
  };

  /**
   * Sets whether clicks in other iframes should dismiss this popup.  In some
   * cases it should be disabled, because it can cause spurious
   * @param {boolean} enable Whether to enable cross iframe dismissal.
   */
  setEnableCrossIframeDismissal(enable) {
    this.enableCrossIframeDismissal_ = enable;
  };

  /**
   * Returns the region inside which the Popup dismisses itself when the user
   * clicks, or null if it's the entire document.
   * @return {Element} The DOM element for autohide, or null if it hasn't been
   *     set.
   */
  getAutoHideRegion() {
    return this.autoHideRegion_;
  };

  /**
   * Sets the region inside which the Popup dismisses itself when the user
   * clicks.
   * @param {Element} element The DOM element for autohide.
   */
  setAutoHideRegion(element) {
    this.autoHideRegion_ = element;
  };

  /**
   * Sets transition animation on showing and hiding the popup.
   * @param {Transition=} opt_showTransition Transition to play on
   *     showing the popup.
   * @param {Transition=} opt_hideTransition Transition to play on
   *     hiding the popup.
   */
  setTransition(
      opt_showTransition, opt_hideTransition) {
    this.showTransition_ = opt_showTransition;
    this.hideTransition_ = opt_hideTransition;
  };

  /**
   * Returns the time when the popup was last shown.
   *
   * @return {number} time in ms since epoch when the popup was last shown, or
   * -1 if the popup was never shown.
   */
  getLastShowTime() {
    return this.lastShowTime_;
  };

  /**
   * Returns the time when the popup was last hidden.
   *
   * @return {number} time in ms since epoch when the popup was last hidden, or
   * -1 if the popup was never hidden or is currently showing.
   */
  getLastHideTime() {
    return this.lastHideTime_;
  };

  /**
   * Returns the event handler for the popup. All event listeners belonging to
   * this handler are removed when the tooltip is hidden. Therefore,
   * the recommended usage of this handler is to listen on events in
   * {@link #onShow}.
   * @return {EventHandler<T>} Event handler for this popup.
   * @protected
   * @this {T}
   * @template T
   */
  getHandler() {
    // As the template type is unbounded, narrow the "this" type
    var self = /** @type {!PopupBase} */ (this);
  
    return self.handler_;
  };

  /**
   * Helper to throw exception if the popup is showing.
   * @private
   */
  ensureNotVisible_() {
    if (this.isVisible_) {
      throw new Error('Can not change this state of the popup while showing.');
    }
  };

  /**
   * Returns whether the popup is currently visible.
   *
   * @return {boolean} whether the popup is currently visible.
   */
  isVisible() {
    return this.isVisible_;
  };

  /**
   * Returns whether the popup is currently visible or was visible within about
   * 150 ms ago. This is used by clients to handle a very specific, but common,
   * popup scenario. The button that launches the popup should close the popup
   * on mouse down if the popup is already open. The problem is that the popup
   * closes itself during the capture phase of the mouse down and thus the button
   * thinks it's hidden and this should show it again. This method provides a
   * good heuristic for clients. Typically in their event handler they will have
   * code that is:
   *
   * if (menu.isOrWasRecentlyVisible()) {
   *   menu.setVisible(false);
   * } else {
   *   ... // code to position menu and initialize other state
   *   menu.setVisible(true);
   * }
   * @return {boolean} Whether the popup is currently visible or was visible
   *     within about 150 ms ago.
   */
  isOrWasRecentlyVisible() {
    return this.isVisible_ ||
        (google.now() - this.lastHideTime_ < PopupBase.DEBOUNCE_DELAY_MS);
  };

  /**
   * Sets whether the popup should be visible. After this method
   * returns, isVisible() will always return the new state, even if
   * there is a transition.
   *
   * @param {boolean} visible Desired visibility state.
   */
  setVisible(visible) {
    // Make sure that any currently running transition is stopped.
    if (this.showTransition_) this.showTransition_.stop();
    if (this.hideTransition_) this.hideTransition_.stop();
  
    if (visible) {
      this.show_();
    } else {
      this.hide_();
    }
  };

  /**
   * Repositions the popup according to the current state.
   * Should be overriden by subclases.
   */
  reposition() {}

  /**
   * Does the work to show the popup.
   * @private
   */
  show_() {
    // Ignore call if we are already showing.
    if (this.isVisible_) {
      return;
    }
  
    // Give derived classes and handlers a chance to customize popup.
    if (!this.onBeforeShow()) {
      return;
    }
  
    // Allow callers to set the element in the BEFORE_SHOW event.
    if (!this.element_) {
      throw new Error(
          'Caller must call setElement before trying to show the popup');
    }
  
    // Call reposition after onBeforeShow, as it may change the style and/or
    // content of the popup and thereby affecting the size which is used for the
    // viewport calculation.
    this.reposition();
  
    var doc = dom.getOwnerDocument(this.element_);
  
    if (this.hideOnEscape_) {
      // Handle the escape keys.  Listen in the capture phase so that we can
      // stop the escape key from propagating to other elements.  For example,
      // if there is a popup within a dialog box, we want the popup to be
      // dismissed first, rather than the dialog.
      this.handler_.listen(
          doc, EventsEventType.KEYDOWN, this.onDocumentKeyDown_, true);
    }
  
    // Set up event handlers.
    if (this.autoHide_) {
      // Even if the popup is not in the focused document, we want to
      // close it on mousedowns in the document it's in.
      this.handler_.listen(
          doc, EventsEventType.MOUSEDOWN, this.onDocumentMouseDown_, true);
  
      if (userAgent.IE) {
        // We want to know about deactivates/mousedowns on the document with focus
        // The top-level document won't get a deactivate event if the focus is
        // in an iframe and the deactivate fires within that iframe.
        // The active element in the top-level document will remain the iframe
        // itself.
        var activeElement;
  
        try {
          activeElement = doc.activeElement;
        } catch (e) {
          // There is an IE browser bug which can cause just the reading of
          // document.activeElement to throw an Unspecified Error.  This
          // may have to do with loading a popup within a hidden iframe.
        }
        while (activeElement &&
               activeElement.nodeName == TagName.IFRAME) {
  
          try {
            var tempDoc = dom.getFrameContentDocument(activeElement);
          } catch (e) {
            // The frame is on a different domain that its parent document
            // This way, we grab the lowest-level document object we can get
            // a handle on given cross-domain security.
            break;
          }
          doc = tempDoc;
          activeElement = doc.activeElement;
        }
  
        // Handle mousedowns in the focused document in case the user clicks
        // on the activeElement (in which case the popup should hide).
        this.handler_.listen(
            doc, EventsEventType.MOUSEDOWN, this.onDocumentMouseDown_,
            true);
  
        // If the active element inside the focused document changes, then
        // we probably need to hide the popup.
        this.handler_.listen(
            doc, EventsEventType.DEACTIVATE, this.onDocumentBlur_);
  
      } else {
        this.handler_.listen(
            doc, EventsEventType.BLUR, this.onDocumentBlur_);
      }
    }
  
    // Make the popup visible.
    if (this.type_ == Type.TOGGLE_DISPLAY) {
      this.showPopupElement();
    } else if (this.type_ == Type.MOVE_OFFSCREEN) {
      this.reposition();
    }
    this.isVisible_ = true;
  
    this.lastShowTime_ = google.now();
    this.lastHideTime_ = -1;
  
    // If there is transition to play, we play it and fire SHOW event after
    // the transition is over.
    if (this.showTransition_) {
      events.listenOnce(
          /** @type {!EventsEventTarget} */ (this.showTransition_),
          TransitionEventType.END, this.onShow, false, this);
      this.showTransition_.play();
    } else {
      // Notify derived classes and handlers.
      this.onShow();
    }
  };

  /**
   * Hides the popup. This call is idempotent.
   *
   * @param {?Node=} opt_target Target of the event causing the hide.
   * @return {boolean} Whether the popup was hidden and not cancelled.
   * @private
   */
  hide_(opt_target) {
    // Give derived classes and handlers a chance to cancel hiding.
    if (!this.isVisible_ || !this.onBeforeHide(opt_target)) {
      return false;
    }
  
    // Remove any listeners we attached when showing the popup.
    if (this.handler_) {
      this.handler_.removeAll();
    }
  
    // Set visibility to hidden even if there is a transition.
    this.isVisible_ = false;
    this.lastHideTime_ = google.now();
  
    // If there is transition to play, we play it and only hide the element
    // (and fire HIDE event) after the transition is over.
    if (this.hideTransition_) {
      events.listenOnce(
          /** @type {!EventsEventTarget} */ (this.hideTransition_),
          TransitionEventType.END,
          google.partial(this.continueHidingPopup_, opt_target), false, this);
      this.hideTransition_.play();
    } else {
      this.continueHidingPopup_(opt_target);
    }
  
    return true;
  };

  /**
   * Continues hiding the popup. This is a continuation from hide_. It is
   * a separate method so that we can add a transition before hiding.
   * @param {?Node=} opt_target Target of the event causing the hide.
   * @private
   */
  continueHidingPopup_(opt_target) {
    // Hide the popup.
    if (this.type_ == Type.TOGGLE_DISPLAY) {
      if (this.shouldHideAsync_) {
        Timer.callOnce(this.hidePopupElement, 0, this);
      } else {
        this.hidePopupElement();
      }
    } else if (this.type_ == Type.MOVE_OFFSCREEN) {
      this.moveOffscreen_();
    }
  
    // Notify derived classes and handlers.
    this.onHide(opt_target);
  };

  /**
   * Shows the popup element.
   * @protected
   */
  showPopupElement() {
    this.element_.style.visibility = 'visible';
    style.setElementShown(this.element_, true);
  };

  /**
   * Hides the popup element.
   * @protected
   */
  hidePopupElement() {
    this.element_.style.visibility = 'hidden';
    style.setElementShown(this.element_, false);
  };

  /**
   * Hides the popup by moving it offscreen.
   *
   * @private
   */
  moveOffscreen_() {
    this.element_.style.top = '-10000px';
  };

  /**
   * Called before the popup is shown. Derived classes can override to hook this
   * event but should make sure to call the parent class method.
   *
   * @return {boolean} If anyone called preventDefault on the event object (or
   *     if any of the handlers returns false this will also return false.
   * @protected
   */
  onBeforeShow() {
    return this.dispatchEvent(EventType.BEFORE_SHOW);
  };

  /**
   * Called after the popup is shown. Derived classes can override to hook this
   * event but should make sure to call the parent class method.
   * @protected
   */
  onShow() {
    this.dispatchEvent(EventType.SHOW);
  };

  /**
   * Called before the popup is hidden. Derived classes can override to hook this
   * event but should make sure to call the parent class method.
   *
   * @param {?Node=} opt_target Target of the event causing the hide.
   * @return {boolean} If anyone called preventDefault on the event object (or
   *     if any of the handlers returns false this will also return false.
   * @protected
   */
  onBeforeHide(opt_target) {
    return this.dispatchEvent(
        {type: EventType.BEFORE_HIDE, target: opt_target});
  };

  /**
   * Called after the popup is hidden. Derived classes can override to hook this
   * event but should make sure to call the parent class method.
   * @param {?Node=} opt_target Target of the event causing the hide.
   * @protected
   */
  onHide(opt_target) {
    this.dispatchEvent(
        {type: EventType.HIDE, target: opt_target});
  };

  /**
   * Mouse down handler for the document on capture phase. Used to hide the
   * popup for auto-hide mode.
   *
   * @param {EventsBrowserEvent} e The event object.
   * @private
   */
  onDocumentMouseDown_(e) {
    var target = e.target;
  
    if (!dom.contains(this.element_, target) &&
        !this.isOrWithinAutoHidePartner_(target) &&
        this.isWithinAutoHideRegion_(target) && !this.shouldDebounce_()) {
      // Mouse click was outside popup and partners, so hide.
      this.hide_(target);
    }
  };

  /**
   * Handles key-downs on the document to handle the escape key.
   *
   * @param {EventsBrowserEvent} e The event object.
   * @private
   */
  onDocumentKeyDown_(e) {
    if (e.keyCode == KeyCodes.ESC) {
      if (this.hide_(e.target)) {
        // Eat the escape key, but only if this popup was actually closed.
        e.preventDefault();
        e.stopPropagation();
      }
    }
  };

  /**
   * Deactivate handler(IE) and blur handler (other browsers) for document.
   * Used to hide the popup for auto-hide mode.
   *
   * @param {EventsBrowserEvent} e The event object.
   * @private
   */
  onDocumentBlur_(e) {
    if (!this.enableCrossIframeDismissal_) {
      return;
    }
  
    var doc = dom.getOwnerDocument(this.element_);
  
    // Ignore blur events if the active element is still inside the popup or if
    // there is no longer an active element.  For example, a widget like a
    // goog.ui.Button might programatically blur itself before losing tabIndex.
    if (typeof document.activeElement != 'undefined') {
      var activeElement = doc.activeElement;
      if (!activeElement || dom.contains(this.element_, activeElement) ||
          activeElement.tagName == TagName.BODY) {
        return;
      }
  
      // Ignore blur events not for the document itself in non-IE browsers.
    } else if (e.target != doc) {
      return;
    }
  
    // Debounce the initial focus move.
    if (this.shouldDebounce_()) {
      return;
    }
  
    this.hide_();
  };

  /**
   * @param {Node} element The element to inspect.
   * @return {boolean} Returns true if the given element is one of the auto hide
   *     partners or is a child of an auto hide partner.
   * @private
   */
  isOrWithinAutoHidePartner_(element) {
    return googarray.some(this.autoHidePartners_ || [], function(partner) {
      return element === partner || dom.contains(partner, element);
    });
  };

  /**
   * @param {Node} element The element to inspect.
   * @return {boolean} Returns true if the element is contained within
   *     the autohide region. If unset, the autohide region is the entire
   *     entire document.
   * @private
   */
  isWithinAutoHideRegion_(element) {
    return this.autoHideRegion_ ?
        dom.contains(this.autoHideRegion_, element) :
        true;
  };

  /**
   * @return {boolean} Whether the time since last show is less than the debounce
   *     delay.
   * @private
   */
  shouldDebounce_() {
    return google.now() - this.lastShowTime_ < PopupBase.DEBOUNCE_DELAY_MS;
  };

  /** @override */
  disposeInternal() {
    super.disposeInternal();
    this.handler_.dispose();
    dispose(this.showTransition_);
    dispose(this.hideTransition_);
    delete this.element_;
    delete this.handler_;
    delete this.autoHidePartners_;
  };
}

// google.tagUnsealableClass(PopupBase);

/**
 * Constants for type of Popup
 * @enum {string}
 */
let Type = {
  TOGGLE_DISPLAY: 'toggle_display',
  MOVE_OFFSCREEN: 'move_offscreen'
};

/**
 * Constants for event type fired by Popup
 *
 * @enum {string}
 */
let EventType = {
  BEFORE_SHOW: 'beforeshow',
  SHOW: 'show',
  BEFORE_HIDE: 'beforehide',
  HIDE: 'hide'
};

/**
 * A time in ms used to debounce events that happen right after each other.
 *
 * A note about why this is necessary. There are two cases to consider.
 * First case, a popup will usually see a focus event right after it's launched
 * because it's typical for it to be launched in a mouse-down event which will
 * then move focus to the launching button. We don't want to think this is a
 * separate user action moving focus. Second case, a user clicks on the
 * launcher button to close the menu. In that case, we'll close the menu in the
 * focus event and then show it again because of the mouse down event, even
 * though the intention is to just close the menu. This workaround appears to
 * be the least intrusive fix.
 *
 * @type {number}
 */
PopupBase.DEBOUNCE_DELAY_MS = 150;

export {EventType, PopupBase, Type};