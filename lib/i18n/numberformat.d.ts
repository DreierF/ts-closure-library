/**
 * Currency styles.
 */
export type CurrencyStyle = number;
/**
 * Standard number formatting patterns.
 */
export type Format = number;
export namespace CurrencyStyle {
    export const LOCAL: number;
    export const PORTABLE: number;
    export const GLOBAL: number;
}
export namespace Format {
    export const DECIMAL: number;
    export const SCIENTIFIC: number;
    export const PERCENT: number;
    export const CURRENCY: number;
    export const COMPACT_SHORT: number;
    export const COMPACT_LONG: number;
}
/**
 * @fileoverview Number format/parse library with locale support.
 */
/**
 * Namespace for locale number format functions
 */
/**
 * Constructor of NumberFormat.
 *     number format pattern.
 *     code. This determines the currency code/symbol used in format/parse. If
 *     not given, the currency code for the current locale will be used.
 *     CurrencyStyle. If not given, the currency style
 *     for the current locale will be used.
 *     map, analogous to I18n_NumberFormatSymbols. If present, this
 *     overrides the symbols from the current locale, such as the percent sign
 *     and minus sign.
 */
export class NumberFormat {
    /**
     * Constructor of NumberFormat.
     * @param {number|string} pattern The number that indicates a predefined
     *     number format pattern.
     * @param {string=} opt_currency Optional international currency
     *     code. This determines the currency code/symbol used in format/parse. If
     *     not given, the currency code for the current locale will be used.
     * @param {number=} opt_currencyStyle currency style, value defined in
     *     CurrencyStyle. If not given, the currency style
     *     for the current locale will be used.
     * @param {!Object<string, string>=} opt_symbols Optional number format symbols
     *     map, analogous to I18n_NumberFormatSymbols. If present, this
     *     overrides the symbols from the current locale, such as the percent sign
     *     and minus sign.
     */
    constructor(pattern: string | number, opt_currency?: string | undefined, opt_currencyStyle?: number | undefined, opt_symbols?: {
        [x: string]: string;
    } | undefined);
    /** @const @private {?string} */
    intlCurrencyCode_: string | null;
    /** @const @private {number} */
    currencyStyle_: number;
    /** @const @private {?Object<string, string>} */
    overrideNumberFormatSymbols_: {
        [x: string]: string;
    } | null;
    /** @private {number} */
    maximumIntegerDigits_: number;
    /** @private {number} */
    minimumIntegerDigits_: number;
    /** @private {number} */
    significantDigits_: number;
    /** @private {number} */
    maximumFractionDigits_: number;
    /** @private {number} */
    minimumFractionDigits_: number;
    /** @private {number} */
    minExponentDigits_: number;
    /** @private {boolean} */
    useSignForPositiveExponent_: boolean;
    /**
     * Whether to show trailing zeros in the fraction when significantDigits_ is
     * positive.
     * @private {boolean}
     */
    showTrailingZeros_: boolean;
    /** @private {string} */
    positivePrefix_: string;
    /** @private {string} */
    positiveSuffix_: string;
    /** @private {string} */
    negativePrefix_: any;
    /** @private {string} */
    negativeSuffix_: string;
    /** @private {number} */
    multiplier_: number;
    /**
     * True if the percent/permill sign of the negative pattern is expected.
     * @private {boolean}
     */
    negativePercentSignExpected_: boolean;
    /**
     * The grouping array is used to store the values of each number group
     * following left of the decimal place. For example, a number group with
     * NumberFormat('#,##,###') should have [3,2] where 2 is the
     * repeated number group following a fixed number grouping of size 3.
     * @private {!Array<number>}
     */
    groupingArray_: any[];
    /** @private {boolean} */
    decimalSeparatorAlwaysShown_: boolean;
    /** @private {boolean} */
    useExponentialNotation_: boolean;
    /** @private {NumberFormat.CompactStyle} */
    compactStyle_: number;
    /**
     * The number to base the formatting on when using compact styles, or null
     * if formatting should not be based on another number.
     * @type {?number}
     * @private
     */
    baseFormattingNumber_: number | null;
    /**
     * Returns the current NumberFormatSymbols.
     * @return {?}
     * @private
     */
    getNumberFormatSymbols_(): any;
    /**
     * Returns the currency code.
     * @return {string}
     * @private
     */
    getCurrencyCode_(): string;
    /**
     * Sets minimum number of fraction digits.
     * @param {number} min the minimum.
     * @return {!NumberFormat} Reference to this NumberFormat object.
     */
    setMinimumFractionDigits(min: number): NumberFormat;
    /**
     * Gets minimum number of fraction digits.
     * @return {number} The number of minimum fraction digits.
     */
    getMinimumFractionDigits(): number;
    /**
     * Sets maximum number of fraction digits.
     * @param {number} max the maximum.
     * @return {!NumberFormat} Reference to this NumberFormat object.
     */
    setMaximumFractionDigits(max: number): NumberFormat;
    /**
     * Gets maximum number of fraction digits.
     * @return {number} The number of maximum fraction digits.
     */
    getMaximumFractionDigits(): number;
    /**
     * Sets number of significant digits to show. Only fractions will be rounded.
     * Regardless of the number of significant digits set, the number of fractional
     * digits shown will always be capped by the maximum number of fractional digits
     * set on {@link #setMaximumFractionDigits}.
     * @param {number} number The number of significant digits to include.
     * @return {!NumberFormat} Reference to this NumberFormat object.
     */
    setSignificantDigits(number: number): NumberFormat;
    /**
     * Gets number of significant digits to show. Only fractions will be rounded.
     * @return {number} The number of significant digits to include.
     */
    getSignificantDigits(): number;
    /**
     * Sets whether trailing fraction zeros should be shown when significantDigits_
     * is positive. If this is true and significantDigits_ is 2, 1 will be formatted
     * as '1.0'.
     * @param {boolean} showTrailingZeros Whether trailing zeros should be shown.
     * @return {!NumberFormat} Reference to this NumberFormat object.
     */
    setShowTrailingZeros(showTrailingZeros: boolean): NumberFormat;
    /**
     * Sets a number to base the formatting on when compact style formatting is
     * used. If this is null, the formatting should be based only on the number to
     * be formatting.
     *
     * This base formatting number can be used to format the target number as
     * another number would be formatted. For example, 100,000 is normally formatted
     * as "100K" in the COMPACT_SHORT format. To instead format it as '0.1M', the
     * base number could be set to 1,000,000 in order to force all numbers to be
     * formatted in millions. Similarly, 1,000,000,000 would normally be formatted
     * as '1B' and setting the base formatting number to 1,000,000, would cause it
     * to be formatted instead as '1,000M'.
     *
     * @param {?number} baseFormattingNumber The number to base formatting on, or
     * null if formatting should not be based on another number.
     * @return {!NumberFormat} Reference to this NumberFormat object.
     */
    setBaseFormatting(baseFormattingNumber: number | null): NumberFormat;
    /**
     * Gets the number on which compact formatting is currently based, or null if
     * no such number is set. See setBaseFormatting() for more information.
     * @return {?number}
     */
    getBaseFormatting(): number | null;
    /**
     * Apply provided pattern, result are stored in member variables.
     *
     * @param {string} pattern String pattern being applied.
     * @private
     */
    applyPattern_(pattern: string): void;
    pattern_: string | undefined;
    /**
     * Apply a predefined pattern to NumberFormat object.
     * @param {number} patternType The number that indicates a predefined number
     *     format pattern.
     * @private
     */
    applyStandardPattern_(patternType: number): void;
    /**
     * Apply a predefined pattern for shorthand formats.
     * @param {NumberFormat.CompactStyle} style the compact style to
     *     set defaults for.
     * @private
     */
    applyCompactStyle_(style: number): void;
    /**
     * Parses text string to produce a Number.
     *
     * This method attempts to parse text starting from position "opt_pos" if it
     * is given. Otherwise the parse will start from the beginning of the text.
     * When opt_pos presents, opt_pos will be updated to the character next to where
     * parsing stops after the call. If an error occurs, opt_pos won't be updated.
     *
     * @param {string} text The string to be parsed.
     * @param {Array<number>=} opt_pos Position to pass in and get back.
     * @return {number} Parsed number. This throws an error if the text cannot be
     *     parsed.
     */
    parse(text: string, opt_pos?: number[] | undefined): number;
    /**
     * This function will parse a "localized" text into a Number. It needs to
     * handle locale specific decimal, grouping, exponent and digits.
     *
     * @param {string} text The text that need to be parsed.
     * @param {Array<number>} pos  In/out parsing position. In case of failure,
     *    pos value won't be changed.
     * @return {number} Number value, or NaN if nothing can be parsed.
     * @private
     */
    parseNumber_(text: string, pos: number[]): number;
    /**
     * Formats a Number to produce a string.
     *
     * @param {number} number The Number to be formatted.
     * @return {string} The formatted number string.
     */
    format(number: number): string;
    /**
     * Round a number into an integer and fractional part
     * based on the rounding rules for this NumberFormat.
     * @param {number} number The number to round.
     * @return {{intValue: number, fracValue: number}} The integer and fractional
     *     part after rounding.
     * @private
     * @suppress {checkTypes}
     */
    roundNumber_(number: number): {
        intValue: number;
        fracValue: number;
    };
    /**
     * Formats a number with the appropriate groupings when there are repeating
     * digits present. Repeating digits exists when the length of the digits left
     * of the decimal place exceeds the number of non-repeating digits.
     *
     * Formats a number by iterating through the integer number (intPart) from the
     * most left of the decimal place by inserting the appropriate number grouping
     * separator for the repeating digits until all of the repeating digits is
     * iterated. Then iterate through the non-repeating digits by inserting the
     * appropriate number grouping separator until all the non-repeating digits
     * is iterated through.
     *
     * In the number grouping concept, anything left of the decimal
     * place is followed by non-repeating digits and then repeating digits. If the
     * pattern is #,##,###, then we first (from the left of the decimal place) have
     * a non-repeating digit of size 3 followed by repeating digits of size 2
     * separated by a thousand separator. If the length of the digits are six or
     * more, there may be repeating digits required. For example, the value of
     * 12345678 would format as 1,23,45,678 where the repeating digit is length 2.
     *
     * @param {!Array<string>} parts An array to build the 'parts' of the formatted
     *  number including the values and separators.
     * @param {number} zeroCode The value of the zero digit whether or not
     *  NumberFormat.enforceAsciiDigits_ is enforced.
     * @param {string} intPart The integer representation of the number to be
     *  formatted and referenced.
     * @param {!Array<number>} groupingArray The array of numbers to determine the
     *  grouping of repeated and non-repeated digits.
     * @param {number} repeatedDigitLen The length of the repeated digits left of
     *  the non-repeating digits left of the decimal.
     * @return {!Array<string>} Returns the resulting parts variable containing
     *  how numbers are to be grouped and appear.
     * @private
     */
    formatNumberGroupingRepeatingDigitsParts_(parts: string[], zeroCode: number, intPart: string, groupingArray: number[], repeatedDigitLen: number): string[];
    /**
     * Formats a number with the appropriate groupings when there are no repeating
     * digits present. Non-repeating digits exists when the length of the digits
     * left of the decimal place is equal or lesser than the length of
     * non-repeating digits.
     *
     * Formats a number by iterating through the integer number (intPart) from the
     * right most non-repeating number group of the decimal place. For each group,
     * inserting the appropriate number grouping separator for the non-repeating
     * digits until the number is completely iterated.
     *
     * In the number grouping concept, anything left of the decimal
     * place is followed by non-repeating digits and then repeating digits. If the
     * pattern is #,##,###, then we first (from the left of the decimal place) have
     * a non-repeating digit of size 3 followed by repeating digits of size 2
     * separated by a thousand separator. If the length of the digits are five or
     * less, there won't be any repeating digits required. For example, the value
     * of 12345 would be formatted as 12,345 where the non-repeating digit is of
     * length 3.
     *
     * @param {!Array<string>} parts An array to build the 'parts' of the formatted
     *  number including the values and separators.
     * @param {number} zeroCode The value of the zero digit whether or not
     *  NumberFormat.enforceAsciiDigits_ is enforced.
     * @param {string} intPart The integer representation of the number to be
     *  formatted and referenced.
     * @param {!Array<number>} groupingArray The array of numbers to determine the
     *  grouping of repeated and non-repeated digits.
     * @return {!Array<string>} Returns the resulting parts variable containing
     *  how numbers are to be grouped and appear.
     * @private
     */
    formatNumberGroupingNonRepeatingDigitsParts_(parts: string[], zeroCode: number, intPart: string, groupingArray: number[]): string[];
    /**
     * Formats a Number in fraction format.
     *
     * @param {number} number
     * @param {number} minIntDigits Minimum integer digits.
     * @param {Array<string>} parts
     *     This array holds the pieces of formatted string.
     *     This function will add its formatted pieces to the array.
     * @private
     */
    subformatFixed_(number: number, minIntDigits: number, parts: string[]): void;
    /**
     * Formats exponent part of a Number.
     *
     * @param {number} exponent Exponential value.
     * @param {Array<string>} parts The array that holds the pieces of formatted
     *     string. This function will append more formatted pieces to the array.
     * @private
     */
    addExponentPart_(exponent: number, parts: string[]): void;
    /**
     * Returns the mantissa for the given value and its exponent.
     *
     * @param {number} value
     * @param {number} exponent
     * @return {number}
     * @private
     */
    getMantissa_(value: number, exponent: number): number;
    /**
     * Formats Number in exponential format.
     *
     * @param {number} number Value need to be formatted.
     * @param {Array<string>} parts The array that holds the pieces of formatted
     *     string. This function will append more formatted pieces to the array.
     * @private
     */
    subformatExponential_(number: number, parts: string[]): void;
    /**
     * Returns the digit value of current character. The character could be either
     * '0' to '9', or a locale specific digit.
     *
     * @param {string} ch Character that represents a digit.
     * @return {number} The digit value, or -1 on error.
     * @private
     */
    getDigit_(ch: string): number;
    /**
     * Parses affix part of pattern.
     *
     * @param {string} pattern Pattern string that need to be parsed.
     * @param {Array<number>} pos One element position array to set and receive
     *     parsing position.
     *
     * @return {string} Affix received from parsing.
     * @private
     */
    parseAffix_(pattern: string, pos: number[]): string;
    /**
     * Parses the trunk part of a pattern.
     *
     * @param {string} pattern Pattern string that need to be parsed.
     * @param {Array<number>} pos One element position array to set and receive
     *     parsing position.
     * @private
     */
    parseTrunk_(pattern: string, pos: number[]): void;
    /**
     * Get compact unit for a certain number of digits
     *
     * @param {number} base The number of digits to get the unit for.
     * @param {string} plurality The plurality of the number.
     * @return {!NumberFormat.CompactNumberUnit} The compact unit.
     * @private
     * @suppress {checkTypes}
     */
    getUnitFor_(base: number, plurality: string): {
        prefix: string;
        suffix: string;
        divisorBase: number;
    };
    /**
     * Get the compact unit divisor, accounting for rounding of the quantity.
     *
     * @param {number} formattingNumber The number to base the formatting on. The
     *     unit will be calculated from this number.
     * @param {number} pluralityNumber The number to use for calculating the
     *     plurality.
     * @return {!NumberFormat.CompactNumberUnit} The unit after rounding.
     * @private
     */
    getUnitAfterRounding_(formattingNumber: number, pluralityNumber: number): {
        prefix: string;
        suffix: string;
        divisorBase: number;
    };
    /**
     * Get the integer base 10 logarithm of a number.
     *
     * @param {number} number The number to log.
     * @return {number} The lowest integer n such that 10^n >= number.
     * @private
     */
    intLog10_(number: number): number;
    /**
     * Round to a certain number of significant digits.
     *
     * @param {number} number The number to round.
     * @param {number} significantDigits The number of significant digits
     *     to round to.
     * @param {number} scale Treat number as fixed point times 10^scale.
     * @return {number} The rounded number.
     * @private
     */
    roundToSignificantDigits_(number: number, significantDigits: number, scale: number): number;
    /**
     * Get the plural form of a number.
     * @param {number} quantity The quantity to find plurality of.
     * @return {string} One of 'zero', 'one', 'two', 'few', 'many', 'other'.
     * @private
     */
    pluralForm_(quantity: number): string;
    /**
     * Checks if the currency symbol comes before the value ($12) or after (12$)
     * Handy for applications that need to have separate UI fields for the currency
     * value and symbol, especially for input: Price: [USD] [123.45]
     * The currency symbol might be a combo box, or a label.
     *
     * @return {boolean} true if currency is before value.
     */
    isCurrencyCodeBeforeValue(): boolean;
}
export namespace NumberFormat {
    export namespace CompactStyle {
        export const NONE: number;
        export const SHORT: number;
        export const LONG: number;
    }
    /**
     * Compacting styles.
     */
    export type CompactStyle = number;
    export const enforceAsciiDigits_: boolean;
    export const PATTERN_ZERO_DIGIT_: string;
    export const PATTERN_GROUPING_SEPARATOR_: string;
    export const PATTERN_DECIMAL_SEPARATOR_: string;
    export const PATTERN_PER_MILLE_: string;
    export const PATTERN_PERCENT_: string;
    export const PATTERN_DIGIT_: string;
    export const PATTERN_SEPARATOR_: string;
    export const PATTERN_EXPONENT_: string;
    export const PATTERN_PLUS_: string;
    export const PATTERN_CURRENCY_SIGN_: string;
    export const QUOTE_: string;
    export namespace NULL_UNIT_ {
        export const prefix: string;
        export const suffix: string;
        export const divisorBase: number;
    }
    /**
     * Alias for the compact format 'unit' object.
     */
    export type CompactNumberUnit = {
        prefix: string;
        suffix: string;
        divisorBase: number;
    };
}
