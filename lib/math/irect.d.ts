/**
 * @fileoverview A record declaration to allow ClientRect and other rectangle
 * like objects to be used with goog.math.Rect.
 */
/**
 * Record for representing rectangular regions, allows compatibility between
 * things like ClientRect and goog.math.Rect.
 *
 * @interface
 */
export function IRect(): void;
export class IRect {
    /** @type {number} */
    left: number;
    /** @type {number} */
    top: number;
    /** @type {number} */
    width: number;
    /** @type {number} */
    height: number;
}
