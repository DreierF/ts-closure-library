/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview An interface that describes a single registered listener.
 */
/**
 * An interface that describes a single registered listener.
 * @interface
 */
export class ListenableKey {
    /**
     * Reserves a key to be used for ListenableKey#key field.
     * @return {number} A number to be used to fill ListenableKey#key
     *     field.
     */
    static reserveKey(): number;
    /**
     * The source event target.
     * @type {?Object|?EventsListenable}
     */
    src: (any | (EventsListenable | null)) | null;
    /**
     * The event type the listener is listening to.
     * @type {string|null}
     */
    type: string | null;
    /**
     * The listener function.
     * @type {function(?):?|{handleEvent:function(?):?}|null}
     */
    listener: (arg0: unknown) => unknown | {
        handleEvent: (arg0: unknown) => unknown;
    } | null;
    /**
     * Whether the listener works on capture phase.
     * @type {boolean|null}
     */
    capture: boolean | null;
    /**
     * The 'this' object for the listener function's scope.
     * @type {?Object|undefined}
     */
    handler: (any | undefined) | null;
    /**
     * A globally unique number to identify the key.
     * @type {number|null}
     */
    key: number | null;
}
export namespace ListenableKey {
    const counter_: number;
}
import { Listenable as EventsListenable } from "./eventhandler.js";
