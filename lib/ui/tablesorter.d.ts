/**
 * Table sorter events.
 */
export type EventType = string;
export namespace EventType {
    export const BEFORESORT: string;
    export const SORT: string;
}
/**
 * @fileoverview A table sorting decorator.
 *
 * @see ../demos/tablesorter.html
 */
/**
 * A table sorter allows for sorting of a table by column.  This component can
 * be used to decorate an already existing TABLE element with sorting
 * features.
 *
 * The TABLE should use a THEAD containing TH elements for the table column
 * headers.
 *
 *     document interaction.
 * @extends {Component}
 */
export class TableSorter extends Component {
    /**
     * A table sorter allows for sorting of a table by column.  This component can
     * be used to decorate an already existing TABLE element with sorting
     * features.
     *
     * The TABLE should use a THEAD containing TH elements for the table column
     * headers.
     *
     * @param {DomHelper=} opt_domHelper Optional DOM helper, used for
     *     document interaction.
     */
    constructor(opt_domHelper?: goog_dom.DomHelper | undefined);
    /**
     * Row number (in <thead>) to use for sorting.
     * @type {number}
     * @private
     */
    sortableHeaderRowIndex_: number;
    /**
     * The current sort header of the table, or null if none.
     * @type {?HTMLTableCellElement}
     * @private
     */
    header_: HTMLTableCellElement | null;
    /**
     * Whether the last sort was in reverse.
     * @type {boolean}
     * @private
     */
    reversed_: boolean;
    /**
     * The default sorting function.
     * @type {function(*, *) : number}
     * @private
     */
    defaultSortFunction_: (arg0: any, arg1: any) => number;
    /**
     * Array of custom sorting functions per colun.
     * @type {Array<function(*, *) : number>}
     * @private
     */
    sortFunctions_: Array<(arg0: any, arg1: any) => number>;
    /**
     * Sets the row index (in <thead>) to be used for sorting.
     * By default, the first row (index 0) is used.
     * Must be called before decorate() is called.
     * @param {number} index The row index.
     */
    setSortableHeaderRowIndex(index: number): void;
    /** @override */
    canDecorate(element: any): boolean;
    /**
     * @return {number} The current sort column of the table, or -1 if none.
     */
    getSortColumn(): number;
    /**
     * @return {boolean} Whether the last sort was in reverse.
     */
    isSortReversed(): boolean;
    /**
     * @return {function(*, *) : number} The default sort function to be used by
     *     all columns.
     */
    getDefaultSortFunction(): (arg0: any, arg1: any) => number;
    /**
     * Sets the default sort function to be used by all columns.  If not set
     * explicitly, this defaults to numeric sorting.
     * @param {function(*, *) : number} sortFunction The new default sort function.
     */
    setDefaultSortFunction(sortFunction: (arg0: any, arg1: any) => number): void;
    /**
     * Gets the sort function to be used by the given column.  Returns the default
     * sort function if no sort function is explicitly set for this column.
     * @param {number} column The column index.
     * @return {function(*, *) : number} The sort function used by the column.
     */
    getSortFunction(column: number): (arg0: any, arg1: any) => number;
    /**
     * Set the sort function for the given column, overriding the default sort
     * function.
     * @param {number} column The column index.
     * @param {function(*, *) : number} sortFunction The new sort function.
     */
    setSortFunction(column: number, sortFunction: (arg0: any, arg1: any) => number): void;
    /**
     * Sort the table contents by the values in the given column.
     * @param {?EventsBrowserEvent} e The click event.
     * @private
     */
    sort_(e: EventsBrowserEvent | null): void;
    /**
     * Sort the table contents by the values in the given column.
     * @param {number} column The column to sort by.
     * @param {boolean=} opt_reverse Whether to sort in reverse.
     * @return {boolean} Whether the sort was executed.
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    sort(column: number, opt_reverse?: boolean | undefined): boolean;
    actualEventTarget_: TableSorter;
}
export namespace TableSorter {
    export const noSort: Function;
    export const alphaSort: typeof googarray.defaultCompare;
}
import { Component } from "./component.js";
import { BrowserEvent as EventsBrowserEvent } from "../events/browserevent.js";
import * as goog_dom from "../dom/dom.js";
import * as googarray from "../array/array.js";
