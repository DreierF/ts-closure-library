/**
 * @fileoverview Simple freelist.
 *
 * An anterative to goog.structs.SimplePool, it imposes the requirement that the
 * objects in the list contain a "next" property that can be used to maintain
 * the pool.
 */
/**
 * @template ITEM
 */
export class FreeList<ITEM> {
    /**
     * @param {function():ITEM} create
     * @param {function(ITEM):void} reset
     * @param {number} limit
     */
    constructor(create: () => ITEM, reset: (arg0: ITEM) => void, limit: number);
    /** @private @const {number} */
    limit_: number;
    /** @private @const {function()} */
    create_: () => ITEM;
    /** @private @const {function(ITEM):void} */
    reset_: (arg0: ITEM) => void;
    /** @private {number} */
    occupants_: number;
    /** @private {ITEM} */
    head_: any;
    /**
     * @return {?ITEM}
     */
    get(): ITEM | null;
    /**
     * @param {?ITEM} item An item available for possible future reuse.
     */
    put(item: ITEM | null): void;
    /**
     * Visible for testing.
     * @package
     * @return {number}
     */
    occupants(): number;
}
