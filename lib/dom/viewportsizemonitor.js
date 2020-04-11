import {dispose} from './../disposable/disposable.js';
import {Event as EventsEvent} from './../events/event.js';
import * as events from './../events/eventhandler.js';
import {Key} from './../events/eventhandler.js';
import {EventTarget as EventsEventTarget} from './../events/eventhandler.js';
import {EventType} from './../events/eventtype.js';
import * as google from './../google.js';
import {Size} from './../math/size.js';
import * as dom from './dom.js';
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
 * @fileoverview Utility class that monitors viewport size changes.
 *
 * @see ../demos/viewportsizemonitor.html
 */

/**
 * This class can be used to monitor changes in the viewport size.  Instances
 * dispatch a {@link EventType.RESIZE} event when the viewport size
 * changes.  Handlers can call {@link ViewportSizeMonitor#getSize} to
 * get the new viewport size.
 *
 * Use this class if you want to execute resize/reflow logic each time the
 * user resizes the browser window.  This class is guaranteed to only dispatch
 * `RESIZE` events when the pixel dimensions of the viewport change.
 * (Internet Explorer fires resize events if any element on the page is resized,
 * even if the viewport dimensions are unchanged, which can lead to infinite
 * resize loops.)
 *
 * Example usage:
 *  <pre>
 *    var vsm = new ViewportSizeMonitor();
 *    events.listen(vsm, EventType.RESIZE, function(e) {
 *      alert('Viewport size changed to ' + vsm.getSize());
 *    });
 *  </pre>
 *
 * Manually verified on IE6, IE7, FF2, Opera 11, Safari 4 and Chrome.
 *
 *    which this code is executing.
 * @extends {EventsEventTarget}
 */
class ViewportSizeMonitor extends EventsEventTarget {

  /**
   * This class can be used to monitor changes in the viewport size.  Instances
   * dispatch a {@link EventType.RESIZE} event when the viewport size
   * changes.  Handlers can call {@link ViewportSizeMonitor#getSize} to
   * get the new viewport size.
   *
   * Use this class if you want to execute resize/reflow logic each time the
   * user resizes the browser window.  This class is guaranteed to only dispatch
   * `RESIZE` events when the pixel dimensions of the viewport change.
   * (Internet Explorer fires resize events if any element on the page is resized,
   * even if the viewport dimensions are unchanged, which can lead to infinite
   * resize loops.)
   *
   * Example usage:
   *  <pre>
   *    var vsm = new ViewportSizeMonitor();
   *    events.listen(vsm, EventType.RESIZE, function(e) {
   *      alert('Viewport size changed to ' + vsm.getSize());
   *    });
   *  </pre>
   *
   * Manually verified on IE6, IE7, FF2, Opera 11, Safari 4 and Chrome.
   *
   * @param {Window=} opt_window The window to monitor; defaults to the window in
   *    which this code is executing.
   */
  constructor(opt_window) {
    super();
  
    /**
     * The window to monitor. Defaults to the window in which the code is running.
     * @private {Window}
     */
    this.window_ = opt_window || window;
  
    /**
     * Event listener key for window the window resize handler, as returned by
     * {@link events.listen}.
     * @private {Key}
     */
    this.listenerKey_ = events.listen(
        this.window_, EventType.RESIZE, this.handleResize_, false,
        this);
  
    /**
     * The most recently recorded size of the viewport, in pixels.
     * @private {Size}
     */
    this.size_ = dom.getViewportSize(this.window_);
  }

  /**
   * Returns a viewport size monitor for the given window.  A new one is created
   * if it doesn't exist already.  This prevents the unnecessary creation of
   * multiple spooling monitors for a window.
   * @param {Window=} opt_window The window to monitor; defaults to the window in
   *     which this code is executing.
   * @return {!ViewportSizeMonitor} Monitor for the given window.
   */
  static getInstanceForWindow(opt_window) {
    var currentWindow = opt_window || window;
    var uid = google.getUid(currentWindow);
  
    return ViewportSizeMonitor.windowInstanceMap_[uid] =
               ViewportSizeMonitor.windowInstanceMap_[uid] ||
        new ViewportSizeMonitor(currentWindow);
  };

  /**
   * Removes and disposes a viewport size monitor for the given window if one
   * exists.
   * @param {Window=} opt_window The window whose monitor should be removed;
   *     defaults to the window in which this code is executing.
   */
  static removeInstanceForWindow(opt_window) {
    var uid = google.getUid(opt_window || window);
  
    dispose(ViewportSizeMonitor.windowInstanceMap_[uid]);
    delete ViewportSizeMonitor.windowInstanceMap_[uid];
  };

  /**
   * Returns the most recently recorded size of the viewport, in pixels.  May
   * return null if no window resize event has been handled yet.
   * @return {Size} The viewport dimensions, in pixels.
   */
  getSize() {
    // Return a clone instead of the original to preserve encapsulation.
    return this.size_ ? this.size_.clone() : null;
  };

  /** @override */
  disposeInternal() {
    super.disposeInternal();
  
    if (this.listenerKey_) {
      events.unlistenByKey(this.listenerKey_);
      this.listenerKey_ = null;
    }
  
    this.window_ = null;
    this.size_ = null;
  };

  /**
   * Handles window resize events by measuring the dimensions of the
   * viewport and dispatching a {@link EventType.RESIZE} event if the
   * current dimensions are different from the previous ones.
   * @param {EventsEvent} event The window resize event to handle.
   * @private
   */
  handleResize_(event) {
    var size = dom.getViewportSize(this.window_);
    if (!Size.equals(size, this.size_)) {
      this.size_ = size;
      this.dispatchEvent(EventType.RESIZE);
    }
  };
}

/**
 * Map of window hash code to viewport size monitor for that window, if
 * created.
 * @type {Object<number,ViewportSizeMonitor>}
 * @private
 */
ViewportSizeMonitor.windowInstanceMap_ = {};

export {ViewportSizeMonitor};