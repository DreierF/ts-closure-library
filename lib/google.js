// Copyright 2006 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

/**
 * @fileoverview Bootstrap for the Google JS Library (Closure).
 *
 * In uncompiled mode base.js will attempt to load Closure's deps file, unless
 * the global <code>CLOSURE_NO_DEPS</code> is set to true.  This allows projects
 * to include their own deps file(s) from different locations.
 *
 * Avoid including base.js more than once. This is strictly discouraged and not
 * supported. google.require(...) won't work properly in that case.
 *
 * @provideGoog
 */

/**
 * Reference to the global context.  In most cases this will be 'window'.
 * @const
 */
// window = window;

/**
 * A hook for overriding the define values in uncompiled mode.
 *
 * In uncompiled mode, `CLOSURE_UNCOMPILED_DEFINES` may be defined before
 * loading base.js.  If a key is defined in `CLOSURE_UNCOMPILED_DEFINES`,
 * `google.define` will use the value instead of the default value.  This
 * allows flags to be overwritten without compilation (this is normally
 * accomplished with the compiler's "define" flag).
 *
 * Example:
 * <pre>
 *   var CLOSURE_UNCOMPILED_DEFINES = {'goog.DEBUG': false};
 * </pre>
 *
 * @type {Object<string, (string|number|boolean)>|undefined}
 */
// window.CLOSURE_UNCOMPILED_DEFINES;

/**
 * A hook for overriding the define values in uncompiled or compiled mode,
 * like CLOSURE_UNCOMPILED_DEFINES but effective in compiled code.  In
 * uncompiled code CLOSURE_UNCOMPILED_DEFINES takes precedence.
 *
 * Also unlike CLOSURE_UNCOMPILED_DEFINES the values must be number, boolean or
 * string literals or the compiler will emit an error.
 *
 * While any @define value may be set, only those set with google.define will be
 * effective for uncompiled code.
 *
 * Example:
 * <pre>
 *   var CLOSURE_DEFINES = {'goog.DEBUG': false} ;
 * </pre>
 *
 * @type {Object<string, (string|number|boolean)>|undefined}
 */
// window.CLOSURE_DEFINES;

/**
 * Returns true if the specified value is not undefined.
 *
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is defined.
 * @deprecated Use `val !== undefined` instead.
 */
function isDef(val) {
  // void 0 always evaluates to undefined and hence we do not need to depend on
  // the definition of the global variable named 'undefined'.
  return val !== void 0;
};

/**
 * Returns true if the specified value is a string.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a string.
 * @deprecated Use `typeof val === 'string'` instead.
 */
function isString(val) {
  return typeof val == 'string';
};

/**
 * Returns true if the specified value is a boolean.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is boolean.
 * @deprecated Use `typeof val === 'boolean'` instead.
 */
function isBoolean(val) {
  return typeof val == 'boolean';
};

/**
 * Returns true if the specified value is a number.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a number.
 * @deprecated Use `typeof val === 'number'` instead.
 */
function isNumber(val) {
  return typeof val == 'number';
};

/**
 * Builds an object structure for the provided namespace path, ensuring that
 * names that already exist are not overwritten. For example:
 * "a.b.c" -> a = {};a.b={};a.b.c={};
 * Used by google.provide and exportSymbol.
 * @param {string} name name of the object that this file defines.
 * @param {*=} opt_object the object to expose at the end of the path.
 * @param {Object=} opt_objectToExportTo The object to add the path to; default
 *     is `window`.
 * @private
 */
function exportPath_(name, opt_object, opt_objectToExportTo) {
  var parts = name.split('.');
  var cur = opt_objectToExportTo || window;

  // Internet Explorer exhibits strange behavior when throwing errors from
  // methods externed in this manner.  See the testExportSymbolExceptions in
  // base_test.html for an example.
  if (!(parts[0] in cur) && typeof cur.execScript != 'undefined') {
    cur.execScript('var ' + parts[0]);
  }

  for (var part; parts.length && (part = parts.shift());) {
    if (!parts.length && opt_object !== undefined) {
      // last part and we have an object; use it
      cur[part] = opt_object;
    } else if (cur[part] && cur[part] !== Object.prototype[part]) {
      cur = cur[part];
    } else {
      cur = cur[part] = {};
    }
  }
};

/**
 * @type {number} Integer year indicating the set of browser features that are
 * guaranteed to be present.  This is defined to include exactly features that
 * work correctly on all "modern" browsers that are stable on January 1 of the
 * specified year.  For example,
 * ```js
 * if (FEATURESET_YEAR >= 2019) {
 *   // use APIs known to be available on all major stable browsers Jan 1, 2019
 * } else {
 *   // polyfill for older browsers
 * }
 * ```
 * This is intended to be the primary define for removing
 * unnecessary browser compatibility code (such as ponyfills and workarounds),
 * and should inform the default value for most other defines:
 * ```js
 * const ASSUME_NATIVE_PROMISE =
 *     google.define('ASSUME_NATIVE_PROMISE', FEATURESET_YEAR >= 2016);
 * ```
 *
 * The default assumption is that IE9 is the lowest supported browser, which was
 * first available Jan 1, 2012.
 *
 * TODO(user): Reference more thorough documentation when it's available.
 */
const FEATURESET_YEAR = 2012;

/**
 * @type {boolean} DEBUG is provided as a convenience so that debugging code
 * that should not be included in a production. It can be easily stripped
 * by specifying --define DEBUG=false to the Closure Compiler aka
 * JSCompiler. For example, most toString() methods should be declared inside an
 * "if (DEBUG)" conditional because they are generally used for debugging
 * purposes and it is difficult for the JSCompiler to statically determine
 * whether they are used.
 */
const DEBUG = true;

/**
 * @type {string} LOCALE defines the locale being used for compilation. It is
 * used to select locale specific data to be compiled in js binary. BUILD rule
 * can specify this value by "--define LOCALE=<locale_name>" as a compiler
 * option.
 *
 * Take into account that the locale code format is important. You should use
 * the canonical Unicode format with hyphen as a delimiter. Language must be
 * lowercase, Language Script - Capitalized, Region - UPPERCASE.
 * There are few examples: pt-BR, en, en-US, sr-Latin-BO, zh-Hans-CN.
 *
 * See more info about locale codes here:
 * http://www.unicode.org/reports/tr35/#Unicode_Language_and_Locale_Identifiers
 *
 * For language codes you should use values defined by ISO 693-1. See it here
 * http://www.w3.org/WAI/ER/IG/ert/iso639.htm. There is only one exception from
 * this rule: the Hebrew language. For legacy reasons the old code (iw) should
 * be used instead of the new code (he).
 *
 */
const LOCALE = 'en';  // default to en

/**
 * @type {boolean} Whether this code is running on trusted sites.
 *
 * On untrusted sites, several native functions can be defined or overridden by
 * external libraries like Prototype, Datejs, and JQuery and setting this flag
 * to false forces closure to use its own implementations when possible.
 *
 * If your JavaScript can be loaded by a third party site and you are wary about
 * relying on non-standard implementations, specify
 * "--define TRUSTED_SITE=false" to the compiler.
 */
const TRUSTED_SITE = true;

/**
 * @type {boolean} Whether a project is expected to be running in strict mode.
 *
 * This define can be used to trigger alternate implementations compatible with
 * running in EcmaScript Strict mode or warn about unavailable functionality.
 * @see https://goo.gl/PudQ4y
 *
 */
const STRICT_MODE_COMPATIBLE = false;

/**
 * @type {boolean} Whether code that calls {@link setTestOnly} should
 *     be disallowed in the compilation unit.
 */
const DISALLOW_TEST_ONLY_CODE = !DEBUG;

/**
 * @type {boolean} Whether to use a Chrome app CSP-compliant method for
 *     loading scripts via goog.require. @see appendScriptSrcNode_.
 */
const ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING = false;

/**
 * Returns CSP nonce, if set for any script tag.
 * @param {?Window=} opt_window The window context used to retrieve the nonce.
 *     Defaults to global context.
 * @return {string} CSP nonce or empty string if no nonce is present.
 */
function getScriptNonce(opt_window) {
  if (opt_window && opt_window != window) {
    return getScriptNonce_(opt_window.document);
  }
  if (cspNonce_ === null) {
    cspNonce_ = getScriptNonce_(window.document);
  }
  return cspNonce_;
};

/**
 * According to the CSP3 spec a nonce must be a valid base64 string.
 * @see https://www.w3.org/TR/CSP3/#grammardef-base64-value
 * @private @const
 */
let NONCE_PATTERN_ = /^[\w+/_-]+[=]{0,2}$/;

/**
 * @private {?string}
 */
let cspNonce_ = null;

/**
 * Returns CSP nonce, if set for any script tag.
 * @param {!Document} doc
 * @return {string} CSP nonce or empty string if no nonce is present.
 * @private
 */
function getScriptNonce_(doc) {
  var script = doc.querySelector && doc.querySelector('script[nonce]');
  if (script) {
    // Try to get the nonce from the IDL property first, because browsers that
    // implement additional nonce protection features (currently only Chrome) to
    // prevent nonce stealing via CSS do not expose the nonce via attributes.
    // See https://github.com/whatwg/html/issues/2369
    var nonce = script['nonce'] || script.getAttribute('nonce');
    if (nonce && NONCE_PATTERN_.test(nonce)) {
      return nonce;
    }
  }
  return '';
};

/**
 * Marks that the current file should only be used for testing, and never for
 * live code in production.
 *
 * In the case of unit tests, the message may optionally be an exact namespace
 * for the test (e.g. 'goog.stringTest'). The linter will then ignore the extra
 * provide (if not explicitly defined in the code).
 *
 * @param {string=} opt_message Optional message to add to the error that's
 *     raised when used in production code.
 */
function setTestOnly(opt_message) {
  if (DISALLOW_TEST_ONLY_CODE) {
    opt_message = opt_message || '';
    throw new Error(
        'Importing test-only code into non-debug environment' +
        (opt_message ? ': ' + opt_message : '.'));
  }
};

/**
 * Forward declares a symbol. This is an indication to the compiler that the
 * symbol may be used in the source yet is not required and may not be provided
 * in compilation.
 *
 * The most common usage of forward declaration is code that takes a type as a
 * function parameter but does not need to require it. By forward declaring
 * instead of requiring, no hard dependency is made, and (if not required
 * elsewhere) the namespace may never be required and thus, not be pulled
 * into the JavaScript binary. If it is required elsewhere, it will be type
 * checked as normal.
 *
 * Before using forwardDeclare, please read the documentation at
 * https://github.com/google/closure-compiler/wiki/Bad-Type-Annotation to
 * understand the options and tradeoffs when working with forward declarations.
 *
 * @param {string} name The namespace to forward declare in the form of
 *     "goog.package.part".
 */
function forwardDeclare(name) {};

/**
 * Forward declare type information. Used to assign types to window
 * referenced object that would otherwise result in unknown type references
 * and thus block property disambiguation.
 */
// forwardDeclare('Document');
// forwardDeclare('HTMLScriptElement');
// forwardDeclare('XMLHttpRequest');

/**
 * Returns an object based on its fully qualified external name.  The object
 * is not found if null or undefined.  If you are using a compilation pass that
 * renames property names beware that using this function will not find renamed
 * properties.
 *
 * @param {string} name The fully qualified name.
 * @param {Object=} opt_obj The object within which to look; default is
 *     |window|.
 * @return {?} The value (object or primitive) or, if not found, null.
 */
function getObjectByName(name, opt_obj) {
  var parts = name.split('.');
  var cur = opt_obj || window;
  for (var i = 0; i < parts.length; i++) {
    cur = cur[parts[i]];
    if (cur == null) {
      return null;
    }
  }
  return cur;
};

/**
 * Globalizes a whole namespace, such as goog or goog.lang.
 *
 * @param {!Object} obj The namespace to globalize.
 * @param {Object=} opt_global The object to add the properties to.
 * @deprecated Properties may be explicitly exported to the global scope, but
 *     this should no longer be done in bulk.
 */
function globalize(obj, opt_global) {
  var global = opt_global || window;
  for (var x in obj) {
    global[x] = obj[x];
  }
};

/**
 * @param {string} msg
 * @private
 */
function logToConsole_(msg) {
  if (window.console) {
    window.console['error'](msg);
  }
};

/**
 * A hook for overriding the base path.
 * @type {string|undefined}
 */
window.CLOSURE_BASE_PATH;

/**
 * Whether to attempt to load Closure's deps file. By default, when uncompiled,
 * deps files will attempt to be loaded.
 * @type {boolean|undefined}
 */
window.CLOSURE_NO_DEPS;

/**
 * A function to import a single script. This is meant to be overridden when
 * Closure is being run in non-HTML contexts, such as web workers. It's defined
 * in the global scope so that it can be set before base.js is loaded, which
 * allows deps.js to be imported properly.
 *
 * The first parameter the script source, which is a relative URI. The second,
 * optional parameter is the script contents, in the event the script needed
 * transformation. It should return true if the script was imported, false
 * otherwise.
 * @type {(function(string, string=): boolean)|undefined}
 */
window.CLOSURE_IMPORT_SCRIPT;

/**
 * Null function used for default values of callbacks, etc.
 * @return {void} Nothing.
 */
function nullFunction() {};

/**
 * When defining a class Foo with an abstract method bar(), you can do:
 * Foo.prototype.bar = abstractMethod
 *
 * Now if a subclass of Foo fails to override bar(), an error will be thrown
 * when bar() is invoked.
 *
 * @type {!Function}
 * @throws {Error} when invoked to indicate the method should be overridden.
 */
function abstractMethod() {
  throw new Error('unimplemented abstract method');
};

/**
 * Adds a `getInstance` static method that always returns the same
 * instance object.
 * @param {!Function} ctor The constructor for the class to add the static
 *     method to.
 * @suppress {missingProperties} 'instance_' isn't a property on 'Function'
 *     but we don't have a better type to use here.
 */
function addSingletonGetter(ctor) {
  // instance_ is immediately set to prevent issues with sealed constructors
  // such as are encountered when a constructor is returned as the export object
  // of a google.module in unoptimized code.
  // Delcare type to avoid conformance violations that ctor.instance_ is unknown
  /** @type {undefined|!Object} @suppress {underscore} */
  ctor.instance_ = undefined;
  ctor.getInstance = function() {
    if (ctor.instance_) {
      return ctor.instance_;
    }
    if (DEBUG) {
      // NOTE: JSCompiler can't optimize away Array#push.
      instantiatedSingletons_[instantiatedSingletons_.length] = ctor;
    }
    // Cast to avoid conformance violations that ctor.instance_ is unknown
    return /** @type {!Object|undefined} */ (ctor.instance_) = new ctor;
  };
};

/**
 * All singleton classes that have been instantiated, for testing. Don't read
 * it directly, use the `goog.testing.singleton` module. The compiler
 * removes this variable if unused.
 * @type {!Array<!Function>}
 * @private
 */
let instantiatedSingletons_ = [];

/**
 * @type {boolean} Whether to load google.modules using `eval` when using
 * the debug loader.  This provides a better debugging experience as the
 * source is unmodified and can be edited using Chrome Workspaces or similar.
 * However in some environments the use of `eval` is banned
 * so we provide an alternative.
 */
const LOAD_MODULE_USING_EVAL = true;

/**
 * @type {boolean} Whether the exports of google.modules should be sealed when
 * possible.
 */
const SEAL_MODULE_EXPORTS = DEBUG;

/**
 * @package {?boolean}
 * Visible for testing.
 */
let hasBadLetScoping = null;

/**
 * @return {boolean}
 * @package Visible for testing.
 */
function useSafari10Workaround() {
  if (hasBadLetScoping == null) {
    var hasBadLetScopingVar;
    try {
      hasBadLetScopingVar = !eval(
          '"use strict";' +
          'let x = 1; function f() { return typeof x; };' +
          'f() == "number";');
    } catch (e) {
      // Assume that ES6 syntax isn't supported.
      hasBadLetScopingVar = false;
    }
    hasBadLetScoping = hasBadLetScopingVar;
  }
  return hasBadLetScoping;
};

/**
 * @param {string} moduleDef
 * @return {string}
 * @package Visible for testing.
 */
function workaroundSafari10EvalBug(moduleDef) {
  return '(function(){' + moduleDef +
      '\n' +  // Terminate any trailing single line comment.
      ';' +   // Terminate any trailing expression.
      '})();\n';
};

//==============================================================================
// Language Enhancements
//==============================================================================

/**
 * This is a "fixed" version of the typeof operator.  It differs from the typeof
 * operator in such a way that null returns 'null' and arrays return 'array'.
 * @param {?} value The value to get the type of.
 * @return {string} The name of the type.
 */
function typeOf(value) {
  var s = typeof value;
  if (s == 'object') {
    if (value) {
      // Check these first, so we can avoid calling Object.prototype.toString if
      // possible.
      //
      // IE improperly marshals typeof across execution contexts, but a
      // cross-context object will still return false for "instanceof Object".
      if (value instanceof Array) {
        return 'array';
      } else if (value instanceof Object) {
        return s;
      }

      // HACK: In order to use an Object prototype method on the arbitrary
      //   value, the compiler requires the value be cast to type Object,
      //   even though the ECMA spec explicitly allows it.
      var className = Object.prototype.toString.call(
          /** @type {!Object} */ (value));
      // In Firefox 3.6, attempting to access iframe window objects' length
      // property throws an NS_ERROR_FAILURE, so we need to special-case it
      // here.
      if (className == '[object Window]') {
        return 'object';
      }

      // We cannot always use constructor == Array or instanceof Array because
      // different frames have different Array objects. In IE6, if the iframe
      // where the array was created is destroyed, the array loses its
      // prototype. Then dereferencing val.splice here throws an exception, so
      // we can't use isFunction. Calling typeof directly returns 'unknown'
      // so that will work. In this case, this function will return false and
      // most array functions will still work because the array is still
      // array-like (supports length and []) even though it has lost its
      // prototype.
      // Mark Miller noticed that Object.prototype.toString
      // allows access to the unforgeable [[Class]] property.
      //  15.2.4.2 Object.prototype.toString ( )
      //  When the toString method is called, the following steps are taken:
      //      1. Get the [[Class]] property of this object.
      //      2. Compute a string value by concatenating the three strings
      //         "[object ", Result(1), and "]".
      //      3. Return Result(2).
      // and this behavior survives the destruction of the execution context.
      if ((className == '[object Array]' ||
           // In IE all non value types are wrapped as objects across window
           // boundaries (not iframe though) so we have to do object detection
           // for this edge case.
           typeof value.length == 'number' &&
               typeof value.splice != 'undefined' &&
               typeof value.propertyIsEnumerable != 'undefined' &&
               !value.propertyIsEnumerable('splice')

               )) {
        return 'array';
      }
      // HACK: There is still an array case that fails.
      //     function ArrayImpostor() {}
      //     ArrayImpostor.prototype = [];
      //     var impostor = new ArrayImpostor;
      // this can be fixed by getting rid of the fast path
      // (value instanceof Array) and solely relying on
      // (value && Object.prototype.toString.vall(value) === '[object Array]')
      // but that would require many more function calls and is not warranted
      // unless closure code is receiving objects from untrusted sources.

      // IE in cross-window calls does not correctly marshal the function type
      // (it appears just as an object) so we cannot use just typeof val ==
      // 'function'. However, if the object has a call property, it is a
      // function.
      if ((className == '[object Function]' ||
           typeof value.call != 'undefined' &&
               typeof value.propertyIsEnumerable != 'undefined' &&
               !value.propertyIsEnumerable('call'))) {
        return 'function';
      }

    } else {
      return 'null';
    }

  } else if (s == 'function' && typeof value.call == 'undefined') {
    // In Safari typeof nodeList returns 'function', and on Firefox typeof
    // behaves similarly for HTML{Applet,Embed,Object}, Elements and RegExps. We
    // would like to return object for those and we can detect an invalid
    // function by making sure that the function object has a call method.
    return 'object';
  }
  return s;
};

/**
 * Returns true if the specified value is null.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is null.
 * @deprecated Use `val === null` instead.
 */
function isNull(val) {
  return val === null;
};

/**
 * Returns true if the specified value is defined and not null.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is defined and not null.
 * @deprecated Try to avoid having a variable use null and 
 * undefined at the same time by:
 * - Using default parameter values
 * - Nullish coalescing operator
 * - Optional chaining
 *
 * If none of the above is appicable use `!= null` to check for 
 * null and undefined
 */
function isDefAndNotNull(val) {
  // Note that undefined == null.
  return val != null;
};

/**
 * Returns true if the specified value is an array.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
function isArray(val) {
  return typeOf(val) == 'array';
};

/**
 * Returns true if the object looks like an array. To qualify as array like
 * the value needs to be either a NodeList or an object with a Number length
 * property. Note that for this function neither strings nor functions are
 * considered "array-like".
 *
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is an array.
 */
function isArrayLike(val) {
  var type = typeOf(val);
  // We do not use isObject here in order to exclude function values.
  return type == 'array' || type == 'object' && typeof val.length == 'number';
};

/**
 * Returns true if the object looks like a Date. To qualify as Date-like the
 * value needs to be an object and have a getFullYear() function.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a like a Date.
 */
function isDateLike(val) {
  return isObject(val) && typeof val.getFullYear == 'function';
};

/**
 * Returns true if the specified value is a function.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is a function.
 */
function isFunction(val) {
  return typeOf(val) == 'function';
};

/**
 * Returns true if the specified value is an object.  This includes arrays and
 * functions.
 * @param {?} val Variable to test.
 * @return {boolean} Whether variable is an object.
 */
function isObject(val) {
  var type = typeof val;
  return type == 'object' && val != null || type == 'function';
  // return Object(val) === val also works, but is slower, especially if val is
  // not an object.
};

/**
 * Gets a unique ID for an object. This mutates the object so that further calls
 * with the same object as a parameter returns the same value. The unique ID is
 * guaranteed to be unique across the current session amongst objects that are
 * passed into `getUid`. There is no guarantee that the ID is unique or
 * consistent across sessions. It is unsafe to generate unique ID for function
 * prototypes.
 *
 * @param {Object} obj The object to get the unique ID for.
 * @return {number} The unique ID for the object.
 */
function getUid(obj) {
  // TODO(arv): Make the type stricter, do not accept null.

  // In Opera window.hasOwnProperty exists but always returns false so we avoid
  // using it. As a consequence the unique ID generated for BaseClass.prototype
  // and SubClass.prototype will be the same.
  // TODO(b/141512323): UUIDs are broken for ctors with class-side inheritance.
  return obj[UID_PROPERTY_] ||
      (obj[UID_PROPERTY_] = ++uidCounter_);
};

/**
 * Whether the given object is already assigned a unique ID.
 *
 * This does not modify the object.
 *
 * @param {!Object} obj The object to check.
 * @return {boolean} Whether there is an assigned unique id for the object.
 */
function hasUid(obj) {
  return !!obj[UID_PROPERTY_];
};

/**
 * Removes the unique ID from an object. This is useful if the object was
 * previously mutated using `getUid` in which case the mutation is
 * undone.
 * @param {Object} obj The object to remove the unique ID field from.
 */
function removeUid(obj) {
  // TODO(arv): Make the type stricter, do not accept null.

  // In IE, DOM nodes are not instances of Object and throw an exception if we
  // try to delete.  Instead we try to use removeAttribute.
  if (obj !== null && 'removeAttribute' in obj) {
    obj.removeAttribute(UID_PROPERTY_);
  }

  try {
    delete obj[UID_PROPERTY_];
  } catch (ex) {
  }
};

/**
 * Name for unique ID property. Initialized in a way to help avoid collisions
 * with other closure JavaScript on the same page.
 * @type {string}
 * @private
 */
let UID_PROPERTY_ = 'closure_uid_' + ((Math.random() * 1e9) >>> 0);

/**
 * Counter for UID.
 * @type {number}
 * @private
 */
let uidCounter_ = 0;

/**
 * Adds a hash code field to an object. The hash code is unique for the
 * given object.
 * @param {Object} obj The object to get the hash code for.
 * @return {number} The hash code for the object.
 * @deprecated Use getUid instead.
 */
function getHashCode(obj) {
  return getUid(obj);
}

/**
 * Removes the hash code field from an object.
 * @param {Object} obj The object to remove the field from.
 * @deprecated Use removeUid instead.
 */
let removeHashCode = removeUid;

/**
 * Clones a value. The input may be an Object, Array, or basic type. Objects and
 * arrays will be cloned recursively.
 *
 * WARNINGS:
 * <code>cloneObject</code> does not detect reference loops. Objects that
 * refer to themselves will cause infinite recursion.
 *
 * <code>cloneObject</code> is unaware of unique identifiers, and copies
 * UIDs created by <code>getUid</code> into cloned results.
 *
 * @param {*} obj The value to clone.
 * @return {*} A clone of the input value.
 * @deprecated cloneObject is unsafe. Prefer the google.object methods.
 */
function cloneObject(obj) {
  var type = typeOf(obj);
  if (type == 'object' || type == 'array') {
    if (typeof obj.clone === 'function') {
      return obj.clone();
    }
    var clone = type == 'array' ? [] : {};
    for (var key in obj) {
      clone[key] = cloneObject(obj[key]);
    }
    return clone;
  }

  return obj;
};

/**
 * A native implementation of bind.
 * @param {?function(this:T, ...)} fn A function to partially apply.
 * @param {T} selfObj Specifies the object which this should point to when the
 *     function is run.
 * @param {...*} var_args Additional arguments that are partially applied to the
 *     function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @template T
 * @private
 */
function bindNative_(fn, selfObj, var_args) {
  return /** @type {!Function} */ (fn.call.apply(fn.bind, arguments));
};

/**
 * A pure-JS implementation of bind.
 * @param {?function(this:T, ...)} fn A function to partially apply.
 * @param {T} selfObj Specifies the object which this should point to when the
 *     function is run.
 * @param {...*} var_args Additional arguments that are partially applied to the
 *     function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @template T
 * @private
 */
function bindJs_(fn, selfObj, var_args) {
  if (!fn) {
    throw new Error();
  }

  if (arguments.length > 2) {
    var boundArgs = Array.prototype.slice.call(arguments, 2);
    return function() {
      // Prepend the bound arguments to the current arguments.
      var newArgs = Array.prototype.slice.call(arguments);
      Array.prototype.unshift.apply(newArgs, boundArgs);
      return fn.apply(selfObj, newArgs);
    };

  } else {
    return function() {
      return fn.apply(selfObj, arguments);
    };
  }
};

/**
 * Partially applies this function to a particular 'this object' and zero or
 * more arguments. The result is a new function with some arguments of the first
 * function pre-filled and the value of this 'pre-specified'.
 *
 * Remaining arguments specified at call-time are appended to the pre-specified
 * ones.
 *
 * Also see: {@link #partial}.
 *
 * Usage:
 * <pre>var barMethBound = bind(myFunction, myObj, 'arg1', 'arg2');
 * barMethBound('arg3', 'arg4');</pre>
 *
 * @param {?function(this:T, ...)} fn A function to partially apply.
 * @param {T} selfObj Specifies the object which this should point to when the
 *     function is run.
 * @param {...*} var_args Additional arguments that are partially applied to the
 *     function.
 * @return {!Function} A partially-applied form of the function bind() was
 *     invoked as a method of.
 * @template T
 * @suppress {deprecated} See above.
 * @deprecated Use an arrow function or fn.bind(selfObj[, args])
 */
function bind(fn, selfObj, var_args) {
  // TODO(nicksantos): narrow the type signature.
  if (Function.prototype.bind &&
      // NOTE(nicksantos): Somebody pulled base.js into the default Chrome
      // extension environment. This means that for Chrome extensions, they get
      // the implementation of Function.prototype.bind that calls bind
      // instead of the native one. Even worse, we don't want to introduce a
      // circular dependency between bind and Function.prototype.bind, so
      // we have to hack this to make sure it works correctly.
      Function.prototype.bind.toString().indexOf('native code') != -1) {
    bind = bindNative_;
  } else {
    bind = bindJs_;
  }
  return bind.apply(null, arguments);
};

/**
 * Like bind(), except that a 'this object' is not required. Useful when
 * the target function is already bound.
 *
 * Usage:
 * var g = partial(f, arg1, arg2);
 * g(arg3, arg4);
 *
 * @param {Function} fn A function to partially apply.
 * @param {...*} var_args Additional arguments that are partially applied to fn.
 * @return {!Function} A partially-applied form of the function partial()
 *     was invoked as a method of.
 */
function partial(fn, var_args) {
  var args = Array.prototype.slice.call(arguments, 1);
  return function() {
    // Clone the array (with slice()) and append additional arguments
    // to the existing arguments.
    var newArgs = args.slice();
    newArgs.push.apply(newArgs, arguments);
    return fn.apply(/** @type {?} */ (this), newArgs);
  };
};

/**
 * Copies all the members of a source object to a target object. This method
 * does not work on all browsers for all objects that contain keys such as
 * toString or hasOwnProperty. Use goog.object.extend for this purpose.
 *
 * NOTE: Some have advocated for the use of mixin to setup classes
 * with multiple inheritence (traits, mixins, etc).  However, as it simply
 * uses "for in", this is not compatible with ES6 classes whose methods are
 * non-enumerable.  Changing this, would break cases where non-enumerable
 * properties are not expected.
 *
 * @param {Object} target Target.
 * @param {Object} source Source.
 * @deprecated Prefer Object.assign
 */
function mixin(target, source) {
  for (var x in source) {
    target[x] = source[x];
  }

  // For IE7 or lower, the for-in-loop does not contain any properties that are
  // not enumerable on the prototype object (for example, isPrototypeOf from
  // Object.prototype) but also it will not include 'replace' on objects that
  // extend String and change 'replace' (not that it is common for anyone to
  // extend anything except Object).
};

/**
 * @return {number} An integer value representing the number of milliseconds
 *     between midnight, January 1, 1970 and the current time.
 * @deprecated Use Date.now
 */
let now = (TRUSTED_SITE && Date.now) || (function() {
             // Unary plus operator converts its operand to a number which in
             // the case of
             // a date is done by calling getTime().
             return +new Date();
           });

/**
 * Evals JavaScript in the global scope.  In IE this uses execScript, other
 * browsers use window.eval. If window.eval does not evaluate in the
 * global scope (for example, in Safari), appends a script tag instead.
 * Throws an exception if neither execScript or eval is defined.
 * @param {string} script JavaScript string.
 */
function globalEval(script) {
  if (window.execScript) {
    window.execScript(script, 'JavaScript');
  } else if (window.eval) {
    // Test to see if eval works
    if (evalWorksForGlobals_ == null) {
      try {
        window.eval('var _evalTest_ = 1;');
      } catch (ignore) {
      }
      if (typeof window['_evalTest_'] != 'undefined') {
        try {
          delete window['_evalTest_'];
        } catch (ignore) {
          // Microsoft edge fails the deletion above in strict mode.
        }
        evalWorksForGlobals_ = true;
      } else {
        evalWorksForGlobals_ = false;
      }
    }

    if (evalWorksForGlobals_) {
      window.eval(script);
    } else {
      /** @type {!Document} */
      var doc = window.document;
      var scriptElt =
          /** @type {!HTMLScriptElement} */ (doc.createElement('script'));
      scriptElt.type = 'text/javascript';
      scriptElt.defer = false;
      // Note(user): can't use .innerHTML since "t('<test>')" will fail and
      // .text doesn't work in Safari 2.  Therefore we append a text node.
      scriptElt.appendChild(doc.createTextNode(script));
      doc.head.appendChild(scriptElt);
      doc.head.removeChild(scriptElt);
    }
  } else {
    throw new Error('google.globalEval not available');
  }
};

/**
 * Indicates whether or not we can call 'eval' directly to eval code in the
 * global scope. Set to a Boolean by the first call to globalEval (which
 * empirically tests whether eval works for globals). @see globalEval
 * @type {?boolean}
 * @private
 */
let evalWorksForGlobals_ = null;

/**
 * Optional map of CSS class names to obfuscated names used with
 * getCssName().
 * @private {!Object<string, string>|undefined}
 * @see setCssNameMapping
 */
let cssNameMapping_;

/**
 * Optional obfuscation style for CSS class names. Should be set to either
 * 'BY_WHOLE' or 'BY_PART' if defined.
 * @type {string|undefined}
 * @private
 * @see setCssNameMapping
 */
let cssNameMappingStyle_;

/**
 * A hook for modifying the default behavior getCssName. The function
 * if present, will receive the standard output of the getCssName as
 * its input.
 *
 * @type {(function(string):string)|undefined}
 */
window.CLOSURE_CSS_NAME_MAP_FN;

/**
 * Handles strings that are intended to be used as CSS class names.
 *
 * This function works in tandem with @see setCssNameMapping.
 *
 * Without any mapping set, the arguments are simple joined with a hyphen and
 * passed through unaltered.
 *
 * When there is a mapping, there are two possible styles in which these
 * mappings are used. In the BY_PART style, each part (i.e. in between hyphens)
 * of the passed in css name is rewritten according to the map. In the BY_WHOLE
 * style, the full css name is looked up in the map directly. If a rewrite is
 * not specified by the map, the compiler will output a warning.
 *
 * When the mapping is passed to the compiler, it will replace calls to
 * getCssName with the strings from the mapping, e.g.
 *     var x = getCssName('foo');
 *     var y = getCssName(this.baseClass, 'active');
 *  becomes:
 *     var x = 'foo';
 *     var y = this.baseClass + '-active';
 *
 * If one argument is passed it will be processed, if two are passed only the
 * modifier will be processed, as it is assumed the first argument was generated
 * as a result of calling getCssName.
 *
 * @param {string} className The class name.
 * @param {string=} opt_modifier A modifier to be appended to the class name.
 * @return {string} The class name or the concatenation of the class name and
 *     the modifier.
 */
function getCssName(className, opt_modifier) {
  // String() is used for compatibility with compiled soy where the passed
  // className can be non-string objects.
  if (String(className).charAt(0) == '.') {
    throw new Error(
        'className passed in getCssName must not start with ".".' +
        ' You passed: ' + className);
  }

  function getMapping(cssName) {
    return cssNameMapping_[cssName] || cssName;
  };

  function renameByParts(cssName) {
    // Remap all the parts individually.
    var parts = cssName.split('-');
    var mapped = [];
    for (var i = 0; i < parts.length; i++) {
      mapped.push(getMapping(parts[i]));
    }
    return mapped.join('-');
  };

  var rename;
  if (cssNameMapping_) {
    rename =
        cssNameMappingStyle_ == 'BY_WHOLE' ? getMapping : renameByParts;
  } else {
    rename = function(a) {
      return a;
    };
  }

  var result =
      opt_modifier ? className + '-' + rename(opt_modifier) : rename(className);

  // The special CLOSURE_CSS_NAME_MAP_FN allows users to specify further
  // processing of the class name.
  if (window.CLOSURE_CSS_NAME_MAP_FN) {
    return window.CLOSURE_CSS_NAME_MAP_FN(result);
  }

  return result;
};

/**
 * Sets the map to check when returning a value from getCssName(). Example:
 * <pre>
 * setCssNameMapping({
 *   "goog": "a",
 *   "disabled": "b",
 * });
 *
 * var x = getCssName('goog');
 * // The following evaluates to: "a a-b".
 * getCssName('goog') + ' ' + getCssName(x, 'disabled')
 * </pre>
 * When declared as a map of string literals to string literals, the JSCompiler
 * will replace all calls to getCssName() using the supplied map if the
 * --process_closure_primitives flag is set.
 *
 * @param {!Object} mapping A map of strings to strings where keys are possible
 *     arguments to getCssName() and values are the corresponding values
 *     that should be returned.
 * @param {string=} opt_style The style of css name mapping. There are two valid
 *     options: 'BY_PART', and 'BY_WHOLE'.
 * @see getCssName for a description.
 */
function setCssNameMapping(mapping, opt_style) {
  cssNameMapping_ = mapping;
  cssNameMappingStyle_ = opt_style;
};

/**
 * To use CSS renaming in compiled mode, one of the input files should have a
 * call to setCssNameMapping() with an object literal that the JSCompiler
 * can extract and use to replace all calls to getCssName(). In uncompiled
 * mode, JavaScript code should be loaded before this base.js file that declares
 * a global variable, CLOSURE_CSS_NAME_MAPPING, which is used below. This is
 * to ensure that the mapping is loaded before any calls to getCssName()
 * are made in uncompiled mode.
 *
 * A hook for overriding the CSS name mapping.
 * @type {!Object<string, string>|undefined}
 */
window.CLOSURE_CSS_NAME_MAPPING;

/**
 * Gets a localized message.
 *
 * This function is a compiler primitive. If you give the compiler a localized
 * message bundle, it will replace the string at compile-time with a localized
 * version, and expand getMsg call to a concatenated string.
 *
 * Messages must be initialized in the form:
 * <code>
 * var MSG_NAME = getMsg('Hello {$placeholder}', {'placeholder': 'world'});
 * </code>
 *
 * This function produces a string which should be treated as plain text. Use
 * {@link goog.html.SafeHtmlFormatter} in conjunction with getMsg to
 * produce SafeHtml.
 *
 * @param {string} str Translatable string, places holders in the form {$foo}.
 * @param {Object<string, string>=} opt_values Maps place holder name to value.
 * @param {{html: boolean}=} opt_options Options:
 *     html: Escape '<' in str to '&lt;'. Used by Closure Templates where the
 *     generated code size and performance is critical which is why {@link
 *     goog.html.SafeHtmlFormatter} is not used. The value must be literal true
 *     or false.
 * @return {string} message with placeholders filled.
 */
function getMsg(str, opt_values, opt_options) {
  if (opt_options && opt_options.html) {
    // Note that '&' is not replaced because the translation can contain HTML
    // entities.
    str = str.replace(/</g, '&lt;');
  }
  if (opt_values) {
    str = str.replace(/\{\$([^}]+)}/g, function(match, key) {
      return (opt_values != null && key in opt_values) ? opt_values[key] :
                                                         match;
    });
  }
  return str;
};

/**
 * Gets a localized message. If the message does not have a translation, gives a
 * fallback message.
 *
 * This is useful when introducing a new message that has not yet been
 * translated into all languages.
 *
 * This function is a compiler primitive. Must be used in the form:
 * <code>var x = getMsgWithFallback(MSG_A, MSG_B);</code>
 * where MSG_A and MSG_B were initialized with getMsg.
 *
 * @param {string} a The preferred message.
 * @param {string} b The fallback message.
 * @return {string} The best translated message.
 */
function getMsgWithFallback(a, b) {
  return a;
};

/**
 * Exposes an unobfuscated global namespace path for the given object.
 * Note that fields of the exported object *will* be obfuscated, unless they are
 * exported in turn via this function or exportProperty.
 *
 * Also handy for making public items that are defined in anonymous closures.
 *
 * ex. exportSymbol('public.path.Foo', Foo);
 *
 * ex. exportSymbol('public.path.Foo.staticFunction', Foo.staticFunction);
 *     public.path.Foo.staticFunction();
 *
 * ex. exportSymbol('public.path.Foo.prototype.myMethod',
 *                       Foo.prototype.myMethod);
 *     new public.path.Foo().myMethod();
 *
 * @param {string} publicPath Unobfuscated name to export.
 * @param {*} object Object the name should point to.
 * @param {Object=} opt_objectToExportTo The object to add the path to; default
 *     is window.
 */
function exportSymbol(publicPath, object, opt_objectToExportTo) {
  exportPath_(publicPath, object, opt_objectToExportTo);
};

/**
 * Exports a property unobfuscated into the object's namespace.
 * ex. exportProperty(Foo, 'staticFunction', Foo.staticFunction);
 * ex. exportProperty(Foo.prototype, 'myMethod', Foo.prototype.myMethod);
 * @param {Object} object Object whose static property is being exported.
 * @param {string} publicName Unobfuscated name to export.
 * @param {*} symbol Object the name should point to.
 */
function exportProperty(object, publicName, symbol) {
  object[publicName] = symbol;
};

/**
 * Inherit the prototype methods from one constructor into another.
 *
 * Usage:
 * <pre>
 * function ParentClass(a, b) { }
 * ParentClass.prototype.foo = function(a) { };
 *
 * function ChildClass(a, b, c) {
 *   ChildClass.base(this, 'constructor', a, b);
 * }
 * inherits(ChildClass, ParentClass);
 *
 * var child = new ChildClass('a', 'b', 'see');
 * child.foo(); // This works.
 * </pre>
 *
 * @param {!Function} childCtor Child class.
 * @param {!Function} parentCtor Parent class.
 * @suppress {strictMissingProperties} superClass_ and base is not defined on
 *    Function.
 */
function inherits(childCtor, parentCtor) {
  /** @constructor */
  function tempCtor() {}
  tempCtor.prototype = parentCtor.prototype;
  childCtor.superClass_ = parentCtor.prototype;
  childCtor.prototype = new tempCtor();
  /** @override */
  childCtor.prototype.constructor = childCtor;

  /**
   * Calls superclass constructor/method.
   *
   * This function is only available if you use inherits to
   * express inheritance relationships between classes.
   *
   * NOTE: This is a replacement for base and for superClass_
   * property defined in childCtor.
   *
   * @param {!Object} me Should always be "this".
   * @param {string} methodName The method name to call. Calling
   *     superclass constructor can be done with the special string
   *     'constructor'.
   * @param {...*} var_args The arguments to pass to superclass
   *     method/constructor.
   * @return {*} The return value of the superclass method/constructor.
   */
  childCtor.base = function(me, methodName, var_args) {
    // Copying using loop to avoid deop due to passing arguments object to
    // function. This is faster in many JS engines as of late 2014.
    var args = new Array(arguments.length - 2);
    for (var i = 2; i < arguments.length; i++) {
      args[i - 2] = arguments[i];
    }
    return parentCtor.prototype[methodName].apply(me, args);
  };
};

/**
 * Call up to the superclass.
 *
 * If this is called from a constructor, then this calls the superclass
 * constructor with arguments 1-N.
 *
 * If this is called from a prototype method, then you must pass the name of the
 * method as the second argument to this function. If you do not, you will get a
 * runtime error. This calls the superclass' method with arguments 2-N.
 *
 * This function only works if you use inherits to express inheritance
 * relationships between your classes.
 *
 * This function is a compiler primitive. At compile-time, the compiler will do
 * macro expansion to remove a lot of the extra overhead that this function
 * introduces. The compiler will also enforce a lot of the assumptions that this
 * function makes, and treat it as a compiler error if you break them.
 *
 * @param {!Object} me Should always be "this".
 * @param {*=} opt_methodName The method name if calling a super method.
 * @param {...*} var_args The rest of the arguments.
 * @return {*} The return value of the superclass method.
 * @suppress {es5Strict} This method can not be used in strict mode, but
 *     all Closure Library consumers must depend on this file.
 * @deprecated base is not strict mode compatible.  Prefer the static
 *     "base" method added to the constructor by inherits
 *     or ES6 classes and the "super" keyword.
 */
function base(me, opt_methodName, var_args) {
  var caller = arguments.callee.caller;

  if (STRICT_MODE_COMPATIBLE || (DEBUG && !caller)) {
    throw new Error(
        'arguments.caller not defined.  base() cannot be used ' +
        'with strict mode code. See ' +
        'http://www.ecma-international.org/ecma-262/5.1/#sec-C');
  }

  if (typeof caller.superClass_ !== 'undefined') {
    // Copying using loop to avoid deop due to passing arguments object to
    // function. This is faster in many JS engines as of late 2014.
    var ctorArgs = new Array(arguments.length - 1);
    for (var i = 1; i < arguments.length; i++) {
      ctorArgs[i - 1] = arguments[i];
    }
    // This is a constructor. Call the superclass constructor.
    return /** @type {!Function} */ (caller.superClass_)
        .constructor.apply(me, ctorArgs);
  }

  if (typeof opt_methodName != 'string' && typeof opt_methodName != 'symbol') {
    throw new Error(
        'method names provided to base must be a string or a symbol');
  }

  // Copying using loop to avoid deop due to passing arguments object to
  // function. This is faster in many JS engines as of late 2014.
  var args = new Array(arguments.length - 2);
  for (var i = 2; i < arguments.length; i++) {
    args[i - 2] = arguments[i];
  }
  var foundCaller = false;
  for (var proto = me.constructor.prototype; proto;
       proto = Object.getPrototypeOf(proto)) {
    if (proto[opt_methodName] === caller) {
      foundCaller = true;
    } else if (foundCaller) {
      return proto[opt_methodName].apply(me, args);
    }
  }

  // If we did not find the caller in the prototype chain, then one of two
  // things happened:
  // 1) The caller is an instance method.
  // 2) This method was not called by the right caller.
  if (me[opt_methodName] === caller) {
    return me.constructor.prototype[opt_methodName].apply(me, args);
  } else {
    throw new Error(
        'google.base called from a method of one name ' +
        'to a method of a different name');
  }
};

//==============================================================================
// defineClass implementation
//==============================================================================

/**
 * Creates a restricted form of a Closure "class":
 *   - from the compiler's perspective, the instance returned from the
 *     constructor is sealed (no new properties may be added).  This enables
 *     better checks.
 *   - the compiler will rewrite this definition to a form that is optimal
 *     for type checking and optimization (initially this will be a more
 *     traditional form).
 *
 * @param {Function} superClass The superclass, Object or null.
 * @param {defineClass.ClassDescriptor} def
 *     An object literal describing
 *     the class.  It may have the following properties:
 *     "constructor": the constructor function
 *     "statics": an object literal containing methods to add to the constructor
 *        as "static" methods or a function that will receive the constructor
 *        function as its only parameter to which static properties can
 *        be added.
 *     all other properties are added to the prototype.
 * @return {!Function} The class constructor.
 * @deprecated Use ES6 class syntax instead.
 */
function defineClass(superClass, def) {
  // TODO(johnlenz): consider making the superClass an optional parameter.
  var constructor = def.constructor;
  var statics = def.statics;
  // Wrap the constructor prior to setting up the prototype and static methods.
  if (!constructor || constructor == Object.prototype.constructor) {
    constructor = function() {
      throw new Error(
          'cannot instantiate an interface (no constructor defined).');
    };
  }

  var cls = defineClass.createSealingConstructor_(constructor, superClass);
  if (superClass) {
    inherits(cls, superClass);
  }

  // Remove all the properties that should not be copied to the prototype.
  delete def.constructor;
  delete def.statics;

  defineClass.applyProperties_(cls.prototype, def);
  if (statics != null) {
    if (statics instanceof Function) {
      statics(cls);
    } else {
      defineClass.applyProperties_(cls, statics);
    }
  }

  return cls;
};

/**
 * @typedef {{
 *   constructor: (!Function|undefined),
 *   statics: (Object|undefined|function(Function):void)
 * }}
 */
defineClass.ClassDescriptor;

/**
 * @type {boolean} Whether the instances returned by defineClass should
 *     be sealed when possible.
 *
 * When sealing is disabled the constructor function will not be wrapped by
 * defineClass, making it incompatible with ES6 class methods.
 */
const SEAL_CLASS_INSTANCES = DEBUG;

/**
 * If SEAL_CLASS_INSTANCES is enabled and Object.seal is
 * defined, this function will wrap the constructor in a function that seals the
 * results of the provided constructor function.
 *
 * @param {!Function} ctr The constructor whose results maybe be sealed.
 * @param {Function} superClass The superclass constructor.
 * @return {!Function} The replacement constructor.
 * @private
 */
defineClass.createSealingConstructor_ = function(ctr, superClass) {
  if (!SEAL_CLASS_INSTANCES) {
    // Do now wrap the constructor when sealing is disabled. Angular code
    // depends on this for injection to work properly.
    return ctr;
  }

  // Compute whether the constructor is sealable at definition time, rather
  // than when the instance is being constructed.
  var superclassSealable = !defineClass.isUnsealable_(superClass);

  /**
   * @this {Object}
   * @return {?}
   */
  function wrappedCtr() {
    // Don't seal an instance of a subclass when it calls the constructor of
    // its super class as there is most likely still setup to do.
    var instance = ctr.apply(this, arguments) || this;
    instance[UID_PROPERTY_] = instance[UID_PROPERTY_];

    if (this.constructor === wrappedCtr && superclassSealable &&
        Object.seal instanceof Function) {
      Object.seal(instance);
    }
    return instance;
  };

  return wrappedCtr;
};

/**
 * @param {Function} ctr The constructor to test.
 * @return {boolean} Whether the constructor has been tagged as unsealable
 *     using tagUnsealableClass.
 * @private
 */
defineClass.isUnsealable_ = function(ctr) {
  return ctr && ctr.prototype &&
      ctr.prototype[UNSEALABLE_CONSTRUCTOR_PROPERTY_];
};

// TODO(johnlenz): share these values with the google.object
/**
 * The names of the fields that are defined on Object.prototype.
 * @type {!Array<string>}
 * @private
 * @const
 */
defineClass.OBJECT_PROTOTYPE_FIELDS_ = [
  'constructor', 'hasOwnProperty', 'isPrototypeOf', 'propertyIsEnumerable',
  'toLocaleString', 'toString', 'valueOf'
];

// TODO(johnlenz): share this function with the google.object
/**
 * @param {!Object} target The object to add properties to.
 * @param {!Object} source The object to copy properties from.
 * @private
 */
defineClass.applyProperties_ = function(target, source) {
  // TODO(johnlenz): update this to support ES5 getters/setters

  var key;
  for (key in source) {
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }

  // For IE the for-in-loop does not contain any properties that are not
  // enumerable on the prototype object (for example isPrototypeOf from
  // Object.prototype) and it will also not include 'replace' on objects that
  // extend String and change 'replace' (not that it is common for anyone to
  // extend anything except Object).
  for (var i = 0; i < defineClass.OBJECT_PROTOTYPE_FIELDS_.length; i++) {
    key = defineClass.OBJECT_PROTOTYPE_FIELDS_[i];
    if (Object.prototype.hasOwnProperty.call(source, key)) {
      target[key] = source[key];
    }
  }
};

/**
 * Sealing classes breaks the older idiom of assigning properties on the
 * prototype rather than in the constructor. As such, defineClass
 * must not seal subclasses of these old-style classes until they are fixed.
 * Until then, this marks a class as "broken", instructing defineClass
 * not to seal subclasses.
 * @param {!Function} ctr The legacy constructor to tag as unsealable.
 */
function tagUnsealableClass(ctr) {
};

/**
 * Name for unsealable tag property.
 * @const @private {string}
 */
let UNSEALABLE_CONSTRUCTOR_PROPERTY_ = 'goog_defineClass_legacy_unsealable';

/**
 * @type {string} Trusted Types policy name. If non-empty then Closure will
 * use Trusted Types.
 */
const TRUSTED_TYPES_POLICY_NAME = '';

/**
 * Creates Trusted Types policy if Trusted Types are supported by the browser.
 * The policy just blesses any string as a Trusted Type. It is not visibility
 * restricted because anyone can also call TrustedTypes.createPolicy directly.
 * However, the allowed names should be restricted by a HTTP header and the
 * reference to the created policy should be visibility restricted.
 * @param {string} name
 * @return {?TrustedTypePolicy}
 */
function createTrustedTypesPolicy(name) {
  var policy = null;
  // TODO(koto): Remove window.TrustedTypes variant when the newer API ships.
  var policyFactory = window.trustedTypes || window.TrustedTypes;
  if (!policyFactory || !policyFactory.createPolicy) {
    return policy;
  }
  // TrustedTypes.createPolicy throws if called with a name that is already
  // registered, even in report-only mode. Until the API changes, catch the
  // error not to break the applications functionally. In such case, the code
  // will fall back to using regular Safe Types.
  // TODO(koto): Remove catching once createPolicy API stops throwing.
  try {
    policy = policyFactory.createPolicy(name, {
      createHTML: identity_,
      createScript: identity_,
      createScriptURL: identity_,
      createURL: identity_
    });
  } catch (e) {
    logToConsole_(e.message);
  }
  return policy;
};

/**
 * Returns the parameter.
 * @param {string} s
 * @return {string}
 * @private
 */
function identity_(s) {
  return s;
};

export {DEBUG, DISALLOW_TEST_ONLY_CODE, ENABLE_CHROME_APP_SAFE_SCRIPT_LOADING, FEATURESET_YEAR, LOAD_MODULE_USING_EVAL, LOCALE, SEAL_CLASS_INSTANCES, SEAL_MODULE_EXPORTS, STRICT_MODE_COMPATIBLE, TRUSTED_SITE, TRUSTED_TYPES_POLICY_NAME, abstractMethod, addSingletonGetter, base, bind, cloneObject, createTrustedTypesPolicy, defineClass, exportProperty, exportSymbol, forwardDeclare, getCssName, getHashCode, getMsg, getMsgWithFallback, getObjectByName, getScriptNonce, getUid, globalEval, globalize, hasBadLetScoping, hasUid, inherits, isArray, isArrayLike, isBoolean, isDateLike, isDef, isDefAndNotNull, isFunction, isNull, isNumber, isObject, isString, mixin, now, nullFunction, partial, removeHashCode, removeUid, setCssNameMapping, setTestOnly, tagUnsealableClass, typeOf, useSafari10Workaround, workaroundSafari10EvalBug};