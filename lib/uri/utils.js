import * as googarray from './../array/array.js';
import * as asserts from './../asserts/asserts.js';
import * as google from './../google.js';
import * as goog_strings from './../string/string.js';
// Copyright 2008 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Simple utilities for dealing with URI strings.
 *
 * This is intended to be a lightweight alternative to constructing google.Uri
 * objects.  Whereas google.Uri adds several kilobytes to the binary regardless
 * of how much of its functionality you use, this is designed to be a set of
 * mostly-independent utilities so that the compiler includes only what is
 * necessary for the task.  Estimated savings of porting is 5k pre-gzip and
 * 1.5k post-gzip.  To ensure the savings remain, future developers should
 * avoid adding new functionality to existing functions, but instead create
 * new ones and factor out shared code.
 *
 * Many of these utilities have limited functionality, tailored to common
 * cases.  The query parameter utilities assume that the parameter keys are
 * already encoded, since most keys are compile-time alphanumeric strings.  The
 * query parameter mutation utilities also do not tolerate fragment identifiers.
 *
 * By design, these functions can be slower than google.Uri equivalents.
 * Repeated calls to some of functions may be quadratic in behavior for IE,
 * although the effect is somewhat limited given the 2kb limit.
 *
 * One advantage of the limited functionality here is that this approach is
 * less sensitive to differences in URI encodings than google.Uri, since these
 * functions operate on strings directly, rather than decoding them and
 * then re-encoding.
 *
 * Uses features of RFC 3986 for parsing/formatting URIs:
 *   http://www.ietf.org/rfc/rfc3986.txt
 */

/**
 * Character codes inlined to avoid object allocations due to charCode.
 * @enum {number}
 * @private
 */
let CharCode_ = {
  AMPERSAND: 38,
  EQUAL: 61,
  HASH: 35,
  QUESTION: 63
};

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
function buildFromEncodedParts(
    opt_scheme, opt_userInfo, opt_domain, opt_port, opt_path, opt_queryData,
    opt_fragment) {
  var out = '';

  if (opt_scheme) {
    out += opt_scheme + ':';
  }

  if (opt_domain) {
    out += '//';

    if (opt_userInfo) {
      out += opt_userInfo + '@';
    }

    out += opt_domain;

    if (opt_port) {
      out += ':' + opt_port;
    }
  }

  if (opt_path) {
    out += opt_path;
  }

  if (opt_queryData) {
    out += '?' + opt_queryData;
  }

  if (opt_fragment) {
    out += '#' + opt_fragment;
  }

  return out;
};

/**
 * A regular expression for breaking a URI into its component parts.
 *
 * {@link http://www.ietf.org/rfc/rfc3986.txt} says in Appendix B
 * As the "first-match-wins" algorithm is identical to the "greedy"
 * disambiguation method used by POSIX regular expressions, it is natural and
 * commonplace to use a regular expression for parsing the potential five
 * components of a URI reference.
 *
 * The following line is the regular expression for breaking-down a
 * well-formed URI reference into its components.
 *
 * <pre>
 * ^(([^:/?#]+):)?(//([^/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?
 *  12            3  4          5       6  7        8 9
 * </pre>
 *
 * The numbers in the second line above are only to assist readability; they
 * indicate the reference points for each subexpression (i.e., each paired
 * parenthesis). We refer to the value matched for subexpression <n> as $<n>.
 * For example, matching the above expression to
 * <pre>
 *     http://www.ics.uci.edu/pub/ietf/uri/#Related
 * </pre>
 * results in the following subexpression matches:
 * <pre>
 *    $1 = http:
 *    $2 = http
 *    $3 = //www.ics.uci.edu
 *    $4 = www.ics.uci.edu
 *    $5 = /pub/ietf/uri/
 *    $6 = <undefined>
 *    $7 = <undefined>
 *    $8 = #Related
 *    $9 = Related
 * </pre>
 * where <undefined> indicates that the component is not present, as is the
 * case for the query component in the above example. Therefore, we can
 * determine the value of the five components as
 * <pre>
 *    scheme    = $2
 *    authority = $4
 *    path      = $5
 *    query     = $7
 *    fragment  = $9
 * </pre>
 *
 * The regular expression has been modified slightly to expose the
 * userInfo, domain, and port separately from the authority.
 * The modified version yields
 * <pre>
 *    $1 = http              scheme
 *    $2 = <undefined>       userInfo -\
 *    $3 = www.ics.uci.edu   domain     | authority
 *    $4 = <undefined>       port     -/
 *    $5 = /pub/ietf/uri/    path
 *    $6 = <undefined>       query without ?
 *    $7 = Related           fragment without #
 * </pre>
 * @type {!RegExp}
 * @private
 */
let splitRe_ = new RegExp(
    '^' +
    '(?:' +
    '([^:/?#.]+)' +  // scheme - ignore special characters
                     // used by other URL parts such as :,
                     // ?, /, #, and .
    ':)?' +
    '(?://' +
    '(?:([^/?#]*)@)?' +  // userInfo
    '([^/#?]*?)' +       // domain
    '(?::([0-9]+))?' +   // port
    '(?=[/#?]|$)' +      // authority-terminating character
    ')?' +
    '([^?#]+)?' +          // path
    '(?:\\?([^#]*))?' +    // query
    '(?:#([\\s\\S]*))?' +  // fragment
    '$');

/**
 * The index of each URI component in the return value of split.
 * @enum {number}
 */
let ComponentIndex = {
  SCHEME: 1,
  USER_INFO: 2,
  DOMAIN: 3,
  PORT: 4,
  PATH: 5,
  QUERY_DATA: 6,
  FRAGMENT: 7
};

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
function split(uri) {
  // See @return comment -- never null.
  return /** @type {!Array<string|undefined>} */ (
      uri.match(splitRe_));
};

/**
 * @param {?string} uri A possibly null string.
 * @param {boolean=} opt_preserveReserved If true, percent-encoding of RFC-3986
 *     reserved characters will not be removed.
 * @return {?string} The string URI-decoded, or null if uri is null.
 * @private
 */
function decodeIfPossible_(uri, opt_preserveReserved) {
  if (!uri) {
    return uri;
  }

  return opt_preserveReserved ? decodeURI(uri) : decodeURIComponent(uri);
};

/**
 * Gets a URI component by index.
 *
 * It is preferred to use the getPathEncoded() variety of functions ahead,
 * since they are more readable.
 *
 * @param {ComponentIndex} componentIndex The component index.
 * @param {string} uri The URI to examine.
 * @return {?string} The still-encoded component, or null if the component
 *     is not present.
 * @private
 */
function getComponentByIndex_(componentIndex, uri) {
  // Convert undefined, null, and empty string into null.
  return split(uri)[componentIndex] || null;
};

/**
 * @param {string} uri The URI to examine.
 * @return {?string} The protocol or scheme, or null if none.  Does not
 *     include trailing colons or slashes.
 */
function getScheme(uri) {
  return getComponentByIndex_(
      ComponentIndex.SCHEME, uri);
};

/**
 * Gets the effective scheme for the URL.  If the URL is relative then the
 * scheme is derived from the page's location.
 * @param {string} uri The URI to examine.
 * @return {string} The protocol or scheme, always lower case.
 */
function getEffectiveScheme(uri) {
  var scheme = getScheme(uri);
  if (!scheme && window.self && window.self.location) {
    var protocol = window.self.location.protocol;
    scheme = protocol.substr(0, protocol.length - 1);
  }
  // NOTE: When called from a web worker in Firefox 3.5, location may be null.
  // All other browsers with web workers support self.location from the worker.
  return scheme ? scheme.toLowerCase() : '';
};

/**
 * @param {string} uri The URI to examine.
 * @return {?string} The user name still encoded, or null if none.
 */
function getUserInfoEncoded(uri) {
  return getComponentByIndex_(
      ComponentIndex.USER_INFO, uri);
};

/**
 * @param {string} uri The URI to examine.
 * @return {?string} The decoded user info, or null if none.
 */
function getUserInfo(uri) {
  return decodeIfPossible_(
      getUserInfoEncoded(uri));
};

/**
 * @param {string} uri The URI to examine.
 * @return {?string} The domain name still encoded, or null if none.
 */
function getDomainEncoded(uri) {
  return getComponentByIndex_(
      ComponentIndex.DOMAIN, uri);
};

/**
 * @param {string} uri The URI to examine.
 * @return {?string} The decoded domain, or null if none.
 */
function getDomain(uri) {
  return decodeIfPossible_(
      getDomainEncoded(uri), true /* opt_preserveReserved */);
};

/**
 * @param {string} uri The URI to examine.
 * @return {?number} The port number, or null if none.
 */
function getPort(uri) {
  // Coerce to a number.  If the result of getComponentByIndex_ is null or
  // non-numeric, the number coersion yields NaN.  This will then return
  // null for all non-numeric cases (though also zero, which isn't a relevant
  // port number).
  return Number(
             getComponentByIndex_(
                 ComponentIndex.PORT, uri)) ||
      null;
};

/**
 * @param {string} uri The URI to examine.
 * @return {?string} The path still encoded, or null if none. Includes the
 *     leading slash, if any.
 */
function getPathEncoded(uri) {
  return getComponentByIndex_(
      ComponentIndex.PATH, uri);
};

/**
 * @param {string} uri The URI to examine.
 * @return {?string} The decoded path, or null if none.  Includes the leading
 *     slash, if any.
 */
function getPath(uri) {
  return decodeIfPossible_(
      getPathEncoded(uri), true /* opt_preserveReserved */);
};

/**
 * @param {string} uri The URI to examine.
 * @return {?string} The query data still encoded, or null if none.  Does not
 *     include the question mark itself.
 */
function getQueryData(uri) {
  return getComponentByIndex_(
      ComponentIndex.QUERY_DATA, uri);
};

/**
 * @param {string} uri The URI to examine.
 * @return {?string} The fragment identifier, or null if none.  Does not
 *     include the hash mark itself.
 */
function getFragmentEncoded(uri) {
  // The hash mark may not appear in any other part of the URL.
  var hashIndex = uri.indexOf('#');
  return hashIndex < 0 ? null : uri.substr(hashIndex + 1);
};

/**
 * @param {string} uri The URI to examine.
 * @param {?string} fragment The encoded fragment identifier, or null if none.
 *     Does not include the hash mark itself.
 * @return {string} The URI with the fragment set.
 */
function setFragmentEncoded(uri, fragment) {
  return removeFragment(uri) + (fragment ? '#' + fragment : '');
};

/**
 * @param {string} uri The URI to examine.
 * @return {?string} The decoded fragment identifier, or null if none.  Does
 *     not include the hash mark.
 */
function getFragment(uri) {
  return decodeIfPossible_(
      getFragmentEncoded(uri));
};

/**
 * Extracts everything up to the port of the URI.
 * @param {string} uri The URI string.
 * @return {string} Everything up to and including the port.
 */
function getHost(uri) {
  var pieces = split(uri);
  return buildFromEncodedParts(
      pieces[ComponentIndex.SCHEME],
      pieces[ComponentIndex.USER_INFO],
      pieces[ComponentIndex.DOMAIN],
      pieces[ComponentIndex.PORT]);
};

/**
 * Returns the origin for a given URL.
 * @param {string} uri The URI string.
 * @return {string} Everything up to and including the port.
 */
function getOrigin(uri) {
  var pieces = split(uri);
  return buildFromEncodedParts(
      pieces[ComponentIndex.SCHEME], null /* opt_userInfo */,
      pieces[ComponentIndex.DOMAIN],
      pieces[ComponentIndex.PORT]);
};

/**
 * Extracts the path of the URL and everything after.
 * @param {string} uri The URI string.
 * @return {string} The URI, starting at the path and including the query
 *     parameters and fragment identifier.
 */
function getPathAndAfter(uri) {
  var pieces = split(uri);
  return buildFromEncodedParts(
      null, null, null, null, pieces[ComponentIndex.PATH],
      pieces[ComponentIndex.QUERY_DATA],
      pieces[ComponentIndex.FRAGMENT]);
};

/**
 * Gets the URI with the fragment identifier removed.
 * @param {string} uri The URI to examine.
 * @return {string} Everything preceding the hash mark.
 */
function removeFragment(uri) {
  // The hash mark may not appear in any other part of the URL.
  var hashIndex = uri.indexOf('#');
  return hashIndex < 0 ? uri : uri.substr(0, hashIndex);
};

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
function haveSameDomain(uri1, uri2) {
  var pieces1 = split(uri1);
  var pieces2 = split(uri2);
  return pieces1[ComponentIndex.DOMAIN] ==
      pieces2[ComponentIndex.DOMAIN] &&
      pieces1[ComponentIndex.SCHEME] ==
      pieces2[ComponentIndex.SCHEME] &&
      pieces1[ComponentIndex.PORT] ==
      pieces2[ComponentIndex.PORT];
};

/**
 * Asserts that there are no fragment or query identifiers, only in uncompiled
 * mode.
 * @param {string} uri The URI to examine.
 * @private
 */
function assertNoFragmentsOrQueries_(uri) {
  asserts.assert(
      uri.indexOf('#') < 0 && uri.indexOf('?') < 0,
      'goog.uri.utils: Fragment or query identifiers are not supported: [%s]',
      uri);
};

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
let QueryValue;

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
let QueryArray;

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
function parseQueryData(encodedQuery, callback) {
  if (!encodedQuery) {
    return;
  }
  var pairs = encodedQuery.split('&');
  for (var i = 0; i < pairs.length; i++) {
    var indexOfEquals = pairs[i].indexOf('=');
    var name = null;
    var value = null;
    if (indexOfEquals >= 0) {
      name = pairs[i].substring(0, indexOfEquals);
      value = pairs[i].substring(indexOfEquals + 1);
    } else {
      name = pairs[i];
    }
    callback(name, value ? goog_strings.urlDecode(value) : '');
  }
};

/**
 * Split the URI into 3 parts where the [1] is the queryData without a leading
 * '?'. For example, the URI http://foo.com/bar?a=b#abc returns
 * ['http://foo.com/bar','a=b','#abc'].
 * @param {string} uri The URI to parse.
 * @return {!Array<string>} An array representation of uri of length 3 where the
 *     middle value is the queryData without a leading '?'.
 * @private
 */
function splitQueryData_(uri) {
  // Find the query data and hash.
  var hashIndex = uri.indexOf('#');
  if (hashIndex < 0) {
    hashIndex = uri.length;
  }
  var questionIndex = uri.indexOf('?');
  var queryData;
  if (questionIndex < 0 || questionIndex > hashIndex) {
    questionIndex = hashIndex;
    queryData = '';
  } else {
    queryData = uri.substring(questionIndex + 1, hashIndex);
  }
  return [uri.substr(0, questionIndex), queryData, uri.substr(hashIndex)];
};

/**
 * Join an array created by splitQueryData_ back into a URI.
 * @param {!Array<string>} parts A URI in the form generated by splitQueryData_.
 * @return {string} The joined URI.
 * @private
 */
function joinQueryData_(parts) {
  return parts[0] + (parts[1] ? '?' + parts[1] : '') + parts[2];
};

/**
 * @param {string} queryData
 * @param {string} newData
 * @return {string}
 * @private
 */
function appendQueryData_(queryData, newData) {
  if (!newData) {
    return queryData;
  }
  return queryData ? queryData + '&' + newData : newData;
};

/**
 * @param {string} uri
 * @param {string} queryData
 * @return {string}
 * @private
 */
function appendQueryDataToUri_(uri, queryData) {
  if (!queryData) {
    return uri;
  }
  var parts = splitQueryData_(uri);
  parts[1] = appendQueryData_(parts[1], queryData);
  return joinQueryData_(parts);
};

/**
 * Appends key=value pairs to an array, supporting multi-valued objects.
 * @param {*} key The key prefix.
 * @param {QueryValue} value The value to serialize.
 * @param {!Array<string>} pairs The array to which the 'key=value' strings
 *     should be appended.
 * @private
 */
function appendKeyValuePairs_(key, value, pairs) {
  asserts.assertString(key);
  if (google.isArray(value)) {
    // Convince the compiler it's an array.
    asserts.assertArray(value);
    for (var j = 0; j < value.length; j++) {
      // Convert to string explicitly, to short circuit the null and array
      // logic in this function -- this ensures that null and undefined get
      // written as literal 'null' and 'undefined', and arrays don't get
      // expanded out but instead encoded in the default way.
      appendKeyValuePairs_(key, String(value[j]), pairs);
    }
  } else if (value != null) {
    // Skip a top-level null or undefined entirely.
    pairs.push(
        key +
        // Check for empty string. Zero gets encoded into the url as literal
        // strings.  For empty string, skip the equal sign, to be consistent
        // with UriBuilder.java.
        (value === '' ? '' : '=' + goog_strings.urlEncode(value)));
  }
};

/**
 * Builds a query data string from a sequence of alternating keys and values.
 * Currently generates "&key&" for empty args.
 *
 * @param {!IArrayLike<string|QueryValue>} keysAndValues
 *     Alternating keys and values. See the QueryArray typedef.
 * @param {number=} opt_startIndex A start offset into the arary, defaults to 0.
 * @return {string} The encoded query string, in the form 'a=1&b=2'.
 */
function buildQueryData(keysAndValues, opt_startIndex) {
  asserts.assert(
      Math.max(keysAndValues.length - (opt_startIndex || 0), 0) % 2 == 0,
      'goog.uri.utils: Key/value lists must be even in length.');

  var params = [];
  for (var i = opt_startIndex || 0; i < keysAndValues.length; i += 2) {
    var key = /** @type {string} */ (keysAndValues[i]);
    appendKeyValuePairs_(key, keysAndValues[i + 1], params);
  }
  return params.join('&');
};

/**
 * Builds a query data string from a map.
 * Currently generates "&key&" for empty args.
 *
 * @param {!Object<string, QueryValue>} map An object where keys
 *     are URI-encoded parameter keys, and the values are arbitrary types
 *     or arrays. Keys with a null value are dropped.
 * @return {string} The encoded query string, in the form 'a=1&b=2'.
 */
function buildQueryDataFromMap(map) {
  var params = [];
  for (var key in map) {
    appendKeyValuePairs_(key, map[key], params);
  }
  return params.join('&');
};

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
function appendParams(uri, var_args) {
  var queryData = arguments.length == 2 ?
      buildQueryData(arguments[1], 0) :
      buildQueryData(arguments, 1);
  return appendQueryDataToUri_(uri, queryData);
};

/**
 * Appends query parameters from a map.
 *
 * @param {string} uri The original URI, which may already have query data.
 * @param {!Object<QueryValue>} map An object where keys are
 *     URI-encoded parameter keys, and the values are arbitrary types or arrays.
 *     Keys with a null value are dropped.
 * @return {string} The new parameters.
 */
function appendParamsFromMap(uri, map) {
  var queryData = buildQueryDataFromMap(map);
  return appendQueryDataToUri_(uri, queryData);
};

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
function appendParam(uri, key, opt_value) {
  var value = (opt_value != null) ? '=' + goog_strings.urlEncode(opt_value) : '';
  return appendQueryDataToUri_(uri, key + value);
};

/**
 * Finds the next instance of a query parameter with the specified name.
 *
 * Does not instantiate any objects.
 *
 * @param {string} uri The URI to search.  May contain a fragment identifier
 *     if opt_hashIndex is specified.
 * @param {number} startIndex The index to begin searching for the key at.  A
 *     match may be found even if this is one character after the ampersand.
 * @param {string} keyEncoded The URI-encoded key.
 * @param {number} hashOrEndIndex Index to stop looking at.  If a hash
 *     mark is present, it should be its index, otherwise it should be the
 *     length of the string.
 * @return {number} The position of the first character in the key's name,
 *     immediately after either a question mark or a dot.
 * @private
 */
function findParam_(
    uri, startIndex, keyEncoded, hashOrEndIndex) {
  var index = startIndex;
  var keyLength = keyEncoded.length;

  // Search for the key itself and post-filter for surronuding punctuation,
  // rather than expensively building a regexp.
  while ((index = uri.indexOf(keyEncoded, index)) >= 0 &&
         index < hashOrEndIndex) {
    var precedingChar = uri.charCodeAt(index - 1);
    // Ensure that the preceding character is '&' or '?'.
    if (precedingChar == CharCode_.AMPERSAND ||
        precedingChar == CharCode_.QUESTION) {
      // Ensure the following character is '&', '=', '#', or NaN
      // (end of string).
      var followingChar = uri.charCodeAt(index + keyLength);
      if (!followingChar || followingChar == CharCode_.EQUAL ||
          followingChar == CharCode_.AMPERSAND ||
          followingChar == CharCode_.HASH) {
        return index;
      }
    }
    index += keyLength + 1;
  }

  return -1;
};

/**
 * Regular expression for finding a hash mark or end of string.
 * @type {RegExp}
 * @private
 */
let hashOrEndRe_ = /#|$/;

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
function hasParam(uri, keyEncoded) {
  return findParam_(
             uri, 0, keyEncoded, uri.search(hashOrEndRe_)) >= 0;
};

/**
 * Gets the first value of a query parameter.
 * @param {string} uri The URI to process.  May contain a fragment.
 * @param {string} keyEncoded The URI-encoded key.  Case-sensitive.
 * @return {?string} The first value of the parameter (URI-decoded), or null
 *     if the parameter is not found.
 */
function getParamValue(uri, keyEncoded) {
  var hashOrEndIndex = uri.search(hashOrEndRe_);
  var foundIndex =
      findParam_(uri, 0, keyEncoded, hashOrEndIndex);

  if (foundIndex < 0) {
    return null;
  } else {
    var endPosition = uri.indexOf('&', foundIndex);
    if (endPosition < 0 || endPosition > hashOrEndIndex) {
      endPosition = hashOrEndIndex;
    }
    // Progress forth to the end of the "key=" or "key&" substring.
    foundIndex += keyEncoded.length + 1;
    // Use substr, because it (unlike substring) will return empty string
    // if foundIndex > endPosition.
    return goog_strings.urlDecode(
        uri.substr(foundIndex, endPosition - foundIndex));
  }
};

/**
 * Gets all values of a query parameter.
 * @param {string} uri The URI to process.  May contain a fragment.
 * @param {string} keyEncoded The URI-encoded key.  Case-sensitive.
 * @return {!Array<string>} All URI-decoded values with the given key.
 *     If the key is not found, this will have length 0, but never be null.
 */
function getParamValues(uri, keyEncoded) {
  var hashOrEndIndex = uri.search(hashOrEndRe_);
  var position = 0;
  var foundIndex;
  var result = [];

  while ((foundIndex = findParam_(
              uri, position, keyEncoded, hashOrEndIndex)) >= 0) {
    // Find where this parameter ends, either the '&' or the end of the
    // query parameters.
    position = uri.indexOf('&', foundIndex);
    if (position < 0 || position > hashOrEndIndex) {
      position = hashOrEndIndex;
    }

    // Progress forth to the end of the "key=" or "key&" substring.
    foundIndex += keyEncoded.length + 1;
    // Use substr, because it (unlike substring) will return empty string
    // if foundIndex > position.
    result.push(
        goog_strings.urlDecode(uri.substr(foundIndex, position - foundIndex)));
  }

  return result;
};

/**
 * Regexp to find trailing question marks and ampersands.
 * @type {RegExp}
 * @private
 */
let trailingQueryPunctuationRe_ = /[?&]($|#)/;

/**
 * Removes all instances of a query parameter.
 * @param {string} uri The URI to process.  Must not contain a fragment.
 * @param {string} keyEncoded The URI-encoded key.
 * @return {string} The URI with all instances of the parameter removed.
 */
function removeParam(uri, keyEncoded) {
  var hashOrEndIndex = uri.search(hashOrEndRe_);
  var position = 0;
  var foundIndex;
  var buffer = [];

  // Look for a query parameter.
  while ((foundIndex = findParam_(
              uri, position, keyEncoded, hashOrEndIndex)) >= 0) {
    // Get the portion of the query string up to, but not including, the ?
    // or & starting the parameter.
    buffer.push(uri.substring(position, foundIndex));
    // Progress to immediately after the '&'.  If not found, go to the end.
    // Avoid including the hash mark.
    position = Math.min(
        (uri.indexOf('&', foundIndex) + 1) || hashOrEndIndex, hashOrEndIndex);
  }

  // Append everything that is remaining.
  buffer.push(uri.substr(position));

  // Join the buffer, and remove trailing punctuation that remains.
  return buffer.join('').replace(
      trailingQueryPunctuationRe_, '$1');
};

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
function setParam(uri, keyEncoded, value) {
  return appendParam(
      removeParam(uri, keyEncoded), keyEncoded, value);
};

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
function setParamsFromMap(uri, params) {
  var parts = splitQueryData_(uri);
  var queryData = parts[1];
  var buffer = [];
  if (queryData) {
    googarray.forEach(queryData.split('&'), function(pair) {
      var indexOfEquals = pair.indexOf('=');
      var name = indexOfEquals >= 0 ? pair.substr(0, indexOfEquals) : pair;
      if (!params.hasOwnProperty(name)) {
        buffer.push(pair);
      }
    });
  }
  parts[1] = appendQueryData_(
      buffer.join('&'), buildQueryDataFromMap(params));
  return joinQueryData_(parts);
};

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
function appendPath(baseUri, path) {
  assertNoFragmentsOrQueries_(baseUri);

  // Remove any trailing '/'
  if (goog_strings.endsWith(baseUri, '/')) {
    baseUri = baseUri.substr(0, baseUri.length - 1);
  }
  // Remove any leading '/'
  if (goog_strings.startsWith(path, '/')) {
    path = path.substr(1);
  }
  return goog_strings.buildString(baseUri, '/', path);
};

/**
 * Replaces the path.
 * @param {string} uri URI to use as the base.
 * @param {string} path New path.
 * @return {string} Updated URI.
 */
function setPath(uri, path) {
  // Add any missing '/'.
  if (!goog_strings.startsWith(path, '/')) {
    path = '/' + path;
  }
  var parts = split(uri);
  return buildFromEncodedParts(
      parts[ComponentIndex.SCHEME],
      parts[ComponentIndex.USER_INFO],
      parts[ComponentIndex.DOMAIN],
      parts[ComponentIndex.PORT], path,
      parts[ComponentIndex.QUERY_DATA],
      parts[ComponentIndex.FRAGMENT]);
};

/**
 * Standard supported query parameters.
 * @enum {string}
 */
let StandardQueryParam = {

  /** Unused parameter for unique-ifying. */
  RANDOM: 'zx'
};

/**
 * Sets the zx parameter of a URI to a random value.
 * @param {string} uri Any URI.
 * @return {string} That URI with the "zx" parameter added or replaced to
 *     contain a random string.
 */
function makeUnique(uri) {
  return setParam(
      uri, StandardQueryParam.RANDOM,
      goog_strings.getRandomString());
};

export {ComponentIndex, QueryArray, QueryValue, StandardQueryParam, appendParam, appendParams, appendParamsFromMap, appendPath, buildFromEncodedParts, buildQueryData, buildQueryDataFromMap, getDomain, getDomainEncoded, getEffectiveScheme, getFragment, getFragmentEncoded, getHost, getOrigin, getParamValue, getParamValues, getPath, getPathAndAfter, getPathEncoded, getPort, getQueryData, getScheme, getUserInfo, getUserInfoEncoded, hasParam, haveSameDomain, makeUnique, parseQueryData, removeFragment, removeParam, setFragmentEncoded, setParam, setParamsFromMap, setPath, split};