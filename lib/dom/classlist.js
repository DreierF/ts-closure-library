import * as googarray from './../array/array.js';
// Copyright 2012 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Utilities for detecting, adding and removing classes.  Prefer
 * this over goog.dom.classes for new code since it attempts to use classList
 * (DOMTokenList: http://dom.spec.whatwg.org/#domtokenlist) which is faster
 * and requires less code.
 *
 * Note: these utilities are meant to operate on HTMLElements and SVGElements
 * and may have unexpected behavior on elements with differing interfaces.
 */

/**
 * Override this define at build-time if you know your target supports it.
 * @type {boolean} Whether to use the classList property (DOMTokenList).
 */
const ALWAYS_USE_DOM_TOKEN_LIST = false;

/**
 * A wrapper which ensures correct functionality when interacting with
 * SVGElements
 * @param {?Element} element DOM node to get the class name of.
 * @return {string}
 * @private
 */
function getClassName_(element) {
  // If className is an instance of SVGAnimatedString use getAttribute
  return typeof element.className == 'string' ?
      element.className :
      element.getAttribute && element.getAttribute('class') || '';
};

/**
 * Gets an array-like object of class names on an element.
 * @param {Element} element DOM node to get the classes of.
 * @return {!IArrayLike<?>} Class names on `element`.
 */
function get(element) {
  if (ALWAYS_USE_DOM_TOKEN_LIST || element.classList) {
    return element.classList;
  }

  return getClassName_(element).match(/\S+/g) || [];
};

/**
 * Sets the entire class name of an element.
 * @param {Element} element DOM node to set class of.
 * @param {string} className Class name(s) to apply to element.
 */
function set(element, className) {
  // If className is an instance of SVGAnimatedString use setAttribute
  if ((typeof element.className) == 'string') {
    element.className = className;
    return;
  } else if (element.setAttribute) {
    element.setAttribute('class', className);
  }
};

/**
 * Returns true if an element has a class.  This method may throw a DOM
 * exception for an invalid or empty class name if DOMTokenList is used.
 * @param {Element} element DOM node to test.
 * @param {string} className Class name to test for.
 * @return {boolean} Whether element has the class.
 */
function contains(element, className) {
  if (ALWAYS_USE_DOM_TOKEN_LIST || element.classList) {
    return element.classList.contains(className);
  }
  return googarray.contains(get(element), className);
};

/**
 * Adds a class to an element.  Does not add multiples of class names.  This
 * method may throw a DOM exception for an invalid or empty class name if
 * DOMTokenList is used.
 * @param {Element} element DOM node to add class to.
 * @param {string} className Class name to add.
 */
function add(element, className) {
  if (ALWAYS_USE_DOM_TOKEN_LIST || element.classList) {
    element.classList.add(className);
    return;
  }

  if (!contains(element, className)) {
    // Ensure we add a space if this is not the first class name added.
    var oldClassName = getClassName_(element);
    set(
        element,
        oldClassName +
            (oldClassName.length > 0 ? (' ' + className) : className));
  }
};

/**
 * Convenience method to add a number of class names at once.
 * @param {Element} element The element to which to add classes.
 * @param {IArrayLike<string>} classesToAdd An array-like object
 * containing a collection of class names to add to the element.
 * This method may throw a DOM exception if classesToAdd contains invalid
 * or empty class names.
 */
function addAll(element, classesToAdd) {
  if (ALWAYS_USE_DOM_TOKEN_LIST || element.classList) {
    googarray.forEach(classesToAdd, function(className) {
      add(element, className);
    });
    return;
  }

  var classMap = {};

  // Get all current class names into a map.
  googarray.forEach(get(element), function(className) {
    classMap[className] = true;
  });

  // Add new class names to the map.
  googarray.forEach(
      classesToAdd, function(className) { classMap[className] = true; });

  // Flatten the keys of the map into the className.
  var newClassName = '';
  for (var className in classMap) {
    newClassName += newClassName.length > 0 ? (' ' + className) : className;
  }
  set(element, newClassName);
};

/**
 * Removes a class from an element.  This method may throw a DOM exception
 * for an invalid or empty class name if DOMTokenList is used.
 * @param {Element} element DOM node to remove class from.
 * @param {string} className Class name to remove.
 */
function remove(element, className) {
  if (ALWAYS_USE_DOM_TOKEN_LIST || element.classList) {
    element.classList.remove(className);
    return;
  }

  if (contains(element, className)) {
    // Filter out the class name.
    set(
        element,
        googarray
            .filter(
                get(element),
                function(c) {
                  return c != className;
                })
            .join(' '));
  }
};

/**
 * Removes a set of classes from an element.  Prefer this call to
 * repeatedly calling `remove` if you want to remove
 * a large set of class names at once.
 * @param {Element} element The element from which to remove classes.
 * @param {IArrayLike<string>} classesToRemove An array-like object
 * containing a collection of class names to remove from the element.
 * This method may throw a DOM exception if classesToRemove contains invalid
 * or empty class names.
 */
function removeAll(element, classesToRemove) {
  if (ALWAYS_USE_DOM_TOKEN_LIST || element.classList) {
    googarray.forEach(classesToRemove, function(className) {
      remove(element, className);
    });
    return;
  }

  // Filter out those classes in classesToRemove.
  set(
      element,
      googarray
          .filter(
              get(element),
              function(className) {
                // If this class is not one we are trying to remove,
                // add it to the array of new class names.
                return !googarray.contains(classesToRemove, className);
              })
          .join(' '));
};

/**
 * Adds or removes a class depending on the enabled argument.  This method
 * may throw a DOM exception for an invalid or empty class name if DOMTokenList
 * is used.
 * @param {Element} element DOM node to add or remove the class on.
 * @param {string} className Class name to add or remove.
 * @param {boolean} enabled Whether to add or remove the class (true adds,
 *     false removes).
 */
function enable(element, className, enabled) {
  if (enabled) {
    add(element, className);
  } else {
    remove(element, className);
  }
};

/**
 * Adds or removes a set of classes depending on the enabled argument.  This
 * method may throw a DOM exception for an invalid or empty class name if
 * DOMTokenList is used.
 * @param {!Element} element DOM node to add or remove the class on.
 * @param {?IArrayLike<string>} classesToEnable An array-like object
 *     containing a collection of class names to add or remove from the element.
 * @param {boolean} enabled Whether to add or remove the classes (true adds,
 *     false removes).
 */
function enableAll(element, classesToEnable, enabled) {
  var f = enabled ? addAll : removeAll;
  f(element, classesToEnable);
};

/**
 * Switches a class on an element from one to another without disturbing other
 * classes. If the fromClass isn't removed, the toClass won't be added.  This
 * method may throw a DOM exception if the class names are empty or invalid.
 * @param {Element} element DOM node to swap classes on.
 * @param {string} fromClass Class to remove.
 * @param {string} toClass Class to add.
 * @return {boolean} Whether classes were switched.
 */
function swap(element, fromClass, toClass) {
  if (contains(element, fromClass)) {
    remove(element, fromClass);
    add(element, toClass);
    return true;
  }
  return false;
};

/**
 * Removes a class if an element has it, and adds it the element doesn't have
 * it.  Won't affect other classes on the node.  This method may throw a DOM
 * exception if the class name is empty or invalid.
 * @param {Element} element DOM node to toggle class on.
 * @param {string} className Class to toggle.
 * @return {boolean} True if class was added, false if it was removed
 *     (in other words, whether element has the class after this function has
 *     been called).
 */
function toggle(element, className) {
  var add = !contains(element, className);
  enable(element, className, add);
  return add;
};

/**
 * Adds and removes a class of an element.  Unlike
 * {@link swap}, this method adds the classToAdd regardless
 * of whether the classToRemove was present and had been removed.  This method
 * may throw a DOM exception if the class names are empty or invalid.
 *
 * @param {Element} element DOM node to swap classes on.
 * @param {string} classToRemove Class to remove.
 * @param {string} classToAdd Class to add.
 */
function addRemove(element, classToRemove, classToAdd) {
  remove(element, classToRemove);
  add(element, classToAdd);
};

export {ALWAYS_USE_DOM_TOKEN_LIST, add, addAll, addRemove, contains, enable, enableAll, get, remove, removeAll, set, swap, toggle};