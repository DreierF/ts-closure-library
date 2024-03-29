import * as asserts from './../asserts/asserts.js';
import * as fsblob from './../fs/blob.js';
import * as fsurl from './../fs/url.js';
import * as google from './../google.js';
import {Dir} from './../i18n/bidi.js';
import {DirectionalString} from './../i18n/bidi.js';
import {Const} from './../string/const.js';
import {TypedString} from './../string/typedstring.js';
import {SafeScript} from './safescript.js';
import * as trustedtypes from './trustedtypes.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

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
 * (`fromConstant`, `fromConstants`, `format` or `formatWithParams`), and not by
 * invoking its constructor. The constructor intentionally takes an extra
 * parameter that cannot be constructed outside of this file and the type is
 * immutable; hence only a default instance corresponding to the empty string
 * can be obtained via constructor invocation.
 *
 * Creating TrustedResourceUrl objects HAS SIDE-EFFECTS due to calling
 * Trusted Types Web API.
 *
 * @see TrustedResourceUrl#fromConstant
 * @final
 * @struct
 * @implements {DirectionalString}
 * @implements {TypedString}
 */
class TrustedResourceUrl {
  /**
   * @param {!TrustedScriptURL|string} value
   * @param {!Object} token package-internal implementation detail.
   */
  constructor(value, token) {
    /**
     * The contained value of this TrustedResourceUrl.  The field has a
     * purposely ugly name to make (non-compiled) code that attempts to directly
     * access this field stand out.
     * @const
     * @private {!TrustedScriptURL|string}
     */
    this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ =
        (token === TrustedResourceUrl.CONSTRUCTOR_TOKEN_PRIVATE_) ?
        value :
        '';
  }
};

/**
 * @override
 * @const
 */
TrustedResourceUrl.prototype.implementsGoogStringTypedString = true;

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
TrustedResourceUrl.prototype.getTypedStringValue = function() {
  return this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_
      .toString();
};

/**
 * @override
 * @const
 */
TrustedResourceUrl.prototype.implementsGoogI18nBidiDirectionalString =
    true;

/**
 * Returns this URLs directionality, which is always `LTR`.
 * @override
 * @return {!Dir}
 */
TrustedResourceUrl.prototype.getDirection = function() {
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
TrustedResourceUrl.prototype.cloneWithParams = function(
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
 * Returns a string-representation of this value.
 *
 * To obtain the actual string value wrapped in a TrustedResourceUrl, use
 * `TrustedResourceUrl.unwrap`.
 *
 * @return {string}
 * @see TrustedResourceUrl#unwrap
 * @override
 */
TrustedResourceUrl.prototype.toString = function() {
  return this.privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_ + '';
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
 *     `asserts.AssertionError`.
 */
TrustedResourceUrl.unwrap = function(trustedResourceUrl) {
  return TrustedResourceUrl.unwrapTrustedScriptURL(trustedResourceUrl)
      .toString();
};

/**
 * Unwraps value as TrustedScriptURL if supported or as a string if not.
 * @param {!TrustedResourceUrl} trustedResourceUrl
 * @return {!TrustedScriptURL|string}
 * @see TrustedResourceUrl.unwrap
 */
TrustedResourceUrl.unwrapTrustedScriptURL = function(
    trustedResourceUrl) {
  // Perform additional Run-time type-checking to ensure that
  // trustedResourceUrl is indeed an instance of the expected type.  This
  // provides some additional protection against security bugs due to
  // application code that disables type checks.
  // Specifically, the following checks are performed:
  // 1. The object is an instance of the expected type.
  // 2. The object is not an instance of a subclass.
  if (trustedResourceUrl instanceof TrustedResourceUrl &&
      trustedResourceUrl.constructor === TrustedResourceUrl) {
    return trustedResourceUrl
        .privateDoNotAccessOrElseTrustedResourceUrlWrappedValue_;
  } else {
    asserts.fail('expected object of type TrustedResourceUrl, got \'' +
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
TrustedResourceUrl.format = function(format, args) {
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
TrustedResourceUrl.formatWithParams = function(
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
TrustedResourceUrl.fromConstant = function(url) {
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
TrustedResourceUrl.fromConstants = function(parts) {
  var unwrapped = '';
  for (var i = 0; i < parts.length; i++) {
    unwrapped += Const.unwrap(parts[i]);
  }
  return TrustedResourceUrl
      .createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(unwrapped);
};

/**
 * Creates a TrustedResourceUrl object by generating a Blob from a SafeScript
 * object and then calling createObjectURL with that blob.
 *
 * SafeScript objects are trusted to contain executable JavaScript code.
 *
 * Caller must call fsurl.revokeObjectUrl() on the unwrapped url to
 * release the underlying blob.
 *
 * Throws if browser doesn't support blob construction.
 *
 * @param {!SafeScript} safeScript A script from which to create a
 *     TrustedResourceUrl.
 * @return {!TrustedResourceUrl} A TrustedResourceUrl object
 *     initialized to a new blob URL.
 */
TrustedResourceUrl.fromSafeScript = function(safeScript) {
  var blob = fsblob.getBlobWithProperties(
      [SafeScript.unwrap(safeScript)], 'text/javascript');
  var url = fsurl.createObjectUrl(blob);
  return TrustedResourceUrl
      .createTrustedResourceUrlSecurityPrivateDoNotAccessOrElse(url);
};

/**
 * Token used to ensure that object is created only from this file. No code
 * outside of this file can access this token.
 * @private {!Object}
 * @const
 */
TrustedResourceUrl.CONSTRUCTOR_TOKEN_PRIVATE_ = {};

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
  const policy = trustedtypes.getPolicyPrivateDoNotAccessOrElse();
  var value = policy ? policy.createScriptURL(url) : url;
  return new TrustedResourceUrl(
      value, TrustedResourceUrl.CONSTRUCTOR_TOKEN_PRIVATE_);
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
TrustedResourceUrl.stringifyParams_ = function(
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
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/hasOwnProperty#Using_hasOwnProperty_as_a_property_name
    if (Object.prototype.hasOwnProperty.call(params, key)) {
      var value = params[key];
      var outputValues = Array.isArray(value) ? value : [value];
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
  }
  return currentString;
};

export {TrustedResourceUrl};