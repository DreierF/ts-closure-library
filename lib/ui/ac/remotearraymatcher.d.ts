/**
 * @fileoverview Class that retrieves autocomplete matches via an ajax call.
 */
/**
 * An array matcher that requests matches via ajax.
 *     search term is passed to the server as the 'token' query param.
 *     similarity matches for the input token against the dictionary.
 *     The value is sent to the server as the 'use_similar' query param which is
 *     either "1" (opt_noSimilar==false) or "0" (opt_noSimilar==true).
 * XmlHttpFactory used to retrieve the matches.
 * @extends {Disposable}
 */
export class RemoteArrayMatcher extends Disposable {
    /**
     * An array matcher that requests matches via ajax.
     * @param {string} url The Uri which generates the auto complete matches.  The
     *     search term is passed to the server as the 'token' query param.
     * @param {boolean=} opt_noSimilar If true, request that the server does not do
     *     similarity matches for the input token against the dictionary.
     *     The value is sent to the server as the 'use_similar' query param which is
     *     either "1" (opt_noSimilar==false) or "0" (opt_noSimilar==true).
     * XmlHttpFactory used to retrieve the matches.
     */
    constructor(url: string, opt_noSimilar?: boolean | undefined);
    /**
     * The HTTP send method (GET, POST) to use when making the ajax call.
     * @type {string}
     * @private
     */
    private method_;
    /**
     * Data to submit during a POST.
     * @type {string|undefined}
     * @private
     */
    private content_;
    /**
     * Headers to send with every HTTP request.
     * @type {?Object|?StructsMap}
     * @private
     */
    private headers_;
    /**
     * Key to the listener on XHR. Used to clear previous listeners.
     * @type {?Key}
     * @private
     */
    private lastListenerKey_;
    /**
     * The base URL for the ajax call.  The token and max_matches are added as
     * query params.
     * @type {string}
     * @private
     */
    private url_;
    /**
     * Whether similar matches should be found as well.  This is sent as a hint
     * to the server only.
     * @type {boolean}
     * @private
     */
    private useSimilar_;
    /**
     * Used for making remote requests.  When a new request
     * is made, the current one is aborted and the new one sent.
     * @type {!XMLHttpRequest}
     * @private
     */
    private xhr_;
    /**
     * Set the send method ("GET", "POST").
     * @param {string} method The send method; default: GET.
     */
    setMethod(method: string): void;
    /**
     * Set the post data.
     * @param {string} content Post data.
     */
    setContent(content: string): void;
    /**
     * Set the HTTP headers.
     * @param {Object|StructsMap} headers Map of headers to add to the
     *     request.
     */
    setHeaders(headers: any | StructsMap): void;
    /**
     * Set the timeout interval.
     * @param {number} interval Number of milliseconds after which an
     *     incomplete request will be aborted; 0 means no timeout is set.
     */
    setTimeoutInterval(interval: number): void;
    /**
     * Builds a complete GET-style URL, given the base URI and autocomplete related
     * parameter values.
     * <b>Override this to build any customized lookup URLs.</b>
     * <b>Can be used to change request method and any post content as well.</b>
     * @param {string} uri The base URI of the request target.
     * @param {string} token Current token in autocomplete.
     * @param {number} maxMatches Maximum number of matches required.
     * @param {boolean} useSimilar A hint to the server.
     * @param {string=} opt_fullString Complete text in the input element.
     * @return {?string} The complete url. Return null if no request should be sent.
     * @protected
     */
    protected buildUrl(uri: string, token: string, maxMatches: number, useSimilar: boolean, opt_fullString?: string | undefined): string | null;
    /**
     * Returns whether the suggestions should be updated?
     * <b>Override this to prevent updates eg - when token is empty.</b>
     * @param {string} uri The base URI of the request target.
     * @param {string} token Current token in autocomplete.
     * @param {number} maxMatches Maximum number of matches required.
     * @param {boolean} useSimilar A hint to the server.
     * @param {string=} opt_fullString Complete text in the input element.
     * @return {boolean} Whether new matches be requested.
     * @protected
     */
    protected shouldRequestMatches(uri: string, token: string, maxMatches: number, useSimilar: boolean, opt_fullString?: string | undefined): boolean;
    /**
     * Parses and retrieves the array of suggestions from XHR response.
     * <b>Override this if the response is not a simple JSON array.</b>
     * @param {string} responseText The XHR response text.
     * @return {Array<string>} The array of suggestions.
     * @protected
     */
    protected parseResponseText(responseText: string): Array<string>;
    /**
     * Handles the XHR response.
     * @param {string} token The XHR autocomplete token.
     * @param {?Function} matchHandler The AutoComplete match handler.
     * @param {?EventsEvent} event The XHR success event.
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    xhrCallback(token: string, matchHandler: Function | null, event: EventsEvent | null): void;
    /**
     * Retrieve a set of matching rows from the server via ajax.
     * @param {string} token The text that should be matched; passed to the server
     *     as the 'token' query param.
     * @param {number} maxMatches The maximum number of matches requested from the
     *     server; passed as the 'max_matches' query param.  The server is
     *     responsible for limiting the number of matches that are returned.
     * @param {?Function} matchHandler Callback to execute on the result after
     *     matching.
     * @param {string=} opt_fullString The full string from the input box.
     */
    requestMatchingRows(token: string, maxMatches: number, matchHandler: Function | null, opt_fullString?: string | undefined): void;
}
import { Disposable } from "../../disposable/disposable.js";
import { Map as StructsMap } from "../../structs/map.js";
import { Event as EventsEvent } from "../../events/event.js";
