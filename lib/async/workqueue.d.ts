/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * A low GC workqueue. The key elements of this design:
 *   - avoids the need for google.bind or equivalent by carrying scope
 *   - avoids the need for array reallocation by using a linked list
 *   - minimizes work entry objects allocation by recycling objects
 * @final
 * @struct
 */
export class WorkQueue {
    workHead_: any;
    workTail_: WorkItem | null;
    /**
     * @param {function()} fn
     * @param {Object|null|undefined} scope
     */
    add(fn: () => any, scope: any | null | undefined): void;
    /**
     * @return {?WorkItem}
     */
    remove(): WorkItem | null;
    /**
     * @param {!WorkItem} item
     */
    returnUnused(item: WorkItem): void;
    /**
     * @return {!WorkItem}
     * @private
     */
    private getUnusedItem_;
}
export namespace WorkQueue {
    const freelist_: FreeList<WorkItem>;
}
/** @type {number} The maximum number of entries to keep for recycling. */
export const DEFAULT_MAX_UNUSED: number;
/**
 * @final
 * @struct
 */
declare class WorkItem {
    /** @type {?function()} */
    fn: (() => any) | null;
    /** @type {?Object|null|undefined} */
    scope: (any | null | undefined) | null;
    /** @type {?WorkItem} */
    next: WorkItem | null;
    /**
     * @param {function()} fn
     * @param {Object|null|undefined} scope
     */
    set(fn: () => any, scope: any | null | undefined): void;
    /** Reset the work item so they don't prevent GC before reuse */
    reset(): void;
}
import { FreeList } from "./freelist.js";
export {};
