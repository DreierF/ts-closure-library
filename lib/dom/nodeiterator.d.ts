/**
 * @fileoverview Iterator subclass for DOM tree traversal.
 */
/**
 * A DOM tree traversal iterator.
 *
 * Starting with the given node, the iterator walks the DOM in order, reporting
 * events for each node.  The iterator acts as a prefix iterator:
 *
 * <pre>
 * &lt;div&gt;1&lt;span&gt;2&lt;/span&gt;3&lt;/div&gt;
 * </pre>
 *
 * Will return the following nodes:
 *
 * <code>[div, 1, span, 2, 3]</code>
 *
 * With the following depths
 *
 * <code>[1, 1, 2, 2, 1]</code>
 *
 * Imagining <code>|</code> represents iterator position, the traversal stops at
 * each of the following locations:
 *
 * <pre>&lt;div&gt;|1|&lt;span&gt;|2|&lt;/span&gt;3|&lt;/div&gt;</pre>
 *
 * The iterator can also be used in reverse mode, which will return the nodes
 * and states in the opposite order.  The depths will be slightly different
 * since, like in normal mode, the depth is computed *after* the last move.
 *
 * Lastly, it is possible to create an iterator that is unconstrained, meaning
 * that it will continue iterating until the end of the document instead of
 * until exiting the start node.
 *
 *     to the starting node and its children.
 * @extends {TagIterator}
 * @final
 */
export class NodeIterator extends TagIterator {
    /**
     * A DOM tree traversal iterator.
     *
     * Starting with the given node, the iterator walks the DOM in order, reporting
     * events for each node.  The iterator acts as a prefix iterator:
     *
     * <pre>
     * &lt;div&gt;1&lt;span&gt;2&lt;/span&gt;3&lt;/div&gt;
     * </pre>
     *
     * Will return the following nodes:
     *
     * <code>[div, 1, span, 2, 3]</code>
     *
     * With the following depths
     *
     * <code>[1, 1, 2, 2, 1]</code>
     *
     * Imagining <code>|</code> represents iterator position, the traversal stops at
     * each of the following locations:
     *
     * <pre>&lt;div&gt;|1|&lt;span&gt;|2|&lt;/span&gt;3|&lt;/div&gt;</pre>
     *
     * The iterator can also be used in reverse mode, which will return the nodes
     * and states in the opposite order.  The depths will be slightly different
     * since, like in normal mode, the depth is computed *after* the last move.
     *
     * Lastly, it is possible to create an iterator that is unconstrained, meaning
     * that it will continue iterating until the end of the document instead of
     * until exiting the start node.
     *
     * @param {Node=} opt_node The start node.  Defaults to an empty iterator.
     * @param {boolean=} opt_reversed Whether to traverse the tree in reverse.
     * @param {boolean=} opt_unconstrained Whether the iterator is not constrained
     *     to the starting node and its children.
     * @param {number=} opt_depth The starting tree depth.
     */
    constructor(opt_node?: Node | undefined, opt_reversed?: boolean | undefined, opt_unconstrained?: boolean | undefined, opt_depth?: number | undefined);
}
import { TagIterator } from "./tagiterator.js";
