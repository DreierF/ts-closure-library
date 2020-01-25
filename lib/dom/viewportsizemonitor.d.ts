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
export class ViewportSizeMonitor extends events.EventTarget {
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
    constructor(opt_window?: Window);
    /**
     * The window to monitor. Defaults to the window in which the code is running.
     * @private {Window}
     */
    window_: Window;
    /**
     * Event listener key for window the window resize handler, as returned by
     * {@link events.listen}.
     * @private {Key}
     */
    listenerKey_: number | events.ListenableKey;
    /**
     * The most recently recorded size of the viewport, in pixels.
     * @private {Size}
     */
    size_: Size;
    /**
     * Returns the most recently recorded size of the viewport, in pixels.  May
     * return null if no window resize event has been handled yet.
     * @return {?Size} The viewport dimensions, in pixels.
     */
    getSize(): Size;
    /**
     * Handles window resize events by measuring the dimensions of the
     * viewport and dispatching a {@link EventType.RESIZE} event if the
     * current dimensions are different from the previous ones.
     * @param {?EventsEvent} event The window resize event to handle.
     * @private
     */
    handleResize_(event: EventsEvent): void;
    actualEventTarget_: ViewportSizeMonitor;
}
export namespace ViewportSizeMonitor {
    export const windowInstanceMap_: {
        [x: number]: ViewportSizeMonitor;
    };
}
import * as events from "../events/eventhandler.js";
import { Size } from "../math/size.js";
import { Event as EventsEvent } from "../events/event.js";
