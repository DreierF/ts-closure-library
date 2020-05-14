/**
 * *
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
     * Disables sorting on the specified column
     * @param {*} a First sort value.
     * @param {*} b Second sort value.
     * @return {number} Negative if a < b, 0 if a = b, and positive if a > b.
     */
    static noSort(a: any, b: any): number;
    /**
     * A numeric sort function.  NaN values (or values that do not parse as float
     * numbers) compare equal to each other and greater to any other number.
     * @param {*} a First sort value.
     * @param {*} b Second sort value.
     * @return {number} Negative if a < b, 0 if a = b, and positive if a > b.
     */
    static numericSort(a: any, b: any): number;
    /**
     * Alphabetic sort function.
     * @param {*} a First sort value.
     * @param {*} b Second sort value.
     * @return {number} Negative if a < b, 0 if a = b, and positive if a > b.
     */
    static alphaSort(a: any, b: any): number;
    /**
     * Returns a function that is the given sort function in reverse.
     * @param {function(*, *) : number} sortFunction The original sort function.
     * @return {function(*, *) : number} A new sort function that reverses the
     *     given sort function.
     */
    static createReverseSort(sortFunction: (arg0: any, arg1: any) => number): (arg0: any, arg1: any) => number;
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
    constructor(opt_domHelper?: DomHelper | undefined);
    /**
     * Row number (in <thead>) to use for sorting.
     * @type {number}
     * @private
     */
    private sortableHeaderRowIndex_;
    /**
     * The current sort header of the table, or null if none.
     * @type {?HTMLTableCellElement}
     * @private
     */
    private header_;
    /**
     * Whether the last sort was in reverse.
     * @type {boolean}
     * @private
     */
    private reversed_;
    /**
     * The default sorting function.
     * @type {function(*, *) : number}
     * @private
     */
    private defaultSortFunction_;
    /**
     * Array of custom sorting functions per colun.
     * @type {Array<function(*, *) : number>}
     * @private
     */
    private sortFunctions_;
    /**
     * Sets the row index (in <thead>) to be used for sorting.
     * By default, the first row (index 0) is used.
     * Must be called before decorate() is called.
     * @param {number} index The row index.
     */
    setSortableHeaderRowIndex(index: number): void;
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
    private sort_;
    /**
     * Sort the table contents by the values in the given column.
     * @param {number} column The column to sort by.
     * @param {boolean=} opt_reverse Whether to sort in reverse.
     * @return {boolean} Whether the sort was executed.
     * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
     */
    sort(column: number, opt_reverse?: boolean | undefined): boolean;
}
import { Component } from "./component.js";
import { DomHelper } from "../dom/dom.js";
