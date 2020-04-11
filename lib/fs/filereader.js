import {EventTarget as EventsEventTarget} from './../events/eventhandler.js';
import * as google from './../google.js';
import {Deferred} from './../mochikit/async/deferred.js';
import {Error as FsError} from './error.js';
import {ProgressEvent as FsProgressEvent} from './progressevent.js';
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
 * @fileoverview A wrapper for the HTML5 FileReader object.
 */

/**
 * An object for monitoring the reading of files. This emits ProgressEvents of
 * the types listed in {@link EventType}.
 *
 * @extends {EventsEventTarget}
 * @final
 */
class fs_FileReader extends EventsEventTarget {

  /**
   * An object for monitoring the reading of files. This emits ProgressEvents of
   * the types listed in {@link EventType}.
   *
   */
  constructor() {
    super();
  
    /**
     * The underlying FileReader object.
     *
     * @type {!FileReader}
     * @private
     */
    this.reader_ = new FileReader();
  
    this.reader_.onloadstart = google.bind(this.dispatchProgressEvent_, this);
    this.reader_.onprogress = google.bind(this.dispatchProgressEvent_, this);
    this.reader_.onload = google.bind(this.dispatchProgressEvent_, this);
    this.reader_.onabort = google.bind(this.dispatchProgressEvent_, this);
    this.reader_.onerror = google.bind(this.dispatchProgressEvent_, this);
    this.reader_.onloadend = google.bind(this.dispatchProgressEvent_, this);
  }

  /**
   * Abort the reading of the file.
   */
  abort() {
    try {
      this.reader_.abort();
    } catch (e) {
      throw new FsError(e, 'aborting read');
    }
  };

  /**
   * @return {ReadyState} The current state of the FileReader.
   */
  getReadyState() {
    return /** @type {ReadyState} */ (this.reader_.readyState);
  };

  /**
   * @return {*} The result of the file read.
   */
  getResult() {
    return this.reader_.result;
  };

  /**
   * @return {FsError} The error encountered while reading, if any.
   */
  getError() {
    return this.reader_.error &&
        new FsError(this.reader_.error, 'reading file');
  };

  /**
   * Wrap a progress event emitted by the underlying file reader and re-emit it.
   *
   * @param {!ProgressEvent} event The underlying event.
   * @private
   */
  dispatchProgressEvent_(event) {
    this.dispatchEvent(new FsProgressEvent(event, this));
  };

  /** @override */
  disposeInternal() {
    super.disposeInternal();
    delete this.reader_;
  };

  /**
   * Starts reading a blob as a binary string.
   * @param {!Blob} blob The blob to read.
   */
  readAsBinaryString(blob) {
    this.reader_.readAsBinaryString(blob);
  };

  /**
   * Reads a blob as a binary string.
   * @param {!Blob} blob The blob to read.
   * @return {!Deferred} The deferred Blob contents as a binary string.
   *     If an error occurs, the errback is called with a {@link FsError}.
   */
  static readAsBinaryString(blob) {
    var reader = new fs_FileReader();
    var d = fs_FileReader.createDeferred_(reader);
    reader.readAsBinaryString(blob);
    return d;
  };

  /**
   * Starts reading a blob as an array buffer.
   * @param {!Blob} blob The blob to read.
   */
  readAsArrayBuffer(blob) {
    this.reader_.readAsArrayBuffer(blob);
  };

  /**
   * Reads a blob as an array buffer.
   * @param {!Blob} blob The blob to read.
   * @return {!Deferred} The deferred Blob contents as an array buffer.
   *     If an error occurs, the errback is called with a {@link FsError}.
   */
  static readAsArrayBuffer(blob) {
    var reader = new fs_FileReader();
    var d = fs_FileReader.createDeferred_(reader);
    reader.readAsArrayBuffer(blob);
    return d;
  };

  /**
   * Starts reading a blob as text.
   * @param {!Blob} blob The blob to read.
   * @param {string=} opt_encoding The name of the encoding to use.
   */
  readAsText(blob, opt_encoding) {
    this.reader_.readAsText(blob, opt_encoding);
  };

  /**
   * Reads a blob as text.
   * @param {!Blob} blob The blob to read.
   * @param {string=} opt_encoding The name of the encoding to use.
   * @return {!Deferred} The deferred Blob contents as text.
   *     If an error occurs, the errback is called with a {@link FsError}.
   */
  static readAsText(blob, opt_encoding) {
    var reader = new fs_FileReader();
    var d = fs_FileReader.createDeferred_(reader);
    reader.readAsText(blob, opt_encoding);
    return d;
  };

  /**
   * Starts reading a blob as a data URL.
   * @param {!Blob} blob The blob to read.
   */
  readAsDataUrl(blob) {
    this.reader_.readAsDataURL(blob);
  };

  /**
   * Reads a blob as a data URL.
   * @param {!Blob} blob The blob to read.
   * @return {!Deferred} The deferred Blob contents as a data URL.
   *     If an error occurs, the errback is called with a {@link FsError}.
   */
  static readAsDataUrl(blob) {
    var reader = new fs_FileReader();
    var d = fs_FileReader.createDeferred_(reader);
    reader.readAsDataUrl(blob);
    return d;
  };

  /**
   * Creates a new deferred object for the results of a read method.
   * @param {fs_FileReader} reader The reader to create a deferred for.
   * @return {!Deferred} The deferred results.
   * @private
   */
  static createDeferred_(reader) {
    var deferred = new Deferred();
    reader.listen(
        EventType.LOAD_END, google.partial(function(d, r, e) {
          var result = r.getResult();
          var error = r.getError();
          if (result != null && !error) {
            d.callback(result);
          } else {
            d.errback(error);
          }
          r.dispose();
        }, deferred, reader));
    return deferred;
  };
}

/**
 * Possible states for a FileReader.
 *
 * @enum {number}
 */
let ReadyState = {
  /**
   * The object has been constructed, but there is no pending read.
   */
  INIT: 0,
  /**
   * Data is being read.
   */
  LOADING: 1,
  /**
   * The data has been read from the file, the read was aborted, or an error
   * occurred.
   */
  DONE: 2
};

/**
 * Events emitted by a FileReader.
 *
 * @enum {string}
 */
let EventType = {
  /**
   * Emitted when the reading begins. readyState will be LOADING.
   */
  LOAD_START: 'loadstart',
  /**
   * Emitted when progress has been made in reading the file. readyState will be
   * LOADING.
   */
  PROGRESS: 'progress',
  /**
   * Emitted when the data has been successfully read. readyState will be
   * LOADING.
   */
  LOAD: 'load',
  /**
   * Emitted when the reading has been aborted. readyState will be LOADING.
   */
  ABORT: 'abort',
  /**
   * Emitted when an error is encountered or the reading has been aborted.
   * readyState will be LOADING.
   */
  ERROR: 'error',
  /**
   * Emitted when the reading is finished, whether successfully or not.
   * readyState will be DONE.
   */
  LOAD_END: 'loadend'
};

export {EventType, ReadyState, fs_FileReader as FileReader};