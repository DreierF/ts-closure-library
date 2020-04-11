import * as aria from './../a11y/aria/aria.js';
import {State} from './../a11y/aria/attributes.js';
import {Role} from './../a11y/aria/roles.js';
import * as asserts from './../asserts/asserts.js';
import * as classlist from './../dom/classlist.js';
import * as googdom from './../dom/dom.js';
import {DomHelper} from './../dom/dom.js';
import {NodeType} from './../dom/nodetype.js';
import * as safe from './../dom/safe.js';
import {TagName} from './../dom/tagname.js';
import {BrowserEvent as EventsBrowserEvent} from './../events/browserevent.js';
import {Event as EventsEvent} from './../events/event.js';
import * as goog_events from './../events/eventhandler.js';
import {Key} from './../events/eventhandler.js';
import {EventType as EventsEventType} from './../events/eventtype.js';
import {KeyCodes} from './../events/keycodes.js';
import {Keys} from './../events/keys.js';
import {Dragger as Fx_Dragger} from './../fx/dragger.js';
import {EventType as DraggerEventType} from './../fx/dragger.js';
import * as google from './../google.js';
import {SafeHtml} from './../html/safehtml.js';
import {Rect} from './../math/rect.js';
import * as strings from './../string/string.js';
import * as style from './../style/style.js';
import {Map as UiMap} from './map.js';
import {ModalPopup} from './modalpopup.js';
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
 * @fileoverview Class for showing simple modal dialog boxes.
 *
 * TODO(user):
 *   * Standardize CSS class names with other components
 *   * Add functionality to "host" other components in content area
 *   * Abstract out ButtonSet and make it more general
 * @see ../demos/dialog.html
 */

/**
 * Class for showing simple dialog boxes.
 * The Html structure of the dialog box is:
 * <pre>
 *  Element         Function                Class-name, modal-dialog = default
 * ----------------------------------------------------------------------------
 * - iframe         Iframe mask              modal-dialog-bg
 * - div            Background mask          modal-dialog-bg
 * - div            Dialog area              modal-dialog
 *     - div        Title bar                modal-dialog-title
 *        - span                             modal-dialog-title-text
 *          - text  Title text               N/A
 *        - span                             modal-dialog-title-close
 *          - ??    Close box                N/A
 *     - div        Content area             modal-dialog-content
 *        - ??      User specified content   N/A
 *     - div        Button area              modal-dialog-buttons
 *        - button                           N/A
 *        - button
 *        - ...
 * </pre>
 *     as a class name prefix for related elements; defaults to modal-dialog.
 *     This should be a single, valid CSS class name.
 *     issue by using an iframe instead of a div for bg element.
 *     goog.ui.Component} for semantics.
 * @extends {ModalPopup}
 */
class Dialog extends ModalPopup {

  /**
   * Class for showing simple dialog boxes.
   * The Html structure of the dialog box is:
   * <pre>
   *  Element         Function                Class-name, modal-dialog = default
   * ----------------------------------------------------------------------------
   * - iframe         Iframe mask              modal-dialog-bg
   * - div            Background mask          modal-dialog-bg
   * - div            Dialog area              modal-dialog
   *     - div        Title bar                modal-dialog-title
   *        - span                             modal-dialog-title-text
   *          - text  Title text               N/A
   *        - span                             modal-dialog-title-close
   *          - ??    Close box                N/A
   *     - div        Content area             modal-dialog-content
   *        - ??      User specified content   N/A
   *     - div        Button area              modal-dialog-buttons
   *        - button                           N/A
   *        - button
   *        - ...
   * </pre>
   * @param {string=} opt_class CSS class name for the dialog element, also used
   *     as a class name prefix for related elements; defaults to modal-dialog.
   *     This should be a single, valid CSS class name.
   * @param {boolean=} opt_useIframeMask Work around windowed controls z-index
   *     issue by using an iframe instead of a div for bg element.
   * @param {DomHelper=} opt_domHelper Optional DOM helper; see {@link
   *     goog.ui.Component} for semantics.
   */
  constructor(opt_class, opt_useIframeMask, opt_domHelper) {
    super(opt_useIframeMask, opt_domHelper);
    /**
     * Whether the escape key closes this dialog.
     * @type {boolean}
     * @private
     */
    this.escapeToCancel_ = true;
  
    /**
     * Whether this dialog should include a title close button.
     * @type {boolean}
     * @private
     */
    this.hasTitleCloseButton_ = true;
  
    /**
     * Whether the dialog is modal. Defaults to true.
     * @type {boolean}
     * @private
     */
    this.modal_ = true;
  
    /**
     * Whether the dialog is draggable. Defaults to true.
     * @type {boolean}
     * @private
     */
    this.draggable_ = true;
  
    /**
     * Opacity for background mask.  Defaults to 50%.
     * @type {number}
     * @private
     */
    this.backgroundElementOpacity_ = 0.50;
  
    /**
     * Dialog's title.
     * @type {string}
     * @private
     */
    this.title_ = '';
  
    /**
     * Dialog's content (HTML).
     * @type {?SafeHtml}
     * @private
     */
    this.content_ = null;
  
    /**
     * Dragger.
     * @type {?Fx_Dragger}
     * @private
     */
    this.dragger_ = null;
  
    /**
     * Whether the dialog should be disposed when it is hidden.
     * @type {boolean}
     * @private
     */
    this.disposeOnHide_ = false;
  
    /**
     * Element for the title bar.
     * @type {?Element}
     * @private
     */
    this.titleEl_ = null;
  
    /**
     * Element for the text area of the title bar.
     * @type {?Element}
     * @private
     */
    this.titleTextEl_ = null;
  
    /**
     * Id of element for the text area of the title bar.
     * @type {?string}
     * @private
     */
    this.titleTextId_ = null;
  
    /**
     * Element for the close box area of the title bar.
     * @type {?Element}
     * @private
     */
    this.titleCloseEl_ = null;
  
    /**
     * Element for the content area.
     * @type {?Element}
     * @private
     */
    this.contentEl_ = null;
  
    /**
     * Element for the button bar.
     * @type {?Element}
     * @private
     */
    this.buttonEl_ = null;
  
    /**
     * The dialog's preferred ARIA role.
     * @type {Role}
     * @private
     */
    this.preferredAriaRole_ = Role.DIALOG;
  
  
    /**
     * CSS class name for the dialog element, also used as a class name prefix for
     * related elements.  Defaults to google.getCssName('modal-dialog').
     * @type {string}
     * @private
     */
    this.class_ = opt_class || google.getCssName('modal-dialog');
  
    /**
     * Button set.  Default to Ok/Cancel.
     * @type {ButtonSet}
     * @private
     */
    this.buttons_ = ButtonSet.createOkCancel();
  }

  /** @override */
  getCssClass() {
    return this.class_;
  };

  /**
   * Sets the title.
   * @param {string} title The title text.
   */
  setTitle(title) {
    this.title_ = title;
    if (this.titleTextEl_) {
      googdom.setTextContent(this.titleTextEl_, title);
    }
  };

  /**
   * Gets the title.
   * @return {string} The title.
   */
  getTitle() {
    return this.title_;
  };

  /**
   * Allows plain text to be set in the content element.
   * @param {string} text Content plain text. Newlines are preserved.
   */
  setTextContent(text) {
    this.setSafeHtmlContent(
        SafeHtml.htmlEscapePreservingNewlines(text));
  };

  /**
   * Allows arbitrary HTML to be set in the content element.
   * @param {!SafeHtml} html Content HTML.
   */
  setSafeHtmlContent(html) {
    this.content_ = html;
    if (this.contentEl_) {
      safe.setInnerHtml(this.contentEl_, html);
    }
  };

  /**
   * Gets the content HTML of the content element as a plain string.
   *
   * Note that this method returns the HTML markup that was previously set via
   * setSafeHtmlContent() or setTextContent(). In particular, the HTML returned by
   * this method does not reflect any changes to the content element's DOM that
   * were made by other means.
   *
   * @return {string} Content HTML.
   */
  getContent() {
    return this.content_ != null ? SafeHtml.unwrap(this.content_) : '';
  };

  /**
   * Gets the content HTML of the content element.
   * @return {SafeHtml} Content HTML.
   */
  getSafeHtmlContent() {
    return this.content_;
  };

  /**
   * Returns the dialog's preferred ARIA role. This can be used to override the
   * default dialog role, e.g. with an ARIA role of ALERTDIALOG for a simple
   * warning or confirmation dialog.
   * @return {Role} This dialog's preferred ARIA role.
   */
  getPreferredAriaRole() {
    return this.preferredAriaRole_;
  };

  /**
   * Sets the dialog's preferred ARIA role. This can be used to override the
   * default dialog role, e.g. with an ARIA role of ALERTDIALOG for a simple
   * warning or confirmation dialog.
   * @param {Role} role This dialog's preferred ARIA role.
   */
  setPreferredAriaRole(role) {
    this.preferredAriaRole_ = role;
  };

  /**
   * Renders if the DOM is not created.
   * @private
   */
  renderIfNoDom_() {
    if (!this.getElement()) {
      // TODO(gboyer): Ideally we'd only create the DOM, but many applications
      // are requiring this behavior.  Eventually, it would be best if the
      // element getters could return null if the elements have not been
      // created.
      this.render();
    }
  };

  /**
   * Returns the content element so that more complicated things can be done with
   * the content area.  Renders if the DOM is not yet created.  Overrides
   * {@link goog.ui.Component#getContentElement}.
   * @return {Element} The content element.
   * @override
   */
  getContentElement() {
    this.renderIfNoDom_();
    return this.contentEl_;
  };

  /**
   * Returns the title element so that more complicated things can be done with
   * the title.  Renders if the DOM is not yet created.
   * @return {Element} The title element.
   */
  getTitleElement() {
    this.renderIfNoDom_();
    return this.titleEl_;
  };

  /**
   * Returns the title text element so that more complicated things can be done
   * with the text of the title.  Renders if the DOM is not yet created.
   * @return {Element} The title text element.
   */
  getTitleTextElement() {
    this.renderIfNoDom_();
    return this.titleTextEl_;
  };

  /**
   * Returns the title close element so that more complicated things can be done
   * with the close area of the title.  Renders if the DOM is not yet created.
   * @return {Element} The close box.
   */
  getTitleCloseElement() {
    this.renderIfNoDom_();
    return this.titleCloseEl_;
  };

  /**
   * Get the dialog close message.
   * @return {string}
   * @protected
   */
  getDialogCloseMessage() {
    return Dialog.MSG_GOOG_UI_DIALOG_CLOSE_;
  };

  /**
   * Returns the button element so that more complicated things can be done with
   * the button area.  Renders if the DOM is not yet created.
   * @return {Element} The button container element.
   */
  getButtonElement() {
    this.renderIfNoDom_();
    return this.buttonEl_;
  };

  /**
   * Returns the dialog element so that more complicated things can be done with
   * the dialog box.  Renders if the DOM is not yet created.
   * @return {Element} The dialog element.
   */
  getDialogElement() {
    this.renderIfNoDom_();
    return this.getElement();
  };

  /**
   * Returns the background mask element so that more complicated things can be
   * done with the background region.  Renders if the DOM is not yet created.
   * @return {Element} The background mask element.
   * @override
   */
  getBackgroundElement() {
    this.renderIfNoDom_();
    return super.getBackgroundElement();
  };

  /**
   * Gets the opacity of the background mask.
   * @return {number} Background mask opacity.
   */
  getBackgroundElementOpacity() {
    return this.backgroundElementOpacity_;
  };

  /**
   * Sets the opacity of the background mask.
   * @param {number} opacity Background mask opacity.
   */
  setBackgroundElementOpacity(opacity) {
    this.backgroundElementOpacity_ = opacity;
  
    if (this.getElement()) {
      var bgEl = this.getBackgroundElement();
      if (bgEl) {
        style.setOpacity(bgEl, this.backgroundElementOpacity_);
      }
    }
  };

  /**
   * Sets the modal property of the dialog. In case the dialog is already
   * inDocument, renders the modal background elements according to the specified
   * modal parameter.
   *
   * Note that non-modal dialogs cannot use an iframe mask.
   *
   * @param {boolean} modal Whether the dialog is modal.
   */
  setModal(modal) {
    if (modal != this.modal_) {
      this.setModalInternal_(modal);
    }
  };

  /**
   * Sets the modal property of the dialog.
   * @param {boolean} modal Whether the dialog is modal.
   * @private
   */
  setModalInternal_(modal) {
    this.modal_ = modal;
    if (this.isInDocument()) {
      var dom = this.getDomHelper();
      var bg = this.getBackgroundElement();
      var bgIframe = this.getBackgroundIframe();
      if (modal) {
        if (bgIframe) {
          dom.insertSiblingBefore(bgIframe, this.getElement());
        }
        dom.insertSiblingBefore(bg, this.getElement());
      } else {
        dom.removeNode(bgIframe);
        dom.removeNode(bg);
      }
    }
    if (this.isVisible()) {
      this.setA11YDetectBackground(modal);
    }
  };

  /**
   * @return {boolean} modal Whether the dialog is modal.
   */
  getModal() {
    return this.modal_;
  };

  /**
   * @return {string} The CSS class name for the dialog element.
   */
  getClass() {
    return this.getCssClass();
  };

  /**
   * Sets whether the dialog can be dragged.
   * @param {boolean} draggable Whether the dialog can be dragged.
   */
  setDraggable(draggable) {
    this.draggable_ = draggable;
    this.setDraggingEnabled_(draggable && this.isInDocument());
  };

  /**
   * Returns a dragger for moving the dialog and adds a class for the move cursor.
   * Defaults to allow dragging of the title only, but can be overridden if
   * different drag targets or dragging behavior is desired.
   * @return {!Fx_Dragger} The created dragger instance.
   * @protected
   */
  createDragger() {
    return new Fx_Dragger(this.getElement(), this.titleEl_);
  };

  /**
   * @return {boolean} Whether the dialog is draggable.
   */
  getDraggable() {
    return this.draggable_;
  };

  /**
   * Enables or disables dragging.
   * @param {boolean} enabled Whether to enable it.
   * @private
   */
  setDraggingEnabled_(enabled) {
    // This isn't ideal, but the quickest and easiest way to append
    // title-draggable to the last class in the class_ string, then trim and
    // split the string into an array (in case the dialog was set up with
    // multiple, space-separated class names).
    var classNames =
        strings.trim(google.getCssName(this.class_, 'title-draggable'))
            .split(' ');
  
    if (this.getElement()) {
      if (enabled) {
        classlist.addAll(asserts.assert(this.titleEl_), classNames);
      } else {
        classlist.removeAll(
            asserts.assert(this.titleEl_), classNames);
      }
    }
  
    if (enabled && !this.dragger_) {
      this.dragger_ = this.createDragger();
      classlist.addAll(asserts.assert(this.titleEl_), classNames);
      goog_events.listen(
          this.dragger_, DraggerEventType.START, this.setDraggerLimits_,
          false, this);
    } else if (!enabled && this.dragger_) {
      this.dragger_.dispose();
      this.dragger_ = null;
    }
  };

  /** @override */
  createDom() {
    super.createDom();
    var element = this.getElement();
    asserts.assert(element, 'getElement() returns null');
  
    var dom = this.getDomHelper();
    this.titleEl_ = dom.createDom(
        TagName.DIV, google.getCssName(this.class_, 'title'),
        this.titleTextEl_ = dom.createDom(
            TagName.SPAN, {
              'className': google.getCssName(this.class_, 'title-text'),
              'id': this.getId()
            },
            this.title_),
        this.titleCloseEl_ = dom.createDom(
            TagName.SPAN, google.getCssName(this.class_, 'title-close'))),
    googdom.append(
        element, this.titleEl_,
        this.contentEl_ = dom.createDom(
            TagName.DIV, google.getCssName(this.class_, 'content')),
        this.buttonEl_ = dom.createDom(
            TagName.DIV, google.getCssName(this.class_, 'buttons')));
  
    // Make the title and close button behave correctly with screen readers.
    // Note: this is only being added if the dialog is not decorated. Decorators
    // are expected to add aria label, role, and tab indexing in their templates.
    aria.setRole(this.titleTextEl_, Role.HEADING);
    aria.setRole(this.titleCloseEl_, Role.BUTTON);
    googdom.setFocusableTabIndex(this.titleCloseEl_, true);
    aria.setLabel(
        this.titleCloseEl_, Dialog.MSG_GOOG_UI_DIALOG_CLOSE_);
  
    this.titleTextId_ = this.titleTextEl_.id;
    aria.setRole(element, this.getPreferredAriaRole());
    aria.setState(
        element, State.LABELLEDBY, this.titleTextId_ || '');
    // If setContent() was called before createDom(), make sure the inner HTML of
    // the content element is initialized.
    if (this.content_) {
      safe.setInnerHtml(this.contentEl_, this.content_);
    }
    style.setElementShown(this.titleCloseEl_, this.hasTitleCloseButton_);
  
    // Render the buttons.
    if (this.buttons_) {
      this.buttons_.attachToElement(this.buttonEl_);
    }
    style.setElementShown(this.buttonEl_, !!this.buttons_);
    this.setBackgroundElementOpacity(this.backgroundElementOpacity_);
  };

  /** @override */
  decorateInternal(element) {
    super.decorateInternal(element);
    var dialogElement = this.getElement();
    asserts.assert(
        dialogElement, 'The DOM element for dialog cannot be null.');
    // Decorate or create the content element.
    var contentClass = google.getCssName(this.class_, 'content');
    this.contentEl_ = googdom.getElementsByTagNameAndClass(
        null, contentClass, dialogElement)[0];
    if (!this.contentEl_) {
      this.contentEl_ =
          this.getDomHelper().createDom(TagName.DIV, contentClass);
      if (this.content_) {
        safe.setInnerHtml(this.contentEl_, this.content_);
      }
      dialogElement.appendChild(this.contentEl_);
    }
  
    // Decorate or create the title bar element.
    var titleClass = google.getCssName(this.class_, 'title');
    var titleTextClass = google.getCssName(this.class_, 'title-text');
    var titleCloseClass = google.getCssName(this.class_, 'title-close');
    this.titleEl_ =
        googdom.getElementsByTagNameAndClass(null, titleClass, dialogElement)[0];
    if (this.titleEl_) {
      // Only look for title text & title close elements if a title bar element
      // was found.  Otherwise assume that the entire title bar has to be
      // created from scratch.
      this.titleTextEl_ = googdom.getElementsByTagNameAndClass(
          null, titleTextClass, this.titleEl_)[0];
      this.titleCloseEl_ = googdom.getElementsByTagNameAndClass(
          null, titleCloseClass, this.titleEl_)[0];
    } else {
      // Create the title bar element and insert it before the content area.
      // This is useful if the element to decorate only includes a content area.
      this.titleEl_ =
          this.getDomHelper().createDom(TagName.DIV, titleClass);
      dialogElement.insertBefore(this.titleEl_, this.contentEl_);
    }
  
    // Decorate or create the title text element.
    if (this.titleTextEl_) {
      this.title_ = googdom.getTextContent(this.titleTextEl_);
      // Give the title text element an id if it doesn't already have one.
      if (!this.titleTextEl_.id) {
        this.titleTextEl_.id = this.getId();
      }
    } else {
      this.titleTextEl_ = googdom.createDom(
          TagName.SPAN,
          {'className': titleTextClass, 'id': this.getId()});
      this.titleEl_.appendChild(this.titleTextEl_);
    }
    this.titleTextId_ = this.titleTextEl_.id;
    aria.setState(
        dialogElement, State.LABELLEDBY, this.titleTextId_ || '');
    // Decorate or create the title close element.
    if (!this.titleCloseEl_) {
      this.titleCloseEl_ =
          this.getDomHelper().createDom(TagName.SPAN, titleCloseClass);
      this.titleEl_.appendChild(this.titleCloseEl_);
    }
    style.setElementShown(this.titleCloseEl_, this.hasTitleCloseButton_);
  
    // Decorate or create the button container element.
    var buttonsClass = google.getCssName(this.class_, 'buttons');
    this.buttonEl_ = googdom.getElementsByTagNameAndClass(
        null, buttonsClass, dialogElement)[0];
    if (this.buttonEl_) {
      // Button container element found.  Create empty button set and use it to
      // decorate the button container.
      this.buttons_ = new ButtonSet(this.getDomHelper());
      this.buttons_.decorate(this.buttonEl_);
    } else {
      // Create new button container element, and render a button set into it.
      this.buttonEl_ =
          this.getDomHelper().createDom(TagName.DIV, buttonsClass);
      dialogElement.appendChild(this.buttonEl_);
      if (this.buttons_) {
        this.buttons_.attachToElement(this.buttonEl_);
      }
      style.setElementShown(this.buttonEl_, !!this.buttons_);
    }
    this.setBackgroundElementOpacity(this.backgroundElementOpacity_);
  };

  /** @override */
  enterDocument() {
    super.enterDocument();
  
    // Listen for keyboard events while the dialog is visible.
    this.getHandler()
        .listen(this.getElement(), EventsEventType.KEYDOWN, this.onKey_)
        .listen(this.getElement(), EventsEventType.KEYPRESS, this.onKey_);
  
    // NOTE: see bug 1163154 for an example of an edge case where making the
    // dialog visible in response to a KEYDOWN will result in a CLICK event
    // firing on the default button (immediately closing the dialog) if the key
    // that fired the KEYDOWN is also normally used to activate controls
    // (i.e. SPACE/ENTER).
    //
    // This could be worked around by attaching the onButtonClick_ handler in a
    // setTimeout, but that was deemed undesirable.
    this.getHandler().listen(
        this.buttonEl_, EventsEventType.CLICK, this.onButtonClick_);
  
    // Add drag support.
    this.setDraggingEnabled_(this.draggable_);
  
    // Add event listeners to the close box and the button container.
    this.getHandler().listen(
        this.titleCloseEl_, EventsEventType.CLICK, this.onTitleCloseClick_);
  
    var element = this.getElement();
    asserts.assert(element, 'The DOM element for dialog cannot be null');
    aria.setRole(element, this.getPreferredAriaRole());
    if (this.titleTextEl_.id !== '') {
      aria.setState(
          element, State.LABELLEDBY, this.titleTextEl_.id);
    }
  
    if (!this.modal_) {
      this.setModalInternal_(false);
    }
  };

  /** @override */
  exitDocument() {
    if (this.isVisible()) {
      this.setVisible(false);
    }
  
    // Remove drag support.
    this.setDraggingEnabled_(false);
  
    super.exitDocument();
  };

  /**
   * Sets the visibility of the dialog box and moves focus to the
   * default button. Lazily renders the component if needed. After this
   * method returns, isVisible() will always return the new state, even
   * if there is a transition.
   * @param {boolean} visible Whether the dialog should be visible.
   * @override
   */
  setVisible(visible) {
    if (visible == this.isVisible()) {
      return;
    }
  
    // If the dialog hasn't been rendered yet, render it now.
    if (!this.isInDocument()) {
      this.render();
    }
  
    super.setVisible(visible);
  };

  /**
   * @override
   * @suppress {deprecated} AFTER_SHOW is deprecated earlier in this file.
   */
  onShow() {
    super.onShow();
    this.dispatchEvent(EventType.AFTER_SHOW);
  };

  /**
   * @override
   * @suppress {deprecated} AFTER_HIDE is deprecated earlier in this file.
   */
  onHide() {
    super.onHide();
    this.dispatchEvent(EventType.AFTER_HIDE);
    if (this.disposeOnHide_) {
      this.dispose();
    }
  };

  /**
   * Sets dragger limits when dragging is started.
   * @param {!EventsEvent} e DraggerEventType.START event.
   * @private
   */
  setDraggerLimits_(e) {
    var doc = this.getDomHelper().getDocument();
    var win = googdom.getWindow(doc) || window;
  
    // Take the max of scroll height and view height for cases in which document
    // does not fill screen.
    var viewSize = googdom.getViewportSize(win);
    var w = Math.max(doc.body.scrollWidth, viewSize.width);
    var h = Math.max(doc.body.scrollHeight, viewSize.height);
  
    var dialogSize = style.getSize(this.getElement());
    if (style.getComputedPosition(this.getElement()) == 'fixed') {
      // Ensure position:fixed dialogs can't be dragged beyond the viewport.
      this.dragger_.setLimits(
          new Rect(
              0, 0, Math.max(0, viewSize.width - dialogSize.width),
              Math.max(0, viewSize.height - dialogSize.height)));
    } else {
      this.dragger_.setLimits(
          new Rect(0, 0, w - dialogSize.width, h - dialogSize.height));
    }
  };

  /**
   * Handles a click on the title close area.
   * @param {EventsBrowserEvent} e Browser's event object.
   * @private
   */
  onTitleCloseClick_(e) {
    this.handleTitleClose_();
  };

  /**
   * Performs the action of closing the dialog in response to the title close
   * button being interacted with. General purpose method to be called by click
   * and button event handlers.
   * @private
   */
  handleTitleClose_() {
    if (!this.hasTitleCloseButton_) {
      return;
    }
  
    var bs = this.getButtonSet();
    var key = bs && bs.getCancel();
    // Only if there is a valid cancel button is an event dispatched.
    if (key) {
      var caption = /** @type {Element|string} */ (bs.get(key));
      if (this.dispatchEvent(new Dialog_Event(key, caption))) {
        this.setVisible(false);
      }
    } else {
      this.setVisible(false);
    }
  };

  /**
   * @return {boolean} Whether this dialog has a title close button.
   */
  getHasTitleCloseButton() {
    return this.hasTitleCloseButton_;
  };

  /**
   * Sets whether the dialog should have a close button in the title bar. There
   * will always be an element for the title close button, but setting this
   * parameter to false will cause it to be hidden and have no active listener.
   * @param {boolean} b Whether this dialog should have a title close button.
   */
  setHasTitleCloseButton(b) {
    this.hasTitleCloseButton_ = b;
    if (this.titleCloseEl_) {
      style.setElementShown(this.titleCloseEl_, this.hasTitleCloseButton_);
    }
  };

  /**
   * @return {boolean} Whether the escape key should close this dialog.
   */
  isEscapeToCancel() {
    return this.escapeToCancel_;
  };

  /**
   * @param {boolean} b Whether the escape key should close this dialog.
   */
  setEscapeToCancel(b) {
    this.escapeToCancel_ = b;
  };

  /**
   * Sets whether the dialog should be disposed when it is hidden.  By default
   * dialogs are not disposed when they are hidden.
   * @param {boolean} b Whether the dialog should get disposed when it gets
   *     hidden.
   */
  setDisposeOnHide(b) {
    this.disposeOnHide_ = b;
  };

  /**
   * @return {boolean} Whether the dialog should be disposed when it is hidden.
   */
  getDisposeOnHide() {
    return this.disposeOnHide_;
  };

  /** @override */
  disposeInternal() {
    this.titleCloseEl_ = null;
    this.buttonEl_ = null;
    super.disposeInternal();
  };

  /**
   * Sets the button set to use.
   * Note: Passing in null will cause no button set to be rendered.
   * @param {ButtonSet?} buttons The button set to use.
   */
  setButtonSet(buttons) {
    this.buttons_ = buttons;
    if (this.buttonEl_) {
      if (this.buttons_) {
        this.buttons_.attachToElement(this.buttonEl_);
      } else {
        safe.setInnerHtml(this.buttonEl_, SafeHtml.EMPTY);
      }
      style.setElementShown(this.buttonEl_, !!this.buttons_);
    }
  };

  /**
   * Returns the button set being used.
   * @return {ButtonSet?} The button set being used.
   */
  getButtonSet() {
    return this.buttons_;
  };

  /**
   * Handles a click on the button container.
   * @param {EventsBrowserEvent} e Browser's event object.
   * @private
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  onButtonClick_(e) {
    var button = this.findParentButton_(/** @type {Element} */ (e.target));
    if (button && !button.disabled) {
      var key = button.name;
      var caption = /** @type {Element|string} */ (this.getButtonSet().get(key));
      if (this.dispatchEvent(new Dialog_Event(key, caption))) {
        this.setVisible(false);
      }
    }
  };

  /**
   * Finds the parent button of an element (or null if there was no button
   * parent).
   * @param {Element} element The element that was clicked on.
   * @return {Element} Returns the parent button or null if not found.
   * @private
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  findParentButton_(element) {
    var el = element;
    while (el != null && el != this.buttonEl_) {
      if (el.tagName == TagName.BUTTON) {
        return /** @type {Element} */ (el);
      }
      el = el.parentNode;
    }
    return null;
  };

  /**
   * Handles keydown and keypress events, and dismisses the popup if cancel is
   * pressed.  If there is a cancel action in the ButtonSet, than that will be
   * fired.  Also prevents tabbing out of the dialog.
   * @param {EventsBrowserEvent} e Browser's event object.
   * @private
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  onKey_(e) {
    var close = false;
    var hasHandler = false;
    var buttonSet = this.getButtonSet();
    var target = e.target;
  
    if (e.type == EventsEventType.KEYDOWN) {
      // Escape and tab can only properly be handled in keydown handlers.
      if (this.escapeToCancel_ && e.keyCode == KeyCodes.ESC) {
        // Only if there is a valid cancel button is an event dispatched.
        var cancel = buttonSet && buttonSet.getCancel();
  
        // Users may expect to hit escape on a SELECT element.
        var isSpecialFormElement =
            target.tagName == TagName.SELECT && !target.disabled;
  
        if (cancel && !isSpecialFormElement) {
          hasHandler = true;
  
          var caption = buttonSet.get(cancel);
          close = this.dispatchEvent(
              new Dialog_Event(
                  cancel,
                  /** @type {Element|null|string} */ (caption)));
        } else if (!isSpecialFormElement) {
          close = true;
        }
      } else if (
          e.keyCode == KeyCodes.TAB && e.shiftKey &&
          target == this.getElement()) {
        // Prevent the user from shift-tabbing backwards out of the dialog box.
        // Instead, set up a wrap in focus backward to the end of the dialog.
        this.setupBackwardTabWrap();
      }
    } else if (e.keyCode == KeyCodes.ENTER) {
      // Only handle ENTER in keypress events, in case the action opens a
      // popup window.
      var key;
      if (target.tagName == TagName.BUTTON && !target.disabled) {
        // If the target is a button and it's enabled, we can fire that button's
        // handler.
        key = target.name;
      } else if (target == this.titleCloseEl_) {
        // if the title 'close' button is in focus, close the dialog
        this.handleTitleClose_();
      } else if (buttonSet) {
        // Try to fire the default button's handler (if one exists), but only if
        // the button is enabled.
        var defaultKey = buttonSet.getDefault();
        var defaultButton = defaultKey && buttonSet.getButton(defaultKey);
  
        // Users may expect to hit enter on a TEXTAREA, SELECT or an A element.
        var isSpecialFormElement = (target.tagName == TagName.TEXTAREA ||
                                    target.tagName == TagName.SELECT ||
                                    target.tagName == TagName.A) &&
            !target.disabled;
  
        if (defaultButton && !defaultButton.disabled && !isSpecialFormElement) {
          key = defaultKey;
        }
      }
      if (key && buttonSet) {
        hasHandler = true;
        close = this.dispatchEvent(
            new Dialog_Event(key, String(buttonSet.get(key))));
      }
    } else if (
        target == this.titleCloseEl_ &&
        (e.keyCode == KeyCodes.SPACE ||
         e.key == Keys.SPACE)) {
      // if the title 'close' button is in focus on 'SPACE,' close the dialog
      this.handleTitleClose_();
    }
  
    if (close || hasHandler) {
      e.stopPropagation();
      e.preventDefault();
    }
  
    if (close) {
      this.setVisible(false);
    }
  };
}

// google.tagUnsealableClass(Dialog);

/**
 * Dialog event class.
 * @extends {EventsEvent}
 */
class Dialog_Event extends EventsEvent {

  /**
   * Dialog event class.
   * @param {string} key Key identifier for the button.
   * @param {string|Element} caption Caption on the button (might be i18nlized).
   */
  constructor(key, caption) {
    super(EventType.SELECT);
    
    /** @const {!EventType} */
    this.type = EventType.SELECT;
    /** @const */
    this.key = key;
    /** @const */
    this.caption = caption;
  }
}

/**
 * Event type constant for dialog events.
 * TODO(attila): Change this to EventType.SELECT.
 * @type {string}
 * @deprecated Use EventType.SELECT.
 */
Dialog.SELECT_EVENT = 'dialogselect';

/**
 * Events dispatched by dialogs.
 * @enum {string}
 * @override
 * @suppress {checkTypes}
 */
let EventType = {
  /**
   * Dispatched when the user closes the dialog.
   * The dispatched event will always be of type {@link Dialog_Event}.
   * Canceling the event will prevent the dialog from closing.
   */
  SELECT: 'dialogselect',

  /**
   * Dispatched after the dialog is closed. Not cancelable.
   * @deprecated Use goog.ui.PopupBase.EventType.HIDE.
   */
  AFTER_HIDE: 'afterhide',

  /**
   * Dispatched after the dialog is shown. Not cancelable.
   * @deprecated Use goog.ui.PopupBase.EventType.SHOW.
   */
  AFTER_SHOW: 'aftershow'
};

/**
 * A button set defines the behaviour of a set of buttons that the dialog can
 * show.  Uses the {@link goog.structs.Map} interface.
 *    goog.ui.Component} for semantics.
 * @extends {UiMap}
 */
class ButtonSet extends UiMap {

  /**
   * A button set defines the behaviour of a set of buttons that the dialog can
   * show.  Uses the {@link goog.structs.Map} interface.
   * @param {DomHelper=} opt_domHelper Optional DOM helper; see {@link
   *    goog.ui.Component} for semantics.
   */
  constructor(opt_domHelper) {
    super();
    // TODO(attila):  Refactor ButtonSet to extend goog.ui.Component?
    this.dom_ = opt_domHelper || googdom.getDomHelper();
  
  
    /**
     * A CSS className for this component.
     * @private @const {string}
     */
    this.class_ = google.getCssName('goog-buttonset');
  
  
    /**
     * The button that has default focus (references key in buttons_ map).
     * @private {?string}
     */
    this.defaultButton_ = null;
  
  
    /**
     * Optional container the button set should be rendered into.
     * @private {?Element}
     */
    this.element_ = null;
  
  
    /**
     * The button whose action is associated with the escape key and the X button
     * on the dialog.
     * @private {?string}
     */
    this.cancelButton_ = null;
  }

  /** @override */
  clear() {
    UiMap.prototype.clear.call(this);
    this.defaultButton_ = this.cancelButton_ = null;
  };

  /**
   * Adds a button to the button set.  Buttons will be displayed in the order they
   * are added.
   *
   * @param {*} key Key used to identify the button in events.
   * @param {*} caption A string caption or a DOM node that can be
   *     appended to a button element.
   * @param {boolean=} opt_isDefault Whether this button is the default button,
   *     Dialog will dispatch for this button if enter is pressed.
   * @param {boolean=} opt_isCancel Whether this button has the same behaviour as
   *    cancel.  If escape is pressed this button will fire.
   * @return {!ButtonSet} The button set, to make it easy to chain
   *    "set" calls and build new ButtonSets.
   * @override
   */
  set(
      key, caption, opt_isDefault, opt_isCancel) {
    UiMap.prototype.set.call(this, key, caption);
  
    if (opt_isDefault) {
      this.defaultButton_ = /** @type {?string} */ (key);
    }
    if (opt_isCancel) {
      this.cancelButton_ = /** @type {?string} */ (key);
    }
  
    return this;
  };

  /**
   * Adds a button (an object with a key and caption) to this button set. Buttons
   * will be displayed in the order they are added.
   * @see Dialog.DefaultButtons
   * @param {{key: string, caption: string}} button The button key and caption.
   * @param {boolean=} opt_isDefault Whether this button is the default button.
   *     Dialog will dispatch for this button if enter is pressed.
   * @param {boolean=} opt_isCancel Whether this button has the same behavior as
   *     cancel. If escape is pressed this button will fire.
   * @return {!ButtonSet} The button set, to make it easy to chain
   *     "addButton" calls and build new ButtonSets.
   */
  addButton(
      button, opt_isDefault, opt_isCancel) {
    return this.set(button.key, button.caption, opt_isDefault, opt_isCancel);
  };

  /**
   * Attaches the button set to an element, rendering it inside.
   * @param {Element} el Container.
   */
  attachToElement(el) {
    this.element_ = el;
    this.render();
  };

  /**
   * Renders the button set inside its container element.
   */
  render() {
    if (this.element_) {
      safe.setInnerHtml(this.element_, SafeHtml.EMPTY);
      var domHelper = googdom.getDomHelper(this.element_);
      this.forEach(function(caption, key) {
        var button =
            domHelper.createDom(TagName.BUTTON, {'name': key}, caption);
        if (key == this.defaultButton_) {
          button.className = google.getCssName(this.class_, 'default');
        }
        this.element_.appendChild(button);
      }, this);
    }
  };

  /**
   * Decorates the given element by adding any `button` elements found
   * among its descendants to the button set.  The first button found is assumed
   * to be the default and will receive focus when the button set is rendered.
   * If a button with a name of {@link DefaultButtonKeys.CANCEL}
   * is found, it is assumed to have "Cancel" semantics.
   * TODO(attila):  ButtonSet should be a goog.ui.Component.  Really.
   * @param {Element} element The element to decorate; should contain buttons.
   */
  decorate(element) {
    if (!element || element.nodeType != NodeType.ELEMENT) {
      return;
    }
  
    this.element_ = element;
    var buttons =
        googdom.getElementsByTagName(TagName.BUTTON, this.element_);
    for (var i = 0, button, key, caption; button = buttons[i]; i++) {
      // Buttons should have a "name" attribute and have their caption defined by
      // their innerHTML, but not everyone knows this, and we should play nice.
      key = button.name || button.id;
      caption = googdom.getTextContent(button) || button.value;
      if (key) {
        var isDefault = i == 0;
        var isCancel = button.name == DefaultButtonKeys.CANCEL;
        this.set(key, caption, isDefault, isCancel);
        if (isDefault) {
          classlist.add(button, google.getCssName(this.class_, 'default'));
        }
      }
    }
  };

  /**
   * Gets the component's element.
   * @return {Element} The element for the component.
   * TODO(user): Remove after refactoring to goog.ui.Component.
   */
  getElement() {
    return this.element_;
  };

  /**
   * Returns the dom helper that is being used on this component.
   * @return {!DomHelper} The dom helper used on this component.
   * TODO(user): Remove after refactoring to goog.ui.Component.
   */
  getDomHelper() {
    return this.dom_;
  };

  /**
   * Sets the default button.
   * @param {?string} key The default button.
   */
  setDefault(key) {
    this.defaultButton_ = key;
  };

  /**
   * Returns the default button.
   * @return {?string} The default button.
   */
  getDefault() {
    return this.defaultButton_;
  };

  /**
   * Sets the cancel button.
   * @param {?string} key The cancel button.
   */
  setCancel(key) {
    this.cancelButton_ = key;
  };

  /**
   * Returns the cancel button.
   * @return {?string} The cancel button.
   */
  getCancel() {
    return this.cancelButton_;
  };

  /**
   * Returns the HTML Button element.
   * @param {string} key The button to return.
   * @return {Element} The button, if found else null.
   */
  getButton(key) {
    var buttons = this.getAllButtons();
    for (var i = 0, nextButton; nextButton = buttons[i]; i++) {
      if (nextButton.name == key || nextButton.id == key) {
        return nextButton;
      }
    }
    return null;
  };

  /**
   * Returns all the HTML Button elements in the button set container.
   * @return {!IArrayLike<!Element>} A live NodeList of the buttons.
   */
  getAllButtons() {
    return googdom.getElementsByTagName(
        TagName.BUTTON, asserts.assert(this.element_));
  };

  /**
   * Enables or disables a button in this set by key. If the button is not found,
   * does nothing.
   * @param {string} key The button to enable or disable.
   * @param {boolean} enabled True to enable; false to disable.
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  setButtonEnabled(key, enabled) {
    var button = this.getButton(key);
    if (button) {
      button.disabled = !enabled;
    }
  };

  /**
   * Enables or disables all of the buttons in this set.
   * @param {boolean} enabled True to enable; false to disable.
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  setAllButtonsEnabled(enabled) {
    var allButtons = this.getAllButtons();
    for (var i = 0, button; button = allButtons[i]; i++) {
      button.disabled = !enabled;
    }
  };

  /**
   * Creates a new ButtonSet with a single 'OK' button, which is also set with
   * cancel button semantics so that pressing escape will close the dialog.
   * @return {!ButtonSet} The created ButtonSet.
   */
  static createOk() {
    return new ButtonSet().addButton(
        DefaultButtons.OK, true, true);
  };

  /**
   * Creates a new ButtonSet with 'OK' (default) and 'Cancel' buttons.
   * @return {!ButtonSet} The created ButtonSet.
   */
  static createOkCancel() {
    return new ButtonSet()
        .addButton(DefaultButtons.OK, true)
        .addButton(DefaultButtons.CANCEL, false, true);
  };

  /**
   * Creates a new ButtonSet with 'Yes' (default) and 'No' buttons.
   * @return {!ButtonSet} The created ButtonSet.
   */
  static createYesNo() {
    return new ButtonSet()
        .addButton(DefaultButtons.YES, true)
        .addButton(DefaultButtons.NO, false, true);
  };

  /**
   * Creates a new ButtonSet with 'Yes', 'No' (default), and 'Cancel' buttons.
   * @return {!ButtonSet} The created ButtonSet.
   */
  static createYesNoCancel() {
    return new ButtonSet()
        .addButton(DefaultButtons.YES)
        .addButton(DefaultButtons.NO, true)
        .addButton(DefaultButtons.CANCEL, false, true);
  };

  /**
   * Creates a new ButtonSet with 'Continue', 'Save', and 'Cancel' (default)
   * buttons.
   * @return {!ButtonSet} The created ButtonSet.
   */
  static createContinueSaveCancel() {
    return new ButtonSet()
        .addButton(DefaultButtons.CONTINUE)
        .addButton(DefaultButtons.SAVE)
        .addButton(DefaultButtons.CANCEL, true, true);
  };
}

// google.tagUnsealableClass(ButtonSet);

/**
 * The keys used to identify standard buttons in events.
 * @enum {string}
 */
let DefaultButtonKeys = {
  OK: 'ok',
  CANCEL: 'cancel',
  YES: 'yes',
  NO: 'no',
  SAVE: 'save',
  CONTINUE: 'continue'
};

/**
 * @desc Standard caption for the dialog 'OK' button.
 * @private
 */
Dialog.MSG_DIALOG_OK_ = google.getMsg('OK');

/**
 * @desc Standard caption for the dialog 'Cancel' button.
 * @private
 */
Dialog.MSG_DIALOG_CANCEL_ = google.getMsg('Cancel');

/**
 * @desc Standard caption for the dialog 'Yes' button.
 * @private
 */
Dialog.MSG_DIALOG_YES_ = google.getMsg('Yes');

/**
 * @desc Standard caption for the dialog 'No' button.
 * @private
 */
Dialog.MSG_DIALOG_NO_ = google.getMsg('No');

/**
 * @desc Standard caption for the dialog 'Save' button.
 * @private
 */
Dialog.MSG_DIALOG_SAVE_ = google.getMsg('Save');

/**
 * @desc Standard caption for the dialog 'Continue' button.
 * @private
 */
Dialog.MSG_DIALOG_CONTINUE_ = google.getMsg('Continue');

/**
 * @desc Standard label for the dialog 'X' (close) button.
 * @private
 */
Dialog.MSG_GOOG_UI_DIALOG_CLOSE_ = google.getMsg('Close');

/**
 * The default captions for the default buttons.
 * @enum {string}
 */
let DefaultButtonCaptions = {
  OK: Dialog.MSG_DIALOG_OK_,
  CANCEL: Dialog.MSG_DIALOG_CANCEL_,
  YES: Dialog.MSG_DIALOG_YES_,
  NO: Dialog.MSG_DIALOG_NO_,
  SAVE: Dialog.MSG_DIALOG_SAVE_,
  CONTINUE: Dialog.MSG_DIALOG_CONTINUE_
};

/**
 * The standard buttons (keys associated with captions).
 * @enum {{key: string, caption: string}}
 */
let DefaultButtons = {
  OK: {
    key: DefaultButtonKeys.OK,
    caption: DefaultButtonCaptions.OK
  },
  CANCEL: {
    key: DefaultButtonKeys.CANCEL,
    caption: DefaultButtonCaptions.CANCEL
  },
  YES: {
    key: DefaultButtonKeys.YES,
    caption: DefaultButtonCaptions.YES
  },
  NO: {
    key: DefaultButtonKeys.NO,
    caption: DefaultButtonCaptions.NO
  },
  SAVE: {
    key: DefaultButtonKeys.SAVE,
    caption: DefaultButtonCaptions.SAVE
  },
  CONTINUE: {
    key: DefaultButtonKeys.CONTINUE,
    caption: DefaultButtonCaptions.CONTINUE
  }
};

// TODO(user): These shared instances should be phased out.
(function() {
  if (typeof document != 'undefined') {
    /** @deprecated Use ButtonSet#createOk. */
    ButtonSet.OK = ButtonSet.createOk();

    /** @deprecated Use ButtonSet#createOkCancel. */
    ButtonSet.OK_CANCEL =
        ButtonSet.createOkCancel();

    /** @deprecated Use ButtonSet#createYesNo. */
    ButtonSet.YES_NO = ButtonSet.createYesNo();

    /** @deprecated Use ButtonSet#createYesNoCancel. */
    ButtonSet.YES_NO_CANCEL =
        ButtonSet.createYesNoCancel();

    /** @deprecated Use ButtonSet#createContinueSaveCancel. */
    ButtonSet.CONTINUE_SAVE_CANCEL =
        ButtonSet.createContinueSaveCancel();
  }
})();

export {ButtonSet, DefaultButtonCaptions, DefaultButtonKeys, DefaultButtons, Dialog, Dialog_Event as Event, EventType};