/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Provides a convenient API for data persistence using a selected
 * data storage mechanism.
 */
/**
 * The base implementation for all storage APIs.
 *
 *     storage mechanism.
 * @class
 */
export class Storage {
    /**
     * The base implementation for all storage APIs.
     *
     * @param {!Mechanism} mechanism The underlying
     *     storage mechanism.
     */
    constructor(mechanism: Mechanism);
    /**
     * The mechanism used to persist key-value pairs.
     *
     * @protected {Mechanism}
     */
    protected mechanism: Mechanism;
    /**
     * Sets an item in the data storage.
     *
     * @param {string} key The key to set.
     * @param {*} value The value to serialize to a string and save.
     */
    set(key: string, value: any): void;
    /**
     * Gets an item from the data storage.
     *
     * @param {string} key The key to get.
     * @return {*} Deserialized value or undefined if not found.
     */
    get(key: string): any;
    /**
     * Removes an item from the data storage.
     *
     * @param {string} key The key to remove.
     */
    remove(key: string): void;
}
import { Mechanism } from "./mechanism/mechanism.js";
