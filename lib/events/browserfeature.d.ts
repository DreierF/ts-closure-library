/**
 * Enum of browser capabilities.
 */
export type BrowserFeature = boolean;
export namespace BrowserFeature {
    const HAS_W3C_BUTTON: boolean;
    const HAS_W3C_EVENT_SUPPORT: boolean;
    const SET_KEY_CODE_TO_PREVENT_DEFAULT: boolean;
    const HAS_NAVIGATOR_ONLINE_PROPERTY: boolean;
    const HAS_HTML5_NETWORK_EVENT_SUPPORT: boolean;
    const HTML5_NETWORK_EVENTS_FIRE_ON_BODY: boolean;
    const TOUCH_ENABLED: boolean;
    const POINTER_EVENTS: boolean;
    const MSPOINTER_EVENTS: boolean;
    const PASSIVE_EVENTS: boolean;
}
