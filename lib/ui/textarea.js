import * as asserts from './../asserts/asserts.js';
import * as classlist from './../dom/classlist.js';
import * as goog_dom from './../dom/dom.js';
import {DomHelper} from './../dom/dom.js';
import {BrowserEvent as EventsBrowserEvent} from './../events/browserevent.js';
import {Event as EventsEvent} from './../events/event.js';
import {EventType as EventsEventType} from './../events/eventtype.js';
import * as google from './../google.js';
import {Box} from './../math/box.js';
import * as style from './../style/style.js';
import * as userAgent from './../useragent/useragent.js';
import {Control} from './control.js';
import {TextareaRenderer} from './textarearenderer.js';
// Copyright 2010 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview A content-aware textarea control that grows and shrinks
 * automatically. This implementation extends {@link Control}.
 * This code is inspired by Dojo Dijit's Textarea implementation with
 * modifications to support native (when available) textarea resizing and
 * minHeight and maxHeight enforcement.
 *
 * @see ../demos/textarea.html
 */

/**
 * A textarea control to handle growing/shrinking with textarea.value.
 *
 *     decorate the textarea. Defaults to {@link TextareaRenderer}.
 *     document interaction.
 * @extends {Control<TextareaRenderer>}
 */
class Textarea extends Control {

  /**
   * A textarea control to handle growing/shrinking with textarea.value.
   *
   * @param {string} content Text to set as the textarea's value.
   * @param {TextareaRenderer=} opt_renderer Renderer used to render or
   *     decorate the textarea. Defaults to {@link TextareaRenderer}.
   * @param {DomHelper=} opt_domHelper Optional DOM helper, used for
   *     document interaction.
   */
  constructor(content, opt_renderer, opt_domHelper) {
    super(content, opt_renderer || TextareaRenderer.getInstance(),
        opt_domHelper);
    /**
     * True if the resizing function is executing, false otherwise.
     * @type {boolean}
     * @private
     */
    this.isResizing_ = false;
  
    /**
     * Represents if we have focus on the textarea element, used only
     * to render the placeholder if we don't have native placeholder
     * support.
     * @type {boolean}
     * @private
     */
    this.hasFocusForPlaceholder_ = false;
  
    /**
     * @type {boolean}
     * @private
     */
    this.hasUserInput_ = false;
  
    /**
     * The height of the textarea as last measured.
     * @type {number}
     * @private
     */
    this.height_ = 0;
  
    /**
     * A maximum height for the textarea. When set to 0, the default, there is no
     * enforcement of this value during resize.
     * @type {number}
     * @private
     */
    this.maxHeight_ = 0;
  
    /**
     * A minimum height for the textarea. When set to 0, the default, there is no
     * enforcement of this value during resize.
     * @type {number}
     * @private
     */
    this.minHeight_ = 0;
  
    /**
     * Whether or not textarea rendering characteristics have been discovered.
     * Specifically we determine, at runtime:
     *    If the padding and border box is included in offsetHeight.
     *    @see {Textarea.prototype.needsPaddingBorderFix_}
     *    If the padding and border box is included in scrollHeight.
     *    @see {Textarea.prototype.scrollHeightIncludesPadding_} and
     *    @see {Textarea.prototype.scrollHeightIncludesBorder_}
     * TODO(user): See if we can determine Textarea.NEEDS_HELP_SHRINKING_.
     * @type {boolean}
     * @private
     */
    this.hasDiscoveredTextareaCharacteristics_ = false;
  
    /**
     * If a user agent doesn't correctly support the box-sizing:border-box CSS
     * value then we'll need to adjust our height calculations.
     * @see {Textarea.prototype.discoverTextareaCharacteristics_}
     * @type {boolean}
     * @private
     */
    this.needsPaddingBorderFix_ = false;
  
    /**
     * Whether or not scrollHeight of a textarea includes the padding box.
     * @type {boolean}
     * @private
     */
    this.scrollHeightIncludesPadding_ = false;
  
    /**
     * Whether or not scrollHeight of a textarea includes the border box.
     * @type {boolean}
     * @private
     */
    this.scrollHeightIncludesBorder_ = false;
  
    /**
     * For storing the padding box size during enterDocument, to prevent possible
     * measurement differences that can happen after text zooming.
     * Note: runtime padding changes will cause problems with this.
     * @type {Box}
     * @private
     */
    this.paddingBox_ = null;
  
    /**
     * For storing the border box size during enterDocument, to prevent possible
     * measurement differences that can happen after text zooming.
     * Note: runtime border width changes will cause problems with this.
     * @type {Box}
     * @private
     */
    this.borderBox_ = null;
  
    /**
     * Default text content for the textarea when it is unchanged and unfocussed.
     * We use the placeholder attribute for all browsers that have support for
     * it (new in HTML5 for the following browsers:
     *
     *   Internet Explorer 10.0
     *   Firefox 4.0
     *   Opera 11.6
     *   Chrome 4.0
     *   Safari 5.0
     *
     * For older browsers, we save the placeholderText_ and set it as the element's
     * value and add the TEXTAREA_PLACEHOLDER_CLASS to indicate that it's a
     * placeholder string.
     * @type {string}
     * @private
     */
    this.placeholderText_ = '';
  
  
    this.setHandleMouseEvents(false);
    this.setAllowTextSelection(true);
    this.hasUserInput_ = (content != '');
    if (!content) {
      this.setContentInternal('');
    }
  }

  /**
   * Sets the default text for the textarea.
   * @param {string} text The default text for the textarea.
   */
  setPlaceholder(text) {
    this.placeholderText_ = text;
    if (this.getElement()) {
      this.restorePlaceholder_();
    }
  };

  /**
   * @return {number} The padding plus the border box height.
   * @private
   */
  getPaddingBorderBoxHeight_() {
    var paddingBorderBoxHeight = this.paddingBox_.top + this.paddingBox_.bottom +
        this.borderBox_.top + this.borderBox_.bottom;
    return paddingBorderBoxHeight;
  };

  /**
   * @return {number} The minHeight value.
   */
  getMinHeight() {
    return this.minHeight_;
  };

  /**
   * @return {number} The minHeight value with a potential padding fix.
   * @private
   */
  getMinHeight_() {
    var minHeight = this.minHeight_;
    var textarea = this.getElement();
    if (minHeight && textarea && this.needsPaddingBorderFix_) {
      minHeight -= this.getPaddingBorderBoxHeight_();
    }
    return minHeight;
  };

  /**
   * Sets a minimum height for the textarea, and calls resize if rendered.
   * @param {number} height New minHeight value.
   */
  setMinHeight(height) {
    this.minHeight_ = height;
    this.resize();
  };

  /**
   * @return {number} The maxHeight value.
   */
  getMaxHeight() {
    return this.maxHeight_;
  };

  /**
   * @return {number} The maxHeight value with a potential padding fix.
   * @private
   */
  getMaxHeight_() {
    var maxHeight = this.maxHeight_;
    var textarea = this.getElement();
    if (maxHeight && textarea && this.needsPaddingBorderFix_) {
      maxHeight -= this.getPaddingBorderBoxHeight_();
    }
    return maxHeight;
  };

  /**
   * Sets a maximum height for the textarea, and calls resize if rendered.
   * @param {number} height New maxHeight value.
   */
  setMaxHeight(height) {
    this.maxHeight_ = height;
    this.resize();
  };

  /**
   * Sets the textarea's value.
   * @param {*} value The value property for the textarea, will be cast to a
   *     string by the browser when setting textarea.value.
   */
  setValue(value) {
    this.setContent(String(value));
  };

  /**
   * Gets the textarea's value.
   * @return {string} value The value of the textarea.
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  getValue() {
    // We potentially have the placeholder stored in the value.
    // If a client of this class sets this.getElement().value directly
    // we don't set the this.hasUserInput_ boolean. Thus, we need to
    // explicitly check if the value != the placeholder text. This has
    // the unfortunate edge case of:
    //   If the client sets this.getElement().value to the placeholder
    //   text, we'll return the empty string.
    // The normal use case shouldn't be an issue, however, since the
    // default placeholderText is the empty string. Also, if the end user
    // inputs text, then this.hasUserInput_ will always be true.
    if (this.getElement().value != this.placeholderText_ ||
        this.supportsNativePlaceholder_() || this.hasUserInput_) {
      // We don't do anything fancy here.
      return this.getElement().value;
    }
    return '';
  };

  /** @override */
  setContent(content) {
    super.setContent(content);
    this.hasUserInput_ = (content != '');
    this.resize();
  };

  /**
   * @override *
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  setEnabled(enable) {
    super.setEnabled(enable);
    this.getElement().disabled = !enable;
  };

  /**
   * Resizes the textarea vertically.
   */
  resize() {
    if (this.getElement()) {
      this.grow_();
    }
  };

  /**
   * @return {boolean} True if the element supports the placeholder attribute.
   * @private
   */
  supportsNativePlaceholder_() {
    asserts.assert(this.getElement());
    return 'placeholder' in this.getElement();
  };

  /**
   * Sets the value of the textarea element to the default text.
   * @private
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  restorePlaceholder_() {
    if (!this.placeholderText_) {
      // Return early if there is no placeholder to mess with.
      return;
    }
    // Check again in case something changed since this was scheduled.
    // We check that the element is still there since this is called by a timer
    // and the dispose method may have been called prior to this.
    if (this.supportsNativePlaceholder_()) {
      this.getElement().placeholder = this.placeholderText_;
    } else if (
        this.getElement() && !this.hasUserInput_ &&
        !this.hasFocusForPlaceholder_) {
      // We only want to set the value + placeholder CSS if we actually have
      // some placeholder text to show.
      classlist.add(
          asserts.assert(this.getElement()),
          Textarea.TEXTAREA_PLACEHOLDER_CLASS);
      this.getElement().value = this.placeholderText_;
    }
  };

  /** @override **/
  enterDocument() {
    super.enterDocument();
    var textarea = this.getElement();
  
    // Eliminates the vertical scrollbar and changes the box-sizing mode for the
    // textarea to the border-box (aka quirksmode) paradigm.
    style.setStyle(textarea, {
      'overflowY': 'hidden',
      'overflowX': 'auto',
      'boxSizing': 'border-box',
      'MsBoxSizing': 'border-box',
      'WebkitBoxSizing': 'border-box',
      'MozBoxSizing': 'border-box'
    });
  
    this.paddingBox_ = style.getPaddingBox(textarea);
    this.borderBox_ = style.getBorderBox(textarea);
  
    this.getHandler()
        .listen(textarea, EventsEventType.SCROLL, this.grow_)
        .listen(textarea, EventsEventType.FOCUS, this.grow_)
        .listen(textarea, EventsEventType.KEYUP, this.grow_)
        .listen(textarea, EventsEventType.MOUSEUP, this.mouseUpListener_)
        .listen(textarea, EventsEventType.BLUR, this.blur_);
  
    this.restorePlaceholder_();
    this.resize();
  };

  /**
   * Gets the textarea's content height + padding height + border height.
   * This is done by getting the scrollHeight and adjusting from there.
   * In the end this result is what we want the new offsetHeight to equal.
   * @return {number} The height of the textarea.
   * @private
   */
  getHeight_() {
    this.discoverTextareaCharacteristics_();
    var textarea = this.getElement();
    // Because enterDocument can be called even when the component is rendered
    // without being in a document, we may not have cached the correct paddingBox
    // data on render(). We try to make up for this here.
    if (isNaN(this.paddingBox_.top)) {
      this.paddingBox_ = style.getPaddingBox(textarea);
      this.borderBox_ = style.getBorderBox(textarea);
    }
    // Accounts for a possible (though unlikely) horizontal scrollbar.
    var height =
        this.getElement().scrollHeight + this.getHorizontalScrollBarHeight_();
    if (this.needsPaddingBorderFix_) {
      height -= this.getPaddingBorderBoxHeight_();
    } else {
      if (!this.scrollHeightIncludesPadding_) {
        var paddingBox = this.paddingBox_;
        var paddingBoxHeight = paddingBox.top + paddingBox.bottom;
        height += paddingBoxHeight;
      }
      if (!this.scrollHeightIncludesBorder_) {
        var borderBox = style.getBorderBox(textarea);
        var borderBoxHeight = borderBox.top + borderBox.bottom;
        height += borderBoxHeight;
      }
    }
    return height;
  };

  /**
   * Sets the textarea's height.
   * @param {number} height The height to set.
   * @private
   */
  setHeight_(height) {
    if (this.height_ != height) {
      this.height_ = height;
      this.getElement().style.height = height + 'px';
    }
  };

  /**
   * Sets the textarea's rows attribute to be the number of newlines + 1.
   * This is necessary when the textarea is hidden, in which case scrollHeight
   * is not available.
   * @private
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  setHeightToEstimate_() {
    var textarea = this.getElement();
    textarea.style.height = 'auto';
    var newlines = textarea.value.match(/\n/g) || [];
    textarea.rows = newlines.length + 1;
    this.height_ = 0;
  };

  /**
   * Gets the the height of (possibly present) horizontal scrollbar.
   * @return {number} The height of the horizontal scrollbar.
   * @private
   */
  getHorizontalScrollBarHeight_() {
    var textarea = /** @type {!HTMLElement} */ (this.getElement());
    var height = textarea.offsetHeight - textarea.clientHeight;
    if (!this.scrollHeightIncludesPadding_) {
      var paddingBox = this.paddingBox_;
      var paddingBoxHeight = paddingBox.top + paddingBox.bottom;
      height -= paddingBoxHeight;
    }
    if (!this.scrollHeightIncludesBorder_) {
      var borderBox = style.getBorderBox(textarea);
      var borderBoxHeight = borderBox.top + borderBox.bottom;
      height -= borderBoxHeight;
    }
    // Prevent negative number results, which sometimes show up.
    return height > 0 ? height : 0;
  };

  /**
   * In order to assess the correct height for a textarea, we need to know
   * whether the scrollHeight (the full height of the text) property includes
   * the values for padding and borders. We can also test whether the
   * box-sizing: border-box setting is working and then tweak accordingly.
   * Instead of hardcoding a list of currently known behaviors and testing
   * for quirksmode, we do a runtime check out of the flow. The performance
   * impact should be very small.
   * @private
   */
  discoverTextareaCharacteristics_() {
    if (!this.hasDiscoveredTextareaCharacteristics_) {
      var textarea =
          /** @type {!HTMLElement} */ (this.getElement().cloneNode(false));
      // We need to overwrite/write box model specific styles that might
      // affect height.
      style.setStyle(textarea, {
        'position': 'absolute',
        'height': 'auto',
        'top': '-9999px',
        'margin': '0',
        'padding': '1px',
        'border': '1px solid #000',
        'overflow': 'hidden'
      });
      goog_dom.appendChild(this.getDomHelper().getDocument().body, textarea);
      var initialScrollHeight = textarea.scrollHeight;
  
      textarea.style.padding = '10px';
      var paddingScrollHeight = textarea.scrollHeight;
      this.scrollHeightIncludesPadding_ =
          paddingScrollHeight > initialScrollHeight;
  
      initialScrollHeight = paddingScrollHeight;
      textarea.style.borderWidth = '10px';
      var borderScrollHeight = textarea.scrollHeight;
      this.scrollHeightIncludesBorder_ = borderScrollHeight > initialScrollHeight;
  
      // Tests if border-box sizing is working or not.
      textarea.style.height = '100px';
      var offsetHeightAtHeight100 = textarea.offsetHeight;
      if (offsetHeightAtHeight100 != 100) {
        this.needsPaddingBorderFix_ = true;
      }
  
      goog_dom.removeNode(textarea);
      this.hasDiscoveredTextareaCharacteristics_ = true;
    }
  };

  /**
   * Called when the element goes out of focus.
   * @param {EventsEvent=} opt_e The browser event.
   * @private
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  blur_(opt_e) {
    if (!this.supportsNativePlaceholder_()) {
      this.hasFocusForPlaceholder_ = false;
      if (this.getElement().value == '') {
        // Only transition to the default text if we have
        // no user input.
        this.hasUserInput_ = false;
        this.restorePlaceholder_();
      }
    }
  };

  /**
   * Resizes the textarea to grow/shrink to match its contents.
   * @param {EventsEvent=} opt_e The browser event.
   * @private
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  grow_(opt_e) {
    if (this.isResizing_) {
      return;
    }
    var textarea = /** @type {!HTMLElement} */ (this.getElement());
    // If the element is getting focus and we don't support placeholders
    // natively, then remove the placeholder class.
    if (!this.supportsNativePlaceholder_() && opt_e &&
        opt_e.type == EventsEventType.FOCUS) {
      // We must have a textarea element, since we're growing it.
      // Remove the placeholder CSS + set the value to empty if we're currently
      // showing the placeholderText_ value if this is the first time we're
      // getting focus.
      if (textarea.value == this.placeholderText_ && this.placeholderText_ &&
          !this.hasFocusForPlaceholder_) {
        classlist.remove(
            textarea, Textarea.TEXTAREA_PLACEHOLDER_CLASS);
        textarea.value = '';
      }
      this.hasFocusForPlaceholder_ = true;
      this.hasUserInput_ = (textarea.value != '');
    }
    var shouldCallShrink = false;
    this.isResizing_ = true;
    var oldHeight = this.height_;
    if (textarea.scrollHeight) {
      var setMinHeight = false;
      var setMaxHeight = false;
      var newHeight = this.getHeight_();
      var currentHeight = textarea.offsetHeight;
      var minHeight = this.getMinHeight_();
      var maxHeight = this.getMaxHeight_();
      if (minHeight && newHeight < minHeight) {
        this.setHeight_(minHeight);
        setMinHeight = true;
      } else if (maxHeight && newHeight > maxHeight) {
        this.setHeight_(maxHeight);
        // If the content is greater than the height, we'll want the vertical
        // scrollbar back.
        textarea.style.overflowY = '';
        setMaxHeight = true;
      } else if (currentHeight != newHeight) {
        this.setHeight_(newHeight);
        // Makes sure that height_ is at least set.
      } else if (!this.height_) {
        this.height_ = newHeight;
      }
      if (!setMinHeight && !setMaxHeight &&
          Textarea.NEEDS_HELP_SHRINKING_) {
        shouldCallShrink = true;
      }
    } else {
      this.setHeightToEstimate_();
    }
    this.isResizing_ = false;
  
    if (shouldCallShrink) {
      this.shrink_();
    }
    if (oldHeight != this.height_) {
      this.dispatchEvent(EventType.RESIZE);
    }
  };

  /**
   * Resizes the textarea to shrink to fit its contents. The way this works is
   * by increasing the padding of the textarea by 1px (it's important here that
   * we're in box-sizing: border-box mode). If the size of the textarea grows,
   * then the box is filled up to the padding box with text.
   * If it doesn't change, then we can shrink.
   * @private
   */
  shrink_() {
    var textarea = this.getElement();
    if (!this.isResizing_) {
      this.isResizing_ = true;
      var scrollHeight = textarea.scrollHeight;
      if (!scrollHeight) {
        this.setHeightToEstimate_();
      } else {
        var currentHeight = this.getHeight_();
        var minHeight = this.getMinHeight_();
        if (!(minHeight && currentHeight <= minHeight)) {
          // Nudge the padding by 1px.
          var paddingBox = this.paddingBox_;
          textarea.style.paddingBottom = paddingBox.bottom + 1 + 'px';
          var heightAfterNudge = this.getHeight_();
          // If the one px of padding had no effect, then we can shrink.
          if (heightAfterNudge == currentHeight) {
            textarea.style.paddingBottom =
                paddingBox.bottom + scrollHeight + 'px';
            textarea.scrollTop = 0;
            var shrinkToHeight = this.getHeight_() - scrollHeight;
            if (shrinkToHeight >= minHeight) {
              this.setHeight_(shrinkToHeight);
            } else {
              this.setHeight_(minHeight);
            }
          }
          textarea.style.paddingBottom = paddingBox.bottom + 'px';
        }
      }
      this.isResizing_ = false;
    }
  };

  /**
   * We use this listener to check if the textarea has been natively resized
   * and if so we reset minHeight so that we don't ever shrink smaller than
   * the user's manually set height. Note that we cannot check size on mousedown
   * and then just compare here because we cannot capture mousedown on
   * the textarea resizer, while mouseup fires reliably.
   * @param {EventsBrowserEvent} e The mousedown event.
   * @private
   */
  mouseUpListener_(e) {
    var textarea = /** @type {!HTMLElement} */ (this.getElement());
    var height = textarea.offsetHeight;
  
    // This solves for when the MSIE DropShadow filter is enabled,
    // as it affects the offsetHeight value, even with MsBoxSizing:border-box.
    if (textarea['filters'] && textarea['filters'].length) {
      var dropShadow =
          textarea['filters']['item']('DXImageTransform.Microsoft.DropShadow');
      if (dropShadow) {
        height -= dropShadow['offX'];
      }
    }
  
    if (height != this.height_) {
      this.minHeight_ = height;
      this.height_ = height;
    }
  };
}

// google.tagUnsealableClass(Textarea);

/**
 * Some UAs will shrink the textarea automatically, some won't.
 * @type {boolean}
 * @private
 */
Textarea.NEEDS_HELP_SHRINKING_ =
    !(userAgent.IE && !userAgent.isDocumentModeOrHigher(11));

/**
 * Constants for event names.
 * @enum {string}
 * @suppress {checkTypes}
 */
let EventType = {
  RESIZE: 'resize'
};

/**
 * The CSS class name to add to the input when the user has not entered a
 * value.
 */
Textarea.TEXTAREA_PLACEHOLDER_CLASS =
    google.getCssName('textarea-placeholder-input');

export {EventType, Textarea};