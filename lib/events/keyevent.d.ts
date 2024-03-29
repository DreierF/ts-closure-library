/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview This file contains a class for working with keyboard events
 */
/**
 * This class is used for the KeyEvent.EventType.KEY event and
 * it overrides the key code with the fixed key code.
 * @extends {EventsBrowserEvent}
 * @final
 */
export class KeyEvent extends EventsBrowserEvent {
    /**
     * This class is used for the KeyEvent.EventType.KEY event and
     * it overrides the key code with the fixed key code.
     * @param {number} keyCode The adjusted key code.
     * @param {number} charCode The unicode character code.
     * @param {boolean} repeat Whether this event was generated by keyboard repeat.
     * @param {?Event} browserEvent Browser event object.
     */
    constructor(keyCode: number, charCode: number, repeat: boolean, browserEvent: Event | null);
    /**
     * True if this event was generated by keyboard auto-repeat (i.e., the user is
     * holding the key down.)
     * @type {boolean}
     */
    repeat: boolean;
}
export namespace KeyEvent {
    namespace EventType {
        const KEY: string;
    }
    /**
     * Enum type for the events fired by the key handler
     */
    type EventType = string;
}
import { BrowserEvent as EventsBrowserEvent } from "./browserevent.js";
