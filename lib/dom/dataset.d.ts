/**
 * Gets a custom data attribute from an element. The key should be
 * in camelCase format (e.g "keyName" for the "data-key-name" attribute).
 * @param {?Element} element DOM node to get the custom data attribute from.
 * @param {string} key Key for the custom data attribute.
 * @return {?string} The attribute value, if it exists.
 */
export function get(element: Element | null, key: string): string | null;
/**
 * Gets all custom data attributes as a string map.  The attribute names will be
 * camel cased (e.g., data-foo-bar -> dataset['fooBar']).  This operation is not
 * safe for attributes having camel-cased names clashing with already existing
 * properties (e.g., data-to-string -> dataset['toString']).
 * @param {!Element} element DOM node to get the data attributes from.
 * @return {!Object} The string map containing data attributes and their
 *     respective values.
 */
export function getAll(element: Element): any;
/**
 * Checks whether custom data attribute exists on an element. The key should be
 * in camelCase format (e.g "keyName" for the "data-key-name" attribute).
 *
 * @param {?Element} element DOM node to get the custom data attribute from.
 * @param {string} key Key for the custom data attribute.
 * @return {boolean} Whether the attribute exists.
 */
export function has(element: Element | null, key: string): boolean;
/**
 * Removes a custom data attribute from an element. The key should be
  * in camelCase format (e.g "keyName" for the "data-key-name" attribute).
 * @param {?Element} element DOM node to get the custom data attribute from.
 * @param {string} key Key for the custom data attribute.
 */
export function remove(element: Element | null, key: string): void;
/**
 * Sets a custom data attribute on an element. The key should be
 * in camelCase format (e.g "keyName" for the "data-key-name" attribute).
 * @param {?Element} element DOM node to set the custom data attribute on.
 * @param {string} key Key for the custom data attribute.
 * @param {string} value Value for the custom data attribute.
 */
export function set(element: Element | null, key: string, value: string): void;
