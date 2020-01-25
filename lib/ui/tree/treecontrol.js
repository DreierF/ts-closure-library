import * as aria from './../../a11y/aria/aria.js';
import * as asserts from './../../asserts/asserts.js';
import * as classlist from './../../dom/classlist.js';
import {DomHelper} from './../../dom/dom.js';
import {BrowserEvent as EventsBrowserEvent} from './../../events/browserevent.js';
import {EventType as EventsEventType} from './../../events/eventtype.js';
import {FocusHandler} from './../../events/focushandler.js';
import {EventType} from './../../events/focushandler.js';
import {KeyHandler} from './../../events/keyhandler.js';
import {EventType as KeyHandlerEventType} from './../../events/keyhandler.js';
import * as google from './../../google.js';
import {SafeHtml} from './../../html/safehtml.js';
import * as goog_log from './../../log/log.js';
import {Logger as LogLogger} from './../../log/log.js';
import * as userAgent from './../../useragent/useragent.js';
import {TreeNode} from './treenode.js';
import {BaseNode} from './treenode.js';
import {TypeAhead} from './typeahead.js';
// Copyright 2007 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview Definition of the TreeControl class, which
 * provides a way to view a hierarchical set of data.
 *
 *
 * This is a based on the webfx tree control. It since been updated to add
 * typeahead support, as well as accessibility support using ARIA framework.
 *
 * @see ../../demos/tree/demo.html
 */

/**
 * This creates a TreeControl object. A tree control provides a way to
 * view a hierarchical set of data.
 *     Strings are treated as plain-text and will be HTML escaped.
 *    TreeControl.defaultConfig. If not specified, a default config
 *    will be used.
 * @extends {BaseNode}
 */
class TreeControl extends BaseNode {

  /**
   * This creates a TreeControl object. A tree control provides a way to
   * view a hierarchical set of data.
   * @param {string|!SafeHtml} content The content of the node label.
   *     Strings are treated as plain-text and will be HTML escaped.
   * @param {Object=} opt_config The configuration for the tree. See
   *    TreeControl.defaultConfig. If not specified, a default config
   *    will be used.
   * @param {DomHelper=} opt_domHelper Optional DOM helper.
   */
  constructor(content, opt_config, opt_domHelper) {
    super(content, opt_config, opt_domHelper);
  
    // The root is open and selected by default.
    this.setExpandedInternal(true);
    this.setSelectedInternal(true);
  
    this.selectedItem_ = this;
  
    /**
     * Used for typeahead support.
     * @private {!TypeAhead}
     */
    this.typeAhead_ = new TypeAhead();
  
    /**
     * The object handling keyboard events.
     * @private {?KeyHandler}
     */
    this.keyHandler_ = null;
  
    /**
     * The object handling focus events.
     * @private {?FocusHandler}
     */
    this.focusHandler_ = null;
  
    /**
     * Logger
     * @private {?LogLogger}
     */
    this.logger_ = goog_log.getLogger('this');
  
    /**
     * Whether the tree is focused.
     * @private {boolean}
     */
    this.focused_ = false;
  
    /**
     * Child node that currently has focus.
     * @private {?BaseNode}
     */
    this.focusedNode_ = null;
  
    /**
     * Whether to show lines.
     * @private {boolean}
     */
    this.showLines_ = true;
  
    /**
     * Whether to show expanded lines.
     * @private {boolean}
     */
    this.showExpandIcons_ = true;
  
    /**
     * Whether to show the root node.
     * @private {boolean}
     */
    this.showRootNode_ = true;
  
    /**
     * Whether to show the root lines.
     * @private {boolean}
     */
    this.showRootLines_ = true;
  
    if (userAgent.IE) {
  
      try {
        // works since IE6SP1
        document.execCommand('BackgroundImageCache', false, true);
      } catch (e) {
        goog_log.warning(this.logger_, 'Failed to enable background image cache');
      }
    }
  }

  /** @override */
  getTree() {
    return this;
  };

  /** @override */
  getDepth() {
    return 0;
  };

  /**
   * Expands the parent chain of this node so that it is visible.
   * @override
   */
  reveal() {
    // always expanded by default
    // needs to be overriden so that we don't try to reveal our parent
    // which is a generic component
  };

  /**
   * Handles focus on the tree.
   * @param {!EventsBrowserEvent} e The browser event.
   * @private
   */
  handleFocus_(e) {
    this.focused_ = true;
    classlist.add(
        asserts.assert(this.getElement()), google.getCssName('focused'));
  
    if (this.selectedItem_) {
      this.selectedItem_.select();
    }
  };

  /**
   * Handles blur on the tree.
   * @param {!EventsBrowserEvent} e The browser event.
   * @private
   */
  handleBlur_(e) {
    this.focused_ = false;
    classlist.remove(
        asserts.assert(this.getElement()), google.getCssName('focused'));
  };

  /**
   * @return {boolean} Whether the tree has keyboard focus.
   */
  hasFocus() {
    return this.focused_;
  };

  /** @override */
  getExpanded() {
    return !this.showRootNode_ ||
        super.getExpanded();
  };

  /** @override */
  setExpanded(expanded) {
    if (!this.showRootNode_) {
      this.setExpandedInternal(expanded);
    } else {
      super.setExpanded(expanded);
    }
  };

  /** @override */
  getExpandIconSafeHtml() {
    // no expand icon for root element
    return SafeHtml.EMPTY;
  };

  /** @override */
  getIconElement() {
    var el = this.getRowElement();
    return el ? /** @type {Element} */ (el.firstChild) : null;
  };

  /** @override */
  getExpandIconElement() {
    // no expand icon for root element
    return null;
  };

  /** @override */
  updateExpandIcon() {
    // no expand icon
  };

  /** @override */
  getRowClassName() {
    return super.getRowClassName() +
        (this.showRootNode_ ? '' : ' ' + this.getConfig().cssHideRoot);
  };

  /**
   * Returns the source for the icon.
   * @return {string} Src for the icon.
   * @override
   */
  getCalculatedIconClass() {
    var expanded = this.getExpanded();
    var expandedIconClass = this.getExpandedIconClass();
    if (expanded && expandedIconClass) {
      return expandedIconClass;
    }
    var iconClass = this.getIconClass();
    if (!expanded && iconClass) {
      return iconClass;
    }
  
    // fall back on default icons
    var config = this.getConfig();
    if (expanded && config.cssExpandedRootIcon) {
      return config.cssTreeIcon + ' ' + config.cssExpandedRootIcon;
    } else if (!expanded && config.cssCollapsedRootIcon) {
      return config.cssTreeIcon + ' ' + config.cssCollapsedRootIcon;
    }
    return '';
  };

  /**
   * Sets the selected item.
   * @param {BaseNode} node The item to select.
   */
  setSelectedItem(node) {
    if (this.selectedItem_ == node) {
      return;
    }
  
    var hadFocus = false;
    if (this.selectedItem_) {
      hadFocus = this.selectedItem_ == this.focusedNode_;
      this.selectedItem_.setSelectedInternal(false);
    }
  
    this.selectedItem_ = node;
  
    if (node) {
      node.setSelectedInternal(true);
      if (hadFocus) {
        node.select();
      }
    }
  
    this.dispatchEvent(EventsEventType.CHANGE);
  };

  /**
   * Returns the selected item.
   * @return {BaseNode} The currently selected item.
   */
  getSelectedItem() {
    return this.selectedItem_;
  };

  /**
   * Sets whether to show lines.
   * @param {boolean} b Whether to show lines.
   */
  setShowLines(b) {
    if (this.showLines_ != b) {
      this.showLines_ = b;
      if (this.isInDocument()) {
        this.updateLinesAndExpandIcons_();
      }
    }
  };

  /**
   * @return {boolean} Whether to show lines.
   */
  getShowLines() {
    return this.showLines_;
  };

  /**
   * Updates the lines after the tree has been drawn.
   * @private
   */
  updateLinesAndExpandIcons_() {
    var tree = this;
    var showLines = tree.getShowLines();
    var showRootLines = tree.getShowRootLines();
  
    /**
     * Recursively walk through all nodes and update the class names of the
     * expand icon and the children element.
     * @param {!BaseNode} node
     */
    function updateShowLines(node) {
      var childrenEl = node.getChildrenElement();
      if (childrenEl) {
        var hideLines = !showLines || tree == node.getParent() && !showRootLines;
        var childClass = hideLines ? node.getConfig().cssChildrenNoLines :
                                     node.getConfig().cssChildren;
        childrenEl.className = childClass;
  
        var expandIconEl = node.getExpandIconElement();
        if (expandIconEl) {
          expandIconEl.className = node.getExpandIconClass();
        }
      }
      node.forEachChild(updateShowLines);
    }
    updateShowLines(this);
  };

  /**
   * Sets whether to show root lines.
   * @param {boolean} b Whether to show root lines.
   */
  setShowRootLines(b) {
    if (this.showRootLines_ != b) {
      this.showRootLines_ = b;
      if (this.isInDocument()) {
        this.updateLinesAndExpandIcons_();
      }
    }
  };

  /**
   * @return {boolean} Whether to show root lines.
   */
  getShowRootLines() {
    return this.showRootLines_;
  };

  /**
   * Sets whether to show expand icons.
   * @param {boolean} b Whether to show expand icons.
   */
  setShowExpandIcons(b) {
    if (this.showExpandIcons_ != b) {
      this.showExpandIcons_ = b;
      if (this.isInDocument()) {
        this.updateLinesAndExpandIcons_();
      }
    }
  };

  /**
   * @return {boolean} Whether to show expand icons.
   */
  getShowExpandIcons() {
    return this.showExpandIcons_;
  };

  /**
   * Sets whether to show the root node.
   * @param {boolean} b Whether to show the root node.
   */
  setShowRootNode(b) {
    if (this.showRootNode_ != b) {
      this.showRootNode_ = b;
      if (this.isInDocument()) {
        var el = this.getRowElement();
        if (el) {
          el.className = this.getRowClassName();
        }
      }
      // Ensure that we do not hide the selected item.
      if (!b && this.getSelectedItem() == this && this.getFirstChild()) {
        this.setSelectedItem(this.getFirstChild());
      }
    }
  };

  /**
   * @return {boolean} Whether to show the root node.
   */
  getShowRootNode() {
    return this.showRootNode_;
  };

  /**
   * Add roles and states.
   * @protected
   * @override
   */
  initAccessibility() {
    super.initAccessibility();
  
    var elt = this.getElement();
    asserts.assert(elt, 'The DOM element for the tree cannot be null.');
    aria.setRole(elt, 'tree');
    aria.setState(elt, 'labelledby', this.getLabelElement().id);
  };

  /** @override */
  enterDocument() {
    super.enterDocument();
    var el = this.getElement();
    el.className = this.getConfig().cssRoot;
    el.setAttribute('hideFocus', 'true');
    this.attachEvents_();
    this.initAccessibility();
  };

  /** @override */
  exitDocument() {
    super.exitDocument();
    this.detachEvents_();
  };

  /**
   * Adds the event listeners to the tree.
   * @private
   */
  attachEvents_() {
    var el = this.getElement();
    el.tabIndex = 0;
  
    var kh = this.keyHandler_ = new KeyHandler(el);
    var fh = this.focusHandler_ = new FocusHandler(el);
  
    this.getHandler()
        .listen(fh, EventType.FOCUSOUT, this.handleBlur_)
        .listen(fh, EventType.FOCUSIN, this.handleFocus_)
        .listen(kh, KeyHandlerEventType.KEY, this.handleKeyEvent)
        .listen(el, EventsEventType.MOUSEDOWN, this.handleMouseEvent_)
        .listen(el, EventsEventType.CLICK, this.handleMouseEvent_)
        .listen(el, EventsEventType.DBLCLICK, this.handleMouseEvent_);
  };

  /**
   * Removes the event listeners from the tree.
   * @private
   */
  detachEvents_() {
    this.keyHandler_.dispose();
    this.keyHandler_ = null;
    this.focusHandler_.dispose();
    this.focusHandler_ = null;
  };

  /**
   * Handles mouse events.
   * @param {!EventsBrowserEvent} e The browser event.
   * @private
   */
  handleMouseEvent_(e) {
    goog_log.fine(this.logger_, 'Received event ' + e.type);
    var node = this.getNodeFromEvent_(e);
    if (node) {
      switch (e.type) {
        case EventsEventType.MOUSEDOWN:
          node.onMouseDown(e);
          break;
        case EventsEventType.CLICK:
          node.onClick_(e);
          break;
        case EventsEventType.DBLCLICK:
          node.onDoubleClick_(e);
          break;
      }
    }
  };

  /**
   * Handles key down on the tree.
   * @param {!EventsBrowserEvent} e The browser event.
   * @return {boolean} The handled value.
   */
  handleKeyEvent(e) {
    var handled = false;
  
    // Handle typeahead and navigation keystrokes.
    handled = this.typeAhead_.handleNavigation(e) ||
        (this.selectedItem_ && this.selectedItem_.onKeyDown(e)) ||
        this.typeAhead_.handleTypeAheadChar(e);
  
    if (handled) {
      e.preventDefault();
    }
  
    return handled;
  };

  /**
   * Finds the containing node given an event.
   * @param {!EventsBrowserEvent} e The browser event.
   * @return {BaseNode} The containing node or null if no node is
   *     found.
   * @private
   */
  getNodeFromEvent_(e) {
    // find the right node
    var node = null;
    var target = e.target;
    while (target != null) {
      var id = target.id;
      node = BaseNode.allNodes[id];
      if (node) {
        return node;
      }
      if (target == this.getElement()) {
        break;
      }
      target = target.parentNode;
    }
    return null;
  };

  /**
   * Creates a new tree node using the same config as the root.
   * @param {string=} opt_content The content of the node label. Strings are
   *     treated as plain-text and will be HTML escaped. To set SafeHtml content,
   *     omit opt_content and call setSafeHtml on the resulting node.
   * @return {!TreeNode} The new item.
   */
  createNode(opt_content) {
    return new TreeNode(opt_content || SafeHtml.EMPTY,
        this.getConfig(), this.getDomHelper());
  };

  /**
   * Allows the caller to notify that the given node has been added or just had
   * been updated in the tree.
   * @param {BaseNode} node New node being added or existing node
   *    that just had been updated.
   */
  setNode(node) {
    this.typeAhead_.setNodeInMap(node);
  };

  /**
   * Allows the caller to notify that the given node is being removed from the
   * tree.
   * @param {BaseNode} node Node being removed.
   */
  removeNode(node) {
    this.typeAhead_.removeNodeFromMap(node);
  };

  /**
   * Clear the typeahead buffer.
   */
  clearTypeAhead() {
    this.typeAhead_.clear();
  };
}

/**
 * A default configuration for the tree.
 * @override
 */
TreeControl.defaultConfig = BaseNode.defaultConfig;

export {TreeControl};