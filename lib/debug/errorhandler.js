import * as asserts from './../asserts/asserts.js';
import {Disposable} from './../disposable/disposable.js';
import * as google from './../google.js';
import {EntryPointMonitor} from './entrypointregistry.js';
import {Error as DebugError} from './error.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Error handling utilities.
 */

/**
 * The ErrorHandler can be used to to wrap functions with a try/catch
 * statement. If an exception is thrown, the given error handler function will
 * be called.
 *
 * When this object is disposed, it will stop handling exceptions and tracing.
 * It will also try to restore window.setTimeout and window.setInterval
 * if it wrapped them. Notice that in the general case, it is not technically
 * possible to remove the wrapper, because functions have no knowledge of
 * what they have been assigned to. So the app is responsible for other
 * forms of unwrapping.
 *
 * @extends {Disposable}
 * @implements {EntryPointMonitor}
 */
class ErrorHandler extends Disposable {

  /**
   * The ErrorHandler can be used to to wrap functions with a try/catch
   * statement. If an exception is thrown, the given error handler function will
   * be called.
   *
   * When this object is disposed, it will stop handling exceptions and tracing.
   * It will also try to restore window.setTimeout and window.setInterval
   * if it wrapped them. Notice that in the general case, it is not technically
   * possible to remove the wrapper, because functions have no knowledge of
   * what they have been assigned to. So the app is responsible for other
   * forms of unwrapping.
   *
   * @param {Function} handler Handler for exceptions.
   */
  constructor(handler) {
    super();
  
    /**
     * Handler for exceptions, which can do logging, reporting, etc.
     * @type {Function}
     * @private
     */
    this.errorHandlerFn_ = handler;
  
    /**
     * Whether errors should be wrapped in
     * ProtectedFunctionError before rethrowing.
     * @type {boolean}
     * @private
     */
    this.wrapErrors_ = true;  // TODO(malteubl) Change default.
  
    /**
     * Whether to add a prefix to all error messages. The prefix is
     * ProtectedFunctionError.MESSAGE_PREFIX. This option
     * only has an effect if this.wrapErrors_  is set to false.
     * @type {boolean}
     * @private
     */
    this.prefixErrorMessages_ = false;
  }

  /** @override */
  wrap(fn) {
    return this.protectEntryPoint(asserts.assertFunction(fn));
  };

  /** @override */
  unwrap(fn) {
    asserts.assertFunction(fn);
    return fn[this.getFunctionIndex_(false)] || fn;
  };

  /**
   * Get the index for a function. Used for internal indexing.
   * @param {boolean} wrapper True for the wrapper; false for the wrapped.
   * @return {string} The index where we should store the function in its
   *     wrapper/wrapped function.
   * @private
   */
  getFunctionIndex_(wrapper) {
    return (wrapper ? '__wrapper_' : '__protected_') + google.getUid(this) + '__';
  };

  /**
   * Installs exception protection for an entry point function. When an exception
   * is thrown from a protected function, a handler will be invoked to handle it.
   *
   * @param {Function} fn An entry point function to be protected.
   * @return {!Function} A protected wrapper function that calls the entry point
   *     function.
   */
  protectEntryPoint(fn) {
    var protectedFnName = this.getFunctionIndex_(true);
    if (!fn[protectedFnName]) {
      var wrapper = fn[protectedFnName] = this.getProtectedFunction(fn);
      wrapper[this.getFunctionIndex_(false)] = fn;
    }
    return fn[protectedFnName];
  };

  /**
   * Helps {@link #protectEntryPoint} by actually creating the protected
   * wrapper function, after {@link #protectEntryPoint} determines that one does
   * not already exist for the given function.  Can be overridden by subclasses
   * that may want to implement different error handling, or add additional
   * entry point hooks.
   * @param {!Function} fn An entry point function to be protected.
   * @return {!Function} protected wrapper function.
   * @protected
   */
  getProtectedFunction(fn) {
    var that = this;
    function googDebugErrorHandlerProtectedFunction() {
      var self = /** @type {?} */ (this);
      if (that.isDisposed()) {
        return fn.apply(self, arguments);
      }
  
      try {
        return fn.apply(self, arguments);
      } catch (e) {
        that.handleError_(e);
      }
    };
    googDebugErrorHandlerProtectedFunction[this.getFunctionIndex_(false)] = fn;
    return googDebugErrorHandlerProtectedFunction;
  };

  /**
   * Internal error handler.
   * @param {?} e The error string or an Error-like object.
   * @private
   */
  handleError_(e) {
    // Don't re-report errors that have already been handled by this code.
    var MESSAGE_PREFIX =
        ProtectedFunctionError.MESSAGE_PREFIX;
    if ((e && typeof e === 'object' && typeof e.message === 'string' &&
         e.message.indexOf(MESSAGE_PREFIX) == 0) ||
        (typeof e === 'string' && e.indexOf(MESSAGE_PREFIX) == 0)) {
      return;
    }
    this.errorHandlerFn_(e);
    if (!this.wrapErrors_) {
      // Add the prefix to the existing message.
      if (this.prefixErrorMessages_) {
        if (typeof e === 'object' && e && typeof e.message === 'string') {
          /** @type {{message}} */ (e).message = MESSAGE_PREFIX + e.message;
        } else {
          e = MESSAGE_PREFIX + e;
        }
      }
      if (google.DEBUG) {
        // Work around for https://code.google.com/p/v8/issues/detail?id=2625
        // and https://code.google.com/p/chromium/issues/detail?id=237059
        // Custom errors and errors with custom stack traces show the wrong
        // stack trace
        // If it has a stack and Error.captureStackTrace is supported (only
        // supported in V8 as of May 2013) log the stack to the console.
        if (e && typeof e.stack === 'string' && Error.captureStackTrace &&
            window['console']) {
          window['console']['error'](e.message, e.stack);
        }
      }
      // Re-throw original error. This is great for debugging as it makes
      // browser JS dev consoles show the correct error and stack trace.
      throw e;
    }
    // Re-throw it since this may be expected by the caller.
    throw new ProtectedFunctionError(e);
  };

  /**
   * Installs exception protection for window.setTimeout to handle exceptions.
   */
  protectWindowSetTimeout() {
    this.protectWindowFunctionsHelper_('setTimeout');
  };

  /**
   * Install exception protection for window.setInterval to handle exceptions.
   */
  protectWindowSetInterval() {
    this.protectWindowFunctionsHelper_('setInterval');
  };

  /**
   * Install an unhandledrejection event listener that reports rejected promises.
   * Note: this will only work with Chrome 49+ and friends, but so far is the only
   * way to report uncaught errors in aysnc/await functions.
   * @param {!Window=} win the window to instrument, defaults to current window
   */
  catchUnhandledRejections(win) {
    win = win || window['window'];
    if ('onunhandledrejection' in win) {
      win.onunhandledrejection = (event) => {
        // event.reason contains the rejection reason. When an Error is
        // thrown, this is the Error object. If it is undefined, create a new
        // error object.
        const e =
            event && event.reason ? event.reason : new Error('uncaught error');
        this.handleError_(e);
      };
    }
  };

  /**
   * Install exception protection for window.requestAnimationFrame to handle
   * exceptions.
   */
  protectWindowRequestAnimationFrame() {
    var win = window['window'];
    var fnNames = [
      'requestAnimationFrame', 'mozRequestAnimationFrame', 'webkitAnimationFrame',
      'msRequestAnimationFrame'
    ];
    for (var i = 0; i < fnNames.length; i++) {
      var fnName = fnNames[i];
      if (fnNames[i] in win) {
        this.protectWindowFunctionsHelper_(fnName);
      }
    }
  };

  /**
   * Helper function for protecting a function that causes a function to be
   * asynchronously called, for example setTimeout or requestAnimationFrame.
   * @param {string} fnName The name of the function to protect.
   * @private
   */
  protectWindowFunctionsHelper_(
      fnName) {
    var win = window['window'];
    var originalFn = win[fnName];
    var that = this;
    win[fnName] = function(fn, time) {
      // Don't try to protect strings. In theory, we could try to globalEval
      // the string, but this seems to lead to permission errors on IE6.
      if (typeof fn === 'string') {
        fn = google.partial(google.globalEval, fn);
      }
      arguments[0] = fn = that.protectEntryPoint(fn);
  
      // IE doesn't support .call for setInterval/setTimeout, but it
      // also doesn't care what "this" is, so we can just call the
      // original function directly
      if (originalFn.apply) {
        return originalFn.apply(/** @type {?} */ (this), arguments);
      } else {
        var callback = fn;
        if (arguments.length > 2) {
          var args = Array.prototype.slice.call(arguments, 2);
          callback = function() {
            fn.apply(/** @type {?} */ (this), args);
          };
        }
        return originalFn(callback, time);
      }
    };
    win[fnName][this.getFunctionIndex_(false)] = originalFn;
  };

  /**
   * Set whether to wrap errors that occur in protected functions in a
   * ProtectedFunctionError.
   * @param {boolean} wrapErrors Whether to wrap errors.
   */
  setWrapErrors(wrapErrors) {
    this.wrapErrors_ = wrapErrors;
  };

  /**
   * Set whether to add a prefix to all error messages that occur in protected
   * functions.
   * @param {boolean} prefixErrorMessages Whether to add a prefix to error
   *     messages.
   */
  setPrefixErrorMessages(
      prefixErrorMessages) {
    this.prefixErrorMessages_ = prefixErrorMessages;
  };

  /** @override */
  disposeInternal() {
    // Try to unwrap window.setTimeout and window.setInterval.
    var win = window['window'];
    win.setTimeout = this.unwrap(win.setTimeout);
    win.setInterval = this.unwrap(win.setInterval);
  
    super.disposeInternal();
  };
}

// TODO(mknichel): Allow these functions to take in the window to protect.

/**
 * Error thrown to the caller of a protected entry point if the entry point
 * throws an error.
 * @extends {DebugError}
 * @final
 */
class ProtectedFunctionError extends DebugError {

  /**
   * Error thrown to the caller of a protected entry point if the entry point
   * throws an error.
   * @param {*} cause The error thrown by the entry point.
   */
  constructor(cause) {
    /** @suppress {missingProperties} message may not be defined. */
    var message = ProtectedFunctionError.MESSAGE_PREFIX +
        (cause && cause.message ? String(cause.message) : String(cause));
    super(message, /** @type {?} */ (cause));
  
    /** @suppress {missingProperties} stack may not be defined. */
    var stack = cause && cause.stack;
    if (stack && typeof stack === 'string') {
      this.stack = /** @type {string} */ (stack);
    }
  }
}

/**
 * Text to prefix the message with.
 * @type {string}
 */
ProtectedFunctionError.MESSAGE_PREFIX =
    'Error in protected function: ';

export {ErrorHandler, ProtectedFunctionError};