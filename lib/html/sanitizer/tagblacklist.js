/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Contains the tag blacklist for use in the Html sanitizer.
 */

/**
 * A list of tags which should be removed entirely from the DOM, rather than
 * merely being made inert. In that sense, this is not a "true" blacklist
 * because removing a tag here without adding it to the whitelist does not have
 * security implications. Tag names must be in all caps. Note that even if
 * TEMPLATE is removed from this blacklist (or even whitelisted) it will
 * continue to be removed from the HTML, as TEMPLATE is used interally to
 * denote nodes which should not be added to the sanitized HTML.
 * @const @dict {boolean}
 */
let TagBlacklist = {
  'APPLET': true,
  'AUDIO': true,
  'BASE': true,
  'BGSOUND': true,
  'EMBED': true,
  // Blacklisted by default, can be allowed using allowFormTag.
  'FORM': true,
  // NOTE: can remove this for old browser behavior
  'IFRAME': true,
  // Can result in network requests
  'ISINDEX': true,
  // Unused and just unnecessarily increase attack surface
  'KEYGEN': true,
  'LAYER': true,
  'LINK': true,
  'META': true,
  'OBJECT': true,
  'SCRIPT': true,
  // Can result in an XSS in FF
  // https://bugzilla.mozilla.org/show_bug.cgi?id=1205631
  'SVG': true,
  // Blacklisted by default, can be allowed using allowStyleTag.
  'STYLE': true,
  // Unsafe in most cases, and sanitizing its contents is not supported by the
  // underlying SafeDomTreeProcessor.
  'TEMPLATE': true,
  'VIDEO': true
};

export {TagBlacklist};