import * as google from './../google.js';
import {dispose} from './dispose.js';
import {disposeAll} from './disposeall.js';
import {IDisposable} from './idisposable.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Implements the disposable interface.
 */

/**
 * TODO(user): Remove this require.
 * 
 */

/**
 * Class that provides the basic implementation for disposable objects. If your
 * class holds references or resources that can't be collected by standard GC,
 * it should extend this class or implement the disposable interface (defined
 * in IDisposable). See description of
 * IDisposable for examples of cleanup.
 * @implements {IDisposable}
 */
class Disposable {

  /**
   * Class that provides the basic implementation for disposable objects. If your
   * class holds references or resources that can't be collected by standard GC,
   * it should extend this class or implement the disposable interface (defined
   * in IDisposable). See description of
   * IDisposable for examples of cleanup.
   */
  constructor() {
    /**
     * Whether the object has been disposed of.
     * @type {boolean}
     * @private
     */
    this.disposed_ = false;
  
    /**
     * Callbacks to invoke when this object is disposed.
     * @type {Array<!Function>}
     * @private
     */
    this.onDisposeCallbacks_ = null;
  
    /**
     * If monitoring the Disposable instances is enabled, stores the creation
     * stack trace of the Disposable instance.
     * @type {string|undefined}
     */
    this.creationStack;
  
    if (MONITORING_MODE != Disposable.MonitoringMode.OFF) {
      if (INCLUDE_STACK_ON_CREATION) {
        this.creationStack = new Error().stack;
      }
      Disposable.instances_[google.getUid(this)] = this;
    }
    // Support sealing
    this.disposed_ = this.disposed_;
    this.onDisposeCallbacks_ = this.onDisposeCallbacks_;
  }

  /**
   * @return {!Array<!Disposable>} All `Disposable` objects that
   *     haven't been disposed of.
   */
  static getUndisposedObjects() {
    var ret = [];
    for (var id in Disposable.instances_) {
      if (Disposable.instances_.hasOwnProperty(id)) {
        ret.push(Disposable.instances_[Number(id)]);
      }
    }
    return ret;
  };

  /**
   * Clears the registry of undisposed objects but doesn't dispose of them.
   */
  static clearUndisposedObjects() {
    Disposable.instances_ = {};
  };

  /**
   * @return {boolean} Whether the object has been disposed of.
   * @override
   */
  isDisposed() {
    return this.disposed_;
  };

  /**
   * @return {boolean} Whether the object has been disposed of.
   * @deprecated Use {@link #isDisposed} instead.
   */
  getDisposed() {
    return this.isDisposed();
  }

  /**
   * Disposes of the object. If the object hasn't already been disposed of, calls
   * {@link #disposeInternal}. Classes that extend `Disposable` should
   * override {@link #disposeInternal} in order to cleanup references, resources
   * and other disposable objects. Reentrant.
   *
   * @return {void} Nothing.
   * @override
   */
  dispose() {
    if (!this.disposed_) {
      // Set disposed_ to true first, in case during the chain of disposal this
      // gets disposed recursively.
      this.disposed_ = true;
      this.disposeInternal();
      if (MONITORING_MODE != Disposable.MonitoringMode.OFF) {
        var uid = google.getUid(this);
        if (MONITORING_MODE ==
                Disposable.MonitoringMode.PERMANENT &&
            !Disposable.instances_.hasOwnProperty(uid)) {
          throw new Error(
              this + ' did not call the Disposable base ' +
              'constructor or was disposed of after a clearUndisposedObjects ' +
              'call');
        }
        if (MONITORING_MODE !=
                Disposable.MonitoringMode.OFF &&
            this.onDisposeCallbacks_ && this.onDisposeCallbacks_.length > 0) {
          throw new Error(
              this + ' did not empty its onDisposeCallbacks queue. This ' +
              'probably means it overrode dispose() or disposeInternal() ' +
              'without calling the superclass\' method.');
        }
        delete Disposable.instances_[uid];
      }
    }
  };

  /**
   * Associates a disposable object with this object so that they will be disposed
   * together.
   * @param {IDisposable} disposable that will be disposed when
   *     this object is disposed.
   */
  registerDisposable(disposable) {
    this.addOnDisposeCallback(google.partial(dispose, disposable));
  };

  /**
   * Invokes a callback function when this object is disposed. Callbacks are
   * invoked in the order in which they were added. If a callback is added to
   * an already disposed Disposable, it will be called immediately.
   * @param {function(this:T):?} callback The callback function.
   * @param {T=} opt_scope An optional scope to call the callback in.
   * @template T
   */
  addOnDisposeCallback(callback, opt_scope) {
    if (this.disposed_) {
      opt_scope !== undefined ? callback.call(opt_scope) : callback();
      return;
    }
    if (!this.onDisposeCallbacks_) {
      this.onDisposeCallbacks_ = [];
    }
  
    this.onDisposeCallbacks_.push(
        opt_scope !== undefined ? google.bind(callback, opt_scope) : callback);
  };

  /**
   * Performs appropriate cleanup. See description of IDisposable
   * for examples. Classes that extend `Disposable` should override this
   * method. Not reentrant. To avoid calling it twice, it must only be called from
   * the subclass' `disposeInternal` method. Everywhere else the public `dispose`
   * method must be used. For example:
   *
   * <pre>
   * mypackage.MyClass = function() {
   * mypackage.MyClass.base(this, 'constructor');
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
   *
   * @protected
   */
  disposeInternal() {
    if (this.onDisposeCallbacks_) {
      while (this.onDisposeCallbacks_.length) {
        this.onDisposeCallbacks_.shift()();
      }
    }
  };

  /**
   * Returns True if we can verify the object is disposed.
   * Calls `isDisposed` on the argument if it supports it.  If obj
   * is not an object with an isDisposed() method, return false.
   * @param {*} obj The object to investigate.
   * @return {boolean} True if we can verify the object is disposed.
   */
  static isDisposed(obj) {
    if (obj && typeof obj.isDisposed == 'function') {
      return obj.isDisposed();
    }
    return false;
  };
}

/**
 * @enum {number} Different monitoring modes for Disposable.
 */
Disposable.MonitoringMode = {
  /**
   * No monitoring.
   */
  OFF: 0,
  /**
   * Creating and disposing the Disposable instances is monitored. All
   * disposable objects need to call the `Disposable` base
   * constructor. The PERMANENT mode must be switched on before creating any
   * Disposable instances.
   */
  PERMANENT: 1,
  /**
   * INTERACTIVE mode can be switched on and off on the fly without producing
   * errors. It also doesn't warn if the disposable objects don't call the
   * `Disposable` base constructor.
   */
  INTERACTIVE: 2
};

/**
 * @type {number} The monitoring mode of the Disposable
 *     instances. Default is OFF. Switching on the monitoring is only
 *     recommended for debugging because it has a significant impact on
 *     performance and memory usage. If switched off, the monitoring code
 *     compiles down to 0 bytes.
 */
const MONITORING_MODE = 0;

/**
 * @type {boolean} Whether to attach creation stack to each created disposable
 *     instance; This is only relevant for when MonitoringMode != OFF.
 */
const INCLUDE_STACK_ON_CREATION = true;

/**
 * Maps the unique ID of every undisposed `Disposable` object to
 * the object itself.
 * @type {!Object<number, !Disposable>}
 * @private
 */
Disposable.instances_ = {};

export {Disposable, INCLUDE_STACK_ON_CREATION, MONITORING_MODE};