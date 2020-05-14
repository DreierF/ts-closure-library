/**
 * Class used to represent URI query parameters.  It is essentially a hash of
 * name-value pairs, though a name can be present more than once.
 *
 * Has the same interface as the collections in structs.
 *
 *     the object.
 *     cache invalidated when this object updates. Deprecated -- this
 *     is no longer required.
 *     name in #get.
 * @class
 * @final
 */
export class QueryData {
    /**
     * Creates a new query data instance from a map of names and values.
     *
     * @param {!StructsMap<string, ?>|!Object} map Map of string parameter
     *     names to parameter value. If parameter value is an array, it is
     *     treated as if the key maps to each individual value in the
     *     array.
     * @param {Uri=} opt_uri URI object that should have its cache
     *     invalidated when this object updates.
     * @param {boolean=} opt_ignoreCase If true, ignore the case of the parameter
     *     name in #get.
     * @return {!QueryData} The populated query data instance.
     */
    static createFromMap(map: StructsMap<string, unknown> | any, opt_uri?: Uri | undefined, opt_ignoreCase?: boolean | undefined): QueryData;
    /**
     * Creates a new query data instance from parallel arrays of parameter names
     * and values. Allows for duplicate parameter names. Throws an error if the
     * lengths of the arrays differ.
     *
     * @param {!Array<string>} keys Parameter names.
     * @param {!Array<?>} values Parameter values.
     * @param {Uri=} opt_uri URI object that should have its cache
     *     invalidated when this object updates.
     * @param {boolean=} opt_ignoreCase If true, ignore the case of the parameter
     *     name in #get.
     * @return {!QueryData} The populated query data instance.
     */
    static createFromKeysValues(keys: Array<string>, values: Array<unknown>, opt_uri?: Uri | undefined, opt_ignoreCase?: boolean | undefined): QueryData;
    /**
     * Class used to represent URI query parameters.  It is essentially a hash of
     * name-value pairs, though a name can be present more than once.
     *
     * Has the same interface as the collections in structs.
     *
     * @param {?string=} opt_query Optional encoded query string to parse into
     *     the object.
     * @param {Uri=} opt_uri Optional uri object that should have its
     *     cache invalidated when this object updates. Deprecated -- this
     *     is no longer required.
     * @param {boolean=} opt_ignoreCase If true, ignore the case of the parameter
     *     name in #get.
     */
    constructor(opt_query?: (string | null) | undefined, opt_uri?: Uri | undefined, opt_ignoreCase?: boolean | undefined);
    /**
     * The map containing name/value or name/array-of-values pairs.
     * May be null if it requires parsing from the query string.
     *
     * We need to use a Map because we cannot guarantee that the key names will
     * not be problematic for IE.
     *
     * @private {?StructsMap<string, !Array<*>>}
     */
    private keyMap_;
    /**
     * The number of params, or null if it requires computing.
     * @private {?number}
     */
    private count_;
    /**
     * Encoded query string, or null if it requires computing from the key map.
     * @private {?string}
     */
    private encodedQuery_;
    /**
     * If true, ignore the case of the parameter name in #get.
     * @private {boolean}
     */
    private ignoreCase_;
    /**
     * If the underlying key map is not yet initialized, it parses the
     * query string and fills the map with parsed data.
     * @private
     */
    private ensureKeyMapInitialized_;
    /**
     * @return {?number} The number of parameters.
     */
    getCount(): number | null;
    /**
     * Adds a key value pair.
     * @param {string} key Name.
     * @param {*} value Value.
     * @return {!QueryData} Instance of this object.
     */
    add(key: string, value: any): QueryData;
    /**
     * Removes all the params with the given key.
     * @param {string} key Name.
     * @return {boolean} Whether any parameter was removed.
     */
    remove(key: string): boolean;
    /**
     * Clears the parameters.
     */
    clear(): void;
    /**
     * @return {boolean} Whether we have any parameters.
     */
    isEmpty(): boolean;
    /**
     * Whether there is a parameter with the given name
     * @param {string} key The parameter name to check for.
     * @return {boolean} Whether there is a parameter with the given name.
     */
    containsKey(key: string): boolean;
    /**
     * Whether there is a parameter with the given value.
     * @param {*} value The value to check for.
     * @return {boolean} Whether there is a parameter with the given value.
     */
    containsValue(value: any): boolean;
    /**
     * Runs a callback on every key-value pair in the map, including duplicate keys.
     * This won't maintain original order when duplicate keys are interspersed (like
     * getKeys() / getValues()).
     * @param {function(this:SCOPE, ?, string, !QueryData)} f
     * @param {SCOPE=} opt_scope The value of "this" inside f.
     * @template SCOPE
     */
    forEach<SCOPE>(f: (this: SCOPE, arg1: unknown, arg2: string, arg3: QueryData) => any, opt_scope?: SCOPE | undefined): void;
    /**
     * Returns all the keys of the parameters. If a key is used multiple times
     * it will be included multiple times in the returned array
     * @return {!Array<string>} All the keys of the parameters.
     */
    getKeys(): Array<string>;
    /**
     * Returns all the values of the parameters with the given name. If the query
     * data has no such key this will return an empty array. If no key is given
     * all values wil be returned.
     * @param {string=} opt_key The name of the parameter to get the values for.
     * @return {!Array<?>} All the values of the parameters with the given name.
     */
    getValues(opt_key?: string | undefined): Array<unknown>;
    /**
     * Sets a key value pair and removes all other keys with the same value.
     *
     * @param {string} key Name.
     * @param {*} value Value.
     * @return {!QueryData} Instance of this object.
     */
    set(key: string, value: any): QueryData;
    /**
     * Returns the first value associated with the key. If the query data has no
     * such key this will return undefined or the optional default.
     * @param {string} key The name of the parameter to get the value for.
     * @param {*=} opt_default The default value to return if the query data
     *     has no such key.
     * @return {*} The first string value associated with the key, or opt_default
     *     if there's no value.
     */
    get(key: string, opt_default?: any | undefined): any;
    /**
     * Sets the values for a key. If the key already exists, this will
     * override all of the existing values that correspond to the key.
     * @param {string} key The key to set values for.
     * @param {!Array<?>} values The values to set.
     */
    setValues(key: string, values: Array<unknown>): void;
    /**
     * @return {string} Encoded query string.
     * @override
     */
    toString(): string;
    /**
     * @throws URIError If URI is malformed (that is, if decodeURIComponent fails on
     *     any of the URI components).
     * @return {string} Decoded query string.
     */
    toDecodedString(): string;
    /**
     * Invalidate the cache.
     * @private
     */
    private invalidateCache_;
    /**
     * Removes all keys that are not in the provided list. (Modifies this object.)
     * @param {Array<string>} keys The desired keys.
     * @return {!QueryData} a reference to this object.
     */
    filterKeys(keys: Array<string>): QueryData;
    /**
     * Clone the query data instance.
     * @return {!QueryData} New instance of the QueryData object.
     */
    clone(): QueryData;
    /**
     * Helper function to get the key name from a JavaScript object. Converts
     * the object to a string, and to lower case if necessary.
     * @private
     * @param {*} arg The object to get a key name from.
     * @return {string} valid key name which can be looked up in #keyMap_.
     */
    private getKeyName_;
    /**
     * Ignore case in parameter names.
     * NOTE: If there are already key/value pairs in the QueryData, and
     * ignoreCase_ is set to false, the keys will all be lower-cased.
     * @param {boolean} ignoreCase whether this Uri should ignore case.
     */
    setIgnoreCase(ignoreCase: boolean): void;
    /**
     * Extends a query data object with another query data or map like object. This
     * operates 'in-place', it does not create a new QueryData object.
     *
     * @param {...(?QueryData|?StructsMap<?, ?>|?Object)} var_args
     *     The object from which key value pairs will be copied. Note: does not
     *     accept null.
     * @suppress {deprecated} Use deprecated structs.forEach to allow different
     * types of parameters.
     */
    extend(...args: any[]): void;
}
/**
 * @fileoverview Class for parsing and formatting URIs.
 *
 * Use Uri(string) to parse a URI string.  Use Uri.create(...) to
 * create a new instance of the Uri object from Uri parts.
 *
 * e.g: <code>var myUri = new Uri(window.location);</code>
 *
 * Implements RFC 3986 for parsing/formatting URIs.
 * http://www.ietf.org/rfc/rfc3986.txt
 *
 * Some changes have been made to the interface (more like .NETs), though the
 * internal representation is now of un-encoded parts, this will change the
 * behavior slightly.
 */
/**
 * This class contains setters and getters for the parts of the URI.
 * The <code>getXyz</code>/<code>setXyz</code> methods return the decoded part
 * -- so<code>Uri.parse('/foo%20bar').getPath()</code> will return the
 * decoded path, <code>/foo bar</code>.
 *
 * Reserved characters (see RFC 3986 section 2.2) can be present in
 * their percent-encoded form in scheme, domain, and path URI components and
 * will not be auto-decoded. For example:
 * <code>Uri.parse('rel%61tive/path%2fto/resource').getPath()</code> will
 * return <code>relative/path%2fto/resource</code>.
 *
 * The constructor accepts an optional unparsed, raw URI string.  The parser
 * is relaxed, so special characters that aren't escaped but don't cause
 * ambiguities will not cause parse failures.
 *
 * All setters return <code>this</code> and so may be chained, a la
 * <code>Uri.parse('/foo').setFragment('part').toString()</code>.
 *
 *        (use Uri.create() to create a URI from parts), or if
 *        a Uri is passed, a clone is created.
 * the case of the parameter name.
 *
 * @throws URIError If opt_uri is provided and URI is malformed (that is,
 *     if decodeURIComponent fails on any of the URI components).
 * @class
 */
export class Uri {
    /**
     * Creates a uri from the string form.  Basically an alias of new Uri().
     * If a Uri object is passed to parse then it will return a clone of the object.
     *
     * @throws URIError If parsing the URI is malformed. The passed URI components
     *     should all be parseable by decodeURIComponent.
     * @param {*} uri Raw URI string or instance of Uri
     *     object.
     * @param {boolean=} opt_ignoreCase Whether to ignore the case of parameter
     * names in #getParameterValue.
     * @return {!Uri} The new URI object.
     */
    static parse(uri: any, opt_ignoreCase?: boolean | undefined): Uri;
    /**
     * Creates a new Uri object from unencoded parts.
     *
     * @param {?string=} opt_scheme Scheme/protocol or full URI to parse.
     * @param {?string=} opt_userInfo username:password.
     * @param {?string=} opt_domain www.google.com.
     * @param {?number=} opt_port 9830.
     * @param {?string=} opt_path /some/path/to/a/file.html.
     * @param {string|QueryData=} opt_query a=1&b=2.
     * @param {?string=} opt_fragment The fragment without the #.
     * @param {boolean=} opt_ignoreCase Whether to ignore parameter name case in
     *     #getParameterValue.
     *
     * @return {!Uri} The new URI object.
     */
    static create(opt_scheme?: (string | null) | undefined, opt_userInfo?: (string | null) | undefined, opt_domain?: (string | null) | undefined, opt_port?: (number | null) | undefined, opt_path?: (string | null) | undefined, opt_query?: (string | QueryData) | undefined, opt_fragment?: (string | null) | undefined, opt_ignoreCase?: boolean | undefined): Uri;
    /**
     * Resolves a relative Uri against a base Uri, accepting both strings and
     * Uri objects.
     *
     * @param {*} base Base Uri.
     * @param {*} rel Relative Uri.
     * @return {!Uri} Resolved uri.
     */
    static resolve(base: any, rel: any): Uri;
    /**
     * Removes dot segments in given path component, as described in
     * RFC 3986, section 5.2.4.
     *
     * @param {string} path A non-empty path component.
     * @return {string} Path component with removed dot segments.
     */
    static removeDotSegments(path: string): string;
    /**
     * Decodes a value or returns the empty string if it isn't defined or empty.
     * @throws URIError If decodeURIComponent fails to decode val.
     * @param {string|undefined} val Value to decode.
     * @param {boolean=} opt_preserveReserved If true, restricted characters will
     *     not be decoded.
     * @return {string} Decoded value.
     * @private
     */
    private static decodeOrEmpty_;
    /**
     * If unescapedPart is non null, then escapes any characters in it that aren't
     * valid characters in a url and also escapes any special characters that
     * appear in extra.
     *
     * @param {*} unescapedPart The string to encode.
     * @param {?RegExp} extra A character set of characters in [\01-\177].
     * @param {boolean=} opt_removeDoubleEncoding If true, remove double percent
     *     encoding.
     * @return {?string} null iff unescapedPart == null.
     * @private
     */
    private static encodeSpecialChars_;
    /**
     * Converts a character in [\01-\177] to its unicode character equivalent.
     * @param {string} ch One character string.
     * @return {string} Encoded string.
     * @private
     */
    private static encodeChar_;
    /**
     * Removes double percent-encoding from a string.
     * @param  {string} doubleEncodedString String
     * @return {string} String with double encoding removed.
     * @private
     */
    private static removeDoubleEncoding_;
    /**
     * Checks whether two URIs have the same domain.
     * @param {string} uri1String First URI string.
     * @param {string} uri2String Second URI string.
     * @return {boolean} true if the two URIs have the same domain; false otherwise.
     */
    static haveSameDomain(uri1String: string, uri2String: string): boolean;
    /**
     * This class contains setters and getters for the parts of the URI.
     * The <code>getXyz</code>/<code>setXyz</code> methods return the decoded part
     * -- so<code>Uri.parse('/foo%20bar').getPath()</code> will return the
     * decoded path, <code>/foo bar</code>.
     *
     * Reserved characters (see RFC 3986 section 2.2) can be present in
     * their percent-encoded form in scheme, domain, and path URI components and
     * will not be auto-decoded. For example:
     * <code>Uri.parse('rel%61tive/path%2fto/resource').getPath()</code> will
     * return <code>relative/path%2fto/resource</code>.
     *
     * The constructor accepts an optional unparsed, raw URI string.  The parser
     * is relaxed, so special characters that aren't escaped but don't cause
     * ambiguities will not cause parse failures.
     *
     * All setters return <code>this</code> and so may be chained, a la
     * <code>Uri.parse('/foo').setFragment('part').toString()</code>.
     *
     * @param {*=} opt_uri Optional string URI to parse
     *        (use Uri.create() to create a URI from parts), or if
     *        a Uri is passed, a clone is created.
     * @param {boolean=} opt_ignoreCase If true, #getParameterValue will ignore
     * the case of the parameter name.
     *
     * @throws URIError If opt_uri is provided and URI is malformed (that is,
     *     if decodeURIComponent fails on any of the URI components).
     */
    constructor(opt_uri?: any | undefined, opt_ignoreCase?: boolean | undefined);
    /**
     * Scheme such as "http".
     * @private {string}
     */
    private scheme_;
    /**
     * User credentials in the form "username:password".
     * @private {string}
     */
    private userInfo_;
    /**
     * Domain part, e.g. "www.google.com".
     * @private {string}
     */
    private domain_;
    /**
     * Port, e.g. 8080.
     * @private {?number}
     */
    private port_;
    /**
     * Path, e.g. "/tests/img.png".
     * @private {string}
     */
    private path_;
    /**
     * The fragment without the #.
     * @private {string}
     */
    private fragment_;
    /**
     * Whether or not this Uri should be treated as Read Only.
     * @private {boolean}
     */
    private isReadOnly_;
    /**
     * Whether or not to ignore case when comparing query params.
     * @private {boolean}
     */
    private ignoreCase_;
    queryData_: QueryData;
    /**
     * @return {string} The string form of the url.
     * @override
     */
    toString(): string;
    /**
     * Resolves the given relative URI (a Uri object), using the URI
     * represented by this instance as the base URI.
     *
     * There are several kinds of relative URIs:<br>
     * 1. foo - replaces the last part of the path, the whole query and fragment<br>
     * 2. /foo - replaces the path, the query and fragment<br>
     * 3. //foo - replaces everything from the domain on.  foo is a domain name<br>
     * 4. ?foo - replace the query and fragment<br>
     * 5. #foo - replace the fragment only
     *
     * Additionally, if relative URI has a non-empty path, all ".." and "."
     * segments will be resolved, as described in RFC 3986.
     *
     * @param {!Uri} relativeUri The relative URI to resolve.
     * @return {!Uri} The resolved URI.
     */
    resolve(relativeUri: Uri): Uri;
    /**
     * Clones the URI instance.
     * @return {!Uri} New instance of the URI object.
     */
    clone(): Uri;
    /**
     * @return {string} The encoded scheme/protocol for the URI.
     */
    getScheme(): string;
    /**
     * Sets the scheme/protocol.
     * @throws URIError If opt_decode is true and newScheme is malformed (that is,
     *     if decodeURIComponent fails).
     * @param {string} newScheme New scheme value.
     * @param {boolean=} opt_decode Optional param for whether to decode new value.
     * @return {!Uri} Reference to this URI object.
     */
    setScheme(newScheme: string, opt_decode?: boolean | undefined): Uri;
    /**
     * @return {boolean} Whether the scheme has been set.
     */
    hasScheme(): boolean;
    /**
     * @return {string} The decoded user info.
     */
    getUserInfo(): string;
    /**
     * Sets the userInfo.
     * @throws URIError If opt_decode is true and newUserInfo is malformed (that is,
     *     if decodeURIComponent fails).
     * @param {string} newUserInfo New userInfo value.
     * @param {boolean=} opt_decode Optional param for whether to decode new value.
     * @return {!Uri} Reference to this URI object.
     */
    setUserInfo(newUserInfo: string, opt_decode?: boolean | undefined): Uri;
    /**
     * @return {boolean} Whether the user info has been set.
     */
    hasUserInfo(): boolean;
    /**
     * @return {string} The decoded domain.
     */
    getDomain(): string;
    /**
     * Sets the domain.
     * @throws URIError If opt_decode is true and newDomain is malformed (that is,
     *     if decodeURIComponent fails).
     * @param {string} newDomain New domain value.
     * @param {boolean=} opt_decode Optional param for whether to decode new value.
     * @return {!Uri} Reference to this URI object.
     */
    setDomain(newDomain: string, opt_decode?: boolean | undefined): Uri;
    /**
     * @return {boolean} Whether the domain has been set.
     */
    hasDomain(): boolean;
    /**
     * @return {?number} The port number.
     */
    getPort(): number | null;
    /**
     * Sets the port number.
     * @param {*} newPort Port number. Will be explicitly casted to a number.
     * @return {!Uri} Reference to this URI object.
     */
    setPort(newPort: any): Uri;
    /**
     * @return {boolean} Whether the port has been set.
     */
    hasPort(): boolean;
    /**
      * @return {string} The decoded path.
     */
    getPath(): string;
    /**
     * Sets the path.
     * @throws URIError If opt_decode is true and newPath is malformed (that is,
     *     if decodeURIComponent fails).
     * @param {string} newPath New path value.
     * @param {boolean=} opt_decode Optional param for whether to decode new value.
     * @return {!Uri} Reference to this URI object.
     */
    setPath(newPath: string, opt_decode?: boolean | undefined): Uri;
    /**
     * @return {boolean} Whether the path has been set.
     */
    hasPath(): boolean;
    /**
     * @return {boolean} Whether the query string has been set.
     */
    hasQuery(): boolean;
    /**
     * Sets the query data.
     * @param {QueryData|string|undefined} queryData QueryData object.
     * @param {boolean=} opt_decode Optional param for whether to decode new value.
     *     Applies only if queryData is a string.
     * @return {!Uri} Reference to this URI object.
     */
    setQueryData(queryData: QueryData | string | undefined, opt_decode?: boolean | undefined): Uri;
    /**
     * Sets the URI query.
     * @param {string} newQuery New query value.
     * @param {boolean=} opt_decode Optional param for whether to decode new value.
     * @return {!Uri} Reference to this URI object.
     */
    setQuery(newQuery: string, opt_decode?: boolean | undefined): Uri;
    /**
     * @return {string} The encoded URI query, not including the ?.
     */
    getEncodedQuery(): string;
    /**
     * @return {string} The decoded URI query, not including the ?.
     */
    getDecodedQuery(): string;
    /**
     * Returns the query data.
     * @return {!QueryData} QueryData object.
     */
    getQueryData(): QueryData;
    /**
     * @return {string} The encoded URI query, not including the ?.
     *
     * Warning: This method, unlike other getter methods, returns encoded
     * value, instead of decoded one.
     */
    getQuery(): string;
    /**
     * Sets the value of the named query parameters, clearing previous values for
     * that key.
     *
     * @param {string} key The parameter to set.
     * @param {*} value The new value. Value does not need to be encoded.
     * @return {!Uri} Reference to this URI object.
     */
    setParameterValue(key: string, value: any): Uri;
    /**
     * Sets the values of the named query parameters, clearing previous values for
     * that key.  Not new values will currently be moved to the end of the query
     * string.
     *
     * So, <code>Uri.parse('foo?a=b&c=d&e=f').setParameterValues('c', ['new'])
     * </code> yields <tt>foo?a=b&e=f&c=new</tt>.</p>
     *
     * @param {string} key The parameter to set.
     * @param {*} values The new values. If values is a single
     *     string then it will be treated as the sole value. Values do not need to
     *     be encoded.
     * @return {!Uri} Reference to this URI object.
     */
    setParameterValues(key: string, values: any): Uri;
    /**
     * Returns the value<b>s</b> for a given cgi parameter as a list of decoded
     * query parameter values.
     * @param {string} name The parameter to get values for.
     * @return {!Array<?>} The values for a given cgi parameter as a list of
     *     decoded query parameter values.
     */
    getParameterValues(name: string): Array<unknown>;
    /**
     * Returns the first value for a given cgi parameter or undefined if the given
     * parameter name does not appear in the query string.
     * @param {string} paramName Unescaped parameter name.
     * @return {string|undefined} The first value for a given cgi parameter or
     *     undefined if the given parameter name does not appear in the query
     *     string.
     */
    getParameterValue(paramName: string): string | undefined;
    /**
     * @return {string} The URI fragment, not including the #.
     */
    getFragment(): string;
    /**
     * Sets the URI fragment.
     * @throws URIError If opt_decode is true and newFragment is malformed (that is,
     *     if decodeURIComponent fails).
     * @param {string} newFragment New fragment value.
     * @param {boolean=} opt_decode Optional param for whether to decode new value.
     * @return {!Uri} Reference to this URI object.
     */
    setFragment(newFragment: string, opt_decode?: boolean | undefined): Uri;
    /**
     * @return {boolean} Whether the URI has a fragment set.
     */
    hasFragment(): boolean;
    /**
     * Returns true if this has the same domain as that of uri2.
     * @param {!Uri} uri2 The URI object to compare to.
     * @return {boolean} true if same domain; false otherwise.
     */
    hasSameDomainAs(uri2: Uri): boolean;
    /**
     * Adds a random parameter to the Uri.
     * @return {!Uri} Reference to this Uri object.
     */
    makeUnique(): Uri;
    /**
     * Removes the named query parameter.
     *
     * @param {string} key The parameter to remove.
     * @return {!Uri} Reference to this URI object.
     */
    removeParameter(key: string): Uri;
    /**
     * Sets whether Uri is read only. If this Uri is read-only,
     * enforceReadOnly_ will be called at the start of any function that may modify
     * this Uri.
     * @param {boolean} isReadOnly whether this Uri should be read only.
     * @return {!Uri} Reference to this Uri object.
     */
    setReadOnly(isReadOnly: boolean): Uri;
    /**
     * @return {boolean} Whether the URI is read only.
     */
    isReadOnly(): boolean;
    /**
     * Checks if this Uri has been marked as read only, and if so, throws an error.
     * This should be called whenever any modifying function is called.
     */
    enforceReadOnly(): void;
    /**
     * Sets whether to ignore case.
     * NOTE: If there are already key/value pairs in the QueryData, and
     * ignoreCase_ is set to false, the keys will all be lower-cased.
     * @param {boolean} ignoreCase whether this Uri should ignore case.
     * @return {!Uri} Reference to this Uri object.
     */
    setIgnoreCase(ignoreCase: boolean): Uri;
    /**
     * @return {boolean} Whether to ignore case.
     */
    getIgnoreCase(): boolean;
}
export namespace Uri {
    export const RANDOM_PARAM: string;
    export const reDisallowedInSchemeOrUserInfo_: RegExp | null;
    export const reDisallowedInRelativePath_: RegExp | null;
    export const reDisallowedInAbsolutePath_: RegExp | null;
    export const reDisallowedInQuery_: RegExp | null;
    export const reDisallowedInFragment_: RegExp | null;
}
import { Map as StructsMap } from "../structs/map.js";
