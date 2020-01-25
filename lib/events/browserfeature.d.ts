/**
 * Enum of browser capabilities.
 */
export type BrowserFeature = boolean;
export namespace BrowserFeature {
    export const HAS_W3C_BUTTON: boolean;
    export const HAS_W3C_EVENT_SUPPORT: boolean;
    export const SET_KEY_CODE_TO_PREVENT_DEFAULT: boolean;
    export const HAS_NAVIGATOR_ONLINE_PROPERTY: boolean;
    export const HAS_HTML5_NETWORK_EVENT_SUPPORT: boolean;
    export const HTML5_NETWORK_EVENTS_FIRE_ON_BODY: boolean;
    export const TOUCH_ENABLED: boolean;
    export const POINTER_EVENTS: boolean;
    export const MSPOINTER_EVENTS: boolean;
    export const PASSIVE_EVENTS: boolean;
}
