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
    constructor(content: string | SafeHtml, opt_config?: any | undefined, opt_domHelper?: DomHelper | undefined);
    selectedItem_: any;
    /**
     * Used for typeahead support.
     * @private {!TypeAhead}
     */
    private typeAhead_;
    /**
     * The object handling keyboard events.
     * @private {?KeyHandler}
     */
    private keyHandler_;
    /**
     * The object handling focus events.
     * @private {?FocusHandler}
     */
    private focusHandler_;
    /**
     * Logger
     * @private {?LogLogger}
     */
    private logger_;
    /**
     * Whether the tree is focused.
     * @private {boolean}
     */
    private focused_;
    /**
     * Child node that currently has focus.
     * @private {?BaseNode}
     */
    private focusedNode_;
    /**
     * Whether to show lines.
     * @private {boolean}
     */
    private showLines_;
    /**
     * Whether to show expanded lines.
     * @private {boolean}
     */
    private showExpandIcons_;
    /**
     * Whether to show the root node.
     * @private {boolean}
     */
    private showRootNode_;
    /**
     * Whether to show the root lines.
     * @private {boolean}
     */
    private showRootLines_;
    /**
     * Handles focus on the tree.
     * @param {!EventsBrowserEvent} e The browser event.
     * @private
     */
    private handleFocus_;
    /**
     * Handles blur on the tree.
     * @param {!EventsBrowserEvent} e The browser event.
     * @private
     */
    private handleBlur_;
    /**
     * @return {boolean} Whether the tree has keyboard focus.
     */
    hasFocus(): boolean;
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
    private updateLinesAndExpandIcons_;
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
    private attachEvents_;
    /**
     * Removes the event listeners from the tree.
     * @private
     */
    private detachEvents_;
    /**
     * Handles mouse events.
     * @param {!EventsBrowserEvent} e The browser event.
     * @private
     */
    private handleMouseEvent_;
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
    private getNodeFromEvent_;
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
import { BrowserEvent as EventsBrowserEvent } from "../../events/browserevent.js";
import { TreeNode } from "./treenode.js";
import { SafeHtml } from "../../html/safehtml.js";
import { DomHelper } from "../../dom/dom.js";
