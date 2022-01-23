import {ArrayMatcher} from './arraymatcher.js';
import {AutoComplete} from './autocomplete.js';
import {InputHandler} from './inputhandler.js';
import {Renderer} from './renderer.js';
/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview Utility methods supporting the autocomplete package.
 *
 * @see ../../demos/autocomplete-basic.html
 */

/**
 * Factory function for building a basic autocomplete widget that autocompletes
 * an inputbox or text area from a data array.
 * @param {Array<?>} data Data array.
 * @param {Element} input Input element or text area.
 * @param {boolean=} opt_multi Whether to allow multiple entries separated with
 *     semi-colons or commas.
 * @param {boolean=} opt_useSimilar use similar matches. e.g. "gost" => "ghost".
 * @return {!AutoComplete} A new autocomplete object.
 */
function createSimpleAutoComplete(
    data, input, opt_multi, opt_useSimilar) {
  var matcher = new ArrayMatcher(data, !opt_useSimilar);
  var renderer = new Renderer();
  var inputHandler = new InputHandler(null, null, !!opt_multi);

  var autoComplete =
      new AutoComplete(matcher, renderer, inputHandler);
  inputHandler.attachAutoComplete(autoComplete);
  inputHandler.attachInputs(input);
  return autoComplete;
};

export {createSimpleAutoComplete};