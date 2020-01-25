import * as google from './../google.js';
import {Iterator} from './../iter/iter.js';
import {StopIteration} from './../iter/iter.js';
import * as dom from './dom.js';
import {NodeType} from './nodetype.js';
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
 * @fileoverview Iterator subclass for DOM tree traversal.
 */

/**
 * There are three types of token:
 *  <ol>
 *    <li>`START_TAG` - The beginning of a tag.
 *    <li>`OTHER` - Any non-element node position.
 *    <li>`END_TAG` - The end of a tag.
 *  </ol>
 * Users of this enumeration can rely on {@code START_TAG + END_TAG = 0} and
 * that {@code OTHER = 0}.
 *
 * @enum {number}
 */
let TagWalkType = {
  START_TAG: 1,
  OTHER: 0,
  END_TAG: -1
};

/**
 * A DOM tree traversal iterator.
 *
 * Starting with the given node, the iterator walks the DOM in order, reporting
 * events for the start and end of Elements, and the presence of text nodes. For
 * example:
 *
 * <pre>
 * &lt;div&gt;1&lt;span&gt;2&lt;/span&gt;3&lt;/div&gt;
 * </pre>
 *
 * Will return the following nodes:
 *
 * <code>[div, 1, span, 2, span, 3, div]</code>
 *
 * With the following states:
 *
 * <code>[START, OTHER, START, OTHER, END, OTHER, END]</code>
 *
 * And the following depths
 *
 * <code>[1, 1, 2, 2, 1, 1, 0]</code>
 *
 * Imagining <code>|</code> represents iterator position, the traversal stops at
 * each of the following locations:
 *
 * <pre>
 * &lt;div&gt;|1|&lt;span&gt;|2|&lt;/span&gt;|3|&lt;/div&gt;|
 * </pre>
 *
 * The iterator can also be used in reverse mode, which will return the nodes
 * and states in the opposite order.  The depths will be slightly different
 * since, like in normal mode, the depth is computed *after* the given node.
 *
 * Lastly, it is possible to create an iterator that is unconstrained, meaning
 * that it will continue iterating until the end of the document instead of
 * until exiting the start node.
 *
 *     an empty iterator.
 *     to the starting node and its children.
 *     Defaults to the start of the given node for forward iterators, and
 *     the end of the node for reverse iterators.
 * @extends {Iterator<Node>}
 */
class TagIterator extends Iterator {

  /**
   * A DOM tree traversal iterator.
   *
   * Starting with the given node, the iterator walks the DOM in order, reporting
   * events for the start and end of Elements, and the presence of text nodes. For
   * example:
   *
   * <pre>
   * &lt;div&gt;1&lt;span&gt;2&lt;/span&gt;3&lt;/div&gt;
   * </pre>
   *
   * Will return the following nodes:
   *
   * <code>[div, 1, span, 2, span, 3, div]</code>
   *
   * With the following states:
   *
   * <code>[START, OTHER, START, OTHER, END, OTHER, END]</code>
   *
   * And the following depths
   *
   * <code>[1, 1, 2, 2, 1, 1, 0]</code>
   *
   * Imagining <code>|</code> represents iterator position, the traversal stops at
   * each of the following locations:
   *
   * <pre>
   * &lt;div&gt;|1|&lt;span&gt;|2|&lt;/span&gt;|3|&lt;/div&gt;|
   * </pre>
   *
   * The iterator can also be used in reverse mode, which will return the nodes
   * and states in the opposite order.  The depths will be slightly different
   * since, like in normal mode, the depth is computed *after* the given node.
   *
   * Lastly, it is possible to create an iterator that is unconstrained, meaning
   * that it will continue iterating until the end of the document instead of
   * until exiting the start node.
   *
   * @param {Node=} opt_node The start node.  If unspecified or null, defaults to
   *     an empty iterator.
   * @param {boolean=} opt_reversed Whether to traverse the tree in reverse.
   * @param {boolean=} opt_unconstrained Whether the iterator is not constrained
   *     to the starting node and its children.
   * @param {TagWalkType?=} opt_tagType The type of the position.
   *     Defaults to the start of the given node for forward iterators, and
   *     the end of the node for reverse iterators.
   * @param {number=} opt_depth The starting tree depth.
   */
  constructor(
      opt_node, opt_reversed, opt_unconstrained, opt_tagType, opt_depth) {
    super();
  
    /**
     * Whether the node iterator is moving in reverse.
     * @type {boolean}
     */
    this.reversed = !!opt_reversed;
  
    /**
     * The node this position is located on.
     * @type {?Node}
     */
    this.node = null;
  
    /**
     * The type of this position.
     * @type {TagWalkType}
     */
    this.tagType = TagWalkType.OTHER;
  
    /**
     * The tree depth of this position relative to where the iterator started.
     * The depth is considered to be the tree depth just past the current node,
     * so if an iterator is at position
     * <pre>
     *     <div>|</div>
     * </pre>
     * (i.e. the node is the div and the type is START_TAG) its depth will be 1.
     * @type {number}
     */
    this.depth;
  
    /**
     * Whether iteration has started.
     * @private {boolean}
     */
    this.started_ = false;
  
    /**
     * Whether the iterator is constrained to the starting node and its children.
     * @type {boolean}
     */
    this.constrained = !opt_unconstrained;
  
    if (opt_node) {
      this.setPosition(opt_node, opt_tagType);
    }
    this.depth = opt_depth != undefined ? opt_depth : this.tagType || 0;
    if (this.reversed) {
      this.depth *= -1;
    }
  }

  /**
   * Set the position of the iterator.  Overwrite the tree node and the position
   * type which can be one of the {@link TagWalkType} token types.
   * Only overwrites the tree depth when the parameter is specified.
   * @param {Node} node The node to set the position to.
   * @param {TagWalkType?=} opt_tagType The type of the position
   *     Defaults to the start of the given node.
   * @param {number=} opt_depth The tree depth.
   */
  setPosition(
      node, opt_tagType, opt_depth) {
    this.node = node;
  
    if (node) {
      if (typeof opt_tagType === 'number') {
        this.tagType = opt_tagType;
      } else {
        // Auto-determine the proper type
        this.tagType = this.node.nodeType != NodeType.ELEMENT ?
            TagWalkType.OTHER :
            this.reversed ? TagWalkType.END_TAG :
                            TagWalkType.START_TAG;
      }
    }
  
    if (typeof opt_depth === 'number') {
      this.depth = opt_depth;
    }
  };

  /**
   * Replace this iterator's values with values from another. The two iterators
   * must be of the same type.
   * @param {TagIterator} other The iterator to copy.
   * @protected
   */
  copyFrom(other) {
    this.node = other.node;
    this.tagType = other.tagType;
    this.depth = other.depth;
    this.reversed = other.reversed;
    this.constrained = other.constrained;
  };

  /**
   * @return {!TagIterator} A copy of this iterator.
   */
  clone() {
    return new TagIterator(
        this.node, this.reversed, !this.constrained, this.tagType, this.depth);
  };

  /**
   * Skip the current tag.
   */
  skipTag() {
    var check = this.reversed ? TagWalkType.END_TAG :
                                TagWalkType.START_TAG;
    if (this.tagType == check) {
      this.tagType = /** @type {TagWalkType} */ (check * -1);
      this.depth += this.tagType * (this.reversed ? -1 : 1);
    }
  };

  /**
   * Restart the current tag.
   */
  restartTag() {
    var check = this.reversed ? TagWalkType.START_TAG :
                                TagWalkType.END_TAG;
    if (this.tagType == check) {
      this.tagType = /** @type {TagWalkType} */ (check * -1);
      this.depth += this.tagType * (this.reversed ? -1 : 1);
    }
  };

  /**
   * Move to the next position in the DOM tree.
   * @return {Node} Returns the next node, or throws a StopIteration
   *     exception if the end of the iterator's range has been reached.
   * @override
   */
  next() {
    var node;
  
    if (this.started_) {
      if (!this.node || this.constrained && this.depth == 0) {
        throw StopIteration;
      }
      node = this.node;
  
      var startType = this.reversed ? TagWalkType.END_TAG :
                                      TagWalkType.START_TAG;
  
      if (this.tagType == startType) {
        // If we have entered the tag, test if there are any children to move to.
        var child = this.reversed ? node.lastChild : node.firstChild;
        if (child) {
          this.setPosition(child);
        } else {
          // If not, move on to exiting this tag.
          this.setPosition(
              node,
              /** @type {TagWalkType} */ (startType * -1));
        }
      } else {
        var sibling = this.reversed ? node.previousSibling : node.nextSibling;
        if (sibling) {
          // Try to move to the next node.
          this.setPosition(sibling);
        } else {
          // If no such node exists, exit our parent.
          this.setPosition(
              node.parentNode,
              /** @type {TagWalkType} */ (startType * -1));
        }
      }
  
      this.depth += this.tagType * (this.reversed ? -1 : 1);
    } else {
      this.started_ = true;
    }
  
    // Check the new position for being last, and return it if it's not.
    node = this.node;
    if (!this.node) {
      throw StopIteration;
    }
    return node;
  };

  /**
   * @return {boolean} Whether next has ever been called on this iterator.
   * @protected
   */
  isStarted() {
    return this.started_;
  };

  /**
   * @return {boolean} Whether this iterator's position is a start tag position.
   */
  isStartTag() {
    return this.tagType == TagWalkType.START_TAG;
  };

  /**
   * @return {boolean} Whether this iterator's position is an end tag position.
   */
  isEndTag() {
    return this.tagType == TagWalkType.END_TAG;
  };

  /**
   * @return {boolean} Whether this iterator's position is not at an element node.
   */
  isNonElement() {
    return this.tagType == TagWalkType.OTHER;
  };

  /**
   * Test if two iterators are at the same position - i.e. if the node and tagType
   * is the same.  This will still return true if the two iterators are moving in
   * opposite directions or have different constraints.
   * @param {TagIterator} other The iterator to compare to.
   * @return {boolean} Whether the two iterators are at the same position.
   */
  equals(other) {
    // Nodes must be equal, and we must either have reached the end of our tree
    // or be at the same position.
    return other.node == this.node &&
        (!this.node || other.tagType == this.tagType);
  };

  /**
   * Replace the current node with the list of nodes. Reset the iterator so that
   * it visits the first of the nodes next.
   * @param {...Object} var_args A list of nodes to replace the current node with.
   *     If the first argument is array-like, it will be used, otherwise all the
   *     arguments are assumed to be nodes.
   */
  splice(var_args) {
    // Reset the iterator so that it iterates over the first replacement node in
    // the arguments on the next iteration.
    var node = this.node;
    this.restartTag();
    this.reversed = !this.reversed;
    TagIterator.prototype.next.call(this);
    this.reversed = !this.reversed;
  
    // Replace the node with the arguments.
    var arr = google.isArrayLike(arguments[0]) ? arguments[0] : arguments;
    for (var i = arr.length - 1; i >= 0; i--) {
      dom.insertSiblingAfter(arr[i], node);
    }
    dom.removeNode(node);
  };
}

export {TagIterator, TagWalkType};