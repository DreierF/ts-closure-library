/**
 * @fileoverview Implementation of sprintf-like, python-%-operator-like,
 * .NET-String.Format-like functionality. Uses JS string's replace method to
 * extract format specifiers and sends those specifiers to a handler function,
 * which then, based on conversion type part of the specifier, calls the
 * appropriate function to handle the specific conversion.
 * For specific functionality implemented, look at formatRe below, or look
 * at the tests.
 */
/**
 * Performs sprintf-like conversion, i.e. puts the values in a template.
 * DO NOT use it instead of built-in conversions in simple cases such as
 * 'Cost: %.2f' as it would introduce unnecessary latency opposed to
 * 'Cost: ' + cost.toFixed(2).
 * @param {string} formatString Template string containing % specifiers.
 * @param {...(string|number|undefined)} var_args Values formatString is to
 *     be filled with.
 * @return {string} Formatted string.
 */
export function format(formatString: string, ...args: (string | number | undefined)[]): string;
export namespace format {
    export namespace demuxes_ {
        export function s(value: string, flags: string, width: string, dotp: string, precision: string, type: string, offset: string, wholeString: string): string;
        export function f(value: string, flags: string, width: string, dotp: string, precision: string, type: string, offset: string, wholeString: string): string;
        export function d(value: string, flags: string, width: string, dotp: string, precision: string, type: string, offset: string, wholeString: string): string;
        export function i(value: string, flags: string, width: string, dotp: string, precision: string, type: string, offset: string, wholeString: string): string;
        export function u(value: string, flags: string, width: string, dotp: string, precision: string, type: string, offset: string, wholeString: string): string;
    }
}
