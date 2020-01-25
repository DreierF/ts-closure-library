/**
 * @fileoverview Static utility methods for UI components.
 */
/**
 * @param {!Component} component
 * @return {!MouseEvents} The browser events that should be listened
 *     to for the given mouse events.
 */
export function getMouseEventType(component: Component): {
    MOUSEDOWN: string;
    MOUSEUP: string;
    MOUSECANCEL: string;
    MOUSEMOVE: string;
    MOUSEOVER: string;
    MOUSEOUT: string;
    MOUSEENTER: string;
    MOUSELEAVE: string;
};
import { Component } from "./component.js";
