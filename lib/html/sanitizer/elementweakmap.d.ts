/**
 * A weakmap-like implementation for browsers that don't support native WeakMap.
 * It uses a data attribute on the key element for O(1) lookups.
 * @template T
 */
export class ElementWeakMap<T> {
    /** @private {!Array<!Element>} */
    keys_: any[];
    /** @private {!Array<!T>} */
    values_: any[];
    /** @private @const {string} */
    dataAttributeName_: string;
    /**
     * Stores a `elementKey` -> `value` mapping.
     * @param {!Element} elementKey
     * @param {!T} value
     * @return {!ElementWeakMap}
     */
    set(elementKey: Element, value: T): ElementWeakMap<any>;
    /**
     * Gets the value previously stored for `elementKey`, or undefined if no
     * value was stored for such key.
     * @param {!Element} elementKey
     * @return {!Element|undefined}
     */
    get(elementKey: Element): Element;
    /** Clears the map. */
    clear(): void;
}
export namespace ElementWeakMap { }
