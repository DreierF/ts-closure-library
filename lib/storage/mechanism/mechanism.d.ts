/**
 * @fileoverview Abstract interface for storing and retrieving data using
 * some persistence mechanism.
 */
/**
 * Basic interface for all storage mechanisms.
 *
 * @class
 * @abstract
 */
export class Mechanism {
    /**
     * Set a value for a key.
     *
     * @param {string} key The key to set.
     * @param {string} value The string to save.
     * @abstract
     */
    set(key: string, value: string): void;
    /**
     * Get the value stored under a key.
     *
     * @param {string} key The key to get.
     * @return {?string} The corresponding value, null if not found.
     * @abstract
     */
    get(key: string): string | null;
    /**
     * Remove a key and its value.
     *
     * @param {string} key The key to remove.
     * @abstract
     */
    remove(key: string): void;
}
