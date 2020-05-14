/**
 * Adds a class or classes to an element. Does not add multiples of class names.
 * @param {?Node} element DOM node to add class to.
 * @param {...string} var_args Class names to add.
 * @return {boolean} Whether class was added (or all classes were added).
 * @deprecated Use goog.dom.classlist.add or goog.dom.classlist.addAll instead.
 */
export function add(element: Node | null, ...args: string[]): boolean;
/**
 * Adds zero or more classes to an element and removes zero or more as a single
 * operation. Unlike calling {@link add} and
 * {@link remove} separately, this is more efficient as it only
 * parses the class property once.
 *
 * If a class is in both the remove and add lists, it will be added. Thus,
 * you can use this instead of {@link swap} when you have
 * more than two class names that you want to swap.
 *
 * @param {?Node} element DOM node to swap classes on.
 * @param {?(string|Array<string>)} classesToRemove Class or classes to
 *     remove, if null no classes are removed.
 * @param {?(string|Array<string>)} classesToAdd Class or classes to add, if
 *     null no classes are added.
 * @deprecated Use goog.dom.classlist.addRemove instead.
 * @suppress{checkTypes}
 */
export function addRemove(element: Node | null, classesToRemove: (string | Array<string>) | null, classesToAdd: (string | Array<string>) | null): void;
/**
 * Adds or removes a class depending on the enabled argument.
 * @param {?Node} element DOM node to add or remove the class on.
 * @param {string} className Class name to add or remove.
 * @param {boolean} enabled Whether to add or remove the class (true adds,
 *     false removes).
 * @deprecated Use goog.dom.classlist.enable or goog.dom.classlist.enableAll
 *     instead.
 */
export function enable(element: Node | null, className: string, enabled: boolean): void;
/**
 * Gets an array of class names on an element
 * @param {?Node} element DOM node to get class of.
 * @return {!Array<?>} Class names on `element`. Some browsers add extra
 *     properties to the array. Do not depend on any of these!
 * @deprecated Use goog.dom.classlist.get instead.
 */
export function get(element: Node | null): Array<unknown>;
/**
 * Returns true if an element has a class.
 * @param {?Node} element DOM node to test.
 * @param {string} className Class name to test for.
 * @return {boolean} Whether element has the class.
 * @deprecated Use goog.dom.classlist.contains instead.
 */
export function has(element: Node | null, className: string): boolean;
/**
 * Removes a class or classes from an element.
 * @param {?Node} element DOM node to remove class from.
 * @param {...string} var_args Class name(s) to remove.
 * @return {boolean} Whether all classes in `var_args` were found and
 *     removed.
 * @deprecated Use goog.dom.classlist.remove or goog.dom.classlist.removeAll
 *     instead.
 */
export function remove(element: Node | null, ...args: string[]): boolean;
/**
 * @fileoverview Utilities for adding, removing and setting classes.  Prefer
 * {@link goog.dom.classlist} over these utilities since goog.dom.classlist
 * conforms closer to the semantics of Element.classList, is faster (uses
 * native methods rather than parsing strings on every call) and compiles
 * to smaller code as a result.
 *
 * Note: these utilities are meant to operate on HTMLElements and
 * will not work on elements with differing interfaces (such as SVGElements).
 */
/**
 * Sets the entire class name of an element.
 * @param {?Node} element DOM node to set class of.
 * @param {string} className Class name(s) to apply to element.
 * @deprecated Use goog.dom.classlist.set instead.
 */
export function set(element: Node | null, className: string): void;
/**
 * Switches a class on an element from one to another without disturbing other
 * classes. If the fromClass isn't removed, the toClass won't be added.
 * @param {?Node} element DOM node to swap classes on.
 * @param {string} fromClass Class to remove.
 * @param {string} toClass Class to add.
 * @return {boolean} Whether classes were switched.
 * @deprecated Use goog.dom.classlist.swap instead.
 */
export function swap(element: Node | null, fromClass: string, toClass: string): boolean;
/**
 * Removes a class if an element has it, and adds it the element doesn't have
 * it.  Won't affect other classes on the node.
 * @param {?Node} element DOM node to toggle class on.
 * @param {string} className Class to toggle.
 * @return {boolean} True if class was added, false if it was removed
 *     (in other words, whether element has the class after this function has
 *     been called).
 * @deprecated Use goog.dom.classlist.toggle instead.
 */
export function toggle(element: Node | null, className: string): boolean;
