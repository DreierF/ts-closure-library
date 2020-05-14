/**
 * @fileoverview Helper object used by modal elements to control aria
 * visibility of the rest of the page.
 */
/**
 * Helper object to control aria visibility of the rest of the page (background)
 * for a given element. Example usage is to restrict screenreader focus to
 * a modal popup while it is visible.
 *
 * WARNING: This will work only if the element is rendered directly in the
 * 'body' element.
 *
 */
export class ModalAriaVisibilityHelper {
    /**
     * Helper object to control aria visibility of the rest of the page (background)
     * for a given element. Example usage is to restrict screenreader focus to
     * a modal popup while it is visible.
     *
     * WARNING: This will work only if the element is rendered directly in the
     * 'body' element.
     *
     * @param {!Element} element The given element.
     * @param {!DomHelper} domHelper DomHelper for the page.
     */
    constructor(element: Element, domHelper: DomHelper);
    /**
     * The elements set to aria-hidden when the popup was made visible.
     * @type {Array<!Element>}
     * @private
     */
    private hiddenElements_;
    /**
     * @private {!Element}
     */
    private element_;
    /**
     * @private {!DomHelper}
     */
    private dom_;
    /**
     * Sets aria-hidden on the rest of the page to restrict screen reader focus.
     * Top-level elements with an explicit aria-hidden state are not altered.
     * @param {boolean} hide Whether to hide or show the rest of the page.
     */
    setBackgroundVisibility(hide: boolean): void;
}
import { DomHelper } from "../dom/dom.js";
