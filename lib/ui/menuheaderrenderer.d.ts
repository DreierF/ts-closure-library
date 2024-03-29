/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Renderer for {@link UiMenuHeader}s.
 */
/**
 * Renderer for menu headers.
 * @extends {ControlRenderer<UiMenuHeader>}
 */
export class MenuHeaderRenderer extends ControlRenderer<UiMenuHeader> {
    /** @override @return {!MenuHeaderRenderer} @suppress {checkTypes} */
    static getInstance(): MenuHeaderRenderer;
}
export namespace MenuHeaderRenderer {
    const instance_: MenuHeaderRenderer | null;
    const CSS_CLASS: string;
}
import { MenuHeader as UiMenuHeader } from "./menuheader.js";
import { ControlRenderer } from "./control.js";
