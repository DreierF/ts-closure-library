import * as google from './../google.js';
import {nextTick} from './nexttick.js';
import {throwException} from './nexttick.js';
import {WorkQueue} from './workqueue.js';
// Copyright 2013 The Closure Library Authors. All Rights Reserved.
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

/**
 * @type {boolean} If true, use the global Promise to implement run
 * assuming either the native, or polyfill version will be used. Does still
 * permit tests to use forceNextTick.
 */
const ASSUME_NATIVE_PROMISE = false;

/**
 * Fires the provided callback just before the current callstack unwinds, or as
 * soon as possible after the current JS execution context.
 * @param {function(this:THIS)} callback
 * @param {THIS=} opt_context Object to use as the "this value" when calling
 *     the provided function.
 * @template THIS
 */
function run(callback, opt_context) {
  if (!run.schedule_) {
    run.initializeRunner_();
  }
  if (!run.workQueueScheduled_) {
    // Nothing is currently scheduled, schedule it now.
    run.schedule_();
    run.workQueueScheduled_ = true;
  }

  run.workQueue_.add(callback, opt_context);
};

/**
 * Initializes the function to use to process the work queue.
 * @private
 */
run.initializeRunner_ = function() {
  if (ASSUME_NATIVE_PROMISE ||
      (window.Promise && window.Promise.resolve)) {
    // Use window.Promise instead of just Promise because the relevant
    // externs may be missing, and don't alias it because this could confuse the
    // compiler into thinking the polyfill is required when it should be treated
    // as optional.
    var promise = window.Promise.resolve(undefined);
    run.schedule_ = function() {
      promise.then(run.processWorkQueue);
    };
  } else {
    run.schedule_ = function() {
      nextTick(run.processWorkQueue);
    };
  }
};

/**
 * Forces run to use nextTick instead of Promise.
 *
 * This should only be done in unit tests. It's useful because MockClock
 * replaces nextTick, but not the browser Promise implementation, so it allows
 * Promise-based code to be tested with MockClock.
 *
 * However, we also want to run promises if the MockClock is no longer in
 * control so we schedule a backup "setTimeout" to the unmocked timeout if
 * provided.
 *
 * @param {function(function())=} opt_realSetTimeout
 */
run.forceNextTick = function(opt_realSetTimeout) {
  run.schedule_ = function() {
    nextTick(run.processWorkQueue);
    if (opt_realSetTimeout) {
      opt_realSetTimeout(run.processWorkQueue);
    }
  };
};

/**
 * The function used to schedule work asynchronousely.
 * @private {function()}
 */
run.schedule_;

/** @private {boolean} */
run.workQueueScheduled_ = false;

/** @private {!WorkQueue} */
run.workQueue_ = new WorkQueue();

/**
 * Run any pending run work items. This function is not intended
 * for general use, but for use by entry point handlers to run items ahead of
 * nextTick.
 */
run.processWorkQueue = function() {
  // NOTE: additional work queue items may be added while processing.
  var item = null;
  while (item = run.workQueue_.remove()) {
    try {
      item.fn.call(item.scope);
    } catch (e) {
      throwException(e);
    }
    run.workQueue_.returnUnused(item);
  }

  // There are no more work items, allow processing to be scheduled again.
  run.workQueueScheduled_ = false;
};

export {ASSUME_NATIVE_PROMISE, run};