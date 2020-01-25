/**
 * @fileoverview Basic class for matching words in an array.
 */
/**
 * Basic class for matching words in an array
 *     have a toString method that returns the value to match against.
 *     input token against the dictionary.
 */
export class ArrayMatcher {
    /**
     * Basic class for matching words in an array
     * @param {Array<?>} rows Dictionary of items to match.  Can be objects if they
     *     have a toString method that returns the value to match against.
     * @param {boolean=} opt_noSimilar if true, do not do similarity matches for the
     *     input token against the dictionary.
     */
    constructor(rows: any[], opt_noSimilar?: boolean);
    rows_: any[];
    useSimilar_: boolean;
    /**
     * Replaces the rows that this object searches over.
     * @param {Array<?>} rows Dictionary of items to match.
     */
    setRows(rows: any[]): void;
    /**
     * Function used to pass matches to the autocomplete
     * @param {string} token Token to match.
     * @param {number} maxMatches Max number of matches to return.
     * @param {?Function} matchHandler callback to execute after matching.
     * @param {string=} opt_fullString The full string from the input box.
     */
    requestMatchingRows(token: string, maxMatches: number, matchHandler: Function, opt_fullString?: string): void;
    /**
     * Matches the token against the start of words in the row.
     * @param {string} token Token to match.
     * @param {number} maxMatches Max number of matches to return.
     * @return {!Array<?>} Rows that match.
     */
    getPrefixMatches(token: string, maxMatches: number): any[];
    /**
     * Matches the token against similar rows, by calculating "distance" between the
     * terms.
     * @param {string} token Token to match.
     * @param {number} maxMatches Max number of matches to return.
     * @return {!Array<?>} The best maxMatches rows.
     */
    getSimilarRows(token: string, maxMatches: number): any[];
}
export namespace ArrayMatcher { }
