/**
 * @fileoverview Base class that implements functionality common
 * across both session and local web storage mechanisms.
 */
/**
 * Provides a storage mechanism that uses HTML5 Web storage.
 *
 * @class
 * @extends {IterableMechanism}
 */
export class HTML5WebStorage extends IterableMechanism {
    /**
     * Provides a storage mechanism that uses HTML5 Web storage.
     *
     * @param {?Storage} storage The Web storage object.
     */
    constructor(storage: Storage | null);
    /**
     * The web storage object (window.localStorage or window.sessionStorage).
     * @private {Storage}
     */
    private storage_;
    /**
     * Determines whether or not the mechanism is available.
     * It works only if the provided web storage object exists and is enabled.
     *
     * @return {boolean} True if the mechanism is available.
     */
    isAvailable(): boolean;
    /**
     * Gets the key for a given key index. If an index outside of
     * [0..this.getCount()) is specified, this function returns null.
     * @param {number} index A key index.
     * @return {?string} A storage key, or null if the specified index is out of
     *     range.
     */
    key(index: number): string | null;
}
export namespace HTML5WebStorage {
    export const STORAGE_AVAILABLE_KEY_: string;
}
import { IterableMechanism } from "./iterablemechanism.js";
