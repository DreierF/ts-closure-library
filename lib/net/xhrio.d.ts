/**
 * Response types that may be requested for XMLHttpRequests.
 */
export type ResponseType = string;
export namespace ResponseType {
    export const DEFAULT: string;
    export const TEXT: string;
    export const DOCUMENT: string;
    export const BLOB: string;
    export const ARRAY_BUFFER: string;
}
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
export class XhrIo extends EventsEventTarget {
    /**
     * Basic class for handling XMLHttpRequests.
     * @param {NetXmlHttpFactory=} opt_xmlHttpFactory Factory to use when
     *     creating XMLHttpRequest objects.
     * @suppress {checkTypes} JSC_IN_USED_WITH_STRUCT: Cannot use the IN operator with structs on this.xhr_
     */
    constructor(opt_xmlHttpFactory?: NetXmlHttpFactory);
    /**
     * A reference to the XhrIo logger
     * @private
      * @type {?LogLogger}
     * @const
     */
    logger_: DebugLogger | null;
    /**
     * Map of default headers to add to every request, use:
     * XhrIo.headers.set(name, value)
     * @type {!StructsMap}
     */
    headers: StructsMap<string, string>;
    /**
     * Optional XmlHttpFactory
     * @private {NetXmlHttpFactory}
     */
    xmlHttpFactory_: NetXmlHttpFactory;
    /**
     * Whether XMLHttpRequest is active.  A request is active from the time send()
     * is called until onReadyStateChange() is complete, or error() or abort()
     * is called.
     * @private {boolean}
     */
    active_: boolean;
    /**
     * The XMLHttpRequest object that is being used for the transfer.
     * @private {?XhrLike.OrNative}
     */
    xhr_: XMLHttpRequest | XhrLike;
    /**
     * The options to use with the current XMLHttpRequest object.
     * @private {?Object}
     */
    xhrOptions_: any;
    /**
     * Last URL that was requested.
     * @private {string|Goog_Uri}
     */
    lastUri_: string;
    /**
     * Method for the last request.
     * @private {string}
     */
    lastMethod_: string;
    /**
     * Last error code.
     * @private {!ErrorCode}
     */
    lastErrorCode_: number;
    /**
     * Last error message.
     * @private {Error|string}
     */
    lastError_: string;
    /**
     * Used to ensure that we don't dispatch an multiple ERROR events. This can
     * happen in IE when it does a synchronous load and one error is handled in
     * the ready statte change and one is handled due to send() throwing an
     * exception.
     * @private {boolean}
     */
    errorDispatched_: boolean;
    /**
     * Used to make sure we don't fire the complete event from inside a send call.
     * @private {boolean}
     */
    inSend_: boolean;
    /**
     * Used in determining if a call to {@link #onReadyStateChange_} is from
     * within a call to this.xhr_.open.
     * @private {boolean}
     */
    inOpen_: boolean;
    /**
     * Used in determining if a call to {@link #onReadyStateChange_} is from
     * within a call to this.xhr_.abort.
     * @private {boolean}
     */
    inAbort_: boolean;
    /**
     * Number of milliseconds after which an incomplete request will be aborted
     * and a {@link EventType.TIMEOUT} event raised; 0 means no timeout
     * is set.
     * @private {number}
     */
    timeoutInterval_: number;
    /**
     * Timer to track request timeout.
     * @private {?number}
     */
    timeoutId_: number;
    /**
     * The requested type for the response. The empty string means use the default
     * XHR behavior.
     * @private {ResponseType}
     */
    responseType_: string;
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
    withCredentials_: boolean;
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
    progressEventsEnabled_: boolean;
    /**
     * True if we can use XMLHttpRequest's timeout directly.
     * @private {boolean}
     */
    useXhr2Timeout_: boolean;
    /**
     * Disposes of the specified XhrIo created by
     * {@link XhrIo.send} and removes it from
     * {@link XhrIo.pendingStaticSendInstances_}.
     * @private
     */
    cleanupSend_(): void;
    /**
     * Returns the number of milliseconds after which an incomplete request will be
     * aborted, or 0 if no timeout is set.
     * @return {number} Timeout interval in milliseconds.
     */
    getTimeoutInterval(): number;
    /**
     * Sets the number of milliseconds after which an incomplete request will be
     * aborted and a {@link EventType.TIMEOUT} event raised; 0 means no
     * timeout is set.
     * @param {number} ms Timeout interval in milliseconds; 0 means none.
     */
    setTimeoutInterval(ms: number): void;
    /**
     * Sets the desired type for the response. At time of writing, this is only
     * supported in very recent versions of WebKit (10.0.612.1 dev and later).
     *
     * If this is used, the response may only be accessed via {@link #getResponse}.
     *
     * @param {?ResponseType} type The desired type for the response.
     */
    setResponseType(type: string): void;
    /**
     * Gets the desired type for the response.
     * @return {?ResponseType} The desired type for the response.
     */
    getResponseType(): string;
    /**
     * Sets whether a "credentialed" request that is aware of cookie and
     * authentication information should be made. This option is only supported by
     * browsers that support HTTP Access Control. As of this writing, this option
     * is not supported in IE.
     *
     * @param {boolean} withCredentials Whether this should be a "credentialed"
     *     request.
     */
    setWithCredentials(withCredentials: boolean): void;
    /**
     * Gets whether a "credentialed" request is to be sent.
     * @return {boolean} The desired type for the response.
     */
    getWithCredentials(): boolean;
    /**
     * Sets whether progress events are enabled for this request. Note
     * that progress events require pre-flight OPTIONS request handling
     * for CORS requests, and may cause trouble with older browsers. See
     * progressEventsEnabled_ for details.
     * @param {boolean} enabled Whether progress events should be enabled.
     */
    setProgressEventsEnabled(enabled: boolean): void;
    /**
     * Gets whether progress events are enabled.
     * @return {boolean} Whether progress events are enabled for this request.
     */
    getProgressEventsEnabled(): boolean;
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
    send(url: string | Goog_Uri, opt_method?: string, opt_content?: string | ArrayBuffer | ArrayBufferView | Blob | FormData | Document, opt_headers?: any): void;
    /**
     * Creates a new XHR object.
     * @return {!XhrLike.OrNative} The newly created XHR object.
     * @protected
     */
    createXhr(): XMLHttpRequest | XhrLike;
    /**
     * The request didn't complete after {@link XhrIo#timeoutInterval_}
     * milliseconds; raises a {@link EventType.TIMEOUT} event and aborts
     * the request.
     * @private
     */
    timeout_(): void;
    /**
     * Something errorred, so inactivate, fire error callback and clean up
     * @param {?ErrorCode} errorCode The error code.
     * @param {?Error} err The error object.
     * @private
     */
    error_(errorCode: {
        NO_ERROR: number;
        ACCESS_DENIED: number;
        FILE_NOT_FOUND: number;
        FF_SILENT_ERROR: number;
        CUSTOM_ERROR: number;
        EXCEPTION: number;
        HTTP_ERROR: number;
        ABORT: number;
        TIMEOUT: number;
        OFFLINE: number;
    }, err: Error): void;
    /**
     * Dispatches COMPLETE and ERROR in case of an error. This ensures that we do
     * not dispatch multiple error events.
     * @private
     */
    dispatchErrors_(): void;
    /**
     * Abort the current XMLHttpRequest
     * @param {ErrorCode=} opt_failureCode Optional error code to use -
     *     defaults to ABORT.
     */
    abort(opt_failureCode?: {
        NO_ERROR: number;
        ACCESS_DENIED: number;
        FILE_NOT_FOUND: number;
        FF_SILENT_ERROR: number;
        CUSTOM_ERROR: number;
        EXCEPTION: number;
        HTTP_ERROR: number;
        ABORT: number;
        TIMEOUT: number;
        OFFLINE: number;
    }): void;
    /**
     * Internal handler for the XHR object's readystatechange event.  This method
     * checks the status and the readystate and fires the correct callbacks.
     * If the request has ended, the handlers are cleaned up and the XHR object is
     * nullified.
     * @private
     */
    onReadyStateChange_(): void;
    /**
     * Used to protect the onreadystatechange handler entry point.  Necessary
     * as {#onReadyStateChange_} maybe called from within send or abort, this
     * method is only called when {#onReadyStateChange_} is called as an
     * entry point.
     * {@see #protectEntryPoints}
     * @private
     */
    onReadyStateChangeEntryPoint_(): void;
    /**
     * Helper for {@link #onReadyStateChange_}.  This is used so that
     * entry point calls to {@link #onReadyStateChange_} can be routed through
     * {@link #onReadyStateChangeEntryPoint_}.
     * @private
     */
    onReadyStateChangeHelper_(): void;
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
    onProgressHandler_(e: ProgressEvent<EventTarget>, opt_isDownload?: boolean): void;
    /**
     * Remove the listener to protect against leaks, and nullify the XMLHttpRequest
     * object.
     * @param {boolean=} opt_fromDispose If this is from the dispose (don't want to
     *     fire any events).
     * @private
     */
    cleanUpXhr_(opt_fromDispose?: boolean): void;
    /**
     * Make sure the timeout timer isn't running.
     * @private
     */
    cleanUpTimeoutTimer_(): void;
    /**
     * @return {boolean} Whether there is an active request.
     */
    isActive(): boolean;
    /**
     * @return {boolean} Whether the request has completed.
     */
    isComplete(): boolean;
    /**
     * @return {boolean} Whether the request completed with a success.
     */
    isSuccess(): boolean;
    /**
     * @return {boolean} whether the effective scheme of the last URI that was
     *     fetched was 'http' or 'https'.
     * @private
     */
    isLastUriEffectiveSchemeHttp_(): boolean;
    /**
     * Get the readystate from the Xhr object
     * Will only return correct result when called from the context of a callback
     * @return {?ReadyState} ReadyState.*.
     */
    getReadyState(): number;
    /**
     * Get the status from the Xhr object
     * Will only return correct result when called from the context of a callback
     * @return {number} Http status.
     */
    getStatus(): number;
    /**
     * Get the status text from the Xhr object
     * Will only return correct result when called from the context of a callback
     * @return {string} Status text.
     */
    getStatusText(): string;
    /**
     * Get the last Uri that was requested
     * @return {string} Last Uri.
     */
    getLastUri(): string;
    /**
     * Get the response text from the Xhr object
     * Will only return correct result when called from the context of a callback.
     * @return {string} Result from the server, or '' if no result available.
     */
    getResponseText(): string;
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
     * @return {?Object} Binary result from the server or null if not available.
     */
    getResponseBody(): any;
    /**
     * Get the response XML from the Xhr object
     * Will only return correct result when called from the context of a callback.
     * @return {?Document} The DOM Document representing the XML file, or null
     * if no result available.
     */
    getResponseXml(): Document;
    /**
     * Get the response and evaluates it as JSON from the Xhr object
     * Will only return correct result when called from the context of a callback
     * @param {string=} opt_xssiPrefix Optional XSSI prefix string to use for
     *     stripping of the response before parsing. This needs to be set only if
     *     your backend server prepends the same prefix string to the JSON response.
     * @throws Error if the response text is invalid JSON.
     * @return {Object|undefined} JavaScript object.
     */
    getResponseJson(opt_xssiPrefix?: string): any;
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
    getResponse(): any;
    /**
     * Get the value of the response-header with the given name from the Xhr object
     * Will only return correct result when called from the context of a callback
     * and the request has completed
     * @param {string} key The name of the response-header to retrieve.
     * @return {string|undefined} The value of the response-header named key.
     */
    getResponseHeader(key: string): string;
    /**
     * Gets the text of all the headers in the response.
     * Will only return correct result when called from the context of a callback
     * and the request has completed.
     * @return {string} The value of the response headers or empty string.
     */
    getAllResponseHeaders(): string;
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
    getResponseHeaders(): {
        [x: string]: string;
    };
    /**
     * Get the value of the response-header with the given name from the Xhr object.
     * As opposed to {@link #getResponseHeader}, this method does not require that
     * the request has completed.
     * @param {string} key The name of the response-header to retrieve.
     * @return {?string} The value of the response-header, or null if it is
     *     unavailable.
     */
    getStreamingResponseHeader(key: string): string;
    /**
     * Gets the text of all the headers in the response. As opposed to
     * {@link #getAllResponseHeaders}, this method does not require that the request
     * has completed.
     * @return {string} The value of the response headers or empty string.
     */
    getAllStreamingResponseHeaders(): string;
    /**
     * Get the last error message
     * @return {!ErrorCode} Last error code.
     */
    getLastErrorCode(): {
        NO_ERROR: number;
        ACCESS_DENIED: number;
        FILE_NOT_FOUND: number;
        FF_SILENT_ERROR: number;
        CUSTOM_ERROR: number;
        EXCEPTION: number;
        HTTP_ERROR: number;
        ABORT: number;
        TIMEOUT: number;
        OFFLINE: number;
    };
    /**
     * Get the last error message
     * @return {string} Last error message.
     */
    getLastError(): string;
    /**
     * Adds the last method, status and URI to the message.  This is used to add
     * this information to the logging calls.
     * @param {string} msg The message text that we want to add the extra text to.
     * @return {string} The message with the extra text appended.
     * @private
     */
    formatMsg_(msg: string): string;
    actualEventTarget_: XhrIo;
}
export namespace XhrIo {
    export const CONTENT_TYPE_HEADER: string;
    export const CONTENT_TRANSFER_ENCODING: string;
    export const HTTP_SCHEME_PATTERN: RegExp;
    export const METHODS_WITH_FORM_DATA: Array<string>;
    export const FORM_CONTENT_TYPE: string;
    export const XHR2_TIMEOUT_: string;
    export const XHR2_ON_TIMEOUT_: string;
    export const sendInstances_: any[];
}
import { EventTarget as EventsEventTarget } from "../events/eventhandler.js";
import { Logger as LogLogger } from "../log/log.js";
import { Map as StructsMap } from "../structs/map.js";
import { XmlHttpFactory as NetXmlHttpFactory } from "./xmlhttpfactory.js";
import { XhrLike } from "./xhrlike.js";
import { Uri as Goog_Uri } from "../uri/uri.js";
import {Logger as DebugLogger} from "../debug/logger";

