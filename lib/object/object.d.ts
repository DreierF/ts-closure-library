/**
 * Adds a key-value pair to the object. Throws an exception if the key is
 * already in use. Use set if you want to change an existing pair.
 *
 * @param {Object<K,V>} obj The object to which to add the key-value pair.
 * @param {string} key The key to add.
 * @param {V} val The value to add.
 * @template K,V
 */
export function add<K, V>(obj: any, key: string, val: V): void;
/**
 * Removes all key value pairs from the object/map/hash.
 *
 * @param {?Object} obj The object to clear.
 */
export function clear(obj: any | null): void;
/**
 * Returns a shallow clone of the object.
 *
 * @param {Object<K,V>} obj Object to clone.
 * @return {!Object<K,V>} Clone of the input object.
 * @template K,V
 */
export function clone<K, V>(obj: any): any;
/**
 * Whether the object/hash/map contains the given object as a value.
 * An alias for containsValue(obj, val).
 *
 * @param {Object<K,V>} obj The object in which to look for val.
 * @param {V} val The object for which to check.
 * @return {boolean} true if val is present.
 * @template K,V
 */
export function contains<K, V>(obj: any, val: V): boolean;
/**
 * Whether the object/map/hash contains the given key.
 *
 * @param {?Object} obj The object in which to look for key.
 * @param {?} key The key for which to check.
 * @return {boolean} true If the map contains the key.
 */
export function containsKey(obj: any | null, key: unknown): boolean;
/**
 * Whether the object/map/hash contains the given value. This is O(n).
 *
 * @param {Object<K,V>} obj The object in which to look for val.
 * @param {V} val The value for which to check.
 * @return {boolean} true If the map contains the value.
 * @template K,V
 */
export function containsValue<K, V>(obj: any, val: V): boolean;
/**
 * Creates a new object built from the key-value pairs provided as arguments.
 * @param {...*} var_args If only one argument is provided and it is an array
 *     then this is used as the arguments, otherwise even arguments are used as
 *     the property names and odd arguments are used as the property values.
 * @return {!Object} The new object.
 * @throws {Error} If there are uneven number of arguments or there is only one
 *     non array argument.
 */
export function create(...args: any[]): any;
/**
 * Creates an immutable view of the underlying object, if the browser
 * supports immutable objects.
 *
 * In default mode, writes to this view will fail silently. In strict mode,
 * they will throw an error.
 *
 * @param {!Object<K,V>} obj An object.
 * @return {!Object<K,V>} An immutable view of that object, or the
 *     original object if this browser does not support immutables.
 * @template K,V
 */
export function createImmutableView<K, V>(obj: any): any;
/**
 * Creates a new object where the property names come from the arguments but
 * the value is always set to true
 * @param {...*} var_args If only one argument is provided and it is an array
 *     then this is used as the arguments, otherwise the arguments are used
 *     as the property names.
 * @return {!Object} The new object.
 */
export function createSet(...args: any[]): any;
/**
 * Compares two objects for equality using === on the values.
 *
 * @param {!Object<K,V>} a
 * @param {!Object<K,V>} b
 * @return {boolean}
 * @template K,V
 */
export function equals<K, V>(a: any, b: any): boolean;
/**
 * Calls a function for each element in an object/map/hash. If
 * all calls return true, returns true. If any call returns false, returns
 * false at this point and does not continue to check the remaining elements.
 *
 * @param {Object<K,V>} obj The object to check.
 * @param {?function(this:T,V,?,Object<K,V>):boolean} f The function to
 *     call for every element. This function
 *     takes 3 arguments (the value, the key and the object) and should
 *     return a boolean.
 * @param {T=} opt_obj This is used as the 'this' object within f.
 * @return {boolean} false if any element fails the test.
 * @template T,K,V
 */
export function every<T, K, V>(obj: any, f: ((this: T, arg1: V, arg2: unknown, arg3: any) => boolean) | null, opt_obj?: T | undefined): boolean;
/**
 * Extends an object with another object.
 * This operates 'in-place'; it does not create a new Object.
 *
 * Example:
 * var o = {};
 * extend(o, {a: 0, b: 1});
 * o; // {a: 0, b: 1}
 * extend(o, {b: 2, c: 3});
 * o; // {a: 0, b: 2, c: 3}
 *
 * @param {?Object} target The object to modify. Existing properties will be
 *     overwritten if they are also present in one of the objects in
 *     `var_args`.
 * @param {...(Object|null|undefined)} var_args The objects from which values
 *     will be copied.
 * @deprecated Prefer Object.assign
 */
export function extend(target: any | null, ...args: any[]): void;
/**
 * Calls a function for each element in an object/map/hash. If that call returns
 * true, adds the element to a new object.
 *
 * @param {Object<K,V>} obj The object over which to iterate.
 * @param {function(this:T,V,?,Object<K,V>):boolean} f The function to call
 *     for every element. This
 *     function takes 3 arguments (the value, the key and the object)
 *     and should return a boolean. If the return value is true the
 *     element is added to the result object. If it is false the
 *     element is not included.
 * @param {T=} opt_obj This is used as the 'this' object within f.
 * @return {!Object<K,V>} a new object in which only elements that passed the
 *     test are present.
 * @template T,K,V
 */
export function filter<T, K, V>(obj: any, f: (this: T, arg1: V, arg2: unknown, arg3: any) => boolean, opt_obj?: T | undefined): any;
/**
 * Searches an object for an element that satisfies the given condition and
 * returns its key.
 * @param {Object<K,V>} obj The object to search in.
 * @param {function(this:T,V,string,Object<K,V>):boolean} f The
 *      function to call for every element. Takes 3 arguments (the value,
 *     the key and the object) and should return a boolean.
 * @param {T=} opt_this An optional "this" context for the function.
 * @return {string|undefined} The key of an element for which the function
 *     returns true or undefined if no such element is found.
 * @template T,K,V
 */
export function findKey<T, K, V>(obj: any, f: (this: T, arg1: V, arg2: string, arg3: any) => boolean, opt_this?: T | undefined): string | undefined;
/**
 * Searches an object for an element that satisfies the given condition and
 * returns its value.
 * @param {Object<K,V>} obj The object to search in.
 * @param {function(this:T,V,string,Object<K,V>):boolean} f The function
 *     to call for every element. Takes 3 arguments (the value, the key
 *     and the object) and should return a boolean.
 * @param {T=} opt_this An optional "this" context for the function.
 * @return {V} The value of an element for which the function returns true or
 *     undefined if no such element is found.
 * @template T,K,V
 */
export function findValue<T, K, V>(obj: any, f: (this: T, arg1: V, arg2: string, arg3: any) => boolean, opt_this?: T | undefined): V;
/**
 * Calls a function for each element in an object/map/hash.
 *
 * @param {Object<K,V>} obj The object over which to iterate.
 * @param {function(this:T,V,?,Object<K,V>):?} f The function to call
 *     for every element. This function takes 3 arguments (the value, the
 *     key and the object) and the return value is ignored.
 * @param {T=} opt_obj This is used as the 'this' object within f.
 * @template T,K,V
 */
export function forEach<T = unknown, K = unknown, V = unknown>(obj: Record<K, V> | object, f: (this: T, arg1: V, arg2: K, arg3: any) => any, opt_obj?: T | undefined): void;
/**
 * Returns the value for the given key.
 *
 * @param {Object<K,V>} obj The object from which to get the value.
 * @param {string} key The key for which to get the value.
 * @param {R=} opt_val The value to return if no item is found for the given
 *     key (default is undefined).
 * @return {V|R|undefined} The value for the given key.
 * @template K,V,R
 */
export function get<K, V, R>(obj: any, key: string, opt_val?: R | undefined): V | R | undefined;
/**
 * Get all properties names on a given Object regardless of enumerability.
 *
 * <p> If the browser does not support `Object.getOwnPropertyNames` nor
 * `Object.getPrototypeOf` then this is equivalent to using
 * `getKeys`
 *
 * @param {?Object} obj The object to get the properties of.
 * @param {boolean=} opt_includeObjectPrototype Whether properties defined on
 *     `Object.prototype` should be included in the result.
 * @param {boolean=} opt_includeFunctionPrototype Whether properties defined on
 *     `Function.prototype` should be included in the result.
 * @return {!Array<string>}
 * @public
 */
export function getAllPropertyNames(obj: any | null, opt_includeObjectPrototype?: boolean | undefined, opt_includeFunctionPrototype?: boolean | undefined): Array<string>;
/**
 * Returns one key from the object map, if any exists.
 * For map literals the returned key will be the first one in most of the
 * browsers (a know exception is Konqueror).
 *
 * @param {?Object} obj The object to pick a key from.
 * @return {string|undefined} The key or undefined if the object is empty.
 */
export function getAnyKey(obj: any | null): string | undefined;
/**
 * Returns one value from the object map, if any exists.
 * For map literals the returned value will be the first one in most of the
 * browsers (a know exception is Konqueror).
 *
 * @param {Object<K,V>} obj The object to pick a value from.
 * @return {V|undefined} The value or undefined if the object is empty.
 * @template K,V
 */
export function getAnyValue<K, V>(obj: any): V | undefined;
/**
 * Returns the number of key-value pairs in the object map.
 *
 * @param {?Object} obj The object for which to get the number of key-value
 *     pairs.
 * @return {number} The number of key-value pairs in the object map.
 */
export function getCount(obj: any | null): number;
/**
 * Returns the keys of the object/map/hash.
 *
 * @param {?Object} obj The object from which to get the keys.
 * @return {!Array<string>} Array of property keys.
 * deprecated Use Object.keys(obj) instead
 */
export function getKeys(obj: any | null): Array<string>;
/**
 * Given a ES5 or ES6 class reference, return its super class / super
 * constructor.
 *
 * This should be used in rare cases where you need to walk up the inheritance
 * tree (this is generally a bad idea). But this work with ES5 and ES6 classes,
 * unlike relying on the superClass_ property.
 *
 * Note: To start walking up the hierarchy from an instance call this with its
 * `constructor` property; e.g. `getSuperClass(instance.constructor)`.
 *
 * @param {function(new: ?)} constructor
 * @return {?Object}
 */
export function getSuperClass(constructor: new () => unknown): any | null;
/**
 * Get a value from an object multiple levels deep.  This is useful for
 * pulling values from deeply nested objects, such as JSON responses.
 * Example usage: getValueByKeys(jsonObj, 'foo', 'entries', 3)
 *
 * @param {!Object} obj An object to get the value from.  Can be array-like.
 * @param {...(string|number|!ArrayLike<number|string>)}
 *     var_args A number of keys
 *     (as strings, or numbers, for array-like objects).  Can also be
 *     specified as a single array of keys.
 * @return {*} The resulting value.  If, at any point, the value for a key
 *     in the current object is null or undefined, returns undefined.
 */
export function getValueByKeys(obj: any, ...args: (string | number | ArrayLike<string | number>)[]): any;
/**
 * Returns the values of the object/map/hash.
 *
 * @param {Object<K,V>} obj The object from which to get the values.
 * @return {!Array<V>} The values in the object/map/hash.
 * @template K,V
 */
export function getValues<T = unknown>(obj: Record<string, T> | ArrayLike<T> | object): T[];
/**
 * @fileoverview Utilities for manipulating objects/maps/hashes.
 */
/**
 * Whether two values are not observably distinguishable. This
 * correctly detects that 0 is not the same as -0 and two NaNs are
 * practically equivalent.
 *
 * The implementation is as suggested by harmony:egal proposal.
 *
 * @param {*} v The first value to compare.
 * @param {*} v2 The second value to compare.
 * @return {boolean} Whether two values are not observably distinguishable.
 * @see http://wiki.ecmascript.org/doku.php?id=harmony:egal
 */
export function is(v: any, v2: any): boolean;
/**
 * Whether the object/map/hash is empty.
 *
 * @param {?Object} obj The object to test.
 * @return {boolean} true if obj is empty.
 */
export function isEmpty(obj: any | null): boolean;
/**
 * @param {!Object} obj An object.
 * @return {boolean} Whether this is an immutable view of the object.
 */
export function isImmutableView(obj: any): boolean;
/**
 * For every element in an object/map/hash calls a function and inserts the
 * result into a new object.
 *
 * @param {Object<K,V>} obj The object over which to iterate.
 * @param {function(this:T,V,?,Object<K,V>):R} f The function to call
 *     for every element. This function
 *     takes 3 arguments (the value, the key and the object)
 *     and should return something. The result will be inserted
 *     into a new object.
 * @param {T=} opt_obj This is used as the 'this' object within f.
 * @return {!Object<K,R>} a new object with the results from f.
 * @template T,K,V,R
 */
export function map<T, K, V, R>(obj: any, f: (this: T, arg1: V, arg2: unknown, arg3: any) => R, opt_obj?: T | undefined): any;
/**
 * Removes a key-value pair based on the key.
 *
 * @param {?Object} obj The object from which to remove the key.
 * @param {?} key The key to remove.
 * @return {boolean} Whether an element was removed.
 */
export function remove(obj: any | null, key: unknown): boolean;
/**
 * Adds a key-value pair to the object/map/hash.
 *
 * @param {Object<K,V>} obj The object to which to add the key-value pair.
 * @param {string} key The key to add.
 * @param {V} value The value to add.
 * @template K,V
 */
export function set<K, V>(obj: any, key: string, value: V): void;
/**
 * Adds a key-value pair to the object/map/hash if it doesn't exist yet.
 *
 * @param {Object<K,V>} obj The object to which to add the key-value pair.
 * @param {string} key The key to add.
 * @param {V} value The value to add if the key wasn't present.
 * @return {V} The value of the entry at the end of the function.
 * @template K,V
 */
export function setIfUndefined<K, V>(obj: any, key: string, value: V): V;
/**
 * Sets a key and value to an object if the key is not set. The value will be
 * the return value of the given function. If the key already exists, the
 * object will not be changed and the function will not be called (the function
 * will be lazily evaluated -- only called if necessary).
 *
 * This function is particularly useful when used with an `Object` which is
 * acting as a cache.
 *
 * @param {!Object<K,V>} obj The object to which to add the key-value pair.
 * @param {string} key The key to add.
 * @param {function():V} f The value to add if the key wasn't present.
 * @return {V} The value of the entry at the end of the function.
 * @template K,V
 */
export function setWithReturnValueIfNotSet<K, V>(obj: any, key: string, f: () => V): V;
/**
 * Calls a function for each element in an object/map/hash. If any
 * call returns true, returns true (without checking the rest). If
 * all calls return false, returns false.
 *
 * @param {Object<K,V>} obj The object to check.
 * @param {function(this:T,V,?,Object<K,V>):boolean} f The function to
 *     call for every element. This function
 *     takes 3 arguments (the value, the key and the object) and should
 *     return a boolean.
 * @param {T=} opt_obj This is used as the 'this' object within f.
 * @return {boolean} true if any element passes the test.
 * @template T,K,V
 */
export function some<T, K, V>(obj: any, f: (this: T, arg1: V, arg2: unknown, arg3: any) => boolean, opt_obj?: T | undefined): boolean;
/**
 * Returns a new object in which all the keys and values are interchanged
 * (keys become values and values become keys). If multiple keys map to the
 * same value, the chosen transposed value is implementation-dependent.
 *
 * @param {?Object} obj The object to transpose.
 * @return {!Object} The transposed object.
 */
export function transpose(obj: any | null): any;
/**
 * Clones a value. The input may be an Object, Array, or basic type. Objects and
 * arrays will be cloned recursively.
 *
 * WARNINGS:
 * <code>unsafeClone</code> does not detect reference loops. Objects
 * that refer to themselves will cause infinite recursion.
 *
 * <code>unsafeClone</code> is unaware of unique identifiers, and
 * copies UIDs created by <code>getUid</code> into cloned results.
 *
 * @param {T} obj The value to clone.
 * @return {T} A clone of the input value.
 * @template T
 */
export function unsafeClone<T>(obj: T): T;
