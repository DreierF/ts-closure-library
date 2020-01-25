import {Role} from './../a11y/aria/roles.js';
import * as googdom from './../dom/dom.js';
import {DomHelper} from './../dom/dom.js';
import {TagName} from './../dom/tagname.js';
import {Event as EventsEvent} from './../events/event.js';
import * as googevents from './../events/eventhandler.js';
import {Animation} from './../fx/animation.js';
import {AnimationEvent} from './../fx/animation.js';
import {EventType as AnimationEventType} from './../fx/animation.js';
import * as easing from './../fx/easing.js';
import {Transition} from './../fx/transition.js';
import {EventType} from './../fx/transition.js';
import * as google from './../google.js';
import {Zippy} from './zippy.js';
import {ZippyEvent} from './zippy.js';
import {Events} from './zippy.js';
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
 * @fileoverview Animated zippy widget implementation.
 *
 * @see ../demos/zippy.html
 */

/**
 * Zippy widget. Expandable/collapsible container, clicking the header toggles
 * the visibility of the content.
 *
 *     reference, string id or null if no header exists.
 *     string id.
 *     false.
 * @extends {Zippy}
 */
class AnimatedZippy extends Zippy {

  /**
   * Zippy widget. Expandable/collapsible container, clicking the header toggles
   * the visibility of the content.
   *
   * @param {Element|string|null} header Header element, either element
   *     reference, string id or null if no header exists.
   * @param {Element|string} content Content element, either element reference or
   *     string id.
   * @param {boolean=} opt_expanded Initial expanded/visibility state. Defaults to
   *     false.
   * @param {DomHelper=} opt_domHelper An optional DOM helper.
   * @param {Role<string>=} opt_role ARIA role, default TAB.
   */
  constructor(
      header, content, opt_expanded, opt_domHelper, opt_role) {
    var domHelper = opt_domHelper || googdom.getDomHelper();
  
    // Create wrapper element and move content into it.
    var elWrapper =
        domHelper.createDom(TagName.DIV, {'style': 'overflow:hidden'});
    var elContent = domHelper.getElement(content);
    elContent.parentNode.replaceChild(elWrapper, elContent);
    elWrapper.appendChild(elContent);
  
    // Call constructor of super class.
    super(header, elContent, opt_expanded, undefined, domHelper, opt_role);
    /**
     * Duration of expand/collapse animation, in milliseconds.
     * @type {number}
     */
    this.animationDuration = 500;
  
    /**
     * Acceleration function for expand/collapse animation.
     * @type {!Function}
     */
    this.animationAcceleration = easing.easeOut;
  
  
    /**
     * Content wrapper, used for animation.
     * @type {Element}
     * @private
     */
    this.elWrapper_ = elWrapper;
  
    /**
     * Reference to animation or null if animation is not active.
     * @type {?Animation}
     * @private
     */
    this.anim_ = null;
  
    // Set initial state.
    // NOTE: Set the class names as well otherwise animated zippys
    // start with empty class names.
    var expanded = this.isExpanded();
    this.elWrapper_.style.display = expanded ? '' : 'none';
    this.updateHeaderClassName(expanded);
  }

  /**
   * @return {boolean} Whether the zippy is in the process of being expanded or
   *     collapsed.
   */
  isBusy() {
    return this.anim_ != null;
  };

  /**
   * Sets expanded state.
   *
   * @param {boolean} expanded Expanded/visibility state.
   * @override
   */
  setExpanded(expanded) {
    if (this.isExpanded() == expanded && !this.anim_) {
      return;
    }
  
    // Reset display property of wrapper to allow content element to be
    // measured.
    if (this.elWrapper_.style.display == 'none') {
      this.elWrapper_.style.display = '';
    }
  
    // Measure content element.
    var h = this.getContentElement().offsetHeight;
  
    // Stop active animation (if any) and determine starting height.
    var startH = 0;
    if (this.anim_) {
      googevents.removeAll(this.anim_);
      this.anim_.stop(false);
  
      var marginTop = parseInt(this.getContentElement().style.marginTop, 10);
      startH = h - Math.abs(marginTop);
    } else {
      startH = expanded ? 0 : h;
    }
  
    // Updates header class name after the animation has been stopped.
    this.updateHeaderClassName(expanded);
  
    // Set up expand/collapse animation.
    this.anim_ = new Animation(
        [0, startH], [0, expanded ? h : 0], this.animationDuration,
        this.animationAcceleration);
  
    var events = [
      EventType.BEGIN, AnimationEventType.ANIMATE,
      EventType.END
    ];
    googevents.listen(this.anim_, events, this.onAnimate_, false, this);
    googevents.listen(
        this.anim_, EventType.BEGIN,
        google.bind(this.onAnimationBegin_, this, expanded));
    googevents.listen(
        this.anim_, EventType.END,
        google.bind(this.onAnimationCompleted_, this, expanded));
  
    // Start animation.
    this.anim_.play(false);
  };

  /**
   * Called during animation
   *
   * @param {EventsEvent} e The event.
   * @private
   */
  onAnimate_(e) {
    var contentElement = this.getContentElement();
    var h = contentElement.offsetHeight;
    e = /** @type {!AnimationEvent} */ (e);
    contentElement.style.marginTop = (e.y - h) + 'px';
  };

  /**
   * Called once the expand/collapse animation has started.
   *
   * @param {boolean} expanding Expanded/visibility state.
   * @private
   */
  onAnimationBegin_(expanding) {
    this.dispatchEvent(new ZippyEvent(
        AnimatedZippy.Events.TOGGLE_ANIMATION_BEGIN, this, expanding));
  };

  /**
   * Called once the expand/collapse animation has completed.
   *
   * @param {boolean} expanded Expanded/visibility state.
   * @private
   */
  onAnimationCompleted_(expanded) {
    // Fix wrong end position if the content has changed during the animation.
    if (expanded) {
      this.getContentElement().style.marginTop = '0';
    }
  
    googevents.removeAll(/** @type {!Animation} */ (this.anim_));
    this.setExpandedInternal(expanded);
    this.anim_ = null;
  
    if (!expanded) {
      this.elWrapper_.style.display = 'none';
    }
  
    // Fire toggle event.
    this.dispatchEvent(
        new ZippyEvent(Events.TOGGLE, this, expanded));
    this.dispatchEvent(new ZippyEvent(
        AnimatedZippy.Events.TOGGLE_ANIMATION_END, this, expanded));
  };
}

// google.tagUnsealableClass(AnimatedZippy);

/**
 * Constants for event names.
 *
 * @override
 * @suppress {checkTypes}
 * @enum {string}
 */
AnimatedZippy.Events = {
  // The beginning of the animation when the zippy state toggles.
  TOGGLE_ANIMATION_BEGIN: googevents.getUniqueId('toggleanimationbegin'),
  // The end of the animation when the zippy state toggles.
  TOGGLE_ANIMATION_END: googevents.getUniqueId('toggleanimationend')
};

export {AnimatedZippy};