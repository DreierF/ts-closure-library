/**
 * @fileoverview Utility methods supporting the autocomplete package.
 *
 * @see ../../demos/autocomplete-basic.html
 */
/**
 * Factory function for building a basic autocomplete widget that autocompletes
 * an inputbox or text area from a data array.
 * @param {Array<?>} data Data array.
 * @param {?Element} input Input element or text area.
 * @param {boolean=} opt_multi Whether to allow multiple entries separated with
 *     semi-colons or commas.
 * @param {boolean=} opt_useSimilar use similar matches. e.g. "gost" => "ghost".
 * @return {!AutoComplete} A new autocomplete object.
 */
export function createSimpleAutoComplete(data: Array<unknown>, input: Element | null, opt_multi?: boolean | undefined, opt_useSimilar?: boolean | undefined): AutoComplete;
import { AutoComplete } from "./autocomplete.js";
