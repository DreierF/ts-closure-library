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
export const ALWAYS_USE_DOM_TOKEN_LIST: boolean;
/**
 * Adds a class to an element.  Does not add multiples of class names.  This
 * method may throw a DOM exception for an invalid or empty class name if
 * DOMTokenList is used.
 * @param {?Element} element DOM node to add class to.
 * @param {string} className Class name to add.
 */
export function add(element: Element | null, className: string): void;
/**
 * Convenience method to add a number of class names at once.
 * @param {?Element} element The element to which to add classes.
 * @param {ArrayLike<string>} classesToAdd An array-like object
 * containing a collection of class names to add to the element.
 * This method may throw a DOM exception if classesToAdd contains invalid
 * or empty class names.
 */
export function addAll(element: Element | null, classesToAdd: ArrayLike<string>): void;
/**
 * Adds and removes a class of an element.  Unlike
 * {@link swap}, this method adds the classToAdd regardless
 * of whether the classToRemove was present and had been removed.  This method
 * may throw a DOM exception if the class names are empty or invalid.
 *
 * @param {?Element} element DOM node to swap classes on.
 * @param {string} classToRemove Class to remove.
 * @param {string} classToAdd Class to add.
 */
export function addRemove(element: Element | null, classToRemove: string, classToAdd: string): void;
/**
 * Returns true if an element has a class.  This method may throw a DOM
 * exception for an invalid or empty class name if DOMTokenList is used.
 * @param {?Element} element DOM node to test.
 * @param {string} className Class name to test for.
 * @return {boolean} Whether element has the class.
 */
export function contains(element: Element | null, className: string): boolean;
/**
 * Adds or removes a class depending on the enabled argument.  This method
 * may throw a DOM exception for an invalid or empty class name if DOMTokenList
 * is used.
 * @param {?Element} element DOM node to add or remove the class on.
 * @param {string} className Class name to add or remove.
 * @param {boolean} enabled Whether to add or remove the class (true adds,
 *     false removes).
 */
export function enable(element: Element | null, className: string, enabled: boolean): void;
/**
 * Adds or removes a set of classes depending on the enabled argument.  This
 * method may throw a DOM exception for an invalid or empty class name if
 * DOMTokenList is used.
 * @param {!Element} element DOM node to add or remove the class on.
 * @param {?ArrayLike<string>} classesToEnable An array-like object
 *     containing a collection of class names to add or remove from the element.
 * @param {boolean} enabled Whether to add or remove the classes (true adds,
 *     false removes).
 */
export function enableAll(element: Element, classesToEnable: ArrayLike<string> | null, enabled: boolean): void;
/**
 * Gets an array-like object of class names on an element.
 * @param {?Element} element DOM node to get the classes of.
 * @return {!ArrayLike<?>} Class names on `element`.
 */
export function get(element: Element | null): ArrayLike<string>;
/**
 * Removes a class from an element.  This method may throw a DOM exception
 * for an invalid or empty class name if DOMTokenList is used.
 * @param {?Element} element DOM node to remove class from.
 * @param {string} className Class name to remove.
 */
export function remove(element: Element | null, className: string): void;
/**
 * Removes a set of classes from an element.  Prefer this call to
 * repeatedly calling `remove` if you want to remove
 * a large set of class names at once.
 * @param {?Element} element The element from which to remove classes.
 * @param {ArrayLike<string>} classesToRemove An array-like object
 * containing a collection of class names to remove from the element.
 * This method may throw a DOM exception if classesToRemove contains invalid
 * or empty class names.
 */
export function removeAll(element: Element | null, classesToRemove: ArrayLike<string>): void;
/**
 * Sets the entire class name of an element.
 * @param {?Element} element DOM node to set class of.
 * @param {string} className Class name(s) to apply to element.
 */
export function set(element: Element | null, className: string): void;
/**
 * Switches a class on an element from one to another without disturbing other
 * classes. If the fromClass isn't removed, the toClass won't be added.  This
 * method may throw a DOM exception if the class names are empty or invalid.
 * @param {?Element} element DOM node to swap classes on.
 * @param {string} fromClass Class to remove.
 * @param {string} toClass Class to add.
 * @return {boolean} Whether classes were switched.
 */
export function swap(element: Element | null, fromClass: string, toClass: string): boolean;
/**
 * Removes a class if an element has it, and adds it the element doesn't have
 * it.  Won't affect other classes on the node.  This method may throw a DOM
 * exception if the class name is empty or invalid.
 * @param {?Element} element DOM node to toggle class on.
 * @param {string} className Class to toggle.
 * @return {boolean} True if class was added, false if it was removed
 *     (in other words, whether element has the class after this function has
 *     been called).
 */
export function toggle(element: Element | null, className: string): boolean;
