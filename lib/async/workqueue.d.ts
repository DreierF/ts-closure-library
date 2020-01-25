/** @type {number} The maximum number of entries to keep for recycling. */
export const DEFAULT_MAX_UNUSED: number;
/**
 * @final
 * @class
 */
export class WorkItem {
    /** @type {?function()} */
    fn: (() => void) | null;
    /** @type {?Object|null|undefined} */
    scope: (Object | null | undefined) | null;
    /** @type {?WorkItem} */
    next: WorkItem | null;
    /**
     * @param {function()} fn
     * @param {Object|null|undefined} scope
     */
    set(fn: () => any, scope: any): void;
    /** Reset the work item so they don't prevent GC before reuse */
    reset(): void;
}
/**
 * A low GC workqueue. The key elements of this design:
 *   - avoids the need for google.bind or equivalent by carrying scope
 *   - avoids the need for array reallocation by using a linked list
 *   - minimizes work entry objects allocation by recycling objects
 * @final
 * @class
 */
export class WorkQueue {
    workHead_: any;
    workTail_: WorkItem;
    /**
     * @param {function()} fn
     * @param {Object|null|undefined} scope
     */
    add(fn: () => any, scope: any): void;
    /**
     * @return {?WorkItem}
     */
    remove(): WorkItem;
    /**
     * @param {?WorkItem} item
     */
    returnUnused(item: WorkItem): void;
    /**
     * @return {?WorkItem}
     * @private
     */
    getUnusedItem_(): WorkItem;
}
export namespace WorkQueue {
    export const freelist_: FreeList<WorkItem>;
}
import { FreeList } from "./freelist.js";
