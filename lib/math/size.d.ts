/**
 * @fileoverview A utility class for representing two-dimensional sizes.
 */
/**
 * Class for representing sizes consisting of a width and height. Undefined
 * width and height support is deprecated and results in compiler warning.
 * @class
 */
export class Size {
    /**
     * Compares sizes for equality.
     * @param {?Size} a A Size.
     * @param {?Size} b A Size.
     * @return {boolean} True iff the sizes have equal widths and equal
     *     heights, or if both are null.
     */
    static equals(a: Size | null, b: Size | null): boolean;
    /**
     * Class for representing sizes consisting of a width and height. Undefined
     * width and height support is deprecated and results in compiler warning.
     * @param {number} width Width.
     * @param {number} height Height.
     */
    constructor(width: number, height: number);
    /**
     * Width
     * @type {number}
     */
    width: number;
    /**
     * Height
     * @type {number}
     */
    height: number;
    /**
     * @return {!Size} A new copy of the Size.
     */
    clone(): Size;
    /**
     * @return {number} The longer of the two dimensions in the size.
     */
    getLongest(): number;
    /**
     * @return {number} The shorter of the two dimensions in the size.
     */
    getShortest(): number;
    /**
     * @return {number} The area of the size (width * height).
     */
    area(): number;
    /**
     * @return {number} The perimeter of the size (width + height) * 2.
     */
    perimeter(): number;
    /**
     * @return {number} The ratio of the size's width to its height.
     */
    aspectRatio(): number;
    /**
     * @return {boolean} True if the size has zero area, false if both dimensions
     *     are non-zero numbers.
     */
    isEmpty(): boolean;
    /**
     * Clamps the width and height parameters upward to integer values.
     * @return {!Size} This size with ceil'd components.
     */
    ceil(): Size;
    /**
     * @param {!Size} target The target size.
     * @return {boolean} True if this Size is the same size or smaller than the
     *     target size in both dimensions.
     */
    fitsInside(target: Size): boolean;
    /**
     * Clamps the width and height parameters downward to integer values.
     * @return {!Size} This size with floored components.
     */
    floor(): Size;
    /**
     * Rounds the width and height parameters to integer values.
     * @return {!Size} This size with rounded components.
     */
    round(): Size;
    /**
     * Scales this size by the given scale factors. The width and height are scaled
     * by `sx` and `opt_sy` respectively.  If `opt_sy` is not
     * given, then `sx` is used for both the width and height.
     * @param {number} sx The scale factor to use for the width.
     * @param {number=} opt_sy The scale factor to use for the height.
     * @return {!Size} This Size object after scaling.
     */
    scale(sx: number, opt_sy?: number | undefined): Size;
    /**
     * Uniformly scales the size to perfectly cover the dimensions of a given size.
     * If the size is already larger than the target, it will be scaled down to the
     * minimum size at which it still covers the entire target. The original aspect
     * ratio will be preserved.
     *
     * This function assumes that both Sizes contain strictly positive dimensions.
     * @param {!Size} target The target size.
     * @return {!Size} This Size object, after optional scaling.
     */
    scaleToCover(target: Size): Size;
    /**
     * Uniformly scales the size to fit inside the dimensions of a given size. The
     * original aspect ratio will be preserved.
     *
     * This function assumes that both Sizes contain strictly positive dimensions.
     * @param {!Size} target The target size.
     * @return {!Size} This Size object, after optional scaling.
     */
    scaleToFit(target: Size): Size;
}
