export { structs_Map as Map };
/**
 * @fileoverview Datastructure: Hash Map.
 *
 *
 * This file contains an implementation of a Map structure. It implements a lot
 * of the methods used in google.structs so those functions work on hashes. This
 * is best suited for complex key types. For simple keys such as numbers and
 * strings consider using the lighter-weight utilities in goog.object.
 */
/**
 * Class for Hash Map datastructure.
 *     will be used as key-value pairs.
 * @template K, V
 * @deprecated This type is misleading: use ES6 Map instead.
 */
declare class structs_Map<K, V> {
    /**
     * Default equality test for values.
     * @param {*} a The first value.
     * @param {*} b The second value.
     * @return {boolean} Whether a and b reference the same object.
     */
    static defaultEquals(a: any, b: any): boolean;
    /**
     * Safe way to test for hasOwnProperty.  It even allows testing for
     * 'hasOwnProperty'.
     * @param {!Object} obj The object to test for presence of the given key.
     * @param {*} key The key to check for.
     * @return {boolean} Whether the object has the key.
     * @private
     */
    private static hasKey_;
    /**
     * Class for Hash Map datastructure.
     * @param {*=} opt_map Map or Object to initialize the map with.
     * @param {...*} var_args If 2 or more arguments are present then they
     *     will be used as key-value pairs.
     * @template K, V
     * @deprecated This type is misleading: use ES6 Map instead.
     */
    constructor(opt_map?: any | undefined, ...args: any[]);
    /**
     * Underlying JS object used to implement the map.
     * @private {!Object}
     */
    private map_;
    /**
     * An array of keys. This is necessary for two reasons:
     *   1. Iterating the keys using for (var key in this.map_) allocates an
     *      object for every key in IE which is really bad for IE6 GC perf.
     *   2. Without a side data structure, we would need to escape all the keys
     *      as that would be the only way we could tell during iteration if the
     *      key was an internal key or a property of the object.
     *
     * This array can contain deleted keys so it's necessary to check the map
     * as well to see if the key is still in the map (this doesn't require a
     * memory allocation in IE).
     * @private {!Array<string>}
     */
    private keys_;
    /**
     * The number of key value pairs in the map.
     * @private {number}
     */
    private count_;
    /**
     * Version used to detect changes while iterating.
     * @private {number}
     */
    private version_;
    /**
     * @return {number} The number of key-value pairs in the map.
     */
    getCount(): number;
    /**
     * Returns the values of the map.
     * @return {!Array<V>} The values in the map.
     */
    getValues(): V[];
    /**
     * Returns the keys of the map.
     * @return {!Array<string>} Array of string values.
     */
    getKeys(): Array<string>;
    /**
     * Whether the map contains the given key.
     * @param {*} key The key to check for.
     * @return {boolean} Whether the map contains the key.
     */
    containsKey(key: any): boolean;
    /**
     * Whether the map contains the given value. This is O(n).
     * @param {V} val The value to check for.
     * @return {boolean} Whether the map contains the value.
     */
    containsValue(val: V): boolean;
    /**
     * Whether this map is equal to the argument map.
     * @param {structs_Map} otherMap The map against which to test equality.
     * @param {function(V, V): boolean=} opt_equalityFn Optional equality function
     *     to test equality of values. If not specified, this will test whether
     *     the values contained in each map are identical objects.
     * @return {boolean} Whether the maps are equal.
     */
    equals(otherMap: structs_Map<any, any>, opt_equalityFn?: ((arg0: V, arg1: V) => boolean) | undefined): boolean;
    /**
     * @return {boolean} Whether the map is empty.
     */
    isEmpty(): boolean;
    /**
     * Removes all key-value pairs from the map.
     */
    clear(): void;
    /**
     * Removes a key-value pair based on the key. This is O(logN) amortized due to
     * updating the keys array whenever the count becomes half the size of the keys
     * in the keys array.
     * @param {*} key  The key to remove.
     * @return {boolean} Whether object was removed.
     */
    remove(key: any): boolean;
    /**
     * Cleans up the temp keys array by removing entries that are no longer in the
     * map.
     * @private
     */
    private cleanupKeysArray_;
    /**
     * Returns the value for the given key.  If the key is not found and the default
     * value is not given this will return `undefined`.
     * @param {*} key The key to get the value for.
     * @param {DEFAULT=} opt_val The value to return if no item is found for the
     *     given key, defaults to undefined.
     * @return {V|DEFAULT} The value for the given key.
     * @template DEFAULT
     */
    get<DEFAULT>(key: any, opt_val?: DEFAULT | undefined): V | DEFAULT;
    /**
     * Adds a key-value pair to the map.
     * @param {*} key The key.
     * @param {V} value The value to add.
     * @return {*} Some subclasses return a value.
     */
    set(key: any, value: V): any;
    /**
     * Adds multiple key-value pairs from another structs_Map or Object.
     * @param {?Object} map Object containing the data to add.
     */
    addAll(map: any | null): void;
    /**
     * Calls the given function on each entry in the map.
     * @param {function(this:T, V, K, structs_Map<K,V>)} f
     * @param {T=} opt_obj The value of "this" inside f.
     * @template T
     */
    forEach<T>(f: (this: T, arg1: V, arg2: K, arg3: structs_Map<K, V>) => any, opt_obj?: T | undefined): void;
    /**
     * Clones a map and returns a new map.
     * @return {!structs_Map} A new map with the same key-value pairs.
     */
    clone(): structs_Map;
    /**
     * Returns a new map in which all the keys and values are interchanged
     * (keys become values and values become keys). If multiple keys map to the
     * same value, the chosen transposed value is implementation-dependent.
     *
     * It acts very similarly to {goog.object.transpose(Object)}.
     *
     * @return {!structs_Map} The transposed map.
     */
    transpose(): structs_Map;
    /**
     * @return {!Object} Object representation of the map.
     */
    toObject(): any;
    /**
     * Returns an iterator that iterates over the keys in the map.  Removal of keys
     * while iterating might have undesired side effects.
     * @return {!Iterator} An iterator over the keys in the map.
     */
    getKeyIterator(): Iterator;
    /**
     * Returns an iterator that iterates over the values in the map.  Removal of
     * keys while iterating might have undesired side effects.
     * @return {!Iterator} An iterator over the values in the map.
     */
    getValueIterator(): Iterator;
    /**
     * Returns an iterator that iterates over the values or the keys in the map.
     * This throws an exception if the map was mutated since the iterator was
     * created.
     * @param {boolean=} opt_keys True to iterate over the keys. False to iterate
     *     over the values.  The default value is false.
     * @return {!Iterator} An iterator over the values or keys in the map.
     */
    __iterator__(opt_keys?: boolean | undefined): Iterator;
}
import { Iterator } from "../iter/iter.js";
