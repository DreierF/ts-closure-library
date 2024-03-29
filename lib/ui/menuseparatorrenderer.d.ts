/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Renderer for {@link UiMenuSeparator}s.
 */
/**
 * Renderer for menu separators.
 * @extends {ControlRenderer<UiMenuSeparator>}
 */
export class MenuSeparatorRenderer extends ControlRenderer<UiMenuSeparator> {
    /** @override @return {!MenuSeparatorRenderer} @suppress {checkTypes} */
    static getInstance(): MenuSeparatorRenderer;
}
export namespace MenuSeparatorRenderer {
    const instance_: MenuSeparatorRenderer | null;
    const CSS_CLASS: string;
}
import { MenuSeparator as UiMenuSeparator } from "./menuseparator.js";
import { ControlRenderer } from "./control.js";
