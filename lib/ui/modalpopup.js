import * as asserts from './../asserts/asserts.js';
import {dispose} from './../disposable/disposable.js';
import * as animationFrame from './../dom/animationframe/animationframe.js';
import * as classlist from './../dom/classlist.js';
import * as googdom from './../dom/dom.js';
import {DomHelper} from './../dom/dom.js';
import * as iframe from './../dom/iframe.js';
import {TagName} from './../dom/tagname.js';
import {BrowserEvent as EventsBrowserEvent} from './../events/browserevent.js';
import * as goog_events from './../events/eventhandler.js';
import {EventTarget as EventsEventTarget} from './../events/eventhandler.js';
import {EventType as EventsEventType} from './../events/eventtype.js';
import {FocusHandler} from './../events/focushandler.js';
import {EventType} from './../events/focushandler.js';
import {Transition} from './../fx/transition.js';
import {EventType as TransitionEventType} from './../fx/transition.js';
import * as google from './../google.js';
import * as strings from './../string/string.js';
import * as style from './../style/style.js';
import {Timer} from './../timer/timer.js';
import * as userAgent from './../useragent/useragent.js';
import {Component} from './component.js';
import {ModalAriaVisibilityHelper} from './modalariavisibilityhelper.js';
import {PopupBase} from './popupbase.js';
import {EventType as PopupBaseEventType} from './popupbase.js';
// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Class for showing simple modal popup.
 */

/**
 * Base class for modal popup UI components. This can also be used as
 * a standalone component to render a modal popup with an empty div.
 *
 * WARNING: ModalPopup is only guaranteed to work when it is rendered
 * directly in the 'body' element.
 *
 * The Html structure of the modal popup is:
 * <pre>
 *  Element         Function              Class-name, goog-modalpopup = default
 * ----------------------------------------------------------------------------
 * - iframe         Iframe mask           goog-modalpopup-bg
 * - div            Background mask       goog-modalpopup-bg
 * - div            Modal popup area      goog-modalpopup
 * - span           Tab catcher
 * </pre>
 *     issue by using an iframe instead of a div for bg element.
 *     Component} for semantics.
 * @extends {Component}
 */
class ModalPopup extends Component {

  /**
   * Base class for modal popup UI components. This can also be used as
   * a standalone component to render a modal popup with an empty div.
   *
   * WARNING: ModalPopup is only guaranteed to work when it is rendered
   * directly in the 'body' element.
   *
   * The Html structure of the modal popup is:
   * <pre>
   *  Element         Function              Class-name, goog-modalpopup = default
   * ----------------------------------------------------------------------------
   * - iframe         Iframe mask           goog-modalpopup-bg
   * - div            Background mask       goog-modalpopup-bg
   * - div            Modal popup area      goog-modalpopup
   * - span           Tab catcher
   * </pre>
   * @param {boolean=} opt_useIframeMask Work around windowed controls z-index
   *     issue by using an iframe instead of a div for bg element.
   * @param {DomHelper=} opt_domHelper Optional DOM helper; see {@link
   *     Component} for semantics.
   */
  constructor(opt_useIframeMask, opt_domHelper) {
    super(opt_domHelper);
    /**
     * Focus handler. It will be initialized in enterDocument.
     * @type {?FocusHandler}
     * @private
     */
    this.focusHandler_ = null;
  
    /**
     * Whether the modal popup is visible.
     * @type {boolean}
     * @private
     */
    this.visible_ = false;
  
    /**
     * Element for the background which obscures the UI and blocks events.
     * @type {?Element}
     * @private
     */
    this.bgEl_ = null;
  
    /**
     * Iframe element that is only used for IE as a workaround to keep select-type
     * elements from burning through background.
     * @type {?Element}
     * @private
     */
    this.bgIframeEl_ = null;
  
    /**
     * Element used to catch focus and prevent the user from tabbing out
     * of the popup.
     * @type {?Element}
     * @private
     */
    this.tabCatcherElement_ = null;
  
    /**
     * Whether the modal popup is in the process of wrapping focus from the top of
     * the popup to the last tabbable element.
     * @type {boolean}
     * @private
     */
    this.backwardTabWrapInProgress_ = false;
  
    /**
     * Transition to show the popup.
     * @type {Transition}
     * @private
     */
    this.popupShowTransition_ = null;
  
    /**
     * Transition to hide the popup.
     * @type {Transition}
     * @private
     */
    this.popupHideTransition_ = null;
  
    /**
     * Transition to show the background.
     * @type {Transition}
     * @private
     */
    this.bgShowTransition_ = null;
  
    /**
     * Transition to hide the background.
     * @type {Transition}
     * @private
     */
    this.bgHideTransition_ = null;
  
    /**
     * Helper object to control aria visibility of the rest of the page.
     * @type {ModalAriaVisibilityHelper}
     * @private
     */
    this.modalAriaVisibilityHelper_ = null;
  
  
    /**
     * Whether the modal popup should use an iframe as the background
     * element to work around z-order issues.
     * @type {boolean}
     * @private
     */
    this.useIframeMask_ = !!opt_useIframeMask;
  
    /**
     * The element that had focus before the popup was displayed.
     * @type {?Element}
     * @private
     */
    this.lastFocus_ = null;
  
    /**
     * The animation task that resizes the background, scheduled to run in the
     * next animation frame.
     * @type {function(...?)}
     * @private
     */
    this.resizeBackgroundTask_ = animationFrame.createTask(
        {mutate: this.resizeBackground_}, this);
  }

  /**
   * @return {string} Base CSS class for this component.
   * @protected
   */
  getCssClass() {
    return google.getCssName('goog-modalpopup');
  };

  /**
   * Returns the background iframe mask element, if any.
   * @return {Element} The background iframe mask element, may return
   *     null/undefined if the modal popup does not use iframe mask.
   */
  getBackgroundIframe() {
    return this.bgIframeEl_;
  };

  /**
   * Returns the background mask element.
   * @return {Element} The background mask element.
   */
  getBackgroundElement() {
    return this.bgEl_;
  };

  /**
   * Creates the initial DOM representation for the modal popup.
   * @override
   */
  createDom() {
    // Create the modal popup element, and make sure it's hidden.
    super.createDom();
  
    var element = this.getElement();
    asserts.assert(element);
    var allClasses = strings.trim(this.getCssClass()).split(' ');
    classlist.addAll(element, allClasses);
    googdom.setFocusableTabIndex(element, true);
    style.setElementShown(element, false);
  
    // Manages the DOM for background mask elements.
    this.manageBackgroundDom_();
    this.createTabCatcher_();
  };

  /**
   * Creates and disposes of the DOM for background mask elements.
   * @private
   */
  manageBackgroundDom_() {
    if (this.useIframeMask_ && !this.bgIframeEl_) {
      // IE renders the iframe on top of the select elements while still
      // respecting the z-index of the other elements on the page.  See
      // http://support.microsoft.com/kb/177378 for more information.
      // Flash and other controls behave in similar ways for other browsers
      this.bgIframeEl_ = iframe.createBlank(this.getDomHelper());
      this.bgIframeEl_.className = google.getCssName(this.getCssClass(), 'bg');
      style.setElementShown(this.bgIframeEl_, false);
      style.setOpacity(this.bgIframeEl_, 0);
    }
  
    // Create the backgound mask, initialize its opacity, and make sure it's
    // hidden.
    if (!this.bgEl_) {
      this.bgEl_ = this.getDomHelper().createDom(
          TagName.DIV, google.getCssName(this.getCssClass(), 'bg'));
      style.setElementShown(this.bgEl_, false);
    }
  };

  /**
   * Creates the tab catcher element.
   * @private
   */
  createTabCatcher_() {
    // Creates tab catcher element.
    if (!this.tabCatcherElement_) {
      this.tabCatcherElement_ =
          this.getDomHelper().createElement(TagName.SPAN);
      style.setElementShown(this.tabCatcherElement_, false);
      googdom.setFocusableTabIndex(this.tabCatcherElement_, true);
      this.tabCatcherElement_.style.position = 'absolute';
    }
  };

  /**
   * Allow a shift-tab from the top of the modal popup to the last tabbable
   * element by moving focus to the tab catcher. This should be called after
   * catching a wrapping shift-tab event and before allowing it to propagate, so
   * that focus will land on the last tabbable element before the tab catcher.
   * @protected
   */
  setupBackwardTabWrap() {
    this.backwardTabWrapInProgress_ = true;
    try {
      this.tabCatcherElement_.focus();
    } catch (e) {
      // Swallow this. IE can throw an error if the element can not be focused.
    }
    // Reset the flag on a timer in case anything goes wrong with the followup
    // event.
    Timer.callOnce(this.resetBackwardTabWrap_, 0, this);
  };

  /**
   * Resets the backward tab wrap flag.
   * @private
   */
  resetBackwardTabWrap_() {
    this.backwardTabWrapInProgress_ = false;
  };

  /**
   * Renders the background mask.
   * @private
   */
  renderBackground_() {
    asserts.assert(!!this.bgEl_, 'Background element must not be null.');
    if (this.bgIframeEl_) {
      googdom.insertSiblingBefore(this.bgIframeEl_, this.getElement());
    }
    googdom.insertSiblingBefore(this.bgEl_, this.getElement());
  };

  /** @override */
  canDecorate(element) {
    // Assume we can decorate any DIV.
    return !!element && element.tagName == TagName.DIV;
  };

  /** @override */
  decorateInternal(element) {
    // Decorate the modal popup area element.
    super.decorateInternal(element);
    var allClasses = strings.trim(this.getCssClass()).split(' ');
  
    classlist.addAll(asserts.assert(this.getElement()), allClasses);
  
    // Create the background mask...
    this.manageBackgroundDom_();
    this.createTabCatcher_();
  
    // Make sure the decorated modal popup is focusable and hidden.
    googdom.setFocusableTabIndex(this.getElement(), true);
    style.setElementShown(this.getElement(), false);
  };

  /** @override */
  enterDocument() {
    this.renderBackground_();
    super.enterDocument();
  
    googdom.insertSiblingAfter(this.tabCatcherElement_, this.getElement());
  
    this.focusHandler_ =
        new FocusHandler(this.getDomHelper().getDocument());
  
    // We need to watch the entire document so that we can detect when the
    // focus is moved out of this modal popup.
    this.getHandler().listen(
        this.focusHandler_, EventType.FOCUSIN,
        this.onFocus);
    this.setA11YDetectBackground(false);
  };

  /** @override */
  exitDocument() {
    if (this.isVisible()) {
      this.setVisible(false);
    }
  
    dispose(this.focusHandler_);
  
    super.exitDocument();
    googdom.removeNode(this.bgIframeEl_);
    googdom.removeNode(this.bgEl_);
    googdom.removeNode(this.tabCatcherElement_);
  };

  /**
   * Sets the visibility of the modal popup box and focus to the popup.
   * @param {boolean} visible Whether the modal popup should be visible.
   */
  setVisible(visible) {
    asserts.assert(
        this.isInDocument(), 'ModalPopup must be rendered first.');
  
    if (visible == this.visible_) {
      return;
    }
  
    if (this.popupShowTransition_) this.popupShowTransition_.stop();
    if (this.bgShowTransition_) this.bgShowTransition_.stop();
    if (this.popupHideTransition_) this.popupHideTransition_.stop();
    if (this.bgHideTransition_) this.bgHideTransition_.stop();
  
    if (this.isInDocument()) {
      this.setA11YDetectBackground(visible);
    }
    if (visible) {
      this.show_();
    } else {
      this.hide_();
    }
  };

  /**
   * Sets aria-hidden on the rest of the page to restrict screen reader focus.
   * Top-level elements with an explicit aria-hidden state are not altered.
   * @param {boolean} hide Whether to hide or show the rest of the page.
   * @protected
   */
  setA11YDetectBackground(hide) {
    if (!this.modalAriaVisibilityHelper_) {
      this.modalAriaVisibilityHelper_ = new ModalAriaVisibilityHelper(
          this.getElementStrict(), this.dom_);
    }
    this.modalAriaVisibilityHelper_.setBackgroundVisibility(hide);
  };

  /**
   * Sets the transitions to show and hide the popup and background.
   * @param {!Transition} popupShowTransition Transition to show the
   *     popup.
   * @param {!Transition} popupHideTransition Transition to hide the
   *     popup.
   * @param {!Transition} bgShowTransition Transition to show
   *     the background.
   * @param {!Transition} bgHideTransition Transition to hide
   *     the background.
   */
  setTransition(
      popupShowTransition, popupHideTransition, bgShowTransition,
      bgHideTransition) {
    this.popupShowTransition_ = popupShowTransition;
    this.popupHideTransition_ = popupHideTransition;
    this.bgShowTransition_ = bgShowTransition;
    this.bgHideTransition_ = bgHideTransition;
  };

  /**
   * Shows the popup.
   * @private
   */
  show_() {
    if (!this.dispatchEvent(PopupBaseEventType.BEFORE_SHOW)) {
      return;
    }
  
    try {
      this.lastFocus_ = this.getDomHelper().getDocument().activeElement;
    } catch (e) {
      // Focus-related actions often throw exceptions.
      // Sample past issue: https://bugzilla.mozilla.org/show_bug.cgi?id=656283
    }
    this.resizeBackground_();
    this.reposition();
  
    // Listen for keyboard and resize events while the modal popup is visible.
    this.getHandler()
        .listen(
            this.getDomHelper().getWindow(), EventsEventType.RESIZE,
            this.resizeBackground_)
        .listen(
            this.getDomHelper().getWindow(),
            EventsEventType.ORIENTATIONCHANGE, this.resizeBackgroundTask_);
  
    this.showPopupElement_(true);
    this.focus();
    this.visible_ = true;
  
    if (this.popupShowTransition_ && this.bgShowTransition_) {
      goog_events.listenOnce(
          /** @type {!EventsEventTarget} */ (this.popupShowTransition_),
          TransitionEventType.END, this.onShow, false, this);
      this.bgShowTransition_.play();
      this.popupShowTransition_.play();
    } else {
      this.onShow();
    }
  };

  /**
   * Hides the popup.
   * @private
   */
  hide_() {
    if (!this.dispatchEvent(PopupBaseEventType.BEFORE_HIDE)) {
      return;
    }
  
    // Stop listening for keyboard and resize events while the modal
    // popup is hidden.
    this.getHandler()
        .unlisten(
            this.getDomHelper().getWindow(), EventsEventType.RESIZE,
            this.resizeBackground_)
        .unlisten(
            this.getDomHelper().getWindow(),
            EventsEventType.ORIENTATIONCHANGE, this.resizeBackgroundTask_);
  
    // Set visibility to hidden even if there is a transition. This
    // reduces complexity in subclasses who may want to override
    // setVisible (such as goog.ui.Dialog).
    this.visible_ = false;
  
    if (this.popupHideTransition_ && this.bgHideTransition_) {
      goog_events.listenOnce(
          /** @type {!EventsEventTarget} */ (this.popupHideTransition_),
          TransitionEventType.END, this.onHide, false, this);
      this.bgHideTransition_.play();
      // The transition whose END event you are listening to must be played last
      // to prevent errors when disposing on hide event, which occur on browsers
      // that do not support CSS3 transitions.
      this.popupHideTransition_.play();
    } else {
      this.onHide();
    }
  
    this.returnFocus_();
  };

  /**
   * Attempts to return the focus back to the element that had it before the popup
   * was opened.
   * @private
   */
  returnFocus_() {
    try {
      var dom = this.getDomHelper();
      var body = dom.getDocument().body;
      var active = dom.getDocument().activeElement || body;
      if (!this.lastFocus_ || this.lastFocus_ == body) {
        this.lastFocus_ = null;
        return;
      }
      // We only want to move the focus if we actually have it, i.e.:
      //  - if we immediately hid the popup the focus should have moved to the
      // body element
      //  - if there is a hiding transition in progress the focus would still be
      // within the dialog and it is safe to move it if the current focused
      // element is a child of the dialog
      if (active == body || dom.contains(this.getElement(), active)) {
        this.lastFocus_.focus();
      }
    } catch (e) {
      // Swallow this. IE can throw an error if the element can not be focused.
    }
    // Explicitly want to null this out even if there was an error focusing to
    // avoid bleed over between dialog invocations.
    this.lastFocus_ = null;
  };

  /**
   * Shows or hides the popup element.
   * @param {boolean} visible Shows the popup element if true, hides if false.
   * @private
   */
  showPopupElement_(visible) {
    if (this.bgIframeEl_) {
      style.setElementShown(this.bgIframeEl_, visible);
    }
    if (this.bgEl_) {
      style.setElementShown(this.bgEl_, visible);
    }
    style.setElementShown(this.getElement(), visible);
    style.setElementShown(this.tabCatcherElement_, visible);
  };

  /**
   * Called after the popup is shown. If there is a transition, this
   * will be called after the transition completed or stopped.
   * @protected
   */
  onShow() {
    this.dispatchEvent(PopupBaseEventType.SHOW);
  };

  /**
   * Called after the popup is hidden. If there is a transition, this
   * will be called after the transition completed or stopped.
   * @protected
   */
  onHide() {
    this.showPopupElement_(false);
    this.dispatchEvent(PopupBaseEventType.HIDE);
  };

  /**
   * @return {boolean} Whether the modal popup is visible.
   */
  isVisible() {
    return this.visible_;
  };

  /**
   * Focuses on the modal popup.
   */
  focus() {
    this.focusElement_();
  };

  /**
   * Make the background element the size of the document.
   *
   * NOTE(user): We must hide the background element before measuring the
   * document, otherwise the size of the background will stop the document from
   * shrinking to fit a smaller window.  This does cause a slight flicker in Linux
   * browsers, but should not be a common scenario.
   * @private
   */
  resizeBackground_() {
    if (this.bgIframeEl_) {
      style.setElementShown(this.bgIframeEl_, false);
    }
    if (this.bgEl_) {
      style.setElementShown(this.bgEl_, false);
    }
  
    var doc = this.getDomHelper().getDocument();
    var win = googdom.getWindow(doc) || window;
  
    // Take the max of document height and view height, in case the document does
    // not fill the viewport. Read from both the body element and the html element
    // to account for browser differences in treatment of absolutely-positioned
    // content.
    var viewSize = googdom.getViewportSize(win);
    var w = Math.max(
        viewSize.width,
        Math.max(doc.body.scrollWidth, doc.documentElement.scrollWidth));
    var h = Math.max(
        viewSize.height,
        Math.max(doc.body.scrollHeight, doc.documentElement.scrollHeight));
  
    if (this.bgIframeEl_) {
      style.setElementShown(this.bgIframeEl_, true);
      style.setSize(this.bgIframeEl_, w, h);
    }
    if (this.bgEl_) {
      style.setElementShown(this.bgEl_, true);
      style.setSize(this.bgEl_, w, h);
    }
  };

  /**
   * Centers the modal popup in the viewport, taking scrolling into account.
   */
  reposition() {
    // TODO(chrishenry): Make this use google.positioning as in PopupBase?
  
    // Get the current viewport to obtain the scroll offset.
    var doc = this.getDomHelper().getDocument();
    var win = googdom.getWindow(doc) || window;
    if (style.getComputedPosition(this.getElement()) == 'fixed') {
      var x = 0;
      var y = 0;
    } else {
      var scroll = this.getDomHelper().getDocumentScroll();
      var x = scroll.x;
      var y = scroll.y;
    }
  
    var popupSize = style.getSize(this.getElement());
    var viewSize = googdom.getViewportSize(win);
  
    // Make sure left and top are non-negatives.
    var left = Math.max(x + viewSize.width / 2 - popupSize.width / 2, 0);
    var top = Math.max(y + viewSize.height / 2 - popupSize.height / 2, 0);
    style.setPosition(this.getElement(), left, top);
  
    // We place the tab catcher at the same position as the dialog to
    // prevent IE from scrolling when users try to tab out of the dialog.
    style.setPosition(this.tabCatcherElement_, left, top);
  };

  /**
   * Handles focus events.  Makes sure that if the user tabs past the
   * elements in the modal popup, the focus wraps back to the beginning, and that
   * if the user shift-tabs past the front of the modal popup, focus wraps around
   * to the end.
   * @param {EventsBrowserEvent} e Browser's event object.
   * @protected
   */
  onFocus(e) {
    if (this.backwardTabWrapInProgress_) {
      this.resetBackwardTabWrap_();
    } else if (e.target == this.tabCatcherElement_) {
      Timer.callOnce(this.focusElement_, 0, this);
    }
  };

  /**
   * Returns the magic tab catcher element used to detect when the user has
   * rolled focus off of the popup content.  It is automatically created during
   * the createDom method() and can be used by subclasses to implement custom
   * tab-loop behavior.
   * @return {Element} The tab catcher element.
   * @protected
   */
  getTabCatcherElement() {
    return this.tabCatcherElement_;
  };

  /**
   * Moves the focus to the modal popup.
   * @private
   */
  focusElement_() {
    try {
      if (userAgent.IE) {
        // In IE, we must first focus on the body or else focussing on a
        // sub-element will not work.
        this.getDomHelper().getDocument().body.focus();
      }
      this.getElement().focus();
    } catch (e) {
      // Swallow this. IE can throw an error if the element can not be focused.
    }
  };

  /** @override */
  disposeInternal() {
    dispose(this.popupShowTransition_);
    this.popupShowTransition_ = null;
  
    dispose(this.popupHideTransition_);
    this.popupHideTransition_ = null;
  
    dispose(this.bgShowTransition_);
    this.bgShowTransition_ = null;
  
    dispose(this.bgHideTransition_);
    this.bgHideTransition_ = null;
  
    super.disposeInternal();
  };
}

// google.tagUnsealableClass(ModalPopup);

export {ModalPopup};