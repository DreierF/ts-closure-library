import * as strings from './../../string/string.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Basic class for matching words in an array.
 */

/**
 * Basic class for matching words in an array
 *     have a toString method that returns the value to match against.
 *     input token against the dictionary.
 */
class ArrayMatcher {

  /**
   * Basic class for matching words in an array
   * @param {Array<?>} rows Dictionary of items to match.  Can be objects if they
   *     have a toString method that returns the value to match against.
   * @param {boolean=} opt_noSimilar if true, do not do similarity matches for the
   *     input token against the dictionary.
   */
  constructor(rows, opt_noSimilar) {
    /** @type {!Array<?>} */
    this.rows_ = rows || [];
    this.useSimilar_ = !opt_noSimilar;
  }

  /**
   * Replaces the rows that this object searches over.
   * @param {Array<?>} rows Dictionary of items to match.
   */
  setRows(rows) {
    this.rows_ = rows || [];
  };

  /**
   * Function used to pass matches to the autocomplete
   * @param {string} token Token to match.
   * @param {number} maxMatches Max number of matches to return.
   * @param {Function} matchHandler callback to execute after matching.
   * @param {string=} opt_fullString The full string from the input box.
   */
  requestMatchingRows(
      token, maxMatches, matchHandler, opt_fullString) {
    var matches = this.useSimilar_ ?
        ArrayMatcher.getMatchesForRows(token, maxMatches, this.rows_) :
        this.getPrefixMatches(token, maxMatches);
  
    matchHandler(token, matches);
  };

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
  static getMatchesForRows(token, maxMatches, rows) {
    var matches =
        ArrayMatcher.getPrefixMatchesForRows(token, maxMatches, rows);
  
    if (matches.length == 0) {
      matches = ArrayMatcher.getSimilarMatchesForRows(
          token, maxMatches, rows);
    }
    return matches;
  };

  /**
   * Matches the token against the start of words in the row.
   * @param {string} token Token to match.
   * @param {number} maxMatches Max number of matches to return.
   * @return {!Array<?>} Rows that match.
   */
  getPrefixMatches(
      token, maxMatches) {
    return ArrayMatcher.getPrefixMatchesForRows(
        token, maxMatches, this.rows_);
  };

  /**
   * Matches the token against the start of words in the row.
   * @param {string} token Token to match.
   * @param {number} maxMatches Max number of matches to return.
   * @param {!Array<?>} rows Rows to search for matches. Can be objects if they
   * have
   *     a toString method that returns the value to match against.
   * @return {!Array<?>} Rows that match.
   */
  static getPrefixMatchesForRows(
      token, maxMatches, rows) {
    var matches = [];
  
    if (token != '') {
      var escapedToken = strings.regExpEscape(token);
      var matcher = new RegExp('(^|\\W+)' + escapedToken, 'i');
  
      for (var i = 0; i < rows.length && matches.length < maxMatches; i++) {
        var row = rows[i];
        if (String(row).match(matcher)) {
          matches.push(row);
        }
      }
    }
    return matches;
  };

  /**
   * Matches the token against similar rows, by calculating "distance" between the
   * terms.
   * @param {string} token Token to match.
   * @param {number} maxMatches Max number of matches to return.
   * @return {!Array<?>} The best maxMatches rows.
   */
  getSimilarRows(token, maxMatches) {
    return ArrayMatcher.getSimilarMatchesForRows(
        token, maxMatches, this.rows_);
  };

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
  static getSimilarMatchesForRows(
      token, maxMatches, rows) {
    var results = [];
  
    for (var index = 0; index < rows.length; index++) {
      var row = rows[index];
      var str = token.toLowerCase();
      var txt = String(row).toLowerCase();
      var score = 0;
  
      if (txt.indexOf(str) != -1) {
        score = parseInt((txt.indexOf(str) / 4).toString(), 10);
  
      } else {
        var arr = str.split('');
  
        var lastPos = -1;
        var penalty = 10;
  
        for (var i = 0, c; c = arr[i]; i++) {
          var pos = txt.indexOf(c);
  
          if (pos > lastPos) {
            var diff = pos - lastPos - 1;
  
            if (diff > penalty - 5) {
              diff = penalty - 5;
            }
  
            score += diff;
  
            lastPos = pos;
          } else {
            score += penalty;
            penalty += 5;
          }
        }
      }
  
      if (score < str.length * 6) {
        results.push({str: row, score: score, index: index});
      }
    }
  
    results.sort(function(a, b) {
      var diff = a.score - b.score;
      if (diff != 0) {
        return diff;
      }
      return a.index - b.index;
    });
  
    var matches = [];
    for (var i = 0; i < maxMatches && i < results.length; i++) {
      matches.push(results[i].str);
    }
  
    return matches;
  };
}

export {ArrayMatcher};