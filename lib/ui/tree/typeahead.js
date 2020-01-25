import * as googarray from './../../array/array.js';
import {BrowserEvent as EventsBrowserEvent} from './../../events/browserevent.js';
import {KeyCodes} from './../../events/keycodes.js';
import * as google from './../../google.js';
import * as strings from './../../string/string.js';
import {Trie} from './../../structs/trie.js';
import {BaseNode} from './treenode.js';
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
 * @fileoverview Provides the typeahead functionality for the tree class.
 */

/**
 * Constructs a TypeAhead object.
 * @final
 */
class TypeAhead {

  /**
   * Constructs a TypeAhead object.
   */
  constructor() {
    /**
     * Map of tree nodes to allow for quick access by characters in the label
     * text.
     * @private {Trie<Array<BaseNode>>}
     */
    this.nodeMap_ = new Trie();
  
    /**
     * Buffer for storing typeahead characters.
     * @private {string}
     */
    this.buffer_ = '';
  
    /**
     * Matching labels from the latest typeahead search.
     * @private {?Array<string>}
     */
    this.matchingLabels_ = null;
  
    /**
     * Matching nodes from the latest typeahead search. Used when more than
     * one node is present with the same label text.
     * @private {?Array<?BaseNode>}
     */
    this.matchingNodes_ = null;
  
    /**
     * Specifies the current index of the label from the latest typeahead search.
     * @private {number}
     */
    this.matchingLabelIndex_ = 0;
  
    /**
     * Specifies the index into matching nodes when more than one node is found
     * with the same label.
     * @private {number}
     */
    this.matchingNodeIndex_ = 0;
  }

  /**
   * Handles navigation keys.
   * @param {EventsBrowserEvent} e The browser event.
   * @return {boolean} The handled value.
   */
  handleNavigation(e) {
    var handled = false;
  
    switch (e.keyCode) {
      // Handle ctrl+down, ctrl+up to navigate within typeahead results.
      case KeyCodes.DOWN:
      case KeyCodes.UP:
        if (e.ctrlKey) {
          this.jumpTo_(
              e.keyCode == KeyCodes.DOWN ?
                  Offset.DOWN :
                  Offset.UP);
          handled = true;
        }
        break;
  
      // Remove the last typeahead char.
      case KeyCodes.BACKSPACE:
        var length = this.buffer_.length - 1;
        handled = true;
        if (length > 0) {
          this.buffer_ = this.buffer_.substring(0, length);
          this.jumpToLabel_(this.buffer_);
        } else if (length == 0) {
          // Clear the last character in typeahead.
          this.buffer_ = '';
        } else {
          handled = false;
        }
        break;
  
      // Clear typeahead buffer.
      case KeyCodes.ESC:
        this.buffer_ = '';
        handled = true;
        break;
    }
  
    return handled;
  };

  /**
   * Handles the character presses.
   * @param {EventsBrowserEvent} e The browser event.
   *    Expected event type is goog.events.KeyHandler.EventType.KEY.
   * @return {boolean} The handled value.
   */
  handleTypeAheadChar(e) {
    var handled = false;
  
    if (!e.ctrlKey && !e.altKey) {
      // Since Trie.getKeys compares characters during
      // lookup, we should use charCode instead of keyCode where possible.
      // Convert to lowercase, typeahead is case insensitive.
      var ch = String.fromCharCode(e.charCode || e.keyCode).toLowerCase();
      if (strings.isUnicodeChar(ch) && (ch != ' ' || this.buffer_)) {
        this.buffer_ += ch;
        handled = this.jumpToLabel_(this.buffer_);
      }
    }
  
    return handled;
  };

  /**
   * Adds or updates the given node in the nodemap. The label text is used as a
   * key and the node id is used as a value. In the case that the key already
   * exists, such as when more than one node exists with the same label, then this
   * function creates an array to hold the multiple nodes.
   * @param {BaseNode} node Node to be added or updated.
   */
  setNodeInMap(node) {
    var labelText = node.getText();
    if (labelText &&
        !strings.isEmptyOrWhitespace(strings.makeSafe(labelText))) {
      // Typeahead is case insensitive, convert to lowercase.
      labelText = labelText.toLowerCase();
  
      var previousValue = this.nodeMap_.get(labelText);
      if (previousValue) {
        // Found a previously created array, add the given node.
        previousValue.push(node);
      } else {
        // Create a new array and set the array as value.
        var nodeList = [node];
        this.nodeMap_.set(labelText, nodeList);
      }
    }
  };

  /**
   * Removes the given node from the nodemap.
   * @param {BaseNode} node Node to be removed.
   */
  removeNodeFromMap(node) {
    var labelText = node.getText();
    if (labelText &&
        !strings.isEmptyOrWhitespace(strings.makeSafe(labelText))) {
      labelText = labelText.toLowerCase();
  
      var nodeList = this.nodeMap_.get(labelText);
      if (nodeList) {
        // Remove the node's descendants from the nodemap.
        var count = node.getChildCount();
        for (var i = 0; i < count; i++) {
          this.removeNodeFromMap(node.getChildAt(i));
        }
        // Remove the node from the array.
        googarray.remove(nodeList, node);
        if (!nodeList.length) {
          this.nodeMap_.remove(labelText);
        }
      }
    }
  };

  /**
   * Select the first matching node for the given typeahead.
   * @param {string} typeAhead Typeahead characters to match.
   * @return {boolean} True iff a node is found.
   * @private
   */
  jumpToLabel_(typeAhead) {
    var handled = false;
    var labels = this.nodeMap_.getKeys(typeAhead);
  
    // Make sure we have at least one matching label.
    if (labels && labels.length) {
      this.matchingNodeIndex_ = 0;
      this.matchingLabelIndex_ = 0;
  
      var nodes = this.nodeMap_.get(labels[0]);
      if ((handled = this.selectMatchingNode_(nodes))) {
        this.matchingLabels_ = labels;
      }
    }
  
    // TODO(user): beep when no node is found
    return handled;
  };

  /**
   * Select the next or previous node based on the offset.
   * @param {Offset} offset DOWN or UP.
   * @return {boolean} Whether a node is found.
   * @private
   */
  jumpTo_(offset) {
    var handled = false;
    var labels = this.matchingLabels_;
  
    if (labels) {
      var nodes = null;
      var nodeIndexOutOfRange = false;
  
      // Navigate within the nodes array.
      if (this.matchingNodes_) {
        var newNodeIndex = this.matchingNodeIndex_ + offset;
        if (newNodeIndex >= 0 && newNodeIndex < this.matchingNodes_.length) {
          this.matchingNodeIndex_ = newNodeIndex;
          nodes = this.matchingNodes_;
        } else {
          nodeIndexOutOfRange = true;
        }
      }
  
      // Navigate to the next or previous label.
      if (!nodes) {
        var newLabelIndex = this.matchingLabelIndex_ + offset;
        if (newLabelIndex >= 0 && newLabelIndex < labels.length) {
          this.matchingLabelIndex_ = newLabelIndex;
        }
  
        if (labels.length > this.matchingLabelIndex_) {
          nodes = this.nodeMap_.get(labels[this.matchingLabelIndex_]);
        }
  
        // Handle the case where we are moving beyond the available nodes,
        // while going UP select the last item of multiple nodes with same label
        // and while going DOWN select the first item of next set of nodes
        if (nodes && nodes.length && nodeIndexOutOfRange) {
          this.matchingNodeIndex_ =
              (offset == Offset.UP) ? nodes.length - 1 : 0;
        }
      }
  
      if ((handled = this.selectMatchingNode_(nodes))) {
        this.matchingLabels_ = labels;
      }
    }
  
    // TODO(user): beep when no node is found
    return handled;
  };

  /**
   * Given a nodes array reveals and selects the node while using node index.
   * @param {Array<BaseNode>|undefined} nodes Nodes array to select
   *     the node from.
   * @return {boolean} Whether a matching node was found.
   * @private
   */
  selectMatchingNode_(nodes) {
    var node;
  
    if (nodes) {
      // Find the matching node.
      if (this.matchingNodeIndex_ < nodes.length) {
        node = nodes[this.matchingNodeIndex_];
        this.matchingNodes_ = nodes;
      }
  
      if (node) {
        node.reveal();
        node.select();
      }
    }
  
    return !!node;
  };

  /**
   * Clears the typeahead buffer.
   */
  clear() {
    this.buffer_ = '';
  };
}

/**
 * Enum for offset values that are used for ctrl-key navigation among the
 * multiple matches of a given typeahead buffer.
 *
 * @enum {number}
 */
let Offset = {
  DOWN: 1,
  UP: -1
};

export {Offset, TypeAhead};