/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Provides helper classes and objects to work with High Entropy
 * user agent values.
 */
/**
 * Represents a value that can be asynchronously loaded.
 * @interface
 * @template VALUE_TYPE
 */
export class AsyncValue<VALUE_TYPE> {
    /**
     * Get the value represented by this AsyncValue instance, if it was
     * previously requested.
     * @return {VALUE_TYPE|undefined}
     */
    getIfLoaded(): VALUE_TYPE | undefined;
    /**
     * Request the value represented by this AsyncValue instance.
     * @return {!Promise<VALUE_TYPE>}
     */
    load(): Promise<VALUE_TYPE>;
}
/**
 * Represents a high-entropy value.
 * High-entropy values must be specifically requested from the Promise-based
 * Client Hints API.
 * @template VALUE_TYPE The type of the value wrapped by this HighEntropyValue
 *     instance.
 * @implements {AsyncValue<VALUE_TYPE>}
 */
export class HighEntropyValue<VALUE_TYPE> implements AsyncValue<VALUE_TYPE> {
    /**
     * Constructs a new HighEntropyValue instance.
     * @param {string} key The name of the high-entropy value, used when
     * requesting it from the browser.
     */
    constructor(key: string);
    /**
     * The key used to request the high-entropy value from the browser.
     * @const {string}
     * @private
     */
    private key_;
    /**
     * The value represented by this HighEntropyValue instance. If it hasn't
     * been successfully requested yet, its value will be undefined.
     * @type {VALUE_TYPE|undefined}
     * @protected
     */
    protected value_: VALUE_TYPE | undefined;
    /**
     * The high-entropy value request. If it hasn't been requested yet, this
     * value will be undefined.
     * @type {!Promise<VALUE_TYPE>|undefined}
     * @private
     */
    private promise_;
    pending_: boolean;
    /**
     * @return {VALUE_TYPE|undefined}
     * @override
     */
    getIfLoaded(): VALUE_TYPE | undefined;
    /**
     * @return {!Promise<VALUE_TYPE>}
     * @override
     */
    load(): Promise<VALUE_TYPE>;
    resetForTesting(): void;
}
/**
 * An object that wraps a version string.
 * This allows for easy version comparisons.
 */
export class Version {
    /**
     * @param {string} versionString The underlying version string.
     */
    constructor(versionString: string);
    /**
     * @const {string}
     * @private
     */
    private versionString_;
    /**
     * Returns the underlying version string.
     * @return {string}
     */
    toVersionStringForLogging(): string;
    /**
     * Returns true if the underlying version string is equal to or greater than
     * the given version.
     * @param {string} version The version to compare against.
     * @return {boolean}
     */
    isAtLeast(version: string): boolean;
}
