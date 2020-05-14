/**
 * A weakmap-like implementation for browsers that don't support native WeakMap.
 * It uses a data attribute on the key element for O(1) lookups.
 * @template T
 */
export class ElementWeakMap<T> {
    /**
     * Returns either this weakmap adapter or the native weakmap implmentation, if
     * available.
     * @return {!ElementWeakMap|!WeakMap}
     */
    static newWeakMap(): ElementWeakMap | any;
    /** @private {!Array<!Element>} */
    private keys_;
    /** @private {!Array<!T>} */
    private values_;
    /** @private @const {string} */
    private dataAttributeName_;
    /**
     * Stores a `elementKey` -> `value` mapping.
     * @param {!Element} elementKey
     * @param {!T} value
     * @return {!ElementWeakMap}
     */
    set(elementKey: Element, value: T): ElementWeakMap;
    /**
     * Gets the value previously stored for `elementKey`, or undefined if no
     * value was stored for such key.
     * @param {!Element} elementKey
     * @return {!Element|undefined}
     */
    get(elementKey: Element): Element | undefined;
    /** Clears the map. */
    clear(): void;
}
