import {Promise as GoogPromise} from './promise.js';
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
class Resolver {

  /**
   * Resolver interface for promises. The resolver is a convenience interface that
   * bundles the promise and its associated resolve and reject functions together,
   * for cases where the resolver needs to be persisted internally.
   *
   * @template TYPE
   * @suppress {checkTypes} 
   */
  constructor() {
    /**
     * The promise that created this resolver.
     * @type {!GoogPromise<TYPE>}
     */
    this.promise = null;
  
    /**
     * Resolves this resolver with the specified value.
     * @type {function((TYPE|GoogPromise<TYPE>|Thenable)=)}
     */
    this.resolve = null;
  
    /**
     * Rejects this resolver with the specified reason.
     * @type {function(*=): void}
     */
    this.reject = null;
  }
}

export {Resolver};