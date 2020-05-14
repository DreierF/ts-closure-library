/**
 * Enumeration of `CSSRule` types.
 */
export type CssRuleType = number;
export namespace CssRuleType {
    export const STYLE: number;
    export const IMPORT: number;
    export const MEDIA: number;
    export const FONT_FACE: number;
    export const PAGE: number;
    export const NAMESPACE: number;
}
/**
 * Cross browser function to add a CSSRule into a StyleSheet, optionally
 * at a given index.
 * @param {?StyleSheet} cssStyleSheet The CSSRule's parentStyleSheet.
 * @param {string} cssText The text for the new CSSRule.
 * @param {number=} opt_index The index of the cssRule in its parentStylesheet.
 * @throws {Error} If the css rule text appears to be ill-formatted.
 * TODO(bowdidge): Inserting at index 0 fails on Firefox 2 and 3 with an
 *     exception warning "Node cannot be inserted at the specified point in
 *     the hierarchy."
 */
export function addCssRule(cssStyleSheet: StyleSheet | null, cssText: string, opt_index?: number | undefined): void;
/**
 * Appends a DOM node to HEAD containing the css text that's passed in.
 * @param {string} cssText CSS to add to the end of the document.
 * @param {DomHelper=} opt_domHelper Optional DOM helper user for
 *     document interactions.
 * @return {!Element} The newly created STYLE element.
 */
export function addCssText(cssText: string, opt_domHelper?: DomHelper | undefined): Element;
/**
 * Recursively gets all CSSStyleRules, optionally starting from a given
 * StyleSheet.
 * Note that this excludes any CSSImportRules, CSSMediaRules, etc..
 * @param {(StyleSheet|StyleSheetList)=} opt_styleSheet
 * @return {!Array<CSSStyleRule>} A list of CSSStyleRules.
 */
export function getAllCssStyleRules(opt_styleSheet?: (StyleSheet | StyleSheetList) | undefined): Array<CSSStyleRule>;
/**
 * Gets all StyleSheet objects starting from some StyleSheet. Note that we
 * want to return the sheets in the order of the cascade, therefore if we
 * encounter an import, we will splice that StyleSheet object in front of
 * the StyleSheet that contains it in the returned array of StyleSheets.
 * @param {(StyleSheet|StyleSheetList)=} opt_styleSheet A StyleSheet.
 * @param {boolean=} opt_includeDisabled If true, includes disabled stylesheets,
 *    defaults to false.
 * @return {!Array<StyleSheet>} A list of StyleSheet objects.
 * @suppress {strictMissingProperties} StyleSheet does not define cssRules
 */
export function getAllCssStyleSheets(opt_styleSheet?: (StyleSheet | StyleSheetList) | undefined, opt_includeDisabled?: boolean | undefined): Array<StyleSheet>;
/**
 * Recursively gets all CSS as text, optionally starting from a given
 * StyleSheet.
 * @param {(StyleSheet|StyleSheetList)=} opt_styleSheet
 * @return {string} css text.
 */
export function getAllCssText(opt_styleSheet?: (StyleSheet | StyleSheetList) | undefined): string;
/**
 * Get the index of the CSSRule in it's StyleSheet.
 * @param {?CSSRule} cssRule A CSSRule.
 * @param {StyleSheet=} opt_parentStyleSheet A reference to the stylesheet
 *     object this cssRule belongs to.
 * @throws {Error} When we cannot get the parentStyleSheet.
 * @return {number} The index of the CSSRule, or -1.
 */
export function getCssRuleIndexInParentStyleSheet(cssRule: CSSRule | null, opt_parentStyleSheet?: StyleSheet | undefined): number;
/**
 * Returns the CSSRules from a styleSheet.
 * Worth noting here is that IE and FF differ in terms of what they will return.
 * Firefox will return styleSheet.cssRules, which includes ImportRules and
 * anything which implements the CSSRules interface. IE returns simply a list of
 * CSSRules.
 * @param {?StyleSheet} styleSheet
 * @throws {Error} If we cannot access the rules on a stylesheet object - this
 *     can  happen if a stylesheet object's rules are accessed before the rules
 *     have been downloaded and parsed and are "ready".
 * @return {?CSSRuleList} An array of CSSRules or null.
 * @suppress {strictMissingProperties} StyleSheet does not define cssRules
 */
export function getCssRulesFromStyleSheet(styleSheet: StyleSheet | null): CSSRuleList | null;
/**
 * Gets the cssText from a CSSRule object cross-browserly.
 * @param {?CSSRule} cssRule A CSSRule.
 * @return {string} cssText The text for the rule, including the selector.
 */
export function getCssTextFromCssRule(cssRule: CSSRule | null): string;
/**
 * Cross browser method to get the filename from the StyleSheet's href.
 * Explorer only returns the filename in the href, while other agents return
 * the full path.
 * @param {!StyleSheet} styleSheet Any valid StyleSheet object with an href.
 * @throws {Error} When there's no href property found.
 * @return {?string} filename The filename, or null if not an external
 *    styleSheet.
 */
export function getFileNameFromStyleSheet(styleSheet: StyleSheet): string | null;
/**
 * We do some trickery in getAllCssStyleRules that hacks this in for IE.
 * If the cssRule object isn't coming from a result of that function call, this
 * method will return undefined in IE.
 * @param {?CSSRule} cssRule The CSSRule.
 * @return {?StyleSheet} A styleSheet object.
 */
export function getParentStyleSheet(cssRule: CSSRule | null): StyleSheet | null;
/**
 * Cross browser function to remove a CSSRule in a StyleSheet at an index.
 * @param {?StyleSheet} cssStyleSheet The CSSRule's parentStyleSheet.
 * @param {number} index The CSSRule's index in the parentStyleSheet.
 */
export function removeCssRule(cssStyleSheet: StyleSheet | null, index: number): void;
/**
 * Replace a cssRule with some cssText for a new rule.
 * If the cssRule object is not one of objects returned by
 * getAllCssStyleRules, then you'll need to provide both the styleSheet and
 * possibly the index, since we can't infer them from the standard cssRule
 * object in IE. We do some trickery in getAllCssStyleRules to hack this in.
 * @param {?CSSRule} cssRule A CSSRule.
 * @param {string} cssText The text for the new CSSRule.
 * @param {StyleSheet=} opt_parentStyleSheet A reference to the stylesheet
 *     object this cssRule belongs to.
 * @param {number=} opt_index The index of the cssRule in its parentStylesheet.
 * @throws {Error} If we cannot find a parentStyleSheet.
 * @throws {Error} If we cannot find a css rule index.
 */
export function replaceCssRule(cssRule: CSSRule | null, cssText: string, opt_parentStyleSheet?: StyleSheet | undefined, opt_index?: number | undefined): void;
import { DomHelper } from "../dom/dom.js";
