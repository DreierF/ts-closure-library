/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * Resolver interface for promises. The resolver is a convenience interface that
 * bundles the promise and its associated resolve and reject functions together,
 * for cases where the resolver needs to be persisted internally.
 *
 * @interface
 * @template TYPE
 * @suppress {checkTypes}
 */
export class Resolver<TYPE> {
    /**
     * The promise that created this resolver.
     * @type {!GoogPromise<TYPE>}
     */
    promise: GoogPromise<TYPE, any>;
    /**
     * Resolves this resolver with the specified value.
     * @type {function((TYPE|GoogPromise<TYPE>|Thenable)=)}
     */
    resolve: (arg0?: any) => any;
    /**
     * Rejects this resolver with the specified reason.
     * @type {function(*=): void}
     */
    reject: () => void;
}
import { Promise as GoogPromise } from "./promise.js";
