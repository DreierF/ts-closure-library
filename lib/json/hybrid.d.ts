/**
 * Attempts to parse the JSON string natively, falling back to
 * `json.parse` if unsuccessful.
 * @param {string} jsonString JSON string to parse.
 * @return {?Object} Resulting JSON object.
 */
export let parse: (text: string, reviver?: (this: any, key: string, value: any) => any) => any;
/**
 * @fileoverview Utility to attempt native JSON processing, falling back to
 *     json if not available.
 *
 *     This is intended as a drop-in for current users of json who want
 *     to take advantage of native JSON if present.
 */
/**
 * Attempts to serialize the JSON string natively, falling back to
 * `json.serialize` if unsuccessful.
 * @param {!Object} obj JavaScript object to serialize to JSON.
 * @return {string} Resulting JSON string.
 */
export let stringify: {
    (value: any, replacer?: (this: any, key: string, value: any) => any, space?: string | number): string;
    (value: any, replacer?: (string | number)[], space?: string | number): string;
};
