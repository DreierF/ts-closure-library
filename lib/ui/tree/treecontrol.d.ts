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
export class TreeControl extends BaseNode {
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
    constructor(content: string | SafeHtml, opt_config?: any, opt_domHelper?: DomHelper | undefined);
    selectedItem_: any;
    /**
     * Used for typeahead support.
     * @private {!TypeAhead}
     */
    typeAhead_: TypeAhead;
    /**
     * The object handling keyboard events.
     * @private {?KeyHandler}
     */
    keyHandler_: any;
    /**
     * The object handling focus events.
     * @private {?FocusHandler}
     */
    focusHandler_: any;
    /**
     * Logger
     * @private {?LogLogger}
     */
    logger_: typeof import("../../debug/logger.js").Logger;
    /**
     * Whether the tree is focused.
     * @private {boolean}
     */
    focused_: boolean;
    /**
     * Child node that currently has focus.
     * @private {?BaseNode}
     */
    focusedNode_: any;
    /**
     * Whether to show lines.
     * @private {boolean}
     */
    showLines_: any;
    /**
     * Whether to show expanded lines.
     * @private {boolean}
     */
    showExpandIcons_: any;
    /**
     * Whether to show the root node.
     * @private {boolean}
     */
    showRootNode_: any;
    /**
     * Whether to show the root lines.
     * @private {boolean}
     */
    showRootLines_: any;
    /**
     * Handles focus on the tree.
     * @param {!EventsBrowserEvent} e The browser event.
     * @private
     */
    handleFocus_(e: EventsBrowserEvent): void;
    /**
     * Handles blur on the tree.
     * @param {!EventsBrowserEvent} e The browser event.
     * @private
     */
    handleBlur_(e: EventsBrowserEvent): void;
    /**
     * @return {boolean} Whether the tree has keyboard focus.
     */
    hasFocus(): boolean;
    /** @override */
    setExpanded(expanded: any): void;
    /** @override */
    getExpandIconElement(): null;
    /**
     * Sets the selected item.
     * @param {?BaseNode} node The item to select.
     */
    setSelectedItem(node: BaseNode | null): void;
    /**
     * Returns the selected item.
     * @return {?BaseNode} The currently selected item.
     */
    getSelectedItem(): BaseNode | null;
    /**
     * Sets whether to show lines.
     * @param {boolean} b Whether to show lines.
     */
    setShowLines(b: boolean): void;
    /**
     * @return {boolean} Whether to show lines.
     */
    getShowLines(): boolean;
    /**
     * Updates the lines after the tree has been drawn.
     * @private
     */
    updateLinesAndExpandIcons_(): void;
    /**
     * Sets whether to show root lines.
     * @param {boolean} b Whether to show root lines.
     */
    setShowRootLines(b: boolean): void;
    /**
     * @return {boolean} Whether to show root lines.
     */
    getShowRootLines(): boolean;
    /**
     * Sets whether to show expand icons.
     * @param {boolean} b Whether to show expand icons.
     */
    setShowExpandIcons(b: boolean): void;
    /**
     * @return {boolean} Whether to show expand icons.
     */
    getShowExpandIcons(): boolean;
    /**
     * Sets whether to show the root node.
     * @param {boolean} b Whether to show the root node.
     */
    setShowRootNode(b: boolean): void;
    /**
     * @return {boolean} Whether to show the root node.
     */
    getShowRootNode(): boolean;
    /**
     * Adds the event listeners to the tree.
     * @private
     */
    attachEvents_(): void;
    /**
     * Removes the event listeners from the tree.
     * @private
     */
    detachEvents_(): void;
    /**
     * Handles mouse events.
     * @param {!EventsBrowserEvent} e The browser event.
     * @private
     */
    handleMouseEvent_(e: EventsBrowserEvent): void;
    /**
     * Handles key down on the tree.
     * @param {!EventsBrowserEvent} e The browser event.
     * @return {boolean} The handled value.
     */
    handleKeyEvent(e: EventsBrowserEvent): boolean;
    /**
     * Finds the containing node given an event.
     * @param {!EventsBrowserEvent} e The browser event.
     * @return {?BaseNode} The containing node or null if no node is
     *     found.
     * @private
     */
    getNodeFromEvent_(e: EventsBrowserEvent): BaseNode | null;
    /**
     * Creates a new tree node using the same config as the root.
     * @param {string=} opt_content The content of the node label. Strings are
     *     treated as plain-text and will be HTML escaped. To set SafeHtml content,
     *     omit opt_content and call setSafeHtml on the resulting node.
     * @return {!TreeNode} The new item.
     */
    createNode(opt_content?: string | undefined): TreeNode;
    /**
     * Allows the caller to notify that the given node has been added or just had
     * been updated in the tree.
     * @param {?BaseNode} node New node being added or existing node
     *    that just had been updated.
     */
    setNode(node: BaseNode | null): void;
    /**
     * Allows the caller to notify that the given node is being removed from the
     * tree.
     * @param {?BaseNode} node Node being removed.
     */
    removeNode(node: BaseNode | null): void;
    /**
     * Clear the typeahead buffer.
     */
    clearTypeAhead(): void;
    actualEventTarget_: TreeControl;
}
export namespace TreeControl {
    export const defaultConfig: {
        indentWidth: number;
        cssRoot: string;
        cssHideRoot: string;
        cssItem: string;
        cssChildren: string;
        cssChildrenNoLines: string;
        cssTreeRow: string;
        cssItemLabel: string;
        cssTreeIcon: string;
        cssExpandTreeIcon: string;
        cssExpandTreeIconPlus: string;
        cssExpandTreeIconMinus: string;
        cssExpandTreeIconTPlus: string;
        cssExpandTreeIconTMinus: string;
        cssExpandTreeIconLPlus: string;
        cssExpandTreeIconLMinus: string;
        cssExpandTreeIconT: string;
        cssExpandTreeIconL: string;
        cssExpandTreeIconBlank: string;
        cssExpandedFolderIcon: string;
        cssCollapsedFolderIcon: string;
        cssFileIcon: string;
        cssExpandedRootIcon: string;
        cssCollapsedRootIcon: string;
        cssSelectedRow: string;
    };
}
import { BaseNode } from "./treenode.js";
import { TypeAhead } from "./typeahead.js";
import { BrowserEvent as EventsBrowserEvent } from "../../events/browserevent.js";
import { TreeNode } from "./treenode.js";
import { SafeHtml } from "../../html/safehtml.js";
import { DomHelper } from "../../dom/dom.js";
