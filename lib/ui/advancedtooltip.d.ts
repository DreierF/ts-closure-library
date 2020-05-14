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
     * @param {?Element|string=} opt_el Element to display tooltip for, either
     *     element reference or string id.
     * @param {?string=} opt_str Text message to display in tooltip.
     * @param {DomHelper=} opt_domHelper Optional DOM helper.
     */
    constructor(opt_el?: ((Element | string) | null) | undefined, opt_str?: (string | null) | undefined, opt_domHelper?: DomHelper | undefined);
    /**
     * Whether to track the cursor and thereby close the tooltip if it moves away
     * from the tooltip and keep it open if it moves towards it.
     *
     * @type {boolean}
     * @private
     */
    private cursorTracking_;
    /**
     * Delay in milliseconds before tooltips are hidden if cursor tracking is
     * enabled and the cursor is moving away from the tooltip.
     *
     * @type {number}
     * @private
     */
    private cursorTrackingHideDelayMs_;
    /**
     * Box object representing a margin around the tooltip where the cursor is
     * allowed without dismissing the tooltip.
     *
     * @type {?Box}
     * @private
     */
    private hotSpotPadding_;
    /**
     * Bounding box.
     *
     * @type {?Box}
     * @private
     */
    private boundingBox_;
    /**
     * Anchor bounding box.
     *
     * @type {?Box}
     * @private
     */
    private anchorBox_;
    /**
     * Whether the cursor tracking is active.
     *
     * @type {boolean}
     * @private
     */
    private tracking_;
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
    private isCoordinateActive_;
    /**
     * Forces the recalculation of the hotspot on the next mouse over event.
     * @deprecated Not ever necessary to call this function. Hot spot is calculated
     *     as necessary.
     */
    resetHotSpot(): void;
}
import { Tooltip } from "./tooltip.js";
import { Box } from "../math/box.js";
import { DomHelper } from "../dom/dom.js";
