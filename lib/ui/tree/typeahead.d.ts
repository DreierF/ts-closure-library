/**
 * Enum for offset values that are used for ctrl-key navigation among the
 * multiple matches of a given typeahead buffer.
 */
export type Offset = number;
export namespace Offset {
    export const DOWN: number;
    export const UP: number;
}
/**
 * @fileoverview Provides the typeahead functionality for the tree class.
 */
/**
 * Constructs a TypeAhead object.
 * @final
 */
export class TypeAhead {
    /**
     * Map of tree nodes to allow for quick access by characters in the label
     * text.
     * @private {Trie<Array<BaseNode>>}
     */
    private nodeMap_;
    /**
     * Buffer for storing typeahead characters.
     * @private {string}
     */
    private buffer_;
    /**
     * Matching labels from the latest typeahead search.
     * @private {?Array<string>}
     */
    private matchingLabels_;
    /**
     * Matching nodes from the latest typeahead search. Used when more than
     * one node is present with the same label text.
     * @private {?Array<?BaseNode>}
     */
    private matchingNodes_;
    /**
     * Specifies the current index of the label from the latest typeahead search.
     * @private {number}
     */
    private matchingLabelIndex_;
    /**
     * Specifies the index into matching nodes when more than one node is found
     * with the same label.
     * @private {number}
     */
    private matchingNodeIndex_;
    /**
     * Handles navigation keys.
     * @param {?EventsBrowserEvent} e The browser event.
     * @return {boolean} The handled value.
     */
    handleNavigation(e: EventsBrowserEvent | null): boolean;
    /**
     * Handles the character presses.
     * @param {?EventsBrowserEvent} e The browser event.
     *    Expected event type is goog.events.KeyHandler.EventType.KEY.
     * @return {boolean} The handled value.
     */
    handleTypeAheadChar(e: EventsBrowserEvent | null): boolean;
    /**
     * Adds or updates the given node in the nodemap. The label text is used as a
     * key and the node id is used as a value. In the case that the key already
     * exists, such as when more than one node exists with the same label, then this
     * function creates an array to hold the multiple nodes.
     * @param {?BaseNode} node Node to be added or updated.
     */
    setNodeInMap(node: BaseNode | null): void;
    /**
     * Removes the given node from the nodemap.
     * @param {?BaseNode} node Node to be removed.
     */
    removeNodeFromMap(node: BaseNode | null): void;
    /**
     * Select the first matching node for the given typeahead.
     * @param {string} typeAhead Typeahead characters to match.
     * @return {boolean} True iff a node is found.
     * @private
     */
    private jumpToLabel_;
    /**
     * Select the next or previous node based on the offset.
     * @param {?Offset} offset DOWN or UP.
     * @return {boolean} Whether a node is found.
     * @private
     */
    private jumpTo_;
    /**
     * Given a nodes array reveals and selects the node while using node index.
     * @param {Array<BaseNode>|undefined} nodes Nodes array to select
     *     the node from.
     * @return {boolean} Whether a matching node was found.
     * @private
     */
    private selectMatchingNode_;
    /**
     * Clears the typeahead buffer.
     */
    clear(): void;
}
import { BrowserEvent as EventsBrowserEvent } from "../../events/browserevent.js";
import { BaseNode } from "./treenode.js";
