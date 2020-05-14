/**
 * @fileoverview Implements the disposable interface. The dispose method is used
 * to clean up references and resources.
 */
/**
 * Class that provides the basic implementation for disposable objects. If your
 * class holds one or more references to COM objects, DOM nodes, or other
 * disposable objects, it should extend this class or implement the disposable
 * interface (defined in IDisposable).
 * @implements {IDisposable}
 */
export class Disposable {
    /**
     * @return {!Array<!Disposable>} All `Disposable` objects that
     *     haven't been disposed of.
     */
    static getUndisposedObjects(): Array<Disposable>;
    /**
     * Clears the registry of undisposed objects but doesn't dispose of them.
     */
    static clearUndisposedObjects(): void;
    /**
     * Returns True if we can verify the object is disposed.
     * Calls `isDisposed` on the argument if it supports it.  If obj
     * is not an object with an isDisposed() method, return false.
     * @param {*} obj The object to investigate.
     * @return {boolean} True if we can verify the object is disposed.
     */
    static isDisposed(obj: any): boolean;
    /**
     * Whether the object has been disposed of.
     * @type {boolean}
     * @private
     */
    private disposed_;
    /**
     * Callbacks to invoke when this object is disposed.
     * @type {Array<!Function>}
     * @private
     */
    private onDisposeCallbacks_;
    /**
     * If monitoring the Disposable instances is enabled, stores the creation
     * stack trace of the Disposable instance.
     * @type {string|undefined}
     */
    creationStack: string | undefined;
    /**
     * @return {boolean} Whether the object has been disposed of.
     * @override
     */
    isDisposed(): boolean;
    /**
     * @return {boolean} Whether the object has been disposed of.
     * @deprecated Use {@link #isDisposed} instead.
     */
    getDisposed(): boolean;
    /**
     * Disposes of the object. If the object hasn't already been disposed of, calls
     * {@link #disposeInternal}. Classes that extend `Disposable` should
     * override {@link #disposeInternal} in order to delete references to COM
     * objects, DOM nodes, and other disposable objects. Reentrant.
     *
     * @return {void} Nothing.
     * @override
     */
    dispose(): void;
    /**
     * Associates a disposable object with this object so that they will be disposed
     * together.
     * @param {?IDisposable} disposable that will be disposed when
     *     this object is disposed.
     */
    registerDisposable(disposable: typeof IDisposable | null): void;
    /**
     * Invokes a callback function when this object is disposed. Callbacks are
     * invoked in the order in which they were added. If a callback is added to
     * an already disposed Disposable, it will be called immediately.
     * @param {function(this:T):?} callback The callback function.
     * @param {T=} opt_scope An optional scope to call the callback in.
     * @template T
     */
    addOnDisposeCallback<T>(callback: (this: T) => unknown, opt_scope?: T | undefined): void;
    /**
     * Deletes or nulls out any references to COM objects, DOM nodes, or other
     * disposable objects. Classes that extend `Disposable` should
     * override this method.
     * Not reentrant. To avoid calling it twice, it must only be called from the
     * subclass' `disposeInternal` method. Everywhere else the public
     * `dispose` method must be used.
     * For example:
     * <pre>
     *   mypackage.MyClass = function() {
     *     mypackage.MyClass.base(this, 'constructor');
     *     // Constructor logic specific to MyClass.
     *     ...
     *   };
     *   google.inherits(mypackage.MyClass, Disposable);
     *
     *   mypackage.MyClass.prototype.disposeInternal = function() {
     *     // Dispose logic specific to MyClass.
     *     ...
     *     // Call superclass's disposeInternal at the end of the subclass's, like
     *     // in C++, to avoid hard-to-catch issues.
     *     mypackage.MyClass.base(this, 'disposeInternal');
     *   };
     * </pre>
     * @protected
     */
    protected disposeInternal(): void;
}
export namespace Disposable {
    export namespace MonitoringMode {
        export const OFF: number;
        export const PERMANENT: number;
        export const INTERACTIVE: number;
    }
    /**
     * Different monitoring modes for Disposable.
     */
    export type MonitoringMode = number;
    export const instances_: {
        [x: number]: Disposable;
    };
}
/**
 * @type {boolean} Whether to attach creation stack to each created disposable
 *     instance; This is only relevant for when MonitoringMode != OFF.
 */
export const INCLUDE_STACK_ON_CREATION: boolean;
/**
 * @type {number} The monitoring mode of the Disposable
 *     instances. Default is OFF. Switching on the monitoring is only
 *     recommended for debugging because it has a significant impact on
 *     performance and memory usage. If switched off, the monitoring code
 *     compiles down to 0 bytes.
 */
export const MONITORING_MODE: number;
/**
 * Calls `dispose` on the argument if it supports it. If obj is not an
 *     object with a dispose() method, this is a no-op.
 * @param {*} obj The object to dispose of.
 */
export function dispose(obj: any): void;
/**
 * Calls `dispose` on each member of the list that supports it. (If the
 * member is an ArrayLike, then `disposeAll()` will be called
 * recursively on each of its members.) If the member is not an object with a
 * `dispose()` method, then it is ignored.
 * @param {...*} var_args The list.
 */
export function disposeAll(...args: any[]): void;
import { IDisposable } from "./idisposable.js";
