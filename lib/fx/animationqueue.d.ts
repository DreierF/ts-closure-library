/**
 * Constructor for AnimationParallelQueue object.
 * @class
 * @extends {AnimationQueue}
 */
export class AnimationParallelQueue extends AnimationQueue {
    /**
     * Number of finished animations.
     * @type {number}
     * @private
     */
    finishedCounter_: number;
    /**
     * @override
     * @suppress {checkTypes}
     */
    play(opt_restart?: any): boolean;
    /** @override */
    stop(opt_gotoEnd?: any): void;
    /** @override */
    onAnimationFinish(e: any): void;
    actualEventTarget_: AnimationParallelQueue;
}
/**
 * @fileoverview A class which automatically plays through a queue of
 * animations.  AnimationParallelQueue and AnimationSerialQueue provide
 * specific implementations of the abstract class AnimationQueue.
 *
 * @see ../demos/animationqueue.html
 */
/**
 * Constructor for AnimationQueue object.
 *
 * @class
 * @extends {TransitionBase}
 * @abstract
 */
export class AnimationQueue extends TransitionBase {
    /**
     * An array holding all animations in the queue.
     * @type {Array<TransitionBase>}
     * @protected
     */
    queue: Array<TransitionBase>;
    /**
     * Pushes an Animation to the end of the queue.
     * @param {?TransitionBase} animation The animation to add to the queue.
     */
    add(animation: TransitionBase): void;
    /**
     * Removes an Animation from the queue.
     * @param {?FxAnimation} animation The animation to remove.
     */
    remove(animation: FxAnimation): void;
    /**
     * Handles the event that an animation has finished.
     * @param {?EventsEvent} e The finishing event.
     * @protected
     * @abstract
     */
    onAnimationFinish(e: EventsEvent): void;
    actualEventTarget_: AnimationQueue;
}
/**
 * Constructor for AnimationSerialQueue object.
 * @class
 * @extends {AnimationQueue}
 */
export class AnimationSerialQueue extends AnimationQueue {
    /**
     * Current animation in queue currently active.
     * @type {number}
     * @private
     */
    current_: number;
    /**
     * @override
     * @suppress {checkTypes}
     */
    play(opt_restart?: any): boolean;
    /** @override */
    stop(opt_gotoEnd?: any): void;
    /** @override */
    onAnimationFinish(e: any): void;
    actualEventTarget_: AnimationSerialQueue;
}
import { TransitionBase } from "./transitionbase.js";
import { Animation as FxAnimation } from "./animation.js";
import { Event as EventsEvent } from "../events/event.js";
