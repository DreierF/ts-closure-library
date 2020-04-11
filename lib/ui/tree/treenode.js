import * as aria from './../../a11y/aria/aria.js';
import {State} from './../../a11y/aria/attributes.js';
import * as asserts from './../../asserts/asserts.js';
import {DomHelper} from './../../dom/dom.js';
import * as safe from './../../dom/safe.js';
import {BrowserEvent as EventsBrowserEvent} from './../../events/browserevent.js';
import {Event as EventsEvent} from './../../events/event.js';
import {KeyCodes} from './../../events/keycodes.js';
import * as google from './../../google.js';
import {SafeHtml} from './../../html/safehtml.js';
import {SafeStyle} from './../../html/safestyle.js';
import * as strings from './../../string/string.js';
import {StringBuffer} from './../../string/stringbuffer.js';
import * as googstyle from './../../style/style.js';
import {Timer} from './../../timer/timer.js';
import {Component} from './../component.js';
import {TreeControl as TreeTreeControl} from './treecontrol.js';
import {TreeControl} from './treecontrol.js';
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
 * @fileoverview Definition of the BaseNode class.
 *
 *
 * This is a based on the webfx tree control. It since been updated to add
 * typeahead support, as well as accessibility support using ARIA framework.
 * See file comment in treecontrol.js.
 */

  // circular

/**
 * An abstract base class for a node in the tree.
 *
 *     Strings are treated as plain-text and will be HTML escaped.
 *    {@link BaseNode.defaultConfig}. If not specified the
 *    default config will be used.
 * @extends {Component}
 * @abstract
 */
class BaseNode extends Component {

  /**
   * An abstract base class for a node in the tree.
   *
   * @param {string|!SafeHtml} content The content of the node label.
   *     Strings are treated as plain-text and will be HTML escaped.
   * @param {Object=} opt_config The configuration for the tree. See
   *    {@link BaseNode.defaultConfig}. If not specified the
   *    default config will be used.
   * @param {DomHelper=} opt_domHelper Optional DOM helper.
   */
  constructor(content, opt_config, opt_domHelper) {
    super(opt_domHelper);
    /**
     * @deprecated Use {@link #removeChild}.
     */
    this.remove =
        BaseNode.prototype.removeChild;
  
  
    /**
     * The configuration for the tree.
     * @type {Object}
     * @private
     */
    this.config_ = opt_config || BaseNode.defaultConfig;
  
    /**
     * HTML content of the node label.
     * @type {!SafeHtml}
     * @private
     */
    this.html_ = SafeHtml.htmlEscapePreservingNewlines(content);
  
    /** @private {string} */
    this.iconClass_;
  
    /** @private {string} */
    this.expandedIconClass_;
  
    /** @protected {TreeControl} */
    this.tree;
  
    /** @private {BaseNode} */
    this.previousSibling_;
  
    /** @private {BaseNode} */
    this.nextSibling_;
  
    /** @private {BaseNode} */
    this.firstChild_;
  
    /** @private {BaseNode} */
    this.lastChild_;
  
    /**
     * Whether the tree item is selected.
     * @private {boolean}
     */
    this.selected_ = false;
  
    /**
     * Whether the tree node is expanded.
     * @private {boolean}
     */
    this.expanded_ = false;
  
    /**
     * Tooltip for the tree item
     * @private {?string}
     */
    this.toolTip_ = null;
  
    /**
     * HTML that can appear after the label (so not inside the anchor).
     * @private {!SafeHtml}
     */
    this.afterLabelHtml_ = SafeHtml.EMPTY;
  
    /**
     * Whether to allow user to collapse this node.
     * @private {boolean}
     */
    this.isUserCollapsible_ = true;
  
    /**
     * Nesting depth of this node; cached result of computeDepth_.
     * -1 if value has not been cached.
     * @private {number}
     */
    this.depth_ = -1;
  }

  /** @override */
  disposeInternal() {
    super.disposeInternal();
    if (this.tree) {
      this.tree.removeNode(this);
      this.tree = null;
    }
    this.setElementInternal(null);
  };

  /**
   * Adds roles and states.
   * @protected
   */
  initAccessibility() {
    var el = this.getElement();
    if (el) {
      // Set an id for the label
      var label = this.getLabelElement();
      if (label && !label.id) {
        label.id = this.getId() + '.label';
      }
  
      aria.setRole(el, 'treeitem');
      aria.setState(el, 'selected', false);
      aria.setState(el, 'level', this.getDepth());
      if (label) {
        aria.setState(el, 'labelledby', label.id);
      }
  
      var img = this.getIconElement();
      if (img) {
        aria.setRole(img, 'presentation');
      }
      var ei = this.getExpandIconElement();
      if (ei) {
        aria.setRole(ei, 'presentation');
      }
  
      var ce = this.getChildrenElement();
      if (ce) {
        aria.setRole(ce, 'group');
  
        // In case the children will be created lazily.
        if (ce.hasChildNodes()) {
          // Only set aria-expanded if the node has children (can be expanded).
          aria.setState(el, State.EXPANDED, false);
  
          // do setsize for each child
          var count = this.getChildCount();
          for (var i = 1; i <= count; i++) {
            var child = this.getChildAt(i - 1).getElement();
            asserts.assert(child, 'The child element cannot be null');
            aria.setState(child, 'setsize', count);
            aria.setState(child, 'posinset', i);
          }
        }
      }
    }
  };

  /** @override */
  createDom() {
    var element = this.getDomHelper().safeHtmlToNode(this.toSafeHtml());
    this.setElementInternal(/** @type {!Element} */ (element));
  };

  /** @override */
  enterDocument() {
    super.enterDocument();
    BaseNode.allNodes[this.getId()] = this;
    this.initAccessibility();
  };

  /** @override */
  exitDocument() {
    super.exitDocument();
    delete BaseNode.allNodes[this.getId()];
  };

  /**
   * The method assumes that the child doesn't have parent node yet.
   * The `opt_render` argument is not used. If the parent node is expanded,
   * the child node's state will be the same as the parent's. Otherwise the
   * child's DOM tree won't be created.
   * @override
   */
  addChildAt(
      child, index, opt_render) {
    asserts.assert(!child.getParent());
    asserts.assertInstanceof(child, BaseNode);
    var prevNode = this.getChildAt(index - 1);
    var nextNode = this.getChildAt(index);
  
    super.addChildAt(child, index);
  
    child.previousSibling_ = prevNode;
    child.nextSibling_ = nextNode;
  
    if (prevNode) {
      prevNode.nextSibling_ = child;
    } else {
      this.firstChild_ = child;
    }
    if (nextNode) {
      nextNode.previousSibling_ = child;
    } else {
      this.lastChild_ = child;
    }
  
    var tree = this.getTree();
    if (tree) {
      child.setTreeInternal(tree);
    }
  
    child.setDepth_(this.getDepth() + 1);
  
    var el = this.getElement();
    if (el) {
      this.updateExpandIcon();
      aria.setState(
          el, State.EXPANDED, this.getExpanded());
      if (this.getExpanded()) {
        var childrenEl = this.getChildrenElement();
        if (!child.getElement()) {
          child.createDom();
        }
        var childElement = child.getElement();
        var nextElement = nextNode && nextNode.getElement();
        childrenEl.insertBefore(childElement, nextElement);
  
        if (this.isInDocument()) {
          child.enterDocument();
        }
  
        if (!nextNode) {
          if (prevNode) {
            prevNode.updateExpandIcon();
          } else {
            googstyle.setElementShown(childrenEl, true);
            this.setExpanded(this.getExpanded());
          }
        }
      }
    }
  };

  /**
   * Adds a node as a child to the current node.
   * @param {BaseNode} child The child to add.
   * @param {BaseNode=} opt_before If specified, the new child is
   *    added as a child before this one. If not specified, it's appended to the
   *    end.
   * @return {!BaseNode} The added child.
   */
  add(child, opt_before) {
    asserts.assert(
        !opt_before || opt_before.getParent() == this,
        'Can only add nodes before siblings');
    if (child.getParent()) {
      child.getParent().removeChild(child);
    }
    this.addChildAt(
        child, opt_before ? this.indexOfChild(opt_before) : this.getChildCount());
    return child;
  };

  /**
   * Removes a child. The caller is responsible for disposing the node.
   * @param {Component|string} childNode The child to remove. Must be a
   *     {@link BaseNode}.
   * @param {boolean=} opt_unrender Unused. The child will always be unrendered.
   * @return {!BaseNode} The child that was removed.
   * @override
   */
  removeChild(
      childNode, opt_unrender) {
    // In reality, this only accepts BaseNodes.
    var child = /** @type {BaseNode} */ (childNode);
  
    // if we remove selected or tree with the selected we should select this
    var tree = this.getTree();
    var selectedNode = tree ? tree.getSelectedItem() : null;
    if (selectedNode == child || child.contains(selectedNode)) {
      if (tree.hasFocus()) {
        this.select();
        Timer.callOnce(this.onTimeoutSelect_, 10, this);
      } else {
        this.select();
      }
    }
  
    super.removeChild(child);
  
    if (this.lastChild_ == child) {
      this.lastChild_ = child.previousSibling_;
    }
    if (this.firstChild_ == child) {
      this.firstChild_ = child.nextSibling_;
    }
    if (child.previousSibling_) {
      child.previousSibling_.nextSibling_ = child.nextSibling_;
    }
    if (child.nextSibling_) {
      child.nextSibling_.previousSibling_ = child.previousSibling_;
    }
  
    var wasLast = child.isLastSibling();
  
    child.tree = null;
    child.depth_ = -1;
  
    if (tree) {
      // Tell the tree control that the child node is now removed.
      tree.removeNode(child);
  
      if (this.isInDocument()) {
        var childrenEl = this.getChildrenElement();
  
        if (child.isInDocument()) {
          var childEl = child.getElement();
          childrenEl.removeChild(childEl);
  
          child.exitDocument();
        }
  
        if (wasLast) {
          var newLast = this.getLastChild();
          if (newLast) {
            newLast.updateExpandIcon();
          }
        }
        if (!this.hasChildren()) {
          childrenEl.style.display = 'none';
          this.updateExpandIcon();
          this.updateIcon_();
  
          var el = this.getElement();
          if (el) {
            aria.removeState(el, State.EXPANDED);
          }
        }
      }
    }
  
    return child;
  };

  /**
   * Handler for setting focus asynchronously.
   * @private
   */
  onTimeoutSelect_() {
    this.select();
  };

  /**
   * Returns the tree.
   * @return {?TreeControl}
   * @abstract
   */
  getTree() {}

  /**
   * Returns the depth of the node in the tree. Should not be overridden.
   * @return {number} The non-negative depth of this node (the root is zero).
   */
  getDepth() {
    var depth = this.depth_;
    if (depth < 0) {
      depth = this.computeDepth_();
      this.setDepth_(depth);
    }
    return depth;
  };

  /**
   * Computes the depth of the node in the tree.
   * Called only by getDepth, when the depth hasn't already been cached.
   * @return {number} The non-negative depth of this node (the root is zero).
   * @private
   */
  computeDepth_() {
    var parent = this.getParent();
    if (parent) {
      return parent.getDepth() + 1;
    } else {
      return 0;
    }
  };

  /**
   * Changes the depth of a node (and all its descendants).
   * @param {number} depth The new nesting depth; must be non-negative.
   * @private
   */
  setDepth_(depth) {
    if (depth != this.depth_) {
      this.depth_ = depth;
      var row = this.getRowElement();
      if (row) {
        var indent = this.getPixelIndent_() + 'px';
        if (this.isRightToLeft()) {
          row.style.paddingRight = indent;
        } else {
          row.style.paddingLeft = indent;
        }
      }
      this.forEachChild(function(child) { child.setDepth_(depth + 1); });
    }
  };

  /**
   * Returns true if the node is a descendant of this node
   * @param {BaseNode} node The node to check.
   * @return {boolean} True if the node is a descendant of this node, false
   *    otherwise.
   */
  contains(node) {
    var current = node;
    while (current) {
      if (current == this) {
        return true;
      }
      current = current.getParent();
    }
    return false;
  };

  /**
   * @param {number} index 0-based index.
   * @return {BaseNode} The child at the given index; null if none.
   * @override
   */
  getChildAt(index) {
    return /** @type {BaseNode} */(super.getChildAt(index));
  };

  /**
   * Returns the children of this node.
   * @return {!Array<!BaseNode>} The children.
   */
  getChildren() {
    var children = [];
    this.forEachChild(function(child) { children.push(child); });
    return children;
  };

  /**
   * @return {BaseNode} The first child of this node.
   */
  getFirstChild() {
    return this.getChildAt(0);
  };

  /**
   * @return {BaseNode} The last child of this node.
   */
  getLastChild() {
    return this.getChildAt(this.getChildCount() - 1);
  };

  /**
   * @return {BaseNode} The previous sibling of this node.
   */
  getPreviousSibling() {
    return this.previousSibling_;
  };

  /**
   * @return {BaseNode} The next sibling of this node.
   */
  getNextSibling() {
    return this.nextSibling_;
  };

  /**
   * @return {boolean} Whether the node is the last sibling.
   */
  isLastSibling() {
    return !this.nextSibling_;
  };

  /**
   * @return {boolean} Whether the node is selected.
   */
  isSelected() {
    return this.selected_;
  };

  /**
   * Selects the node.
   */
  select() {
    var tree = this.getTree();
    if (tree) {
      tree.setSelectedItem(this);
    }
  };

  /**
   * Originally it was intended to deselect the node but never worked.
   * @deprecated Use `tree.setSelectedItem(null)`.
   */
  deselect() {}

  /**
   * Called from the tree to instruct the node change its selection state.
   * @param {boolean} selected The new selection state.
   * @protected
   */
  setSelectedInternal(selected) {
    if (this.selected_ == selected) {
      return;
    }
    this.selected_ = selected;
  
    this.updateRow();
  
    var el = this.getElement();
    if (el) {
      aria.setState(el, 'selected', selected);
      if (selected) {
        var treeElement = this.getTree().getElement();
        asserts.assert(
            treeElement, 'The DOM element for the tree cannot be null');
        aria.setState(treeElement, 'activedescendant', this.getId());
      }
    }
  };

  /**
   * @return {boolean} Whether the node is expanded.
   */
  getExpanded() {
    return this.expanded_;
  };

  /**
   * Sets the node to be expanded internally, without state change events.
   * @param {boolean} expanded Whether to expand or close the node.
   */
  setExpandedInternal(expanded) {
    this.expanded_ = expanded;
  };

  /**
   * Sets the node to be expanded.
   * @param {boolean} expanded Whether to expand or close the node.
   */
  setExpanded(expanded) {
    var isStateChange = expanded != this.expanded_;
    if (isStateChange) {
      // Only fire events if the expanded state has actually changed.
      var prevented = !this.dispatchEvent(
          expanded ? EventType.BEFORE_EXPAND :
                     EventType.BEFORE_COLLAPSE);
      if (prevented) return;
    }
    var ce;
    this.expanded_ = expanded;
    var tree = this.getTree();
    var el = this.getElement();
  
    if (this.hasChildren()) {
      if (!expanded && tree && this.contains(tree.getSelectedItem())) {
        this.select();
      }
  
      if (el) {
        ce = this.getChildrenElement();
        if (ce) {
          googstyle.setElementShown(ce, expanded);
          aria.setState(el, State.EXPANDED, expanded);
  
          // Make sure we have the HTML for the children here.
          if (expanded && this.isInDocument() && !ce.hasChildNodes()) {
            var children = [];
            this.forEachChild(function(child) {
              children.push(child.toSafeHtml());
            });
            safe.setInnerHtml(ce, SafeHtml.concat(children));
            this.forEachChild(function(child) { child.enterDocument(); });
          }
        }
        this.updateExpandIcon();
      }
    } else {
      ce = this.getChildrenElement();
      if (ce) {
        googstyle.setElementShown(ce, false);
      }
    }
    if (el) {
      this.updateIcon_();
    }
  
    if (isStateChange) {
      this.dispatchEvent(
          expanded ? EventType.EXPAND :
                     EventType.COLLAPSE);
    }
  };

  /**
   * Toggles the expanded state of the node.
   */
  toggle() {
    this.setExpanded(!this.getExpanded());
  };

  /**
   * Expands the node.
   */
  expand() {
    this.setExpanded(true);
  };

  /**
   * Collapses the node.
   */
  collapse() {
    this.setExpanded(false);
  };

  /**
   * Collapses the children of the node.
   */
  collapseChildren() {
    this.forEachChild(function(child) { child.collapseAll(); });
  };

  /**
   * Collapses the children and the node.
   */
  collapseAll() {
    this.collapseChildren();
    this.collapse();
  };

  /**
   * Expands the children of the node.
   */
  expandChildren() {
    this.forEachChild(function(child) { child.expandAll(); });
  };

  /**
   * Expands the children and the node.
   */
  expandAll() {
    this.expandChildren();
    this.expand();
  };

  /**
   * Expands the parent chain of this node so that it is visible.
   */
  reveal() {
    var parent = this.getParent();
    if (parent) {
      parent.setExpanded(true);
      parent.reveal();
    }
  };

  /**
   * Sets whether the node will allow the user to collapse it.
   * @param {boolean} isCollapsible Whether to allow node collapse.
   */
  setIsUserCollapsible(isCollapsible) {
    this.isUserCollapsible_ = isCollapsible;
    if (!this.isUserCollapsible_) {
      this.expand();
    }
    if (this.getElement()) {
      this.updateExpandIcon();
    }
  };

  /**
   * @return {boolean} Whether the node is collapsible by user actions.
   */
  isUserCollapsible() {
    return this.isUserCollapsible_;
  };

  /**
   * Creates HTML for the node.
   * @return {!SafeHtml}
   * @protected
   */
  toSafeHtml() {
    var tree = this.getTree();
    var hideLines = !tree.getShowLines() ||
        tree == this.getParent() && !tree.getShowRootLines();
  
    var childClass =
        hideLines ? this.config_.cssChildrenNoLines : this.config_.cssChildren;
  
    var nonEmptyAndExpanded = this.getExpanded() && this.hasChildren();
  
    var attributes = {'class': childClass, 'style': this.getLineStyle()};
  
    var content = [];
    if (nonEmptyAndExpanded) {
      // children
      this.forEachChild(function(child) { content.push(child.toSafeHtml()); });
    }
  
    var children = SafeHtml.create('div', attributes, content);
  
    return SafeHtml.create(
        'div', {'class': this.config_.cssItem, 'id': this.getId()},
        [this.getRowSafeHtml(), children]);
  };

  /**
   * @return {number} The pixel indent of the row.
   * @private
   */
  getPixelIndent_() {
    return Math.max(0, (this.getDepth() - 1) * this.config_.indentWidth);
  };

  /**
   * @return {!SafeHtml} The html for the row.
   * @protected
   */
  getRowSafeHtml() {
    var style = {};
    style['padding-' + (this.isRightToLeft() ? 'right' : 'left')] =
        this.getPixelIndent_() + 'px';
    var attributes = {'class': this.getRowClassName(), 'style': style};
    var content = [
      this.getExpandIconSafeHtml(), this.getIconSafeHtml(),
      this.getLabelSafeHtml()
    ];
    return SafeHtml.create('div', attributes, content);
  };

  /**
   * @return {string} The class name for the row.
   * @protected
   */
  getRowClassName() {
    var selectedClass;
    if (this.isSelected()) {
      selectedClass = ' ' + this.config_.cssSelectedRow;
    } else {
      selectedClass = '';
    }
    return this.config_.cssTreeRow + selectedClass;
  };

  /**
   * @return {!SafeHtml} The html for the label.
   * @protected
   */
  getLabelSafeHtml() {
    var html = SafeHtml.create(
        'span',
        {'class': this.config_.cssItemLabel, 'title': this.getToolTip() || null},
        this.getSafeHtml());
    return SafeHtml.concat(
        html,
        SafeHtml.create('span', {}, this.getAfterLabelSafeHtml()));
  };

  /**
   * Returns the html that appears after the label. This is useful if you want to
   * put extra UI on the row of the label but not inside the anchor tag.
   * @return {string} The html.
   * @final
   */
  getAfterLabelHtml() {
    return SafeHtml.unwrap(this.getAfterLabelSafeHtml());
  };

  /**
   * Returns the html that appears after the label. This is useful if you want to
   * put extra UI on the row of the label but not inside the anchor tag.
   * @return {!SafeHtml} The html.
   */
  getAfterLabelSafeHtml() {
    return this.afterLabelHtml_;
  };

  /**
   * Sets the html that appears after the label. This is useful if you want to
   * put extra UI on the row of the label but not inside the anchor tag.
   * @param {!SafeHtml} html The html.
   */
  setAfterLabelSafeHtml(html) {
    this.afterLabelHtml_ = html;
    var el = this.getAfterLabelElement();
    if (el) {
      safe.setInnerHtml(el, html);
    }
  };

  /**
   * @return {!SafeHtml} The html for the icon.
   * @protected
   */
  getIconSafeHtml() {
    return SafeHtml.create('span', {
      'style': {'display': 'inline-block'},
      'class': this.getCalculatedIconClass()
    });
  };

  /**
   * Gets the calculated icon class.
   * @protected
   * @return {string}
   * @abstract
   */
  getCalculatedIconClass() {}

  /**
   * @return {!SafeHtml} The source for the icon.
   * @protected
   */
  getExpandIconSafeHtml() {
    return SafeHtml.create('span', {
      'type': 'expand',
      'style': {'display': 'inline-block'},
      'class': this.getExpandIconClass()
    });
  };

  /**
   * @return {string} The class names of the icon used for expanding the node.
   * @protected
   */
  getExpandIconClass() {
    var tree = this.getTree();
    var hideLines = !tree.getShowLines() ||
        tree == this.getParent() && !tree.getShowRootLines();
  
    var config = this.config_;
    var sb = new StringBuffer();
    sb.append(config.cssTreeIcon, ' ', config.cssExpandTreeIcon, ' ');
  
    if (this.hasChildren()) {
      var bits = 0;
      /*
        Bitmap used to determine which icon to use
        1  Plus
        2  Minus
        4  T Line
        8  L Line
      */
  
      if (tree.getShowExpandIcons() && this.isUserCollapsible_) {
        if (this.getExpanded()) {
          bits = 2;
        } else {
          bits = 1;
        }
      }
  
      if (!hideLines) {
        if (this.isLastSibling()) {
          bits += 4;
        } else {
          bits += 8;
        }
      }
  
      switch (bits) {
        case 1:
          sb.append(config.cssExpandTreeIconPlus);
          break;
        case 2:
          sb.append(config.cssExpandTreeIconMinus);
          break;
        case 4:
          sb.append(config.cssExpandTreeIconL);
          break;
        case 5:
          sb.append(config.cssExpandTreeIconLPlus);
          break;
        case 6:
          sb.append(config.cssExpandTreeIconLMinus);
          break;
        case 8:
          sb.append(config.cssExpandTreeIconT);
          break;
        case 9:
          sb.append(config.cssExpandTreeIconTPlus);
          break;
        case 10:
          sb.append(config.cssExpandTreeIconTMinus);
          break;
        default:  // 0
          sb.append(config.cssExpandTreeIconBlank);
      }
    } else {
      if (hideLines) {
        sb.append(config.cssExpandTreeIconBlank);
      } else if (this.isLastSibling()) {
        sb.append(config.cssExpandTreeIconL);
      } else {
        sb.append(config.cssExpandTreeIconT);
      }
    }
    return sb.toString();
  };

  /**
   * @return {!SafeStyle} The line style.
   */
  getLineStyle() {
    var nonEmptyAndExpanded = this.getExpanded() && this.hasChildren();
    return SafeStyle.create({
      'background-position': this.getBackgroundPosition(),
      'display': nonEmptyAndExpanded ? null : 'none'
    });
  };

  /**
   * @return {string} The background position style value.
   */
  getBackgroundPosition() {
    return (this.isLastSibling() ? '-100' : (this.getDepth() - 1) *
                    this.config_.indentWidth) +
        'px 0';
  };

  /**
   * @return {Element} The element for the tree node.
   * @override
   */
  getElement() {
    var el = super.getElement();
    if (!el) {
      el = this.getDomHelper().getElement(this.getId());
      this.setElementInternal(el);
    }
    return el;
  };

  /**
   * @return {Element} The row is the div that is used to draw the node without
   *     the children.
   */
  getRowElement() {
    var el = this.getElement();
    return el ? /** @type {Element} */ (el.firstChild) : null;
  };

  /**
   * @return {Element} The expanded icon element.
   * @protected
   */
  getExpandIconElement() {
    var el = this.getRowElement();
    return el ? /** @type {Element} */ (el.firstChild) : null;
  };

  /**
   * @return {Element} The icon element.
   * @protected
   */
  getIconElement() {
    var el = this.getRowElement();
    return el ? /** @type {Element} */ (el.childNodes[1]) : null;
  };

  /**
   * @return {Element} The label element.
   */
  getLabelElement() {
    var el = this.getRowElement();
    // TODO: find/fix race condition that requires us to add
    // the lastChild check
    return el && el.lastChild ?
        /** @type {Element} */ (el.lastChild.previousSibling) :
                               null;
  };

  /**
   * @return {Element} The element after the label.
   */
  getAfterLabelElement() {
    var el = this.getRowElement();
    return el ? /** @type {Element} */ (el.lastChild) : null;
  };

  /**
   * @return {Element} The div containing the children.
   * @protected
   */
  getChildrenElement() {
    var el = this.getElement();
    return el ? /** @type {Element} */ (el.lastChild) : null;
  };

  /**
   * Sets the icon class for the node.
   * @param {string} s The icon class.
   */
  setIconClass(s) {
    this.iconClass_ = s;
    if (this.isInDocument()) {
      this.updateIcon_();
    }
  };

  /**
   * Gets the icon class for the node.
   * @return {string} s The icon source.
   */
  getIconClass() {
    return this.iconClass_;
  };

  /**
   * Sets the icon class for when the node is expanded.
   * @param {string} s The expanded icon class.
   */
  setExpandedIconClass(s) {
    this.expandedIconClass_ = s;
    if (this.isInDocument()) {
      this.updateIcon_();
    }
  };

  /**
   * Gets the icon class for when the node is expanded.
   * @return {string} The class.
   */
  getExpandedIconClass() {
    return this.expandedIconClass_;
  };

  /**
   * Sets the text of the label.
   * @param {string} s The plain text of the label.
   */
  setText(s) {
    this.setSafeHtml(SafeHtml.htmlEscape(s));
  };

  /**
   * Returns the text of the label. If the text was originally set as HTML, the
   * return value is unspecified.
   * @return {string} The plain text of the label.
   */
  getText() {
    return strings.unescapeEntities(SafeHtml.unwrap(this.html_));
  };

  /**
   * Sets the HTML of the label.
   * @param {!SafeHtml} html The HTML object for the label.
   */
  setSafeHtml(html) {
    this.html_ = html;
    var el = this.getLabelElement();
    if (el) {
      safe.setInnerHtml(el, html);
    }
    var tree = this.getTree();
    if (tree) {
      // Tell the tree control about the updated label text.
      tree.setNode(this);
    }
  };

  /**
   * Returns the html of the label.
   * @return {string} The html string of the label.
   * @final
   */
  getHtml() {
    return SafeHtml.unwrap(this.getSafeHtml());
  };

  /**
   * Returns the html of the label.
   * @return {!SafeHtml} The html string of the label.
   */
  getSafeHtml() {
    return this.html_;
  };

  /**
   * Sets the text of the tooltip.
   * @param {string} s The tooltip text to set.
   */
  setToolTip(s) {
    this.toolTip_ = s;
    var el = this.getLabelElement();
    if (el) {
      el.title = s;
    }
  };

  /**
   * Returns the text of the tooltip.
   * @return {?string} The tooltip text.
   */
  getToolTip() {
    return this.toolTip_;
  };

  /**
   * Updates the row styles.
   */
  updateRow() {
    var rowEl = this.getRowElement();
    if (rowEl) {
      rowEl.className = this.getRowClassName();
    }
  };

  /**
   * Updates the expand icon of the node.
   */
  updateExpandIcon() {
    var img = this.getExpandIconElement();
    if (img) {
      img.className = this.getExpandIconClass();
    }
    var cel = this.getChildrenElement();
    if (cel) {
      cel.style.backgroundPosition = this.getBackgroundPosition();
    }
  };

  /**
   * Updates the icon of the node. Assumes that this.getElement() is created.
   * @private
   */
  updateIcon_() {
    this.getIconElement().className = this.getCalculatedIconClass();
  };

  /**
   * Handles mouse down event.
   * @param {!EventsBrowserEvent} e The browser event.
   * @protected
   */
  onMouseDown(e) {
    var el = e.target;
    // expand icon
    var type = el.getAttribute('type');
    if (type == 'expand' && this.hasChildren()) {
      if (this.isUserCollapsible_) {
        this.toggle();
      }
      return;
    }
  
    this.select();
    this.updateRow();
  };

  /**
   * Handles a click event.
   * @param {!EventsBrowserEvent} e The browser event.
   * @protected
   * @suppress {underscore|visibility}
   */
  onClick_(e) {
    return EventsEvent.preventDefault(e);
  }

  /**
   * Handles a double click event.
   * @param {!EventsBrowserEvent} e The browser event.
   * @protected
   * @suppress {underscore|visibility}
   */
  onDoubleClick_(e) {
    var el = e.target;
    // expand icon
    var type = el.getAttribute('type');
    if (type == 'expand' && this.hasChildren()) {
      return;
    }
  
    if (this.isUserCollapsible_) {
      this.toggle();
    }
  };

  /**
   * Handles a key down event.
   * @param {!EventsBrowserEvent} e The browser event.
   * @return {boolean} The handled value.
   * @protected
   */
  onKeyDown(e) {
    var handled = true;
    switch (e.keyCode) {
      case KeyCodes.RIGHT:
        if (e.altKey) {
          break;
        }
        if (this.hasChildren()) {
          if (!this.getExpanded()) {
            this.setExpanded(true);
          } else {
            this.getFirstChild().select();
          }
        }
        break;
  
      case KeyCodes.LEFT:
        if (e.altKey) {
          break;
        }
        if (this.hasChildren() && this.getExpanded() && this.isUserCollapsible_) {
          this.setExpanded(false);
        } else {
          var parent = this.getParent();
          var tree = this.getTree();
          // don't go to root if hidden
          if (parent && (tree.getShowRootNode() || parent != tree)) {
            parent.select();
          }
        }
        break;
  
      case KeyCodes.DOWN:
        var nextNode = this.getNextShownNode();
        if (nextNode) {
          nextNode.select();
        }
        break;
  
      case KeyCodes.UP:
        var previousNode = this.getPreviousShownNode();
        if (previousNode) {
          previousNode.select();
        }
        break;
  
      default:
        handled = false;
    }
  
    if (handled) {
      e.preventDefault();
      var tree = this.getTree();
      if (tree) {
        // clear type ahead buffer as user navigates with arrow keys
        tree.clearTypeAhead();
      }
    }
  
    return handled;
  };

  /**
   * @override
   * @return {BaseNode}
   */
  getParent() {
    return /** @type {BaseNode} */(super.getParent());
  };

  /**
   * @return {BaseNode} The last shown descendant.
   */
  getLastShownDescendant() {
    if (!this.getExpanded() || !this.hasChildren()) {
      return this;
    }
    // we know there is at least 1 child
    return this.getLastChild().getLastShownDescendant();
  };

  /**
   * @return {BaseNode} The next node to show or null if there isn't
   *     a next node to show.
   */
  getNextShownNode() {
    if (this.hasChildren() && this.getExpanded()) {
      return this.getFirstChild();
    } else {
      var parent = this;
      var next;
      while (parent != this.getTree()) {
        next = parent.getNextSibling();
        if (next != null) {
          return next;
        }
        parent = /** @type {BaseNode} */(parent.getParent());
      }
      return null;
    }
  };

  /**
   * @return {BaseNode} The previous node to show.
   */
  getPreviousShownNode() {
    var ps = this.getPreviousSibling();
    if (ps != null) {
      return ps.getLastShownDescendant();
    }
    var parent = this.getParent();
    var tree = this.getTree();
    if (!tree.getShowRootNode() && parent == tree) {
      return null;
    }
    // The root is the first node.
    if (this == tree) {
      return null;
    }
    return /** @type {BaseNode} */ (parent);
  };

  /**
   * @return {*} Data set by the client.
   * @deprecated Use {@link #getModel} instead.
   */
  getClientData() {
    return this.getModel();
  }

  /**
   * Sets client data to associate with the node.
   * @param {*} data The client data to associate with the node.
   * @deprecated Use {@link #setModel} instead.
   */
  setClientData(data) {
    return this.setModel(data);
  }

  /**
   * @return {Object} The configuration for the tree.
   */
  getConfig() {
    return this.config_;
  };

  /**
   * Internal method that is used to set the tree control on the node.
   * @param {TreeControl} tree The tree control.
   */
  setTreeInternal(tree) {
    if (this.tree != tree) {
      this.tree = tree;
      // Add new node to the type ahead node map.
      tree.setNode(this);
      this.forEachChild(function(child) { child.setTreeInternal(tree); });
    }
  };
}

/**
 * The event types dispatched by this class.
 * @enum {string}
 * @suppress {checkTypes}
 */
let EventType = {
  BEFORE_EXPAND: 'beforeexpand',
  EXPAND: 'expand',
  BEFORE_COLLAPSE: 'beforecollapse',
  COLLAPSE: 'collapse'
};

/**
 * Map of nodes in existence. Needed to route events to the appropriate nodes.
 * Nodes are added to the map at {@link #enterDocument} time and removed at
 * {@link #exitDocument} time.
 * @type {Object}
 * @protected
 */
BaseNode.allNodes = {};

/**
 * An array of empty children to return for nodes that have no children.
 * @type {!Array<!BaseNode>}
 * @private
 */
BaseNode.EMPTY_CHILDREN_ = [];

/**
 * A default configuration for the tree.
 */
BaseNode.defaultConfig = {
  indentWidth: 19,
  cssRoot: google.getCssName('goog-tree-root') + ' ' +
      google.getCssName('goog-tree-item'),
  cssHideRoot: google.getCssName('goog-tree-hide-root'),
  cssItem: google.getCssName('goog-tree-item'),
  cssChildren: google.getCssName('goog-tree-children'),
  cssChildrenNoLines: google.getCssName('goog-tree-children-nolines'),
  cssTreeRow: google.getCssName('goog-tree-row'),
  cssItemLabel: google.getCssName('goog-tree-item-label'),
  cssTreeIcon: google.getCssName('goog-tree-icon'),
  cssExpandTreeIcon: google.getCssName('goog-tree-expand-icon'),
  cssExpandTreeIconPlus: google.getCssName('goog-tree-expand-icon-plus'),
  cssExpandTreeIconMinus: google.getCssName('goog-tree-expand-icon-minus'),
  cssExpandTreeIconTPlus: google.getCssName('goog-tree-expand-icon-tplus'),
  cssExpandTreeIconTMinus: google.getCssName('goog-tree-expand-icon-tminus'),
  cssExpandTreeIconLPlus: google.getCssName('goog-tree-expand-icon-lplus'),
  cssExpandTreeIconLMinus: google.getCssName('goog-tree-expand-icon-lminus'),
  cssExpandTreeIconT: google.getCssName('goog-tree-expand-icon-t'),
  cssExpandTreeIconL: google.getCssName('goog-tree-expand-icon-l'),
  cssExpandTreeIconBlank: google.getCssName('goog-tree-expand-icon-blank'),
  cssExpandedFolderIcon: google.getCssName('goog-tree-expanded-folder-icon'),
  cssCollapsedFolderIcon: google.getCssName('goog-tree-collapsed-folder-icon'),
  cssFileIcon: google.getCssName('goog-tree-file-icon'),
  cssExpandedRootIcon: google.getCssName('goog-tree-expanded-folder-icon'),
  cssCollapsedRootIcon: google.getCssName('goog-tree-collapsed-folder-icon'),
  cssSelectedRow: google.getCssName('selected')
};

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
 * @fileoverview Definition of the TreeNode class.
 *
 *
 * This is a based on the webfx tree control. See file comment in
 * treecontrol.js.
 */

  // circular

/**
 * A single node in the tree.
 *     Strings are treated as plain-text and will be HTML escaped.
 *    TreeControl.defaultConfig. If not specified, a default config
 *    will be used.
 * @extends {BaseNode}
 */
class TreeNode extends BaseNode {

  /**
   * A single node in the tree.
   * @param {string|!SafeHtml} content The content of the node label.
   *     Strings are treated as plain-text and will be HTML escaped.
   * @param {Object=} opt_config The configuration for the tree. See
   *    TreeControl.defaultConfig. If not specified, a default config
   *    will be used.
   * @param {DomHelper=} opt_domHelper Optional DOM helper.
   */
  constructor(content, opt_config, opt_domHelper) {
    super(content, opt_config, opt_domHelper);
  }

  /**
   * Returns the tree.
   * @return {?TreeControl} The tree.
   * @override
   */
  getTree() {
    if (this.tree) {
      return this.tree;
    }
    var parent = this.getParent();
    if (parent) {
      var tree = /** @type {!TreeNode} */(parent).getTree();
      if (tree) {
        this.setTreeInternal(tree);
        return tree;
      }
    }
    return null;
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
    if (this.hasChildren()) {
      if (expanded && config.cssExpandedFolderIcon) {
        return config.cssTreeIcon + ' ' + config.cssExpandedFolderIcon;
      } else if (!expanded && config.cssCollapsedFolderIcon) {
        return config.cssTreeIcon + ' ' + config.cssCollapsedFolderIcon;
      }
    } else {
      if (config.cssFileIcon) {
        return config.cssTreeIcon + ' ' + config.cssFileIcon;
      }
    }
    return '';
  };
}

export {BaseNode, EventType, TreeNode};