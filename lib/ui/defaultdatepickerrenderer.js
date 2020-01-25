import * as goog_dom from './../dom/dom.js';
import {DomHelper} from './../dom/dom.js';
import {TagName} from './../dom/tagname.js';
import * as google from './../google.js';
import {DatePickerRenderer} from './datepickerrenderer.js';
// Copyright 2013 The Closure Library Authors. All Rights Reserved.
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
 * @fileoverview The default renderer for {@link goog.ui.DatePicker}.
 *
 * @see ../demos/datepicker.html
 */

/**  Interface. */

/**
 * Default renderer for {@link goog.ui.DatePicker}. Renders the date picker's
 * navigation header and footer.
 *
 * @implements {DatePickerRenderer}
 */
class DefaultDatePickerRenderer {

  /**
   * Default renderer for {@link goog.ui.DatePicker}. Renders the date picker's
   * navigation header and footer.
   *
   * @param {string} baseCssClass Name of base CSS class of the date picker.
   * @param {DomHelper=} opt_domHelper DOM helper.
   */
  constructor(baseCssClass, opt_domHelper) {
    /**
     * Name of base CSS class of datepicker
     * @type {string}
     * @private
     */
    this.baseCssClass_ = baseCssClass;
  
    /**
     * @type {!DomHelper}
     * @private
     */
    this.dom_ = opt_domHelper || goog_dom.getDomHelper();
  }

  /**
   * Returns the dom helper that is being used on this component.
   * @return {!DomHelper} The dom helper used on this component.
   */
  getDomHelper() {
    return this.dom_;
  };

  /**
   * Returns base CSS class. This getter is used to get base CSS class part.
   * All CSS class names in component are created as:
   *   google.getCssName(this.getBaseCssClass(), 'CLASS_NAME')
   * @return {string} Base CSS class.
   */
  getBaseCssClass() {
    return this.baseCssClass_;
  };

  /**
   * Render the navigation row (navigating months and maybe years).
   *
   * @param {!Element} row The parent element to render the component into.
   * @param {boolean} simpleNavigation Whether the picker should render a simple
   *     navigation menu that only contains controls for navigating to the next
   *     and previous month. The default navigation menu contains controls for
   *     navigating to the next/previous month, next/previous year, and menus for
   *     jumping to specific months and years.
   * @param {boolean} showWeekNum Whether week numbers should be shown.
   * @param {string} fullDateFormat The full date format.
   *     {@see goog.i18n.DateTimeSymbols}.
   * @override
   */
  renderNavigationRow(
      row, simpleNavigation, showWeekNum, fullDateFormat) {
    // Populate the navigation row according to the configured navigation mode.
    var cell, monthCell, yearCell;
  
    if (simpleNavigation) {
      cell = this.getDomHelper().createElement(TagName.TD);
      cell.colSpan = showWeekNum ? 1 : 2;
      this.createButton_(
          cell, '\u00AB',
          google.getCssName(this.getBaseCssClass(), 'previousMonth'));  // <<
      row.appendChild(cell);
  
      cell = this.getDomHelper().createElement(TagName.TD);
      cell.colSpan = showWeekNum ? 6 : 5;
      cell.className = google.getCssName(this.getBaseCssClass(), 'monthyear');
      row.appendChild(cell);
  
      cell = this.getDomHelper().createElement(TagName.TD);
      this.createButton_(
          cell, '\u00BB',
          google.getCssName(this.getBaseCssClass(), 'nextMonth'));  // >>
      row.appendChild(cell);
  
    } else {
      monthCell = this.getDomHelper().createElement(TagName.TD);
      monthCell.colSpan = 5;
      this.createButton_(
          monthCell, '\u00AB',
          google.getCssName(this.getBaseCssClass(), 'previousMonth'));  // <<
      this.createButton_(
          monthCell, '', google.getCssName(this.getBaseCssClass(), 'month'));
      this.createButton_(
          monthCell, '\u00BB',
          google.getCssName(this.getBaseCssClass(), 'nextMonth'));  // >>
  
      yearCell = this.getDomHelper().createElement(TagName.TD);
      yearCell.colSpan = 3;
      this.createButton_(
          yearCell, '\u00AB',
          google.getCssName(this.getBaseCssClass(), 'previousYear'));  // <<
      this.createButton_(
          yearCell, '', google.getCssName(this.getBaseCssClass(), 'year'));
      this.createButton_(
          yearCell, '\u00BB',
          google.getCssName(this.getBaseCssClass(), 'nextYear'));  // <<
  
      // If the date format has year ('y') appearing first before month ('m'),
      // show the year on the left hand side of the datepicker popup.  Otherwise,
      // show the month on the left side.  This check assumes the data to be
      // valid, and that all date formats contain month and year.
      if (fullDateFormat.indexOf('y') < fullDateFormat.indexOf('m')) {
        row.appendChild(yearCell);
        row.appendChild(monthCell);
      } else {
        row.appendChild(monthCell);
        row.appendChild(yearCell);
      }
    }
  };

  /**
   * Render the footer row (with select buttons).
   *
   * @param {!Element} row The parent element to render the component into.
   * @param {boolean} showWeekNum Whether week numbers should be shown.
   * @override
   */
  renderFooterRow(
      row, showWeekNum) {
    // Populate the footer row with buttons for Today and None.
    var cell = this.getDomHelper().createElement(TagName.TD);
    cell.colSpan = showWeekNum ? 2 : 3;
    cell.className = google.getCssName(this.getBaseCssClass(), 'today-cont');
  
    /** @desc Label for button that selects the current date. */
    var MSG_DATEPICKER_TODAY_BUTTON_LABEL = google.getMsg('Today');
    this.createButton_(
        cell, MSG_DATEPICKER_TODAY_BUTTON_LABEL,
        google.getCssName(this.getBaseCssClass(), 'today-btn'));
    row.appendChild(cell);
  
    cell = this.getDomHelper().createElement(TagName.TD);
    cell.colSpan = showWeekNum ? 4 : 3;
    row.appendChild(cell);
  
    cell = this.getDomHelper().createElement(TagName.TD);
    cell.colSpan = 2;
    cell.className = google.getCssName(this.getBaseCssClass(), 'none-cont');
  
    /** @desc Label for button that clears the selection. */
    var MSG_DATEPICKER_NONE = google.getMsg('None');
    this.createButton_(
        cell, MSG_DATEPICKER_NONE,
        google.getCssName(this.getBaseCssClass(), 'none-btn'));
    row.appendChild(cell);
  };

  /**
   * Support function for button creation.
   *
   * @param {Element} parentNode Container the button should be added to.
   * @param {string} label Button label.
   * @param {string=} opt_className Class name for button, which will be used
   *    in addition to "goog-date-picker-btn".
   * @private
   * @return {!Element} The created button element.
   */
  createButton_(
      parentNode, label, opt_className) {
    var classes = [google.getCssName(this.getBaseCssClass(), 'btn')];
    if (opt_className) {
      classes.push(opt_className);
    }
    var el = this.getDomHelper().createElement(TagName.BUTTON);
    el.className = classes.join(' ');
    el.appendChild(this.getDomHelper().createTextNode(label));
    parentNode.appendChild(el);
    return el;
  };
}

export {DefaultDatePickerRenderer};