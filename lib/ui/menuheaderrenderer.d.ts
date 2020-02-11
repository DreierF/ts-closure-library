/**
 * @fileoverview Renderer for {@link UiMenuHeader}s.
 */
/**
 * Renderer for menu headers.
 * @extends {ControlRenderer<UiMenuHeader>}
 */
export class MenuHeaderRenderer extends ControlRenderer<UiMenuHeader> {
}
export namespace MenuHeaderRenderer {
    export const instance_: MenuHeaderRenderer | null;
    export const CSS_CLASS: string;
}
import { MenuHeader as UiMenuHeader } from "./menuheader.js";
import { ControlRenderer } from "./control.js";
