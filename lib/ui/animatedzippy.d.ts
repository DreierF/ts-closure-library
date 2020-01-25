/**
 * @fileoverview Animated zippy widget implementation.
 *
 * @see ../demos/zippy.html
 */
/**
 * Zippy widget. Expandable/collapsible container, clicking the header toggles
 * the visibility of the content.
 *
 *     reference, string id or null if no header exists.
 *     string id.
 *     false.
 * @extends {Zippy}
 */
export class AnimatedZippy extends Zippy {
    /**
     * Zippy widget. Expandable/collapsible container, clicking the header toggles
     * the visibility of the content.
     *
     * @param {Element|string|null} header Header element, either element
     *     reference, string id or null if no header exists.
     * @param {Element|string} content Content element, either element reference or
     *     string id.
     * @param {boolean=} opt_expanded Initial expanded/visibility state. Defaults to
     *     false.
     * @param {DomHelper=} opt_domHelper An optional DOM helper.
     * @param {Role<string>=} opt_role ARIA role, default TAB.
     */
    constructor(header: string | Element, content: string | Element, opt_expanded?: boolean, opt_domHelper?: googdom.DomHelper, opt_role?: any);
    /**
     * Duration of expand/collapse animation, in milliseconds.
     * @type {number}
     */
    animationDuration: number;
    /**
     * Acceleration function for expand/collapse animation.
     * @type {!Function}
     */
    animationAcceleration: Function;
    /**
     * Content wrapper, used for animation.
     * @type {?Element}
     * @private
     */
    elWrapper_: Element | null;
    /**
     * Reference to animation or null if animation is not active.
     * @type {?Animation}
     * @private
     */
    anim_: Animation | null;
    /**
     * @return {boolean} Whether the zippy is in the process of being expanded or
     *     collapsed.
     */
    isBusy(): boolean;
    /**
     * Called during animation
     *
     * @param {?EventsEvent} e The event.
     * @private
     */
    onAnimate_(e: EventsEvent): void;
    /**
     * Called once the expand/collapse animation has started.
     *
     * @param {boolean} expanding Expanded/visibility state.
     * @private
     */
    onAnimationBegin_(expanding: boolean): void;
    /**
     * Called once the expand/collapse animation has completed.
     *
     * @param {boolean} expanded Expanded/visibility state.
     * @private
     */
    onAnimationCompleted_(expanded: boolean): void;
    actualEventTarget_: AnimatedZippy;
}
export namespace AnimatedZippy {
    export namespace Events {
        export const TOGGLE_ANIMATION_BEGIN: string;
        export const TOGGLE_ANIMATION_END: string;
    }
    /**
     * Constants for event names.
     */
    export type Events = string;
}
import { Zippy } from "./zippy.js";
import { Animation } from "../fx/animation.js";
import { Event as EventsEvent } from "../events/event.js";
import * as googdom from "../dom/dom.js";
