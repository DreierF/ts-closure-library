import * as asserts from './../asserts/asserts.js';
import {BrowserEvent as EventsBrowserEvent} from './../events/browserevent.js';
import * as goog_events from './../events/eventhandler.js';
import {EventTarget as EventsEventTarget} from './../events/eventhandler.js';
import {EventType} from './../events/eventtype.js';
import {Event as HistoryEvent} from './event.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview HTML5 based history implementation, compatible with
 * goog.History.
 *
 * TODO(user): There should really be a history interface and multiple
 * implementations.
 */

/**
 * An implementation compatible with google.History that uses the HTML5
 * history APIs.
 *
 *     The token transformer that is used to create URL from the token
 *     when storing token without using hash fragment.
 * @extends {EventsEventTarget}
 * @final
 */
class Html5History extends EventsEventTarget {

  /**
   * An implementation compatible with google.History that uses the HTML5
   * history APIs.
   *
   * @param {Window=} opt_win The window to listen/dispatch history events on.
   * @param {TokenTransformer=} opt_transformer
   *     The token transformer that is used to create URL from the token
   *     when storing token without using hash fragment.
   */
  constructor(opt_win, opt_transformer) {
    super();
    /**
     * Status of when the object is active and dispatching events.
     * @type {boolean}
     * @private
     */
    this.enabled_ = false;
  
    /**
     * Whether to use the fragment to store the token, defaults to true.
     * @type {boolean}
     * @private
     */
    this.useFragment_ = true;
  
    /**
     * If useFragment is false the path will be used, the path prefix will be
     * prepended to all tokens. Defaults to '/'.
     * @type {string}
     * @private
     */
    this.pathPrefix_ = '/';
  
    asserts.assert(
        Html5History.isSupported(opt_win),
        'HTML5 history is not supported.');
  
    /**
     * The window object to use for history tokens.  Typically the top window.
     * @type {Window}
     * @private
     */
    this.window_ = opt_win || window;
  
    /**
     * The token transformer that is used to create URL from the token
     * when storing token without using hash fragment.
     * @type {TokenTransformer}
     * @private
     */
    this.transformer_ = opt_transformer || null;
  
    /**
     * The fragment of the last navigation. Used to eliminate duplicate/redundant
     * NAVIGATE events when a POPSTATE and HASHCHANGE event are triggered for the
     * same navigation (e.g., back button click).
     * @private {?string}
     */
    this.lastFragment_ = null;
  
    goog_events.listen(
        this.window_, EventType.POPSTATE, this.onHistoryEvent_, false,
        this);
    goog_events.listen(
        this.window_, EventType.HASHCHANGE, this.onHistoryEvent_,
        false, this);
  }

  /**
   * Returns whether Html5History is supported.
   * @param {Window=} opt_win Optional window to check.
   * @return {boolean} Whether html5 history is supported.
   */
  static isSupported(opt_win) {
    const win = opt_win || window;
    return !!(win.history && win.history.pushState);
  };

  /**
   * Starts or stops the History.  When enabled, the History object
   * will immediately fire an event for the current location. The caller can set
   * up event listeners between the call to the constructor and the call to
   * setEnabled.
   *
   * @param {boolean} enable Whether to enable history.
   */
  setEnabled(enable) {
    if (enable == this.enabled_) {
      return;
    }
  
    this.enabled_ = enable;
  
    if (enable) {
      this.dispatchEvent(new HistoryEvent(this.getToken(), false));
    }
  };

  /**
   * Returns the current token.
   * @return {string} The current token.
   */
  getToken() {
    if (this.useFragment_) {
      return asserts.assertString(this.getFragment_());
    } else {
      return this.transformer_ ?
          this.transformer_.retrieveToken(
              this.pathPrefix_, this.window_.location) :
          this.window_.location.pathname.slice(this.pathPrefix_.length);
    }
  };

  /**
   * Sets the history state.
   * @param {string} token The history state identifier.
   * @param {string=} opt_title Optional title to associate with history entry.
   */
  setToken(token, opt_title) {
    if (token == this.getToken()) {
      return;
    }
  
    // Per externs/gecko_dom.js document.title can be null.
    this.window_.history.pushState(
        null, opt_title || this.window_.document.title || '',
        this.getUrl_(token));
    this.dispatchEvent(new HistoryEvent(token, false));
  };

  /**
   * Replaces the current history state without affecting the rest of the history
   * stack.
   * @param {string} token The history state identifier.
   * @param {string=} opt_title Optional title to associate with history entry.
   */
  replaceToken(token, opt_title) {
    // Per externs/gecko_dom.js document.title can be null.
    this.window_.history.replaceState(
        null, opt_title || this.window_.document.title || '',
        this.getUrl_(token));
    this.dispatchEvent(new HistoryEvent(token, false));
  };

  /** @override */
  disposeInternal() {
    goog_events.unlisten(
        this.window_, EventType.POPSTATE, this.onHistoryEvent_, false,
        this);
    if (this.useFragment_) {
      goog_events.unlisten(
          this.window_, EventType.HASHCHANGE, this.onHistoryEvent_,
          false, this);
    }
  };

  /**
   * Sets whether to use the fragment to store tokens.
   * @param {boolean} useFragment Whether to use the fragment.
   */
  setUseFragment(useFragment) {
    if (this.useFragment_ != useFragment) {
      if (useFragment) {
        goog_events.listen(
            this.window_, EventType.HASHCHANGE, this.onHistoryEvent_,
            false, this);
      } else {
        goog_events.unlisten(
            this.window_, EventType.HASHCHANGE, this.onHistoryEvent_,
            false, this);
      }
      this.useFragment_ = useFragment;
    }
  };

  /**
   * Sets the path prefix to use if storing tokens in the path. The path
   * prefix should start and end with slash.
   * @param {string} pathPrefix Sets the path prefix.
   */
  setPathPrefix(pathPrefix) {
    this.pathPrefix_ = pathPrefix;
  };

  /**
   * Gets the path prefix.
   * @return {string} The path prefix.
   */
  getPathPrefix() {
    return this.pathPrefix_;
  };

  /**
   * Gets the current hash fragment, if useFragment_ is enabled.
   * @return {?string} The hash fragment.
   * @private
   */
  getFragment_() {
    if (this.useFragment_) {
      const loc = this.window_.location.href;
      const index = loc.indexOf('#');
      return index < 0 ? '' : loc.substring(index + 1);
    } else {
      return null;
    }
  };

  /**
   * Gets the URL to set when calling history.pushState
   * @param {string} token The history token.
   * @return {string} The URL.
   * @private
   */
  getUrl_(token) {
    if (this.useFragment_) {
      return '#' + token;
    } else {
      return this.transformer_ ?
          this.transformer_.createUrl(
              token, this.pathPrefix_, this.window_.location) :
          this.pathPrefix_ + token + this.window_.location.search;
    }
  };

  /**
   * Handles history events dispatched by the browser.
   * @param {EventsBrowserEvent} e The browser event object.
   * @private
   */
  onHistoryEvent_(e) {
    if (this.enabled_) {
      const fragment = this.getFragment_();
      // Only fire NAVIGATE event if it's POPSTATE or if the fragment has changed
      // without a POPSTATE event. The latter is an indication the browser doesn't
      // support POPSTATE, and the event is a HASHCHANGE instead.
      if (e.type == EventType.POPSTATE ||
          fragment != this.lastFragment_) {
        this.lastFragment_ = fragment;
        this.dispatchEvent(new HistoryEvent(this.getToken(), true));
      }
    }
  };
}

/**
 * A token transformer that can create a URL from a history
 * token. This is used by `Html5History` to create
 * URL when storing token without the hash fragment.
 *
 * Given a `window.location` object containing the location
 * created by `createUrl`, the token transformer allows
 * retrieval of the token back via `retrieveToken`.
 *
 * @interface
 */
class TokenTransformer {

  /**
   * A token transformer that can create a URL from a history
   * token. This is used by `Html5History` to create
   * URL when storing token without the hash fragment.
   *
   * Given a `window.location` object containing the location
   * created by `createUrl`, the token transformer allows
   * retrieval of the token back via `retrieveToken`.
   *
   */
  constructor() {}

  /**
   * Retrieves a history token given the path prefix and
   * `window.location` object.
   *
   * @param {string} pathPrefix The path prefix to use when storing token
   *     in a path; always begin with a slash.
   * @param {Location} location The `window.location` object.
   *     Treat this object as read-only.
   * @return {string} token The history token.
   */
  retrieveToken(
      pathPrefix, location) {};

  /**
   * Creates a URL to be pushed into HTML5 history stack when storing
   * token without using hash fragment.
   *
   * @param {string} token The history token.
   * @param {string} pathPrefix The path prefix to use when storing token
   *     in a path; always begin with a slash.
   * @param {Location} location The `window.location` object.
   *     Treat this object as read-only.
   * @return {string} url The complete URL string from path onwards
   *     (without {@code protocol://host:port} part); must begin with a
   *     slash.
   */
  createUrl(
      token, pathPrefix, location) {};
}

export {Html5History, TokenTransformer};