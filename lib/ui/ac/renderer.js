import * as aria from './../../a11y/aria/aria.js';
import {State} from './../../a11y/aria/attributes.js';
import {Role} from './../../a11y/aria/roles.js';
import * as googarray from './../../array/array.js';
import * as asserts from './../../asserts/asserts.js';
import {dispose} from './../../disposable/disposable.js';
import * as classlist from './../../dom/classlist.js';
import * as goog_dom from './../../dom/dom.js';
import {DomHelper} from './../../dom/dom.js';
import {NodeType} from './../../dom/nodetype.js';
import {TagName} from './../../dom/tagname.js';
import {Event as EventsEvent} from './../../events/event.js';
import * as goog_events from './../../events/eventhandler.js';
import {EventTarget as EventsEventTarget} from './../../events/eventhandler.js';
import {EventType as EventsEventType} from './../../events/eventtype.js';
import {Animation} from './../../fx/animation.js';
import {FadeInAndShow} from './../../fx/dom.js';
import {FadeOutAndHide} from './../../fx/dom.js';
import * as google from './../../google.js';
import * as goog_positioning from './../../positioning/positioning.js';
import {Corner} from './../../positioning/positioning.js';
import {Overflow} from './../../positioning/positioning.js';
import * as goog_strings from './../../string/string.js';
import * as style from './../../style/style.js';
import {IdGenerator} from './../idgenerator.js';
import {AutoComplete} from './autocomplete.js';
import {EventType} from './autocomplete.js';
// Copyright 2006 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Class for rendering the results of an auto complete and
 * allow the user to select an row.
 */

/**
 * Class for rendering the results of an auto-complete in a drop down list.
 *
 *     that will hold the autocomplete elements. goog_dom.getDocument().body
 *     will be used if this is null.
 *     render each row. Should be something with a renderRow or render method.
 *     be right aligned. False by default.
 *     highlighting should be applied to each row of data. Standard highlighting
 *     bolds every matching substring for a given token in each row. True by
 *     default.
 * @extends {EventsEventTarget}
 * @suppress {underscore}
 */
class Renderer extends EventsEventTarget {

  /**
   * Class for rendering the results of an auto-complete in a drop down list.
   *
   * @param {Element=} opt_parentNode optional reference to the parent element
   *     that will hold the autocomplete elements. goog_dom.getDocument().body
   *     will be used if this is null.
   * @param {?({renderRow}|{render})=} opt_customRenderer Custom full renderer to
   *     render each row. Should be something with a renderRow or render method.
   * @param {boolean=} opt_rightAlign Determines if the autocomplete will always
   *     be right aligned. False by default.
   * @param {boolean=} opt_useStandardHighlighting Determines if standard
   *     highlighting should be applied to each row of data. Standard highlighting
   *     bolds every matching substring for a given token in each row. True by
   *     default.
   * @suppress {underscore}
   */
  constructor(
      opt_parentNode, opt_customRenderer, opt_rightAlign,
      opt_useStandardHighlighting) {
    super();
    /**
     * The anchor element to position the rendered autocompleter against.
     * @type {Element}
     * @private
     */
    this.anchorElement_ = null;
  
    /**
     * The anchor element to position the rendered autocompleter against.
     * @protected
      * @type {Element|undefined}
     */
    this.target_ = undefined;
  
    /**
     * The element on which to base the width of the autocomplete.
     * @protected
      * @type {Node}
     */
    this.widthProvider_ = null;
  
    /**
     * The element on which to base the max width of the autocomplete.
     * @protected
      * @type {!Node|undefined}
     */
    this.maxWidthProvider_ = undefined;
  
    /**
     * The border width of the autocomplete dropdown, only used in calculating the
     * dropdown width.
     * @private
      * @type {number}
     */
    this.borderWidth_ = 0;
  
    /**
     * A flag used to make sure we highlight only one match in the rendered row.
     * @private
      * @type {boolean|null}
     */
    this.wasHighlightedAtLeastOnce_ = null;
  
  
    /**
     * Reference to the parent element that will hold the autocomplete elements
     * @type {Element}
     * @private
     */
    this.parent_ = opt_parentNode || goog_dom.getDocument().body;
  
    /**
     * Dom helper for the parent element's document.
     * @type {DomHelper}
     * @private
     */
    this.dom_ = goog_dom.getDomHelper(this.parent_);
  
    /**
     * Whether to reposition the autocomplete UI below the target node
     * @type {boolean}
     * @private
     */
    this.reposition_ = !opt_parentNode;
  
    /**
     * Reference to the main element that controls the rendered autocomplete
     * @type {?Element}
     * @private
     */
    this.element_ = null;
  
    /**
     * The current token that has been entered
     * @type {string}
     * @private
     */
    this.token_ = '';
  
    /**
     * Array used to store the current set of rows being displayed
     * @type {Array<!Object>}
     * @private
     */
    this.rows_ = [];
  
    /**
     * Array of the node divs that hold each result that is being displayed.
     * @type {Array<Element>}
     * @protected
     * @suppress {underscore|visibility}
     */
    this.rowDivs_ = [];
  
    /**
     * The index of the currently highlighted row
     * @type {number}
     * @protected
     * @suppress {underscore|visibility}
     */
    this.hilitedRow_ = -1;
  
    /**
     * The time that the rendering of the menu rows started
     * @type {number}
     * @protected
     * @suppress {underscore|visibility}
     */
    this.startRenderingRows_ = -1;
  
    /**
     * Store the current state for the renderer
     * @type {boolean}
     * @private
     */
    this.visible_ = false;
  
    /**
     * Classname for the main element.  This must be a single valid class name.
     * @type {string}
     */
    this.className = google.getCssName('ac-renderer');
  
    /**
     * Classname for row divs.  This must be a single valid class name.
     * @type {string}
     */
    this.rowClassName = google.getCssName('ac-row');
  
    // TODO(gboyer): Remove this as soon as we remove references and ensure that
    // no groups are pushing javascript using this.
    /**
     * The old class name for active row.  This name is deprecated because its
     * name is generic enough that a typical implementation would require a
     * descendant selector.
     * Active row will have rowClassName & activeClassName &
     * legacyActiveClassName.
     * @type {string}
     * @private
     */
    this.legacyActiveClassName_ = google.getCssName('active');
  
    /**
     * Class name for active row div.  This must be a single valid class name.
     * Active row will have rowClassName & activeClassName &
     * legacyActiveClassName.
     * @type {string}
     */
    this.activeClassName = google.getCssName('ac-active');
  
    /**
     * Class name for the bold tag highlighting the matched part of the text.
     * @type {string}
     */
    this.highlightedClassName = google.getCssName('ac-highlighted');
  
    /**
     * Custom full renderer
     * @type {?({renderRow}|{render})}
     * @private
     */
    this.customRenderer_ = opt_customRenderer || null;
  
    /**
     * Flag to indicate whether standard highlighting should be applied.
     * this is set to true if left unspecified to retain existing
     * behaviour for autocomplete clients
     * @type {boolean}
     * @private
     */
    this.useStandardHighlighting_ =
        opt_useStandardHighlighting != null ? opt_useStandardHighlighting : true;
  
    /**
     * Flag to indicate whether matches should be done on whole words instead
     * of any string.
     * @type {boolean}
     * @private
     */
    this.matchWordBoundary_ = true;
  
    /**
     * Flag to set all tokens as highlighted in the autocomplete row.
     * @type {boolean}
     * @private
     */
    this.highlightAllTokens_ = false;
  
    /**
     * Determines if the autocomplete will always be right aligned
     * @type {boolean}
     * @private
     */
    this.rightAlign_ = !!opt_rightAlign;
  
    /**
     * Whether to align with top of target field
     * @type {boolean}
     * @private
     */
    this.topAlign_ = false;
  
    /**
     * Duration (in msec) of fade animation when menu is shown/hidden.
     * Setting to 0 (default) disables animation entirely.
     * @type {number}
     * @private
     */
    this.menuFadeDuration_ = 0;
  
    /**
     * Whether we should limit the dropdown from extending past the bottom of the
     * screen and instead show a scrollbar on the dropdown.
     * @type {boolean}
     * @private
     */
    this.showScrollbarsIfTooLarge_ = false;
  
    /**
     * Animation in progress, if any.
     * @type {Animation|undefined}
     */
    this.animation_;
  }

  /**
   * Gets the renderer's element.
   * @return {Element} The  main element that controls the rendered autocomplete.
   */
  getElement() {
    return this.element_;
  };

  /**
   * Sets the width provider element. The provider is only used on redraw and as
   * such will not automatically update on resize.
   * @param {Node} widthProvider The element whose width should be mirrored.
   * @param {number=} opt_borderWidth The width of the border of the autocomplete,
   *     which will be subtracted from the width of the autocomplete dropdown.
   * @param {!Node=} maxWidthProvider The element whose width should be used
   *     as the autocomplete's max width.
   */
  setWidthProvider(
      widthProvider, opt_borderWidth, maxWidthProvider = undefined) {
    this.widthProvider_ = widthProvider;
    if (opt_borderWidth) {
      this.borderWidth_ = opt_borderWidth;
    }
    if (maxWidthProvider) {
      this.maxWidthProvider_ = maxWidthProvider;
    }
  };

  /**
   * Set whether to align autocomplete to top of target element
   * @param {boolean} align If true, align to top.
   */
  setTopAlign(align) {
    this.topAlign_ = align;
  };

  /**
   * @return {boolean} Whether we should be aligning to the top of
   *     the target element.
   */
  getTopAlign() {
    return this.topAlign_;
  };

  /**
   * Set whether to align autocomplete to the right of the target element.
   * @param {boolean} align If true, align to right.
   */
  setRightAlign(align) {
    this.rightAlign_ = align;
  };

  /**
   * @return {boolean} Whether the autocomplete menu should be right aligned.
   */
  getRightAlign() {
    return this.rightAlign_;
  };

  /**
   * @param {boolean} show Whether we should limit the dropdown from extending
   *     past the bottom of the screen and instead show a scrollbar on the
   *     dropdown.
   */
  setShowScrollbarsIfTooLarge(show) {
    this.showScrollbarsIfTooLarge_ = show;
  };

  /**
   * Set whether or not standard highlighting should be used when rendering rows.
   * @param {boolean} useStandardHighlighting true if standard highlighting used.
   */
  setUseStandardHighlighting(
      useStandardHighlighting) {
    this.useStandardHighlighting_ = useStandardHighlighting;
  };

  /**
   * @param {boolean} matchWordBoundary Determines whether matches should be
   *     higlighted only when the token matches text at a whole-word boundary.
   *     True by default.
   */
  setMatchWordBoundary(
      matchWordBoundary) {
    this.matchWordBoundary_ = matchWordBoundary;
  };

  /**
   * Set whether or not to highlight all matching tokens rather than just the
   * first.
   * @param {boolean} highlightAllTokens Whether to highlight all matching tokens
   *     rather than just the first.
   */
  setHighlightAllTokens(
      highlightAllTokens) {
    this.highlightAllTokens_ = highlightAllTokens;
  };

  /**
   * Sets the duration (in msec) of the fade animation when menu is shown/hidden.
   * Setting to 0 (default) disables animation entirely.
   * @param {number} duration Duration (in msec) of the fade animation (or 0 for
   *     no animation).
   */
  setMenuFadeDuration(duration) {
    this.menuFadeDuration_ = duration;
  };

  /**
   * Sets the anchor element for the subsequent call to renderRows.
   * @param {Element} anchor The anchor element.
   */
  setAnchorElement(anchor) {
    this.anchorElement_ = anchor;
  };

  /**
   * @return {Element} The anchor element.
   * @protected
   */
  getAnchorElement() {
    return this.anchorElement_;
  };

  /**
   * Render the autocomplete UI
   *
   * @param {Array<!Object>} rows Matching UI rows.
   * @param {string} token Token we are currently matching against.
   * @param {Element=} opt_target Current HTML node, will position popup beneath
   *     this node.
   */
  renderRows(rows, token, opt_target) {
    this.token_ = token;
    this.rows_ = rows;
    this.hilitedRow_ = -1;
    this.startRenderingRows_ = google.now();
    this.target_ = opt_target;
    this.rowDivs_ = [];
    this.redraw();
  };

  /**
   * Hide the object.
   */
  dismiss() {
    if (this.visible_) {
      this.visible_ = false;
      this.toggleAriaMarkup_(false /* isShown */);
  
      if (this.menuFadeDuration_ > 0) {
        dispose(this.animation_);
        this.animation_ =
            new FadeOutAndHide(this.element_, this.menuFadeDuration_);
        this.animation_.play();
      } else {
        style.setElementShown(this.element_, false);
      }
    }
  };

  /**
   * Show the object.
   */
  show() {
    if (!this.visible_) {
      this.visible_ = true;
      this.toggleAriaMarkup_(true /* isShown */);
  
      if (this.menuFadeDuration_ > 0) {
        dispose(this.animation_);
        this.animation_ =
            new FadeInAndShow(this.element_, this.menuFadeDuration_);
        this.animation_.play();
      } else {
        style.setElementShown(this.element_, true);
      }
    }
  };

  /**
   * Toggle the ARIA markup to add popup semantics when the target is shown and
   * to remove them when it is hidden.
   * @param {boolean} isShown Whether the menu is being shown.
   * @private
   */
  toggleAriaMarkup_(isShown) {
    if (!this.target_) {
      return;
    }
  
    aria.setState(this.target_, State.HASPOPUP, isShown);
    aria.setState(
        asserts.assert(this.element_), State.EXPANDED,
        isShown);
    aria.setState(this.target_, State.EXPANDED, isShown);
    if (isShown) {
      aria.setState(
          this.target_, State.OWNS, this.element_.id);
    } else {
      aria.removeState(this.target_, State.OWNS);
      aria.setActiveDescendant(this.target_, null);
    }
  };

  /**
   * @return {boolean} True if the object is visible.
   */
  isVisible() {
    return this.visible_;
  };

  /**
   * Sets the 'active' class of the nth item.
   * @param {number} index Index of the item to highlight.
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  hiliteRow(index) {
    var row =
        index >= 0 && index < this.rows_.length ? this.rows_[index] : undefined;
    var rowDiv = index >= 0 && index < this.rowDivs_.length ?
        this.rowDivs_[index] :
        undefined;
  
    var evtObj = /** @lends {EventsEvent.prototype} */ ({
      type: EventType.ROW_HILITE,
      rowNode: rowDiv,
      row: row ? row.data : null
    });
    if (this.dispatchEvent(evtObj)) {
      this.hiliteNone();
      this.hilitedRow_ = index;
      if (rowDiv) {
        classlist.addAll(
            rowDiv, [this.activeClassName, this.legacyActiveClassName_]);
        if (this.target_) {
          aria.setActiveDescendant(this.target_, rowDiv);
        }
        style.scrollIntoContainerView(rowDiv, this.element_);
      }
    }
  };

  /**
   * Removes the 'active' class from the currently selected row.
   */
  hiliteNone() {
    if (this.hilitedRow_ >= 0) {
      classlist.removeAll(
          asserts.assert(this.rowDivs_[this.hilitedRow_]),
          [this.activeClassName, this.legacyActiveClassName_]);
    }
  };

  /**
   * Sets the 'active' class of the item with a given id.
   * @param {number} id Id of the row to hilight. If id is -1 then no rows get
   *     hilited.
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  hiliteId(id) {
    if (id == -1) {
      this.hiliteRow(-1);
    } else {
      for (var i = 0; i < this.rows_.length; i++) {
        if (this.rows_[i].id == id) {
          this.hiliteRow(i);
          return;
        }
      }
    }
  };

  /**
   * Sets CSS classes on autocomplete conatainer element.
   *
   * @param {Element} elem The container element.
   * @private
   */
  setMenuClasses_(elem) {
    asserts.assert(elem);
    // Legacy clients may set the renderer's className to a space-separated list
    // or even have a trailing space.
    classlist.addAll(elem, goog_strings.trim(this.className).split(' '));
  };

  /**
   * If the main HTML element hasn't been made yet, creates it and appends it
   * to the parent.
   * @private
   */
  maybeCreateElement_() {
    if (!this.element_) {
      // Make element and add it to the parent
      var el = this.dom_.createDom(TagName.DIV, {style: 'display:none'});
      if (this.showScrollbarsIfTooLarge_) {
        // Make sure that the dropdown will get scrollbars if it isn't large
        // enough to show all rows.
        el.style.overflowY = 'auto';
      }
      this.element_ = el;
      this.setMenuClasses_(el);
      aria.setRole(el, Role.LISTBOX);
  
      el.id = IdGenerator.getInstance().getNextUniqueId();
  
      this.dom_.appendChild(this.parent_, el);
  
      // Add this object as an event handler
      goog_events.listen(
          el, EventsEventType.CLICK, this.handleClick_, false, this);
      goog_events.listen(
          el, EventsEventType.MOUSEDOWN, this.handleMouseDown_, false,
          this);
      goog_events.listen(
          el, EventsEventType.MOUSEOVER, this.handleMouseOver_, false,
          this);
    }
  };

  /**
   * Redraw (or draw if this is the first call) the rendered auto-complete drop
   * down.
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  redraw() {
    // Create the element if it doesn't yet exist
    this.maybeCreateElement_();
  
    // For top aligned with target (= bottom aligned element),
    // we need to hide and then add elements while hidden to prevent
    // visible repositioning
    if (this.topAlign_) {
      this.element_.style.visibility = 'hidden';
    }
  
    if (this.widthProvider_) {
      var width = this.widthProvider_.clientWidth - this.borderWidth_ + 'px';
      this.element_.style.minWidth = width;
    }
    if (this.maxWidthProvider_) {
      const maxWidth =
          this.maxWidthProvider_.clientWidth - this.borderWidth_ + 'px';
      this.element_.style.maxWidth = maxWidth;
    }
  
    // Remove the current child nodes
    this.rowDivs_.length = 0;
    this.dom_.removeChildren(this.element_);
  
    // Generate the new rows (use forEach so we can change rows_ from an
    // array to a different datastructure if required)
    if (this.customRenderer_ && this.customRenderer_.render) {
      this.customRenderer_.render(this, this.element_, this.rows_, this.token_);
    } else {
      var curRow = null;
      googarray.forEach(this.rows_, function(row) {
        row = this.renderRowHtml(row, this.token_);
        if (this.topAlign_) {
          // Aligned with top of target = best match at bottom
          this.element_.insertBefore(row, curRow);
        } else {
          this.dom_.appendChild(this.element_, row);
        }
        curRow = row;
      }, this);
    }
  
    // Don't show empty result sets
    if (this.rows_.length == 0) {
      this.dismiss();
      return;
    } else {
      this.show();
    }
  
    this.reposition();
  
    // Make the autocompleter unselectable, so that it
    // doesn't steal focus from the input field when clicked.
    style.setUnselectable(this.element_, true);
  };

  /**
   * @return {Corner} The anchor corner to position the popup at.
   * @protected
   */
  getAnchorCorner() {
    var anchorCorner = this.rightAlign_ ? Corner.BOTTOM_RIGHT :
                                          Corner.BOTTOM_LEFT;
    if (this.topAlign_) {
      anchorCorner = goog_positioning.flipCornerVertical(anchorCorner);
    }
    return anchorCorner;
  };

  /**
   * Repositions the auto complete popup relative to the location node, if it
   * exists and the auto position has been set.
   */
  reposition() {
    if (this.target_ && this.reposition_) {
      var anchorElement = this.anchorElement_ || this.target_;
      var anchorCorner = this.getAnchorCorner();
  
      var overflowMode = Overflow.ADJUST_X_EXCEPT_OFFSCREEN;
      if (this.showScrollbarsIfTooLarge_) {
        // positionAtAnchor will set the height of this.element_ when it runs
        // (because of RESIZE_HEIGHT), and it will never increase it relative to
        // its current value when it runs again. But if the user scrolls their
        // page, then we might actually want a bigger height when the dropdown is
        // displayed next time. So we clear the height before calling
        // positionAtAnchor, so it is free to set the height as large as it
        // chooses.
        this.element_.style.height = '';
        overflowMode |= Overflow.RESIZE_HEIGHT;
      }
  
      goog_positioning.positionAtAnchor(
          anchorElement, anchorCorner, this.element_,
          goog_positioning.flipCornerVertical(anchorCorner), null, null,
          overflowMode);
  
      if (this.topAlign_) {
        // This flickers, but is better than the alternative of positioning
        // in the wrong place and then moving.
        this.element_.style.visibility = 'visible';
      }
    }
  };

  /**
   * Sets whether the renderer should try to determine where to position the
   * drop down.
   * @param {boolean} auto Whether to autoposition the drop down.
   */
  setAutoPosition(auto) {
    this.reposition_ = auto;
  };

  /**
   * @return {boolean} Whether the drop down will be autopositioned.
   * @protected
   */
  getAutoPosition() {
    return this.reposition_;
  };

  /**
   * @return {Element} The target element.
   * @protected
   */
  getTarget() {
    return this.target_ || null;
  };

  /**
   * Disposes of the renderer and its associated HTML.
   * @override
   * @protected
   */
  disposeInternal() {
    if (this.element_) {
      goog_events.unlisten(
          this.element_, EventsEventType.CLICK, this.handleClick_, false,
          this);
      goog_events.unlisten(
          this.element_, EventsEventType.MOUSEDOWN, this.handleMouseDown_,
          false, this);
      goog_events.unlisten(
          this.element_, EventsEventType.MOUSEOVER, this.handleMouseOver_,
          false, this);
      this.dom_.removeNode(this.element_);
      this.element_ = null;
      this.visible_ = false;
    }
  
    dispose(this.animation_);
    this.parent_ = null;
  
    super.disposeInternal();
  };

  /**
   * Generic function that takes a row and renders a DOM structure for that row.
   *
   * Normally this will only be matching a maximum of 20 or so items.  Even with
   * 40 rows, DOM this building is fine.
   * @param {Object} row Object representing row.
   * @param {string} token Token to highlight.
   * @param {Node} node The node to render into.
   * @private
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  renderRowContents_(row, token, node) {
    goog_dom.setTextContent(node, row.data.toString());
  };

  /**
   * Goes through a node and all of its child nodes, replacing HTML text that
   * matches a token with <b>token</b>.
   * The replacement will happen on the first match or all matches depending on
   * this.highlightAllTokens_ value.
   *
   * @param {Node} node Node to match.
   * @param {string|Array<string>} tokenOrArray Token to match or array of tokens
   *     to match.  By default, only the first match will be highlighted.  If
   *     highlightAllTokens is set, then all tokens appearing at the start of a
   *     word, in whatever order and however many times, will be highlighted.
   * @private
   */
  startHiliteMatchingText_(
      node, tokenOrArray) {
    this.wasHighlightedAtLeastOnce_ = false;
    this.hiliteMatchingText_(node, tokenOrArray);
  };

  /**
   * @param {Node} node Node to match.
   * @param {string|Array<string>} tokenOrArray Token to match or array of tokens
   *     to match.
   * @private
   */
  hiliteMatchingText_(
      node, tokenOrArray) {
    if (!this.highlightAllTokens_ && this.wasHighlightedAtLeastOnce_) {
      return;
    }
  
    if (node.nodeType == NodeType.TEXT) {
      var rest = null;
      if (google.isArray(tokenOrArray) && tokenOrArray.length > 1 &&
          !this.highlightAllTokens_) {
        rest = googarray.slice(tokenOrArray, 1);
      }
  
      var token = this.getTokenRegExp_(tokenOrArray);
      if (token.length == 0) return;
  
      var text = node.nodeValue;
  
      // Create a regular expression to match a token at the beginning of a line
      // or preceded by non-alpha-numeric characters. Note: token could have |
      // operators in it, so we need to parenthesise it before adding \b to it.
      // or preceded by non-alpha-numeric characters
      //
      // NOTE(user): When using word matches, this used to have
      // a (^|\\W+) clause where it now has \\b but it caused various
      // browsers to hang on really long strings. The (^|\\W+) matcher was also
      // unnecessary, because \b already checks that the character before the
      // is a non-word character, and ^ matches the start of the line or following
      // a line terminator character, which is also \W. The regexp also used to
      // have a capturing match before the \\b, which would capture the
      // non-highlighted content, but that caused the regexp matching to run much
      // slower than the current version.
      var re = this.matchWordBoundary_ ?
          new RegExp('\\b(?:' + token + ')', 'gi') :
          new RegExp(token, 'gi');
      var textNodes = [];
      var lastIndex = 0;
  
      // Find all matches
      // Note: text.split(re) has inconsistencies between IE and FF, so
      // manually recreated the logic
      var match = re.exec(text);
      var numMatches = 0;
      while (match) {
        numMatches++;
        textNodes.push(text.substring(lastIndex, match.index));
        textNodes.push(text.substring(match.index, re.lastIndex));
        lastIndex = re.lastIndex;
        match = re.exec(text);
      }
      textNodes.push(text.substring(lastIndex));
  
      // Replace the tokens with bolded text.  Each pair of textNodes
      // (starting at index idx) includes a node of text before the bolded
      // token, and a node (at idx + 1) consisting of what should be
      // enclosed in bold tags.
      if (textNodes.length > 1) {
        var maxNumToBold = !this.highlightAllTokens_ ? 1 : numMatches;
        for (var i = 0; i < maxNumToBold; i++) {
          var idx = 2 * i;
  
          node.nodeValue = textNodes[idx];
          var boldTag = this.dom_.createElement(TagName.B);
          boldTag.className = this.highlightedClassName;
          this.dom_.appendChild(
              boldTag, this.dom_.createTextNode(textNodes[idx + 1]));
          boldTag = node.parentNode.insertBefore(boldTag, node.nextSibling);
          node.parentNode.insertBefore(
              this.dom_.createTextNode(''), boldTag.nextSibling);
          node = boldTag.nextSibling;
        }
  
        // Append the remaining text nodes to the end.
        var remainingTextNodes = googarray.slice(textNodes, maxNumToBold * 2);
        node.nodeValue = remainingTextNodes.join('');
  
        this.wasHighlightedAtLeastOnce_ = true;
      } else if (rest) {
        this.hiliteMatchingText_(node, rest);
      }
    } else {
      var child = node.firstChild;
      while (child) {
        var nextChild = child.nextSibling;
        this.hiliteMatchingText_(child, tokenOrArray);
        child = nextChild;
      }
    }
  };

  /**
   * Transforms a token into a string ready to be put into the regular expression
   * in hiliteMatchingText_.
   * @param {string|Array<string>} tokenOrArray The token or array to get the
   *     regex string from.
   * @return {string} The regex-ready token.
   * @suppress{checkTypes}
   * @private
   */
  getTokenRegExp_(tokenOrArray) {
    var token = '';
  
    if (!tokenOrArray) {
      return token;
    }
  
    if (google.isArray(tokenOrArray)) {
      // Remove invalid tokens from the array, which may leave us with nothing.
      tokenOrArray = googarray.filter(tokenOrArray, function(str) {
        return !goog_strings.isEmptyOrWhitespace(goog_strings.makeSafe(str));
      });
    }
  
    // If highlighting all tokens, join them with '|' so the regular expression
    // will match on any of them.
    if (this.highlightAllTokens_) {
      if (google.isArray(tokenOrArray)) {
        var tokenArray = googarray.map(tokenOrArray, goog_strings.regExpEscape);
        token = tokenArray.join('|');
      } else {
        // Remove excess whitespace from the string so bars will separate valid
        // tokens in the regular expression.
        token = goog_strings.collapseWhitespace(tokenOrArray);
  
        token = goog_strings.regExpEscape(token);
        token = token.replace(/ /g, '|');
      }
    } else {
      // Not highlighting all matching tokens.  If tokenOrArray is a string, use
      // that as the token.  If it is an array, use the first element in the
      // array.
      // TODO(user): why is this this way?. We should match against all
      // tokens in the array, but only accept the first match.
      if (google.isArray(tokenOrArray)) {
        token = tokenOrArray.length > 0 ?
            goog_strings.regExpEscape(tokenOrArray[0]) :
            '';
      } else {
        // For the single-match string token, we refuse to match anything if
        // the string begins with a non-word character, as matches by definition
        // can only occur at the start of a word. (This also handles the
        // goog_strings.isEmptyOrWhitespace(goog_strings.makeSafe(tokenOrArray))
        // case.)
        if (!/^\W/.test(tokenOrArray)) {
          token = goog_strings.regExpEscape(tokenOrArray);
        }
      }
    }
  
    return token;
  };

  /**
   * Render a row by creating a div and then calling row rendering callback or
   * default row handler
   *
   * @param {Object} row Object representing row.
   * @param {string} token Token to highlight.
   * @return {!Element} An element with the rendered HTML.
   */
  renderRowHtml(row, token) {
    // Create and return the element.
    var elem = this.dom_.createDom(TagName.DIV, {
      className: this.rowClassName,
      id: IdGenerator.getInstance().getNextUniqueId()
    });
    aria.setRole(elem, Role.OPTION);
    if (this.customRenderer_ && this.customRenderer_.renderRow) {
      this.customRenderer_.renderRow(row, token, elem);
    } else {
      this.renderRowContents_(row, token, elem);
    }
  
    if (token && this.useStandardHighlighting_) {
      this.startHiliteMatchingText_(elem, token);
    }
  
    classlist.add(elem, this.rowClassName);
    this.rowDivs_.push(elem);
    return elem;
  };

  /**
   * Given an event target looks up through the parents till it finds a div.  Once
   * found it will then look to see if that is one of the childnodes, if it is
   * then the index is returned, otherwise -1 is returned.
   * @param {Element} et HtmlElement.
   * @return {number} Index corresponding to event target.
   * @private
   */
  getRowFromEventTarget_(et) {
    while (et && et != this.element_ &&
           !classlist.contains(et, this.rowClassName)) {
      et = /** @type {Element} */ (et.parentNode);
    }
    return et ? googarray.indexOf(this.rowDivs_, et) : -1;
  };

  /**
   * Handle the click events.  These are redirected to the AutoComplete object
   * which then makes a callback to select the correct row.
   * @param {EventsEvent} e Browser event object.
   * @private
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  handleClick_(e) {
    var index = this.getRowFromEventTarget_(/** @type {Element} */ (e.target));
    if (index >= 0) {
      this.dispatchEvent(/** @lends {EventsEvent.prototype} */ ({
        type: EventType.SELECT,
        row: this.rows_[index].id
      }));
    }
    e.stopPropagation();
  };

  /**
   * Handle the mousedown event and prevent the AC from losing focus.
   * @param {EventsEvent} e Browser event object.
   * @private
   */
  handleMouseDown_(e) {
    e.stopPropagation();
    e.preventDefault();
  };

  /**
   * Handle the mousing events.  These are redirected to the AutoComplete object
   * which then makes a callback to set the correctly highlighted row.  This is
   * because the AutoComplete can move the focus as well, and there is no sense
   * duplicating the code
   * @param {EventsEvent} e Browser event object.
   * @private
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  handleMouseOver_(e) {
    var index = this.getRowFromEventTarget_(/** @type {Element} */ (e.target));
    if (index >= 0) {
      if ((google.now() - this.startRenderingRows_) <
          Renderer.DELAY_BEFORE_MOUSEOVER) {
        return;
      }
  
      this.dispatchEvent({
        type: EventType.HILITE,
        row: this.rows_[index].id
      });
    }
  };
}

/**
 * The delay before mouseover events are registered, in milliseconds
 * @type {number}
 * @const
 */
Renderer.DELAY_BEFORE_MOUSEOVER = 300;

/**
 * Class allowing different implementations to custom render the autocomplete.
 * Extending classes should override the render function.
 */
class CustomRenderer {

  /**
   * Class allowing different implementations to custom render the autocomplete.
   * Extending classes should override the render function.
   */
  constructor() {}

  /**
   * Renders the autocomplete box. May be set to null.
   *
   * Because of the type, this function cannot be documented with param JSDoc.
   *
   * The function expects the following parameters:
   *
   * renderer, Renderer: The autocomplete renderer.
   * element, Element: The main element that controls the rendered autocomplete.
   * rows, Array: The current set of rows being displayed.
   * token, string: The current token that has been entered. *
   *
   * @param {Renderer} renderer
   * @param {Element} element
   * @param {Array} rows
   * @param {string} token
   */
  render(
      renderer, element, rows, token) {};

  /**
   * Generic function that takes a row and renders a DOM structure for that row.
   * @param {Object} row Object representing row.
   * @param {string} token Token to highlight.
   * @param {Node} node The node to render into.
   */
  renderRow(
      row, token, node) {};
}

export {CustomRenderer, Renderer};