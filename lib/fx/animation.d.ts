/**
 * Events fired by the animation.
 */
export type EventType = string;
/**
 * Enum for the possible states of an animation.
 */
export type State = number;
/**
 * @fileoverview Classes for doing animations and visual effects.
 *
 * (Based loosly on my animation code for 13thparallel.org, with extra
 * inspiration from the DojoToolkit's modifications to my code)
 */
/**
 * Constructor for an animation object.
 * @class
 * @implements {Animated}
 * @implements {Transition}
 * @extends {TransitionBase}
 */
export class Animation extends TransitionBase implements fx_anim.Animated, Transition {
    /**
     * @deprecated Use fx_anim.setAnimationWindow.
     * @param {?Window} animationWindow The window in which to animate elements.
     */
    static setAnimationWindow(animationWindow: Window | null): void;
    /**
     * Constructor for an animation object.
     * @param {Array<number>} start Array for start coordinates.
     * @param {Array<number>} end Array for end coordinates.
     * @param {number} duration Length of animation in milliseconds.
     * @param {Function=} opt_acc Acceleration function, returns 0-1 for inputs 0-1.
     */
    constructor(start: Array<number>, end: Array<number>, duration: number, opt_acc?: Function | undefined);
    /**
     * Start point.
     * @type {Array<number>}
     * @protected
     */
    protected startPoint: Array<number>;
    /**
     * End point.
     * @type {Array<number>}
     * @protected
     */
    protected endPoint: Array<number>;
    /**
     * Duration of animation in milliseconds.
     * @type {number}
     * @protected
     */
    protected duration: number;
    /**
     * Acceleration function, which must return a number between 0 and 1 for
     * inputs between 0 and 1.
     * @type {Function|undefined}
     * @private
     */
    private accel_;
    /**
     * Current coordinate for animation.
     * @type {Array<number>}
     * @protected
     */
    protected coords: Array<number>;
    /**
     * Whether the animation should use "right" rather than "left" to position
     * elements in RTL.  This is a temporary flag to allow clients to transition
     * to the new behavior at their convenience.  At some point it will be the
     * default.
     * @type {boolean}
     * @private
     */
    private useRightPositioningForRtl_;
    /**
     * Current frame rate.
     * @private {number}
     */
    private fps_;
    /**
     * Percent of the way through the animation.
     * @protected {number}
     */
    protected progress: any;
    /**
     * Timestamp for when last frame was run.
     * @protected {?number}
     */
    protected lastFrame: any;
    /**
     * @return {number} The duration of this animation in milliseconds.
     */
    getDuration(): number;
    /**
     * Sets whether the animation should use "right" rather than "left" to position
     * elements.  This is a temporary flag to allow clients to transition
     * to the new component at their convenience.  At some point "right" will be
     * used for RTL elements by default.
     * @param {boolean} useRightPositioningForRtl True if "right" should be used for
     *     positioning, false if "left" should be used for positioning.
     */
    enableRightPositioningForRtl(useRightPositioningForRtl: boolean): void;
    /**
     * Whether the animation should use "right" rather than "left" to position
     * elements.  This is a temporary flag to allow clients to transition
     * to the new component at their convenience.  At some point "right" will be
     * used for RTL elements by default.
     * @return {boolean} True if "right" should be used for positioning, false if
     *     "left" should be used for positioning.
     */
    isRightPositioningForRtlEnabled(): boolean;
    /**
     * @return {number} The current progress of the animation, the number
     *     is between 0 and 1 inclusive.
     */
    getProgress(): number;
    /**
     * Sets the progress of the animation.
     * @param {number} progress The new progress of the animation.
     */
    setProgress(progress: number): void;
    /**
     * Stops an animation, fires a 'destroy' event and then removes all the event
     * handlers to clean up memory.
     * @deprecated Use dispose() instead.
     */
    destroy(): void;
    /** @override */
    onAnimationFrame(now: any): void;
    /**
     * Handles the actual iteration of the animation in a timeout
     * @param {number} now The current time.
     */
    cycle(now: number): void;
    /**
     * Calculates current coordinates, based on the current state.  Applies
     * the acceleration function if it exists.
     * @param {number} t Percentage of the way through the animation as a decimal.
     * @private
     */
    private updateCoords_;
    /**
     * Dispatches the ANIMATE event. Sub classes should override this instead
     * of listening to the event.
     * @protected
     */
    protected onAnimate(): void;
    /**
     * Dispatches the DESTROY event. Sub classes should override this instead
     * of listening to the event.
     * @protected
     */
    protected onDestroy(): void;
}
export namespace Animation {
    export const TIMEOUT: number;
}
/**
 * Class for an animation event object.
 * @class
 * @extends {EventsEvent}
 */
export class AnimationEvent extends EventsEvent {
    /**
     * Class for an animation event object.
     * @param {string} type Event type.
     * @param {?Animation} anim An animation object.
     */
    constructor(type: string, anim: Animation | null);
    /**
     * The current coordinates.
     * @type {Array<number>}
     */
    coords: Array<number>;
    /**
     * The x coordinate.
     * @type {number}
     */
    x: number;
    /**
     * The y coordinate.
     * @type {number}
     */
    y: number;
    /**
     * The z coordinate.
     * @type {number}
     */
    z: number;
    /**
     * The current duration.
     * @type {number}
     */
    duration: number;
    /**
     * The current progress.
     * @type {number}
     */
    progress: number;
    /**
     * Frames per second so far.
     */
    fps: number;
    /**
     * The state of the animation.
     * @type {number}
     */
    state: number;
    /**
     * The animation object.
     * @type {?Animation}
     */
    anim: Animation | null;
    /**
     * Returns the coordinates as integers (rounded to nearest integer).
     * @return {!Array<number>} An array of the coordinates rounded to
     *     the nearest integer.
     */
    coordsAsInts(): Array<number>;
}
export namespace EventType {
    export const PLAY: any;
    export const BEGIN: any;
    export const RESUME: any;
    export const END: any;
    export const STOP: any;
    export const FINISH: any;
    export const PAUSE: any;
    export const ANIMATE: string;
    export const DESTROY: string;
}
/**
 * Enum for the possible states of an animation.
 * @deprecated Use Transition.State instead.
 * @enum {number}
 */
export let State: any;
import { TransitionBase } from "./transitionbase.js";
import * as fx_anim from "./anim/anim.js";
import { Transition } from "./transition.js";
import { Event as EventsEvent } from "../events/event.js";
