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
    private finishedCounter_;
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
    protected queue: Array<TransitionBase>;
    /**
     * Pushes an Animation to the end of the queue.
     * @param {?TransitionBase} animation The animation to add to the queue.
     */
    add(animation: TransitionBase | null): void;
    /**
     * Removes an Animation from the queue.
     * @param {?FxAnimation} animation The animation to remove.
     */
    remove(animation: FxAnimation | null): void;
    /**
     * Handles the event that an animation has finished.
     * @param {?EventsEvent} e The finishing event.
     * @protected
     * @abstract
     */
    protected onAnimationFinish(e: EventsEvent | null): void;
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
    private current_;
}
import { TransitionBase } from "./transitionbase.js";
import { Animation as FxAnimation } from "./animation.js";
import { Event as EventsEvent } from "../events/event.js";
