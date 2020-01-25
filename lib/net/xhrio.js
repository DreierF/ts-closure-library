import * as googarray from './../array/array.js';
import * as asserts from './../asserts/asserts.js';
import * as entryPointRegistry from './../debug/entrypointregistry.js';
import {ErrorHandler} from './../debug/errorhandler.js';
import {EventTarget as EventsEventTarget} from './../events/eventhandler.js';
import * as google from './../google.js';
import * as hybrid from './../json/hybrid.js';
import * as goog_log from './../log/log.js';
import {Logger as LogLogger} from './../log/log.js';
import * as goog_object from './../object/object.js';
import * as strings from './../string/string.js';
import {Map as StructsMap} from './../structs/map.js';
import * as structs from './../structs/structs.js';
import {Timer} from './../timer/timer.js';
import {Uri as Goog_Uri} from './../uri/uri.js';
import * as utils from './../uri/utils.js';
import * as userAgent from './../useragent/useragent.js';
import {ErrorCode} from './errorcode.js';
import {EventType} from './eventtype.js';
import {HttpStatus} from './httpstatus.js';
import {XhrLike} from './xhrlike.js';
import {XmlHttp} from './xmlhttp.js';
import {OptionType} from './xmlhttp.js';
import {ReadyState} from './xmlhttp.js';
import {XmlHttpFactory as NetXmlHttpFactory} from './xmlhttpfactory.js';
// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Wrapper class for handling XmlHttpRequests.
 *
 * One off requests can be sent through XhrIo.send() or an
 * instance can be created to send multiple requests.  Each request uses its
 * own XmlHttpRequest object and handles clearing of the event callback to
 * ensure no leaks.
 *
 * XhrIo is event based, it dispatches events on success, failure, finishing,
 * ready-state change, or progress (download and upload).
 *
 * The ready-state or timeout event fires first, followed by
 * a generic completed event. Then the abort, error, or success event
 * is fired as appropriate. Progress events are fired as they are
 * received. Lastly, the ready event will fire to indicate that the
 * object may be used to make another request.
 *
 * The error event may also be called before completed and
 * ready-state-change if the XmlHttpRequest.open() or .send() methods throw.
 *
 * This class does not support multiple requests, queuing, or prioritization.
 *
 * When progress events are supported by the browser, and progress is
 * enabled via .setProgressEventsEnabled(true), the
 * EventType.PROGRESS event will be the re-dispatched browser
 * progress event. Additionally, a DOWNLOAD_PROGRESS or UPLOAD_PROGRESS event
 * will be fired for download and upload progress respectively.
 */

/**
 * Basic class for handling XMLHttpRequests.
 *     creating XMLHttpRequest objects.
 * @extends {EventsEventTarget}
 * @suppress {checkTypes} JSC_IN_USED_WITH_STRUCT: Cannot use the IN operator with structs on this.xhr_
 */
class XhrIo extends EventsEventTarget {

  /**
   * Basic class for handling XMLHttpRequests.
   * @param {NetXmlHttpFactory=} opt_xmlHttpFactory Factory to use when
   *     creating XMLHttpRequest objects.
   * @suppress {checkTypes} JSC_IN_USED_WITH_STRUCT: Cannot use the IN operator with structs on this.xhr_
   */
  constructor(opt_xmlHttpFactory) {
    super();
    /**
     * A reference to the XhrIo logger
     * @private
      * @type {?LogLogger}
     * @const
     */
    this.logger_ = goog_log.getLogger('goog.net.XhrIo');
  
  
    /**
     * Map of default headers to add to every request, use:
     * XhrIo.headers.set(name, value)
     * @type {!StructsMap}
     */
    this.headers = new StructsMap();
  
    /**
     * Optional XmlHttpFactory
     * @private {NetXmlHttpFactory}
     */
    this.xmlHttpFactory_ = opt_xmlHttpFactory || null;
  
    /**
     * Whether XMLHttpRequest is active.  A request is active from the time send()
     * is called until onReadyStateChange() is complete, or error() or abort()
     * is called.
     * @private {boolean}
     */
    this.active_ = false;
  
    /**
     * The XMLHttpRequest object that is being used for the transfer.
     * @private {?XhrLike.OrNative}
     */
    this.xhr_ = null;
  
    /**
     * The options to use with the current XMLHttpRequest object.
     * @private {?Object}
     */
    this.xhrOptions_ = null;
  
    /**
     * Last URL that was requested.
     * @private {string|Goog_Uri}
     */
    this.lastUri_ = '';
  
    /**
     * Method for the last request.
     * @private {string}
     */
    this.lastMethod_ = '';
  
    /**
     * Last error code.
     * @private {!ErrorCode}
     */
    this.lastErrorCode_ = ErrorCode.NO_ERROR;
  
    /**
     * Last error message.
     * @private {Error|string}
     */
    this.lastError_ = '';
  
    /**
     * Used to ensure that we don't dispatch an multiple ERROR events. This can
     * happen in IE when it does a synchronous load and one error is handled in
     * the ready statte change and one is handled due to send() throwing an
     * exception.
     * @private {boolean}
     */
    this.errorDispatched_ = false;
  
    /**
     * Used to make sure we don't fire the complete event from inside a send call.
     * @private {boolean}
     */
    this.inSend_ = false;
  
    /**
     * Used in determining if a call to {@link #onReadyStateChange_} is from
     * within a call to this.xhr_.open.
     * @private {boolean}
     */
    this.inOpen_ = false;
  
    /**
     * Used in determining if a call to {@link #onReadyStateChange_} is from
     * within a call to this.xhr_.abort.
     * @private {boolean}
     */
    this.inAbort_ = false;
  
    /**
     * Number of milliseconds after which an incomplete request will be aborted
     * and a {@link EventType.TIMEOUT} event raised; 0 means no timeout
     * is set.
     * @private {number}
     */
    this.timeoutInterval_ = 0;
  
    /**
     * Timer to track request timeout.
     * @private {?number}
     */
    this.timeoutId_ = null;
  
    /**
     * The requested type for the response. The empty string means use the default
     * XHR behavior.
     * @private {ResponseType}
     */
    this.responseType_ = ResponseType.DEFAULT;
  
    /**
     * Whether a "credentialed" request is to be sent (one that is aware of
     * cookies and authentication). This is applicable only for cross-domain
     * requests and more recent browsers that support this part of the HTTP Access
     * Control standard.
     *
     * @see http://www.w3.org/TR/XMLHttpRequest/#the-withcredentials-attribute
     *
     * @private {boolean}
     */
    this.withCredentials_ = false;
  
    /**
     * Whether progress events are enabled for this request. This is
     * disabled by default because setting a progress event handler
     * causes pre-flight OPTIONS requests to be sent for CORS requests,
     * even in cases where a pre-flight request would not otherwise be
     * sent.
     *
     * @see http://xhr.spec.whatwg.org/#security-considerations
     *
     * Note that this can cause problems for Firefox 22 and below, as an
     * older "LSProgressEvent" will be dispatched by the browser. That
     * progress event is no longer supported, and can lead to failures,
     * including throwing exceptions.
     *
     * @see http://bugzilla.mozilla.org/show_bug.cgi?id=845631
     * @see b/23469793
     *
     * @private {boolean}
     */
    this.progressEventsEnabled_ = false;
  
    /**
     * True if we can use XMLHttpRequest's timeout directly.
     * @private {boolean}
     */
    this.useXhr2Timeout_ = false;
  }

  /**
   * Disposes of the specified XhrIo created by
   * {@link XhrIo.send} and removes it from
   * {@link XhrIo.pendingStaticSendInstances_}.
   * @private
   */
  cleanupSend_() {
    this.dispose();
    googarray.remove(XhrIo.sendInstances_, this);
  };

  /**
   * Returns the number of milliseconds after which an incomplete request will be
   * aborted, or 0 if no timeout is set.
   * @return {number} Timeout interval in milliseconds.
   */
  getTimeoutInterval() {
    return this.timeoutInterval_;
  };

  /**
   * Sets the number of milliseconds after which an incomplete request will be
   * aborted and a {@link EventType.TIMEOUT} event raised; 0 means no
   * timeout is set.
   * @param {number} ms Timeout interval in milliseconds; 0 means none.
   */
  setTimeoutInterval(ms) {
    this.timeoutInterval_ = Math.max(0, ms);
  };

  /**
   * Sets the desired type for the response. At time of writing, this is only
   * supported in very recent versions of WebKit (10.0.612.1 dev and later).
   *
   * If this is used, the response may only be accessed via {@link #getResponse}.
   *
   * @param {ResponseType} type The desired type for the response.
   */
  setResponseType(type) {
    this.responseType_ = type;
  };

  /**
   * Gets the desired type for the response.
   * @return {ResponseType} The desired type for the response.
   */
  getResponseType() {
    return this.responseType_;
  };

  /**
   * Sets whether a "credentialed" request that is aware of cookie and
   * authentication information should be made. This option is only supported by
   * browsers that support HTTP Access Control. As of this writing, this option
   * is not supported in IE.
   *
   * @param {boolean} withCredentials Whether this should be a "credentialed"
   *     request.
   */
  setWithCredentials(withCredentials) {
    this.withCredentials_ = withCredentials;
  };

  /**
   * Gets whether a "credentialed" request is to be sent.
   * @return {boolean} The desired type for the response.
   */
  getWithCredentials() {
    return this.withCredentials_;
  };

  /**
   * Sets whether progress events are enabled for this request. Note
   * that progress events require pre-flight OPTIONS request handling
   * for CORS requests, and may cause trouble with older browsers. See
   * progressEventsEnabled_ for details.
   * @param {boolean} enabled Whether progress events should be enabled.
   */
  setProgressEventsEnabled(enabled) {
    this.progressEventsEnabled_ = enabled;
  };

  /**
   * Gets whether progress events are enabled.
   * @return {boolean} Whether progress events are enabled for this request.
   */
  getProgressEventsEnabled() {
    return this.progressEventsEnabled_;
  };

  /**
   * Instance send that actually uses XMLHttpRequest to make a server call.
   * @param {string|Goog_Uri} url Uri to make request to.
   * @param {string=} opt_method Send method, default: GET.
   * @param {ArrayBuffer|ArrayBufferView|Blob|Document|FormData|string=}
   *     opt_content Body data.
   * @param {Object|StructsMap=} opt_headers Map of headers to add to the
   *     request.
   * @suppress {deprecated} Use deprecated structs.forEach to allow different
   * types of parameters for opt_headers.
   */
  send(
      url, opt_method, opt_content, opt_headers) {
    if (this.xhr_) {
      throw new Error(
          '[XhrIo] Object is active with another request=' +
          this.lastUri_ + '; newUri=' + url);
    }
  
    var method = opt_method ? opt_method.toUpperCase() : 'GET';
  
    this.lastUri_ = url;
    this.lastError_ = '';
    this.lastErrorCode_ = ErrorCode.NO_ERROR;
    this.lastMethod_ = method;
    this.errorDispatched_ = false;
    this.active_ = true;
  
    // Use the factory to create the XHR object and options
    this.xhr_ = this.createXhr();
    this.xhrOptions_ = this.xmlHttpFactory_ ? this.xmlHttpFactory_.getOptions() :
                                              XmlHttp.getOptions();
  
    // Set up the onreadystatechange callback
    this.xhr_.onreadystatechange = google.bind(this.onReadyStateChange_, this);
  
    // Set up upload/download progress events, if progress events are supported.
    if (this.getProgressEventsEnabled() && 'onprogress' in this.xhr_) {
      this.xhr_.onprogress =
          google.bind(function(e) { this.onProgressHandler_(e, true); }, this);
      if (this.xhr_.upload) {
        this.xhr_.upload.onprogress = google.bind(this.onProgressHandler_, this);
      }
    }
  
    /**
     * Try to open the XMLHttpRequest (always async), if an error occurs here it
     * is generally permission denied
     */
    try {
      goog_log.fine(this.logger_, this.formatMsg_('Opening Xhr'));
      this.inOpen_ = true;
      this.xhr_.open(method, String(url), true);  // Always async!
      this.inOpen_ = false;
    } catch (err) {
      goog_log.fine(
          this.logger_, this.formatMsg_('Error opening Xhr: ' + err.message));
      this.error_(ErrorCode.EXCEPTION, err);
      return;
    }
  
    // We can't use null since this won't allow requests with form data to have a
    // content length specified which will cause some proxies to return a 411
    // error.
    var content = opt_content || '';
  
    var headers = this.headers.clone();
  
    // Add headers specific to this request
    if (opt_headers) {
      structs.forEach(
          opt_headers, function(value, key) { headers.set(key, value); });
    }
  
    // Find whether a content type header is set, ignoring case.
    // HTTP header names are case-insensitive.  See:
    // http://www.w3.org/Protocols/rfc2616/rfc2616-sec4.html#sec4.2
    var contentTypeKey =
        googarray.find(headers.getKeys(), XhrIo.isContentTypeHeader_);
  
    var contentIsFormData =
        (window['FormData'] && (content instanceof window['FormData']));
    if (googarray.contains(XhrIo.METHODS_WITH_FORM_DATA, method) &&
        !contentTypeKey && !contentIsFormData) {
      // For requests typically with form data, default to the url-encoded form
      // content type unless this is a FormData request.  For FormData,
      // the browser will automatically add a multipart/form-data content type
      // with an appropriate multipart boundary.
      headers.set(
          XhrIo.CONTENT_TYPE_HEADER, XhrIo.FORM_CONTENT_TYPE);
    }
  
    // Add the headers to the Xhr object
    headers.forEach(function(value, key) {
      this.xhr_.setRequestHeader(key, value);
    }, this);
  
    if (this.responseType_) {
      this.xhr_.responseType = this.responseType_;
    }
    // Set xhr_.withCredentials only when the value is different, or else in
    // synchronous XMLHtppRequest.open Firefox will throw an exception.
    // https://bugzilla.mozilla.org/show_bug.cgi?id=736340
    if ('withCredentials' in this.xhr_ &&
        this.xhr_.withCredentials !== this.withCredentials_) {
      this.xhr_.withCredentials = this.withCredentials_;
    }
  
    /**
     * Try to send the request, or other wise report an error (404 not found).
     */
    try {
      this.cleanUpTimeoutTimer_();  // Paranoid, should never be running.
      if (this.timeoutInterval_ > 0) {
        this.useXhr2Timeout_ = XhrIo.shouldUseXhr2Timeout_(this.xhr_);
        goog_log.fine(
            this.logger_, this.formatMsg_(
                              'Will abort after ' + this.timeoutInterval_ +
                              'ms if incomplete, xhr2 ' + this.useXhr2Timeout_));
        if (this.useXhr2Timeout_) {
          this.xhr_[XhrIo.XHR2_TIMEOUT_] = this.timeoutInterval_;
          this.xhr_[XhrIo.XHR2_ON_TIMEOUT_] =
              google.bind(this.timeout_, this);
        } else {
          this.timeoutId_ =
              Timer.callOnce(this.timeout_, this.timeoutInterval_, this);
        }
      }
      goog_log.fine(this.logger_, this.formatMsg_('Sending request'));
      this.inSend_ = true;
      this.xhr_.send(content);
      this.inSend_ = false;
  
    } catch (err) {
      goog_log.fine(this.logger_, this.formatMsg_('Send error: ' + err.message));
      this.error_(ErrorCode.EXCEPTION, err);
    }
  };

  /**
   * Creates a new XHR object.
   * @return {!XhrLike.OrNative} The newly created XHR object.
   * @protected
   */
  createXhr() {
    return this.xmlHttpFactory_ ? this.xmlHttpFactory_.createInstance() :
                                  XmlHttp();
  };

  /**
   * The request didn't complete after {@link XhrIo#timeoutInterval_}
   * milliseconds; raises a {@link EventType.TIMEOUT} event and aborts
   * the request.
   * @private
   */
  timeout_() {
    if (typeof goog == 'undefined') {
      // If goog is undefined then the callback has occurred as the application
      // is unloading and will error.  Thus we let it silently fail.
    } else if (this.xhr_) {
      this.lastError_ =
          'Timed out after ' + this.timeoutInterval_ + 'ms, aborting';
      this.lastErrorCode_ = ErrorCode.TIMEOUT;
      goog_log.fine(this.logger_, this.formatMsg_(this.lastError_));
      this.dispatchEvent(EventType.TIMEOUT);
      this.abort(ErrorCode.TIMEOUT);
    }
  };

  /**
   * Something errorred, so inactivate, fire error callback and clean up
   * @param {ErrorCode} errorCode The error code.
   * @param {Error} err The error object.
   * @private
   */
  error_(errorCode, err) {
    this.active_ = false;
    if (this.xhr_) {
      this.inAbort_ = true;
      this.xhr_.abort();  // Ensures XHR isn't hung (FF)
      this.inAbort_ = false;
    }
    this.lastError_ = err;
    this.lastErrorCode_ = errorCode;
    this.dispatchErrors_();
    this.cleanUpXhr_();
  };

  /**
   * Dispatches COMPLETE and ERROR in case of an error. This ensures that we do
   * not dispatch multiple error events.
   * @private
   */
  dispatchErrors_() {
    if (!this.errorDispatched_) {
      this.errorDispatched_ = true;
      this.dispatchEvent(EventType.COMPLETE);
      this.dispatchEvent(EventType.ERROR);
    }
  };

  /**
   * Abort the current XMLHttpRequest
   * @param {ErrorCode=} opt_failureCode Optional error code to use -
   *     defaults to ABORT.
   */
  abort(opt_failureCode) {
    if (this.xhr_ && this.active_) {
      goog_log.fine(this.logger_, this.formatMsg_('Aborting'));
      this.active_ = false;
      this.inAbort_ = true;
      this.xhr_.abort();
      this.inAbort_ = false;
      this.lastErrorCode_ = opt_failureCode || ErrorCode.ABORT;
      this.dispatchEvent(EventType.COMPLETE);
      this.dispatchEvent(EventType.ABORT);
      this.cleanUpXhr_();
    }
  };

  /**
   * Nullifies all callbacks to reduce risks of leaks.
   * @override
   * @protected
   */
  disposeInternal() {
    if (this.xhr_) {
      // We explicitly do not call xhr_.abort() unless active_ is still true.
      // This is to avoid unnecessarily aborting a successful request when
      // dispose() is called in a callback triggered by a complete response, but
      // in which browser cleanup has not yet finished.
      // (See http://b/issue?id=1684217.)
      if (this.active_) {
        this.active_ = false;
        this.inAbort_ = true;
        this.xhr_.abort();
        this.inAbort_ = false;
      }
      this.cleanUpXhr_(true);
    }
  
    super.disposeInternal();
  };

  /**
   * Internal handler for the XHR object's readystatechange event.  This method
   * checks the status and the readystate and fires the correct callbacks.
   * If the request has ended, the handlers are cleaned up and the XHR object is
   * nullified.
   * @private
   */
  onReadyStateChange_() {
    if (this.isDisposed()) {
      // This method is the target of an untracked Timer.callOnce().
      return;
    }
    if (!this.inOpen_ && !this.inSend_ && !this.inAbort_) {
      // Were not being called from within a call to this.xhr_.send
      // this.xhr_.abort, or this.xhr_.open, so this is an entry point
      this.onReadyStateChangeEntryPoint_();
    } else {
      this.onReadyStateChangeHelper_();
    }
  };

  /**
   * Used to protect the onreadystatechange handler entry point.  Necessary
   * as {#onReadyStateChange_} maybe called from within send or abort, this
   * method is only called when {#onReadyStateChange_} is called as an
   * entry point.
   * {@see #protectEntryPoints}
   * @private
   */
  onReadyStateChangeEntryPoint_() {
    this.onReadyStateChangeHelper_();
  };

  /**
   * Helper for {@link #onReadyStateChange_}.  This is used so that
   * entry point calls to {@link #onReadyStateChange_} can be routed through
   * {@link #onReadyStateChangeEntryPoint_}.
   * @private
   */
  onReadyStateChangeHelper_() {
    if (!this.active_) {
      // can get called inside abort call
      return;
    }
  
    if (typeof goog == 'undefined') {
      // NOTE(user): If goog is undefined then the callback has occurred as the
      // application is unloading and will error.  Thus we let it silently fail.
  
    } else if (
        this.xhrOptions_[OptionType.LOCAL_REQUEST_ERROR] &&
        this.getReadyState() == ReadyState.COMPLETE &&
        this.getStatus() == 2) {
      // NOTE(user): In IE if send() errors on a *local* request the readystate
      // is still changed to COMPLETE.  We need to ignore it and allow the
      // try/catch around send() to pick up the error.
      goog_log.fine(
          this.logger_,
          this.formatMsg_('Local request error detected and ignored'));
  
    } else {
      // In IE when the response has been cached we sometimes get the callback
      // from inside the send call and this usually breaks code that assumes that
      // XhrIo is asynchronous.  If that is the case we delay the callback
      // using a timer.
      if (this.inSend_ &&
          this.getReadyState() == ReadyState.COMPLETE) {
        Timer.callOnce(this.onReadyStateChange_, 0, this);
        return;
      }
  
      this.dispatchEvent(EventType.READY_STATE_CHANGE);
  
      // readyState indicates the transfer has finished
      if (this.isComplete()) {
        goog_log.fine(this.logger_, this.formatMsg_('Request complete'));
  
        this.active_ = false;
  
        try {
          // Call the specific callbacks for success or failure. Only call the
          // success if the status is 200 (HTTP_OK) or 304 (HTTP_CACHED)
          if (this.isSuccess()) {
            this.dispatchEvent(EventType.COMPLETE);
            this.dispatchEvent(EventType.SUCCESS);
          } else {
            this.lastErrorCode_ = ErrorCode.HTTP_ERROR;
            this.lastError_ =
                this.getStatusText() + ' [' + this.getStatus() + ']';
            this.dispatchErrors_();
          }
        } finally {
          this.cleanUpXhr_();
        }
      }
    }
  };

  /**
   * Internal handler for the XHR object's onprogress event. Fires both a generic
   * PROGRESS event and either a DOWNLOAD_PROGRESS or UPLOAD_PROGRESS event to
   * allow specific binding for each XHR progress event.
   * @param {!ProgressEvent} e XHR progress event.
   * @param {boolean=} opt_isDownload Whether the current progress event is from a
   *     download. Used to determine whether DOWNLOAD_PROGRESS or UPLOAD_PROGRESS
   *     event should be dispatched.
   * @private
   */
  onProgressHandler_(e, opt_isDownload) {
    asserts.assert(
        e.type === EventType.PROGRESS,
        'goog.net.EventType.PROGRESS is of the same type as raw XHR progress.');
    this.dispatchEvent(
        XhrIo.buildProgressEvent_(e, EventType.PROGRESS));
    this.dispatchEvent(
        XhrIo.buildProgressEvent_(
            e, opt_isDownload ? EventType.DOWNLOAD_PROGRESS :
                                EventType.UPLOAD_PROGRESS));
  };

  /**
   * Remove the listener to protect against leaks, and nullify the XMLHttpRequest
   * object.
   * @param {boolean=} opt_fromDispose If this is from the dispose (don't want to
   *     fire any events).
   * @private
   */
  cleanUpXhr_(opt_fromDispose) {
    if (this.xhr_) {
      // Cancel any pending timeout event handler.
      this.cleanUpTimeoutTimer_();
  
      // Save reference so we can mark it as closed after the READY event.  The
      // READY event may trigger another request, thus we must nullify this.xhr_
      var xhr = this.xhr_;
      var clearedOnReadyStateChange =
          this.xhrOptions_[OptionType.USE_NULL_FUNCTION] ?
          google.nullFunction :
          null;
      this.xhr_ = null;
      this.xhrOptions_ = null;
  
      if (!opt_fromDispose) {
        this.dispatchEvent(EventType.READY);
      }
  
      try {
        // NOTE(user): Not nullifying in FireFox can still leak if the callbacks
        // are defined in the same scope as the instance of XhrIo. But, IE doesn't
        // allow you to set the onreadystatechange to NULL so nullFunction is
        // used.
        xhr.onreadystatechange = clearedOnReadyStateChange;
      } catch (e) {
        // This seems to occur with a Gears HTTP request. Delayed the setting of
        // this onreadystatechange until after READY is sent out and catching the
        // error to see if we can track down the problem.
        goog_log.error(
            this.logger_,
            'Problem encountered resetting onreadystatechange: ' + e.message);
      }
    }
  };

  /**
   * Make sure the timeout timer isn't running.
   * @private
   */
  cleanUpTimeoutTimer_() {
    if (this.xhr_ && this.useXhr2Timeout_) {
      this.xhr_[XhrIo.XHR2_ON_TIMEOUT_] = null;
    }
    if (this.timeoutId_) {
      Timer.clear(this.timeoutId_);
      this.timeoutId_ = null;
    }
  };

  /**
   * @return {boolean} Whether there is an active request.
   */
  isActive() {
    return !!this.xhr_;
  };

  /**
   * @return {boolean} Whether the request has completed.
   */
  isComplete() {
    return this.getReadyState() == ReadyState.COMPLETE;
  };

  /**
   * @return {boolean} Whether the request completed with a success.
   */
  isSuccess() {
    var status = this.getStatus();
    // A zero status code is considered successful for local files.
    return HttpStatus.isSuccess(status) ||
        status === 0 && !this.isLastUriEffectiveSchemeHttp_();
  };

  /**
   * @return {boolean} whether the effective scheme of the last URI that was
   *     fetched was 'http' or 'https'.
   * @private
   */
  isLastUriEffectiveSchemeHttp_() {
    var scheme = utils.getEffectiveScheme(String(this.lastUri_));
    return XhrIo.HTTP_SCHEME_PATTERN.test(scheme);
  };

  /**
   * Get the readystate from the Xhr object
   * Will only return correct result when called from the context of a callback
   * @return {ReadyState} ReadyState.*.
   */
  getReadyState() {
    return this.xhr_ ?
        /** @type {ReadyState} */ (this.xhr_.readyState) :
                                                   ReadyState
                                                       .UNINITIALIZED;
  };

  /**
   * Get the status from the Xhr object
   * Will only return correct result when called from the context of a callback
   * @return {number} Http status.
   */
  getStatus() {
    /**
     * IE doesn't like you checking status until the readystate is greater than 2
     * (i.e. it is receiving or complete).  The try/catch is used for when the
     * page is unloading and an ERROR_NOT_AVAILABLE may occur when accessing xhr_.
     */
    try {
      return this.getReadyState() > ReadyState.LOADED ?
          /** @type {number} */(this.xhr_.status) :
          -1;
    } catch (e) {
      return -1;
    }
  };

  /**
   * Get the status text from the Xhr object
   * Will only return correct result when called from the context of a callback
   * @return {string} Status text.
   */
  getStatusText() {
    /**
     * IE doesn't like you checking status until the readystate is greater than 2
     * (i.e. it is receiving or complete).  The try/catch is used for when the
     * page is unloading and an ERROR_NOT_AVAILABLE may occur when accessing xhr_.
     */
    try {
      return this.getReadyState() > ReadyState.LOADED ?
          String(this.xhr_.statusText) :
          '';
    } catch (e) {
      goog_log.fine(this.logger_, 'Can not get status: ' + e.message);
      return '';
    }
  };

  /**
   * Get the last Uri that was requested
   * @return {string} Last Uri.
   */
  getLastUri() {
    return String(this.lastUri_);
  };

  /**
   * Get the response text from the Xhr object
   * Will only return correct result when called from the context of a callback.
   * @return {string} Result from the server, or '' if no result available.
   */
  getResponseText() {
    try {
      return this.xhr_ ? String(this.xhr_.responseText) : '';
    } catch (e) {
      // http://www.w3.org/TR/XMLHttpRequest/#the-responsetext-attribute
      // states that responseText should return '' (and responseXML null)
      // when the state is not LOADING or DONE. Instead, IE can
      // throw unexpected exceptions, for example when a request is aborted
      // or no data is available yet.
      goog_log.fine(this.logger_, 'Can not get responseText: ' + e.message);
      return '';
    }
  };

  /**
   * Get the response body from the Xhr object. This property is only available
   * in IE since version 7 according to MSDN:
   * http://msdn.microsoft.com/en-us/library/ie/ms534368(v=vs.85).aspx
   * Will only return correct result when called from the context of a callback.
   *
   * One option is to construct a VBArray from the returned object and convert
   * it to a JavaScript array using the toArray method:
   * `(new window['VBArray'](xhrIo.getResponseBody())).toArray()`
   * This will result in an array of numbers in the range of [0..255]
   *
   * Another option is to use the VBScript CStr method to convert it into a
   * string as outlined in http://stackoverflow.com/questions/1919972
   *
   * @return {Object} Binary result from the server or null if not available.
   */
  getResponseBody() {
    try {
      if (this.xhr_ && 'responseBody' in this.xhr_) {
        return this.xhr_['responseBody'];
      }
    } catch (e) {
      // IE can throw unexpected exceptions, for example when a request is aborted
      // or no data is yet available.
      goog_log.fine(this.logger_, 'Can not get responseBody: ' + e.message);
    }
    return null;
  };

  /**
   * Get the response XML from the Xhr object
   * Will only return correct result when called from the context of a callback.
   * @return {Document} The DOM Document representing the XML file, or null
   * if no result available.
   */
  getResponseXml() {
    try {
      return this.xhr_ ? this.xhr_.responseXML : null;
    } catch (e) {
      goog_log.fine(this.logger_, 'Can not get responseXML: ' + e.message);
      return null;
    }
  };

  /**
   * Get the response and evaluates it as JSON from the Xhr object
   * Will only return correct result when called from the context of a callback
   * @param {string=} opt_xssiPrefix Optional XSSI prefix string to use for
   *     stripping of the response before parsing. This needs to be set only if
   *     your backend server prepends the same prefix string to the JSON response.
   * @throws Error if the response text is invalid JSON.
   * @return {Object|undefined} JavaScript object.
   */
  getResponseJson(opt_xssiPrefix) {
    if (!this.xhr_) {
      return undefined;
    }
  
    var responseText = this.xhr_.responseText;
    if (opt_xssiPrefix && responseText.indexOf(opt_xssiPrefix) == 0) {
      responseText = responseText.substring(opt_xssiPrefix.length);
    }
  
    return hybrid.parse(responseText);
  };

  /**
   * Get the response as the type specificed by {@link #setResponseType}. At time
   * of writing, this is only directly supported in very recent versions of WebKit
   * (10.0.612.1 dev and later). If the field is not supported directly, we will
   * try to emulate it.
   *
   * Emulating the response means following the rules laid out at
   * http://www.w3.org/TR/XMLHttpRequest/#the-response-attribute
   *
   * On browsers with no support for this (Chrome < 10, Firefox < 4, etc), only
   * response types of DEFAULT or TEXT may be used, and the response returned will
   * be the text response.
   *
   * On browsers with Mozilla's draft support for array buffers (Firefox 4, 5),
   * only response types of DEFAULT, TEXT, and ARRAY_BUFFER may be used, and the
   * response returned will be either the text response or the Mozilla
   * implementation of the array buffer response.
   *
   * On browsers will full support, any valid response type supported by the
   * browser may be used, and the response provided by the browser will be
   * returned.
   *
   * @return {*} The response.
   * @suppress {checkTypes}
   */
  getResponse() {
    try {
      if (!this.xhr_) {
        return null;
      }
      if ('response' in this.xhr_) {
        return this.xhr_.response;
      }
      switch (this.responseType_) {
        case ResponseType.DEFAULT:
        case ResponseType.TEXT:
          return this.xhr_.responseText;
        // DOCUMENT and BLOB don't need to be handled here because they are
        // introduced in the same spec that adds the .response field, and would
        // have been caught above.
        // ARRAY_BUFFER needs an implementation for Firefox 4, where it was
        // implemented using a draft spec rather than the final spec.
        case ResponseType.ARRAY_BUFFER:
          if ('mozResponseArrayBuffer' in this.xhr_) {
            return this.xhr_.mozResponseArrayBuffer;
          }
      }
      // Fell through to a response type that is not supported on this browser.
      goog_log.error(
          this.logger_, 'Response type ' + this.responseType_ + ' is not ' +
              'supported on this browser');
      return null;
    } catch (e) {
      goog_log.fine(this.logger_, 'Can not get response: ' + e.message);
      return null;
    }
  };

  /**
   * Get the value of the response-header with the given name from the Xhr object
   * Will only return correct result when called from the context of a callback
   * and the request has completed
   * @param {string} key The name of the response-header to retrieve.
   * @return {string|undefined} The value of the response-header named key.
   */
  getResponseHeader(key) {
    if (!this.xhr_ || !this.isComplete()) {
      return undefined;
    }
  
    var value = this.xhr_.getResponseHeader(key);
    return value === null ? undefined : value;
  };

  /**
   * Gets the text of all the headers in the response.
   * Will only return correct result when called from the context of a callback
   * and the request has completed.
   * @return {string} The value of the response headers or empty string.
   */
  getAllResponseHeaders() {
    // getAllResponseHeaders can return null if no response has been received,
    // ensure we always return an empty string.
    return this.xhr_ && this.isComplete() ?
        (this.xhr_.getAllResponseHeaders() || '') :
        '';
  };

  /**
   * Returns all response headers as a key-value map.
   * Multiple values for the same header key can be combined into one,
   * separated by a comma and a space.
   * Note that the native getResponseHeader method for retrieving a single header
   * does a case insensitive match on the header name. This method does not
   * include any case normalization logic, it will just return a key-value
   * representation of the headers.
   * See: http://www.w3.org/TR/XMLHttpRequest/#the-getresponseheader()-method
   * @return {!Object<string, string>} An object with the header keys as keys
   *     and header values as values.
   */
  getResponseHeaders() {
    // TODO(b/120371595): Make this function parse headers as per the spec
    // (https://tools.ietf.org/html/rfc2616#section-4.2).
  
    var headersObject = {};
    var headersArray = this.getAllResponseHeaders().split('\r\n');
    for (var i = 0; i < headersArray.length; i++) {
      if (strings.isEmptyOrWhitespace(headersArray[i])) {
        continue;
      }
      var keyValue =
          strings.splitLimit(headersArray[i], ':', /* maxSplitCount= */ 1);
      var key = keyValue[0];
      var value = keyValue[1];
  
      if (typeof value !== 'string') {
        // There must be a value but it can be the empty string.
        continue;
      }
  
      // Whitespace at the start and end of the value is meaningless.
      value = value.trim();
      // The key should not contain whitespace but we currently ignore that.
  
      var values = headersObject[key] || [];
      headersObject[key] = values;
      values.push(value);
    }
  
    return goog_object.map(headersObject, function(values) {
      return values.join(', ');
    });
  };

  /**
   * Get the value of the response-header with the given name from the Xhr object.
   * As opposed to {@link #getResponseHeader}, this method does not require that
   * the request has completed.
   * @param {string} key The name of the response-header to retrieve.
   * @return {?string} The value of the response-header, or null if it is
   *     unavailable.
   */
  getStreamingResponseHeader(key) {
    return this.xhr_ ? this.xhr_.getResponseHeader(key) : null;
  };

  /**
   * Gets the text of all the headers in the response. As opposed to
   * {@link #getAllResponseHeaders}, this method does not require that the request
   * has completed.
   * @return {string} The value of the response headers or empty string.
   */
  getAllStreamingResponseHeaders() {
    return this.xhr_ ? this.xhr_.getAllResponseHeaders() : '';
  };

  /**
   * Get the last error message
   * @return {!ErrorCode} Last error code.
   */
  getLastErrorCode() {
    return this.lastErrorCode_;
  };

  /**
   * Get the last error message
   * @return {string} Last error message.
   */
  getLastError() {
    return typeof this.lastError_ === 'string' ? this.lastError_ :
                                                 String(this.lastError_);
  };

  /**
   * Adds the last method, status and URI to the message.  This is used to add
   * this information to the logging calls.
   * @param {string} msg The message text that we want to add the extra text to.
   * @return {string} The message with the extra text appended.
   * @private
   */
  formatMsg_(msg) {
    return msg + ' [' + this.lastMethod_ + ' ' + this.lastUri_ + ' ' +
        this.getStatus() + ']';
  };
}

/**
 * Response types that may be requested for XMLHttpRequests.
 * @enum {string}
 * @see http://www.w3.org/TR/XMLHttpRequest/#the-responsetype-attribute
 */
let ResponseType = {
  DEFAULT: '',
  TEXT: 'text',
  DOCUMENT: 'document',
  // Not supported as of Chrome 10.0.612.1 dev
  BLOB: 'blob',
  ARRAY_BUFFER: 'arraybuffer',
};

/**
 * The Content-Type HTTP header name
 * @type {string}
 */
XhrIo.CONTENT_TYPE_HEADER = 'Content-Type';

/**
 * The Content-Transfer-Encoding HTTP header name
 * @type {string}
 */
XhrIo.CONTENT_TRANSFER_ENCODING = 'Content-Transfer-Encoding';

/**
 * The pattern matching the 'http' and 'https' URI schemes
 * @type {!RegExp}
 */
XhrIo.HTTP_SCHEME_PATTERN = /^https?$/i;

/**
 * The methods that typically come along with form data.  We set different
 * headers depending on whether the HTTP action is one of these.
 * @type {!Array<string>}
 */
XhrIo.METHODS_WITH_FORM_DATA = ['POST', 'PUT'];

/**
 * The Content-Type HTTP header value for a url-encoded form
 * @type {string}
 */
XhrIo.FORM_CONTENT_TYPE =
    'application/x-www-form-urlencoded;charset=utf-8';

/**
 * The XMLHttpRequest Level two timeout delay ms property name.
 *
 * @see http://www.w3.org/TR/XMLHttpRequest/#the-timeout-attribute
 *
 * @private {string}
 * @const
 */
XhrIo.XHR2_TIMEOUT_ = 'timeout';

/**
 * The XMLHttpRequest Level two ontimeout handler property name.
 *
 * @see http://www.w3.org/TR/XMLHttpRequest/#the-timeout-attribute
 *
 * @private {string}
 * @const
 */
XhrIo.XHR2_ON_TIMEOUT_ = 'ontimeout';

/**
 * All non-disposed instances of XhrIo created
 * by {@link XhrIo.send} are in this Array.
 * @see XhrIo.cleanup
 * @private {!Array<!XhrIo>}
 */
XhrIo.sendInstances_ = [];

/**
 * Static send that creates a short lived instance of XhrIo to send the
 * request.
 * @see XhrIo.cleanup
 * @param {string|Goog_Uri} url Uri to make request to.
 * @param {?function(this:XhrIo, ?)=} opt_callback Callback function
 *     for when request is complete.
 * @param {string=} opt_method Send method, default: GET.
 * @param {ArrayBuffer|ArrayBufferView|Blob|Document|FormData|string=}
 *     opt_content Body data.
 * @param {Object|StructsMap=} opt_headers Map of headers to add to the
 *     request.
 * @param {number=} opt_timeoutInterval Number of milliseconds after which an
 *     incomplete request will be aborted; 0 means no timeout is set.
 * @param {boolean=} opt_withCredentials Whether to send credentials with the
 *     request. Default to false. See {@link XhrIo#setWithCredentials}.
 * @return {!XhrIo} The sent XhrIo.
 */
XhrIo.send = function(
    url, opt_callback, opt_method, opt_content, opt_headers,
    opt_timeoutInterval, opt_withCredentials) {
  var x = new XhrIo();
  XhrIo.sendInstances_.push(x);
  if (opt_callback) {
    x.listen(EventType.COMPLETE, opt_callback);
  }
  x.listenOnce(EventType.READY, x.cleanupSend_);
  if (opt_timeoutInterval) {
    x.setTimeoutInterval(opt_timeoutInterval);
  }
  if (opt_withCredentials) {
    x.setWithCredentials(opt_withCredentials);
  }
  x.send(url, opt_method, opt_content, opt_headers);
  return x;
};

/**
 * Disposes all non-disposed instances of XhrIo created by
 * {@link XhrIo.send}.
 * {@link XhrIo.send} cleans up the XhrIo instance
 * it creates when the request completes or fails.  However, if
 * the request never completes, then the XhrIo is not disposed.
 * This can occur if the window is unloaded before the request completes.
 * We could have {@link XhrIo.send} return the XhrIo
 * it creates and make the client of {@link XhrIo.send} be
 * responsible for disposing it in this case.  However, this makes things
 * significantly more complicated for the client, and the whole point
 * of {@link XhrIo.send} is that it's simple and easy to use.
 * Clients of {@link XhrIo.send} should call
 * {@link XhrIo.cleanup} when doing final
 * cleanup on window unload.
 */
XhrIo.cleanup = function() {
  var instances = XhrIo.sendInstances_;
  while (instances.length) {
    instances.pop().dispose();
  }
};

/**
 * Installs exception protection for all entry point introduced by
 * XhrIo instances which are not protected by
 * {@link ErrorHandler#protectWindowSetTimeout},
 * {@link ErrorHandler#protectWindowSetInterval}, or
 * {@link goog.events.protectBrowserEventEntryPoint}.
 *
 * @param {ErrorHandler} errorHandler Error handler with which to
 *     protect the entry point(s).
 */
XhrIo.protectEntryPoints = function(errorHandler) {
  XhrIo.prototype.onReadyStateChangeEntryPoint_ =
      errorHandler.protectEntryPoint(
          XhrIo.prototype.onReadyStateChangeEntryPoint_);
};

/**
 * Determines if the argument is an XMLHttpRequest that supports the level 2
 * timeout value and event.
 *
 * Currently, FF 21.0 OS X has the fields but won't actually call the timeout
 * handler.  Perhaps the confusion in the bug referenced below hasn't
 * entirely been resolved.
 *
 * @see http://www.w3.org/TR/XMLHttpRequest/#the-timeout-attribute
 * @see https://bugzilla.mozilla.org/show_bug.cgi?id=525816
 *
 * @param {!XhrLike.OrNative} xhr The request.
 * @return {boolean} True if the request supports level 2 timeout.
 * @private
 * @suppress {checkTypes}
 */
XhrIo.shouldUseXhr2Timeout_ = function(xhr) {
  return userAgent.IE && userAgent.isVersionOrHigher(9) &&
      typeof xhr[XhrIo.XHR2_TIMEOUT_] === 'number' &&
      xhr[XhrIo.XHR2_ON_TIMEOUT_] !== undefined;
};

/**
 * @param {string} header An HTTP header key.
 * @return {boolean} Whether the key is a content type header (ignoring
 *     case.
 * @private
 */
XhrIo.isContentTypeHeader_ = function(header) {
  return strings.caseInsensitiveEquals(
      XhrIo.CONTENT_TYPE_HEADER, header);
};

/**
 * Creates a representation of the native ProgressEvent. IE doesn't support
 * constructing ProgressEvent via "new", and the alternatives (e.g.,
 * ProgressEvent.initProgressEvent) are non-standard or deprecated.
 * @param {!ProgressEvent} e XHR progress event.
 * @param {!EventType} eventType The type of the event.
 * @return {!ProgressEvent} The progress event.
 * @private
 */
XhrIo.buildProgressEvent_ = function(e, eventType) {
  return /** @type {!ProgressEvent} */ ({
    type: eventType,
    lengthComputable: e.lengthComputable,
    loaded: e.loaded,
    total: e.total,
  });
};

// Register the xhr handler as an entry point, so that
// it can be monitored for exception handling, etc.
entryPointRegistry.register(
    /**
     * @param {function(!Function): !Function} transformer The transforming
     *     function.
     */
    function(transformer) {
      XhrIo.prototype.onReadyStateChangeEntryPoint_ =
          transformer(XhrIo.prototype.onReadyStateChangeEntryPoint_);
    });

export {ResponseType, XhrIo};