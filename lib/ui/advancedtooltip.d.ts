/**
 * @fileoverview Advanced tooltip widget implementation.
 *
 * @see ../demos/advancedtooltip.html
 */
/**
 * Advanced tooltip widget with cursor tracking abilities. Works like a regular
 * tooltip but can track the cursor position and direction to determine if the
 * tooltip should be dismissed or remain open.
 *
 *     element reference or string id.
 * @extends {Tooltip}
 */
export class AdvancedTooltip extends Tooltip {
    /**
     * Advanced tooltip widget with cursor tracking abilities. Works like a regular
     * tooltip but can track the cursor position and direction to determine if the
     * tooltip should be dismissed or remain open.
     *
     * @param {Element|string=} opt_el Element to display tooltip for, either
     *     element reference or string id.
     * @param {?string=} opt_str Text message to display in tooltip.
     * @param {DomHelper=} opt_domHelper Optional DOM helper.
     */
    constructor(opt_el?: string | Element | undefined, opt_str?: string | null | undefined, opt_domHelper?: DomHelper | undefined);
    /**
     * Whether to track the cursor and thereby close the tooltip if it moves away
     * from the tooltip and keep it open if it moves towards it.
     *
     * @type {boolean}
     * @private
     */
    cursorTracking_: boolean;
    /**
     * Delay in milliseconds before tooltips are hidden if cursor tracking is
     * enabled and the cursor is moving away from the tooltip.
     *
     * @type {number}
     * @private
     */
    cursorTrackingHideDelayMs_: number;
    /**
     * Box object representing a margin around the tooltip where the cursor is
     * allowed without dismissing the tooltip.
     *
     * @type {?Box}
     * @private
     */
    hotSpotPadding_: Box | null;
    /**
     * Bounding box.
     *
     * @type {?Box}
     * @private
     */
    boundingBox_: Box | null;
    /**
     * Anchor bounding box.
     *
     * @type {?Box}
     * @private
     */
    anchorBox_: Box | null;
    /**
     * Whether the cursor tracking is active.
     *
     * @type {boolean}
     * @private
     */
    tracking_: boolean;
    /**
     * Sets margin around the tooltip where the cursor is allowed without dismissing
     * the tooltip.
     *
     * @param {Box=} opt_box The margin around the tooltip.
     */
    setHotSpotPadding(opt_box?: Box | undefined): void;
    /**
     * @return {?Box} box The margin around the tooltip where the cursor is
     *     allowed without dismissing the tooltip.
     */
    getHotSpotPadding(): Box | null;
    /**
     * Sets whether to track the cursor and thereby close the tooltip if it moves
     * away from the tooltip and keep it open if it moves towards it.
     *
     * @param {boolean} b Whether to track the cursor.
     */
    setCursorTracking(b: boolean): void;
    /**
     * @return {boolean} Whether to track the cursor and thereby close the tooltip
     *     if it moves away from the tooltip and keep it open if it moves towards
     *     it.
     */
    getCursorTracking(): boolean;
    /**
     * Sets delay in milliseconds before tooltips are hidden if cursor tracking is
     * enabled and the cursor is moving away from the tooltip.
     *
     * @param {number} delay The delay in milliseconds.
     */
    setCursorTrackingHideDelayMs(delay: number): void;
    /**
     * @return {number} The delay in milliseconds before tooltips are hidden if
     *     cursor tracking is enabled and the cursor is moving away from the
     *     tooltip.
     */
    getCursorTrackingHideDelayMs(): number;
    /**
     * Returns true if the mouse is in the tooltip.
     * @return {boolean} True if the mouse is in the tooltip.
     */
    isMouseInTooltip(): boolean;
    /**
     * Checks if supplied coordinate is in the tooltip, its triggering anchor, or
     * a tooltip that has been triggered by a child of this tooltip.
     * Called from handleMouseMove to determine if hide timer should be started,
     * and from maybeHide to determine if tooltip should be hidden.
     * @param {?Coordinate} coord Coordinate being tested.
     * @return {boolean} Whether coordinate is in the anchor, the tooltip, or any
     *     tooltip whose anchor is a child of this tooltip.
     * @private
     */
    isCoordinateActive_(coord: Coordinate | null): boolean;
    /**
     * Forces the recalculation of the hotspot on the next mouse over event.
     * @deprecated Not ever necessary to call this function. Hot spot is calculated
     *     as necessary.
     */
    resetHotSpot(): void;
    actualEventTarget_: AdvancedTooltip;
}
import { Tooltip } from "./tooltip.js";
import { Box } from "../math/box.js";
import { Coordinate } from "../math/coordinate.js";
import { DomHelper } from "../dom/dom.js";
