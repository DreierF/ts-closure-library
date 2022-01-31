import {Listenable as EventsListenable} from './eventhandler.js';
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
class ListenableKey {

  /**
   * An interface that describes a single registered listener.
   */
  constructor() {
    /**
     * The source event target.
     * @type {?Object|?EventsListenable}
     */
    this.src = null;
  
    /**
     * The event type the listener is listening to.
     * @type {string|null}
     */
    this.type = null;
  
    /**
     * The listener function.
     * @type {function(?):?|{handleEvent:function(?):?}|null}
     */
    this.listener = null;
  
    /**
     * Whether the listener works on capture phase.
     * @type {boolean|null}
     */
    this.capture = null;
  
    /**
     * The 'this' object for the listener function's scope.
     * @type {?Object|undefined}
     */
    this.handler = undefined;
  
    /**
     * A globally unique number to identify the key.
     * @type {number|null}
     */
    this.key = null;
  }

  /**
   * Reserves a key to be used for ListenableKey#key field.
   * @return {number} A number to be used to fill ListenableKey#key
   *     field.
   */
  static reserveKey() {
    return ++ListenableKey.counter_;
  };
}

/**
 * Counter used to create a unique key
 * @type {number}
 * @private
 */
ListenableKey.counter_ = 0;

export {ListenableKey};