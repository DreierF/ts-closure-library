/**
 * Enum type for the events fired by the key handler
 * @const
 * @deprecated use `KeyEvent.EventType` instead.
 */
export let EventType: {
    KEY: string;
};
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview This file contains a class for working with keyboard events
 * that repeat consistently across browsers and platforms. It also unifies the
 * key code so that it is the same in all browsers and platforms.
 *
 * Different web browsers have very different keyboard event handling. Most
 * importantly is that only certain browsers repeat keydown events:
 * IE, Opera, FF/Win32, and Safari 3 repeat keydown events.
 * FF/Mac and Safari 2 do not.
 *
 * For the purposes of this code, "Safari 3" means WebKit 525+, when WebKit
 * decided that they should try to match IE's key handling behavior.
 * Safari 3.0.4, which shipped with Leopard (WebKit 523), has the
 * Safari 2 behavior.
 *
 * Firefox, Safari, Opera prevent on keypress
 *
 * IE prevents on keydown
 *
 * Firefox does not fire keypress for shift, ctrl, alt
 * Firefox does fire keydown for shift, ctrl, alt, meta
 * Firefox does not repeat keydown for shift, ctrl, alt, meta
 *
 * Firefox does not fire keypress for up and down in an input
 *
 * Opera fires keypress for shift, ctrl, alt, meta
 * Opera does not repeat keypress for shift, ctrl, alt, meta
 *
 * Safari 2 and 3 do not fire keypress for shift, ctrl, alt
 * Safari 2 does not fire keydown for shift, ctrl, alt
 * Safari 3 *does* fire keydown for shift, ctrl, alt
 *
 * IE provides the keycode for keyup/down events and the charcode (in the
 * keycode field) for keypress.
 *
 * Mozilla provides the keycode for keyup/down and the charcode for keypress
 * unless it's a non text modifying key in which case the keycode is provided.
 *
 * Safari 3 provides the keycode and charcode for all events.
 *
 * Opera provides the keycode for keyup/down event and either the charcode or
 * the keycode (in the keycode field) for keypress events.
 *
 * Firefox x11 doesn't fire keydown events if a another key is already held down
 * until the first key is released. This can cause a key event to be fired with
 * a keyCode for the first key and a charCode for the second key.
 *
 * Safari in keypress
 *
 *        charCode keyCode which
 * ENTER:       13      13    13
 * F1:       63236   63236 63236
 * F8:       63243   63243 63243
 * ...
 * p:          112     112   112
 * P:           80      80    80
 *
 * Firefox, keypress:
 *
 *        charCode keyCode which
 * ENTER:        0      13    13
 * F1:           0     112     0
 * F8:           0     119     0
 * ...
 * p:          112       0   112
 * P:           80       0    80
 *
 * Opera, Mac+Win32, keypress:
 *
 *         charCode keyCode which
 * ENTER: undefined      13    13
 * F1:    undefined     112     0
 * F8:    undefined     119     0
 * ...
 * p:     undefined     112   112
 * P:     undefined      80    80
 *
 * IE7, keydown
 *
 *         charCode keyCode     which
 * ENTER: undefined      13 undefined
 * F1:    undefined     112 undefined
 * F8:    undefined     119 undefined
 * ...
 * p:     undefined      80 undefined
 * P:     undefined      80 undefined
 *
 * @see ../demos/keyhandler.html
 */
/**
 * A wrapper around an element that you want to listen to keyboard events on.
 *     capture phase (defaults to false).
 * @extends {EventsEventTarget}
 * @final
 */
export class KeyHandler extends goog_events.EventTarget {
    /**
     * A wrapper around an element that you want to listen to keyboard events on.
     * @param {?Element|Document=} opt_element The element or document to listen on.
     * @param {boolean=} opt_capture Whether to listen for browser events in
     *     capture phase (defaults to false).
     */
    constructor(opt_element?: ((Element | Document) | null) | undefined, opt_capture?: boolean | undefined);
    /**
     * This is the element that we will listen to the real keyboard events on.
     * @type {?Element|?Document|null}
     * @private
     */
    private element_;
    /**
     * The key for the key press listener.
     * @type {?EventsKey}
     * @private
     */
    private keyPressKey_;
    /**
     * The key for the key down listener.
     * @type {?EventsKey}
     * @private
     */
    private keyDownKey_;
    /**
     * The key for the key up listener.
     * @type {?EventsKey}
     * @private
     */
    private keyUpKey_;
    /**
     * Used to detect keyboard repeat events.
     * @private
     * @type {number}
     */
    private lastKey_;
    /**
     * Keycode recorded for key down events. As most browsers don't report the
     * keycode in the key press event we need to record it in the key down phase.
     * @private
     * @type {number}
     */
    private keyCode_;
    /**
     * Alt key recorded for key down events. FF on Mac does not report the alt key
     * flag in the key press event, we need to record it in the key down phase.
     * @type {boolean}
     * @private
     */
    private altKey_;
    /**
     * Records the keycode for browsers that only returns the keycode for key up/
     * down events. For browser/key combinations that doesn't trigger a key pressed
     * event it also fires the patched key event.
     * @param {?EventsBrowserEvent} e The key down event.
     * @private
     */
    private handleKeyDown_;
    /**
     * Resets the stored previous values. Needed to be called for webkit which will
     * not generate a key up for meta key operations. This should only be called
     * when having finished with repeat key possibilities.
     */
    resetState(): void;
    /**
     * Clears the stored previous key value, resetting the key repeat status. Uses
     * -1 because the Safari 3 Windows beta reports 0 for certain keys (like Home
     * and End.)
     * @param {?EventsBrowserEvent} e The keyup event.
     * @private
     */
    private handleKeyup_;
    /**
     * Handles the events on the element.
     * @param {?EventsBrowserEvent} e  The keyboard event sent from the
     *     browser.
     */
    handleEvent(e: EventsBrowserEvent | null): void;
    /**
     * Returns the element listened on for the real keyboard events.
     * @return {?Element|Document|null} The element listened on for the real
     *     keyboard events.
     */
    getElement(): (Element | Document | null) | null;
    /**
     * Adds the proper key event listeners to the element.
     * @param {?Element|Document} element The element to listen on.
     * @param {boolean=} opt_capture Whether to listen for browser events in
     *     capture phase (defaults to false).
     */
    attach(element: (Element | Document) | null, opt_capture?: boolean | undefined): void;
    /**
     * Removes the listeners that may exist.
     */
    detach(): void;
}
export namespace KeyHandler {
    const safariKey_: any | null;
    const keyIdentifier_: any | null;
    const SAVE_ALT_FOR_KEYPRESS_: boolean;
}
import * as goog_events from "./eventhandler.js";
import { BrowserEvent as EventsBrowserEvent } from "./browserevent.js";
