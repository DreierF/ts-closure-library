/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview An abstract base class for transitions. This is a simple
 * interface that allows for playing, pausing and stopping an animation. It adds
 * a simple event model, and animation status.
 */
/**
 * Constructor for a transition object.
 *
 * @class
 * @implements {FxTransition}
 * @extends {EventsEventTarget}
 * @suppress {checkTypes}
 * @abstract
 */
export class TransitionBase extends EventsEventTarget implements FxTransition {
    /**
     * The internal state of the animation.
     * @type {TransitionBase.State}
     * @private
     */
    private state_;
    /**
     * Timestamp for when the animation was started.
     * @type {?number}
     * @protected
     */
    protected startTime: number | null;
    /**
     * Timestamp for when the animation finished or was stopped.
     * @type {?number}
     * @protected
     */
    protected endTime: number | null;
    /**
     * Plays the animation.
     *
     * @param {boolean=} opt_restart Optional parameter to restart the animation.
     * @return {boolean} True iff the animation was started.
     * @override
     * @abstract
     */
    play(opt_restart?: boolean | undefined): boolean;
    /**
     * Stops the animation.
     *
     * @param {boolean=} opt_gotoEnd Optional boolean parameter to go the end of
     *     the animation.
     * @override
     * @abstract
     */
    stop(opt_gotoEnd?: boolean | undefined): void;
    /**
     * Pauses the animation.
     * @abstract
     */
    pause(): void;
    /**
     * Returns the current state of the animation.
     * @return {TransitionBase.State} State of the animation.
     */
    getStateInternal(): TransitionBase.State;
    /**
     * Sets the current state of the animation to playing.
     * @protected
     */
    protected setStatePlaying(): void;
    /**
     * Sets the current state of the animation to paused.
     * @protected
     */
    protected setStatePaused(): void;
    /**
     * Sets the current state of the animation to stopped.
     * @protected
     */
    protected setStateStopped(): void;
    /**
     * @return {boolean} True iff the current state of the animation is playing.
     */
    isPlaying(): boolean;
    /**
     * @return {boolean} True iff the current state of the animation is paused.
     */
    isPaused(): boolean;
    /**
     * @return {boolean} True iff the current state of the animation is stopped.
     */
    isStopped(): boolean;
    /**
     * Dispatches the BEGIN event. Sub classes should override this instead
     * of listening to the event, and call this instead of dispatching the event.
     * @protected
     */
    protected onBegin(): void;
    /**
     * Dispatches the END event. Sub classes should override this instead
     * of listening to the event, and call this instead of dispatching the event.
     * @protected
     */
    protected onEnd(): void;
    /**
     * Dispatches the FINISH event. Sub classes should override this instead
     * of listening to the event, and call this instead of dispatching the event.
     * @protected
     */
    protected onFinish(): void;
    /**
     * Dispatches the PAUSE event. Sub classes should override this instead
     * of listening to the event, and call this instead of dispatching the event.
     * @protected
     */
    protected onPause(): void;
    /**
     * Dispatches the PLAY event. Sub classes should override this instead
     * of listening to the event, and call this instead of dispatching the event.
     * @protected
     */
    protected onPlay(): void;
    /**
     * Dispatches the RESUME event. Sub classes should override this instead
     * of listening to the event, and call this instead of dispatching the event.
     * @protected
     */
    protected onResume(): void;
    /**
     * Dispatches the STOP event. Sub classes should override this instead
     * of listening to the event, and call this instead of dispatching the event.
     * @protected
     */
    protected onStop(): void;
    /**
     * Dispatches an event object for the current animation.
     * @param {string} type Event type that will be dispatched.
     * @protected
     */
    protected dispatchAnimationEvent(type: string): void;
}
export namespace TransitionBase {
    namespace State {
        const STOPPED: number;
        const PAUSED: number;
        const PLAYING: number;
    }
    /**
     * Enum for the possible states of an animation.
     */
    type State = number;
}
import { Transition as FxTransition } from "./transition.js";
import { EventTarget as EventsEventTarget } from "../events/eventhandler.js";
