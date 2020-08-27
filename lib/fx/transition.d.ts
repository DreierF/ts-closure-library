/**
 * Transition event types.
 */
export type EventType = string;
export namespace EventType {
    const PLAY: string;
    const BEGIN: string;
    const RESUME: string;
    const END: string;
    const STOP: string;
    const FINISH: string;
    const PAUSE: string;
}
/**
 * @fileoverview An interface for transition animation. This is a simple
 * interface that allows for playing and stopping a transition. It adds
 * a simple event model with BEGIN and END event.
 */
/**
 * An interface for programmatic transition. Must extend
 * `goog.events.EventTarget`.
 * @interface
 */
export class Transition {
    /**
     * Plays the transition.
     */
    play(): void;
    /**
     * Stops the transition.
     */
    stop(): void;
}
