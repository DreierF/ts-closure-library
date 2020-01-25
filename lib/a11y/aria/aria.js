import * as googarray from './../../array/array.js';
import * as asserts from './../../asserts/asserts.js';
import * as dom from './../../dom/dom.js';
import {TagName} from './../../dom/tagname.js';
import * as google from './../../google.js';
import * as object from './../../object/object.js';
import * as strings from './../../string/string.js';
import {State} from './attributes.js';
import * as datatables from './datatables.js';
import {Role} from './roles.js';
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
 * @fileoverview Utilities for adding, removing and setting ARIA roles and
 * states as defined by W3C ARIA standard: http://www.w3.org/TR/wai-aria/
 * All modern browsers have some form of ARIA support, so no browser checks are
 * performed when adding ARIA to components.
 */

/**
 * ARIA states/properties prefix.
 * @private
 */
let ARIA_PREFIX_ = 'aria-';

/**
 * ARIA role attribute.
 * @private
 */
let ROLE_ATTRIBUTE_ = 'role';

/**
 * A list of tag names for which we don't need to set ARIA role and states
 * because they have well supported semantics for screen readers or because
 * they don't contain content to be made accessible.
 * @private
 */
let TAGS_WITH_ASSUMED_ROLES_ = object.createSet([
  TagName.A, TagName.AREA, TagName.BUTTON,
  TagName.HEAD, TagName.INPUT, TagName.LINK,
  TagName.MENU, TagName.META, TagName.OPTGROUP,
  TagName.OPTION, TagName.PROGRESS, TagName.STYLE,
  TagName.SELECT, TagName.SOURCE, TagName.TEXTAREA,
  TagName.TITLE, TagName.TRACK
]);

/**
 * A list of roles which are considered container roles.
 * Container roles are ARIA roles which use the aria-activedescendant property
 * to manage their active descendants or children. See
 * {@link http://www.w3.org/TR/wai-aria/states_and_properties
 * #aria-activedescendant} for more information.
 * @private @const {!Array<Role>}
 */
let CONTAINER_ROLES_ = [
  Role.COMBOBOX, Role.GRID,
  Role.GROUP, Role.LISTBOX,
  Role.MENU, Role.MENUBAR,
  Role.RADIOGROUP, Role.ROW,
  Role.ROWGROUP, Role.TAB_LIST,
  Role.TEXTBOX, Role.TOOLBAR,
  Role.TREE, Role.TREEGRID
];

/**
 * Sets the role of an element. If the roleName is
 * empty string or null, the role for the element is removed.
 * We encourage clients to call the removeRole
 * method instead of setting null and empty string values.
 * Special handling for this case is added to ensure
 * backword compatibility with existing code.
 *
 * @param {!Element} element DOM node to set role of.
 * @param {!Role|string} roleName role name(s).
 */
function setRole(element, roleName) {
  if (!roleName) {
    // Setting the ARIA role to empty string is not allowed
    // by the ARIA standard.
    removeRole(element);
  } else {
    if (asserts.ENABLE_ASSERTS) {
      asserts.assert(
          object.containsValue(Role, roleName),
          'No such ARIA role ' + roleName);
    }
    element.setAttribute(ROLE_ATTRIBUTE_, roleName);
  }
};

/**
 * Gets role of an element.
 * @param {!Element} element DOM element to get role of.
 * @return {?Role} ARIA Role name.
 */
function getRole(element) {
  var role = element.getAttribute(ROLE_ATTRIBUTE_);
  return /** @type {Role} */ (role) || null;
};

/**
 * Removes role of an element.
 * @param {!Element} element DOM element to remove the role from.
 */
function removeRole(element) {
  element.removeAttribute(ROLE_ATTRIBUTE_);
};

/**
 * Sets the state or property of an element.
 * @suppress{checkTypes}
 * @param {!Element} element DOM node where we set state.
 * @param {!(State|string)} stateName State attribute being set.
 *     Automatically adds prefix 'aria-' to the state name if the attribute is
 *     not an extra attribute.
 * @param {string|boolean|number|!Array<string>} value Value
 * for the state attribute.
 */
function setState(element, stateName, value) {
  if (google.isArray(value)) {
    value = value.join(' ');
  }
  var attrStateName = getAriaAttributeName_(stateName);
  if (value === '' || value == undefined) {
    var defaultValueMap = datatables.getDefaultValuesMap();
    // Work around for browsers that don't properly support ARIA.
    // According to the ARIA W3C standard, user agents should allow
    // setting empty value which results in setting the default value
    // for the ARIA state if such exists. The exact text from the ARIA W3C
    // standard (http://www.w3.org/TR/wai-aria/states_and_properties):
    // "When a value is indicated as the default, the user agent
    // MUST follow the behavior prescribed by this value when the state or
    // property is empty or undefined."
    // The defaultValueMap contains the default values for the ARIA states
    // and has as a key the State constant for the state.
    if (stateName in defaultValueMap) {
      element.setAttribute(attrStateName, defaultValueMap[stateName]);
    } else {
      element.removeAttribute(attrStateName);
    }
  } else {
    element.setAttribute(attrStateName, value);
  }
};

/**
 * Toggles the ARIA attribute of an element.
 * Meant for attributes with a true/false value, but works with any attribute.
 * If the attribute does not have a true/false value, the following rules apply:
 * A not empty attribute will be removed.
 * An empty attribute will be set to true.
 * @param {!Element} el DOM node for which to set attribute.
 * @param {!(State|string)} attr ARIA attribute being set.
 *     Automatically adds prefix 'aria-' to the attribute name if the attribute
 *     is not an extra attribute.
 */
function toggleState(el, attr) {
  var val = getState(el, attr);
  if (!strings.isEmptyOrWhitespace(strings.makeSafe(val)) &&
      !(val == 'true' || val == 'false')) {
    removeState(el, /** @type {!State} */ (attr));
    return;
  }
  setState(el, attr, val == 'true' ? 'false' : 'true');
};

/**
 * Remove the state or property for the element.
 * @param {!Element} element DOM node where we set state.
 * @param {!State} stateName State name.
 */
function removeState(element, stateName) {
  element.removeAttribute(getAriaAttributeName_(stateName));
};

/**
 * Gets value of specified state or property.
 * @param {!Element} element DOM node to get state from.
 * @param {!State|string} stateName State name.
 * @return {string} Value of the state attribute.
 */
function getState(element, stateName) {
  // TODO(user): return properly typed value result --
  // boolean, number, string, null. We should be able to chain
  // getState(...) and setState(...) methods.

  var attr =
      /** @type {string|number|boolean} */ (
          element.getAttribute(
              getAriaAttributeName_(stateName)));
  var isNullOrUndefined = attr == null || attr == undefined;
  return isNullOrUndefined ? '' : String(attr);
};

/**
 * Returns the activedescendant element for the input element by
 * using the activedescendant ARIA property of the given element.
 * @param {!Element} element DOM node to get activedescendant
 *     element for.
 * @return {?Element} DOM node of the activedescendant, if found.
 */
function getActiveDescendant(element) {
  var id =
      getState(element, State.ACTIVEDESCENDANT);
  return dom.getOwnerDocument(element).getElementById(id);
};

/**
 * Sets the activedescendant ARIA property value for an element.
 * If the activeElement is not null, it should have an id set.
 * @param {!Element} element DOM node to set activedescendant ARIA property to.
 * @param {?Element} activeElement DOM node being set as activedescendant.
 */
function setActiveDescendant(element, activeElement) {
  var id = '';
  if (activeElement) {
    id = activeElement.id;
    asserts.assert(id, 'The active element should have an id.');
  }

  setState(element, State.ACTIVEDESCENDANT, id);
};

/**
 * Gets the label of the given element.
 * @param {!Element} element DOM node to get label from.
 * @return {string} label The label.
 */
function getLabel(element) {
  return getState(element, State.LABEL);
};

/**
 * Sets the label of the given element.
 * @param {!Element} element DOM node to set label to.
 * @param {string} label The label to set.
 */
function setLabel(element, label) {
  setState(element, State.LABEL, label);
};

/**
 * Asserts that the element has a role set if it's not an HTML element whose
 * semantics is well supported by most screen readers.
 * Only to be used internally by the ARIA library in goog.a11y.aria.*.
 * @param {!Element} element The element to assert an ARIA role set.
 * @param {!IArrayLike<string>} allowedRoles The child roles of
 * the roles.
 */
function assertRoleIsSetInternalUtil(element, allowedRoles) {
  if (TAGS_WITH_ASSUMED_ROLES_[element.tagName]) {
    return;
  }
  var elementRole = /** @type {string}*/ (getRole(element));
  asserts.assert(
      elementRole != null, 'The element ARIA role cannot be null.');

  asserts.assert(
      googarray.contains(allowedRoles, elementRole),
      'Non existing or incorrect role set for element.' +
          'The role set is "' + elementRole + '". The role should be any of "' +
          allowedRoles + '". Check the ARIA specification for more details ' +
          'http://www.w3.org/TR/wai-aria/roles.');
};

/**
 * Gets the boolean value of an ARIA state/property.
 * @param {!Element} element The element to get the ARIA state for.
 * @param {!State|string} stateName the ARIA state name.
 * @return {?boolean} Boolean value for the ARIA state value or null if
 *     the state value is not 'true', not 'false', or not set.
 */
function getStateBoolean(element, stateName) {
  var attr =
      /** @type {string|boolean|null} */ (element.getAttribute(
          getAriaAttributeName_(stateName)));
  asserts.assert(
      typeof attr === 'boolean' || attr == null || attr == 'true' ||
      attr == 'false');
  if (attr == null) {
    return attr;
  }
  return typeof attr === 'boolean' ? attr : attr == 'true';
};

/**
 * Gets the number value of an ARIA state/property.
 * @param {!Element} element The element to get the ARIA state for.
 * @param {!State|string} stateName the ARIA state name.
 * @return {?number} Number value for the ARIA state value or null if
 *     the state value is not a number or not set.
 */
function getStateNumber(element, stateName) {
  var attr =
      /** @type {string|number} */ (
          element.getAttribute(
              getAriaAttributeName_(stateName)));
  asserts.assert(
      (attr == null || !isNaN(Number(attr))) && typeof attr !== 'boolean');
  return attr == null ? null : Number(attr);
};

/**
 * Gets the string value of an ARIA state/property.
 * @param {!Element} element The element to get the ARIA state for.
 * @param {!State|string} stateName the ARIA state name.
 * @return {?string} String value for the ARIA state value or null if
 *     the state value is empty string or not set.
 */
function getStateString(element, stateName) {
  var attr =
      element.getAttribute(getAriaAttributeName_(stateName));
  asserts.assert(
      (attr == null || typeof attr === 'string') &&
      (attr == '' || isNaN(Number(attr))) && attr != 'true' && attr != 'false');
  return (attr == null || attr == '') ? null : attr;
};

/**
 * Gets array of strings value of the specified state or
 * property for the element.
 * Only to be used internally by the ARIA library in goog.a11y.aria.*.
 * @param {!Element} element DOM node to get state from.
 * @param {!State} stateName State name.
 * @return {!IArrayLike<string>} string Array
 *     value of the state attribute.
 */
function getStringArrayStateInternalUtil(element, stateName) {
  var attrValue =
      element.getAttribute(getAriaAttributeName_(stateName));
  return splitStringOnWhitespace_(attrValue);
};

/**
 * Returns true if element has an ARIA state/property, false otherwise.
 * @param {!Element} element The element to get the ARIA state for.
 * @param {!State|string} stateName the ARIA state name.
 * @return {boolean}
 */
function hasState(element, stateName) {
  return element.hasAttribute(getAriaAttributeName_(stateName));
};

/**
 * Returns whether the element has a container ARIA role.
 * Container roles are ARIA roles that use the aria-activedescendant property
 * to manage their active descendants or children. See
 * {@link http://www.w3.org/TR/wai-aria/states_and_properties
 * #aria-activedescendant} for more information.
 * @param {!Element} element
 * @return {boolean}
 */
function isContainerRole(element) {
  var role = getRole(element);
  return googarray.contains(CONTAINER_ROLES_, role);
};

/**
 * Splits the input stringValue on whitespace.
 * @param {string} stringValue The value of the string to split.
 * @return {!IArrayLike<string>} string Array
 *     value as result of the split.
 * @private
 */
function splitStringOnWhitespace_(stringValue) {
  return stringValue ? stringValue.split(/\s+/) : [];
};

/**
 * Adds the 'aria-' prefix to ariaName.
 * @param {string} ariaName ARIA state/property name.
 * @private
 * @return {string} The ARIA attribute name with added 'aria-' prefix.
 * @throws {Error} If no such attribute exists.
 */
function getAriaAttributeName_(ariaName) {
  if (asserts.ENABLE_ASSERTS) {
    asserts.assert(ariaName, 'ARIA attribute cannot be empty.');
    asserts.assert(
        object.containsValue(State, ariaName),
        'No such ARIA attribute ' + ariaName);
  }
  return ARIA_PREFIX_ + ariaName;
};

export {assertRoleIsSetInternalUtil, getActiveDescendant, getLabel, getRole, getState, getStateBoolean, getStateNumber, getStateString, getStringArrayStateInternalUtil, hasState, isContainerRole, removeRole, removeState, setActiveDescendant, setLabel, setRole, setState, toggleState};