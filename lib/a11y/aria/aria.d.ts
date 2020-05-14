/**
 * Asserts that the element has a role set if it's not an HTML element whose
 * semantics is well supported by most screen readers.
 * Only to be used internally by the ARIA library in goog.a11y.aria.*.
 * @param {!Element} element The element to assert an ARIA role set.
 * @param {!ArrayLike<string>} allowedRoles The child roles of
 * the roles.
 */
export function assertRoleIsSetInternalUtil(element: Element, allowedRoles: ArrayLike<string>): void;
/**
 * Returns the activedescendant element for the input element by
 * using the activedescendant ARIA property of the given element.
 * @param {!Element} element DOM node to get activedescendant
 *     element for.
 * @return {Element|null} DOM node of the activedescendant, if found.
 */
export function getActiveDescendant(element: Element): Element | null;
/**
 * Gets the label of the given element.
 * @param {!Element} element DOM node to get label from.
 * @return {string} label The label.
 */
export function getLabel(element: Element): string;
/**
 * Gets role of an element.
 * @param {!Element} element DOM element to get role of.
 * @return {?Role} ARIA Role name.
 */
export function getRole(element: Element): Role | null;
/**
 * Gets value of specified state or property.
 * @param {!Element} element DOM node to get state from.
 * @param {!State|string} stateName State name.
 * @return {string} Value of the state attribute.
 */
export function getState(element: Element, stateName: State | string): string;
/**
 * Gets the boolean value of an ARIA state/property.
 * @param {!Element} element The element to get the ARIA state for.
 * @param {!State|string} stateName the ARIA state name.
 * @return {?boolean} Boolean value for the ARIA state value or null if
 *     the state value is not 'true', not 'false', or not set.
 */
export function getStateBoolean(element: Element, stateName: State | string): boolean | null;
/**
 * Gets the number value of an ARIA state/property.
 * @param {!Element} element The element to get the ARIA state for.
 * @param {!State|string} stateName the ARIA state name.
 * @return {?number} Number value for the ARIA state value or null if
 *     the state value is not a number or not set.
 */
export function getStateNumber(element: Element, stateName: State | string): number | null;
/**
 * Gets the string value of an ARIA state/property.
 * @param {!Element} element The element to get the ARIA state for.
 * @param {!State|string} stateName the ARIA state name.
 * @return {?string} String value for the ARIA state value or null if
 *     the state value is empty string or not set.
 */
export function getStateString(element: Element, stateName: State | string): string | null;
/**
 * Gets array of strings value of the specified state or
 * property for the element.
 * Only to be used internally by the ARIA library in goog.a11y.aria.*.
 * @param {!Element} element DOM node to get state from.
 * @param {!State} stateName State name.
 * @return {!ArrayLike<string>} string Array
 *     value of the state attribute.
 */
export function getStringArrayStateInternalUtil(element: Element, stateName: State): ArrayLike<string>;
/**
 * Returns true if element has an ARIA state/property, false otherwise.
 * @param {!Element} element The element to get the ARIA state for.
 * @param {!State|string} stateName the ARIA state name.
 * @return {boolean}
 */
export function hasState(element: Element, stateName: State | string): boolean;
/**
 * Returns whether the element has a container ARIA role.
 * Container roles are ARIA roles that use the aria-activedescendant property
 * to manage their active descendants or children. See
 * {@link http://www.w3.org/TR/wai-aria/states_and_properties
 * #aria-activedescendant} for more information.
 * @param {!Element} element
 * @return {boolean}
 */
export function isContainerRole(element: Element): boolean;
/**
 * Removes role of an element.
 * @param {!Element} element DOM element to remove the role from.
 */
export function removeRole(element: Element): void;
/**
 * Remove the state or property for the element.
 * @param {!Element} element DOM node where we set state.
 * @param {!State} stateName State name.
 */
export function removeState(element: Element, stateName: State): void;
/**
 * Sets the activedescendant ARIA property value for an element.
 * If the activeElement is not null, it should have an id set.
 * @param {!Element} element DOM node to set activedescendant ARIA property to.
 * @param {Element|null} activeElement DOM node being set as activedescendant.
 */
export function setActiveDescendant(element: Element, activeElement: Element | null): void;
/**
 * Sets the label of the given element.
 * @param {!Element} element DOM node to set label to.
 * @param {string} label The label to set.
 */
export function setLabel(element: Element, label: string): void;
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
export function setRole(element: Element, roleName: Role | string): void;
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
export function setState(element: Element, stateName: (State | string), value: string | boolean | number | Array<string>): void;
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
export function toggleState(el: Element, attr: (State | string)): void;
import { Role } from "./roles.js";
import { State } from "./attributes.js";
