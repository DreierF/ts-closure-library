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
     * @param {?Element|string|null} header Header element, either element
     *     reference, string id or null if no header exists.
     * @param {?Element|string} content Content element, either element reference or
     *     string id.
     * @param {boolean=} opt_expanded Initial expanded/visibility state. Defaults to
     *     false.
     * @param {DomHelper=} opt_domHelper An optional DOM helper.
     * @param {Role<string>=} opt_role ARIA role, default TAB.
     */
    constructor(header: (Element | string | null) | null, content: (Element | string) | null, opt_expanded?: boolean | undefined, opt_domHelper?: DomHelper | undefined, opt_role?: Role<string> | undefined);
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
    private elWrapper_;
    /**
     * Reference to animation or null if animation is not active.
     * @type {?Animation}
     * @private
     */
    private anim_;
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
    private onAnimate_;
    /**
     * Called once the expand/collapse animation has started.
     *
     * @param {boolean} expanding Expanded/visibility state.
     * @private
     */
    private onAnimationBegin_;
    /**
     * Called once the expand/collapse animation has completed.
     *
     * @param {boolean} expanded Expanded/visibility state.
     * @private
     */
    private onAnimationCompleted_;
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
import { DomHelper } from "../dom/dom.js";
import { Role } from "../a11y/aria/roles.js";
