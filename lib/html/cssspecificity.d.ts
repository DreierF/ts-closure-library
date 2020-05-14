/**
 * Calculates the specificity of CSS selectors, using a global cache if
 * supported.
 * @see http://www.w3.org/TR/css3-selectors/#specificity
 * @see https://specificity.keegan.st/
 * @param {string} selector The CSS selector.
 * @return {!Array<number>} The CSS specificity.
 * @supported IE9+, other browsers.
 */
export function getSpecificity(selector: string): Array<number>;
