import * as dom from './../dom/dom.js';
import * as domsafe from './../dom/safe.js';
import {TagName} from './../dom/tagname.js';
import {SafeUrl as Html_SafeUrl} from './../html/safeurl.js';
import * as uncheckedconversions from './../html/uncheckedconversions.js';
import * as platform from './../labs/useragent/platform.js';
import {Const} from './../string/const.js';
import * as strings from './../string/string.js';
import {TypedString} from './../string/typedstring.js';
import * as userAgent from './../useragent/useragent.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Utilities for window manipulation.
 */

/**
 * Default height for popup windows
 * @type {number}
 */
let DEFAULT_POPUP_HEIGHT = 500;

/**
 * Default width for popup windows
 * @type {number}
 */
let DEFAULT_POPUP_WIDTH = 690;

/**
 * Default target for popup windows
 * @type {string}
 */
let DEFAULT_POPUP_TARGET = 'google_popup';

/**
 * @return {!Window}
 * @suppress {checkTypes}
 * @private
 */
function createFakeWindow_() {
  return /** @type {!Window} */ ({});
};

/**
 * Opens a new window.
 *
 * @param {!Html_SafeUrl|string|!Object|null} linkRef If an Object with an
 *     'href' attribute (such as HTMLAnchorElement) is passed then the value of
 *     'href' is used, otherwise its toString method is called. Note that if a
 *     string|Object is used, it will be sanitized with SafeUrl.sanitize().
 *
 * @param {?Object=} opt_options supports the following options:
 *  'target': (string) target (window name). If null, linkRef.target will
 *      be used.
 *  'width': (number) window width.
 *  'height': (number) window height.
 *  'top': (number) distance from top of screen
 *  'left': (number) distance from left of screen
 *  'toolbar': (boolean) show toolbar
 *  'scrollbars': (boolean) show scrollbars
 *  'location': (boolean) show location
 *  'statusbar': (boolean) show statusbar
 *  'menubar': (boolean) show menubar
 *  'resizable': (boolean) resizable
 *  'noreferrer': (boolean) whether to attempt to remove the referrer header
 *      from the request headers. Does this by opening a blank window that
 *      then redirects to the target url, so users may see some flickering.
 *  'noopener': (boolean) whether to remove the `opener` property from the
 *      window object of the newly created window. The property contains a
 *      reference to the original window, and can be used to launch a
 *      reverse tabnabbing attack.
 *
 * @param {?Window=} opt_parentWin Parent window that should be used to open the
 *                 new window.
 *
 * @return {?Window} Returns the window object that was opened. This returns
 *                  null if a popup blocker prevented the window from being
 *                  opened. In case when a new window is opened in a different
 *                  browser sandbox (such as iOS standalone mode), the returned
 *                  object is a emulated Window object that functions as if
 *                  a cross-origin window has been opened.
 */
function open(linkRef, opt_options, opt_parentWin) {
  if (!opt_options) {
    opt_options = {};
  }
  var parentWin = opt_parentWin || window;

  /** @type {!Html_SafeUrl} */
  var safeLinkRef;

  if (linkRef instanceof Html_SafeUrl) {
    safeLinkRef = linkRef;
  } else {
    // HTMLAnchorElement has a toString() method with the same behavior as
    // google.Uri in all browsers except for Safari, which returns
    // '[object HTMLAnchorElement]'.  We check for the href first, then
    // assume that it's a google.Uri or String otherwise.
    /**
     * @type {string|!TypedString}
     * @suppress {missingProperties}
     */
    var url =
        typeof linkRef.href != 'undefined' ? linkRef.href : String(linkRef);
    safeLinkRef = Html_SafeUrl.sanitize(url);
  }

  /** @suppress {strictMissingProperties} */
  const browserSupportsCoop = self.crossOriginIsolated !== undefined;
  let referrerPolicy = 'strict-origin-when-cross-origin';
  if (window.Request) {
    /** @suppress {missingProperties} */
    referrerPolicy = new Request('/').referrerPolicy;
  }
  const pageSetsUnsafeReferrerPolicy = referrerPolicy === 'unsafe-url';

  // Opening popups with `noreferrer` and a COOP policy of
  // `same-origin-allow-popups` doesn't work. The below is a workaround
  // for this browser limitation.
  let noReferrerOption = opt_options['noreferrer'];
  if (browserSupportsCoop && noReferrerOption) {
    if (pageSetsUnsafeReferrerPolicy) {
      // If the browser supports COOP, and the page explicitly sets a
      // referrer-policy of `unsafe-url`, and the caller requests that the
      // referrer is hidden, then things may break. We can't support the
      // noreferrer option in this case, but ignoring it is potentially unsafe
      // since the page is configured to expose the full URL. We just throw in
      // this case so that callers can make a decision as to what they want to
      // do here.
      throw new Error(
          'Cannot use the noreferrer option on a page that sets a referrer-policy of `unsafe-url` in modern browsers!');
    }
    // Any browser that supports COOP defaults to a referrer policy that hides
    // the full URL. So we don't need to explicitly hide the referrer ourselves
    // and can instead rely on the browser's default referrer policy to hide the
    // referrer.
    noReferrerOption = false;
  }

  /** @suppress {missingProperties} loose references to 'target' */
  /** @suppress {strictMissingProperties} */
  var target = opt_options.target || linkRef.target;

  var sb = [];
  for (var option in opt_options) {
    switch (option) {
      case 'width':
      case 'height':
      case 'top':
      case 'left':
        sb.push(option + '=' + opt_options[option]);
        break;
      case 'target':
      case 'noopener':
      case 'noreferrer':
        break;
      default:
        sb.push(option + '=' + (opt_options[option] ? 1 : 0));
    }
  }
  var optionString = sb.join(',');

  var newWin;
  if (platform.isIos() && parentWin.navigator &&
      parentWin.navigator['standalone'] && target && target != '_self') {
    // iOS in standalone mode disregards "target" in window.open and always
    // opens new URL in the same window. The workaround is to create an "A"
    // element and send a click event to it.
    // Notice that the "A" tag does NOT have to be added to the DOM.

    var a = dom.createElement(TagName.A);
    domsafe.setAnchorHref(a, safeLinkRef);

    a.setAttribute('target', target);
    if (noReferrerOption) {
      a.setAttribute('rel', 'noreferrer');
    }

    var click = /** @type {!MouseEvent} */ (document.createEvent('MouseEvent'));
    click.initMouseEvent(
        'click',
        true,  // canBubble
        true,  // cancelable
        parentWin,
        1);  // detail = mousebutton
    a.dispatchEvent(click);
    // New window is not available in this case. Instead, a fake Window object
    // is returned. In particular, it will have window.document undefined. In
    // general, it will appear to most of clients as a Window for a different
    // origin. Since iOS standalone web apps are run in their own sandbox, this
    // is the most appropriate return value.
    newWin = createFakeWindow_();
  } else if (noReferrerOption) {
    // This code used to use meta-refresh to stop the referrer from being
    // included in the request headers. This was the only cross-browser way
    // to remove the referrer circa 2009. However, this never worked in Chrome,
    // and, instead newWin.opener had to be set to null on this browser. This
    // behavior is slated to be removed in Chrome and should not be relied
    // upon. Referrer Policy is the only spec'd and supported way of stripping
    // referrers and works across all current browsers. This is used in
    // addition to the aforementioned tricks.
    //
    // We also set the opener to be set to null in the new window, thus
    // disallowing the opened window from navigating its opener.
    //
    // Detecting user agent and then using a different strategy per browser
    // would allow the referrer to leak in case of an incorrect/missing user
    // agent.
    newWin = domsafe.openInWindow('', parentWin, target, optionString);

    var sanitizedLinkRef = Html_SafeUrl.unwrap(safeLinkRef);
    if (newWin) {
      if (userAgent.EDGE_OR_IE) {
        // IE/EDGE can't parse the content attribute if the url contains
        // a semicolon. We can fix this by adding quotes around the url, but
        // then we can't parse quotes in the URL correctly. We take a
        // best-effort approach.
        //
        // If the URL has semicolons, wrap it in single quotes to protect
        // the semicolons.
        // If the URL has semicolons and single quotes, url-encode the single
        // quotes as well.
        //
        // This is imperfect. Notice that both ' and ; are reserved characters
        // in URIs, so this could do the wrong thing, but at least it will
        // do the wrong thing in only rare cases.
        // ugh.
        if (strings.contains(sanitizedLinkRef, ';')) {
          sanitizedLinkRef =
              '\'' + sanitizedLinkRef.replace(/'/g, '%27') + '\'';
        }
      }
      newWin.opener = null;
      // Using a blank value for the URL causes the new window to load
      // this window's location. Instead, using this javascript URL causes an
      // error to be thrown in the blank document and abort the loading of the
      // page location. The window's location does update, but the content is
      // never requested/loaded.
      // Other values tried here include:
      // - an empty string or no value at all (page load succeeds)
      // - 'about:blank' (causes security exceptions if users
      //   later try and assign to the window's location, as about:blank is now
      //   cross-origin from this window).
      if (sanitizedLinkRef === '') {
        sanitizedLinkRef = 'javascript:\'\'';
      }
      // TODO(rjamet): Building proper SafeHtml with SafeHtml.createMetaRefresh
      // pulls in a lot of compiled code, which is composed of various unneeded
      // google.html parts such as SafeStyle.create among others. So, for now,
      // keep the unchecked conversion until we figure out how to make the
      // dependencies of createSafeHtmlTagSecurityPrivateDoNotAccessOrElse less
      // heavy.
      var safeHtml =
          uncheckedconversions
              .safeHtmlFromStringKnownToSatisfyTypeContract(
                  Const.from(
                      'b/12014412, meta tag with sanitized URL'),
                  '<meta name="referrer" content="no-referrer">' +
                      '<meta http-equiv="refresh" content="0; url=' +
                      strings.htmlEscape(sanitizedLinkRef) + '">');

      // During window loading `newWin.document` may be unset in some browsers.
      // Storing and checking a reference to the document prevents NPEs.
      var newDoc = newWin.document;
      if (newDoc && newDoc.write) {
        domsafe.documentWrite(newDoc, safeHtml);
        newDoc.close();
      }
    }
  } else {
    newWin = domsafe.openInWindow(
        safeLinkRef, parentWin, target, optionString);
    // Passing in 'noopener' into the 'windowFeatures' param of window.open(...)
    // will yield a feature-deprived browser. This is an known issue, tracked
    // here: https://github.com/whatwg/html/issues/1902
    if (newWin && opt_options['noopener']) {
      newWin.opener = null;
    }
  }
  // newWin is null if a popup blocker prevented the window open.
  return newWin;
};

/**
 * Opens a new window without any real content in it.
 *
 * This can be used to get around popup blockers if you need to open a window
 * in response to a user event, but need to do asynchronous work to determine
 * the URL to open, and then set the URL later.
 *
 * Example usage:
 *
 * var newWin = openBlank('Loading...');
 * setTimeout(
 *     function() {
 *       newWin.location.href = 'http://www.google.com';
 *     }, 100);
 *
 * @param {string=} opt_message String to show in the new window. This string
 *     will be HTML-escaped to avoid XSS issues.
 * @param {?Object=} opt_options Options to open window with.
 *     {@see open for exact option semantics}.
 * @param {?Window=} opt_parentWin Parent window that should be used to open the
 *                 new window.
 * @return {?Window} Returns the window object that was opened. This returns
 *                  null if a popup blocker prevented the window from being
 *                  opened.
 */
function openBlank(opt_message, opt_options, opt_parentWin) {
  const win =
      /** @type {?Window} */ (open('', opt_options, opt_parentWin));
  if (win && opt_message) {
    const body = win.document.body;
    if (body) {
      // The body can be undefined in IE, where for some reason the created
      // document doesn't have a body.
      body.textContent = opt_message;
    }
  }
  return win;
};

/**
 * Raise a help popup window, defaulting to "Google standard" size and name.
 *
 * (If your project is using GXPs, consider using {@link PopUpLink.gxp}.)
 *
 * @param {?Html_SafeUrl|string|?Object} linkRef If an Object with an
 *     'href' attribute (such as HTMLAnchorElement) is passed then the value of
 *     'href' is used, otherwise  otherwise its toString method is called. Note
 *     that if a string|Object is used, it will be sanitized with
 *     SafeUrl.sanitize().
 *
 * @param {?Object=} opt_options Options to open window with.
 *     {@see open for exact option semantics}
 *     Additional wrinkles to the options:
 *     - if 'target' field is null, linkRef.target will be used. If *that's*
 *     null, the default is "google_popup".
 *     - if 'width' field is not specified, the default is 690.
 *     - if 'height' field is not specified, the default is 500.
 *
 * @return {boolean} true if the window was not popped up, false if it was.
 */
function popup(linkRef, opt_options) {
  if (!opt_options) {
    opt_options = {};
  }

  // set default properties
  opt_options['target'] = opt_options['target'] || linkRef['target'] ||
      DEFAULT_POPUP_TARGET;
  opt_options['width'] =
      opt_options['width'] || DEFAULT_POPUP_WIDTH;
  opt_options['height'] =
      opt_options['height'] || DEFAULT_POPUP_HEIGHT;

  var newWin = open(linkRef, opt_options);
  if (!newWin) {
    return true;
  }
  newWin.focus();

  return false;
};

export {DEFAULT_POPUP_HEIGHT, DEFAULT_POPUP_TARGET, DEFAULT_POPUP_WIDTH, open, openBlank, popup};