/**
 * @license
 * Copyright The Closure Library Authors.
 * SPDX-License-Identifier: Apache-2.0
 */
/**
 * @fileoverview Basic animation controls.
 */
/**
 * An interface for programatically animated objects. I.e. rendered in
 * javascript frame by frame.
 *
 * @interface
 */
export class Animated {
    /**
     * Function called when a frame is requested for the animation.
     *
     * @param {number} now Current time in milliseconds.
     */
    onAnimationFrame(now: number): void;
}
/**
 * Default wait timeout for animations (in milliseconds).  Only used for timed
 * animation, which uses a timer (setTimeout) to schedule animation.
 *
 * @type {number}
 * @const
 */
export let TIMEOUT: number;
/**
 * Registers an animation to be cycled on the global timer.
 * @param {?Animated} animation The animation to register.
 */
export function registerAnimation(animation: Animated | null): void;
/**
 * Registers an animation window. This allows usage of the timing control API
 * for animations. Note that this window must be visible, as non-visible
 * windows can potentially stop animating. This window does not necessarily
 * need to be the window inside which animation occurs, but must remain visible.
 * See: https://developer.mozilla.org/en/DOM/window.mozRequestAnimationFrame.
 *
 * @param {?Window} animationWindow The window in which to animate elements.
 */
export function setAnimationWindow(animationWindow: Window | null): void;
/**
 * Tears down this module. Useful for testing.
 */
export function tearDown(): void;
/**
 * Removes an animation from the list of animations which are cycled on the
 * global timer.
 * @param {?Animated} animation The animation to unregister.
 */
export function unregisterAnimation(animation: Animated | null): void;
