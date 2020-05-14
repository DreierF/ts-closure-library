/**
 * @param {string} eventType An event type.
 * @return {string} A lower-cased vendor prefixed event type.
 */
export function getPrefixedEventType(eventType: string): string;
/**
 * @param {string} propertyName A property name.
 * @param {!Object=} opt_object If provided, we verify if the property exists in
 *     the object.
 * @return {?string} A vendor prefixed property name, or null if it does not
 *     exist.
 */
export function getPrefixedPropertyName(propertyName: string, opt_object?: any | undefined): string | null;
/**
 * @fileoverview Vendor prefix getters.
 */
/**
 * Returns the JS vendor prefix used in CSS properties. Different vendors
 * use different methods of changing the case of the property names.
 *
 * @return {?string} The JS vendor prefix or null if there is none.
 */
export function getVendorJsPrefix(): string | null;
/**
 * Returns the vendor prefix used in CSS properties.
 *
 * @return {?string} The vendor prefix or null if there is none.
 */
export function getVendorPrefix(): string | null;
