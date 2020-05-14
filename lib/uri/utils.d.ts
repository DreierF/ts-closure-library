/**
 * The index of each URI component in the return value of split.
 */
export type ComponentIndex = number;
/**
 * An array representing a set of query parameters with alternating keys
 * and values.
 *
 * Keys are assumed to be URI encoded already and live at even indices.  See
 * QueryValue for details on how parameter values are encoded.
 *
 * Example:
 * <pre>
 * var data = [
 *    // Simple param: ?name=BobBarker
 *    'name', 'BobBarker',
 *    // Conditional param -- may be omitted entirely.
 *    'specialDietaryNeeds', hasDietaryNeeds() ? getDietaryNeeds() : null,
 *    // Multi-valued param: &house=LosAngeles&house=NewYork&house=null
 *    'house', ['LosAngeles', 'NewYork', null]
 * ];
 * </pre>
 */
export type QueryArray = any[];
/**
 * Supported query parameter values by the parameter serializing utilities.
 *
 * If a value is null or undefined, the key-value pair is skipped, as an easy
 * way to omit parameters conditionally.  Non-array parameters are converted
 * to a string and URI encoded.  Array values are expanded into multiple
 * &key=value pairs, with each element stringized and URI-encoded.
 */
export type QueryValue = any;
/**
 * Standard supported query parameters.
 */
export type StandardQueryParam = string;
/**
 * *
 */
export type CharCode_ = number;
export namespace ComponentIndex {
    export const SCHEME: number;
    export const USER_INFO: number;
    export const DOMAIN: number;
    export const PORT: number;
    export const PATH: number;
    export const QUERY_DATA: number;
    export const FRAGMENT: number;
}
/**
 * An array representing a set of query parameters with alternating keys
 * and values.
 *
 * Keys are assumed to be URI encoded already and live at even indices.  See
 * QueryValue for details on how parameter values are encoded.
 *
 * Example:
 * <pre>
 * var data = [
 *   // Simple param: ?name=BobBarker
 *   'name', 'BobBarker',
 *   // Conditional param -- may be omitted entirely.
 *   'specialDietaryNeeds', hasDietaryNeeds() ? getDietaryNeeds() : null,
 *   // Multi-valued param: &house=LosAngeles&house=NewYork&house=null
 *   'house', ['LosAngeles', 'NewYork', null]
 * ];
 * </pre>
 *
 * @typedef {!Array<string|QueryValue>}
 */
export let QueryArray: any;
/**
 * Supported query parameter values by the parameter serializing utilities.
 *
 * If a value is null or undefined, the key-value pair is skipped, as an easy
 * way to omit parameters conditionally.  Non-array parameters are converted
 * to a string and URI encoded.  Array values are expanded into multiple
 * &key=value pairs, with each element stringized and URI-encoded.
 *
 * @typedef {*}
 */
export let QueryValue: any;
export namespace StandardQueryParam {
    export const RANDOM: string;
}
/**
 * Appends a single URI parameter.
 *
 * Repeated calls to this can exhibit quadratic behavior in IE6 due to the
 * way string append works, though it should be limited given the 2kb limit.
 *
 * @param {string} uri The original URI, which may already have query data.
 * @param {string} key The key, which must already be URI encoded.
 * @param {*=} opt_value The value, which will be stringized and encoded
 *     (assumed not already to be encoded).  If omitted, undefined, or null, the
 *     key will be added as a valueless parameter.
 * @return {string} The URI with the query parameter added.
 */
export function appendParam(uri: string, key: string, opt_value?: any | undefined): string;
/**
 * Appends URI parameters to an existing URI.
 *
 * The variable arguments may contain alternating keys and values.  Keys are
 * assumed to be already URI encoded.  The values should not be URI-encoded,
 * and will instead be encoded by this function.
 * <pre>
 * appendParams('http://www.foo.com?existing=true',
 *     'key1', 'value1',
 *     'key2', 'value?willBeEncoded',
 *     'key3', ['valueA', 'valueB', 'valueC'],
 *     'key4', null);
 * result: 'http://www.foo.com?existing=true&' +
 *     'key1=value1&' +
 *     'key2=value%3FwillBeEncoded&' +
 *     'key3=valueA&key3=valueB&key3=valueC'
 * </pre>
 *
 * A single call to this function will not exhibit quadratic behavior in IE,
 * whereas multiple repeated calls may, although the effect is limited by
 * fact that URL's generally can't exceed 2kb.
 *
 * @param {string} uri The original URI, which may already have query data.
 * @param {...(QueryArray|QueryValue)}
 * var_args
 *     An array or argument list conforming to QueryArray.
 * @return {string} The URI with all query parameters added.
 */
export function appendParams(uri: string, ...args: any[]): string;
/**
 * Appends query parameters from a map.
 *
 * @param {string} uri The original URI, which may already have query data.
 * @param {!Object<QueryValue>} map An object where keys are
 *     URI-encoded parameter keys, and the values are arbitrary types or arrays.
 *     Keys with a null value are dropped.
 * @return {string} The new parameters.
 */
export function appendParamsFromMap(uri: string, map: any): string;
/**
 * Generates a URI path using a given URI and a path with checks to
 * prevent consecutive "//". The baseUri passed in must not contain
 * query or fragment identifiers. The path to append may not contain query or
 * fragment identifiers.
 *
 * @param {string} baseUri URI to use as the base.
 * @param {string} path Path to append.
 * @return {string} Updated URI.
 */
export function appendPath(baseUri: string, path: string): string;
/**
 * Builds a URI string from already-encoded parts.
 *
 * No encoding is performed.  Any component may be omitted as either null or
 * undefined.
 *
 * @param {?string=} opt_scheme The scheme such as 'http'.
 * @param {?string=} opt_userInfo The user name before the '@'.
 * @param {?string=} opt_domain The domain such as 'www.google.com', already
 *     URI-encoded.
 * @param {(string|number|null)=} opt_port The port number.
 * @param {?string=} opt_path The path, already URI-encoded.  If it is not
 *     empty, it must begin with a slash.
 * @param {?string=} opt_queryData The URI-encoded query data.
 * @param {?string=} opt_fragment The URI-encoded fragment identifier.
 * @return {string} The fully combined URI.
 */
export function buildFromEncodedParts(opt_scheme?: (string | null) | undefined, opt_userInfo?: (string | null) | undefined, opt_domain?: (string | null) | undefined, opt_port?: (string | number | null) | undefined, opt_path?: (string | null) | undefined, opt_queryData?: (string | null) | undefined, opt_fragment?: (string | null) | undefined): string;
/**
 * Builds a query data string from a sequence of alternating keys and values.
 * Currently generates "&key&" for empty args.
 *
 * @param {!ArrayLike<string|QueryValue>} keysAndValues
 *     Alternating keys and values. See the QueryArray typedef.
 * @param {number=} opt_startIndex A start offset into the arary, defaults to 0.
 * @return {string} The encoded query string, in the form 'a=1&b=2'.
 */
export function buildQueryData(keysAndValues: ArrayLike<string | QueryValue>, opt_startIndex?: number | undefined): string;
/**
 * Builds a query data string from a map.
 * Currently generates "&key&" for empty args.
 *
 * @param {!Object<string, QueryValue>} map An object where keys
 *     are URI-encoded parameter keys, and the values are arbitrary types
 *     or arrays. Keys with a null value are dropped.
 * @return {string} The encoded query string, in the form 'a=1&b=2'.
 */
export function buildQueryDataFromMap(map: {
    [x: string]: QueryValue;
}): string;
/**
 * @param {string} uri The URI to examine.
 * @return {?string} The decoded domain, or null if none.
 */
export function getDomain(uri: string): string | null;
/**
 * @param {string} uri The URI to examine.
 * @return {?string} The domain name still encoded, or null if none.
 */
export function getDomainEncoded(uri: string): string | null;
/**
 * Gets the effective scheme for the URL.  If the URL is relative then the
 * scheme is derived from the page's location.
 * @param {string} uri The URI to examine.
 * @return {string} The protocol or scheme, always lower case.
 */
export function getEffectiveScheme(uri: string): string;
/**
 * @param {string} uri The URI to examine.
 * @return {?string} The decoded fragment identifier, or null if none.  Does
 *     not include the hash mark.
 */
export function getFragment(uri: string): string | null;
/**
 * @param {string} uri The URI to examine.
 * @return {?string} The fragment identifier, or null if none.  Does not
 *     include the hash mark itself.
 */
export function getFragmentEncoded(uri: string): string | null;
/**
 * Extracts everything up to the port of the URI.
 * @param {string} uri The URI string.
 * @return {string} Everything up to and including the port.
 */
export function getHost(uri: string): string;
/**
 * Returns the origin for a given URL.
 * @param {string} uri The URI string.
 * @return {string} Everything up to and including the port.
 */
export function getOrigin(uri: string): string;
/**
 * Gets the first value of a query parameter.
 * @param {string} uri The URI to process.  May contain a fragment.
 * @param {string} keyEncoded The URI-encoded key.  Case-sensitive.
 * @return {?string} The first value of the parameter (URI-decoded), or null
 *     if the parameter is not found.
 */
export function getParamValue(uri: string, keyEncoded: string): string | null;
/**
 * Gets all values of a query parameter.
 * @param {string} uri The URI to process.  May contain a fragment.
 * @param {string} keyEncoded The URI-encoded key.  Case-sensitive.
 * @return {!Array<string>} All URI-decoded values with the given key.
 *     If the key is not found, this will have length 0, but never be null.
 */
export function getParamValues(uri: string, keyEncoded: string): Array<string>;
/**
 * @param {string} uri The URI to examine.
 * @return {?string} The decoded path, or null if none.  Includes the leading
 *     slash, if any.
 */
export function getPath(uri: string): string | null;
/**
 * Extracts the path of the URL and everything after.
 * @param {string} uri The URI string.
 * @return {string} The URI, starting at the path and including the query
 *     parameters and fragment identifier.
 */
export function getPathAndAfter(uri: string): string;
/**
 * @param {string} uri The URI to examine.
 * @return {?string} The path still encoded, or null if none. Includes the
 *     leading slash, if any.
 */
export function getPathEncoded(uri: string): string | null;
/**
 * @param {string} uri The URI to examine.
 * @return {?number} The port number, or null if none.
 */
export function getPort(uri: string): number | null;
/**
 * @param {string} uri The URI to examine.
 * @return {?string} The query data still encoded, or null if none.  Does not
 *     include the question mark itself.
 */
export function getQueryData(uri: string): string | null;
/**
 * @param {string} uri The URI to examine.
 * @return {?string} The protocol or scheme, or null if none.  Does not
 *     include trailing colons or slashes.
 */
export function getScheme(uri: string): string | null;
/**
 * @param {string} uri The URI to examine.
 * @return {?string} The decoded user info, or null if none.
 */
export function getUserInfo(uri: string): string | null;
/**
 * @param {string} uri The URI to examine.
 * @return {?string} The user name still encoded, or null if none.
 */
export function getUserInfoEncoded(uri: string): string | null;
/**
 * Determines if the URI contains a specific key.
 *
 * Performs no object instantiations.
 *
 * @param {string} uri The URI to process.  May contain a fragment
 *     identifier.
 * @param {string} keyEncoded The URI-encoded key.  Case-sensitive.
 * @return {boolean} Whether the key is present.
 */
export function hasParam(uri: string, keyEncoded: string): boolean;
/**
 * Ensures that two URI's have the exact same domain, scheme, and port.
 *
 * Unlike the version in google.Uri, this checks protocol, and therefore is
 * suitable for checking against the browser's same-origin policy.
 *
 * @param {string} uri1 The first URI.
 * @param {string} uri2 The second URI.
 * @return {boolean} Whether they have the same scheme, domain and port.
 */
export function haveSameDomain(uri1: string, uri2: string): boolean;
/**
 * Sets the zx parameter of a URI to a random value.
 * @param {string} uri Any URI.
 * @return {string} That URI with the "zx" parameter added or replaced to
 *     contain a random string.
 */
export function makeUnique(uri: string): string;
/**
 * Parses encoded query parameters and calls callback function for every
 * parameter found in the string.
 *
 * Missing value of parameter (e.g. “…&key&…”) is treated as if the value was an
 * empty string.  Keys may be empty strings (e.g. “…&=value&…”) which also means
 * that “…&=&…” and “…&&…” will result in an empty key and value.
 *
 * @param {string} encodedQuery Encoded query string excluding question mark at
 *     the beginning.
 * @param {function(string, string)} callback Function called for every
 *     parameter found in query string.  The first argument (name) will not be
 *     urldecoded (so the function is consistent with buildQueryData), but the
 *     second will.  If the parameter has no value (i.e. “=” was not present)
 *     the second argument (value) will be an empty string.
 */
export function parseQueryData(encodedQuery: string, callback: (arg0: string, arg1: string) => void): void;
/**
 * Gets the URI with the fragment identifier removed.
 * @param {string} uri The URI to examine.
 * @return {string} Everything preceding the hash mark.
 */
export function removeFragment(uri: string): string;
/**
 * Removes all instances of a query parameter.
 * @param {string} uri The URI to process.  Must not contain a fragment.
 * @param {string} keyEncoded The URI-encoded key.
 * @return {string} The URI with all instances of the parameter removed.
 */
export function removeParam(uri: string, keyEncoded: string): string;
/**
 * @param {string} uri The URI to examine.
 * @param {?string} fragment The encoded fragment identifier, or null if none.
 *     Does not include the hash mark itself.
 * @return {string} The URI with the fragment set.
 */
export function setFragmentEncoded(uri: string, fragment: string | null): string;
/**
 * Replaces all existing definitions of a parameter with a single definition.
 *
 * Repeated calls to this can exhibit quadratic behavior due to the need to
 * find existing instances and reconstruct the string, though it should be
 * limited given the 2kb limit.  Consider using appendParams or setParamsFromMap
 * to update multiple parameters in bulk.
 *
 * @param {string} uri The original URI, which may already have query data.
 * @param {string} keyEncoded The key, which must already be URI encoded.
 * @param {*} value The value, which will be stringized and encoded (assumed
 *     not already to be encoded).
 * @return {string} The URI with the query parameter added.
 */
export function setParam(uri: string, keyEncoded: string, value: any): string;
/**
 * Effeciently set or remove multiple query parameters in a URI. Order of
 * unchanged parameters will not be modified, all updated parameters will be
 * appended to the end of the query. Params with values of null or undefined are
 * removed.
 *
 * @param {string} uri The URI to process.
 * @param {!Object<string, QueryValue>} params A list of
 *     parameters to update. If null or undefined, the param will be removed.
 * @return {string} An updated URI where the query data has been updated with
 *     the params.
 */
export function setParamsFromMap(uri: string, params: {
    [x: string]: QueryValue;
}): string;
/**
 * Replaces the path.
 * @param {string} uri URI to use as the base.
 * @param {string} path New path.
 * @return {string} Updated URI.
 */
export function setPath(uri: string, path: string): string;
/**
 * Splits a URI into its component parts.
 *
 * Each component can be accessed via the component indices; for example:
 * <pre>
 * split(someStr)[ComponentIndex.QUERY_DATA];
 * </pre>
 *
 * @param {string} uri The URI string to examine.
 * @return {!Array<string|undefined>} Each component still URI-encoded.
 *     Each component that is present will contain the encoded value, whereas
 *     components that are not present will be undefined or empty, depending
 *     on the browser's regular expression implementation.  Never null, since
 *     arbitrary strings may still look like path names.
 */
export function split(uri: string): Array<string | undefined>;
