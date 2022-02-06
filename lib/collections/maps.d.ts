/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Helper methods that operate on Map-like objects (e.g. ES6
 * Maps).
 */
/**
 * A MapLike implements the same public interface as an ES6 Map, without tying
 * the underlying code directly to the implementation. Any additions to this
 * type should also be present on ES6 Maps.
 * @template K,V
 * @interface
 */
export class MapLike<K, V> {
    /**
     * @param {K} key The key to set in the map.
     * @param {V} val The value to set for the given key in the map.
     */
    set(key: K, val: V): void;
    /**
     * @param {K} key The key to retrieve from the map.
     * @return {V|undefined} The value for this key, or undefined if the key is
     *     not present in the map.
     */
    get(key: K): V | undefined;
    /**
     * @return {!IteratorIterable<K>} An ES6 Iterator that iterates over the keys
     *     in the map.
     */
    keys(): any;
    /**
     * @return {!IteratorIterable<V>} An ES6 Iterator that iterates over the
     *     values in the map.
     */
    values(): any;
    /**
     * @param {K} key The key to check.
     * @return {boolean} True iff this key is present in the map.
     */
    has(key: K): boolean;
}
/**
 * Iterates over each entry in the given entries and sets the entry in
 * the map, overwriting any existing entries for the key.
 * @param {!MapLike<K,V>} map The map to set entries on.
 * @param {?Iterable<!Array<K|V>>} entries The iterable of entries. This
 *     iterable should really be of type Iterable<Array<[K,V]>>, but the tuple
 *     type is not representable in the Closure Type System.
 * @template K,V
 */
export function setAll<K, V>(map: MapLike<K, V>, entries: any | null): void;
/**
 * Determines if a given map contains the given value, optionally using
 * a custom comparison function.
 * @param {!MapLike<?,V1>} map The map whose values to check.
 * @param {?V2} val The value to check for.
 * @param {(function(V1,V2): boolean)=} valueEqualityFn The comparison function
 *     used to determine if the given value is equivalent to any of the values
 *     in the map. If no function is provided, defaults to strict equality
 *     (===).
 * @return {boolean} True iff the given map contains the given value according
 *     to the comparison function.
 * @template V1,V2
 */
export function hasValue<V1, V2>(map: MapLike<any, V1>, val: V2 | null, valueEqualityFn?: ((arg0: V1, arg1: V2) => boolean) | undefined): boolean;
/**
 * Compares two maps using their public APIs to determine if they have
 * equal contents, optionally using a custom comparison function when comaring
 * values.
 * @param {!MapLike<K,V1>} map The first map
 * @param {!MapLike<K,V2>} otherMap The other map
 * @param {(function(V1,V2): boolean)=} valueEqualityFn The comparison function
 *     used to determine if the values obtained from each map are equivalent. If
 *     no function is provided, defaults to strict equality (===).
 * @return {boolean}
 * @template K,V1,V2
 */
export function equals<K, V1, V2>(map: MapLike<K, V1>, otherMap: MapLike<K, V2>, valueEqualityFn?: ((arg0: V1, arg1: V2) => boolean) | undefined): boolean;
/**
 * Returns a new ES6 Map in which all the keys and values from the
 * given map are interchanged (keys become values and values become keys). If
 * multiple keys in the given map to the same value, the resulting value in the
 * transposed map is implementation-dependent.
 *
 * It acts very similarly to {goog.object.transpose(Object)}.
 * @param {!MapLike<K,V>} map The map to transpose.
 * @return {!Map<V,K>} A transposed version of the given map.
 * @template K,V
 */
export function transpose<K, V>(map: MapLike<K, V>): any;
/**
 * ToObject returns a new object whose properties are the keys from the Map.
 * @param {!MapLike<K,V>} map The map to convert into an object.
 * @return {!Object<K,V>} An object representation of the Map.
 * @template K,V
 */
export function toObject<K, V>(map: MapLike<K, V>): any;
