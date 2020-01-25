import * as asserts from './../asserts/asserts.js';
import * as google from './../google.js';
import {FreeList} from './freelist.js';
// Copyright 2015 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// TODO(johnlenz): generalize the WorkQueue if this is used by more
// than goog.async.run.

/**
 * A low GC workqueue. The key elements of this design:
 *   - avoids the need for google.bind or equivalent by carrying scope
 *   - avoids the need for array reallocation by using a linked list
 *   - minimizes work entry objects allocation by recycling objects
 * @final
 * @class
 */
class WorkQueue {

  /**
   * A low GC workqueue. The key elements of this design:
   *   - avoids the need for google.bind or equivalent by carrying scope
   *   - avoids the need for array reallocation by using a linked list
   *   - minimizes work entry objects allocation by recycling objects
   */
  constructor() {
    this.workHead_ = null;
    this.workTail_ = null;
  }

  /**
   * @param {function()} fn
   * @param {Object|null|undefined} scope
   */
  add(fn, scope) {
    var item = this.getUnusedItem_();
    item.set(fn, scope);
  
    if (this.workTail_) {
      this.workTail_.next = item;
      this.workTail_ = item;
    } else {
      asserts.assert(!this.workHead_);
      this.workHead_ = item;
      this.workTail_ = item;
    }
  };

  /**
   * @return {WorkItem}
   */
  remove() {
    var item = null;
  
    if (this.workHead_) {
      item = this.workHead_;
      this.workHead_ = this.workHead_.next;
      if (!this.workHead_) {
        this.workTail_ = null;
      }
      item.next = null;
    }
    return item;
  };

  /**
   * @param {WorkItem} item
   */
  returnUnused(item) {
    WorkQueue.freelist_.put(item);
  };

  /**
   * @return {WorkItem}
   * @private
   */
  getUnusedItem_() {
    return WorkQueue.freelist_.get();
  };
}

/** @type {number} The maximum number of entries to keep for recycling. */
const DEFAULT_MAX_UNUSED = 100;

/** @const @private {FreeList<WorkItem>} */
WorkQueue.freelist_ = new FreeList(
    function() { return new WorkItem(); },
    function(item) { item.reset(); }, DEFAULT_MAX_UNUSED);

/**
 * @final
 * @class
 */
class WorkItem {

  /**
   */
  constructor() {
    /** @type {?function()} */
    this.fn = null;
    /** @type {?Object|null|undefined} */
    this.scope = null;
    /** @type {?WorkItem} */
    this.next = null;
  }

  /**
   * @param {function()} fn
   * @param {Object|null|undefined} scope
   */
  set(fn, scope) {
    this.fn = fn;
    this.scope = scope;
    this.next = null;
  };

  /** Reset the work item so they don't prevent GC before reuse */
  reset() {
    this.fn = null;
    this.scope = null;
    this.next = null;
  };
}

export {DEFAULT_MAX_UNUSED, WorkItem, WorkQueue};