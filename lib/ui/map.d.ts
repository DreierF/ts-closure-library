export { UiMap as Map };
/**
 * @fileoverview Datastructure: Hash Map.
 *
 * This file provides a goog.structs.Map interface based on native Map.
 */
/**
 * Class for Hash Map datastructure.
 * @template K, V
 */
declare class UiMap<K, V> {
    /**
     * Class for Hash Map datastructure.
     * @param {*=} map Map or Object to initialize the map with.
     * @template K, V
     */
    constructor(map?: any | undefined, ...args: any[]);
    /** @private @const {!Map<K, V>} */
    private map_;
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
     * @return {!Array<K>} Array of string values.
     */
    getKeys(): K[];
    /**
     * Whether the map contains the given key.
     * @param {K} key The key to check for.
     * @return {boolean} Whether the map contains the key.
     */
    containsKey(key: K): boolean;
    /**
     * Whether the map contains the given value. This is O(n).
     * @param {V} val The value to check for.
     * @return {boolean} Whether the map contains the value.
     */
    containsValue(val: V): boolean;
    /**
     * Whether this map is equal to the argument map.
     * @param {!UiMap} otherMap The map against which to test equality.
     * @param {function(V, V): boolean=} equalityFn Optional equality function
     *     to test equality of values. If not specified, this will test whether
     *     the values contained in each map are identical objects.
     * @return {boolean} Whether the maps are equal.
     */
    equals(otherMap: UiMap, equalityFn?: ((arg0: V, arg1: V) => boolean) | undefined): boolean;
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
     * @param {K} key  The key to remove.
     * @return {boolean} Whether object was removed.
     */
    remove(key: K): boolean;
    /**
     * Returns the value for the given key.  If the key is not found and the default
     * value is not given this will return `undefined`.
     * @param {*} key The key to get the value for.
     * @param {DEFAULT=} defaultValue The value to return if no item is found for
     *     the given key, defaults to undefined.
     * @return {V|DEFAULT} The value for the given key.
     * @template DEFAULT
     */
    get<DEFAULT>(key: any, defaultValue?: DEFAULT | undefined): V | DEFAULT;
    /**
     * Adds a key-value pair to the map.
     * @param {*} key The key.
     * @param {V} value The value to add.
     * @return {!THIS} Some subclasses return a value.
     * @this {THIS}
     * @template THIS
     */
    set<THIS>(key: any, value: V): THIS;
    /**
     * Adds multiple key-value pairs from another goog.ui.Map or Object.
     * @param {!Object<K, V>} map Object containing the data to add.
     */
    addAll(map: any): void;
    /**
     * Calls the given function on each entry in the map.
     * @param {function(this:T, V, K, (!Map|!UiMap<K,V>|null))} callbackFn
     * @param {T=} thisArg The value of "this" inside callbackFn.
     * @template T
     */
    forEach<T>(callbackFn: (this: T, arg1: V, arg2: K, arg3: any) => any, thisArg?: T | undefined): void;
    /**
     * Clones a map and returns a new map.
     * @return {!UiMap} A new map with the same key-value pairs.
     */
    clone(): UiMap;
    /**
     * @return {!Object} Object representation of the map.
     */
    toObject(): any;
}
