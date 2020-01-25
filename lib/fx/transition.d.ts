/**
 * Transition event types.
 */
export type EventType = string;
export namespace EventType {
    export const PLAY: string;
    export const BEGIN: string;
    export const RESUME: string;
    export const END: string;
    export const STOP: string;
    export const FINISH: string;
    export const PAUSE: string;
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
