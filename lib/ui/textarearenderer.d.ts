/**
 * @fileoverview Native browser textarea renderer for {@link UiTextarea}s.
 */
/**
 * Renderer for {@link UiTextarea}s.  Renders and decorates native HTML
 * textarea elements.  Since native HTML textareas have built-in support for
 * many features, overrides many expensive (and redundant) superclass methods to
 * be no-ops.
 * @extends {ControlRenderer<UiTextarea>}
 */
export class TextareaRenderer extends ControlRenderer<UiTextarea> {
    /** @override */
    getAriaRole(): any;
    /** @override */
    decorate(control: any, element: any): any;
    /**
     * Textareas natively support right-to-left rendering.
     * @override
     */
    setRightToLeft(): void;
    /**
     * Textareas are always focusable as long as they are enabled.
     * @override
     */
    isFocusable(textarea: any): any;
    /**
     * Textareas natively support keyboard focus.
     * @override
     */
    setFocusable(): void;
    /**
     * Textareas also expose the DISABLED state in the HTML textarea's
     * `disabled` attribute.
     * @override
     */
    setState(textarea: any, state: any, enable: any): void;
    /**
     * Textareas don't need ARIA states to support accessibility, so this is
     * a no-op.
     * @override
     */
    updateAriaState(): void;
    /**
     * Sets up the textarea control such that it doesn't waste time adding
     * functionality that is already natively supported by browser
     * textareas.
     * @param {?Control} textarea Textarea control to configure.
     * @private
     */
    setUpTextarea_(textarea: Control<any>): void;
    /** @override **/
    setContent(element: any, value: any): void;
}
export namespace TextareaRenderer {
    export const CSS_CLASS: string;
}
import { Textarea as UiTextarea } from "./textarea.js";
import { ControlRenderer } from "./control.js";
import { Control } from "./control.js";
