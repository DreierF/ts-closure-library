/**
 * @fileoverview Static utility methods for UI components.
 */
/**
 * @param {!Component} component
 * @return {!MouseEvents} The browser events that should be listened
 *     to for the given mouse events.
 */
export function getMouseEventType(component: Component): MouseEvents;
import { Component } from "./component.js";
import { MouseEvents } from "../events/eventtype.js";
