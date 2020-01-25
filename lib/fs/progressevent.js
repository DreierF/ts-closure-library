import {Event as EventsEvent} from './../events/event.js';
// Copyright 2011 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview A wrapper for the HTML5 File ProgressEvent objects.
 */

/**
 * A wrapper for the progress events emitted by the File APIs.
 *
 * @extends {EventsEvent}
 * @final
 */
class fs_ProgressEvent extends EventsEvent {

  /**
   * A wrapper for the progress events emitted by the File APIs.
   *
   * @param {!ProgressEvent} event The underlying event object.
   * @param {!Object} target The file access object emitting the event.
   */
  constructor(event, target) {
    super(event.type, target);
  
    /**
     * The underlying event object.
     * @type {!ProgressEvent}
     * @private
     */
    this.event_ = event;
  }

  /**
   * @return {boolean} Whether or not the total size of the of the file being
   *     saved is known.
   */
  isLengthComputable() {
    return this.event_.lengthComputable;
  };

  /**
   * @return {number} The number of bytes saved so far.
   */
  getLoaded() {
    return this.event_.loaded;
  };

  /**
   * @return {number} The total number of bytes in the file being saved.
   */
  getTotal() {
    return this.event_.total;
  };
}

export {fs_ProgressEvent as ProgressEvent};