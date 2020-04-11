import * as goog_asserts from './../asserts/asserts.js';
import {AssertionError} from './../asserts/asserts.js';
import * as google from './../google.js';
import {Dir} from './../i18n/bidi.js';
import {DirectionalString} from './../i18n/bidi.js';
import {Const} from './../string/const.js';
import {TypedString} from './../string/typedstring.js';
import * as trustedtypes from './trustedtypes.js';
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
 * @fileoverview The TrustedResourceUrl type and its builders.
 *
 * TODO(xtof): Link to document stating type contract.
 */

/**
 * A URL which is under application control and from which script, CSS, and
 * other resources that represent executable code, can be fetched.
 *
 * Given that the URL can only be constructed from strings under application
 * control and is used to load resources, bugs resulting in a malformed URL
 * should not have a security impact and are likely to be easily detectable
 * during testing. Given the wide number of non-RFC compliant URLs in use,
 * stricter validation could prevent some applications from being able to use
 * this type.
 *
 * Instances of this type must be created via the factory method,
 * (`fromConstant`, `fromConstants`, `format` or
 * `formatWithParams`), and not by invoking its constructor. The constructor
 * is organized in a way that only methods from that file can call it and
 * initialize with non-empty values. Anyone else calling constructor will
 * get default instance with empty value.
 *
 * @see TrustedResourceUrl#fromConstant
 * @final
 * @class
 * @implements {DirectionalString}
 * @implements {TypedString}
 *     implementation detail.
 */
class TrustedResourceUrl {

  /**
   * A URL which is under application control and from which script, CSS, and
   * other resources that represent executable code, can be fetched.
   *
   * Given that the URL can only be constructed from strings under application
   * control and is used to load resources, bugs resulting in a malformed URL
   * should not have a security impact and are likely to be easily detectable
   * during testing. Given the wide number of non-RFC compliant URLs in use,
   * stricter validation could prevent some applications from being able to use
   * this type.
   *
   * Instances of this type must be created via the factory method,
   * (`fromConstant`, `fromConstants`, `format` or
   * `formatWithParams`), and not by invoking its constructor. The constructor
   * is organized in a way that only methods from that file can call it and
   * initialize with non-empty values. Anyone else calling constructor will
   * get default instance with empty value.
   *
   * @see TrustedResourceUrl#fromConstant
   * @param {!Object=} opt_token package-internal implementation detail.
   * @param {!TrustedScriptURL|string=} opt_content package-internal
   *     implementation detail.
   */
  constructor(opt_token, opt_content) {
    /**
     * @override
     * @const
     */
    this.implementsGoogStringTypedString = true;
  
    /**
     * @override
     * @const
     */
    this.implementsGoogI18nBidiDirectionalString =
        true;
  
    /**
     * The contained value of this TrustedResourceUrl.  The field has a purposely
     * ugly name to make (non-compiled) code that attempts to directly access this
     * field stand out.
     * @const
     * @private {!TrustedScriptURL|string}
     */
    this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ =
        ((opt_token ===
          TrustedResourceUrl.CONSTRUCTOR_TOKEN_PRIVATE_) &&
         opt_content) ||
        '';
  
    /**
     * A type marker used to implement additional run-time type checking.
     * @see TrustedResourceUrl#unwrap
     * @const {!Object}
     * @private
     */
    this.TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ =
        TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_;
  }

  /**
   * Returns this TrustedResourceUrl's value as a string.
   *
   * IMPORTANT: In code where it is security relevant that an object's type is
   * indeed `TrustedResourceUrl`, use
   * `TrustedResourceUrl.unwrap` instead of this method. If in
   * doubt, assume that it's security relevant. In particular, note that
   * google.html functions which return a google.html type do not guarantee that
   * the returned instance is of the right type. For example:
   *
   * <pre>
   * var fakeSafeHtml = new String('fake');
   * fakeSafeHtml.__proto__ = goog.html.SafeHtml.prototype;
   * var newSafeHtml = goog.html.SafeHtml.htmlEscape(fakeSafeHtml);
   * // newSafeHtml is just an alias for fakeSafeHtml, it's passed through by
   * // goog.html.SafeHtml.htmlEscape() as fakeSafeHtml instanceof
   * // goog.html.SafeHtml.
   * </pre>
   *
   * @see TrustedResourceUrl#unwrap
   * @override
   */
  getTypedStringValue() {
    return this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_
        .toString();
  };

  /**
   * Returns this URLs directionality, which is always `LTR`.
   * @override
   */
  getDirection() {
    return Dir.LTR;
  };

  /**
   * Creates a new TrustedResourceUrl with params added to URL. Both search and
   * hash params can be specified.
   *
   * @param {string|?Object<string, *>|undefined} searchParams Search parameters
   *     to add to URL. See TrustedResourceUrl.stringifyParams_ for
   *     exact format definition.
   * @param {(string|?Object<string, *>)=} opt_hashParams Hash parameters to add
   *     to URL. See TrustedResourceUrl.stringifyParams_ for exact
   *     format definition.
   * @return {!TrustedResourceUrl} New TrustedResourceUrl with params.
   */
  cloneWithParams(
      searchParams, opt_hashParams) {
    var url = TrustedResourceUrl.unwrap(this);
    var parts = TrustedResourceUrl.URL_PARAM_PARSER_.exec(url);
    var urlBase = parts[1];
    var urlSearch = parts[2] || '';
    var urlHash = parts[3] || '';
  
    return TrustedResourceUrl
        .createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(
            urlBase +
            TrustedResourceUrl.stringifyParams_(
                '?', urlSearch, searchParams) +
            TrustedResourceUrl.stringifyParams_(
                '#', urlHash, opt_hashParams));
  };

  /**
   * Performs a runtime check that the provided object is indeed a
   * TrustedResourceUrl object, and returns its value.
   *
   * @param {!TrustedResourceUrl} trustedResourceUrl The object to
   *     extract from.
   * @return {string} The trustedResourceUrl object's contained string, unless
   *     the run-time type check fails. In that case, `unwrap` returns an
   *     innocuous string, or, if assertions are enabled, throws
   *     `AssertionError`.
   */
  static unwrap(trustedResourceUrl) {
    return TrustedResourceUrl.unwrapTrustedScriptURL(trustedResourceUrl)
        .toString();
  };

  /**
   * Unwraps value as TrustedScriptURL if supported or as a string if not.
   * @param {!TrustedResourceUrl} trustedResourceUrl
   * @return {!TrustedScriptURL|string}
   * @see TrustedResourceUrl.unwrap
   */
  static unwrapTrustedScriptURL(
      trustedResourceUrl) {
    // Perform additional Run-time type-checking to ensure that
    // trustedResourceUrl is indeed an instance of the expected type.  This
    // provides some additional protection against security bugs due to
    // application code that disables type checks.
    // Specifically, the following checks are performed:
    // 1. The object is an instance of the expected type.
    // 2. The object is not an instance of a subclass.
    // 3. The object carries a type marker for the expected type. "Faking" an
    // object requires a reference to the type marker, which has names intended
    // to stand out in code reviews.
    if (trustedResourceUrl instanceof TrustedResourceUrl &&
        trustedResourceUrl.constructor === TrustedResourceUrl &&
        trustedResourceUrl
                .TRUSTED_RESOURCE_URL_TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ ===
            TrustedResourceUrl
                .TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_) {
      return trustedResourceUrl
          .privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_;
    } else {
      goog_asserts.fail('expected object of type TrustedResourceUrl, got \'' +
          trustedResourceUrl + '\' of type ' + google.typeOf(trustedResourceUrl));
      return 'type_error:TrustedResourceUrl';
    }
  };

  /**
   * Creates a TrustedResourceUrl from a format string and arguments.
   *
   * The arguments for interpolation into the format string map labels to values.
   * Values of type `Const` are interpolated without modifcation.
   * Values of other types are cast to string and encoded with
   * encodeURIComponent.
   *
   * `%{<label>}` markers are used in the format string to indicate locations
   * to be interpolated with the valued mapped to the given label. `<label>`
   * must contain only alphanumeric and `_` characters.
   *
   * The format string must match TrustedResourceUrl.BASE_URL_.
   *
   * Example usage:
   *
   *    var url = TrustedResourceUrl.format(Const.from(
   *        'https://www.google.com/search?q=%{query}'), {'query': searchTerm});
   *
   *    var url = TrustedResourceUrl.format(Const.from(
   *        '//www.youtube.com/v/%{videoId}?hl=en&fs=1%{autoplay}'), {
   *        'videoId': videoId,
   *        'autoplay': opt_autoplay ?
   *            Const.from('&autoplay=1') : Const.EMPTY
   *    });
   *
   * While this function can be used to create a TrustedResourceUrl from only
   * constants, fromConstant() and fromConstants() are generally preferable for
   * that purpose.
   *
   * @param {!Const} format The format string.
   * @param {!Object<string, (string|number|!Const)>} args Mapping
   *     of labels to values to be interpolated into the format string.
   *     Const values are interpolated without encoding.
   * @return {!TrustedResourceUrl}
   * @throws {!Error} On an invalid format string or if a label used in the
   *     the format string is not present in args.
   */
  static format(format, args) {
    var formatStr = Const.unwrap(format);
    if (!TrustedResourceUrl.BASE_URL_.test(formatStr)) {
      throw new Error('Invalid TrustedResourceUrl format: ' + formatStr);
    }
    var result = formatStr.replace(
        TrustedResourceUrl.FORMAT_MARKER_, function(match, id) {
          if (!Object.prototype.hasOwnProperty.call(args, id)) {
            throw new Error(
                'Found marker, "' + id + '", in format string, "' + formatStr +
                '", but no valid label mapping found ' +
                'in args: ' + JSON.stringify(args));
          }
          var arg = args[id];
          if (arg instanceof Const) {
            return Const.unwrap(arg);
          } else {
            return encodeURIComponent(String(arg));
          }
        });
    return TrustedResourceUrl
        .createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(result);
  };

  /**
   * Formats the URL same as TrustedResourceUrl.format and then adds extra URL
   * parameters.
   *
   * Example usage:
   *
   *     // Creates '//www.youtube.com/v/abc?autoplay=1' for videoId='abc' and
   *     // opt_autoplay=1. Creates '//www.youtube.com/v/abc' for videoId='abc'
   *     // and opt_autoplay=undefined.
   *     var url = TrustedResourceUrl.formatWithParams(
   *         Const.from('//www.youtube.com/v/%{videoId}'),
   *         {'videoId': videoId},
   *         {'autoplay': opt_autoplay});
   *
   * @param {!Const} format The format string.
   * @param {!Object<string, (string|number|!Const)>} args Mapping
   *     of labels to values to be interpolated into the format string.
   *     Const values are interpolated without encoding.
   * @param {string|?Object<string, *>|undefined} searchParams Parameters to add
   *     to URL. See TrustedResourceUrl.stringifyParams_ for exact
   *     format definition.
   * @param {(string|?Object<string, *>)=} opt_hashParams Hash parameters to add
   *     to URL. See TrustedResourceUrl.stringifyParams_ for exact
   *     format definition.
   * @return {!TrustedResourceUrl}
   * @throws {!Error} On an invalid format string or if a label used in the
   *     the format string is not present in args.
   */
  static formatWithParams(
      format, args, searchParams, opt_hashParams) {
    var url = TrustedResourceUrl.format(format, args);
    return url.cloneWithParams(searchParams, opt_hashParams);
  };

  /**
   * Creates a TrustedResourceUrl object from a compile-time constant string.
   *
   * Compile-time constant strings are inherently program-controlled and hence
   * trusted.
   *
   * @param {!Const} url A compile-time-constant string from which to
   *     create a TrustedResourceUrl.
   * @return {!TrustedResourceUrl} A TrustedResourceUrl object
   *     initialized to `url`.
   */
  static fromConstant(url) {
    return TrustedResourceUrl
        .createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(
            Const.unwrap(url));
  };

  /**
   * Creates a TrustedResourceUrl object from a compile-time constant strings.
   *
   * Compile-time constant strings are inherently program-controlled and hence
   * trusted.
   *
   * @param {!Array<!Const>} parts Compile-time-constant strings from
   *     which to create a TrustedResourceUrl.
   * @return {!TrustedResourceUrl} A TrustedResourceUrl object
   *     initialized to concatenation of `parts`.
   */
  static fromConstants(parts) {
    var unwrapped = '';
    for (var i = 0; i < parts.length; i++) {
      unwrapped += Const.unwrap(parts[i]);
    }
    return TrustedResourceUrl
        .createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(unwrapped);
  };

  /**
   * Stringifies the passed params to be used as either a search or hash field of
   * a URL.
   *
   * @param {string} prefix The prefix character for the given field ('?' or '#').
   * @param {string} currentString The existing field value (including the prefix
   *     character, if the field is present).
   * @param {string|?Object<string, *>|undefined} params The params to set or
   *     append to the field.
   * - If `undefined` or `null`, the field remains unchanged.
   * - If a string, then the string will be escaped and the field will be
   *   overwritten with that value.
   * - If an Object, that object is treated as a set of key-value pairs to be
   *   appended to the current field. Note that JavaScript doesn't guarantee the
   *   order of values in an object which might result in non-deterministic order
   *   of the parameters. However, browsers currently preserve the order. The
   *   rules for each entry:
   *   - If an array, it will be processed as if each entry were an additional
   *     parameter with exactly the same key, following the same logic below.
   *   - If `undefined` or `null`, it will be skipped.
   *   - Otherwise, it will be turned into a string, escaped, and appended.
   * @return {string}
   * @private
   */
  static stringifyParams_(
      prefix, currentString, params) {
    if (params == null) {
      // Do not modify the field.
      return currentString;
    }
    if (typeof params === 'string') {
      // Set field to the passed string.
      return params ? prefix + encodeURIComponent(params) : '';
    }
    // Add on parameters to field from key-value object.
    for (var key in params) {
      var value = params[key];
      var outputValues = google.isArray(value) ? value : [value];
      for (var i = 0; i < outputValues.length; i++) {
        var outputValue = outputValues[i];
        if (outputValue != null) {
          if (!currentString) {
            currentString = prefix;
          }
          currentString += (currentString.length > prefix.length ? '&' : '') +
              encodeURIComponent(key) + '=' +
              encodeURIComponent(String(outputValue));
        }
      }
    }
    return currentString;
  };
}

/**
 * @private @const {!RegExp}
 */
TrustedResourceUrl.FORMAT_MARKER_ = /%{(\w+)}/g;

/**
 * The URL must be absolute, scheme-relative or path-absolute. So it must
 * start with:
 * - https:// followed by allowed origin characters.
 * - // followed by allowed origin characters.
 * - Any absolute or relative path.
 *
 * Based on
 * https://url.spec.whatwg.org/commit-snapshots/56b74ce7cca8883eab62e9a12666e2fac665d03d/#url-parsing
 * an initial / which is not followed by another / or \ will end up in the "path
 * state" and from there it can only go to "fragment state" and "query state".
 *
 * We don't enforce a well-formed domain name. So '.' or '1.2' are valid.
 * That's ok because the origin comes from a compile-time constant.
 *
 * A regular expression is used instead of google.uri for several reasons:
 * - Strictness. E.g. we don't want any userinfo component and we don't
 *   want '/./, nor \' in the first path component.
 * - Small trusted base. google.uri is generic and might need to change,
 *   reasoning about all the ways it can parse a URL now and in the future
 *   is error-prone.
 * - Code size. We expect many calls to .format(), many of which might
 *   not be using goog.uri.
 * - Simplicity. Using google.uri would likely not result in simpler nor shorter
 *   code.
 * @private @const {!RegExp}
 */
TrustedResourceUrl.BASE_URL_ = new RegExp(
    '^((https:)?//[0-9a-z.:[\\]-]+/'  // Origin.
        + '|/[^/\\\\]'                // Absolute path.
        + '|[^:/\\\\%]+/'             // Relative path.
        + '|[^:/\\\\%]*[?#]'          // Query string or fragment.
        + '|about:blank#'             // about:blank with fragment.
        + ')',
    'i');

/**
 * RegExp for splitting a URL into the base, search field, and hash field.
 *
 * @private @const {!RegExp}
 */
TrustedResourceUrl.URL_PARAM_PARSER_ =
    /^([^?#]*)(\?[^#]*)?(#[\s\S]*)?/;

/**
 * Type marker for the TrustedResourceUrl type, used to implement additional
 * run-time type checking.
 * @const {!Object}
 * @private
 */
TrustedResourceUrl.TYPE_MARKER_GOOG_HTML_SECURITY_PRIVATE_ = {};

/**
 * Package-internal utility method to create TrustedResourceUrl instances.
 *
 * @param {string} url The string to initialize the TrustedResourceUrl object
 *     with.
 * @return {!TrustedResourceUrl} The initialized TrustedResourceUrl
 *     object.
 * @package
 */
TrustedResourceUrl
    .createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse = function(url) {
  var value = trustedtypes.PRIVATE_DO_NOT_ACCESS_OR_ELSE_POLICY ?
      trustedtypes.PRIVATE_DO_NOT_ACCESS_OR_ELSE_POLICY
          .createScriptURL(url) :
      url;
  return new TrustedResourceUrl(
      TrustedResourceUrl.CONSTRUCTOR_TOKEN_PRIVATE_, value);
};

/**
 * Token used to ensure that object is created only from this file. No code
 * outside of this file can access this token.
 * @private {!Object}
 * @const
 */
TrustedResourceUrl.CONSTRUCTOR_TOKEN_PRIVATE_ = {};

export {TrustedResourceUrl};