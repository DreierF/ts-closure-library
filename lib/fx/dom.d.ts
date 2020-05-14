/**
 * Provides a transformation of an elements background-color.
 *
 * Start and End should be 3D arrays representing R,G,B
 *
 * @extends {PredefinedEffect}
 * @class
 */
export class BgColorTransform extends PredefinedEffect {
    /**
     * Provides a transformation of an elements background-color.
     *
     * Start and End should be 3D arrays representing R,G,B
     *
     * @param {?Element} element Dom Node to be used in the animation.
     * @param {Array<number>} start 3D Array for RGB of start color.
     * @param {Array<number>} end 3D Array for RGB of end color.
     * @param {number} time Length of animation in milliseconds.
     * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
     */
    constructor(element: Element | null, start: Array<number>, end: Array<number>, time: number, opt_acc?: Function | undefined);
    /**
     * Animation event handler that will set the background-color of an element
     */
    setColor(): void;
}
/**
 * Provides a transformation of an elements color.
 *
 * @class
 * @extends {PredefinedEffect}
 */
export class ColorTransform extends PredefinedEffect {
    /**
     * Provides a transformation of an elements color.
     *
     * @param {?Element} element Dom Node to be used in the animation.
     * @param {Array<number>} start 3D Array representing R,G,B.
     * @param {Array<number>} end 3D Array representing R,G,B.
     * @param {number} time Length of animation in milliseconds.
     * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
     */
    constructor(element: Element | null, start: Array<number>, end: Array<number>, time: number, opt_acc?: Function | undefined);
}
/**
 * Creates an animation object that fades the opacity of an element between two
 * limits.
 *
 * Start and End should be floats between 0 and 1
 *
 * @extends {PredefinedEffect}
 * @class
 */
export class Fade extends PredefinedEffect {
    /**
     * Creates an animation object that fades the opacity of an element between two
     * limits.
     *
     * Start and End should be floats between 0 and 1
     *
     * @param {?Element} element Dom Node to be used in the animation.
     * @param {Array<number>|number} start 1D Array or Number with start opacity.
     * @param {Array<number>|number} end 1D Array or Number for end opacity.
     * @param {number} time Length of animation in milliseconds.
     * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
     */
    constructor(element: Element | null, start: Array<number> | number, end: Array<number> | number, time: number, opt_acc?: Function | undefined);
    /**
     * The last opacity we set, or -1 for not set.
     * @private {number}
     */
    private lastOpacityUpdate_;
    /**
     * Animation event handler that will show the element.
     */
    show(): void;
    /**
     * Animation event handler that will hide the element
     */
    hide(): void;
}
export namespace Fade {
    export const TOLERANCE_: number;
    export const OPACITY_UNSET_: number;
}
/**
 * Fades an element in from completely transparent to fully opacity.
 *
 * @extends {Fade}
 * @class
 */
export class FadeIn extends Fade {
    /**
     * Fades an element in from completely transparent to fully opacity.
     *
     * @param {?Element} element Dom Node to be used in the animation.
     * @param {number} time Length of animation in milliseconds.
     * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
     */
    constructor(element: Element | null, time: number, opt_acc?: Function | undefined);
}
/**
 * Sets an element's display to be visible and then fades an element in from
 * completely transparent to fully opaque.
 *
 * @extends {Fade}
 * @class
 */
export class FadeInAndShow extends Fade {
    /**
     * Sets an element's display to be visible and then fades an element in from
     * completely transparent to fully opaque.
     *
     * @param {?Element} element Dom Node to be used in the animation.
     * @param {number} time Length of animation in milliseconds.
     * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
     */
    constructor(element: Element | null, time: number, opt_acc?: Function | undefined);
}
/**
 * Fades an element out from full opacity to completely transparent.
 *
 * @extends {Fade}
 * @class
 */
export class FadeOut extends Fade {
    /**
     * Fades an element out from full opacity to completely transparent.
     *
     * @param {?Element} element Dom Node to be used in the animation.
     * @param {number} time Length of animation in milliseconds.
     * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
     */
    constructor(element: Element | null, time: number, opt_acc?: Function | undefined);
}
/**
 * Fades an element out from full opacity to completely transparent and then
 * sets the display to 'none'
 *
 * @extends {Fade}
 * @class
 */
export class FadeOutAndHide extends Fade {
    /**
     * Fades an element out from full opacity to completely transparent and then
     * sets the display to 'none'
     *
     * @param {?Element} element Dom Node to be used in the animation.
     * @param {number} time Length of animation in milliseconds.
     * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
     */
    constructor(element: Element | null, time: number, opt_acc?: Function | undefined);
}
/**
 * @fileoverview Predefined DHTML animations such as slide, resize and fade.
 *
 * @see ../demos/effects.html
 */
/**
 * Abstract class that provides reusable functionality for predefined animations
 * that manipulate a single DOM element
 *
 * @extends {Animation}
 * @class
 */
export class PredefinedEffect extends Animation {
    /**
     * Abstract class that provides reusable functionality for predefined animations
     * that manipulate a single DOM element
     *
     * @param {?Element} element Dom Node to be used in the animation.
     * @param {Array<number>} start Array for start coordinates.
     * @param {Array<number>} end Array for end coordinates.
     * @param {number} time Length of animation in milliseconds.
     * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
     */
    constructor(element: Element | null, start: Array<number>, end: Array<number>, time: number, opt_acc?: Function | undefined);
    /**
     * DOM Node that will be used in the animation
     * @type {?Element}
     */
    element: Element | null;
    /**
     * Called to update the style of the element.
     * @protected
     */
    protected updateStyle(): void;
    /**
     * Whether the DOM element being manipulated is rendered right-to-left.
     * @return {boolean} True if the DOM element is rendered right-to-left, false
     *     otherwise.
     */
    isRightToLeft(): boolean;
    rightToLeft_: boolean | undefined;
}
/**
 * Creates an animation object that will resize an element between two widths
 * and heights.
 *
 * Start and End should be 2 dimensional arrays
 *
 * @extends {PredefinedEffect}
 * @class
 */
export class Resize extends PredefinedEffect {
    /**
     * Creates an animation object that will resize an element between two widths
     * and heights.
     *
     * Start and End should be 2 dimensional arrays
     *
     * @param {?Element} element Dom Node to be used in the animation.
     * @param {Array<number>} start 2D array for start width and height.
     * @param {Array<number>} end 2D array for end width and height.
     * @param {number} time Length of animation in milliseconds.
     * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
     */
    constructor(element: Element | null, start: Array<number>, end: Array<number>, time: number, opt_acc?: Function | undefined);
}
/**
 * Creates an animation object that will resize an element between two heights
 *
 * Start and End should be numbers
 *
 * @extends {PredefinedEffect}
 * @class
 */
export class ResizeHeight extends PredefinedEffect {
    /**
     * Creates an animation object that will resize an element between two heights
     *
     * Start and End should be numbers
     *
     * @param {?Element} element Dom Node to be used in the animation.
     * @param {number} start Start height.
     * @param {number} end End height.
     * @param {number} time Length of animation in milliseconds.
     * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
     */
    constructor(element: Element | null, start: number, end: number, time: number, opt_acc?: Function | undefined);
}
/**
 * Creates an animation object that will resize an element between two widths
 *
 * Start and End should be numbers
 *
 * @extends {PredefinedEffect}
 * @class
 */
export class ResizeWidth extends PredefinedEffect {
    /**
     * Creates an animation object that will resize an element between two widths
     *
     * Start and End should be numbers
     *
     * @param {?Element} element Dom Node to be used in the animation.
     * @param {number} start Start width.
     * @param {number} end End width.
     * @param {number} time Length of animation in milliseconds.
     * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
     */
    constructor(element: Element | null, start: number, end: number, time: number, opt_acc?: Function | undefined);
}
/**
 * Creates an animation object that will scroll an element from A to B.
 *
 * Start and End should be 2 dimensional arrays
 *
 * @extends {PredefinedEffect}
 * @class
 */
export class Scroll extends PredefinedEffect {
    /**
     * Creates an animation object that will scroll an element from A to B.
     *
     * Start and End should be 2 dimensional arrays
     *
     * @param {?Element} element Dom Node to be used in the animation.
     * @param {Array<number>} start 2D array for start scroll left and top.
     * @param {Array<number>} end 2D array for end scroll left and top.
     * @param {number} time Length of animation in milliseconds.
     * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
     */
    constructor(element: Element | null, start: Array<number>, end: Array<number>, time: number, opt_acc?: Function | undefined);
}
/**
 * Creates an animation object that will slide an element from A to B.  (This
 * in effect automatically sets up the onanimate event for an Animation object)
 *
 * Start and End should be 2 dimensional arrays
 *
 * @extends {PredefinedEffect}
 * @class
 */
export class Slide extends PredefinedEffect {
    /**
     * Creates an animation object that will slide an element from A to B.  (This
     * in effect automatically sets up the onanimate event for an Animation object)
     *
     * Start and End should be 2 dimensional arrays
     *
     * @param {?Element} element Dom Node to be used in the animation.
     * @param {Array<number>} start 2D array for start coordinates (X, Y).
     * @param {Array<number>} end 2D array for end coordinates (X, Y).
     * @param {number} time Length of animation in milliseconds.
     * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
     */
    constructor(element: Element | null, start: Array<number>, end: Array<number>, time: number, opt_acc?: Function | undefined);
}
/**
 * Slides an element from its current position.
 *
 * @extends {Slide}
 * @class
 */
export class SlideFrom extends Slide {
    /**
     * Slides an element from its current position.
     *
     * @param {?Element} element DOM node to be used in the animation.
     * @param {Array<number>} end 2D array for end coordinates (X, Y).
     * @param {number} time Length of animation in milliseconds.
     * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
     */
    constructor(element: Element | null, end: Array<number>, time: number, opt_acc?: Function | undefined);
}
/**
 * Creates an animation object that will slide an element into its final size.
 * Requires that the element is absolutely positioned.
 *
 * @extends {PredefinedEffect}
 * @class
 */
export class Swipe extends PredefinedEffect {
    /**
     * Creates an animation object that will slide an element into its final size.
     * Requires that the element is absolutely positioned.
     *
     * @param {?Element} element Dom Node to be used in the animation.
     * @param {Array<number>} start 2D array for start size (W, H).
     * @param {Array<number>} end 2D array for end size (W, H).
     * @param {number} time Length of animation in milliseconds.
     * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
     */
    constructor(element: Element | null, start: Array<number>, end: Array<number>, time: number, opt_acc?: Function | undefined);
    /**
     * Maximum width for element.
     * @type {number}
     * @private
     */
    private maxWidth_;
    /**
     * Maximum height for element.
     * @type {number}
     * @private
     */
    private maxHeight_;
    /**
     * Helper function for setting element clipping.
     * @param {number} x Current element width.
     * @param {number} y Current element height.
     * @param {number} w Maximum element width.
     * @param {number} h Maximum element height.
     * @private
     */
    private clip_;
}
/**
 * Fade elements background color from start color to the element's current
 * background color.
 *
 * Start should be a 3D array representing R,G,B
 *
 * @param {?Element} element Dom Node to be used in the animation.
 * @param {Array<number>} start 3D Array for RGB of start color.
 * @param {number} time Length of animation in milliseconds.
 * @param {EventHandler=} opt_eventHandler Optional event handler
 *     to use when listening for events.
 */
export function bgColorFadeIn(element: Element | null, start: Array<number>, time: number, opt_eventHandler?: EventHandler | undefined): void;
import { Animation } from "./animation.js";
import { EventHandler } from "../events/eventhandler.js";
