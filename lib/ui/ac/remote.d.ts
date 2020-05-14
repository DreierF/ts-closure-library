/**
 * @fileoverview Factory class to create a simple autocomplete that will match
 * from an array of data provided via ajax.
 *
 * @see ../../demos/autocompleteremote.html
 */
/**
 * Factory class for building a remote autocomplete widget that autocompletes
 * an inputbox or text area from a data array provided via ajax.
 *     to false.
 *     "gost" => "ghost".
 * @extends {AutoComplete}
 */
export class Remote extends AutoComplete {
    /**
     * Factory class for building a remote autocomplete widget that autocompletes
     * an inputbox or text area from a data array provided via ajax.
     * @param {string} url The Uri which generates the auto complete matches.
     * @param {?Element} input Input element or text area.
     * @param {boolean=} opt_multi Whether to allow multiple entries; defaults
     *     to false.
     * @param {boolean=} opt_useSimilar Whether to use similar matches; e.g.
     *     "gost" => "ghost".
     * @param {RemoteArrayMatcher=} opt_matcher
     */
    constructor(url: string, input: Element | null, opt_multi?: boolean | undefined, opt_useSimilar?: boolean | undefined, opt_matcher?: RemoteArrayMatcher | undefined);
    /**
     * Set whether or not standard highlighting should be used when rendering rows.
     * @param {boolean} useStandardHighlighting true if standard highlighting used.
     */
    setUseStandardHighlighting(useStandardHighlighting: boolean): void;
    /**
     * Gets the attached InputHandler object.
     * @return {?InputHandler} The input handler.
     */
    getInputHandler(): InputHandler | null;
    /**
     * Set the send method ("GET", "POST") for the matcher.
     * @param {string} method The send method; default: GET.
     */
    setMethod(method: string): void;
    /**
     * Set the post data for the matcher.
     * @param {string} content Post data.
     */
    setContent(content: string): void;
    /**
     * Set the HTTP headers for the matcher.
     * @param {Object|StructsMap} headers Map of headers to add to the
     *     request.
     */
    setHeaders(headers: any | StructsMap): void;
    /**
     * Set the timeout interval for the matcher.
     * @param {number} interval Number of milliseconds after which an
     *     incomplete request will be aborted; 0 means no timeout is set.
     */
    setTimeoutInterval(interval: number): void;
}
import { AutoComplete } from "./autocomplete.js";
import { InputHandler } from "./inputhandler.js";
import { Map as StructsMap } from "../../structs/map.js";
import { RemoteArrayMatcher } from "./remotearraymatcher.js";
