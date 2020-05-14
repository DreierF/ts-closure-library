/**
 * @fileoverview Utility for fast string concatenation.
 */
/**
 * Utility class to facilitate string concatenation.
 *
 *     append, e.g., new StringBuffer('foo', 'bar').
 */
export class StringBuffer {
    /**
     * Utility class to facilitate string concatenation.
     *
     * @param {*=} opt_a1 Optional first initial item to append.
     * @param {...*} var_args Other initial items to
     *     append, e.g., new StringBuffer('foo', 'bar').
     */
    constructor(opt_a1?: any | undefined, ...args: any[]);
    /**
     * Internal buffer for the string to be concatenated.
     * @type {string}
     * @private
     */
    private buffer_;
    /**
     * Sets the contents of the string buffer object, replacing what's currently
     * there.
     *
     * @param {*} s String to set.
     */
    set(s: any): void;
    /**
     * Appends one or more items to the buffer.
     *
     * Calling this with null, undefined, or empty arguments is an error.
     *
     * @param {*} a1 Required first string.
     * @param {*=} opt_a2 Optional second string.
     * @param {...?} var_args Other items to append,
     *     e.g., sb.append('foo', 'bar', 'baz').
     * @return {!StringBuffer} This same StringBuffer object.
     * @suppress {duplicate}
     */
    append(a1: any, opt_a2?: any | undefined, ...args: any[]): StringBuffer;
    /**
     * Clears the internal buffer.
     */
    clear(): void;
    /**
     * @return {number} the length of the current contents of the buffer.
     */
    getLength(): number;
    /**
     * @return {string} The concatenated string.
     * @override
     */
    toString(): string;
}
