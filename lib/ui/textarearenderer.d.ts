/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Native browser textarea renderer for {@link UiTextarea}s.
 * @suppress {strictMissingProperties} legacy accesses off type 'Element'
 */
/**
 * Renderer for {@link UiTextarea}s.  Renders and decorates native HTML
 * textarea elements.  Since native HTML textareas have built-in support for
 * many features, overrides many expensive (and redundant) superclass methods to
 * be no-ops.
 * @extends {ControlRenderer<UiTextarea>}
 */
export class TextareaRenderer extends ControlRenderer<UiTextarea> {
    /** @override @return {!TextareaRenderer} @suppress {checkTypes} */
    static getInstance(): TextareaRenderer;
    /**
     * Sets up the textarea control such that it doesn't waste time adding
     * functionality that is already natively supported by browser
     * textareas.
     * @param {?Control} textarea Textarea control to configure.
     * @private
     */
    private setUpTextarea_;
}
export namespace TextareaRenderer {
    const instance_: TextareaRenderer | null;
    const CSS_CLASS: string;
}
import { Textarea as UiTextarea } from "./textarea.js";
import { ControlRenderer } from "./control.js";
