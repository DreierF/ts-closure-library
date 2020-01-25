/**
 * The event types dispatched by this class.
 */
export type EventType = string;
/**
 * @fileoverview Definition of the BaseNode class.
 *
 *
 * This is a based on the webfx tree control. It since been updated to add
 * typeahead support, as well as accessibility support using ARIA framework.
 * See file comment in treecontrol.js.
 */
/**
 * An abstract base class for a node in the tree.
 *
 *     Strings are treated as plain-text and will be HTML escaped.
 *    {@link BaseNode.defaultConfig}. If not specified the
 *    default config will be used.
 * @extends {Component}
 * @abstract
 */
export class BaseNode extends Component {
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
    constructor(content: string | SafeHtml, opt_config?: any, opt_domHelper?: DomHelper);
    /**
     * @deprecated Use {@link #removeChild}.
     */
    remove: (childNode: string | Component, opt_unrender?: boolean) => BaseNode;
    /**
     * The configuration for the tree.
     * @type {?Object}
     * @private
     */
    config_: Object | null;
    /**
     * HTML content of the node label.
     * @type {!SafeHtml}
     * @private
     */
    html_: SafeHtml;
    /**
     * Whether the tree item is selected.
     * @private {boolean}
     */
    selected_: any;
    /**
     * Whether the tree node is expanded.
     * @private {boolean}
     */
    expanded_: boolean;
    /**
     * Tooltip for the tree item
     * @private {?string}
     */
    toolTip_: string;
    /**
     * HTML that can appear after the label (so not inside the anchor).
     * @private {!SafeHtml}
     */
    afterLabelHtml_: SafeHtml;
    /**
     * Whether to allow user to collapse this node.
     * @private {boolean}
     */
    isUserCollapsible_: boolean;
    /**
     * Nesting depth of this node; cached result of computeDepth_.
     * -1 if value has not been cached.
     * @private {number}
     */
    depth_: any;
    tree: any;
    /**
     * Adds roles and states.
     * @protected
     */
    initAccessibility(): void;
    /**
     * The method assumes that the child doesn't have parent node yet.
     * The `opt_render` argument is not used. If the parent node is expanded,
     * the child node's state will be the same as the parent's. Otherwise the
     * child's DOM tree won't be created.
     * @override
     */
    addChildAt(child: any, index: any, opt_render?: any): void;
    firstChild_: any;
    lastChild_: any;
    /**
     * Adds a node as a child to the current node.
     * @param {?BaseNode} child The child to add.
     * @param {BaseNode=} opt_before If specified, the new child is
     *    added as a child before this one. If not specified, it's appended to the
     *    end.
     * @return {!BaseNode} The added child.
     */
    add(child: BaseNode, opt_before?: BaseNode): BaseNode;
    /**
     * Removes a child. The caller is responsible for disposing the node.
     * @param {Component|string} childNode The child to remove. Must be a
     *     {@link BaseNode}.
     * @param {boolean=} opt_unrender Unused. The child will always be unrendered.
     * @return {!BaseNode} The child that was removed.
     * @override
     */
    removeChild(childNode: string | Component, opt_unrender?: boolean): BaseNode;
    /**
     * Handler for setting focus asynchronously.
     * @private
     */
    onTimeoutSelect_(): void;
    /**
     * Returns the tree.
     * @return {?TreeControl}
     * @abstract
     */
    getTree(): TreeTreeControl;
    /**
     * Returns the depth of the node in the tree. Should not be overridden.
     * @return {number} The non-negative depth of this node (the root is zero).
     */
    getDepth(): number;
    /**
     * Computes the depth of the node in the tree.
     * Called only by getDepth, when the depth hasn't already been cached.
     * @return {number} The non-negative depth of this node (the root is zero).
     * @private
     */
    computeDepth_(): number;
    /**
     * Changes the depth of a node (and all its descendants).
     * @param {number} depth The new nesting depth; must be non-negative.
     * @private
     */
    setDepth_(depth: number): void;
    /**
     * Returns true if the node is a descendant of this node
     * @param {?BaseNode} node The node to check.
     * @return {boolean} True if the node is a descendant of this node, false
     *    otherwise.
     */
    contains(node: BaseNode): boolean;
    /**
     * @param {number} index 0-based index.
     * @return {?BaseNode} The child at the given index; null if none.
     * @override
     */
    getChildAt(index: number): BaseNode;
    /**
     * Returns the children of this node.
     * @return {!Array<!BaseNode>} The children.
     */
    getChildren(): BaseNode[];
    /**
     * @return {?BaseNode} The first child of this node.
     */
    getFirstChild(): BaseNode;
    /**
     * @return {?BaseNode} The last child of this node.
     */
    getLastChild(): BaseNode;
    /**
     * @return {?BaseNode} The previous sibling of this node.
     */
    getPreviousSibling(): BaseNode;
    /**
     * @return {?BaseNode} The next sibling of this node.
     */
    getNextSibling(): BaseNode;
    /**
     * @return {boolean} Whether the node is the last sibling.
     */
    isLastSibling(): boolean;
    /**
     * @return {boolean} Whether the node is selected.
     */
    isSelected(): boolean;
    /**
     * Selects the node.
     */
    select(): void;
    /**
     * Originally it was intended to deselect the node but never worked.
     * @deprecated Use `tree.setSelectedItem(null)`.
     */
    deselect(): void;
    /**
     * Called from the tree to instruct the node change its selection state.
     * @param {boolean} selected The new selection state.
     * @protected
     */
    setSelectedInternal(selected: boolean): void;
    /**
     * @return {boolean} Whether the node is expanded.
     */
    getExpanded(): boolean;
    /**
     * Sets the node to be expanded internally, without state change events.
     * @param {boolean} expanded Whether to expand or close the node.
     */
    setExpandedInternal(expanded: boolean): void;
    /**
     * Sets the node to be expanded.
     * @param {boolean} expanded Whether to expand or close the node.
     */
    setExpanded(expanded: boolean): void;
    /**
     * Toggles the expanded state of the node.
     */
    toggle(): void;
    /**
     * Expands the node.
     */
    expand(): void;
    /**
     * Collapses the node.
     */
    collapse(): void;
    /**
     * Collapses the children of the node.
     */
    collapseChildren(): void;
    /**
     * Collapses the children and the node.
     */
    collapseAll(): void;
    /**
     * Expands the children of the node.
     */
    expandChildren(): void;
    /**
     * Expands the children and the node.
     */
    expandAll(): void;
    /**
     * Expands the parent chain of this node so that it is visible.
     */
    reveal(): void;
    /**
     * Sets whether the node will allow the user to collapse it.
     * @param {boolean} isCollapsible Whether to allow node collapse.
     */
    setIsUserCollapsible(isCollapsible: boolean): void;
    /**
     * @return {boolean} Whether the node is collapsible by user actions.
     */
    isUserCollapsible(): boolean;
    /**
     * Creates HTML for the node.
     * @return {!SafeHtml}
     * @protected
     */
    toSafeHtml(): SafeHtml;
    /**
     * @return {number} The pixel indent of the row.
     * @private
     */
    getPixelIndent_(): number;
    /**
     * @return {!SafeHtml} The html for the row.
     * @protected
     */
    getRowSafeHtml(): SafeHtml;
    /**
     * @return {string} The class name for the row.
     * @protected
     */
    getRowClassName(): string;
    /**
     * @return {!SafeHtml} The html for the label.
     * @protected
     */
    getLabelSafeHtml(): SafeHtml;
    /**
     * Returns the html that appears after the label. This is useful if you want to
     * put extra UI on the row of the label but not inside the anchor tag.
     * @return {string} The html.
     * @final
     */
    getAfterLabelHtml(): string;
    /**
     * Returns the html that appears after the label. This is useful if you want to
     * put extra UI on the row of the label but not inside the anchor tag.
     * @return {!SafeHtml} The html.
     */
    getAfterLabelSafeHtml(): SafeHtml;
    /**
     * Sets the html that appears after the label. This is useful if you want to
     * put extra UI on the row of the label but not inside the anchor tag.
     * @param {!SafeHtml} html The html.
     */
    setAfterLabelSafeHtml(html: SafeHtml): void;
    /**
     * @return {!SafeHtml} The html for the icon.
     * @protected
     */
    getIconSafeHtml(): SafeHtml;
    /**
     * Gets the calculated icon class.
     * @protected
     * @return {string}
     * @abstract
     */
    getCalculatedIconClass(): string;
    /**
     * @return {!SafeHtml} The source for the icon.
     * @protected
     */
    getExpandIconSafeHtml(): SafeHtml;
    /**
     * @return {string} The class names of the icon used for expanding the node.
     * @protected
     */
    getExpandIconClass(): string;
    /**
     * @return {!SafeStyle} The line style.
     */
    getLineStyle(): SafeStyle;
    /**
     * @return {string} The background position style value.
     */
    getBackgroundPosition(): string;
    /**
     * @return {?Element} The row is the div that is used to draw the node without
     *     the children.
     */
    getRowElement(): Element;
    /**
     * @return {?Element} The expanded icon element.
     * @protected
     */
    getExpandIconElement(): Element;
    /**
     * @return {?Element} The icon element.
     * @protected
     */
    getIconElement(): Element;
    /**
     * @return {?Element} The label element.
     */
    getLabelElement(): Element;
    /**
     * @return {?Element} The element after the label.
     */
    getAfterLabelElement(): Element;
    /**
     * @return {?Element} The div containing the children.
     * @protected
     */
    getChildrenElement(): Element;
    /**
     * Sets the icon class for the node.
     * @param {string} s The icon class.
     */
    setIconClass(s: string): void;
    iconClass_: string;
    /**
     * Gets the icon class for the node.
     * @return {string} s The icon source.
     */
    getIconClass(): string;
    /**
     * Sets the icon class for when the node is expanded.
     * @param {string} s The expanded icon class.
     */
    setExpandedIconClass(s: string): void;
    expandedIconClass_: string;
    /**
     * Gets the icon class for when the node is expanded.
     * @return {string} The class.
     */
    getExpandedIconClass(): string;
    /**
     * Sets the text of the label.
     * @param {string} s The plain text of the label.
     */
    setText(s: string): void;
    /**
     * Returns the text of the label. If the text was originally set as HTML, the
     * return value is unspecified.
     * @return {string} The plain text of the label.
     */
    getText(): string;
    /**
     * Sets the HTML of the label.
     * @param {!SafeHtml} html The HTML object for the label.
     */
    setSafeHtml(html: SafeHtml): void;
    /**
     * Returns the html of the label.
     * @return {string} The html string of the label.
     * @final
     */
    getHtml(): string;
    /**
     * Returns the html of the label.
     * @return {!SafeHtml} The html string of the label.
     */
    getSafeHtml(): SafeHtml;
    /**
     * Sets the text of the tooltip.
     * @param {string} s The tooltip text to set.
     */
    setToolTip(s: string): void;
    /**
     * Returns the text of the tooltip.
     * @return {?string} The tooltip text.
     */
    getToolTip(): string;
    /**
     * Updates the row styles.
     */
    updateRow(): void;
    /**
     * Updates the expand icon of the node.
     */
    updateExpandIcon(): void;
    /**
     * Updates the icon of the node. Assumes that this.getElement() is created.
     * @private
     */
    updateIcon_(): void;
    /**
     * Handles mouse down event.
     * @param {!EventsBrowserEvent} e The browser event.
     * @protected
     */
    onMouseDown(e: EventsBrowserEvent): void;
    /**
     * Handles a click event.
     * @param {!EventsBrowserEvent} e The browser event.
     * @protected
     * @suppress {underscore|visibility}
     */
    onClick_(e: EventsBrowserEvent): void;
    /**
     * Handles a double click event.
     * @param {!EventsBrowserEvent} e The browser event.
     * @protected
     * @suppress {underscore|visibility}
     */
    onDoubleClick_(e: EventsBrowserEvent): void;
    /**
     * Handles a key down event.
     * @param {!EventsBrowserEvent} e The browser event.
     * @return {boolean} The handled value.
     * @protected
     */
    onKeyDown(e: EventsBrowserEvent): boolean;
    /**
     * @override
     * @return {?BaseNode}
     */
    getParent(): BaseNode;
    /**
     * @return {?BaseNode} The last shown descendant.
     */
    getLastShownDescendant(): BaseNode;
    /**
     * @return {?BaseNode} The next node to show or null if there isn't
     *     a next node to show.
     */
    getNextShownNode(): BaseNode;
    /**
     * @return {?BaseNode} The previous node to show.
     */
    getPreviousShownNode(): BaseNode;
    /**
     * @return {*} Data set by the client.
     * @deprecated Use {@link #getModel} instead.
     */
    getClientData(): any;
    /**
     * Sets client data to associate with the node.
     * @param {*} data The client data to associate with the node.
     * @deprecated Use {@link #setModel} instead.
     */
    setClientData(data: any): void;
    /**
     * @return {?Object} The configuration for the tree.
     */
    getConfig(): any;
    /**
     * Internal method that is used to set the tree control on the node.
     * @param {?TreeControl} tree The tree control.
     */
    setTreeInternal(tree: TreeTreeControl): void;
    actualEventTarget_: BaseNode;
}
export namespace BaseNode {
    export const allNodes: Object | null;
    export const EMPTY_CHILDREN_: Array<BaseNode>;
    export namespace defaultConfig {
        export const indentWidth: number;
        export const cssRoot: string;
        export const cssHideRoot: string;
        export const cssItem: string;
        export const cssChildren: string;
        export const cssChildrenNoLines: string;
        export const cssTreeRow: string;
        export const cssItemLabel: string;
        export const cssTreeIcon: string;
        export const cssExpandTreeIcon: string;
        export const cssExpandTreeIconPlus: string;
        export const cssExpandTreeIconMinus: string;
        export const cssExpandTreeIconTPlus: string;
        export const cssExpandTreeIconTMinus: string;
        export const cssExpandTreeIconLPlus: string;
        export const cssExpandTreeIconLMinus: string;
        export const cssExpandTreeIconT: string;
        export const cssExpandTreeIconL: string;
        export const cssExpandTreeIconBlank: string;
        export const cssExpandedFolderIcon: string;
        export const cssCollapsedFolderIcon: string;
        export const cssFileIcon: string;
        export const cssExpandedRootIcon: string;
        export const cssCollapsedRootIcon: string;
        export const cssSelectedRow: string;
    }
}
export namespace EventType {
    export const BEFORE_EXPAND: string;
    export const EXPAND: string;
    export const BEFORE_COLLAPSE: string;
    export const COLLAPSE: string;
}
/**
 * @fileoverview Definition of the TreeNode class.
 *
 *
 * This is a based on the webfx tree control. See file comment in
 * treecontrol.js.
 */
/**
 * A single node in the tree.
 *     Strings are treated as plain-text and will be HTML escaped.
 *    TreeControl.defaultConfig. If not specified, a default config
 *    will be used.
 * @extends {BaseNode}
 */
export class TreeNode extends BaseNode {
    /**
     * A single node in the tree.
     * @param {string|!SafeHtml} content The content of the node label.
     *     Strings are treated as plain-text and will be HTML escaped.
     * @param {Object=} opt_config The configuration for the tree. See
     *    TreeControl.defaultConfig. If not specified, a default config
     *    will be used.
     * @param {DomHelper=} opt_domHelper Optional DOM helper.
     */
    constructor(content: string | SafeHtml, opt_config?: any, opt_domHelper?: DomHelper);
}
import { Component } from "../component.js";
import { SafeHtml } from "../../html/safehtml.js";
import { TreeControl as TreeTreeControl } from "./treecontrol.js";
import { SafeStyle } from "../../html/safestyle.js";
import { BrowserEvent as EventsBrowserEvent } from "../../events/browserevent.js";
import { DomHelper } from "../../dom/dom.js";
