/**
 * JSON replacer, as defined in Section 15.12.3 of the ES5 spec.
 */
export type Replacer = (this: any, arg1: string, arg2: any) => any;
/**
 * JSON reviver, as defined in Section 15.12.2 of the ES5 spec.
 */
export type Reviver = (this: any, arg1: string, arg2: any) => any;
/**
 * JSON replacer, as defined in Section 15.12.3 of the ES5 spec.
 * @see http://ecma-international.org/ecma-262/5.1/#sec-15.12.3
 *
 * TODO(nicksantos): Array should also be a valid replacer.
 *
 * @typedef {function(this:Object, string, *): *}
 */
export let Replacer: any;
/**
 * JSON reviver, as defined in Section 15.12.2 of the ES5 spec.
 * @see http://ecma-international.org/ecma-262/5.1/#sec-15.12.3
 *
 * @typedef {function(this:Object, string, *): *}
 */
export let Reviver: any;
/**
 * Class that is used to serialize JSON objects to a string.
 */
export class Serializer {
    /**
     * Class that is used to serialize JSON objects to a string.
     * @param {?Replacer=} opt_replacer Replacer.
     */
    constructor(opt_replacer?: (Replacer | null) | undefined);
    /**
     * @type {Replacer|null|undefined}
     * @private
     */
    private replacer_;
    /**
     * Serializes an object or a value to a JSON string.
     *
     * @param {*} object The object to serialize.
     * @throws Error if there are loops in the object graph.
     * @return {string} A JSON string representation of the input.
     */
    serialize(object: any): string;
    /**
     * Serializes a generic value to a JSON string
     * @suppress{checkTypes}
     * @protected
     * @param {*} object The object to serialize.
     * @param {Array<string>} sb Array used as a string builder.
     * @throws Error if there are loops in the object graph.
     */
    protected serializeInternal(object: any, sb: Array<string>): void;
    /**
     * Serializes a string to a JSON string
     * @private
     * @param {string} s The string to serialize.
     * @param {Array<string>} sb Array used as a string builder.
     */
    private serializeString_;
    /**
     * Serializes a number to a JSON string
     * @private
     * @param {number} n The number to serialize.
     * @param {Array<string>} sb Array used as a string builder.
     */
    private serializeNumber_;
    /**
     * Serializes an array to a JSON string
     * @param {Array<string>} arr The array to serialize.
     * @param {Array<string>} sb Array used as a string builder.
     * @protected
     */
    protected serializeArray(arr: Array<string>, sb: Array<string>): void;
    /**
     * Serializes an object to a JSON string
     * @private
     * @param {!Object} obj The object to serialize.
     * @param {Array<string>} sb Array used as a string builder.
     */
    private serializeObject_;
}
export namespace Serializer {
    export const charToJsonCharCache_: any;
    export const charsToReplace_: RegExp;
}
/**
 * @type {boolean} If true, try the native JSON parsing API first. If it
 * fails, log an error and use `eval` instead. This is useful when
 * transitioning to `USE_NATIVE_JSON`. The error logger needs to
 * be set by `setErrorLogger`. If it is not set then the error
 * is ignored.
 */
export const TRY_NATIVE_JSON: boolean;
/**
 * @fileoverview JSON utility functions.
 */
/**
 * @type {boolean} If true, use the native JSON parsing API.
 * NOTE: The default `parse` implementation is able to handle
 * invalid JSON. JSPB used to produce invalid JSON which is not the case
 * anymore so this is safe to enable for parsing JSPB. Using native JSON is
 * faster and safer than the default implementation using `eval`.
 */
export const USE_NATIVE_JSON: boolean;
/**
 * Tests if a string is an invalid JSON string. This only ensures that we are
 * not using any invalid characters
 * @param {string} s The string to test.
 * @return {boolean} True if the input is a valid JSON string.
 */
export function isValid(s: string): boolean;
export function parse(s: any): any;
export function serialize(object: any, opt_replacer?: any): string;
/**
 * Sets an error logger to use if there's a recoverable parsing error and
 * `TRY_NATIVE_JSON` is enabled.
 * @param {function(string, !Error)} errorLogger The first parameter is the
 *     error message, the second is the exception thrown by `JSON.parse`.
 */
export function setErrorLogger(errorLogger: (arg0: string, arg1: Error) => void): void;
