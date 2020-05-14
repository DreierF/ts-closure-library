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
     * Matches the token against the specified rows, first looking for prefix
     * matches and if that fails, then looking for similar matches.
     *
     * @param {string} token Token to match.
     * @param {number} maxMatches Max number of matches to return.
     * @param {!Array<?>} rows Rows to search for matches. Can be objects if they
     *     have a toString method that returns the value to match against.
     * @return {!Array<?>} Rows that match.
     */
    static getMatchesForRows(token: string, maxMatches: number, rows: Array<unknown>): Array<unknown>;
    /**
     * Matches the token against the start of words in the row.
     * @param {string} token Token to match.
     * @param {number} maxMatches Max number of matches to return.
     * @param {!Array<?>} rows Rows to search for matches. Can be objects if they
     * have
     *     a toString method that returns the value to match against.
     * @return {!Array<?>} Rows that match.
     */
    static getPrefixMatchesForRows(token: string, maxMatches: number, rows: Array<unknown>): Array<unknown>;
    /**
     * Matches the token against similar rows, by calculating "distance" between the
     * terms.
     * @param {string} token Token to match.
     * @param {number} maxMatches Max number of matches to return.
     * @param {!Array<?>} rows Rows to search for matches. Can be objects
     *     if they have a toString method that returns the value to
     *     match against.
     * @return {!Array<?>} The best maxMatches rows.
     */
    static getSimilarMatchesForRows(token: string, maxMatches: number, rows: Array<unknown>): Array<unknown>;
    /**
     * Basic class for matching words in an array
     * @param {Array<?>} rows Dictionary of items to match.  Can be objects if they
     *     have a toString method that returns the value to match against.
     * @param {boolean=} opt_noSimilar if true, do not do similarity matches for the
     *     input token against the dictionary.
     */
    constructor(rows: Array<unknown>, opt_noSimilar?: boolean | undefined);
    rows_: any[];
    useSimilar_: boolean;
    /**
     * Replaces the rows that this object searches over.
     * @param {Array<?>} rows Dictionary of items to match.
     */
    setRows(rows: Array<unknown>): void;
    /**
     * Function used to pass matches to the autocomplete
     * @param {string} token Token to match.
     * @param {number} maxMatches Max number of matches to return.
     * @param {?Function} matchHandler callback to execute after matching.
     * @param {string=} opt_fullString The full string from the input box.
     */
    requestMatchingRows(token: string, maxMatches: number, matchHandler: Function | null, opt_fullString?: string | undefined): void;
    /**
     * Matches the token against the start of words in the row.
     * @param {string} token Token to match.
     * @param {number} maxMatches Max number of matches to return.
     * @return {!Array<?>} Rows that match.
     */
    getPrefixMatches(token: string, maxMatches: number): Array<unknown>;
    /**
     * Matches the token against similar rows, by calculating "distance" between the
     * terms.
     * @param {string} token Token to match.
     * @param {number} maxMatches Max number of matches to return.
     * @return {!Array<?>} The best maxMatches rows.
     */
    getSimilarRows(token: string, maxMatches: number): Array<unknown>;
}
