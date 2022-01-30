/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**  used in complex type */
/**
 * Provides a more strict interface for Thenables in terms of
 * http://promisesaplus.com for interop with {@see google.Promise}.
 *
 * @interface
 * @extends {IThenable<TYPE>}
 * @template TYPE
 */
export class Thenable<TYPE> {
    /**
     * Marks a given class (constructor) as an implementation of Thenable, so
     * that we can query that fact at runtime. The class must have already
     * implemented the interface.
     * Exports a 'then' method on the constructor prototype, so that the objects
     * also implement the extern {@see Thenable} interface for interop with
     * other Promise implementations.
     * @param {function(new:Thenable,...?)} ctor The class constructor. The
     *     corresponding class must have already implemented the interface.
     */
    static addImplementation(ctor: new (...args: unknown[]) => Thenable<any>): void;
    /**
     * @param {?} object
     * @return {boolean} Whether a given instance implements `Thenable`.
     *     The class/superclass of the instance must call `addImplementation`.
     */
    static isImplementedBy(object: unknown): boolean;
    /**
     * Adds callbacks that will operate on the result of the Thenable, returning a
     * new child Promise.
     *
     * If the Thenable is fulfilled, the `onFulfilled` callback will be
     * invoked with the fulfillment value as argument, and the child Promise will
     * be fulfilled with the return value of the callback. If the callback throws
     * an exception, the child Promise will be rejected with the thrown value
     * instead.
     *
     * If the Thenable is rejected, the `onRejected` callback will be invoked with
     * the rejection reason as argument. Similar to the fulfilled case, the child
     * Promise will then be resolved with the return value of the callback, or
     * rejected with the thrown value if the callback throws an exception.
     *
     * @param {?(function(this:THIS, TYPE): VALUE)=} opt_onFulfilled A
     *     function that will be invoked with the fulfillment value if the Promise
     *     is fulfilled.
     * @param {?(function(this:THIS, *): *)=} opt_onRejected A function that will
     *     be invoked with the rejection reason if the Promise is rejected.
     * @param {THIS=} opt_context An optional context object that will be the
     *     execution context for the callbacks. By default, functions are executed
     *     with the default this.
     *
     * @return {?RESULT} A new Promise that will receive the result
     *     of the fulfillment or rejection callback.
     * @template VALUE
     * @template THIS
     *
     * When a Promise (or thenable) is returned from the fulfilled callback,
     * the result is the payload of that promise, not the promise itself.
     *
     * @template RESULT := type('Promise',
     *     cond(isUnknown(VALUE), unknown(),
     *       mapunion(VALUE, (V) =>
     *         cond(isTemplatized(V) && sub(rawTypeOf(V), 'IThenable'),
     *           templateTypeOf(V, 0),
     *           cond(sub(V, 'Thenable'),
     *              unknown(),
     *              V)))))
     *  =:
     *
     */
    then<VALUE, THIS, RESULT>(opt_onFulfilled?: ((this: THIS, arg1: TYPE) => VALUE) | null | undefined, opt_onRejected?: ((this: THIS, arg1: any) => any) | null | undefined, opt_context?: THIS | undefined): RESULT | null;
}
export namespace Thenable {
    const IMPLEMENTED_BY_PROP: string;
}
