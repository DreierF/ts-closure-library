import * as userAgent from './../useragent/useragent.js';
import {BrowserEvent as EventsBrowserEvent} from './browserevent.js';
import * as events from './eventhandler.js';
import {Key} from './eventhandler.js';
import {EventTarget as EventsEventTarget} from './eventhandler.js';
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
 * @fileoverview This event handler allows you to catch focusin and focusout
 * events on  descendants. Unlike the "focus" and "blur" events which do not
 * propagate consistently, and therefore must be added to the element that is
 * focused, this allows you to attach one listener to an ancester and you will
 * be notified when the focus state changes of ony of its descendants.
 * @see ../demos/focushandler.html
 */

/**
 * This event handler allows you to catch focus events when descendants gain or
 * loses focus.
 * @extends {EventsEventTarget}
 * @final
 */
class FocusHandler extends EventsEventTarget {

  /**
   * This event handler allows you to catch focus events when descendants gain or
   * loses focus.
   * @param {Element|Document} element  The node to listen on.
   */
  constructor(element) {
    super();
  
    /**
     * This is the element that we will listen to the real focus events on.
     * @type {Element|Document}
     * @private
     */
    this.element_ = element;
  
    // In IE we use focusin/focusout and in other browsers we use a capturing
    // listner for focus/blur
    var typeIn = userAgent.IE ? 'focusin' : 'focus';
    var typeOut = userAgent.IE ? 'focusout' : 'blur';
  
    /**
     * Store the listen key so it easier to unlisten in dispose.
     * @private
     * @type {Key}
     */
    this.listenKeyIn_ =
        events.listen(this.element_, typeIn, this, !userAgent.IE);
  
    /**
     * Store the listen key so it easier to unlisten in dispose.
     * @private
     * @type {Key}
     */
    this.listenKeyOut_ =
        events.listen(this.element_, typeOut, this, !userAgent.IE);
  }

  /**
   * This handles the underlying events and dispatches a new event.
   * @param {EventsBrowserEvent} e  The underlying browser event.
   */
  handleEvent(e) {
    var be = e.getBrowserEvent();
    var event = new EventsBrowserEvent(be);
    event.type = e.type == 'focusin' || e.type == 'focus' ?
        EventType.FOCUSIN :
        EventType.FOCUSOUT;
    this.dispatchEvent(event);
  };

  /** @override */
  disposeInternal() {
    super.disposeInternal();
    events.unlistenByKey(this.listenKeyIn_);
    events.unlistenByKey(this.listenKeyOut_);
    delete this.element_;
  };
}

/**
 * Enum type for the events fired by the focus handler
 * @enum {string}
 */
let EventType = {
  FOCUSIN: 'focusin',
  FOCUSOUT: 'focusout'
};

export {EventType, FocusHandler};