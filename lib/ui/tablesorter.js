import * as googarray from './../array/array.js';
import * as classlist from './../dom/classlist.js';
import * as goog_dom from './../dom/dom.js';
import {DomHelper} from './../dom/dom.js';
import {TagName} from './../dom/tagname.js';
import {BrowserEvent as EventsBrowserEvent} from './../events/browserevent.js';
import {EventType as EventsEventType} from './../events/eventtype.js';
import * as functions from './../functions/functions.js';
import * as google from './../google.js';
import {Component} from './component.js';
import {Error as ComponentError} from './component.js';
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
class TableSorter extends Component {

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
  constructor(opt_domHelper) {
    super(opt_domHelper);
    /**
     * Row number (in <thead>) to use for sorting.
     * @type {number}
     * @private
     */
    this.sortableHeaderRowIndex_ = 0;
  
  
    /**
     * The current sort header of the table, or null if none.
     * @type {?HTMLTableCellElement}
     * @private
     */
    this.header_ = null;
  
    /**
     * Whether the last sort was in reverse.
     * @type {boolean}
     * @private
     */
    this.reversed_ = false;
  
    /**
     * The default sorting function.
     * @type {function(*, *) : number}
     * @private
     */
    this.defaultSortFunction_ = TableSorter.numericSort;
  
    /**
     * Array of custom sorting functions per colun.
     * @type {Array<function(*, *) : number>}
     * @private
     */
    this.sortFunctions_ = [];
  }

  /**
   * Sets the row index (in <thead>) to be used for sorting.
   * By default, the first row (index 0) is used.
   * Must be called before decorate() is called.
   * @param {number} index The row index.
   */
  setSortableHeaderRowIndex(index) {
    if (this.isInDocument()) {
      throw new Error(ComponentError.ALREADY_RENDERED);
    }
    this.sortableHeaderRowIndex_ = index;
  };

  /** @override */
  canDecorate(element) {
    return element.tagName == TagName.TABLE;
  };

  /**
   * @override
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  enterDocument() {
    super.enterDocument();
  
    var table = this.getElement();
    var headerRow = table.tHead.rows[this.sortableHeaderRowIndex_];
  
    this.getHandler().listen(headerRow, EventsEventType.CLICK, this.sort_);
  };

  /**
   * @return {number} The current sort column of the table, or -1 if none.
   */
  getSortColumn() {
    return this.header_ ? this.header_.cellIndex : -1;
  };

  /**
   * @return {boolean} Whether the last sort was in reverse.
   */
  isSortReversed() {
    return this.reversed_;
  };

  /**
   * @return {function(*, *) : number} The default sort function to be used by
   *     all columns.
   */
  getDefaultSortFunction() {
    return this.defaultSortFunction_;
  };

  /**
   * Sets the default sort function to be used by all columns.  If not set
   * explicitly, this defaults to numeric sorting.
   * @param {function(*, *) : number} sortFunction The new default sort function.
   */
  setDefaultSortFunction(sortFunction) {
    this.defaultSortFunction_ = sortFunction;
  };

  /**
   * Gets the sort function to be used by the given column.  Returns the default
   * sort function if no sort function is explicitly set for this column.
   * @param {number} column The column index.
   * @return {function(*, *) : number} The sort function used by the column.
   */
  getSortFunction(column) {
    return this.sortFunctions_[column] || this.defaultSortFunction_;
  };

  /**
   * Set the sort function for the given column, overriding the default sort
   * function.
   * @param {number} column The column index.
   * @param {function(*, *) : number} sortFunction The new sort function.
   */
  setSortFunction(column, sortFunction) {
    this.sortFunctions_[column] = sortFunction;
  };

  /**
   * Sort the table contents by the values in the given column.
   * @param {EventsBrowserEvent} e The click event.
   * @private
   */
  sort_(e) {
    // Determine what column was clicked.
    // TODO(robbyw): If this table cell contains another table, this could break.
    var target = e.target;
    var th = goog_dom.getAncestorByTagNameAndClass(target, TagName.TH);
  
    // If the user clicks on the same column, sort it in reverse of what it is
    // now.  Otherwise, sort forward.
    var reverse = th == this.header_ ? !this.reversed_ : false;
  
    // Perform the sort.
    if (this.dispatchEvent(EventType.BEFORESORT)) {
      if (this.sort(th.cellIndex, reverse)) {
        this.dispatchEvent(EventType.SORT);
      }
    }
  };

  /**
   * Sort the table contents by the values in the given column.
   * @param {number} column The column to sort by.
   * @param {boolean=} opt_reverse Whether to sort in reverse.
   * @return {boolean} Whether the sort was executed.
   * @suppress {strictMissingProperties} Part of the go/strict_warnings_migration
   */
  sort(column, opt_reverse) {
    var sortFunction = this.getSortFunction(column);
    if (sortFunction === TableSorter.noSort) {
      return false;
    }
  
    // Remove old header classes.
    if (this.header_) {
      classlist.remove(
          this.header_, this.reversed_ ?
              google.getCssName('goog-tablesorter-sorted-reverse') :
              google.getCssName('goog-tablesorter-sorted'));
    }
  
    // If the user clicks on the same column, sort it in reverse of what it is
    // now.  Otherwise, sort forward.
    this.reversed_ = !!opt_reverse;
    var multiplier = this.reversed_ ? -1 : 1;
    function cmpFn(a, b) {
      return multiplier * sortFunction(a[0], b[0]) || a[1] - b[1];
    };
  
    // Sort all tBodies
    var table = this.getElement();
    googarray.forEach(table.tBodies, function(tBody) {
      // Collect all of the rows into an array.
      var values = googarray.map(tBody.rows, function(row, rowIndex) {
        return [goog_dom.getTextContent(row.cells[column]), rowIndex, row];
      });
  
      googarray.sort(values, cmpFn);
  
      // Remove the tBody temporarily since this speeds up the sort on some
      // browsers.
      var nextSibling = tBody.nextSibling;
      table.removeChild(tBody);
  
      // Sort the rows, using the resulting array.
      googarray.forEach(values, function(row) { tBody.appendChild(row[2]); });
  
      // Reinstate the tBody.
      table.insertBefore(tBody, nextSibling);
    });
  
    // Mark this as the last sorted column.
    this.header_ = /** @type {!HTMLTableCellElement} */
        (table.tHead.rows[this.sortableHeaderRowIndex_].cells[column]);
  
    // Update the header class.
    classlist.add(
        this.header_, this.reversed_ ?
            google.getCssName('goog-tablesorter-sorted-reverse') :
            google.getCssName('goog-tablesorter-sorted'));
  
    return true;
  };

  /**
   * Disables sorting on the specified column
   * @param {*} a First sort value.
   * @param {*} b Second sort value.
   * @return {number} Negative if a < b, 0 if a = b, and positive if a > b.
   */
  static noSort(a, b) {
    return functions.error('no sort')(a, b);
  }

  /**
   * A numeric sort function.  NaN values (or values that do not parse as float
   * numbers) compare equal to each other and greater to any other number.
   * @param {*} a First sort value.
   * @param {*} b Second sort value.
   * @return {number} Negative if a < b, 0 if a = b, and positive if a > b.
   */
  static numericSort(a, b) {
    a = parseFloat(a);
    b = parseFloat(b);
    // foo == foo is false if and only if foo is NaN.
    if (a == a) {
      return b == b ? a - b : -1;
    } else {
      return b == b ? 1 : 0;
    }
  };

  /**
   * Alphabetic sort function.
   * @param {*} a First sort value.
   * @param {*} b Second sort value.
   * @return {number} Negative if a < b, 0 if a = b, and positive if a > b.
   */
  static alphaSort(a, b) {
    return googarray.defaultCompare(a, b);
  }

  /**
   * Returns a function that is the given sort function in reverse.
   * @param {function(*, *) : number} sortFunction The original sort function.
   * @return {function(*, *) : number} A new sort function that reverses the
   *     given sort function.
   */
  static createReverseSort(sortFunction) {
    return function(a, b) { return -1 * sortFunction(a, b); };
  };
}

// google.tagUnsealableClass(TableSorter);

/**
 * Table sorter events.
 * @enum {string}
 * @override
 * @suppress {checkTypes}
 */
let EventType = {
  BEFORESORT: 'beforesort',
  SORT: 'sort'
};

export {EventType, TableSorter};