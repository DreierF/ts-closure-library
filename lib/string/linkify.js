import {SafeHtml} from './../html/safehtml.js';
import * as uncheckedconversions from './../html/uncheckedconversions.js';
import {Const} from './const.js';
import * as strings from './string.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Utility function for linkifying text.
 */

/**
 * Options bag for linkifyPlainTextAsHtml's second parameter.
 * @private
 * @record
 */
class LinkifyOptions_ {
  constructor() {
    /**
     * HTML attributes to add to all links created.  Default are `rel=nofollow`
     * and `target=_blank`. To clear these defaults attributes, set them
     * explicitly to '', i.e. `{rel: '', target: ''}`.
     * @const {!Object<string, ?SafeHtml.AttributeValue>|undefined}
     */
    this.attributes;
    /**
     * Whether to preserve newlines with &lt;br&gt;.
     * @const {boolean|undefined}
     */
    this.preserveNewlines;
    /**
     * Whether to preserve spaces with non-breaking spaces and tabs with
     * &lt;span style="white-space:pre"&gt;
     * @const {boolean|undefined}
     */
    this.preserveSpacesAndTabs;
  }
};

/**
 * Takes a string of plain text and linkifies URLs and email addresses. For a
 * URL (unless opt_attributes is specified), the target of the link will be
 * _blank and it will have a rel=nofollow attribute applied to it so that links
 * created by linkify will not be of interest to search engines.
 * @param {string} text Plain text.
 * @param {!LinkifyOptions_|
 *         !Object<string, ?SafeHtml.AttributeValue>=} opt_attributes
 *     Attributes to add to all links created. Default are rel=nofollow and
 *     target=_blank. To clear those default attributes set rel='' and
 *     target=''.
 * @param {boolean=} opt_preserveNewlines Whether to preserve newlines with
 *     &lt;br&gt;.
 * @param {boolean=} opt_preserveSpacesAndTabs Whether to preserve spaces with
 *     non-breaking spaces and tabs with <span style="white-space:pre">
 * @return {!SafeHtml} Linkified HTML. Any text that is not part of a
 *      link will be HTML-escaped.
 */
function linkifyPlainTextAsHtml(
    text, opt_attributes, opt_preserveNewlines, opt_preserveSpacesAndTabs) {
  if (opt_attributes &&
      (opt_attributes.attributes || opt_attributes.preserveNewlines ||
       opt_attributes.preserveSpacesAndTabs)) {
    opt_preserveNewlines = opt_attributes.preserveNewlines;
    opt_preserveSpacesAndTabs = opt_attributes.preserveSpacesAndTabs;
    opt_attributes = opt_attributes.attributes;
  }
  const /** !Object<?SafeHtml.AttributeValue> */ attributes =
      opt_attributes || {};

  /**
   * @param {string} plainText
   * @return {!SafeHtml} html
   */
  function htmlEscape(plainText) {
    if (opt_preserveSpacesAndTabs) {
      const html = SafeHtml.htmlEscape(plainText);
      let modifiedHtml =
          SafeHtml
              .unwrap(html)
              // Leading space is converted into a non-breaking space, and
              // spaces following whitespace are converted into non-breaking
              // spaces. This must happen first, to ensure we preserve spaces
              // after newlines.
              .replace(/(^|[\n\r\t\ ])\ /g, '$1&#160;')
              // Preserve tabs by using style="white-space:pre"
              .replace(/(\t+)/g, '<span style="white-space:pre">$1</span>');
      if (opt_preserveNewlines) {
        modifiedHtml = strings.newLineToBr(modifiedHtml);
      }
      return uncheckedconversions
          .safeHtmlFromStringKnownToSatisfyTypeContract(
              Const.from('Escaped plain text'), modifiedHtml,
              html.getDirection());
    } else if (opt_preserveNewlines) {
      return SafeHtml.htmlEscapePreservingNewlines(plainText);
    } else {
      return SafeHtml.htmlEscape(plainText);
    }
  };

  // This shortcut makes linkifyPlainText ~10x faster if text doesn't contain
  // URLs or email addresses and adds insignificant performance penalty if it
  // does.
  if (text.indexOf('@') == -1 && text.indexOf('://') == -1 &&
      text.indexOf('www.') == -1 && text.indexOf('Www.') == -1 &&
      text.indexOf('WWW.') == -1) {
    return htmlEscape(text);
  }

  const attributesMap = {};
  for (let key in attributes) {
    if (!attributes[key]) {
      // Our API allows '' to omit the attribute, SafeHtml requires null.
      attributesMap[key] = null;
    } else {
      attributesMap[key] = attributes[key];
    }
  }
  // Set default options if they haven't been explicitly set.
  if (!('rel' in attributesMap)) {
    attributesMap['rel'] = 'nofollow';
  }
  if (!('target' in attributesMap)) {
    attributesMap['target'] = '_blank';
  }

  const output = [];
  // Return value is ignored.
  text.replace(
      FIND_LINKS_RE_,
      function(part, before, original, email, protocol) {
        output.push(htmlEscape(before));
        if (!original) {
          return '';
        }
        let href = '';
        /** @type {string} */
        let linkText;
        /** @type {string} */
        let afterLink;
        if (email) {
          href = 'mailto:';
          linkText = email;
          afterLink = '';
        } else {
          // This is a full url link.
          if (!protocol) {
            href = 'http://';
          }
          const splitEndingPunctuation =
              original.match(ENDS_WITH_PUNCTUATION_RE_);
          // An open paren in the link will often be matched with a close paren
          // at the end, so skip cutting off ending punctuation if
          // opening/closing parens are matched in the link. Same for curly
          // brackets. For example:
          // End symbol is linkified:
          // * http://en.wikipedia.org/wiki/Titanic_(1997_film)
          // * http://google.com/abc{arg=1}
          // e.g. needEndingPunctuationForBalance for split
          // 'http://google.com/abc{arg=', and '} is true.
          // End symbol is not linkified because there is no open parens to
          // close in the link itself, as the open parens occurs before the URL:
          // * (http://google.com/)
          // e.g. needEndingPunctuationForBalance for split 'http://google.com/
          // and ')' is false.
          function needEndingPunctuationForBalance(
              split, openSymbol, closeSymbol) {
            return strings.contains(split[2], closeSymbol) &&
                strings.countOf(split[1], openSymbol) >
                strings.countOf(split[1], closeSymbol);
          }
          if (splitEndingPunctuation &&
              !needEndingPunctuationForBalance(
                  splitEndingPunctuation, '(', ')') &&
              !needEndingPunctuationForBalance(
                  splitEndingPunctuation, '{', '}')) {
            linkText = splitEndingPunctuation[1];
            afterLink = splitEndingPunctuation[2];
          } else {
            linkText = original;
            afterLink = '';
          }
        }
        attributesMap['href'] = href + linkText;
        output.push(SafeHtml.create('a', attributesMap, linkText));
        output.push(htmlEscape(afterLink));
        return '';
      });
  return SafeHtml.concat(output);
};

/**
 * Gets the first URI in text.
 * @param {string} text Plain text.
 * @return {string} The first URL, or an empty string if not found.
 */
function findFirstUrl(text) {
  const link = text.match(URL_RE_);
  return link != null ? link[0] : '';
};

/**
 * Gets the first email address in text.
 * @param {string} text Plain text.
 * @return {string} The first email address, or an empty string if not found.
 */
function findFirstEmail(text) {
  const email = text.match(EMAIL_RE_);
  return email != null ? email[0] : '';
};

/**
 * If a series of these characters is at the end of a url, it will be considered
 * punctuation and not part of the url.
 * @type {string}
 * @const
 * @private
 */
let ENDING_PUNCTUATION_CHARS_ = '\':;,\\.?}\\]\\)!';

/**
 * @type {!RegExp}
 * @const
 * @private
 */
let ENDS_WITH_PUNCTUATION_RE_ = new RegExp(
    '^(.*?)([' + ENDING_PUNCTUATION_CHARS_ + ']+)$');

/**
 * Set of characters to be put into a regex character set ("[...]"), used to
 * match against a url hostname and everything after it. It includes, in order,
 * \w which represents [a-zA-Z0-9_], "#-;" which represents the characters
 * "#$%&'()*+,-./0123456789:;" and the characters "!=?@[\]`{|}~".
 * @type {string}
 * @const
 * @private
 */
let ACCEPTABLE_URL_CHARS_ = '\\w#-;!=?@\\[\\\\\\]_`{|}~';

/**
 * List of all protocols patterns recognized in urls (mailto is handled in email
 * matching).
 * @type {!Array<string>}
 * @const
 * @private
 */
let RECOGNIZED_PROTOCOLS_ = ['https?', 'ftp'];

/**
 * Regular expression pattern that matches the beginning of an url.
 * Contains a catching group to capture the scheme.
 * @type {string}
 * @const
 * @private
 */
let PROTOCOL_START_ =
    '(' + RECOGNIZED_PROTOCOLS_.join('|') + ')://';

/**
 * Regular expression pattern that matches the beginning of a typical
 * http url without the http:// scheme.
 * @type {string}
 * @const
 * @private
 */
let WWW_START_ = 'www\\.';

/**
 * Regular expression pattern that matches an url.
 * @type {string}
 * @const
 * @private
 */
let URL_RE_STRING_ =
    '(?:' + PROTOCOL_START_ + '|' +
    WWW_START_ + ')[' +
    ACCEPTABLE_URL_CHARS_ + ']+';

/**
 * Regular expression that matches an url. Case-insensitive.
 * @type {!RegExp}
 * @const
 * @private
 */
let URL_RE_ =
    new RegExp(URL_RE_STRING_, 'i');

/**
 * Regular expression pattern that matches a top level domain.
 * @type {string}
 * @const
 * @private
 */
let TOP_LEVEL_DOMAIN_ = '(?:com|org|net|edu|gov' +
    // from http://www.iana.org/gtld/gtld.htm
    '|aero|biz|cat|coop|info|int|jobs|mobi|museum|name|pro|travel' +
    '|arpa|asia|xxx' +
    // a two letter country code
    '|[a-z][a-z])\\b';

/**
 * Regular expression pattern that matches an email.
 * Contains a catching group to capture the email without the optional "mailto:"
 * prefix.
 * @type {string}
 * @const
 * @private
 */
let EMAIL_RE_STRING_ =
    '(?:mailto:)?([\\w.!#$%&\'*+-/=?^_`{|}~]+@[A-Za-z0-9.-]+\\.' +
    TOP_LEVEL_DOMAIN_ + ')';

/**
 * Regular expression that matches an email. Case-insensitive.
 * @type {!RegExp}
 * @const
 * @private
 */
let EMAIL_RE_ =
    new RegExp(EMAIL_RE_STRING_, 'i');

/**
 * Regular expression to match all the links (url or email) in a string.
 * First match is text before first link, might be empty string.
 * Second match is the original text that should be replaced by a link.
 * Third match is the email address in the case of an email.
 * Fourth match is the scheme of the url if specified.
 * @type {!RegExp}
 * @const
 * @private
 */
let FIND_LINKS_RE_ = new RegExp(
    // Match everything including newlines.
    '([\\S\\s]*?)(' +
        // Match email after a word break.
        '\\b' + EMAIL_RE_STRING_ + '|' +
        // Match url after a word break.
        '\\b' + URL_RE_STRING_ + '|$)',
    'gi');

export {findFirstEmail, findFirstUrl, linkifyPlainTextAsHtml};