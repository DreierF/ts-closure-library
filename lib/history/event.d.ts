export { history_Event as Event };
/**
 * @fileoverview The event object dispatched when the history changes.
 */
/**
 * Event object dispatched after the history state has changed.
 *     action, such as forward or back, clicking on a link, editing the URL, or
 *     calling {@code window.history.(go|back|forward)}.
 *     False if the token has been changed by a `setToken` or
 *     `replaceToken` call.
 * @extends {EventsEvent}
 * @final
 */
declare class history_Event extends EventsEvent {
    /**
     * Event object dispatched after the history state has changed.
     * @param {string} token The string identifying the new history state.
     * @param {boolean} isNavigation True if the event was triggered by a browser
     *     action, such as forward or back, clicking on a link, editing the URL, or
     *     calling {@code window.history.(go|back|forward)}.
     *     False if the token has been changed by a `setToken` or
     *     `replaceToken` call.
     */
    constructor(token: string, isNavigation: boolean);
    /**
     * The current history state.
     * @type {string}
     */
    token: string;
    /**
     * Whether the event was triggered by browser navigation.
     * @type {boolean}
     */
    isNavigation: boolean;
}
import { Event as EventsEvent } from "../events/event.js";
